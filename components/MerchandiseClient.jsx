"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { useLanguage } from "./LanguageContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return currency.format(value || 0);
}

export default function MerchandiseClient({ initialProducts }) {
  const [products] = useState(initialProducts || []);
  const { addToCart, cartCount } = useCart();
  const [variantSelections, setVariantSelections] = useState({});
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [toasts, setToasts] = useState([]);
  const { lang, t } = useLanguage();
  const containerRef = useRef(null);

  // Floating toast notification trigger
  function addToast(message, type = "success") {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  function handleAdd(product) {
    const variant = variantSelections[product.id] || product.variants[0];
    const res = addToCart(product, variant);
    if (res.success) {
      const msg = lang === "id"
        ? `Berhasil menambahkan ${product.name} (${variant}) ke keranjang!`
        : `Successfully added ${product.name} (${variant}) to cart!`;
      addToast(msg, "success");
    } else {
      addToast(res.error, "error");
    }
  }

  // Categories extraction
  const categories = ["ALL", ...new Set(products.map((p) => p.type))];

  // Filtering
  const filteredProducts = activeCategory === "ALL"
    ? products
    : products.filter((p) => p.type === activeCategory);

  function getCategoryLabel(type) {
    if (lang === "id") {
      switch (type.toLowerCase()) {
        case "all": return "Semua";
        case "apparel": return "Pakaian";
        case "accessories": return "Aksesoris";
        case "daily carry": return "Tas & Harian";
        case "print": return "Poster & Cetak";
        case "entry kit": return "Tiket & Kit";
        default: return type;
      }
    } else {
      switch (type.toLowerCase()) {
        case "all": return "All";
        default: return type;
      }
    }
  }

  // GSAP animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── HERO TIMELINE ──────────────────────────────────────────
      const heroTl = gsap.timeline({ delay: 0.1 });
      heroTl
        .from(".merch-hero-tag", {
          y: -20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(".merch-hero-giant .word", {
          y: 80,
          opacity: 0,
          duration: 1.0,
          stagger: 0.15,
          ease: "expo.out",
        }, "-=0.3")
        .from(".merch-hero-divider", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.8,
          ease: "expo.out",
        }, "-=0.5")
        .from(".merch-hero-desc", {
          y: 25,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        }, "-=0.4")
        .from(".merch-hero-scroll", {
          opacity: 0,
          y: 10,
          duration: 0.5,
          ease: "power2.out",
        }, "-=0.3")
        .from(".merch-hero-deco", {
          scale: 0.9,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.5)",
        }, "-=0.6");

      // ── PURCHASE GUIDE SCROLL TRIGGER ─────────────────────────
      gsap.from(".merch-guide-card", {
        scrollTrigger: {
          trigger: ".merch-guide-panel",
          start: "top 82%",
          toggleActions: "play none none none",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // ── CATALOG SECTION HEADER SCROLL TRIGGER ──────────────────
      gsap.from(".merch-catalog-screen .merch-section-header > *", {
        scrollTrigger: {
          trigger: ".merch-catalog-screen",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".merch-catalog-controls", {
        scrollTrigger: {
          trigger: ".merch-catalog-controls",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // GSAP animation when category changes
  useEffect(() => {
    if (filteredProducts.length > 0) {
      gsap.fromTo(
        ".merch-product-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          overwrite: "auto",
        }
      );
    }
  }, [activeCategory]);

  return (
    <div ref={containerRef} className="merch-reskin">
      {/* ── HERO SCREEN ────────────────────────────────────────── */}
      <section className="merch-screen merch-hero-screen">
        <div className="merch-screen-grid" />
        <div className="merch-hero-inner">
          <div>
            <span className="merch-hero-tag">
              [{t.merchandise.eyebrow}]
            </span>
            <h1 className="merch-hero-giant">
              <span className="word">OFFICIAL</span>
              <span className="word outline">COLLECTION</span>
            </h1>
            <div className="merch-hero-divider" />
            <p className="merch-hero-desc">{t.merchandise.desc}</p>
            <div className="merch-hero-scroll">
              <span className="merch-scroll-line" />
              <span>{lang === "id" ? "gulir ke bawah" : "scroll down"}</span>
            </div>
          </div>

          <div className="merch-hero-deco">
            <span className="merch-hero-deco-badge">AUTHENTIC</span>
            <span className="merch-hero-deco-title">EST. 2026</span>
            <span className="merch-hero-deco-info">Karangasem Festival</span>
          </div>
        </div>
        <div className="merch-gold-bar" />
      </section>

      {/* ── PURCHASE GUIDE SCREEN ──────────────────────────────── */}
      <section className="merch-screen merch-guide-screen">
        <div className="merch-screen-grid" />
        <div className="container">
          <div className="merch-section-header">
            <span className="merch-section-label">[01] — {lang === "id" ? "Informasi Pembelian" : "Order Info"}</span>
            <h2 className="merch-section-title">{t.merchandise.flowTitle}</h2>
          </div>

          <div className="merch-guide-panel">
            <div className="merch-guide-card offline">
              <span className="merch-guide-badge">OFFLINE BOOTH</span>
              <h3>{t.merchandise.offlineTitle}</h3>
              <p>{t.merchandise.offlineDesc}</p>
            </div>

            <div className="merch-guide-card online">
              <span className="merch-guide-badge">ONLINE PRE-ORDER</span>
              <h3>{t.merchandise.onlineTitle}</h3>
              <p>{t.merchandise.onlineDesc}</p>
              <a
                href="https://wa.me/628123456789?text=Halo%20Admin%2C%20saya%20ingin%20memesan%20Official%20Merchandise%20Karangasem%20Festival%202026"
                target="_blank"
                rel="noopener noreferrer"
                className="merch-wa-btn"
              >
                💬 {t.merchandise.ctaWa}
              </a>
            </div>
          </div>
        </div>
        <div className="merch-gold-bar" />
      </section>

      {/* ── STORE CATALOG SCREEN ────────────────────────────────── */}
      <section className="merch-screen merch-catalog-screen">
        <div className="merch-screen-grid" />
        <div className="container">
          <div className="merch-section-header">
            <span className="merch-section-label">[02] — {lang === "id" ? "Katalog Resmi" : "Official Catalog"}</span>
            <h2 className="merch-section-title">{t.merchandise.catalogTitle}</h2>
          </div>

          <div className="merch-catalog-controls">
            <div className="merch-filter-container">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`merch-filter-tab ${activeCategory === cat ? "active" : ""}`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>

            <Link href="/cart" className="merch-cart-badge-trigger">
              🛒 {lang === "id" ? "Buka Keranjang" : "View Cart"}
              {cartCount > 0 && <span className="merch-cart-count">{cartCount}</span>}
            </Link>
          </div>

          <div className="merch-products-grid">
            {filteredProducts.length === 0 ? (
              <p style={{ gridColumn: "span 3", textAlign: "center", padding: "80px", color: "var(--muted)", fontWeight: "600" }}>
                {lang === "id" ? "Tidak ada produk untuk kategori ini." : "No products available in this category."}
              </p>
            ) : (
              filteredProducts.map((product) => {
                const selectedVariant = variantSelections[product.id] || product.variants[0];
                return (
                  <article className="merch-product-card" key={product.id}>
                    <div className="merch-card-visual-wrapper">
                      {product.tag && <span className="merch-card-tag">{product.tag}</span>}
                      <div
                        className="merch-card-visual-bg"
                        style={{
                          backgroundImage: product.imageData
                            ? `url('${product.imageData}')`
                            : `linear-gradient(135deg, ${product.accent1 || "#2d314f"}, ${product.accent2 || "#f3b36a"})`,
                        }}
                      />
                    </div>

                    <div className="merch-card-details">
                      <span className="merch-card-type-label">{product.type}</span>
                      <h3 className="merch-card-name-title">{product.name}</h3>
                      <p className="merch-card-desc-text">{product.description}</p>

                      <div className="merch-card-footer">
                        <span className="merch-card-price-val">{formatMoney(product.price)}</span>
                        <span className="merch-card-stock-label">
                          {product.stock} {lang === "id" ? "stok" : "in stock"}
                        </span>
                      </div>

                      <div className="merch-card-actions">
                        <select
                          className="merch-variant-select"
                          value={selectedVariant}
                          onChange={(e) =>
                            setVariantSelections((current) => ({
                              ...current,
                              [product.id]: e.target.value,
                            }))
                          }
                        >
                          {product.variants.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="merch-add-btn"
                          onClick={() => handleAdd(product)}
                          disabled={!product.stock}
                        >
                          {product.stock ? (lang === "id" ? "Tambah" : "Add") : (lang === "id" ? "Habis" : "Sold Out")}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ── FLOATING TOAST NOTIFICATION CONTAINER ─────────────── */}
      <div className="merch-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`merch-toast ${toast.type}`}>
            <span className="merch-toast-icon">
              {toast.type === "success" ? "🟢" : "🔴"}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
