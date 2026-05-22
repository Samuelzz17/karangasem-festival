import { admin, getFirestore } from "./firebase-admin";
import { defaultProducts, normalizeProduct, normalizeProducts } from "./catalog";

const db = () => getFirestore();

function productRef(id) {
  return db().collection("products").doc(id);
}

function orderRef(id) {
  return db().collection("orders").doc(id);
}

function collectionToPlain(snapshot) {
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...serializeFirestoreValue(doc.data()),
  }));
}

function serializeFirestoreValue(value) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((item) => serializeFirestoreValue(item));
  if (typeof value === "object") {
    if (typeof value.toDate === "function") {
      return value.toDate().toISOString();
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, serializeFirestoreValue(nested)]),
    );
  }

  return value;
}

export async function seedProductsIfNeeded() {
  const snapshot = await db().collection("products").limit(1).get();
  if (!snapshot.empty) return;

  const batch = db().batch();
  normalizeProducts(defaultProducts).forEach((product) => {
    batch.set(productRef(product.id), {
      ...product,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();
}

export async function listProducts() {
  await seedProductsIfNeeded();
  const snapshot = await db().collection("products").orderBy("createdAt", "desc").get();
  return collectionToPlain(snapshot);
}

export async function getProduct(id) {
  const snap = await productRef(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...serializeFirestoreValue(snap.data()) };
}

export async function createProduct(data) {
  const product = normalizeProduct(data);
  const payload = {
    ...product,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await productRef(product.id).set(payload, { merge: true });
  return product;
}

export async function updateProduct(id, data) {
  const existing = await getProduct(id);
  if (!existing) return null;

  const product = normalizeProduct({ ...existing, ...data, id });
  await productRef(id).set(
    {
      ...product,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: existing.createdAt || admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  return product;
}

export async function deleteProduct(id) {
  await productRef(id).delete();
}

export async function listOrders() {
  const snapshot = await db().collection("orders").orderBy("createdAt", "desc").get();
  return collectionToPlain(snapshot);
}

export async function getOrder(id) {
  const snap = await orderRef(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...serializeFirestoreValue(snap.data()) };
}

export async function createOrder({ buyerName, whatsapp, note, proofData, proofName, proofType, items }) {
  const normalizedItems = Array.isArray(items)
    ? items.map((item) => ({
        id: item.id,
        name: item.name,
        variant: item.variant || "Default",
        qty: Math.max(1, Math.floor(Number(item.qty || 1))),
        price: Math.max(0, Math.round(Number(item.price || 0))),
      }))
    : [];

  if (!normalizedItems.length) {
    throw new Error("Cart is empty");
  }

  const orderId = `KF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const orderDocRef = orderRef(orderId);

  await db().runTransaction(async (tx) => {
    const productsRefs = normalizedItems.map((item) => productRef(item.id));
    const productSnaps = await Promise.all(productsRefs.map((ref) => tx.get(ref)));

    const snapshotMap = new Map();
    productSnaps.forEach((snap) => {
      if (snap.exists) {
        snapshotMap.set(snap.id, { id: snap.id, ...snap.data() });
      }
    });

    for (const item of normalizedItems) {
      const product = snapshotMap.get(item.id);
      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }
      if (product.stock < item.qty) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }

    for (const item of normalizedItems) {
      const product = snapshotMap.get(item.id);
      tx.update(productRef(item.id), {
        stock: product.stock - item.qty,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const resolvedItems = normalizedItems.map((item) => {
      const product = snapshotMap.get(item.id);
      return {
        ...item,
        name: product.name,
        price: product.price,
      };
    });

    const total = resolvedItems.reduce((sum, item) => sum + item.qty * item.price, 0);

    tx.set(orderDocRef, {
      buyerName,
      whatsapp,
      note,
      items: resolvedItems,
      total,
      proofData,
      proofName,
      proofType,
      status: "payment_review",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return { id: orderId };
}

export async function updateOrderStatus(id, status) {
  await orderRef(id).set(
    {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export async function deleteOrder(id) {
  await orderRef(id).delete();
}

export async function buildAdminMetrics(orders, products) {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalCustomers = new Set(orders.map((order) => `${order.buyerName}::${order.whatsapp}`)).size;
  const averageOrder = orders.length ? totalRevenue / orders.length : 0;
  const verifiedOrders = orders.filter(
    (order) => order.status !== "payment_review" && order.status !== "cancelled",
  ).length;
  const lowStock = products.filter((product) => Number(product.stock || 0) <= 12).length;

  return {
    totalRevenue,
    totalOrders: orders.length,
    totalCustomers,
    averageOrder,
    verifiedOrders,
    lowStock,
  };
}
