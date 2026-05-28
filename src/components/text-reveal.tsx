"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = children.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden mr-[0.3em]"
        >
          <span
            className="inline-block transition-all duration-700 ease-out"
            style={{
              transform: isVisible
                ? "translate3d(0, 0, 0)"
                : "translate3d(0, 100%, 0)",
              opacity: isVisible ? 1 : 0,
              transitionDelay: `${delay + i * 60}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </div>
  );
}
