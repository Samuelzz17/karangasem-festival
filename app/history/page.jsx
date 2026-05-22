"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "../../components/LanguageContext";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    year: "1963",
    era: "Purba",
    icon: "🌋",
    accent: "var(--blue)",
    accentHex: "#3388EB",
    keyId: "sub1",
  },
  {
    year: "June 22",
    era: "Kelahiran",
    icon: "👑",
    accent: "var(--orange)",
    accentHex: "#F2663A",
    keyId: "main",
  },
  {
    year: "Kini",
    era: "Pusaka",
    icon: "🏛️",
    accent: "var(--green)",
    accentHex: "#2ADEB3",
    keyId: "sub2",
  },
];

export default function HistoryPage() {
  const { t, lang } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── HERO ────────────────────────────────────────────────────
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .from(".hist-hero-tag", {
          y: -24,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(".hist-hero-giant .word", {
          y: 100,
          opacity: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "expo.out",
        }, "-=0.3")
        .from(".hist-hero-divider", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.8,
          ease: "expo.out",
        }, "-=0.5")
        .from(".hist-hero-desc", {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        }, "-=0.4")
        .from(".hist-hero-scroll", {
          opacity: 0,
          y: 10,
          duration: 0.5,
          ease: "power2.out",
        }, "-=0.3");

      // ── TIMELINE LINE DRAW ───────────────────────────────────────
      gsap.from(".hist-timeline-rail", {
        scrollTrigger: {
          trigger: ".hist-timeline-section",
          start: "top 70%",
        },
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.5,
        ease: "power3.inOut",
      });

      // ── CHAPTER CARDS ────────────────────────────────────────────
      gsap.utils.toArray(".hist-chapter").forEach((el, i) => {
        const isEven = i % 2 === 0;

        // Year badge
        gsap.from(el.querySelector(".hist-chapter-year"), {
          scrollTrigger: { trigger: el, start: "top 78%" },
          x: isEven ? -60 : 60,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
        });

        // Content card
        gsap.from(el.querySelector(".hist-chapter-card"), {
          scrollTrigger: { trigger: el, start: "top 75%" },
          y: 60,
          opacity: 0,
          duration: 0.9,
          delay: 0.1,
          ease: "power3.out",
        });

        // Marker dot
        gsap.from(el.querySelector(".hist-dot"), {
          scrollTrigger: { trigger: el, start: "top 75%" },
          scale: 0,
          opacity: 0,
          duration: 0.6,
          delay: 0.15,
          ease: "back.out(2)",
        });
      });

      // ── BIG YEAR COUNTER (scroll parallax) ──────────────────────
      gsap.utils.toArray(".hist-bg-year").forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el.closest(".hist-chapter"),
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
          y: -80,
          ease: "none",
        });
      });

      // ── HERITAGE STRIP ──────────────────────────────────────────
      gsap.from(".hist-heritage-item", {
        scrollTrigger: {
          trigger: ".hist-heritage-strip",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });

      // ── CTA ──────────────────────────────────────────────────────
      gsap.from(".hist-cta-section > *", {
        scrollTrigger: {
          trigger: ".hist-cta-section",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const chapterTitles = [
    { title: t.history.sub1Title, desc: t.history.sub1Desc },
    { title: t.history.title, desc: t.history.desc },
    { title: t.history.sub2Title, desc: t.history.sub2Desc },
  ];

  return (
    <div ref={containerRef} className="hist-reskin">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="hist-screen hist-hero-screen">
        <div className="hist-screen-grid" />

        <div className="hist-hero-inner">
          <div className="hist-hero-content">
            <span className="hist-hero-tag">
              [{t.history.eyebrow}]
            </span>

            <h1 className="hist-hero-giant">
              <span className="word">SEJARAH</span>
              <span className="word outline">AMLAPURA</span>
            </h1>

            <div className="hist-hero-divider" />

            <p className="hist-hero-desc">{t.history.desc}</p>

            <div className="hist-hero-scroll">
              <span className="hist-scroll-line" />
              <span>{lang === "id" ? "kronologi di bawah" : "timeline below"}</span>
            </div>
          </div>

          {/* Right side — decorative year stack */}
          <div className="hist-hero-deco">
            <div className="hist-hero-deco-year">1963</div>
            <div className="hist-hero-deco-slash">/</div>
            <div className="hist-hero-deco-year present">2026</div>
            <div className="hist-hero-deco-label">
              {lang === "id" ? "Dari masa lampau menuju masa kini" : "From past to present"}
            </div>
          </div>
        </div>

        <div className="hist-gold-bar" />
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────── */}
      <section className="hist-screen hist-timeline-section">
        <div className="hist-screen-grid" />

        <div className="hist-timeline-header">
          <span className="hist-section-label">[02] — {lang === "id" ? "Kronologi" : "Timeline"}</span>
          <div className="hist-timeline-giant-mask">KRONOLOGI</div>
        </div>

        <div className="hist-timeline-body">
          {/* Vertical rail */}
          <div className="hist-timeline-rail" />

          {CHAPTERS.map((ch, i) => {
            const content = chapterTitles[i];
            const isEven = i % 2 === 0;
            return (
              <div
                key={ch.year}
                className={`hist-chapter ${isEven ? "hist-chapter-left" : "hist-chapter-right"}`}
                style={{ "--ch-accent": ch.accent, "--ch-accent-hex": ch.accentHex }}
              >
                {/* Background giant year */}
                <div className="hist-bg-year">{ch.year}</div>

                {/* Year badge (outside card) */}
                <div className="hist-chapter-year">
                  <span className="hist-year-icon">{ch.icon}</span>
                  <span className="hist-year-num">{ch.year}</span>
                  <span className="hist-year-era">{ch.era}</span>
                </div>

                {/* Center dot on rail */}
                <div className="hist-dot" />

                {/* Content card */}
                <div className="hist-chapter-card">
                  <div className="hist-card-accent-bar" />
                  <h2 className="hist-card-title">{content.title}</h2>
                  <p className="hist-card-desc">{content.desc}</p>
                  <div className="hist-card-index">{String(i + 1).padStart(2, "0")}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HERITAGE STRIP ───────────────────────────────────────── */}
      <div className="hist-heritage-strip">
        <div className="hist-heritage-gold-line" />
        {[
          { icon: "🏯", label: lang === "id" ? "Puri Agung" : "Royal Palace" },
          { icon: "💧", label: lang === "id" ? "Taman Ujung" : "Water Palace" },
          { icon: "🌺", label: lang === "id" ? "Pura Lempuyang" : "Lempuyang Temple" },
          { icon: "🌋", label: lang === "id" ? "Gunung Agung" : "Mount Agung" },
          { icon: "🌊", label: lang === "id" ? "Pantai Tulamben" : "Tulamben Beach" },
        ].map((item, i) => (
          <div key={i} className="hist-heritage-item">
            <span className="hist-heritage-icon">{item.icon}</span>
            <span className="hist-heritage-label">{item.label}</span>
          </div>
        ))}
        <div className="hist-heritage-gold-line" />
      </div>

      {/* ── STAT BLOCK ───────────────────────────────────────────── */}
      <section className="hist-screen hist-stat-section">
        <div className="hist-screen-grid" />
        <div className="hist-stat-inner">
          <div className="hist-stat-left">
            <span className="hist-section-label">[03] — {lang === "id" ? "Identitas Kota" : "City Identity"}</span>
            <div className="hist-stat-giant">386</div>
            <div className="hist-stat-sub">
              {lang === "id" ? "Tahun perjalanan panjang\nAmlapura berdiri" : "Years of Amlapura's\nlong journey"}
            </div>
          </div>
          <div className="hist-stat-right">
            <div className="hist-fact-grid">
              {[
                { num: "1963", desc: lang === "id" ? "Tahun pergantian nama dari Kuta Negara menjadi Amlapura" : "Year renamed from Kuta Negara to Amlapura" },
                { num: "June 22", desc: lang === "id" ? "Tanggal resmi HUT Kota Amlapura setiap tahunnya" : "Official anniversary date of Amlapura City" },
                { num: "386", desc: lang === "id" ? "Usia kota Amlapura pada perayaan 2026 ini" : "Age of Amlapura celebrated in 2026" },
                { num: "HUT", desc: lang === "id" ? "Hari Ulang Tahun — perayaan identitas & kebanggaan daerah" : "Anniversary celebration of regional identity & pride" },
              ].map((fact, i) => (
                <div key={i} className="hist-fact-item">
                  <span className="hist-fact-num">{fact.num}</span>
                  <span className="hist-fact-desc">{fact.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="hist-cta-section">
        <div className="hist-cta-giant">
          {lang === "id" ? "Jadilah Bagian\nDari Sejarah Ini" : "Be Part of\nThis History"}
        </div>
        <p className="hist-cta-sub">
          {lang === "id"
            ? "Karangasem Festival 2026 · 19–22 Juni · Amlapura"
            : "Karangasem Festival 2026 · June 19–22 · Amlapura"}
        </p>
        <div className="hist-cta-btns">
          <Link href="/rundown" className="hero-btn primary">
            📅 {t.hero.ctaRundown}
          </Link>
          <Link href="/about" className="hero-btn secondary">
            ℹ️ {lang === "id" ? "Tentang Festival" : "About Festival"}
          </Link>
        </div>
      </section>

    </div>
  );
}
