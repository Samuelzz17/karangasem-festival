"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useLanguage } from "./LanguageContext";
import { useSiteHeaderGsap } from "../hooks/useGsapAnimations";

export default function SiteHeader() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { lang, changeLang, t, isSadMode, toggleSadMode, isAudioPlaying } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  useSiteHeaderGsap();

  // Close menu on route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", key: "home" },
    { href: "/about", key: "about" },
    { href: "/history", key: "history" },
    { href: "/rundown", key: "rundown" },
    { href: "/merchandise", key: "merchandise" },
    { href: "/gallery", key: "gallery" },
    { href: "/cart", key: "cart" },
  ];

  const formattedCartCount = String(cartCount).padStart(2, "0");

  return (
    <>
      {/* HEADER TOPBAR */}
      <div className="header">
        <span 
          className={`header_menu ${menuOpen ? "active" : ""}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "close" : "menu"}
          <span />
        </span>
        
        <div className="header_quote">
          <Link href="/">
            <span>Karangasem Festival®</span>{" "}
            {isSadMode ? t.homepage.quoteSad : t.homepage.quoteNormal}
          </Link>
        </div>

        <div className="header_sadmode" onClick={toggleSadMode}>
          sad mode{" "}
          <span className={`smode-btn-toggle ${isSadMode ? "on" : "off"}`}>
            <span className="smode-dot" />
          </span>
        </div>

        <Link href="/cart">
          <div className="header_cart">
            cart <div style={{ display: "inline" }}>{formattedCartCount}</div>
            <span />
          </div>
        </Link>
      </div>

      {/* HEADER BOTTOM DECORATION */}
      <div className="header-bottom">
        <div className={`header-bottom-icon ${isAudioPlaying ? "playing" : ""}`}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* HEADER NOISE & GLITCH OVERLAYS */}
      <div className="header-noise">
        <div className="noise-inner" />
      </div>

      {/* FULL SCREEN MENU DRAWER */}
      <div className={`menu-drawer ${menuOpen ? "open" : ""}`} id="menu">
        <div className="header">
          <span 
            className="header_menu active" 
            onClick={() => setMenuOpen(false)}
          >
            close<span />
          </span>
          <div className="header_quote">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <span>Karangasem Festival®</span>{" "}
              {isSadMode ? t.homepage.quoteSad : t.homepage.quoteNormal}
            </Link>
          </div>
          <div className="header_sadmode" onClick={toggleSadMode}>
            sad mode{" "}
            <span className={`smode-btn-toggle ${isSadMode ? "on" : "off"}`}>
              <span className="smode-dot" />
            </span>
          </div>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>
            <div className="header_cart">
              cart <div style={{ display: "inline" }}>{formattedCartCount}</div>
              <span />
            </div>
          </Link>
        </div>

        <div className="polublur">
          <div className="polublur-inner1" />
          <div className="polublur-inner2">
            <div className="menu-inner">
              <div className="menu-inner-inner">
                {links.map((link, idx) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`menu-link-item ${pathname === link.href ? "active" : ""}`}
                  >
                    <span>[{idx + 1}]</span>
                    {t.nav[link.key]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="polublur-inner3" />
        </div>

        <div className="menu-footer">
          <div className="menu-footer-content">
            <div className="menu-footer-l">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram,</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">Youtube,</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            </div>
            
            <div className="menu-footer-c">
              {/* Language Selector Inside Menu */}
              <div className="menu-lang-selector">
                <button
                  onClick={() => changeLang("id")}
                  className={`menu-lang-btn ${lang === "id" ? "active" : ""}`}
                >
                  🇮🇩 ID
                </button>
                <button
                  onClick={() => changeLang("en")}
                  className={`menu-lang-btn ${lang === "en" ? "active" : ""}`}
                >
                  🇬🇧 EN
                </button>
              </div>
              <div className="menu-footer-rights">
                ©2026 karangasem festival. all rights reserved.
              </div>
            </div>

            <div className="menu-footer-r">
              <a href="mailto:info@karangasemfestival.com">info@karangasemfestival.com</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
