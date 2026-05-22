"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "./LanguageContext";

export default function CustomCursor() {
  const { isAudioPlaying } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [targetPos, setTargetPos] = useState({ x: -200, y: -200 });
  const [hoverType, setHoverType] = useState(null);
  const [hoverText, setHoverText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const requestRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target.closest("[data-cursor]");
      if (target) {
        const type = target.getAttribute("data-cursor");
        const text = target.getAttribute("data-cursor-text");
        setHoverType(type);
        setHoverText(text || "");
      } else {
        setHoverType(null);
        setHoverText("");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Smooth lerp animation for cursor position
  useEffect(() => {
    let currentX = mousePos.x;
    let currentY = mousePos.y;

    const animateCursor = () => {
      const lerp = 0.15; // trailing speed factor
      currentX += (targetPos.x - currentX) * lerp;
      currentY += (targetPos.y - currentY) * lerp;
      setMousePos({ x: currentX, y: currentY });
      requestRef.current = requestAnimationFrame(animateCursor);
    };

    requestRef.current = requestAnimationFrame(animateCursor);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [targetPos]);

  if (!isVisible || !hoverType) return null;

  if (hoverType === "track") {
    return (
      <div
        className="trackball visible"
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        {hoverText || (isAudioPlaying ? "[stop]" : "[play]")}
      </div>
    );
  }

  if (hoverType === "merch") {
    return (
      <div
        className="alball visible"
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        {hoverText}
      </div>
    );
  }

  return null;
}
