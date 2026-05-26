"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import Link from "next/link";
import { useCart } from "../../components/CartContext";
import { useLanguage } from "../../components/LanguageContext";
import { usePageEntranceGsap } from "../../hooks/usePageGsap";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return currency.format(value || 0);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

export default function CartPage() {
  const { cart, changeQty, cartCount, cartTotal, clearCart } = useCart();
  const { lang, t } = useLanguage();
  usePageEntranceGsap();
  
  const [buyerName, setBuyerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [note, setNote] = useState("");
  const [proofPreview, setProofPreview] = useState("");
  const [proofName, setProofName] = useState("");
  const [proofData, setProofData] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);

  // Steps: 'cart' | 'buyer_data' | 'success'
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  async function downloadInvoicePDF(order) {
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
    doc.text(`Tanggal: ${new Date(order.date).toLocaleString("id-ID")}`, 14, 56);
    doc.text(`Status: Menunggu Verifikasi Pembayaran`, 14, 62);

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
    order.items.forEach((item) => {
      const name = item.name.length > 30 ? item.name.substring(0, 27) + "..." : item.name;
      doc.text(name, 14, y);
      doc.text(item.variant || "Default", 90, y);
      doc.text(formatMoney(item.price), 120, y);
      doc.text(`${item.qty}`, 155, y);
      doc.text(formatMoney(item.qty * item.price), 175, y);
      y += 8;
    });

    doc.line(14, y - 2, 196, y - 2);

    // Total Row
    doc.setFont("helvetica", "bold");
    doc.text("Total Pembayaran:", 120, y + 6);
    doc.text(formatMoney(order.total), 175, y + 6);

    let footerY = y + 20;

    const isImage = order.proofData && (
      order.proofData.startsWith("data:image/") ||
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
    doc.text("Terima kasih atas pemesanan Anda. Harap simpan invoice ini sebagai bukti transaksi.", 14, footerY);
    doc.text("Panitia Karangasem Festival 2026", 14, footerY + 5);

    // Save
    doc.save(`Invoice-${order.id}.pdf`);
  }

  async function handleProofChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await readFileAsDataURL(file);
    setProofData(dataUrl);
    setProofName(file.name);
    setProofPreview(dataUrl);
  }

  async function handleConfirmPayment(event) {
    event.preventDefault();
    if (!cart.length) {
      setStatus(lang === "id" ? "Keranjang belanja kosong." : "Shopping cart is empty.");
      return;
    }
    if (!proofData) {
      setStatus(lang === "id" ? "Silakan upload bukti pembayaran terlebih dahulu." : "Please upload your proof of payment first.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName,
          whatsapp,
          note,
          proofData,
          proofName,
          proofType: proofData.startsWith("data:image/") ? "image" : "application/octet-stream",
          items: cart,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || (lang === "id" ? "Checkout gagal." : "Checkout failed."));
      }

      setLastOrderId(data.order.id);
      setLastOrderDetails({
        id: data.order.id,
        buyerName,
        whatsapp,
        note,
        items: [...cart],
        total: cartTotal,
        date: new Date().toISOString(),
        proofData,
        proofType: proofData.startsWith("data:image/") ? "image" : "application/octet-stream",
      });
      clearCart();
      setBuyerName("");
      setWhatsapp("");
      setNote("");
      setProofData("");
      setProofName("");
      setProofPreview("");
      setShowQrisModal(false);
      setCheckoutStep("success");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <div className="section-header" style={{ marginBottom: "24px" }}>
        <div>
          <span className="eyebrow">Shopping Cart</span>
          <h2 className="section-title">{t.cart.title}</h2>
          <p className="section-copy">{t.cart.subtitle}</p>
        </div>
      </div>

      <div className="merch-layout">
        {/* Left Column: Cart items list */}
        <section className="stack">
          <div className="cart-card" style={{ padding: "24px" }}>
            <div className="cart-head" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "16px", marginBottom: "16px" }}>
              <h3>{t.cart.listTitle}</h3>
              <span className="pill">{cartCount} item</span>
            </div>

            {!cart.length && checkoutStep !== "success" ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p className="section-copy" style={{ marginBottom: "20px" }}>{t.cart.empty}</p>
                <Link href="/merchandise" className="btn btn-primary">
                  {t.cart.backBtn}
                </Link>
              </div>
            ) : checkoutStep === "success" ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p className="section-copy">{t.cart.successMsg}</p>
              </div>
            ) : (
              <div className="cart-list">
                {cart.map((item, index) => (
                  <article className="cart-item" key={`${item.id}-${index}`}>
                    <div className="cart-item-top">
                      <div style={{ display: "flex", gap: "16px", alignItems: "center", flex: 1 }}>
                        <div
                          className="cart-item-visual"
                          style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "12px",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: item.imageData
                              ? `url('${item.imageData}')`
                              : `linear-gradient(135deg, ${item.accent1 || "#2d314f"}, ${item.accent2 || "#f3b36a"})`,
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <h3 className="cart-item-title" style={{ fontSize: "1.1rem", margin: "0 0 6px 0" }}>{item.name}</h3>
                          <div className="cart-item-meta">
                            <span className="pill">{item.variant}</span>
                            <span className="pill">{formatMoney(item.price)}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => changeQty(index, -item.qty)}
                        disabled={checkoutStep !== "cart"}
                      >
                        {t.cart.deleteBtn}
                      </button>
                    </div>
                    <div className="cart-item-top" style={{ marginTop: "12px" }}>
                      <div className="qty-controls">
                        <button 
                          type="button" 
                          onClick={() => changeQty(index, -1)}
                          disabled={checkoutStep !== "cart"}
                        >-</button>
                        <strong>{item.qty}</strong>
                        <button 
                          type="button" 
                          onClick={() => changeQty(index, 1)}
                          disabled={checkoutStep !== "cart"}
                        >+</button>
                      </div>
                      <strong>{formatMoney(item.qty * item.price)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="cart-total" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "24px", paddingTop: "16px" }}>
                <div className="total-row">
                  <span>{t.cart.subtotal}</span>
                  <strong style={{ fontSize: "1.4rem", color: "#f6dcbf" }}>{formatMoney(cartTotal)}</strong>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Checkout steps form */}
        <aside className="stack sticky">
          {checkoutStep === "cart" && (
            <div className="cart-card" style={{ padding: "24px" }}>
              <h3 style={{ marginBottom: "12px", color: "#fff" }}>{t.cart.proceedBtn}</h3>
              <p className="section-copy" style={{ marginBottom: "20px" }}>
                {t.cart.proceedDesc}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={!cart.length}
                onClick={() => setCheckoutStep("buyer_data")}
              >
                {t.cart.proceedBtn}
              </button>
            </div>
          )}

          {checkoutStep === "buyer_data" && (
            <div className="cart-card" style={{ padding: "24px" }}>
              <div className="cart-head" style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, color: "#fff" }}>{t.cart.formTitle}</h3>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                  onClick={() => {
                    setStatus("");
                    setCheckoutStep("cart");
                  }}
                >
                  {t.cart.formCancel}
                </button>
              </div>

              <form
                className="checkout-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setStatus("");
                  setShowQrisModal(true);
                }}
              >
                <div className="field">
                  <label htmlFor="buyer-name">{t.cart.fieldName}</label>
                  <input
                    id="buyer-name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder={t.cart.namePlaceholder}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="buyer-whatsapp">{t.cart.fieldWa}</label>
                  <input
                    id="buyer-whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder={t.cart.waPlaceholder}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="buyer-note">{t.cart.fieldNote}</label>
                  <textarea
                    id="buyer-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t.cart.notePlaceholder}
                  />
                </div>

                <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: "16px" }}>
                  {t.cart.payBtn}
                </button>
              </form>
            </div>
          )}

          {checkoutStep === "success" && (
            <div className="cart-card" style={{ padding: "24px" }}>
              <div className="success-card">
                <div className="success-icon">✓</div>
                <h3>{t.cart.successTitle}</h3>
                <p>{t.cart.txId}</p>
                <div className="order-badge">{lastOrderId}</div>
                <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginTop: "8px" }}>
                  {t.cart.successDesc}
                </p>
                {lastOrderDetails && (
                  <button
                    disabled={pdfDownloading}
                    onClick={async () => {
                      setPdfDownloading(true);
                      try {
                        await downloadInvoicePDF(lastOrderDetails);
                      } catch (e) {
                        alert("Gagal mengunduh PDF: " + e.message);
                      } finally {
                        setPdfDownloading(false);
                      }
                    }}
                    className="btn btn-secondary"
                    style={{ width: "100%", marginTop: "16px", background: "rgba(125, 211, 252, 0.15)", color: "#7dd3fc" }}
                  >
                    {pdfDownloading ? "⏳ Menyiapkan PDF..." : "📥 Unduh Rekap PDF"}
                  </button>
                )}
                <Link
                  href="/merchandise"
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "12px", textAlign: "center" }}
                >
                  {t.cart.backStore}
                </Link>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* QRIS Modal Overlay */}
      {showQrisModal && (
        <div className="qris-modal-overlay">
          <div className="qris-modal-content">
            <div className="qris-modal-header">
              <h3>{t.cart.scanQris}</h3>
              <button
                type="button"
                className="qris-close-btn"
                onClick={() => {
                  setStatus("");
                  setShowQrisModal(false);
                }}
                disabled={loading}
              >
                &times;
              </button>
            </div>

            <div className="qris-total-box">
              <span>{t.cart.billTotal}</span>
              <h4>{formatMoney(cartTotal)}</h4>
            </div>

            <div className="qris-image-container">
              <img src="/qris-mockup.png" alt="QRIS Code" />
            </div>

            <form className="qris-upload-section" onSubmit={handleConfirmPayment}>
              <div className="field">
                <label htmlFor="modal-proof" style={{ color: "#fff", fontWeight: "bold" }}>
                  {t.cart.uploadProof}
                </label>
                <input
                  id="modal-proof"
                  type="file"
                  accept="image/*"
                  onChange={handleProofChange}
                  required
                  disabled={loading}
                />
              </div>

              {proofPreview && (
                <div className="proof-preview" style={{ maxHeight: "150px", overflow: "hidden", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <img
                    alt="Preview bukti"
                    src={proofPreview}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              )}

              {status && <div className="help" style={{ color: "#f87171" }}>{status}</div>}

              <div className="qris-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setStatus("");
                    setShowQrisModal(false);
                  }}
                  disabled={loading}
                >
                  {t.cart.formCancel}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !proofData}
                >
                  {loading ? t.cart.loadingPay : t.cart.confirmPay}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
