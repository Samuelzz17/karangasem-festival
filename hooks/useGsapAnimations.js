"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * useHomeGsap — GSAP animations for the HomePage sections
 * 
 * Animates:
 * - Hero typography (stagger slide-up on load)
 * - Hero CTA buttons (stagger fade-in)
 * - Section 2: giant mask text + intro card (ScrollTrigger)
 * - Section 3: initials boxes (stagger from scale 0, ScrollTrigger)
 * - Section 4: soundboard tracklist (stagger from right, ScrollTrigger)
 * - Section 5: merch cards (stagger scale from bottom, ScrollTrigger)
 * - Section num labels (fade-slide from left, ScrollTrigger)
 */
export function useHomeGsap(refs) {
  useEffect(() => {
    const ctx = gsap.context(() => {

      // ----------------------------------------------------------------
      // HERO SECTION — timeline on load
      // ----------------------------------------------------------------
      const heroTl = gsap.timeline({ delay: 0.3 });

      heroTl
        .from(".eyebrow-accent", {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .from(
          ".hero-main-title",
          {
            y: 80,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
          },
          "-=0.4"
        )
        .from(
          ".hero-main-title .stroke-text",
          {
            x: -40,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
          },
          "-=0.6"
        )
        .from(
          ".hero-main-subtitle",
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          ".hero-tagline",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          ".hero-interactive",
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          ".hero-btn",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.5"
        );

      // ----------------------------------------------------------------
      // SECTION 2 — THEME INTRO (ScrollTrigger)
      // ----------------------------------------------------------------
      gsap.from(".giant-mask-text", {
        scrollTrigger: {
          trigger: ".screen_two",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
      });

      gsap.from(".intro-card-content", {
        scrollTrigger: {
          trigger: ".screen_two",
          start: "top 70%",
          toggleActions: "play none none none",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".intro-meta span", {
        scrollTrigger: {
          trigger: ".intro-meta",
          start: "top 90%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
      });

      // ----------------------------------------------------------------
      // SECTION 3 — VISUAL KEY / INITIALS GRID (ScrollTrigger)
      // ----------------------------------------------------------------
      gsap.from(".grid-header", {
        scrollTrigger: {
          trigger: ".screen_three",
          start: "top 75%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".initials-box", {
        scrollTrigger: {
          trigger: ".initials-grid",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        scale: 0.7,
        opacity: 0,
        rotation: -5,
        duration: 0.9,
        stagger: 0.12,
        ease: "back.out(1.7)",
      });

      gsap.from(".svg-line", {
        scrollTrigger: {
          trigger: ".initials-grid",
          start: "top 75%",
          toggleActions: "play none none none",
        },
        strokeDashoffset: 200,
        strokeDasharray: 200,
        opacity: 0,
        duration: 1.2,
        stagger: 0.06,
        ease: "power3.inOut",
      });

      // ----------------------------------------------------------------
      // SECTION 4 — SOUNDBOARD PLAYER (ScrollTrigger)
      // ----------------------------------------------------------------
      gsap.from(".soundboard-header", {
        scrollTrigger: {
          trigger: ".screen_four",
          start: "top 75%",
          toggleActions: "play none none none",
        },
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".main-audio-control", {
        scrollTrigger: {
          trigger: ".soundboard-container",
          start: "top 70%",
          toggleActions: "play none none none",
        },
        scale: 0.6,
        opacity: 0,
        rotation: 180,
        duration: 0.9,
        ease: "back.out(1.4)",
      });

      gsap.from(".track-item", {
        scrollTrigger: {
          trigger: ".tracklist",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        x: 80,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });

      // ----------------------------------------------------------------
      // SECTION 5 — MERCHANDISE SHOWCASE (ScrollTrigger)
      // ----------------------------------------------------------------
      gsap.from(".merch-header", {
        scrollTrigger: {
          trigger: ".screen_five",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".merch-showcase-card", {
        scrollTrigger: {
          trigger: ".merch-cards-container",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // ----------------------------------------------------------------
      // SECTION NUM LABELS — all [01], [02], [03], [04]
      // ----------------------------------------------------------------
      gsap.utils.toArray(".section-num").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          x: -30,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      });

      // ----------------------------------------------------------------
      // SECTION GRID LINES — sweep from top
      // ----------------------------------------------------------------
      gsap.utils.toArray(".section-grid-lines").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.8,
          ease: "power3.out",
        });
      });

    }); // end gsap.context

    return () => ctx.revert(); // cleanup on unmount
  }, []);
}

/**
 * useSiteHeaderGsap — animate header entrance
 */
export function useSiteHeaderGsap() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".header", {
        y: -80,
        opacity: 0,
        duration: 0.9,
        delay: 0.1,
        ease: "power3.out",
      });

      gsap.from(".header-bottom", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        delay: 0.5,
        ease: "expo.out",
      });
    });

    return () => ctx.revert();
  }, []);
}

/**
 * usePreloaderGsap — GSAP timeline for preloader exit animation
 * Returns a function to trigger the exit animation
 */
export function buildPreloaderExitTimeline(onComplete) {
  const tl = gsap.timeline({ onComplete, paused: true });

  tl.to(".prelCub", {
    scaleY: 0,
    transformOrigin: "bottom center",
    duration: 0.6,
    stagger: 0.08,
    ease: "power4.inOut",
  })
    .to(
      ".prelTop, .prelBottom, .prelCenter",
      {
        opacity: 0,
        y: -30,
        duration: 0.4,
        stagger: 0.06,
        ease: "power2.out",
      },
      0
    )
    .to(
      ".prel",
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.2"
    );

  return tl;
}
