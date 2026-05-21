export const defaultProducts = [
  {
    id: "tee-archipelago",
    name: "Archipelago Tee",
    price: 189000,
    stock: 64,
    type: "Apparel",
    tag: "Limited drop",
    accent1: "#2d314f",
    accent2: "#f3b36a",
    variants: ["S", "M", "L", "XL"],
    description:
      "Kaos dengan ilustrasi ombak, gunung, dan siluet panggung festival. Nyaman dipakai untuk hari panas dan malam konser.",
    imageData: "",
    imageName: "",
  },
  {
    id: "hoodie-sunset",
    name: "Sunset Hoodie",
    price: 349000,
    stock: 28,
    type: "Apparel",
    tag: "Warm edition",
    accent1: "#7f4b3d",
    accent2: "#ffb46a",
    variants: ["M", "L", "XL", "XXL"],
    description:
      "Hoodie heavy-weight dengan tone sunset Karangasem. Cocok buat penonton yang stay sampai encore.",
    imageData: "",
    imageName: "",
  },
  {
    id: "cap-stage",
    name: "Stage Cap",
    price: 129000,
    stock: 42,
    type: "Accessories",
    tag: "Easy fit",
    accent1: "#243e52",
    accent2: "#7dd3fc",
    variants: ["Default"],
    description:
      "Topi minimal dengan bordir Karangasem Festival. Ringan, clean, dan pas untuk aktivitas outdoor.",
    imageData: "",
    imageName: "",
  },
  {
    id: "tote-bloom",
    name: "Bloom Tote",
    price: 99000,
    stock: 56,
    type: "Daily carry",
    tag: "Eco bag",
    accent1: "#245446",
    accent2: "#7ee2b8",
    variants: ["Default"],
    description:
      "Tote bag yang cukup besar untuk air mineral, katalog acara, dan belanja kecil selama festival.",
    imageData: "",
    imageName: "",
  },
  {
    id: "poster-collector",
    name: "Collector Poster",
    price: 85000,
    stock: 18,
    type: "Print",
    tag: "A2 print",
    accent1: "#402c5d",
    accent2: "#b49cff",
    variants: ["Default"],
    description:
      "Poster edisi kolektor dengan artwork panggung dan panorama Karangasem yang cocok dibingkai.",
    imageData: "",
    imageName: "",
  },
  {
    id: "wristband-pack",
    name: "Wristband Pack",
    price: 69000,
    stock: 90,
    type: "Entry kit",
    tag: "3 pcs",
    accent1: "#33425f",
    accent2: "#ffd166",
    variants: ["Default"],
    description:
      "Paket wristband dan sticker pack yang cocok untuk koleksi, hadiah, atau bundling merch termurah.",
    imageData: "",
    imageName: "",
  },
];

export const orderStatuses = [
  "payment_review",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeProduct(product, index = 0) {
  const baseName = String(product?.name || `Product ${index + 1}`).trim();
  const id = String(product?.id || slugify(baseName) || `product-${index + 1}`);
  const variants = Array.isArray(product?.variants)
    ? product.variants.map((variant) => String(variant).trim()).filter(Boolean)
    : ["Default"];

  return {
    id,
    name: baseName,
    price: Number.isFinite(Number(product?.price)) ? Math.max(0, Math.round(Number(product.price))) : 0,
    stock: Number.isFinite(Number(product?.stock)) ? Math.max(0, Math.floor(Number(product.stock))) : 0,
    type: String(product?.type || "Merchandise").trim(),
    tag: String(product?.tag || "New drop").trim(),
    accent1: String(product?.accent1 || "#2d314f"),
    accent2: String(product?.accent2 || "#f3b36a"),
    variants: variants.length ? variants : ["Default"],
    description: String(product?.description || "").trim(),
    imageData: product?.imageData || "",
    imageName: product?.imageName || "",
    createdAt: product?.createdAt || new Date().toISOString(),
    updatedAt: product?.updatedAt || new Date().toISOString(),
  };
}

export function normalizeProducts(productsInput) {
  const source = Array.isArray(productsInput) && productsInput.length ? productsInput : defaultProducts;
  const normalized = source.map((product, index) => normalizeProduct(product, index));
  const seen = new Set();
  return normalized.filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

export function defaultInventoryFor(products = defaultProducts) {
  return products.map((product) => ({ id: product.id, stock: product.stock }));
}

export function normalizeInventory(inventory, products = defaultProducts) {
  const defaults = defaultInventoryFor(products);
  const fallback = new Map(defaults.map((item) => [item.id, item.stock]));
  if (!Array.isArray(inventory)) {
    return defaults;
  }

  return products.map((product) => {
    const found = inventory.find((item) => item && item.id === product.id);
    const stock = Number.isFinite(Number(found?.stock))
      ? Math.max(0, Math.floor(Number(found.stock)))
      : fallback.get(product.id);
    return { id: product.id, stock };
  });
}
