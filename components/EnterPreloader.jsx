"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { useLanguage } from "./LanguageContext";

export default function EnterPreloader() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isEntering, setIsEntering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseVisible, setMouseVisible] = useState(false);
  const prelRef = useRef(null);
  const tlRef = useRef(null);

  // Check localStorage on mount + GSAP entrance animation
  useEffect(() => {
    const hasEntered = localStorage.getItem("kf-enter-preload");
    if (!hasEntered) {
      setShow(true);
    }
  }, []);

  // GSAP entrance animation when preloader mounts
  useEffect(() => {
    if (!show) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".prelTop-inner", {
        y: -40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          ".prelGif-imgwrap",
          {
            scale: 0.85,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
          },
          "-=0.3"
        )
        .from(
          ".prel_h",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .from(
          ".prelBottom",
          {
            y: 40,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        );
    });

    return () => ctx.revert();
  }, [show]);

  // Flickering image index cycle
  useEffect(() => {
    if (!show || isEntering) return;
    const interval = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % 6);
    }, 150);
    return () => clearInterval(interval);
  }, [show, isEntering]);

  // Track mouse coordinates for follow effect
  const handleMouseMove = (e) => {
    if (!prelRef.current) return;
    const rect = prelRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setMouseVisible(true);
  };

  const handleEnterClick = () => {
    if (isEntering) return;
    setIsEntering(true);
    localStorage.setItem("kf-enter-preload", "true");

    // GSAP exit timeline — much smoother than CSS transitions
    const tl = gsap.timeline({
      onComplete: () => {
        setShow(false);
      },
    });

    tl.to(".prelTop, .prelCenter, .prelBottom", {
      y: -40,
      opacity: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: "power2.in",
    })
      .to(
        ".prelCub",
        {
          scaleY: 0,
          transformOrigin: "bottom center",
          duration: 0.6,
          stagger: {
            each: 0.08,
            from: "center",
          },
          ease: "expo.inOut",
        },
        "-=0.2"
      )
      .to(
        ".prel",
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.1"
      );

    tlRef.current = tl;
  };

  if (!show) return null;

  const images = [
    "/preloader_1.png",
    "/preloader_2.png",
    "/preloader_3.png",
    "/preloader_4.png",
    "/preloader_5.png",
    "/preloader_6.png",
  ];

  return (
    <div
      ref={prelRef}
      className="prel"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseVisible(false)}
      onClick={handleEnterClick}
    >
      {/* Custom Cursor Follower */}
      {mouseVisible && (
        <div
          className="prball"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: "translate(-50%, -50%)",
            position: "absolute",
          }}
        >
          {t.preloader.enter}
        </div>
      )}

      <div className="prelWrap">
        <div className="prelInner">
          {/* Vertical sliding panels */}
          <div className="prelCubs">
            <div className="prelCub" />
            <div className="prelCub" />
            <div className="prelCub" />
            <div className="prelCub" />
            <div className="prelCub" />
          </div>

          {/* Welcome Text top */}
          <div className="prelTop">
            <div className="prelTop-inner">
              {t.preloader.welcome}<br />
              <span>{t.preloader.rights}</span>
            </div>
          </div>

          {/* Centered marquee and flickering images */}
          <div className="prelCenter">
            <div className="prelGif">
              <div className="prelGif-imgwrap">
                <div className="prelGif-imginner">
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className="ghimg"
                      style={{
                        backgroundImage: `url(${src})`,
                        backgroundPosition: "50% 50%",
                        backgroundSize: "cover",
                        backgroundOrigin: "content-box",
                        backgroundRepeat: "no-repeat",
                        opacity: activeImgIndex === idx ? 1 : 0,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="prelGif-inner" />
            </div>

            {/* Scrolling Marquee text */}
            <div className="prel_h">
              {t.preloader.tagline} • {t.preloader.tagline} • {t.preloader.tagline}
            </div>

            {/* Mobile Fallback text */}
            <div className="prball-alter">{t.preloader.enter}</div>
          </div>

          {/* Footer branding */}
          <div className="prelBottom">
            <div className="prelBottom-innerTop">
              <img src="/logo.png" alt="Karangasem Festival" />
            </div>
            <div className="prelBottom-inner">
              {t.preloader.credits}<br />
              <span>{t.preloader.made}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
