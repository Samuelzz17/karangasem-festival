"use client";

import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";
import { getStatusActions, orderStatusLabels } from "../lib/admin-workflow";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const statusActionLabels = {
  processing: "Proses",
  completed: "Complete",
  cancelled: "Cancel",
};

const STANDARD_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL", "All Size"];

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

function getDayKey(dateStr) {
  if (!dateStr) return "Unknown Date";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Unknown Date";
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return "Unknown Date";
  }
}

function getWeekKey(dateStr) {
  if (!dateStr) return "Unknown Week";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Unknown Week";
    
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(startOfWeek.setDate(diff));
    const sunday = new Date(startOfWeek.setDate(diff + 6));
    
    const formatOptions = { day: '2-digit', month: 'short' };
    const monStr = monday.toLocaleDateString('id-ID', formatOptions);
    const sunStr = sunday.toLocaleDateString('id-ID', formatOptions);
    
    return `${monday.getFullYear()} - W${weekNo} (${monStr} - ${sunStr})`;
  } catch (e) {
    return "Unknown Week";
  }
}

function formatMoney(value) {
  return currency.format(value || 0);
}

function formatDate(value) {
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      return String(value);
    }
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(d);
  } catch (e) {
    return String(value);
  }
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
    variants: [],
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
  const [recapPeriod, setRecapPeriod] = useState("all");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    setSelectedOrderIds([]);
    setCurrentPage(1);
  }, [filters]);
  
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

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredOrders, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage) || 1;

  async function refreshData() {
    const [productPayload, orderPayload] = await Promise.all([
      fetch("/api/admin/products", { cache: "no-store" }).then((res) => res.json()),
      fetch("/api/admin/orders", { cache: "no-store" }).then((res) => res.json()),
    ]);

    if (productPayload.products) setProducts(productPayload.products);
    if (orderPayload.orders) setOrders(orderPayload.orders);
    if (orderPayload.metrics) setMetrics(orderPayload.metrics);
    setSelectedOrderIds([]);
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
      variants: Array.isArray(product.variants) ? product.variants : [],
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
    setCustomSizeInput("");
  }

  function openAddProduct() {
    resetProductForm();
    setIsProductModalOpen(true);
  }

  function openEditProduct(product) {
    beginEdit(product);
    setIsProductModalOpen(true);
  }

  function closeProductModal() {
    resetProductForm();
    setIsProductModalOpen(false);
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
        variants: productForm.variants,
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
      closeProductModal();
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

  async function handleBulkStatusUpdate(newStatus) {
    if (selectedOrderIds.length === 0) return;
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/orders/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedOrderIds, status: newStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal mengubah status massal.");
      
      setStatus(`${selectedOrderIds.length} pesanan berhasil diperbarui.`);
      setSelectedOrderIds([]);
      await refreshData();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleBulkDelete() {
    if (selectedOrderIds.length === 0) return;
    if (!confirm(`Hapus ${selectedOrderIds.length} pesanan terpilih? Tindakan ini tidak dapat dibatalkan.`)) return;
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/orders/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedOrderIds }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menghapus pesanan massal.");
      
      setStatus(`${selectedOrderIds.length} pesanan berhasil dihapus.`);
      setSelectedOrderIds([]);
      await refreshData();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleBulkPDFDownload() {
    if (selectedOrderIds.length === 0) return;
    setBusy(true);
    try {
      const selectedOrders = orders.filter(o => selectedOrderIds.includes(o.id));
      for (let i = 0; i < selectedOrders.length; i++) {
        await downloadOrderInvoicePDF(selectedOrders[i]);
        if (i < selectedOrders.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 250));
        }
      }
    } catch (error) {
      setStatus("Gagal mengunduh PDF massal: " + error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  async function downloadOrderInvoicePDF(order) {
    if (!order) return;
    const doc = new jsPDF();

    // Set colors
    doc.setFillColor(45, 49, 79); // Accent color #2d314f
    doc.rect(0, 0, 210, 35, "F");

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("KARANGASEM FESTIVAL 2026", 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Official Merchandise Transaction Invoice", 14, 25);

    // Order ID and Date
    doc.setTextColor(45, 49, 79);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${order.id}`, 14, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleString("id-ID") : "-";
    doc.text(`Tanggal: ${dateStr}`, 14, 56);
    doc.text(`Status: ${orderStatusLabels[order.status] || order.status}`, 14, 62);

    // Customer Info
    doc.setFont("helvetica", "bold");
    doc.text("Detail Pembeli:", 14, 74);
    doc.setFont("helvetica", "normal");
    doc.text(`Nama: ${order.buyerName}`, 14, 80);
    doc.text(`WhatsApp: ${order.whatsapp}`, 14, 86);
    if (order.note) {
      doc.text(`Catatan: ${order.note}`, 14, 92);
    }

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 98, 196, 98);

    // Table Header
    doc.setFont("helvetica", "bold");
    doc.text("Produk", 14, 106);
    doc.text("Ukuran", 90, 106);
    doc.text("Harga", 120, 106);
    doc.text("Qty", 155, 106);
    doc.text("Subtotal", 175, 106);
    doc.line(14, 110, 196, 110);

    // Table Body
    doc.setFont("helvetica", "normal");
    let y = 118;
    if (Array.isArray(order.items)) {
      order.items.forEach((item) => {
        const name = item.name.length > 30 ? item.name.substring(0, 27) + "..." : item.name;
        doc.text(name, 14, y);
        doc.text(item.variant || "Default", 90, y);
        doc.text(formatMoney(item.price), 120, y);
        doc.text(`${item.qty}`, 155, y);
        doc.text(formatMoney(item.qty * item.price), 175, y);
        y += 8;
      });
    }

    doc.line(14, y - 2, 196, y - 2);

    // Total Row
    doc.setFont("helvetica", "bold");
    doc.text("Total Pembayaran:", 120, y + 6);
    doc.text(formatMoney(order.total), 175, y + 6);

    let footerY = y + 20;

    const isImage = order.proofData && (
      order.proofData.startsWith("data:") ||
      order.proofData.startsWith("http") ||
      order.proofType?.startsWith("image/") ||
      order.proofType === "image"
    );

    if (isImage) {
      try {
        const imgElement = await loadImage(order.proofData);
        let imgY = y + 18;
        let pageAdded = false;

        // If it doesn't fit on page 1, add page 2
        if (imgY + 75 > 280) {
          doc.addPage();
          imgY = 25;
          pageAdded = true;

          // Draw a small header on page 2
          doc.setFillColor(45, 49, 79);
          doc.rect(0, 0, 210, 15, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(`Bukti Pembayaran - Invoice ID: ${order.id}`, 14, 10);
        }

        doc.setTextColor(45, 49, 79);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Bukti Pembayaran:", 14, imgY);

        // Frame card for the receipt image
        doc.setDrawColor(220, 220, 220);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(13, imgY + 4, 52, 67, 2, 2, "FD");

        let format = "JPEG";
        if (order.proofData.includes("image/png")) format = "PNG";
        else if (order.proofData.includes("image/webp")) format = "WEBP";

        doc.addImage(imgElement, format, 14, imgY + 5, 50, 65);
        footerY = imgY + 80;
      } catch (err) {
        console.error("Error adding image to PDF:", err);
      }
    }

    // Footer note
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Panitia Karangasem Festival 2026 - Admin Copy", 14, footerY);

    // Save
    doc.save(`Invoice-${order.id}.pdf`);
  }

  const totalRevenue = metrics.totalRevenue || 0;

  const salesRecap = useMemo(() => {
    const activeOrders = orders.filter((order) => order.status !== "cancelled");
    const recapMap = {};

    activeOrders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          let periodKey = "Cumulative";
          let sortValue = 0;

          if (recapPeriod === "daily") {
            periodKey = getDayKey(order.createdAt);
            try {
              const d = new Date(order.createdAt);
              d.setHours(0, 0, 0, 0);
              sortValue = d.getTime();
            } catch (e) {}
          } else if (recapPeriod === "weekly") {
            periodKey = getWeekKey(order.createdAt);
            try {
              const date = new Date(order.createdAt);
              const day = date.getDay();
              const diff = date.getDate() - day + (day === 0 ? -6 : 1);
              const monday = new Date(date.setDate(diff));
              monday.setHours(0, 0, 0, 0);
              sortValue = monday.getTime();
            } catch (e) {}
          }

          const key = `${periodKey}_${item.id}_${item.variant || "Default"}`;
          if (!recapMap[key]) {
            recapMap[key] = {
              period: periodKey,
              sortValue: sortValue,
              productId: item.id,
              productName: item.name || "Unknown Product",
              variant: item.variant || "Default",
              quantity: 0,
              revenue: 0,
            };
          }
          recapMap[key].quantity += Number(item.qty || 0);
          recapMap[key].revenue += Number(item.qty || 0) * Number(item.price || 0);
        });
      }
    });

    const result = Object.values(recapMap);

    if (recapPeriod === "all") {
      return result.sort((a, b) => b.quantity - a.quantity);
    } else {
      return result.sort((a, b) => {
        if (b.sortValue !== a.sortValue) {
          return b.sortValue - a.sortValue;
        }
        return b.quantity - a.quantity;
      });
    }
  }, [orders, recapPeriod]);

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

      <section className="admin-card" style={{ marginTop: "24px" }}>
        <div className="section-header" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div>
            <h2 className="section-title">Rekapitulasi Penjualan Produk & Ukuran</h2>
            <p className="section-copy">Total quantity dan revenue berdasarkan item dan ukuran (tidak termasuk order dibatalkan).</p>
          </div>
          <div className="recap-filter-tabs">
            <button
              className={`tab-btn ${recapPeriod === "all" ? "active" : ""}`}
              onClick={() => setRecapPeriod("all")}
            >
              Semua Waktu
            </button>
            <button
              className={`tab-btn ${recapPeriod === "daily" ? "active" : ""}`}
              onClick={() => setRecapPeriod("daily")}
            >
              Harian
            </button>
            <button
              className={`tab-btn ${recapPeriod === "weekly" ? "active" : ""}`}
              onClick={() => setRecapPeriod("weekly")}
            >
              Mingguan
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {recapPeriod !== "all" && <th>Periode / Waktu</th>}
                <th>Produk</th>
                <th>Ukuran / Variant</th>
                <th>Total Terjual (Qty)</th>
                <th>Total Pendapatan (Revenue)</th>
              </tr>
            </thead>
            <tbody>
              {salesRecap.length === 0 ? (
                <tr>
                  <td colSpan={recapPeriod === "all" ? 4 : 5} style={{ textAlign: "center", color: "var(--muted)", padding: "20px" }}>
                    Belum ada data penjualan.
                  </td>
                </tr>
              ) : (
                salesRecap.map((item, idx) => (
                  <tr key={idx}>
                    {recapPeriod !== "all" && (
                      <td>
                        <span className="pill pill-time">{item.period}</span>
                      </td>
                    )}
                    <td><strong>{item.productName}</strong></td>
                    <td><span className="pill">{item.variant}</span></td>
                    <td><strong>{item.quantity} pcs</strong></td>
                    <td>{formatMoney(item.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <div className="product-admin-layout">
          <div className="product-admin-list-wrap">
            <div className="section-header" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <div>
                <h3 className="section-title">Merchandise Products</h3>
                <p className="section-copy">Kelola katalog produk, stok, varian, dan harga merchandise resmi.</p>
              </div>
              <button className="btn btn-primary" type="button" onClick={openAddProduct}>
                + Tambah Produk
              </button>
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
                      <span className="pill" style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {product.variants.join(", ")}
                      </span>
                      <span className="pill">{product.tag}</span>
                    </div>
                    <div className="section-actions">
                      <button className="btn btn-secondary" type="button" onClick={() => openEditProduct(product)}>
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

      {/* Modal Popup for Product Form */}
      {isProductModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>{editingId ? "Ubah Produk Merchandise" : "Tambah Produk Baru"}</h3>
              <button className="admin-modal-close" onClick={closeProductModal}>
                &times;
              </button>
            </div>
            <form className="product-form" onSubmit={handleProductSave}>
              <div className="field">
                <label htmlFor="p-name">Nama produk</label>
                <input
                  id="p-name"
                  placeholder="Masukkan nama produk"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="product-form-grid">
                <div className="field">
                  <label htmlFor="p-price">Harga (IDR)</label>
                  <input
                    id="p-price"
                    type="number"
                    placeholder="Contoh: 150000"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="p-stock">Stok</label>
                  <input
                    id="p-stock"
                    type="number"
                    placeholder="Contoh: 100"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="product-form-grid">
                <div className="field">
                  <label htmlFor="p-type">Tipe Produk</label>
                  <input
                    id="p-type"
                    placeholder="Contoh: T-Shirt, Aksesoris"
                    value={productForm.type}
                    onChange={(e) => setProductForm({ ...productForm, type: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="p-tag">Tag / Badge</label>
                  <input
                    id="p-tag"
                    placeholder="Contoh: Best Seller, New"
                    value={productForm.tag}
                    onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="product-form-grid">
                <div className="field">
                  <label htmlFor="p-a1">Warna Aksen 1</label>
                  <input
                    id="p-a1"
                    type="color"
                    value={productForm.accent1}
                    onChange={(e) => setProductForm({ ...productForm, accent1: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="p-a2">Warna Aksen 2</label>
                  <input
                    id="p-a2"
                    type="color"
                    value={productForm.accent2}
                    onChange={(e) => setProductForm({ ...productForm, accent2: e.target.value })}
                  />
                </div>
              </div>

              {/* Size Picker Section */}
              <div className="size-picker-section">
                <label className="size-picker-label">Pilih Ukuran / Varian</label>
                <div className="size-checkboxes-grid">
                  {STANDARD_SIZES.map((size) => {
                    const isChecked = productForm.variants.includes(size);
                    return (
                      <label key={size} className="size-checkbox-card">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setProductForm((prev) => {
                              const variants = prev.variants.includes(size)
                                ? prev.variants.filter((v) => v !== size)
                                : [...prev.variants, size];
                              return { ...prev, variants };
                            });
                          }}
                        />
                        <span>{size}</span>
                      </label>
                    );
                  })}
                </div>

                <div style={{ marginTop: "8px" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--muted)", display: "block", marginBottom: "4px" }}>
                    Tambah Ukuran Kustom (jika ada):
                  </label>
                  <div className="custom-size-input-row">
                    <input
                      type="text"
                      placeholder="Contoh: XXXXL, M-Slim, 40, dll."
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const trimmed = customSizeInput.trim();
                          if (trimmed && !productForm.variants.includes(trimmed)) {
                            setProductForm((prev) => ({
                              ...prev,
                              variants: [...prev.variants, trimmed],
                            }));
                            setCustomSizeInput("");
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="custom-size-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        const trimmed = customSizeInput.trim();
                        if (trimmed && !productForm.variants.includes(trimmed)) {
                          setProductForm((prev) => ({
                            ...prev,
                            variants: [...prev.variants, trimmed],
                          }));
                          setCustomSizeInput("");
                        }
                      }}
                    >
                      Tambah
                    </button>
                  </div>
                </div>

                {productForm.variants.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block", marginBottom: "6px" }}>
                      Varian Terpilih:
                    </span>
                    <div className="selected-sizes-list">
                      {productForm.variants.map((size) => (
                        <span key={size} className="size-badge">
                          {size}
                          <button
                            type="button"
                            className="size-badge-remove"
                            onClick={() => {
                              setProductForm((prev) => ({
                                ...prev,
                                variants: prev.variants.filter((v) => v !== size),
                              }));
                            }}
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="field">
                <label htmlFor="p-desc">Deskripsi Produk</label>
                <textarea
                  id="p-desc"
                  rows="3"
                  placeholder="Masukkan penjelasan detail produk"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="p-image">Upload Gambar Produk</label>
                <input id="p-image" type="file" accept="image/*" onChange={handleProductImage} />
              </div>
              {productPreview ? (
                <div className="proof-preview" style={{ maxHeight: "150px", overflow: "hidden", display: "flex", justifyContent: "center", borderRadius: "12px" }}>
                  <img alt="Preview produk" src={productPreview} style={{ maxHeight: "150px", objectFit: "contain" }} />
                </div>
              ) : null}
              <div className="section-actions" style={{ justifyContent: "flex-end", marginTop: "12px", gap: "12px" }}>
                <button className="btn btn-secondary" type="button" onClick={closeProductModal}>
                  Batal
                </button>
                <button className="btn btn-primary" type="submit" disabled={busy}>
                  {busy ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Produk"}
                </button>
              </div>
              {status ? (
                <div className="help" style={{ color: status.includes("Gagal") || status.includes("error") ? "#ff8e8e" : "#7ee2b8", marginTop: "8px" }}>
                  {status}
                </div>
              ) : null}
            </form>
          </div>
        </div>
      )}

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
                <th style={{ width: "40px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={paginatedOrders.length > 0 && paginatedOrders.every((o) => selectedOrderIds.includes(o.id))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrderIds((prev) => {
                          const next = new Set([...prev, ...paginatedOrders.map((o) => o.id)]);
                          return Array.from(next);
                        });
                      } else {
                        setSelectedOrderIds((prev) => prev.filter((id) => !paginatedOrders.some((o) => o.id === id)));
                      }
                    }}
                    className="admin-checkbox"
                  />
                </th>
                <th>Order ID</th>
                <th>Customer / Notes</th>
                <th>Detail Items</th>
                <th>Bukti Bayar</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Workflow</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => {
                const actions = getStatusActions(order.status);
                const isSelected = selectedOrderIds.includes(order.id);
                return (
                  <tr key={order.id} className={isSelected ? "row-selected" : ""}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrderIds((prev) => [...prev, order.id]);
                          } else {
                            setSelectedOrderIds((prev) => prev.filter((id) => id !== order.id));
                          }
                        }}
                        className="admin-checkbox"
                      />
                    </td>
                    <td><strong>{order.id}</strong></td>
                    <td>
                      <strong>{order.buyerName}</strong>
                      <div className="help">{order.whatsapp}</div>
                      {order.note ? (
                        <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "#f3b36a", borderLeft: "2px solid #f3b36a", paddingLeft: "6px", maxWidth: "250px", wordBreak: "break-word" }}>
                          <strong>Catatan:</strong> {order.note}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.9rem", listStyleType: "disc" }}>
                        {Array.isArray(order.items) && order.items.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: "4px" }}>
                            {item.name} <span className="pill" style={{ fontSize: "0.75rem", padding: "2px 6px" }}>{item.variant}</span> x{item.qty}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      {order.proofData ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
                          {order.proofData.startsWith("data:") || order.proofData.startsWith("http") || order.proofType?.startsWith("image/") || order.proofType === "image" ? (
                            <a href={order.proofData} target="_blank" rel="noopener noreferrer" title="Klik untuk memperbesar">
                              <img
                                src={order.proofData}
                                alt="Bukti Bayar"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  border: "1px solid rgba(255, 255, 255, 0.15)",
                                  cursor: "pointer"
                                }}
                              />
                            </a>
                          ) : (
                            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Bukan gambar ({order.proofType || "File"})</span>
                          )}
                          <a
                            href={order.proofData}
                            download={order.proofName || `bukti-${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "0.8rem", color: "#7dd3fc", textDecoration: "underline" }}
                          >
                            Unduh File
                          </a>
                        </div>
                      ) : (
                        <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Belum upload</span>
                      )}
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
                          className="btn btn-secondary"
                          type="button"
                          disabled={busy}
                          style={{ background: "rgba(125, 211, 252, 0.15)", color: "#7dd3fc" }}
                          onClick={async () => {
                            setBusy(true);
                            try {
                              await downloadOrderInvoicePDF(order);
                            } catch (err) {
                              alert("Gagal mengunduh PDF: " + err.message);
                            } finally {
                              setBusy(false);
                            }
                          }}
                        >
                          {busy ? "..." : "PDF"}
                        </button>
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

        {/* Pagination Container */}
        <div className="admin-pagination-container">
          <div className="pagination-info">
            Menampilkan {filteredOrders.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} - {Math.min(currentPage * rowsPerPage, filteredOrders.length)} dari {filteredOrders.length} pesanan
          </div>
          
          {totalPages > 1 && (
            <div className="pagination-buttons">
              <button 
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                &lsaquo;
              </button>
              
              {(() => {
                const pages = [];
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, startPage + 4);
                const adjustedStart = Math.max(1, Math.min(startPage, totalPages - 4));
                
                for (let p = adjustedStart; p <= endPage; p++) {
                  if (p > totalPages) break;
                  pages.push(
                    <button
                      key={p}
                      className={`pagination-btn ${currentPage === p ? "active" : ""}`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  );
                }
                return pages;
              })()}
              
              <button 
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                &rsaquo;
              </button>
            </div>
          )}
          
          <div className="pagination-rows-select">
            <span>Baris per halaman:</span>
            <select 
              value={rowsPerPage} 
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="pagination-select"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={1000}>1000</option>
            </select>
          </div>
        </div>
      </section>

      {selectedOrderIds.length > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-actions-bar-content">
            <div className="bulk-info">
              <span className="bulk-count">{selectedOrderIds.length}</span>
              <span className="bulk-text">pesanan terpilih</span>
            </div>
            <div className="bulk-actions-group">
              <span className="bulk-label">Aksi Massal:</span>
              <button
                className="btn btn-secondary btn-sm"
                type="button"
                disabled={busy}
                onClick={() => handleBulkStatusUpdate("processing")}
              >
                Proses
              </button>
              <button
                className="btn btn-secondary btn-sm"
                type="button"
                disabled={busy}
                onClick={() => handleBulkStatusUpdate("completed")}
              >
                Complete
              </button>
              <button
                className="btn btn-secondary btn-sm"
                type="button"
                disabled={busy}
                onClick={() => handleBulkStatusUpdate("cancelled")}
              >
                Cancel
              </button>
              
              <div className="bulk-divider" />
              
              <button
                className="btn btn-secondary btn-sm"
                type="button"
                style={{ background: "rgba(125, 211, 252, 0.15)", color: "#7dd3fc" }}
                disabled={busy}
                onClick={handleBulkPDFDownload}
              >
                Unduh PDF
              </button>
              
              <button
                className="btn btn-danger btn-sm"
                type="button"
                disabled={busy}
                onClick={handleBulkDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
