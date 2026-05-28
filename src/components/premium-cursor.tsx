"use client";

import { useEffect, useState } from "react";

export function PremiumCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (prefersReducedMotion || isTouchDevice) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });

      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.style.cursor === "pointer" ||
        window.getComputedStyle(target).cursor === "pointer";
      setIsPointer(isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer glow ring */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-screen"
        style={{
          left: position.x,
          top: position.y,
          width: isPointer ? 60 : 40,
          height: isPointer ? 60 : 40,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: `1px solid rgba(184, 195, 255, ${isClicking ? 0.6 : 0.3})`,
          backgroundColor: isPointer
            ? "rgba(46, 91, 255, 0.08)"
            : "transparent",
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.2s ease, background-color 0.3s ease",
        }}
      />
      {/* Inner dot */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: position.x,
          top: position.y,
          width: isClicking ? 4 : 6,
          height: isClicking ? 4 : 6,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          backgroundColor: "rgba(184, 195, 255, 0.9)",
          transition: "width 0.15s ease, height 0.15s ease",
          boxShadow: "0 0 8px rgba(46, 91, 255, 0.5)",
        }}
      />
    </>
  );
}
