"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          setProgress(scrollPercent);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[100]">
      <div
        className="h-full bg-gradient-to-r from-primary-container via-primary to-primary-container"
        style={{
          width: `${progress}%`,
          transition: "width 0.1s linear",
          boxShadow: "0 0 8px rgba(46, 91, 255, 0.5), 0 0 20px rgba(46, 91, 255, 0.2)",
        }}
      />
    </div>
  );
}
