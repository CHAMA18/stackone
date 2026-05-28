"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CARDS = [
  {
    icon: "architecture",
    title: "Product Strategy",
    tag: "Strategy",
    description:
      "Defining the roadmap from inception to launch. We identify market opportunities, validate technical feasibility, and craft product visions that align business objectives with user needs.",
    accent: "#3b6bff",
    accentLight: "rgba(59, 107, 255, 0.15)",
  },
  {
    icon: "code_blocks",
    title: "Full-Stack Development",
    tag: "Engineering",
    description:
      "End-to-end engineering with modern frameworks. From reactive frontends to resilient microservices, we build systems that scale gracefully under demanding conditions.",
    accent: "#6c5ce7",
    accentLight: "rgba(108, 92, 231, 0.15)",
  },
  {
    icon: "memory",
    title: "AI & Machine Learning",
    tag: "Intelligence",
    description:
      "Integrating intelligent algorithms to automate workflows and unlock insights. From predictive models to generative AI, we embed intelligence at the core of your product.",
    accent: "#00cec9",
    accentLight: "rgba(0, 206, 201, 0.15)",
  },
  {
    icon: "cloud",
    title: "Cloud Infrastructure",
    tag: "Infrastructure",
    description:
      "Architecting secure, scalable cloud environments optimized for performance. Multi-region deployments, zero-downtime releases, and infrastructure as code built for growth.",
    accent: "#fd79a8",
    accentLight: "rgba(253, 121, 168, 0.15)",
  },
];

