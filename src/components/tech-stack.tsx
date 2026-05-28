"use client";

import { useEffect, useRef, useCallback } from "react";

const TECH_CATEGORIES = [
  {
    category: "Frontend",
    icon: "web",
    technologies: [
      { name: "React", icon: "code" },
      { name: "Next.js", icon: "framework" },
      { name: "TypeScript", icon: "data_object" },
      { name: "Tailwind CSS", icon: "palette" },
      { name: "Three.js", icon: "3d_rotation" },
      { name: "Framer Motion", icon: "animation" },
    ],
  },
  {
    category: "Backend",
    icon: "dns",
    technologies: [
      { name: "Node.js", icon: "terminal" },
      { name: "Python", icon: "psychology" },
      { name: "Rust", icon: "speed" },
      { name: "Go", icon: "rocket_launch" },
      { name: "GraphQL", icon: "hub" },
      { name: "gRPC", icon: "cable" },
    ],
  },
  {
    category: "Infrastructure",
    icon: "cloud",
    technologies: [
      { name: "AWS", icon: "cloud_queue" },
      { name: "Kubernetes", icon: "cluster" },
      { name: "Terraform", icon: "construction" },
      { name: "Docker", icon: "inventory_2" },
      { name: "Redis", icon: "bolt" },
      { name: "PostgreSQL", icon: "database" },
    ],
  },
  {
    category: "AI & Data",
    icon: "psychology",
    technologies: [
      { name: "PyTorch", icon: "neurology" },
      { name: "LangChain", icon: "link" },
      { name: "Spark", icon: "local_fire_department" },
      { name: "Kafka", icon: "stream" },
      { name: "Vector DB", icon: "grid_on" },
      { name: "MLflow", icon: "science" },
    ],
  },
];

export function TechStack() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = useCallback((e: MouseEvent, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--hover-x", `${x}%`);
    card.style.setProperty("--hover-y", `${y}%`);
  }, []);

  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const handler = (e: MouseEvent) => handleMouseMove(e, index);
      card.addEventListener("mousemove", handler);
    });

    return () => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const handler = (e: MouseEvent) => handleMouseMove(e, index);
        card.removeEventListener("mousemove", handler);
      });
    };
  }, [handleMouseMove]);

  return (
    <section className="py-24 md:py-36 px-6 md:px-20 relative" id="tech-stack">
      {/* Background accent */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-primary/[0.02] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium mb-4">
              Technology Arsenal
            </div>
            <h2 className="text-3xl md:text-5xl text-on-surface tracking-[-0.03em] font-bold leading-[1.1]">
              Our Tech
              <br />
              <span className="text-gradient-subtle">Stack</span>
            </h2>
          </div>
          <p className="text-base text-on-surface-variant/60 max-w-sm font-light leading-relaxed">
            We leverage the most powerful and battle-tested technologies to build
            solutions that perform at scale. Every tool is chosen with precision.
          </p>
        </div>

        {/* Tech grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH_CATEGORIES.map((category, catIndex) => (
            <div
              key={category.category}
              ref={(el) => { cardRefs.current[catIndex] = el; }}
              className="tech-card glass-panel rounded-2xl p-6 md:p-8 border border-white/[0.04]"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    {category.icon}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-on-surface tracking-[-0.01em]">
                  {category.category}
                </h3>
              </div>

              {/* Technologies list */}
              <div className="space-y-3">
                {category.technologies.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors duration-300 group/tech cursor-default"
                  >
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant/30 group-hover/tech:text-primary/60 transition-colors duration-300">
                      {tech.icon}
                    </span>
                    <span className="text-[13px] text-on-surface-variant/60 font-light group-hover/tech:text-on-surface-variant/90 transition-colors duration-300">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
