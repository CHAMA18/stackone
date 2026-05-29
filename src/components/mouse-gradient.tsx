"use client";

import { useEffect } from "react";

export function MouseGradient() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const heroGradient = document.getElementById("hero-gradient");
    if (!heroGradient) return;

    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth) * 100;
          const y = (e.clientY / window.innerHeight) * 100;
          heroGradient.style.setProperty("--mouse-x", `${x}%`);
          heroGradient.style.setProperty("--mouse-y", `${y}%`);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return null;
}
