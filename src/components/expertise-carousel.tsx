"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CARDS = [
  {
    icon: "architecture",
    title: "Product Strategy",
    tag: "Strategy",
    description:
      "Defining the roadmap from inception to launch. We identify market opportunities, validate technical feasibility, and craft product visions that align business objectives with user needs to create sustainable competitive advantages.",
    features: ["Market Analysis", "Product Roadmapping", "User Research", "Competitive Intelligence"],
    accent: "#3b6bff",
    accentLight: "rgba(59, 107, 255, 0.15)",
    accentMid: "rgba(59, 107, 255, 0.06)",
  },
  {
    icon: "code_blocks",
    title: "Full-Stack Development",
    tag: "Engineering",
    description:
      "End-to-end engineering with modern frameworks. From reactive frontends to resilient microservices, we build systems that scale gracefully under demanding conditions and deliver exceptional user experiences.",
    features: ["React / Next.js", "Microservices", "API Design", "Performance Optimization"],
    accent: "#6c5ce7",
    accentLight: "rgba(108, 92, 231, 0.15)",
    accentMid: "rgba(108, 92, 231, 0.06)",
  },
  {
    icon: "memory",
    title: "AI & Machine Learning",
    tag: "Intelligence",
    description:
      "Integrating intelligent algorithms to automate workflows and unlock insights. From predictive models to generative AI, we embed intelligence at the core of your product to drive efficiency and innovation.",
    features: ["LLM Integration", "Predictive Models", "Computer Vision", "NLP Pipelines"],
    accent: "#00cec9",
    accentLight: "rgba(0, 206, 201, 0.15)",
    accentMid: "rgba(0, 206, 201, 0.06)",
  },
  {
    icon: "cloud",
    title: "Cloud Infrastructure",
    tag: "Infrastructure",
    description:
      "Architecting secure, scalable cloud environments optimized for performance. Multi-region deployments, zero-downtime releases, and infrastructure as code built for growth and enterprise-grade reliability.",
    features: ["AWS / GCP / Azure", "Kubernetes", "CI/CD Pipelines", "Infrastructure as Code"],
    accent: "#fd79a8",
    accentLight: "rgba(253, 121, 168, 0.15)",
    accentMid: "rgba(253, 121, 168, 0.06)",
  },
];

