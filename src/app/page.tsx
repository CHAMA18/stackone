"use client";

import { HeroParticles } from "@/components/hero-particles";
import { MouseGradient } from "@/components/mouse-gradient";
import { PremiumCursor } from "@/components/premium-cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollReveal } from "@/components/scroll-reveal";

const NAV_LINKS = [
  { href: "#expertise", label: "Expertise" },
  { href: "#ventures", label: "Ventures" },
  { href: "#approach", label: "Approach" },
  { href: "#team", label: "Team" },
];

const EXPERTISE_CARDS = [
  {
    icon: "architecture",
    title: "Product Strategy",
    description:
      "Defining the roadmap from inception to launch. We identify market opportunities, validate technical feasibility, and craft product visions that align business objectives with user needs.",
    tag: "Strategy",
  },
  {
    icon: "code_blocks",
    title: "Full-Stack Development",
    description:
      "End-to-end engineering with modern frameworks. From reactive frontends to resilient microservices, we build systems that scale gracefully under demanding conditions.",
    tag: "Engineering",
  },
  {
    icon: "memory",
    title: "AI & Machine Learning",
    description:
      "Integrating intelligent algorithms to automate workflows and unlock insights. From predictive models to generative AI, we embed intelligence at the core of your product.",
    tag: "Intelligence",
  },
  {
    icon: "cloud",
    title: "Cloud Infrastructure",
    description:
      "Architecting secure, scalable cloud environments optimized for performance. Multi-region deployments, zero-downtime releases, and infrastructure as code built for growth.",
    tag: "Infrastructure",
  },
];

const STATS = [
  { value: "200+", label: "Projects Delivered" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "50ms", label: "Avg. Latency" },
  { value: "4.9/5", label: "Client Rating" },
];

const VENTURES = [
  {
    title: "Nexus Financial",
    description:
      "Real-time trading execution engine processing 10k+ transactions per second with sub-millisecond latency and 99.999% reliability.",
    tag: "Fintech",
    image: "/images/venture-nexus-financial.png",
    alt: "Nexus Financial — Real-time Trading Dashboard",
    offset: false,
  },
  {
    title: "AeroLogix",
    description:
      "Predictive maintenance AI for aerospace logistics, reducing fleet downtime by 34% and saving $12M annually in operational costs.",
    tag: "AI/ML",
    image: "/images/venture-aerologix.png",
    alt: "AeroLogix — Predictive Maintenance AI",
    offset: true,
  },
];

const APPROACH_STEPS = [
  {
    num: "01",
    title: "Discovery",
    description:
      "Deep contextual analysis to understand business objectives, user needs, and technical constraints that shape the solution space.",
    icon: "search",
  },
  {
    num: "02",
    title: "Architecture",
    description:
      "Designing resilient system blueprints, data models, and interaction paradigms that serve as the foundation for scalable growth.",
    icon: "grid_view",
  },
  {
    num: "03",
    title: "Engineering",
    description:
      "Precision-driven execution utilizing cutting-edge stacks, automated testing, and robust CI/CD pipelines that ensure quality at velocity.",
    icon: "terminal",
  },
  {
    num: "04",
    title: "Evolution",
    description:
      "Continuous monitoring, performance optimization, and strategic scaling post-deployment to ensure your product thrives in production.",
    icon: "trending_up",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Elena Vance",
    role: "Founder & CEO",
    description:
      "Visionary leader with 15+ years in disruptive technology and product strategy. Former VP of Engineering at two unicorn startups.",
    num: "01",
    image: "/images/team-elena-vance.png",
    alt: "Elena Vance — Founder & CEO",
  },
  {
    name: "Marcus Chen",
    role: "Chief Technology Officer",
    description:
      "Expert architect specializing in distributed systems and high-precision engineering. PhD in Computer Science from MIT.",
    num: "02",
    image: "/images/team-marcus-chen.png",
    alt: "Marcus Chen — Chief Technology Officer",
  },
  {
    name: "Sienna Rivers",
    role: "Design Director",
    description:
      "Award-winning designer focused on human-centric interfaces and brand narratives. Former Design Lead at a Fortune 100 company.",
    num: "03",
    image: "/images/team-sienna-rivers.png",
    alt: "Sienna Rivers — Design Director",
  },
];

