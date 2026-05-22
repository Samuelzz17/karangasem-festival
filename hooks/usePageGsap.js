"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Generic page entrance animation:
 * Animates .page-eyebrow, .page-title, .page-desc, .page-body-content, cards, etc.
 */
export function usePageEntranceGsap() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow tag
      gsap.from(".page-eyebrow", {
        y: -20,
        opacity: 0,
        duration: 0.6,
        delay: 0.15,
        ease: "power3.out",
      });

      // Main page title
      gsap.from(".page-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.25,
        ease: "expo.out",
      });

      // Description paragraph
      gsap.from(".page-desc", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.45,
        ease: "power3.out",
      });

      // Generic content blocks via ScrollTrigger
      gsap.utils.toArray(".gsap-reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      // Cards / grid items (stagger)
      gsap.utils.toArray(".gsap-stagger-card").forEach((container) => {
        const cards = container.querySelectorAll
          ? container.querySelectorAll("[class*='card'], [class*='item'], li")
          : [];

        if (cards.length > 0) {
          gsap.from(cards, {
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            y: 60,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          });
        }
      });

      // Rundown event groups
      gsap.utils.toArray(".rundown-group").forEach((group) => {
        gsap.from(group, {
          scrollTrigger: {
            trigger: group,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          x: -60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        const items = group.querySelectorAll(".rundown-item");
        if (items.length > 0) {
          gsap.from(items, {
            scrollTrigger: {
              trigger: group,
              start: "top 75%",
              toggleActions: "play none none none",
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
          });
        }
      });

      // Gallery album cards
      gsap.utils.toArray(".gallery-album").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 50,
          opacity: 0,
          scale: 0.95,
          duration: 0.7,
          delay: i * 0.05,
          ease: "power3.out",
        });
      });

      // Merch product cards
      gsap.utils.toArray(".product-card, .merch-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.06,
          ease: "power3.out",
        });
      });

      // History timeline entries
      gsap.utils.toArray(".history-entry, .timeline-item").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          x: i % 2 === 0 ? -60 : 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      // About goals / feature list
      gsap.utils.toArray(".goal-card, .feature-item, .about-card").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.07,
          ease: "back.out(1.4)",
        });
      });

      // Cart items
      gsap.utils.toArray(".cart-item").forEach((el, i) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.5,
          delay: 0.1 + i * 0.08,
          ease: "power2.out",
        });
      });
    });

    return () => ctx.revert();
  }, []);
}