export function ExpertiseCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
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

    const scrollableDistance = sectionHeight - viewportHeight;
    const scrolled = -sectionTop;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

    setScrollProgress(progress);
    setIsSticky(sectionTop <= 0 && rect.bottom > viewportHeight);

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
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Animated background gradient that shifts with active card */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `radial-gradient(
              ellipse 80% 60% at 50% 40%,
              ${CARDS[activeIndex].accentLight} 0%,
              transparent 70%
            )`,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Floating decorative particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4 + i * 2,
                height: 4 + i * 2,
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0, 15, 0],
                x: [0, 10, -5, 8, 0],
                opacity: [0.15, 0.3, 0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  backgroundColor: CARDS[activeIndex].accent,
                  opacity: 0.3,
                  filter: "blur(1px)",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-20">
          {/* Section header */}
          <div className="max-w-[1440px] mx-auto w-full mb-12 md:mb-16">
            <motion.div
              className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium mb-4"
              animate={{ opacity: isSticky ? 1 : 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Core Competencies
            </motion.div>
            <h2 className="text-3xl md:text-5xl text-on-surface tracking-[-0.03em] font-bold leading-[1.1]">
              Expertise &
              <br />
              <span className="text-gradient-subtle">Services</span>
            </h2>
          </div>

          {/* Card carousel track */}
          <div className="max-w-[1440px] mx-auto w-full overflow-visible">
            <motion.div
              className="flex gap-6 md:gap-8"
              animate={{
                x: `${translateX}vw`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              style={{
                willChange: "transform",
              }}
            >
              {CARDS.map((card, i) => {
                const isActive = i === activeIndex;
                const distance = Math.abs(i - activeIndex);
                const isPast = i < activeIndex;

                const rotateY = isActive ? 0 : isPast ? -15 : 10;
                const scale = isActive ? 1 : Math.max(0.82, 1 - distance * 0.09);
                const opacity = isActive ? 1 : Math.max(0.25, 1 - distance * 0.4);
                const translateZ = isActive ? 0 : -80 * distance;

                return (
                  <div
                    key={card.title}
                    className="shrink-0 w-[85vw] md:w-[45vw] lg:w-[32vw]"
                    style={{
                      perspective: "1200px",
                    }}
                  >
                    <motion.div
                      className="relative rounded-3xl overflow-hidden"
                      animate={{
                        rotateY,
                        scale,
                        translateZ,
                        opacity,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                        mass: 1,
                      }}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Card content */}
                      <motion.div
                        className="relative p-8 md:p-10 border"
                        animate={{
                          background: isActive
                            ? `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`
                            : `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
                          borderColor: isActive
                            ? `${card.accent}33`
                            : "rgba(255, 255, 255, 0.04)",
                          boxShadow: isActive
                            ? `0 20px 80px rgba(0,0,0,0.3), 0 0 60px ${card.accentLight}, inset 0 1px 0 rgba(255,255,255,0.06)`
                            : "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        style={{
                          backdropFilter: "blur(20px) saturate(1.2)",
                          minHeight: "420px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Animated accent line at top */}
                        <motion.div
                          className="absolute top-0 left-0 h-[2px]"
                          animate={{
                            width: isActive ? "100%" : "0%",
                            opacity: isActive ? 1 : 0,
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          style={{
                            background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
                          }}
                        />

                        {/* Floating glow orb */}
                        <motion.div
                          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px]"
                          animate={{
                            opacity: isActive ? 0.1 : 0,
                            scale: isActive ? 1 : 0.8,
                          }}
                          transition={{ duration: 0.8 }}
                          style={{
                            backgroundColor: card.accent,
                          }}
                        />

                        <div className="relative z-10">
                          {/* Icon */}
                          <motion.div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
                            animate={{
                              backgroundColor: isActive
                                ? card.accentLight
                                : "rgba(255,255,255,0.03)",
                              boxShadow: isActive
                                ? `0 0 30px ${card.accentLight}`
                                : "none",
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.span
                              className="material-symbols-outlined text-[24px]"
                              animate={{
                                color: isActive ? card.accent : "#8b9fff",
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              {card.icon}
                            </motion.span>
                          </motion.div>

                          {/* Tag */}
                          <motion.div
                            className="uppercase tracking-[0.15em] text-[9px] font-medium mb-3"
                            animate={{
                              color: isActive
                                ? card.accent
                                : "rgba(139, 159, 255, 0.3)",
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            {card.tag}
                          </motion.div>

                          {/* Title */}
                          <h3 className="text-xl md:text-2xl font-bold text-on-surface mb-4 tracking-[-0.01em] leading-tight">
                            {card.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm md:text-base text-on-surface-variant/50 font-light leading-relaxed mb-6">
                            {card.description}
                          </p>

                          {/* Features list - visible on active */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                className="flex flex-wrap gap-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                              >
                                {card.features.map((feature, fi) => (
                                  <motion.span
                                    key={feature}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium uppercase tracking-[0.1em]"
                                    style={{
                                      backgroundColor: card.accentMid,
                                      color: card.accent,
                                      border: `1px solid ${card.accent}15`,
                                    }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + fi * 0.05 }}
                                  >
                                    {feature}
                                  </motion.span>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Bottom CTA - visible on active */}
                        <motion.div
                          className="relative z-10 mt-8 flex items-center gap-2"
                          animate={{
                            opacity: isActive ? 1 : 0,
                            y: isActive ? 0 : 8,
                          }}
                          transition={{ duration: 0.5, delay: 0.1 }}
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
                        </motion.div>

                        {/* Corner number */}
                        <motion.div
                          className="absolute bottom-6 right-8 text-[80px] font-bold leading-none pointer-events-none"
                          animate={{
                            color: isActive
                              ? `${card.accent}10`
                              : "rgba(255,255,255,0.02)",
                            scale: isActive ? 1 : 0.9,
                          }}
                          transition={{ duration: 0.7 }}
                        >
                          0{i + 1}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Progress indicators */}
          <div className="max-w-[1440px] mx-auto w-full mt-10 md:mt-14 flex items-center gap-3">
            {CARDS.map((card, i) => (
              <button
                key={card.title}
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
            ))}
            <span className="ml-4 text-[10px] text-on-surface-variant/30 uppercase tracking-[0.15em] font-mono font-medium">
              {String(activeIndex + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
          animate={{
            opacity: scrollProgress < 0.05 ? 0.4 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-[0.3em] font-medium">
            Scroll to explore
          </span>
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant/30 animate-bounce">
            arrow_downward
          </span>
        </motion.div>
      </div>
    </section>
  );
}
