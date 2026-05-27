"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "../components/LanguageContext";
import { useCart } from "../components/CartContext";
import CountdownTimer from "../components/CountdownTimer";
import { useHomeGsap } from "../hooks/useGsapAnimations";

export default function HomePage() {
  const { lang, t, isFestivalMode, isAudioPlaying, setIsAudioPlaying } = useLanguage();
  useHomeGsap();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [activeTrack, setActiveTrack] = useState(null);
  const [cartStatus, setCartStatus] = useState("");
  const audioCtxRef = useRef(null);
  const trackTimeoutRef = useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (trackTimeoutRef.current) {
        clearTimeout(trackTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseMoveOffset = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xOffset = (x / rect.width) - 0.5;
    const yOffset = (y / rect.height) - 0.5;
    el.style.setProperty("--x-offset", `${xOffset}`);
    el.style.setProperty("--y-offset", `${yOffset}`);
  };

  const handleMouseLeaveOffset = (e) => {
    const el = e.currentTarget;
    el.style.setProperty("--x-offset", "0");
    el.style.setProperty("--y-offset", "0");
  };

  // Fetch products from our api route
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          // Take first 3 products for homepage showcase
          setProducts(data.products ? data.products.slice(0, 3) : []);
        }
      } catch (err) {
        console.error("Failed to fetch products for homepage showcase:", err);
      }
    }
    fetchProducts();
  }, []);

  const handleAddProduct = (product) => {
    // Default to first variant
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : "All Size";
    const res = addToCart(product, variant);
    if (res.success) {
      setCartStatus(
        lang === "id" 
          ? `Berhasil menambahkan ${product.name} ke keranjang!` 
          : `Successfully added ${product.name} to cart!`
      );
      setTimeout(() => setCartStatus(""), 3000);
    } else {
      setCartStatus(res.error);
      setTimeout(() => setCartStatus(""), 3000);
    }
  };

  // Balinese Pentatonic (Selisir) Synthesizer Melody
  const playGamelanSynth = (trackIndex) => {
    if (typeof window === "undefined") return;

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      
      // Pentatonic Gamelan Selisir (approximate MIDI frequencies)
      // Ding, Dong, Deng, Dung, Dang
      const scales = [
        [261.63, 293.66, 329.63, 392.00, 440.00, 523.25], // Track 1 / Day 1
        [293.66, 329.63, 392.00, 440.00, 587.33, 659.25], // Track 2 / Day 2
        [329.63, 392.00, 440.00, 523.25, 659.25, 783.99], // Track 3 / Day 3
        [392.00, 440.00, 523.25, 587.33, 783.99, 880.00], // Track 4 / Day 4
      ];

      const melody = scales[trackIndex] || scales[0];
      const tempo = 0.22; // Seconds between notes

      melody.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Triangle wave gives a bell-like hollow texture
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * tempo);

        // Simple vibrato lfo
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(8, ctx.currentTime);
        lfoGain.gain.setValueAtTime(freq * 0.012, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        // Gamelan chime envelope: sharp attack, long exponential decay
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * tempo);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * tempo + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * tempo + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        lfo.start(ctx.currentTime + idx * tempo);
        osc.start(ctx.currentTime + idx * tempo);

        lfo.stop(ctx.currentTime + idx * tempo + 0.9);
        osc.stop(ctx.currentTime + idx * tempo + 0.9);
      });
    } catch (e) {
      console.error("Audio Context failed:", e);
    }
  };

  const selectTrack = (idx) => {
    if (trackTimeoutRef.current) {
      clearTimeout(trackTimeoutRef.current);
    }

    if (activeTrack === idx && isAudioPlaying) {
      setIsAudioPlaying(false);
      return;
    }

    setActiveTrack(idx);
    setIsAudioPlaying(true);
    playGamelanSynth(idx);

    trackTimeoutRef.current = setTimeout(() => {
      setIsAudioPlaying(false);
    }, 2000);
  };

  const togglePlayback = () => {
    if (activeTrack === null) {
      selectTrack(0);
    } else {
      if (isAudioPlaying) {
        setIsAudioPlaying(false);
        if (trackTimeoutRef.current) {
          clearTimeout(trackTimeoutRef.current);
        }
      } else {
        setIsAudioPlaying(true);
        playGamelanSynth(activeTrack);
        if (trackTimeoutRef.current) {
          clearTimeout(trackTimeoutRef.current);
        }
        trackTimeoutRef.current = setTimeout(() => {
          setIsAudioPlaying(false);
        }, 2000);
      }
    }
  };

  const tracks = [
    { id: 0, day: t.rundown.days.fri19, name: t.rundown.events.parade.title, desc: t.rundown.events.parade.desc },
    { id: 1, day: t.rundown.days.sat20, name: t.rundown.events.jegegBagus.title, desc: t.rundown.events.jegegBagus.desc },
    { id: 2, day: t.rundown.days.sun21, name: t.rundown.events.funRun.title, desc: t.rundown.events.funRun.desc },
    { id: 3, day: t.rundown.days.mon22, name: t.rundown.events.peakDay.title, desc: t.rundown.events.peakDay.desc },
  ];

  return (
    <div className={`home-reskin ${isFestivalMode ? "festival-mode-active" : ""}`}>
      {/* SECTION 1: HERO SCREEN */}
      <section className="screen screen_one">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="main-video"
        >
          <source src="/bumper.mp4" type="video/mp4" />
        </video>
        
        {/* Dynamic Dark Mode Gradients and Noise overlays */}
        <div className="festivalmodegrad" />
        <div className="festivalmodegraddop" />
        
        <div className="screen-inner">
          <div className="hero-typography">
            <div className="hero-logo-container">
              <img 
                src="/logo-karangasem-festival.png" 
                alt="Karangasem Festival" 
                className="hero-logo" 
              />
            </div>
            <p className="hero-tagline">{isFestivalMode ? `"${t.homepage.quoteSad}"` : `"${t.hero.tagline}"`}</p>
          </div>

          <div className="hero-interactive">
            <CountdownTimer />
            
            <div className="hero-ctas">
              <Link className="hero-btn primary" href="/rundown">
                📅 {t.hero.ctaRundown}
              </Link>
              <a 
                className="hero-btn secondary" 
                href="https://wa.me/628123456789?text=Halo%20Admin%2C%20saya%20ingin%20mendaftar%20Karangasem%20East%20Run%202026" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                🏃 {t.hero.ctaTicket}
              </a>
              <Link className="hero-btn secondary" href="/merchandise">
                🛍️ {t.hero.ctaMerch}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THEME INTRODUCTION (ARTS & CULTURE) */}
      <section className="screen screen_two">
        <div className="section-grid-lines" />
        <div className="screen-inner centered-layout">
          <div className="text-mask-wrapper">
            <div className="giant-mask-text">
              {isFestivalMode ? t.homepage.psychoTitle.toUpperCase() : t.homepage.culturalTitle.toUpperCase()}
            </div>
          </div>

          <div className="intro-card-content">
            <span className="section-num">[01]</span>
            <h3 className="intro-header">{t.homepage.introTitle}</h3>
            <p className="intro-text">
              {isFestivalMode ? t.homepage.introTextSad : t.homepage.introText}
            </p>
            <div className="intro-meta">
              <span>HUT AMLAPURA 386</span>
              <span>19 – 22 JUNI 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PERJALANAN KARANGASEM FESTIVAL */}
      <section className="screen screen_three">
        <div className="section-grid-lines" />
        <div className="screen-inner centered-layout">
          <div className="grid-header">
            <span className="section-num">[02]</span>
            <h2 className="grid-title">{lang === "id" ? "PERJALANAN KARANGASEM FESTIVAL" : "THE JOURNEY OF KARANGASEM FESTIVAL"}</h2>
            <p className="grid-subtitle">
              {lang === "id" 
                ? "Kilas balik sejarah panjang Kota Amlapura dari masa ke masa menuju perayaan Hari Jadi ke-386." 
                : "A brief retrospective of Amlapura's long history from past eras celebrating the 386th Anniversary."}
            </p>
          </div>

          <div className="journey-timeline">
            {/* Era 1 */}
            <div className="journey-node">
              <div className="journey-year-badge">1963</div>
              <h4 className="journey-node-title">{lang === "id" ? "Kelahiran Amlapura" : "Birth of Amlapura"}</h4>
              <p className="journey-node-desc">
                {lang === "id" 
                  ? "Pergantian nama dari Kuta Negara menjadi Amlapura pasca-erupsi Gunung Agung sebagai simbol kebangkitan dan harapan baru." 
                  : "Renamed from Kuta Negara to Amlapura post-eruption of Mount Agung as a symbol of resilience and new hope."}
              </p>
            </div>

            {/* Line connector */}
            <div className="journey-connector" />

            {/* Era 2 */}
            <div className="journey-node">
              <div className="journey-year-badge highlighted">22 JUNI</div>
              <h4 className="journey-node-title">{lang === "id" ? "HUT Kota Amlapura" : "Amlapura City Anniversary"}</h4>
              <p className="journey-node-desc">
                {lang === "id" 
                  ? "Peringatan hari jadi resmi setiap tahunnya sebagai momentum mempererat persatuan dan kebanggaan daerah." 
                  : "Official anniversary date celebrated annually as a momentum to strengthen unity and regional pride."}
              </p>
            </div>

            {/* Line connector */}
            <div className="journey-connector" />

            {/* Era 3 */}
            <div className="journey-node">
              <div className="journey-year-badge">KINI</div>
              <h4 className="journey-node-title">{lang === "id" ? "Kota Pusaka & Budaya" : "Heritage & Culture City"}</h4>
              <p className="journey-node-desc">
                {lang === "id" 
                  ? "Sinergi harmonis pelestarian pusaka sejarah arsitektur puri dengan pariwisata ekonomi kreatif modern." 
                  : "Harmonious synergy between royal heritage preservation and modern creative economy tourism."}
              </p>
            </div>
          </div>

          <div className="journey-footer">
            <Link href="/history" className="hero-btn primary">
              📖 {lang === "id" ? "Baca Sejarah Lengkap" : "Read Full History"}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: SOUNDBOARD RUNDOWN PLAYER */}
      <section className="screen screen_four">
        <div className="section-grid-lines" />
        <div className="screen-inner soundboard-layout">
          <div className="text-mask-wrapper left-aligned">
            <div className="giant-mask-text outline-only">
              {t.homepage.musicalTitle.toUpperCase()}
            </div>
          </div>

          <div className="soundboard-container">
            <div className="soundboard-header">
              <div>
                <span className="section-num">[03]</span>
                <h2 className="soundboard-title">{t.homepage.playlistTitle}</h2>
                <p className="soundboard-subtitle">{t.homepage.playlistDesc}</p>
              </div>

              {/* Central Audio Play Controller */}
              <div className="main-audio-control" onClick={togglePlayback}>
                <div className={`disc-spinner ${isAudioPlaying ? "spinning" : ""}`}>
                  <div className="disc-center" />
                </div>
                <div className="play-button-status">
                  <strong>{isAudioPlaying ? "PLAYING" : "PAUSED"}</strong>
                  <span>{activeTrack !== null ? `Track 0${activeTrack + 1}` : "No Track Selected"}</span>
                </div>
              </div>
            </div>

            {/* Tracklist table */}
            <div className="tracklist">
              {tracks.map((track, index) => (
                <div 
                  key={track.id}
                  className={`track-item ${activeTrack === index ? "active" : ""}`}
                  onClick={() => selectTrack(index)}
                  data-cursor="track"
                  data-cursor-text={isAudioPlaying && activeTrack === index ? "[stop]" : "[play]"}
                >
                  {/* Progress overlay fill */}
                  {activeTrack === index && isAudioPlaying && (
                    <div className="track-progress-fill" />
                  )}
                  <span className="track-index">0{index + 1}</span>
                  <div className="track-details">
                    <span className="track-day">{track.day}</span>
                    <strong className="track-name">{track.name}</strong>
                    <p className="track-desc">{track.desc}</p>
                  </div>
                  <div className="track-play-indicator">
                    {activeTrack === index && isAudioPlaying ? (
                      <div className="eq-bar-container">
                        <span className="eq-bar bar1" />
                        <span className="eq-bar bar2" />
                        <span className="eq-bar bar3" />
                      </div>
                    ) : (
                      <span className="play-icon">▶</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="soundboard-actions">
              <Link className="hero-btn primary" href="/rundown">
                📅 {lang === "id" ? "Buka Jadwal Rundown Lengkap" : "Open Full Rundown Schedule"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: MERCHANDISE OVERLAPPING SHOWCASE */}
      <section className="screen screen_five">
        <div className="section-grid-lines" />
        <div className="screen-inner merch-showcase-layout">
          <div className="merch-header">
            <span className="section-num">[04]</span>
            <h2 className="merch-title">{t.homepage.merchTitle}</h2>
            <p className="merch-subtitle">{t.homepage.merchDesc}</p>
          </div>

          {cartStatus && (
            <div className="cart-toast">
              {cartStatus}
            </div>
          )}

          <div className="merch-cards-container">
            {products.map((product, idx) => (
              <div 
                key={product.id} 
                className={`merch-showcase-card index-${idx}`}
                style={{
                  "--index": idx
                }}
                data-cursor="merch"
                data-cursor-text={product.name}
                onMouseMove={handleMouseMoveOffset}
                onMouseLeave={handleMouseLeaveOffset}
              >
                <div 
                  className="merch-card-img" 
                  style={{
                    backgroundImage: product.imageData 
                      ? `url('${product.imageData}')` 
                      : `linear-gradient(135deg, ${product.accent1 || "#3388EB"}, ${product.accent2 || "#A22D43"})`
                  }}
                />
                <div className="merch-card-overlay">
                  <div className="merch-card-info">
                    <span className="merch-card-type">{product.type}</span>
                    <h4 className="merch-card-name">{product.name}</h4>
                    <span className="merch-card-price">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0
                      }).format(product.price)}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleAddProduct(product)}
                    className="merch-card-add-btn"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="merch-footer-actions">
            <Link className="hero-btn primary" href="/merchandise">
              🛒 {lang === "id" ? "Buka Toko Merchandise" : "Open Merchandise Shop"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
