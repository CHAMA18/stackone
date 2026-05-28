"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "./spotlight-card";

const CARDS = [
  {
    icon: "architecture",
    title: "Product Strategy",
    tag: "Strategy",
    description:
      "Defining the roadmap from inception to launch. We identify market opportunities, validate technical feasibility, and craft product visions that align business objectives with user needs to create sustainable competitive advantages.",
    features: ["Market Analysis", "Product Roadmapping", "User Research", "Competitive Intelligence"],
    accent: "#3b4fff",
    accentLight: "rgba(59, 79, 255, 0.12)",
    accentMid: "rgba(59, 79, 255, 0.05)",
  },
  {
    icon: "code_blocks",
    title: "Full-Stack Development",
    tag: "Engineering",
    description:
      "End-to-end engineering with modern frameworks. From reactive frontends to resilient microservices, we build systems that scale gracefully under demanding conditions and deliver exceptional user experiences.",
    features: ["React / Next.js", "Microservices", "API Design", "Performance Optimization"],
    accent: "#8b5cf6",
    accentLight: "rgba(139, 92, 246, 0.12)",
    accentMid: "rgba(139, 92, 246, 0.05)",
  },
  {
    icon: "memory",
    title: "AI & Machine Learning",
    tag: "Intelligence",
    description:
      "Integrating intelligent algorithms to automate workflows and unlock insights. From predictive models to generative AI, we embed intelligence at the core of your product to drive efficiency and innovation.",
    features: ["LLM Integration", "Predictive Models", "Computer Vision", "NLP Pipelines"],
    accent: "#06b6d4",
    accentLight: "rgba(6, 182, 212, 0.12)",
    accentMid: "rgba(6, 182, 212, 0.05)",
  },
  {
    icon: "cloud",
    title: "Cloud Infrastructure",
    tag: "Infrastructure",
    description:
      "Architecting secure, scalable cloud environments optimized for performance. Multi-region deployments, zero-downtime releases, and infrastructure as code built for growth and enterprise-grade reliability.",
    features: ["AWS / GCP / Azure", "Kubernetes", "CI/CD Pipelines", "Infrastructure as Code"],
    accent: "#f472b6",
    accentLight: "rgba(244, 114, 182, 0.12)",
    accentMid: "rgba(244, 114, 182, 0.05)",
  },
];