export function ExpertiseCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Calculate how far through the sticky section we are
    const scrollableDistance = sectionHeight - viewportHeight;
    const scrolled = -sectionTop;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

    setScrollProgress(progress);
    setIsSticky(sectionTop <= 0 && rect.bottom > viewportHeight);

    // Determine active card based on progress
    const cardCount = CARDS.length;
    const activeIdx = Math.min(
      Math.floor(progress * cardCount),
      cardCount - 1
    );
    setActiveIndex(activeIdx);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Calculate horizontal offset based on scroll progress
  const maxOffset = CARDS.length * 100;
  const translateX = -scrollProgress * maxOffset;

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="relative"
      style={{
        height: `${CARDS.length * 100}vh`,
      }}
    >
      {/* Sticky viewport */}
      <div
        className={`sticky top-0 h-screen overflow-hidden transition-all duration-300 ${
          isSticky ? "" : ""
        }`}
      >
        {/* Background gradient that shifts with active card */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(
              ellipse 80% 60% at 50% 40%,
              ${CARDS[activeIndex].accentLight} 0%,
              transparent 70%
            )`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-20">
          {/* Section header */}
          <div className="max-w-[1440px] mx-auto w-full mb-12 md:mb-16">
            <div className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium mb-4">
              Core Competencies
            </div>
            <h2 className="text-3xl md:text-5xl text-on-surface tracking-[-0.03em] font-bold leading-[1.1]">
              Expertise &
              <br />
              <span className="text-gradient-subtle">Services</span>
            </h2>
          </div>

          {/* Card carousel track */}
          <div className="max-w-[1440px] mx-auto w-full overflow-visible">
            <div
              ref={trackRef}
              className="flex gap-6 md:gap-8 transition-transform duration-100 ease-out"
              style={{
                transform: `translate3d(${translateX}vw, 0, 0)`,
                willChange: "transform",
              }}
            >
              {CARDS.map((card, i) => {
                const isActive = i === activeIndex;
                const distance = Math.abs(i - activeIndex);
                const isPast = i < activeIndex;

                // 3D perspective transforms
                const rotateY = isActive
                  ? 0
                  : isPast
                    ? -12
                    : 8;
                const scale = isActive ? 1 : Math.max(0.85, 1 - distance * 0.08);
                const opacity = isActive ? 1 : Math.max(0.3, 1 - distance * 0.35);
                const translateZ = isActive ? 0 : -60 * distance;

                return (
                  <div
                    key={card.title}
                    className="shrink-0 w-[85vw] md:w-[45vw] lg:w-[32vw]"
                    style={{
                      perspective: "1200px",
                      opacity,
                      transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div
                      className="relative rounded-3xl overflow-hidden transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
                      style={{
                        transform: `rotateY(${rotateY}deg) scale(${scale}) translateZ(${translateZ}px)`,
                        transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.7s ease, border-color 0.7s ease",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Card content */}
                      <div
                        className="relative p-8 md:p-10 border transition-all duration-700"
                        style={{
                          background: isActive
                            ? `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`
                            : `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
                          backdropFilter: "blur(20px) saturate(1.2)",
                          borderColor: isActive
                            ? `${card.accent}33`
                            : "rgba(255, 255, 255, 0.04)",
                          boxShadow: isActive
                            ? `0 20px 80px rgba(0,0,0,0.3), 0 0 60px ${card.accentLight}, inset 0 1px 0 rgba(255,255,255,0.06)`
                            : "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
                          minHeight: "380px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Animated accent line at top */}
                        <div
                          className="absolute top-0 left-0 h-[2px] transition-all duration-700 ease-out"
                          style={{
                            width: isActive ? "100%" : "0%",
                            background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
                            opacity: isActive ? 1 : 0,
                          }}
                        />

                        {/* Floating glow orb */}
                        <div
                          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] transition-opacity duration-700"
                          style={{
                            backgroundColor: card.accent,
                            opacity: isActive ? 0.08 : 0,
                          }}
                        />

                        <div className="relative z-10">
                          {/* Icon */}
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500"
                            style={{
                              backgroundColor: isActive
                                ? card.accentLight
                                : "rgba(255,255,255,0.03)",
                              boxShadow: isActive
                                ? `0 0 20px ${card.accentLight}`
                                : "none",
                            }}
                          >
                            <span
                              className="material-symbols-outlined text-[24px] transition-colors duration-500"
                              style={{
                                color: isActive ? card.accent : "#8b9fff",
                              }}
                            >
                              {card.icon}
                            </span>
                          </div>

                          {/* Tag */}
                          <div
                            className="uppercase tracking-[0.15em] text-[9px] font-medium mb-3 transition-colors duration-500"
                            style={{
                              color: isActive ? card.accent : "rgba(139, 159, 255, 0.3)",
                            }}
                          >
                            {card.tag}
                          </div>

                          {/* Title */}
                          <h3 className="text-xl md:text-2xl font-bold text-on-surface mb-4 tracking-[-0.01em] leading-tight">
                            {card.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm md:text-base text-on-surface-variant/50 font-light leading-relaxed">
                            {card.description}
                          </p>
                        </div>

                        {/* Bottom CTA - visible on active */}
                        <div
                          className="relative z-10 mt-8 flex items-center gap-2 transition-all duration-500"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive
                              ? "translateY(0)"
                              : "translateY(8px)",
                          }}
                        >
                          <span
                            className="uppercase tracking-[0.15em] text-[10px] font-medium"
                            style={{ color: card.accent }}
                          >
                            Learn More
                          </span>
                          <span
                            className="material-symbols-outlined text-[16px]"
                            style={{ color: card.accent }}
                          >
                            arrow_forward
                          </span>
                        </div>

                        {/* Corner number */}
                        <div
                          className="absolute bottom-6 right-8 text-[80px] font-bold leading-none transition-all duration-700"
                          style={{
                            color: isActive
                              ? `${card.accent}10`
                              : "rgba(255,255,255,0.02)",
                            transform: isActive ? "scale(1)" : "scale(0.9)",
                          }}
                        >
                          0{i + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress indicators */}
          <div className="max-w-[1440px] mx-auto w-full mt-10 md:mt-14 flex items-center gap-3">
            {CARDS.map((card, i) => (
              <div key={card.title} className="flex items-center gap-3">
                <button
                  className="group relative h-[3px] rounded-full transition-all duration-500 cursor-pointer"
                  style={{
                    width: i === activeIndex ? "48px" : "24px",
                    backgroundColor:
                      i === activeIndex ? card.accent : "rgba(255,255,255,0.08)",
                    boxShadow:
                      i === activeIndex
                        ? `0 0 12px ${card.accent}40`
                        : "none",
                  }}
                  onClick={() => {
                    const section = sectionRef.current;
                    if (!section) return;
                    const targetProgress = i / CARDS.length;
                    const scrollableDistance =
                      section.offsetHeight - window.innerHeight;
                    const targetScroll =
                      section.offsetTop + targetProgress * scrollableDistance;
                    window.scrollTo({
                      top: targetScroll,
                      behavior: "smooth",
                    });
                  }}
                />
              </div>
            ))}
            <span className="ml-4 text-[10px] text-on-surface-variant/30 uppercase tracking-[0.15em] font-mono font-medium">
              {String(activeIndex + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Scroll hint - only visible when at the beginning */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-opacity duration-500"
          style={{ opacity: scrollProgress < 0.05 ? 0.4 : 0 }}
        >
          <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-[0.3em] font-medium">
            Scroll to explore
          </span>
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant/30 animate-bounce">
            arrow_downward
          </span>
        </div>
      </div>
    </section>
  );
}
