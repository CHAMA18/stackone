"use client";

import { useState, useEffect, useCallback } from "react";
import { ScrollReveal } from "./scroll-reveal";

const TESTIMONIALS = [
  {
    quote:
      "StackOne didn't just build our platform — they reimagined what was possible. Their engineering excellence turned a complex financial system into something that feels effortless.",
    author: "Sarah Mitchell",
    role: "CTO, Meridian Capital",
    company: "Meridian Capital",
  },
  {
    quote:
      "Working with StackOne was transformative. Their ability to translate our vision into a scalable, high-performance architecture exceeded every expectation we had.",
    author: "David Park",
    role: "VP Engineering, Helix Health",
    company: "Helix Health",
  },
  {
    quote:
      "The team's precision and attention to detail is unmatched. They delivered a system that processes millions of events per second without breaking a sweat.",
    author: "Amara Okafor",
    role: "Head of Product, Pulse Analytics",
    company: "Pulse Analytics",
  },
  {
    quote:
      "StackOne brings a rare combination of deep technical expertise and design sensibility. They are the only team we trust with our most critical infrastructure.",
    author: "James Whitfield",
    role: "CEO, NovaBridge Logistics",
    company: "NovaBridge Logistics",
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const current = TESTIMONIALS[activeIndex];

  return (
    <section className="py-24 md:py-36 px-6 md:px-20 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/4 w-[700px] h-[500px] bg-primary/[0.02] blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section header */}
        <ScrollReveal>
          <div className="mb-20 text-center">
            <div className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium mb-4">
              Client Voices
            </div>
            <h2 className="text-3xl md:text-5xl text-on-surface tracking-[-0.03em] font-bold leading-[1.1]">
              What Our Partners
              <br />
              <span className="text-gradient-subtle">Say About Us</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Testimonial card */}
        <div className="max-w-4xl mx-auto">
          <div
            className="testimonial-card glass-panel-elevated rounded-3xl p-10 md:p-16 relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Decorative quote mark */}
            <div className="absolute top-8 left-8 md:top-10 md:left-10 text-[80px] md:text-[120px] font-bold text-primary/[0.04] leading-none pointer-events-none select-none">
              &ldquo;
            </div>

            {/* Quote content with animation */}
            <div className="relative z-10">
              <div
                key={activeIndex}
                className="animate-slide-up-fade"
                style={{ animationDuration: "0.6s" }}
              >
                <blockquote className="text-xl md:text-2xl lg:text-3xl text-on-surface/90 font-light leading-relaxed md:leading-relaxed mb-10 md:mb-14 tracking-[-0.01em]">
                  {current.quote}
                </blockquote>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base md:text-lg font-semibold text-on-surface tracking-[-0.01em]">
                      {current.author}
                    </div>
                    <div className="text-sm text-on-surface-variant/50 font-light mt-1">
                      {current.role}
                    </div>
                  </div>

                  {/* Company badge */}
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02]">
                    <span className="material-symbols-outlined text-[14px] text-primary/50">
                      business
                    </span>
                    <span className="text-[11px] text-on-surface-variant/50 font-medium">
                      {current.company}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex items-center gap-2 mt-10">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveIndex(i);
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 10000);
                  }}
                  className="h-[3px] rounded-full transition-all duration-500 cursor-pointer"
                  style={{
                    width: i === activeIndex ? "32px" : "16px",
                    backgroundColor:
                      i === activeIndex
                        ? "rgba(139, 159, 255, 0.6)"
                        : "rgba(255, 255, 255, 0.08)",
                    boxShadow:
                      i === activeIndex
                        ? "0 0 12px rgba(139, 159, 255, 0.3)"
                        : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
