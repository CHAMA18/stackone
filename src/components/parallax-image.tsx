"use client";

import { useEffect, useRef, useCallback } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.1,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.top > viewportHeight || rect.bottom < 0) return;

    const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
    const translateY = (progress - 0.5) * speed * 200;

    imageRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.1)`;
  }, [speed]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <img
        ref={imageRef}
        alt={alt}
        className="w-full h-full object-cover will-change-transform"
        style={{ transform: "scale(1.1)" }}
        src={src}
      />
    </div>
  );
}
