"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "../../components/LanguageContext";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const { t, lang, isSadMode } = useLanguage();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── HERO SECTION ──────────────────────────────────────────────
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .from(".about-hero-tag", {
          y: -30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .from(".about-hero-giant", {
          y: 120,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
        }, "-=0.4")
        .from(".about-hero-body", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.6")
        .from(".about-hero-scroll-hint", {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        }, "-=0.3");

      // ── THEME SECTION ─────────────────────────────────────────────
      gsap.from(".about-theme-label", {
        scrollTrigger: {
          trigger: ".about-theme-section",
          start: "top 80%",
        },
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".about-theme-giant", {
        scrollTrigger: {
          trigger: ".about-theme-section",
          start: "top 70%",
        },
        x: 100,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
      });

      gsap.from(".about-theme-card", {
        scrollTrigger: {
          trigger: ".about-theme-card",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.4)",
      });

      // ── GOALS SECTION ─────────────────────────────────────────────
      gsap.from(".about-goals-eyebrow", {
        scrollTrigger: {
          trigger: ".about-goals-section",
          start: "top 80%",
        },
        x: -40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(".goal-card-new", {
        scrollTrigger: {
          trigger: ".about-goals-grid-new",
          start: "top 75%",
        },
        y: 80,
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
        stagger: 0.12,
        ease: "back.out(1.6)",
      });

      // ── VISUAL IDENTITY SECTION ───────────────────────────────────
      gsap.from(".about-vi-header", {
        scrollTrigger: {
          trigger: ".about-vi-section",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".vi-card-new", {
        scrollTrigger: {
          trigger: ".vi-cards-track",
          start: "top 80%",
        },
        x: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // ── STATS STRIP ───────────────────────────────────────────────
      gsap.from(".about-stat-item", {
        scrollTrigger: {
          trigger: ".about-stats-strip",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });

      // ── CTA SECTION ───────────────────────────────────────────────
      gsap.from(".about-cta-section > *", {
        scrollTrigger: {
          trigger: ".about-cta-section",
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

  return (
    <div ref={containerRef} className="about-reskin">

      {/* ── SECTION 1: HERO ─────────────────────────────────────── */}
      <section className="about-screen about-hero-screen">
        <div className="about-screen-grid-lines" />

        <div className="about-hero-inner">
          <div className="about-hero-left">
            <span className="about-hero-tag">
              [{lang === "id" ? "Tentang Festival" : "About the Festival"}]
            </span>

            <div className="about-hero-giant-wrap">
              <div className="about-hero-giant">KARANGASEM</div>
              <div className="about-hero-giant outline">FESTIVAL</div>
              <div className="about-hero-giant muted">2026</div>
            </div>

            <div className="about-hero-scroll-hint">
              <span className="scroll-dot" />
              <span>{lang === "id" ? "scroll untuk menjelajah" : "scroll to explore"}</span>
            </div>
          </div>

          <div className="about-hero-right">
            <div className="about-hero-body">
              <p className="about-hero-desc">{t.about.desc}</p>
              <div className="about-hero-meta">
                <div className="about-hero-meta-item">
                  <span className="about-hero-meta-num">386</span>
                  <span className="about-hero-meta-label">{lang === "id" ? "Tahun HUT Amlapura" : "Years Anniversary"}</span>
                </div>
                <div className="about-hero-meta-item">
                  <span className="about-hero-meta-num">4</span>
                  <span className="about-hero-meta-label">{lang === "id" ? "Hari Penuh Acara" : "Days of Events"}</span>
                </div>
                <div className="about-hero-meta-item">
                  <span className="about-hero-meta-num">100+</span>
                  <span className="about-hero-meta-label">{lang === "id" ? "Stan UMKM" : "MSME Booths"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gold accent bar */}
        <div className="about-gold-bar" />
      </section>

      {/* ── SECTION 2: THEME / PHILOSOPHY ──────────────────────── */}
      <section className="about-screen about-theme-section">
        <div className="about-screen-grid-lines" />

        <div className="about-theme-bg-text">TEMA</div>

        <div className="about-theme-inner">
          <div className="about-theme-label-row">
            <span className="about-theme-label">[02] — {lang === "id" ? "Filosofi & Tema" : "Philosophy & Theme"}</span>
          </div>

          <div className="about-theme-giant">
            {lang === "id" ? "Tidak Mudah," : "Not Easy,"}
            <br />
            <span className="about-theme-giant-stroke">
              {lang === "id" ? "Tapi Harus Bisa" : "But We Can."}
            </span>
          </div>

          <div className="about-theme-card">
            <div className="about-theme-card-badge">
              {t.about.philosophyTheme}
            </div>
            <p className="about-theme-card-body">{t.about.philosophyMeaning}</p>
            <div className="about-theme-card-accent" />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: GOALS / TUJUAN ──────────────────────────── */}
      <section className="about-screen about-goals-section">
        <div className="about-screen-grid-lines" />

        <div className="about-goals-header">
          <div className="about-goals-eyebrow">
            <span>[03] — {t.about.goalsTitle}</span>
          </div>
          <div className="about-goals-giant-mask">
            {lang === "id" ? "TUJUAN" : "GOALS"}
          </div>
        </div>

        <div className="about-goals-grid-new">
          {[
            { num: "01", title: t.about.goal1Title, desc: t.about.goal1Desc, accent: "var(--blue)", icon: "🏛️" },
            { num: "02", title: t.about.goal2Title, desc: t.about.goal2Desc, accent: "var(--orange)", icon: "💡" },
            { num: "03", title: t.about.goal3Title, desc: t.about.goal3Desc, accent: "var(--green)", icon: "🌏" },
            { num: "04", title: t.about.goal4Title, desc: t.about.goal4Desc, accent: "var(--peach)", icon: "🤝" },
          ].map((goal) => (
            <div
              key={goal.num}
              className="goal-card-new"
              style={{ "--goal-accent": goal.accent }}
            >
              <div className="goal-card-top">
                <span className="goal-card-icon">{goal.icon}</span>
                <span className="goal-card-num">{goal.num}</span>
              </div>
              <h3 className="goal-card-title">{goal.title}</h3>
              <p className="goal-card-desc">{goal.desc}</p>
              <div className="goal-card-line" />
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: STATS STRIP ─────────────────────────────── */}
      <div className="about-stats-strip">
        <div className="about-stats-gold-line" />
        {[
          { num: "19–22", sub: lang === "id" ? "Juni 2026" : "June 2026" },
          { num: "Amlapura", sub: lang === "id" ? "Kota Tuan Rumah" : "Host City" },
          { num: "CBB", sub: lang === "id" ? "Taman Budaya Candra Bhuana" : "Candra Bhuana Cultural Park" },
          { num: "KF26", sub: lang === "id" ? "Kode Resmi Festival" : "Official Festival Code" },
        ].map((stat, i) => (
          <div key={i} className="about-stat-item">
            <span className="about-stat-num">{stat.num}</span>
            <span className="about-stat-sub">{stat.sub}</span>
          </div>
        ))}
        <div className="about-stats-gold-line" />
      </div>

      {/* ── SECTION 5: VISUAL IDENTITY ─────────────────────────── */}
      <section className="about-screen about-vi-section">
        <div className="about-screen-grid-lines" />

        <div className="about-vi-header">
          <span className="about-vi-label">[04] — {t.about.visualIdentityTitle}</span>
          <h2 className="about-vi-title">{lang === "id" ? "Panduan Visual" : "Visual Guidelines"}</h2>
          <p className="about-vi-desc">{t.about.visualIdentityDesc}</p>
        </div>

        <div className="vi-cards-track">
          {/* Dark Blue Card */}
          <div className="vi-card-new vi-card-darkblue">
            <div className="vi-card-badge">
              {t.about.cardDarkBlueTitle}
            </div>
            <p className="vi-card-body">{t.about.cardDarkBlueDesc}</p>
            <div className="vi-card-sample">
              <span className="vi-card-sample-label">{t.about.sampleTextLabel}</span>
              <blockquote>
                Lorem<br />
                Ipsum sample text<br />
                Lorem ipsum dolor sit amet,<br />
                consectetur adipiscing elit.
              </blockquote>
            </div>
            <div className="vi-card-noise" />
          </div>

          {/* Gold Accent Card */}
          <div className="vi-card-new vi-card-gold">
            <div className="vi-card-badge">
              {t.about.cardGoldTitle}
            </div>
            <p className="vi-card-body">{t.about.cardGoldDesc}</p>
            <div className="vi-card-sample">
              <span className="vi-card-sample-label">{t.about.sampleTextLabel}</span>
              <blockquote>
                Lorem<br />
                Ipsum sample text<br />
                Lorem ipsum dolor sit amet,<br />
                consectetur adipiscing elit.
              </blockquote>
            </div>
            <div className="vi-card-gold-bar" />
          </div>

          {/* Alt BG Card */}
          <div className="vi-card-new vi-card-alt">
            <div className="vi-card-badge">
              {t.about.cardAltBgTitle}
            </div>
            <p className="vi-card-body">{t.about.cardAltBgDesc}</p>
            <div className="vi-card-sample">
              <span className="vi-card-sample-label">{t.about.sampleTextLabel}</span>
              <blockquote>
                Lorem<br />
                Ipsum sample text<br />
                Lorem ipsum dolor sit amet,<br />
                consectetur adipiscing elit.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: CTA ─────────────────────────────────────── */}
      <section className="about-cta-section">
        <div className="about-cta-giant">
          {lang === "id" ? "Bergabung Bersama Kami" : "Join Us"}
        </div>
        <p className="about-cta-sub">
          {lang === "id"
            ? "19 – 22 Juni 2026 · Taman Budaya Candra Bhuana, Amlapura"
            : "June 19 – 22, 2026 · Candra Bhuana Cultural Park, Amlapura"}
        </p>
        <div className="about-cta-btns">
          <Link href="/rundown" className="hero-btn primary">
            📅 {t.hero.ctaRundown}
          </Link>
          <Link href="/merchandise" className="hero-btn secondary">
            🛍️ {t.hero.ctaMerch}
          </Link>
        </div>
      </section>

    </div>
  );
}
