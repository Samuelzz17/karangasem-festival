"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";

export default function SiteFooter() {
  const { lang, t } = useLanguage();

  return (
    <footer className="premium-footer" id="contact">
      {/* Background outline SVG */}
      <div className="footer-bg-text-wrapper">
        <svg viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="none"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="2"
            fontSize="120"
            fontWeight="900"
            fontFamily="'Outfit', sans-serif"
            letterSpacing="10"
          >
            KARANGASEM
          </text>
        </svg>
      </div>

      {/* Grid Layout (4 columns) */}
      <div className="footer-grid-layout">
        {/* Column 1: Brand Info */}
        <div className="footer-brand-col">
          <div className="footer-brand-logo-wrap">
            <img 
              src="/logo-karangasem-festival.png" 
              alt="Karangasem Festival Logo" 
              className="footer-brand-logo"
            />
          </div>
          <p className="footer-brand-tagline">
            {lang === "id" ? "tidak mudah, tapi harus bisa" : "not easy, but we can do it"}
          </p>
          <div className="footer-brand-socials">
            <a href="https://instagram.com/KarangasemFestival" target="_blank" rel="noopener noreferrer">
              Instagram<span></span>
            </a>
            <a href="https://tiktok.com/@KarangasemFestival" target="_blank" rel="noopener noreferrer">
              TikTok<span></span>
            </a>
            <a href="https://youtube.com/KarangasemFestival" target="_blank" rel="noopener noreferrer">
              YouTube<span></span>
            </a>
            <a href="https://facebook.com/KarangasemFestival" target="_blank" rel="noopener noreferrer">
              Facebook<span></span>
            </a>
          </div>
        </div>

        {/* Column 2: Coordinate / Secretariat Address */}
        <div className="footer-info-col">
          <div className="footer-info-section">
            <h4>🏢 {t.footer.contactTitle}</h4>
            <p>{t.footer.contactDesc}</p>
          </div>
          <div className="footer-info-section">
            <h4>🏢 {t.footer.office}</h4>
            <p style={{ whiteSpace: "pre-line" }}>{t.footer.address}</p>
          </div>
        </div>

        {/* Column 3: Quick Navigation */}
        <div className="footer-links-col">
          <h4>🔗 {lang === "id" ? "Navigasi" : "Navigation"}</h4>
          <ul className="footer-nav-list">
            <li>
              <Link href="/">
                {lang === "id" ? "Beranda" : "Home"}
              </Link>
            </li>
            <li>
              <Link href="/about">
                {lang === "id" ? "Tentang" : "About"}
              </Link>
            </li>
            <li>
              <Link href="/rundown">
                {lang === "id" ? "Jadwal Acara" : "Rundown"}
              </Link>
            </li>
            <li>
              <Link href="/merchandise">
                {lang === "id" ? "Merchandise" : "Shop"}
              </Link>
            </li>
            <li>
              <Link href="/gallery">
                {lang === "id" ? "Galeri" : "Gallery"}
              </Link>
            </li>
            <li>
              <Link href="/history">
                {lang === "id" ? "Sejarah" : "History"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Location Map */}
        <div className="footer-map-col">
          <h4>📍 {t.footer.mapsTitle}</h4>
          <div className="premium-map-frame">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.7712391218764!2d115.6033324!3d-8.4533367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2077e699ef7db%3A0xc3fcd77bfa9c30ab!2sTaman%20Budaya%20Candra%20Bhuana!5e0!3m2!1sen!2sid!4v1716382000000!5m2!1sen!2sid"
              width="100%"
              height="160"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Taman Budaya Candra Bhuana"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="footer-divider" />

      {/* Bottom Bar: Copyright & Credits */}
      <div className="footer-bottom-bar">
        <div className="footer-rights">
          {t.footer.rights}
        </div>

        <div className="footer-credits">
          {lang === "id" ? "desain & pengembangan oleh " : "design & development by "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            {lang === "id" ? "Tim Kreatif Karfest" : "Ava Digital"}
          </a>
          {" | "}
          {t.preloader.made}
        </div>

        <div className="footer-meta-actions">
          <a href="mailto:tourism@karangasemkab.go.id" className="music-stream-btn" title="Email Us">
            ✉️
          </a>
          <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="music-stream-btn" title="Spotify">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.077-.336.135-.668.47-.743 3.856-.88 7.15-.502 9.822 1.135.296.18.387.564.205.854zm1.224-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.078-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.67-1.114 8.24-.57 11.346 1.34.367.226.487.707.26 1.074zm.107-2.825C14.396 8.784 8.61 8.592 5.27 9.605c-.514.156-1.053-.133-1.21-.647-.156-.514.133-1.053.647-1.21 3.843-1.167 10.224-.943 14.28 1.465.463.275.614.873.34 1.336-.275.463-.873.614-1.337.34z" />
            </svg>
          </a>
          <Link href="/admin" className="footer-admin-btn">
            🔑 Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}

