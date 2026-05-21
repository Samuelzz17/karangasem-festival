"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getStatusActions, orderStatusLabels } from "../lib/admin-workflow";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const statusActionLabels = {
  payment_review: "Review",
  paid: "Mark Paid",
  processing: "Process",
  shipped: "Ship",
  completed: "Complete",
  cancelled: "Reopen",
};

function formatMoney(value) {
  return currency.format(value || 0);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function emptyProductForm() {
  return {
    id: "",
    name: "",
    price: "",
    stock: "",
    type: "",
    tag: "",
    accent1: "#2d314f",
    accent2: "#f3b36a",
    variants: "Default",
    description: "",
    imageData: "",
    imageName: "",
  };
}

export default function AdminDashboard({ initialProducts, initialOrders, initialMetrics }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts || []);
  const [orders, setOrders] = useState(initialOrders || []);
  const [metrics, setMetrics] = useState(initialMetrics || {});
  const [productForm, setProductForm] = useState(emptyProductForm());
  const [editingId, setEditingId] = useState("");
  const [productPreview, setProductPreview] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [filters, setFilters] = useState({ status: "", query: "" });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filters.status && order.status !== filters.status) return false;
      if (filters.query) {
        const query = filters.query.toLowerCase();
        return (
          order.id.toLowerCase().includes(query) ||
          order.buyerName.toLowerCase().includes(query) ||
          order.whatsapp.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [orders, filters]);

  async function refreshData() {
    const [productPayload, orderPayload] = await Promise.all([
      fetch("/api/admin/products", { cache: "no-store" }).then((res) => res.json()),
      fetch("/api/admin/orders", { cache: "no-store" }).then((res) => res.json()),
    ]);

    if (productPayload.products) setProducts(productPayload.products);
    if (orderPayload.orders) setOrders(orderPayload.orders);
    if (orderPayload.metrics) setMetrics(orderPayload.metrics);
  }

  function beginEdit(product) {
    setEditingId(product.id);
    setProductForm({
      id: product.id,
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      type: product.type,
      tag: product.tag,
      accent1: product.accent1,
      accent2: product.accent2,
      variants: product.variants.join(", "),
      description: product.description,
      imageData: product.imageData || "",
      imageName: product.imageName || "",
    });
    setProductPreview(product.imageData || "");
  }

  function resetProductForm() {
    setEditingId("");
    setProductForm(emptyProductForm());
    setProductPreview("");
  }

  async function handleProductImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setProductPreview(dataUrl);
    setProductForm((current) => ({
      ...current,
      imageData: dataUrl,
      imageName: file.name,
    }));
  }

  async function handleProductSave(event) {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        variants: String(productForm.variants)
          .split(",")
          .map((variant) => variant.trim())
          .filter(Boolean),
      };

      const response = await fetch(
        editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menyimpan produk.");

      setStatus(`Produk ${data.product.name} tersimpan.`);
      resetProductForm();
      await refreshData();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteProduct(productId) {
    if (!confirm("Hapus produk ini?")) return;
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    await refreshData();
  }

  async function updateOrderStatus(orderId, status) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await refreshData();
  }

  async function removeOrder(orderId) {
    if (!confirm("Hapus order ini?")) return;
    await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
    await refreshData();
  }

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const totalRevenue = metrics.totalRevenue || 0;

  return (
    <section className="page admin-dashboard">
      <header className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Admin</span>
            <h1 className="admin-title">Dashboard rekap merchandise</h1>
            <p className="lead">
              Dashboard ini terhubung ke Firebase Auth, Firestore, dan workflow order yang bisa
              digerakkan dari sini.
            </p>
          </div>
          <div className="section-actions">
            <button className="btn btn-secondary" onClick={refreshData}>
              Refresh
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-stats">
        <article className="admin-card">
          <h3>Total revenue</h3>
          <p className="admin-value">{formatMoney(totalRevenue)}</p>
        </article>
        <article className="admin-card">
          <h3>Total orders</h3>
          <p className="admin-value">{metrics.totalOrders || 0}</p>
        </article>
        <article className="admin-card">
          <h3>Total customers</h3>
          <p className="admin-value">{metrics.totalCustomers || 0}</p>
        </article>
        <article className="admin-card">
          <h3>Average order</h3>
          <p className="admin-value">{formatMoney(metrics.averageOrder || 0)}</p>
        </article>
      </div>

      <section className="admin-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">Product Management</h2>
            <p className="section-copy">CRUD produk penuh dengan upload gambar langsung dari admin.</p>
          </div>
        </div>

        <div className="product-admin-layout">
          <form className="product-form" onSubmit={handleProductSave}>
            <div className="field">
              <label htmlFor="p-name">Nama produk</label>
              <input id="p-name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
            </div>
            <div className="product-form-grid">
              <div className="field">
                <label htmlFor="p-price">Harga</label>
                <input id="p-price" type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="p-stock">Stok</label>
                <input id="p-stock" type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required />
              </div>
            </div>
            <div className="product-form-grid">
              <div className="field">
                <label htmlFor="p-type">Tipe</label>
                <input id="p-type" value={productForm.type} onChange={(e) => setProductForm({ ...productForm, type: e.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="p-tag">Tag</label>
                <input id="p-tag" value={productForm.tag} onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })} required />
              </div>
            </div>
            <div className="product-form-grid">
              <div className="field">
                <label htmlFor="p-a1">Accent 1</label>
                <input id="p-a1" type="color" value={productForm.accent1} onChange={(e) => setProductForm({ ...productForm, accent1: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="p-a2">Accent 2</label>
                <input id="p-a2" type="color" value={productForm.accent2} onChange={(e) => setProductForm({ ...productForm, accent2: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="p-variants">Variants</label>
              <input id="p-variants" value={productForm.variants} onChange={(e) => setProductForm({ ...productForm, variants: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="p-desc">Description</label>
              <textarea id="p-desc" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="p-image">Upload gambar produk</label>
              <input id="p-image" type="file" accept="image/*" onChange={handleProductImage} />
            </div>
            {productPreview ? (
              <div className="proof-preview">
                <img alt="Preview produk" src={productPreview} />
              </div>
            ) : null}
            <div className="section-actions">
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? "Saving..." : editingId ? "Update Product" : "Create Product"}
              </button>
              {editingId ? (
                <button className="btn btn-secondary" type="button" onClick={resetProductForm}>
                  Cancel
                </button>
              ) : null}
            </div>
            {status ? <div className="help">{status}</div> : null}
          </form>

          <div className="product-admin-list-wrap">
            <div className="section-header">
              <div>
                <h3 className="section-title">Existing Products</h3>
                <p className="section-copy">Klik edit untuk ubah produk atau delete untuk menghapus.</p>
              </div>
            </div>
            <div className="product-admin-grid">
              {products.map((product) => (
                <article className="product-admin-card" key={product.id}>
                  <div
                    className="product-admin-visual"
                    style={{
                      backgroundImage: product.imageData
                        ? `url('${product.imageData}')`
                        : `linear-gradient(135deg, ${product.accent1}, ${product.accent2})`,
                    }}
                  />
                  <div className="product-admin-body">
                    <div className="product-admin-top">
                      <div>
                        <strong>{product.name}</strong>
                        <span>{product.type}</span>
                      </div>
                      <span className="pill">{formatMoney(product.price)}</span>
                    </div>
                    <div className="product-admin-meta">
                      <span className="pill">{product.stock} stok</span>
                      <span className="pill">{product.tag}</span>
                    </div>
                    <div className="section-actions">
                      <button className="btn btn-secondary" type="button" onClick={() => beginEdit(product)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" type="button" onClick={() => handleDeleteProduct(product.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">Order management</h2>
            <p className="section-copy">Workflow penuh dari payment review sampai completed.</p>
          </div>
          <div className="section-actions">
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All status</option>
              {Object.entries(orderStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              placeholder="Search order/customer"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Workflow</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const actions = getStatusActions(order.status);
                return (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>
                      <strong>{order.buyerName}</strong>
                      <div className="help">{order.whatsapp}</div>
                    </td>
                    <td>{formatMoney(order.total)}</td>
                    <td>
                      <span className={`status status-${order.status}`}>{orderStatusLabels[order.status] || order.status}</span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <div className="section-actions">
                        {actions.map((nextStatus) => (
                          <button
                            key={nextStatus}
                            className="btn btn-secondary"
                            type="button"
                            onClick={() => updateOrderStatus(order.id, nextStatus)}
                          >
                            {statusActionLabels[nextStatus] || nextStatus}
                          </button>
                        ))}
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => removeOrder(order.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