export function ExpertiseCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

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
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background gradient shift */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `radial-gradient(
              ellipse 70% 50% at 50% 40%,
              ${CARDS[activeIndex].accentMid} 0%,
              transparent 70%
            )`,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Floating ambient particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 3 + i * 1.5,
                height: 3 + i * 1.5,
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 4) * 22}%`,
              }}
              animate={{
                y: [0, -25, 0, 18, 0],
                x: [0, 12, -8, 10, 0],
                opacity: [0.1, 0.25, 0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.7,
              }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  backgroundColor: CARDS[activeIndex].accent,
                  opacity: 0.25,
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
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/[0.05] bg-white/[0.02] mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-container" />
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/50 font-medium">
                Core Competencies
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-[56px] text-on-surface tracking-[-0.04em] font-bold leading-[1.05]">
              Expertise &
              <br />
              <span className="text-gradient-subtle">Services</span>
            </h2>
          </div>

          {/* Card carousel track */}
          <div className="max-w-[1440px] mx-auto w-full overflow-visible">
            <motion.div
              className="flex gap-6 md:gap-8"
              animate={{ x: `${translateX}vw` }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 28,
                mass: 1,
              }}
              style={{ willChange: "transform" }}
            >
              {CARDS.map((card, i) => {
                const isActive = i === activeIndex;
                const distance = Math.abs(i - activeIndex);
                const isPast = i < activeIndex;

                const rotateY = isActive ? 0 : isPast ? -15 : 10;
                const scale = isActive ? 1 : Math.max(0.8, 1 - distance * 0.1);
                const opacity = isActive ? 1 : Math.max(0.2, 1 - distance * 0.45);
                const translateZ = isActive ? 0 : -100 * distance;

                return (
                  <div
                    key={card.title}
                    className="shrink-0 w-[85vw] md:w-[42vw] lg:w-[30vw]"
                    style={{ perspective: "1200px" }}
                  >
                    <motion.div
                      className="relative rounded-[24px] overflow-hidden"
                      animate={{ rotateY, scale, translateZ, opacity }}
                      transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 22,
                        mass: 1,
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <motion.div
                        className="relative p-8 md:p-10 border rounded-[24px]"
                        animate={{
                          background: isActive
                            ? `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`
                            : `linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)`,
                          borderColor: isActive
                            ? `${card.accent}25`
                            : "rgba(255, 255, 255, 0.03)",
                          boxShadow: isActive
                            ? `0 24px 80px rgba(0,0,0,0.4), 0 0 80px ${card.accentLight}, inset 0 1px 0 rgba(255,255,255,0.04)`
                            : "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.02)",
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        style={{
                          backdropFilter: "blur(16px) saturate(1.1)",
                          minHeight: "440px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Top accent line */}
                        <motion.div
                          className="absolute top-0 left-0 h-[2px]"
                          animate={{
                            width: isActive ? "100%" : "0%",
                            opacity: isActive ? 1 : 0,
                          }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          style={{
                            background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
                          }}
                        />

                        {/* Glow orb */}
                        <motion.div
                          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px]"
                          animate={{
                            opacity: isActive ? 0.12 : 0,
                            scale: isActive ? 1 : 0.7,
                          }}
                          transition={{ duration: 0.8 }}
                          style={{ backgroundColor: card.accent }}
                        />

                        <div className="relative z-10">
                          {/* Icon */}
                          <motion.div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
                            animate={{
                              backgroundColor: isActive
                                ? card.accentLight
                                : "rgba(255,255,255,0.02)",
                              boxShadow: isActive
                                ? `0 0 40px ${card.accentLight}`
                                : "none",
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.span
                              className="material-symbols-outlined text-[24px]"
                              animate={{ color: isActive ? card.accent : "#6d7bff" }}
                              transition={{ duration: 0.5 }}
                            >
                              {card.icon}
                            </motion.span>
                          </motion.div>

                          {/* Tag */}
                          <motion.div
                            className="uppercase tracking-[0.2em] text-[9px] font-semibold mb-3"
                            animate={{
                              color: isActive ? card.accent : "rgba(109, 123, 255, 0.25)",
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            {card.tag}
                          </motion.div>

                          {/* Title */}
                          <h3 className="text-xl md:text-2xl font-bold text-on-surface mb-4 tracking-[-0.02em] leading-tight">
                            {card.title}
                          </h3>

                          {/* Description */}
                          <p className="text-[14px] text-on-surface-variant/45 font-light leading-relaxed mb-6">
                            {card.description}
                          </p>

                          {/* Features */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                className="flex flex-wrap gap-2"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                              >
                                {card.features.map((feature, fi) => (
                                  <motion.span
                                    key={feature}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-[0.12em]"
                                    style={{
                                      backgroundColor: card.accentMid,
                                      color: card.accent,
                                      border: `1px solid ${card.accent}12`,
                                    }}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.25 + fi * 0.05 }}
                                  >
                                    {feature}
                                  </motion.span>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Bottom CTA */}
                        <motion.div
                          className="relative z-10 mt-8 flex items-center gap-2"
                          animate={{
                            opacity: isActive ? 1 : 0,
                            y: isActive ? 0 : 10,
                          }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          <span
                            className="uppercase tracking-[0.18em] text-[10px] font-semibold"
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
                          className="absolute bottom-5 right-7 text-[90px] font-bold leading-none pointer-events-none select-none"
                          animate={{
                            color: isActive
                              ? `${card.accent}08`
                              : "rgba(255,255,255,0.015)",
                            scale: isActive ? 1 : 0.88,
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

          {/* Progress bar */}
          <div className="max-w-[1440px] mx-auto w-full mt-10 md:mt-14 flex items-center gap-3">
            {CARDS.map((card, i) => (
              <button
                key={card.title}
                className="h-[3px] rounded-full transition-all duration-500 cursor-pointer"
                style={{
                  width: i === activeIndex ? "52px" : "20px",
                  backgroundColor:
                    i === activeIndex ? card.accent : "rgba(255,255,255,0.06)",
                  boxShadow:
                    i === activeIndex
                      ? `0 0 16px ${card.accent}50`
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
            <span className="ml-4 text-[10px] text-on-surface-variant/20 uppercase tracking-[0.15em] font-mono font-medium">
              {String(activeIndex + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
          animate={{ opacity: scrollProgress < 0.05 ? 0.35 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] text-on-surface-variant/30 uppercase tracking-[0.3em] font-medium">
            Scroll to explore
          </span>
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant/25 animate-bounce">
            arrow_downward
          </span>
        </motion.div>
      </div>
    </section>
  );
}
