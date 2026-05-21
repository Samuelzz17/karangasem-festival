"use client";

import { useMemo, useState } from "react";

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

export default function MerchandiseClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [cart, setCart] = useState([]);
  const [buyerName, setBuyerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [note, setNote] = useState("");
  const [proofPreview, setProofPreview] = useState("");
  const [proofName, setProofName] = useState("");
  const [proofData, setProofData] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [variantSelections, setVariantSelections] = useState({});

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.qty * item.price, 0), [cart]);

  function addToCart(product) {
    const variant = variantSelections[product.id] || product.variants[0];
    const existing = cart.find((item) => item.id === product.id && item.variant === variant);
    const totalQty = cart.filter((item) => item.id === product.id).reduce((sum, item) => sum + item.qty, 0);
    if (!product.stock) return;

    if (existing) {
      if (totalQty >= product.stock) {
        setStatus(`Stok ${product.name} habis untuk varian yang dipilih.`);
        return;
      }
      setCart(
        cart.map((item) =>
          item === existing ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
      return;
    }

    if (totalQty >= product.stock) {
      setStatus(`Stok ${product.name} habis.`);
      return;
    }

    setCart([
      ...cart,
      {
        id: product.id,
        name: product.name,
        variant,
        qty: 1,
        price: product.price,
      },
    ]);
  }

  function changeQty(index, delta) {
    setCart((current) => {
      const next = current
        .map((item, itemIndex) => (itemIndex === index ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0);
      return next;
    });
  }

  async function handleProofChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await readFileAsDataURL(file);
    setProofData(dataUrl);
    setProofName(file.name);
    setProofPreview(dataUrl);
  }

  async function handleCheckout(event) {
    event.preventDefault();
    if (!cart.length) {
      setStatus("Cart masih kosong.");
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
        throw new Error(data.error || "Checkout gagal.");
      }

      setStatus(`Order ${data.order.id} berhasil disimpan.`);
      setCart([]);
      setBuyerName("");
      setWhatsapp("");
      setNote("");
      setProofData("");
      setProofName("");
      setProofPreview("");

      const refreshed = await fetch("/api/products", { cache: "no-store" }).then((res) => res.json());
      setProducts(refreshed.products || []);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="merch-layout">
      <section className="stack">
        <div className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Koleksi merchandise</h2>
              <p className="section-copy">Produk di sini ditarik langsung dari Firestore.</p>
            </div>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div
                  className="product-visual"
                  data-label={product.tag}
                  style={{
                    backgroundImage: product.imageData
                      ? `url('${product.imageData}')`
                      : `linear-gradient(135deg, ${product.accent1}, ${product.accent2})`,
                  }}
                />
                <div className="body">
                  <div className="product-top">
                    <div>
                      <span className="mini-badge">{product.type}</span>
                      <h3>{product.name}</h3>
                    </div>
                    <div className="price">{formatMoney(product.price)}</div>
                  </div>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-meta">
                    <span className="pill">{product.tag}</span>
                    <span className="pill">{product.stock} stok</span>
                  </div>
                  <div className="product-actions">
                    <select
                      value={variantSelections[product.id] || product.variants[0]}
                      onChange={(e) =>
                        setVariantSelections((current) => ({
                          ...current,
                          [product.id]: e.target.value,
                        }))
                      }
                    >
                      {product.variants.map((variant) => (
                        <option key={variant}>{variant}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => addToCart(product)}
                      disabled={!product.stock}
                    >
                      {product.stock ? "Add" : "Sold out"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <aside className="stack sticky">
        <section className="cart-card">
          <div className="cart-head">
            <div>
              <span className="eyebrow">Cart</span>
              <h2 className="section-title">Ringkasan belanja</h2>
            </div>
            <span className="pill">{cartCount} item</span>
          </div>

          {!cart.length ? (
            <p className="section-copy">Tambahkan produk untuk melihat total transaksi dan melanjutkan checkout.</p>
          ) : (
            <div className="cart-list">
              {cart.map((item, index) => (
                <article className="cart-item" key={`${item.id}-${index}`}>
                  <div className="cart-item-top">
                    <div>
                      <h3 className="cart-item-title">{item.name}</h3>
                      <div className="cart-item-meta">
                        <span className="pill">{item.variant}</span>
                        <span className="pill">{formatMoney(item.price)}</span>
                      </div>
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={() => changeQty(index, -item.qty)}>
                      Hapus
                    </button>
                  </div>
                  <div className="cart-item-top">
                    <div className="qty-controls">
                      <button type="button" onClick={() => changeQty(index, -1)}>-</button>
                      <strong>{item.qty}</strong>
                      <button type="button" onClick={() => changeQty(index, 1)}>+</button>
                    </div>
                    <strong>{formatMoney(item.qty * item.price)}</strong>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="cart-total">
            <div className="total-row">
              <span>Subtotal</span>
              <strong>{formatMoney(cartTotal)}</strong>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Checkout</h2>
              <p className="section-copy">Upload bukti transaksi agar order tersimpan di database.</p>
            </div>
          </div>

          <form className="checkout-form" onSubmit={handleCheckout}>
            <div className="field">
              <label htmlFor="buyer-name">Nama pembeli</label>
              <input id="buyer-name" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="buyer-whatsapp">WhatsApp</label>
              <input id="buyer-whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="buyer-note">Catatan</label>
              <textarea id="buyer-note" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="proof">Upload bukti transaksi</label>
              <input id="proof" type="file" accept="image/*" onChange={handleProofChange} required />
            </div>
            {proofPreview ? (
              <div className="proof-preview">
                <img alt="Preview bukti transaksi" src={proofPreview} />
              </div>
            ) : null}
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Simpan Order"}
            </button>
            {status ? <div className="help">{status}</div> : null}
          </form>
        </section>
      </aside>
    </div>
  );
}