const FOOTER_LINKS = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Settings",
  "Global Offices",
  "Careers",
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="bg-grain" />
      <div id="hero-gradient" />
      <MouseGradient />
      <PremiumCursor />
      <ScrollProgress />

      {/* ====== TOP NAVIGATION ====== */}
      <nav className="fixed top-0 w-full z-50 nav-blur bg-surface/70 border-b border-white/[0.04] transition-all duration-500">
        <div className="flex justify-between items-center px-6 md:px-20 h-20 w-full max-w-[1440px] mx-auto">
          <a
            className="text-xl md:text-2xl font-bold tracking-[-0.03em] text-on-surface flex items-center gap-3 group"
            href="#"
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-primary-container/20 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary/30 transition-all duration-300">
              <img
                alt="StackOne Logo"
                className="w-full h-full object-cover"
                src="/images/stackone-logo.png"
              />
            </div>
            <span className="text-gradient-subtle">StackOne</span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                className="text-on-surface-variant/70 hover:text-on-surface transition-colors duration-300 uppercase tracking-[0.2em] text-[10px] font-medium relative group"
                href={link.href}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <a
            className="hidden md:inline-flex items-center justify-center btn-primary text-white px-7 py-2.5 rounded-lg uppercase tracking-[0.15em] text-[10px] font-bold relative z-10"
            href="#contact"
          >
            <span className="relative z-10">Start a Project</span>
          </a>
        </div>
      </nav>

      {/* ====== MAIN CONTENT ====== */}
      <main className="pt-20 relative z-10 flex-1">
        {/* ====== HERO SECTION ====== */}
        <section
          className="relative min-h-screen flex items-center justify-center px-6 md:px-20 overflow-hidden"
          id="hero-section"
        >
          {/* Animated background orbs */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] animate-orb-1 pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-primary/3 blur-[100px] animate-orb-2 pointer-events-none" />

          <HeroParticles />

          <div className="relative z-10 max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 md:col-start-3 text-center space-y-10">
              {/* Status badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/[0.06] bg-surface-container-low/80 inner-glow animate-slide-down-fade">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container shadow-[0_0_10px_rgba(59,107,255,0.6)]" />
                </span>
                <span className="uppercase tracking-[0.2em] text-[10px] text-on-surface-variant/80 font-medium">
                  Defining Next-Gen Software
                </span>
              </div>

              {/* Main headline */}
              <h1 className="text-[clamp(40px,8vw,80px)] leading-[1.05] tracking-[-0.04em] font-bold text-gradient-hero animate-slide-up-fade delay-100">
                Engineering the
                <br />
                Extraordinary.
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-on-surface-variant/70 max-w-2xl mx-auto animate-slide-up-fade delay-200 font-light leading-relaxed">
                We build digital products for the world&apos;s most ambitious
                brands. Transforming complex challenges into elegant,
                high-performance solutions through precision engineering and
                visionary design.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up-fade delay-300">
                <a
                  className="w-full sm:w-auto inline-flex items-center justify-center btn-primary text-white px-10 py-4 rounded-lg hover:scale-[1.02] transition-all duration-400 ease-out uppercase tracking-[0.2em] text-[11px] font-bold relative z-10"
                  href="#expertise"
                >
                  <span className="relative z-10">Explore Services</span>
                </a>
                <a
                  className="w-full sm:w-auto inline-flex items-center justify-center btn-secondary px-10 py-4 rounded-lg transition-all duration-400 ease-out uppercase tracking-[0.2em] text-[11px] text-on-surface/80 font-medium"
                  href="#contact"
                >
                  Start a Project
                </a>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-500">
            <span className="text-on-surface-variant/30 text-[10px] uppercase tracking-[0.3em] font-medium">
              Scroll
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-on-surface-variant/30 to-transparent" />
          </div>
        </section>

        {/* Stats Bar */}
        <div className="section-divider" />
        <ScrollReveal direction="none">
          <section className="py-16 md:py-20 px-6 md:px-20">
            <div className="max-w-[1440px] mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                {STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`text-center ${i < STATS.length - 1 ? "md:border-r md:border-white/[0.06]" : ""}`}
                  >
                    <div className="text-3xl md:text-4xl font-bold text-gradient-subtle tracking-tight mb-2">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-on-surface-variant/50 uppercase tracking-[0.15em] font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
        <div className="section-divider" />

        {/* ====== EXPERTISE SECTION ====== */}
        <section className="py-24 md:py-36 px-6 md:px-20 relative" id="expertise">
          <div className="max-w-[1440px] mx-auto">
            {/* Section header */}
            <ScrollReveal>
              <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium mb-4">
                    Core Competencies
                  </div>
                  <h2 className="text-3xl md:text-5xl text-on-surface tracking-[-0.03em] font-bold leading-[1.1]">
                    Expertise &
                    <br />
                    <span className="text-gradient-subtle">Services</span>
                  </h2>
                </div>
                <p className="text-base text-on-surface-variant/60 max-w-sm font-light leading-relaxed">
                  Our core capabilities designed to architect scalable,
                  resilient, and forward-thinking digital platforms.
                </p>
              </div>
            </ScrollReveal>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {EXPERTISE_CARDS.map((card, i) => (
                <ScrollReveal key={card.title} delay={i * 80} direction="up" distance={30}>
                  <div className="glass-panel card-hover card-glow-border rounded-2xl p-8 h-full cursor-pointer group relative overflow-hidden">
                    {/* Subtle gradient accent on hover */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-7 text-primary group-hover:bg-primary/10 transition-colors duration-500">
                        <span className="material-symbols-outlined text-[22px]">
                          {card.icon}
                        </span>
                      </div>

                      <div className="uppercase tracking-[0.15em] text-[9px] text-primary/40 font-medium mb-3">
                        {card.tag}
                      </div>

                      <h3 className="text-lg font-semibold text-on-surface mb-3 tracking-[-0.01em]">
                        {card.title}
                      </h3>

                      <p className="text-sm text-on-surface-variant/60 font-light leading-relaxed">
                        {card.description}
                      </p>

                      <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
                        <span className="uppercase tracking-[0.15em] text-[9px] text-primary font-medium">
                          Discover
                        </span>
                        <span className="material-symbols-outlined text-primary text-[14px]">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ====== VENTURES SECTION ====== */}
        <section className="py-24 md:py-36 px-6 md:px-20 relative" id="ventures">
          <div className="max-w-[1440px] mx-auto">
            {/* Section header */}
            <ScrollReveal>
              <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium mb-4">
                    Recent Work
                  </div>
                  <h2 className="text-3xl md:text-5xl text-on-surface tracking-[-0.03em] font-bold leading-[1.1]">
                    Select
                    <br />
                    <span className="text-gradient-subtle">Ventures</span>
                  </h2>
                </div>
                <p className="text-base text-on-surface-variant/60 max-w-sm font-light leading-relaxed">
                  A curated selection of our most ambitious engineering and
                  design challenges.
                </p>
              </div>
            </ScrollReveal>

            {/* Ventures grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {VENTURES.map((venture, i) => (
                <ScrollReveal
                  key={venture.title}
                  delay={i * 120}
                  direction="up"
                  distance={40}
                >
                  <div
                    className={`group cursor-pointer ${venture.offset ? "md:mt-28" : ""}`}
                  >
                    <div className="venture-image-container aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-high relative mb-8 ring-1 ring-white/[0.04]">
                      <img
                        alt={venture.alt}
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                        src={venture.image}
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Floating badge on hover */}
                      <div className="absolute bottom-6 left-6 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] text-white px-5 py-2.5 rounded-full uppercase tracking-[0.2em] text-[9px] font-medium">
                          View Case Study
                          <span className="material-symbols-outlined text-[14px]">
                            arrow_outward
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors duration-300 tracking-[-0.01em]">
                          {venture.title}
                        </h3>
                        <p className="text-[15px] text-on-surface-variant/60 font-light leading-relaxed">
                          {venture.description}
                        </p>
                      </div>
                      <span className="shrink-0 uppercase tracking-[0.15em] text-[9px] text-on-surface-variant/40 border border-white/[0.06] px-3 py-1.5 rounded-md font-medium">
                        {venture.tag}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ====== APPROACH SECTION ====== */}
        <section className="py-24 md:py-36 px-6 md:px-20 relative" id="approach">
          <div className="max-w-[1440px] mx-auto">
            {/* Section header */}
            <ScrollReveal>
              <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium mb-4">
                    Methodology
                  </div>
                  <h2 className="text-3xl md:text-5xl text-on-surface tracking-[-0.03em] font-bold leading-[1.1]">
                    Our
                    <br />
                    <span className="text-gradient-subtle">Approach</span>
                  </h2>
                </div>
                <p className="text-base text-on-surface-variant/60 max-w-sm font-light leading-relaxed">
                  A rigorous, multi-disciplinary methodology ensuring
                  excellence from concept to deployment.
                </p>
              </div>
            </ScrollReveal>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute top-[28px] left-[3%] w-[94%] h-[1px] bg-gradient-to-r from-primary/20 via-white/[0.06] to-primary/20" />

              {APPROACH_STEPS.map((step, i) => (
                <ScrollReveal key={step.num} delay={i * 100} direction="up" distance={30}>
                  <div className="relative pt-8 md:pt-14 group">
                    {/* Timeline dot */}
                    <div
                      className={`hidden md:flex absolute top-0 left-0 w-7 h-7 rounded-full items-center justify-center z-10 -mt-[3px] transition-all duration-500 ${
                        i === 0
                          ? "bg-primary/20 border-2 border-primary"
                          : "bg-surface border-2 border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px] text-primary">
                        {step.icon}
                      </span>
                    </div>

                    <div className="text-[40px] font-light text-white/[0.04] mb-2 group-hover:text-primary/20 transition-colors duration-500">
                      {step.num}
                    </div>
                    <h3 className="text-lg font-semibold text-on-surface mb-3 tracking-[-0.01em]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant/50 font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ====== TEAM SECTION ====== */}
        <section
          className="py-24 md:py-36 px-6 md:px-20 relative overflow-hidden"
          id="team"
        >
          {/* Background accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full pointer-events-none" />

          <div className="max-w-[1440px] mx-auto relative z-10">
            {/* Section header */}
            <ScrollReveal>
              <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium mb-4">
                    Leadership Team
                  </div>
                  <h2 className="text-3xl md:text-5xl text-on-surface tracking-[-0.03em] font-bold leading-[1.1]">
                    The Minds Behind
                    <br />
                    <span className="text-gradient-subtle">the Extraordinary</span>
                  </h2>
                </div>
              </div>
            </ScrollReveal>

            {/* Team grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TEAM_MEMBERS.map((member, i) => (
                <ScrollReveal key={member.name} delay={i * 100} direction="up" distance={40}>
                  <div className="group relative cursor-pointer">
                    {/* Portrait */}
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-8 ring-1 ring-white/[0.04] grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:ring-primary/20 transition-all duration-700 shadow-2xl shadow-black/20">
                      <img
                        alt={member.alt}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                        src={member.image}
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-on-surface transition-colors duration-300 group-hover:text-primary tracking-[-0.01em]">
                          {member.name}
                        </h3>
                        <span className="text-[10px] text-white/10 font-mono">
                          {member.num}
                        </span>
                      </div>
                      <p className="text-[11px] text-primary/50 uppercase tracking-[0.2em] font-medium">
                        {member.role}
                      </p>
                      <p className="text-sm text-on-surface-variant/50 font-light leading-relaxed pt-1">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ====== CTA SECTION ====== */}
        <section className="py-24 md:py-36 px-6 md:px-20 relative" id="contact">
          <div className="max-w-[1440px] mx-auto">
            <ScrollReveal direction="scale" distance={0}>
              <div className="glass-panel-elevated rounded-3xl p-16 md:p-24 text-center border-t border-t-primary/20 relative overflow-hidden group">
                {/* Animated gradient bg on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                {/* Decorative orbs */}
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-[80px] animate-float-glow pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary/3 rounded-full blur-[80px] animate-float-glow pointer-events-none" style={{ animationDelay: "3s" }} />

                <div className="relative z-10">
                  <h2 className="text-[clamp(32px,6vw,64px)] tracking-[-0.04em] text-on-surface mb-6 font-bold leading-[1.1]">
                    Let&apos;s build the
                    <br />
                    <span className="text-shimmer">future.</span>
                  </h2>
                  <p className="text-lg md:text-xl text-on-surface-variant/60 max-w-xl mx-auto mb-12 font-light leading-relaxed">
                    Partner with StackOne to engineer your next extraordinary
                    digital product.
                  </p>
                  <a
                    className="relative z-10 inline-flex items-center justify-center btn-primary text-white px-14 py-5 rounded-xl hover:scale-[1.02] transition-all duration-400 uppercase tracking-[0.2em] text-[12px] font-bold shadow-xl shadow-primary/20"
                    href="#"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Start a Project
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="bg-surface-container-lowest border-t border-white/[0.04] w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 md:px-20 py-16 w-full max-w-[1440px] mx-auto">
          <div className="md:col-span-1">
            <div className="text-xl font-bold text-on-surface mb-4 tracking-[-0.02em] flex items-center gap-2">
              <div className="w-7 h-7 rounded-md overflow-hidden bg-primary-container/20 ring-1 ring-white/10">
                <img
                  alt="StackOne"
                  className="w-full h-full object-cover"
                  src="/images/stackone-logo.png"
                />
              </div>
              StackOne
            </div>
            <p className="text-[10px] text-on-surface-variant/30 uppercase tracking-[0.15em] leading-relaxed font-medium">
              © 2024 StackOne Architectural
              <br />
              Systems. All rights reserved.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-wrap gap-6 justify-start md:justify-end items-start pt-2 md:pt-4">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link}
                className="uppercase tracking-[0.15em] text-[10px] text-on-surface-variant/40 hover:text-primary transition-colors duration-300 font-medium"
                href="#"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
