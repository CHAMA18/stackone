"use client";

import { HeroParticles } from "@/components/hero-particles";
import { MouseGradient } from "@/components/mouse-gradient";
import { PremiumCursor } from "@/components/premium-cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ExpertiseCarousel } from "@/components/expertise-carousel";
import { TrustMarquee } from "@/components/trust-marquee";
import { AnimatedCounter } from "@/components/animated-counter";
import { TechStack } from "@/components/tech-stack";
import { Testimonials } from "@/components/testimonials";
import { TextReveal } from "@/components/text-reveal";
import { ParallaxImage } from "@/components/parallax-image";
import { SpotlightCard } from "@/components/spotlight-card";
import { AuroraBackground } from "@/components/aurora-background";

const NAV_LINKS = [
  { href: "#expertise", label: "Expertise" },
  { href: "#ventures", label: "Work" },
  { href: "#approach", label: "Approach" },
  { href: "#team", label: "Team" },
];

const STATS = [
  { value: 200, suffix: "+", label: "Projects Delivered", prefix: "" },
  { value: 99.9, suffix: "%", label: "Uptime SLA", prefix: "" },
  { value: 50, suffix: "ms", label: "Avg. Latency", prefix: "" },
  { value: 4.9, suffix: "/5", label: "Client Rating", prefix: "" },
];

const VENTURES = [
  {
    title: "PayRoute Africa",
    description:
      "Seamless cross-border payment infrastructure connecting 40+ African currencies with real-time settlement, mobile money integration, and compliance across 25 countries. Powering the future of African commerce.",
    tag: "Fintech",
    logo: "/images/logo-payroute-africa.png",
    image: "/images/venture-payroute-africa.png",
    alt: "PayRoute Africa — Cross-border Payment Infrastructure",
    offset: false,
    metrics: [
      { label: "Countries", value: "25+" },
      { label: "Transactions/mo", value: "8M+" },
    ],
  },
  {
    title: "Dawa Clinic",
    description:
      "AI-powered telehealth platform bringing quality healthcare to underserved communities across Africa. Real-time video consultations, symptom triage, pharmacy delivery, and EHR integration serving 1.5M+ patients.",
    tag: "HealthTech",
    logo: "/images/logo-dawa-clinic.png",
    image: "/images/venture-dawa-clinic.png",
    alt: "Dawa Clinic — AI-powered Telehealth Platform",
    offset: true,
    metrics: [
      { label: "Patients Served", value: "1.5M+" },
      { label: "Clinics Connected", value: "340+" },
    ],
  },
  {
    title: "Event Space",
    description:
      "End-to-end event management and venue booking platform built for Africa's vibrant events industry. From weddings to conferences, manage ticketing, vendors, seating, and live streaming — all in one place.",
    tag: "EventTech",
    logo: "/images/logo-event-space.png",
    image: "/images/venture-event-space.png",
    alt: "Event Space — Event Management & Venue Booking",
    offset: false,
    metrics: [
      { label: "Events Hosted", value: "12K+" },
      { label: "Venues Listed", value: "2K+" },
    ],
  },
  {
    title: "AgroSync",
    description:
      "Precision agritech platform leveraging satellite imagery, IoT sensors, and AI to help 50K+ African farmers optimize yields, manage irrigation, and access real-time market pricing for smarter farming decisions.",
    tag: "AgriTech",
    logo: "/images/logo-agrosync.png",
    image: "/images/venture-agrosync.png",
    alt: "AgroSync — Precision Farming Intelligence",
    offset: true,
    metrics: [
      { label: "Farmers Empowered", value: "50K+" },
      { label: "Yield Increase", value: "28%" },
    ],
  },
  {
    title: "EduLift Africa",
    description:
      "Adaptive e-learning platform delivering accredited courses, vocational training, and mentorship to 800K+ learners across the continent. AI-personalized curricula in 12 languages with offline-first mobile access.",
    tag: "EdTech",
    logo: "/images/logo-edulift.png",
    image: "/images/venture-edulift.png",
    alt: "EduLift Africa — Adaptive E-Learning Platform",
    offset: false,
    metrics: [
      { label: "Active Learners", value: "800K+" },
      { label: "Languages", value: "12" },
    ],
  },
  {
    title: "SolarGrid",
    description:
      "Intelligent solar energy management platform optimizing off-grid and hybrid power systems across Africa. Real-time monitoring, predictive maintenance, and automated load balancing for 500+ installations.",
    tag: "CleanTech",
    logo: "/images/logo-solargrid.png",
    image: "/images/venture-solargrid.png",
    alt: "SolarGrid — Smart Solar Energy Management",
    offset: true,
    metrics: [
      { label: "Installations", value: "500+" },
      { label: "Energy Output", value: "120MW" },
    ],
  },
];

const APPROACH_STEPS = [
  {
    num: "01",
    title: "Discovery",
    description:
      "Deep contextual analysis to understand business objectives, user needs, and technical constraints. We conduct stakeholder interviews, competitive audits, and technical feasibility studies.",
    icon: "search",
    details: ["Stakeholder Interviews", "Technical Audit", "Market Analysis", "Feasibility Study"],
  },
  {
    num: "02",
    title: "Architecture",
    description:
      "Designing resilient system blueprints, data models, and interaction paradigms that serve as the foundation for scalable growth. Living documentation that evolves with your product.",
    icon: "grid_view",
    details: ["System Design", "Data Modeling", "API Contracts", "Security Blueprint"],
  },
  {
    num: "03",
    title: "Engineering",
    description:
      "Precision-driven execution utilizing cutting-edge stacks, automated testing, and robust CI/CD pipelines that ensure quality at velocity. Every line of code is reviewed, tested, and documented.",
    icon: "terminal",
    details: ["Agile Sprints", "Code Review", "Automated Testing", "CI/CD Pipelines"],
  },
  {
    num: "04",
    title: "Evolution",
    description:
      "Continuous monitoring, performance optimization, and strategic scaling post-deployment. We provide 24/7 observability and proactive incident response to ensure production excellence.",
    icon: "trending_up",
    details: ["Performance Monitoring", "Scaling Strategy", "Incident Response", "Continuous Optimization"],
  },
];

const TEAM_MEMBERS = [
  {
    name: "Chungu Chipimo Chama",
    role: "Founder & Managing Director",
    description:
      "Visionary leader with 15+ years in disruptive technology and product strategy. Former VP of Engineering at two unicorn startups, he drives StackOne's mission to engineer the extraordinary.",
    num: "01",
    image: "/images/team-elena-vance.png",
    alt: "Chungu Chipimo Chama — Founder & Managing Director",
    skills: ["Product Strategy", "Team Building", "Fundraising"],
  },
  {
    name: "Clivate Maiba",
    role: "Co-Founder/Director",
    description:
      "Expert architect specializing in distributed systems and high-precision engineering. PhD in Computer Science from MIT with deep expertise in building systems that operate at massive scale.",
    num: "02",
    image: "/images/team-marcus-chen.png",
    alt: "Clivate Maiba — Co-Founder/Director",
    skills: ["Distributed Systems", "Cloud Architecture", "AI/ML"],
  },
  {
    name: "Sienna Rivers",
    role: "Design Director",
    description:
      "Award-winning designer focused on human-centric interfaces and brand narratives. Former Design Lead at a Fortune 100 company, she brings an uncompromising eye for detail and craft.",
    num: "03",
    image: "/images/team-sienna-rivers.png",
    alt: "Sienna Rivers — Design Director",
    skills: ["UX Design", "Brand Strategy", "Design Systems"],
  },
];

const FOOTER_LINKS_COLUMNS = [
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Press"],
  },
  {
    title: "Services",
    links: ["Product Strategy", "Development", "AI & ML", "Infrastructure"],
  },
  {
    title: "Resources",
    links: ["Case Studies", "Documentation", "Open Source", "Community"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Settings", "Security"],
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <AuroraBackground />
      <div className="bg-grain" />
      <div id="hero-gradient" />
      <MouseGradient />
      <PremiumCursor />
      <ScrollProgress />

      {/* ====== NAVIGATION ====== */}
      <nav className="fixed top-0 w-full z-50 nav-blur bg-surface/60 border-b border-white/[0.03] transition-all duration-500">
        <div className="flex justify-between items-center px-6 md:px-20 h-20 w-full max-w-[1440px] mx-auto">
          <a
            className="text-xl md:text-2xl font-bold tracking-[-0.03em] text-on-surface flex items-center gap-3 group"
            href="#"
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-primary-container/15 flex items-center justify-center ring-1 ring-white/[0.06] group-hover:ring-primary/20 transition-all duration-300">
              <img
                alt="StackOne Logo"
                className="w-full h-full object-cover"
                src="/images/stackone-logo.png"
              />
            </div>
            <span className="text-gradient-subtle">StackOne</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                className="text-on-surface-variant/60 hover:text-on-surface transition-colors duration-300 uppercase tracking-[0.2em] text-[10px] font-medium relative group"
                href={link.href}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Auth buttons - visible on ALL screen sizes */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Desktop-only availability badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              <span className="text-[9px] text-on-surface-variant/40 uppercase tracking-[0.1em] font-medium">
                Available
              </span>
            </div>
            <a
              href="/auth/signin"
              className="text-on-surface-variant/50 hover:text-on-surface transition-colors duration-300 text-[10px] md:text-[10px] uppercase tracking-[0.15em] font-medium"
            >
              Sign In
            </a>
            <a
              href="/auth/register"
              className="inline-flex items-center justify-center btn-primary text-white px-5 md:px-7 py-2 md:py-2.5 rounded-lg uppercase tracking-[0.15em] text-[10px] font-bold relative z-10"
            >
              <span className="relative z-10">Get Started</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ====== MAIN CONTENT ====== */}
      <main className="pt-20 relative z-10 flex-1">
        {/* ====== HERO SECTION ====== */}
        <section
          className="relative min-h-screen flex items-center justify-center px-6 md:px-20 overflow-hidden"
          id="hero-section"
        >
          <HeroParticles />

          <div className="relative z-10 max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 md:col-start-3 text-center space-y-10">
              {/* Status badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/[0.05] bg-white/[0.02] inner-glow animate-slide-down-fade">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container shadow-[0_0_12px_rgba(59,79,255,0.6)]" />
                </span>
                <span className="uppercase tracking-[0.2em] text-[10px] text-on-surface-variant/70 font-medium">
                  Defining Next-Gen Software
                </span>
              </div>

              {/* Main headline */}
              <div className="animate-slide-up-fade delay-100">
                <h1 className="text-[clamp(42px,8.5vw,88px)] leading-[1.02] tracking-[-0.05em] font-bold text-gradient-hero">
                  Engineering the
                  <br />
                  Extraordinary.
                </h1>
              </div>

              {/* Subtitle */}
              <div className="animate-slide-up-fade delay-200">
                <p className="text-lg md:text-xl text-on-surface-variant/60 max-w-2xl mx-auto font-light leading-relaxed">
                  We build digital products for the world&apos;s most ambitious
                  brands. Transforming complex challenges into elegant,
                  high-performance solutions through precision engineering and
                  visionary design.
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up-fade delay-300">
                <a
                  className="w-full sm:w-auto inline-flex items-center justify-center btn-primary text-white px-12 py-4 rounded-xl hover:scale-[1.02] transition-all duration-400 ease-out uppercase tracking-[0.2em] text-[11px] font-bold relative z-10"
                  href="/auth/register"
                >
                  <span className="relative z-10">Get Started</span>
                </a>
                <a
                  className="w-full sm:w-auto inline-flex items-center justify-center btn-secondary px-12 py-4 rounded-xl transition-all duration-400 ease-out uppercase tracking-[0.2em] text-[11px] text-on-surface/70 font-medium"
                  href="/auth/signin"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-500">
            <span className="text-on-surface-variant/20 text-[10px] uppercase tracking-[0.3em] font-medium">
              Scroll
            </span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-on-surface-variant/20 to-transparent" />
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
                    className={`text-center ${i < STATS.length - 1 ? "md:border-r md:border-white/[0.04]" : ""}`}
                  >
                    <div className="text-3xl md:text-4xl font-bold text-gradient-subtle tracking-tight mb-2">
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                        decimals={stat.value % 1 !== 0 ? 1 : 0}
                      />
                    </div>
                    <div className="text-[10px] text-on-surface-variant/35 uppercase tracking-[0.15em] font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
        <div className="section-divider" />

        {/* Trust Marquee */}
        <TrustMarquee />
        <div className="section-divider" />

        {/* ====== EXPERTISE SECTION ====== */}
        <ExpertiseCarousel />

        <div className="section-divider" />

        {/* ====== VENTURES SECTION ====== */}
        <section className="py-24 md:py-36 px-6 md:px-20 relative" id="ventures">
          <div className="max-w-[1440px] mx-auto">
            <ScrollReveal>
              <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/[0.05] bg-white/[0.02] mb-6">
                    <span className="material-symbols-outlined text-[12px] text-primary/50">work</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/40 font-medium">
                      Recent Work
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-[56px] text-on-surface tracking-[-0.04em] font-bold leading-[1.05]">
                    Select
                    <br />
                    <span className="text-gradient-subtle">Ventures</span>
                  </h2>
                </div>
                <p className="text-base text-on-surface-variant/50 max-w-sm font-light leading-relaxed">
                  A curated selection of our most ambitious engineering and
                  design challenges — each pushing the boundaries of what&apos;s possible.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
              {VENTURES.map((venture, i) => (
                <ScrollReveal
                  key={venture.title}
                  delay={i * 80}
                  direction="up"
                  distance={40}
                >
                  <div className={`group cursor-pointer ${venture.offset ? "md:mt-16" : ""}`}>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-surface-container-high via-surface/80 to-surface-container-high relative mb-8 ring-1 ring-white/[0.04] flex items-center justify-center">
                      {/* Ambient glow behind logo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[60%] h-[60%] rounded-full bg-primary/[0.07] blur-[80px] group-hover:bg-primary/[0.12] transition-all duration-700" />
                      </div>
                      {/* Logo as main feature */}
                      <div className="relative z-10 w-[45%] max-w-[200px] aspect-square rounded-2xl overflow-hidden bg-surface/40 backdrop-blur-sm border border-white/[0.06] shadow-2xl shadow-black/30 flex items-center justify-center p-4 group-hover:scale-105 group-hover:border-white/[0.12] transition-all duration-500">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={venture.logo}
                          alt={`${venture.title} logo`}
                          className="w-full h-full object-contain drop-shadow-lg"
                        />
                      </div>
                      {/* Hover overlay with CTA */}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-5 left-5 right-5 z-30 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] text-white px-5 py-2.5 rounded-full uppercase tracking-[0.2em] text-[9px] font-medium">
                          View Case Study
                          <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                        </span>
                        <span className="uppercase tracking-[0.15em] text-[9px] text-on-surface-variant/50 border border-white/[0.06] px-3 py-1.5 rounded-md font-medium bg-surface/40 backdrop-blur-xl">
                          {venture.tag}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-surface-container-high border border-white/[0.04] flex items-center justify-center p-1 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={venture.logo}
                              alt={`${venture.title} logo`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <h3 className="text-2xl font-bold text-on-surface group-hover:text-primary transition-colors duration-300 tracking-[-0.01em]">
                            {venture.title}
                          </h3>
                        </div>
                        <p className="text-[14px] text-on-surface-variant/45 font-light leading-relaxed mb-5">
                          {venture.description}
                        </p>
                        <div className="flex gap-8">
                          {venture.metrics.map((metric) => (
                            <div key={metric.label}>
                              <div className="text-lg font-bold text-on-surface/70 tracking-tight">
                                {metric.value}
                              </div>
                              <div className="text-[9px] text-on-surface-variant/30 uppercase tracking-[0.1em] font-medium">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="shrink-0 uppercase tracking-[0.15em] text-[9px] text-on-surface-variant/30 border border-white/[0.04] px-3 py-1.5 rounded-md font-medium">
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
          {/* Grid background */}
          <div className="absolute inset-0 grid-bg pointer-events-none opacity-50" />

          <div className="max-w-[1440px] mx-auto relative z-10">
            <ScrollReveal>
              <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/[0.05] bg-white/[0.02] mb-6">
                    <span className="material-symbols-outlined text-[12px] text-primary/50">route</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/40 font-medium">
                      Methodology
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-[56px] text-on-surface tracking-[-0.04em] font-bold leading-[1.05]">
                    Our
                    <br />
                    <span className="text-gradient-subtle">Approach</span>
                  </h2>
                </div>
                <p className="text-base text-on-surface-variant/50 max-w-sm font-light leading-relaxed">
                  A rigorous, multi-disciplinary methodology ensuring
                  excellence from concept to deployment — battle-tested across 200+ projects.
                </p>
              </div>
            </ScrollReveal>

            <div className="relative">
              <div className="md:hidden absolute left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/20 via-white/[0.04] to-primary/20" />
              <div className="hidden md:block absolute top-[40px] left-[3%] w-[94%] h-[1px] bg-gradient-to-r from-primary/15 via-white/[0.04] to-primary/15" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
                {APPROACH_STEPS.map((step, i) => (
                  <ScrollReveal key={step.num} delay={i * 80} direction="up" distance={30}>
                    <div className="approach-step relative pl-12 md:pl-0 md:pt-16 group rounded-xl p-4 md:p-6 -m-4 md:-m-6">
                      <div
                        className={`absolute left-0 md:absolute md:top-0 md:left-0 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                          i === 0
                            ? "bg-primary/15 border-2 border-primary shadow-[0_0_20px_rgba(59,79,255,0.2)]"
                            : "bg-surface border-2 border-white/[0.06] group-hover:border-primary/30 group-hover:bg-primary/5"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px] text-primary">
                          {step.icon}
                        </span>
                      </div>

                      <div className="text-[48px] font-light text-white/[0.02] mb-2 group-hover:text-primary/10 transition-colors duration-500 leading-none">
                        {step.num}
                      </div>
                      <h3 className="text-lg font-semibold text-on-surface mb-3 tracking-[-0.01em] group-hover:text-primary transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-[13px] text-on-surface-variant/40 font-light leading-relaxed mb-5">
                        {step.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.details.map((detail) => (
                          <span
                            key={detail}
                            className="inline-flex items-center px-2.5 py-1 rounded text-[9px] uppercase tracking-[0.1em] font-medium bg-white/[0.015] border border-white/[0.03] text-on-surface-variant/30 group-hover:text-on-surface-variant/50 group-hover:border-white/[0.06] transition-all duration-500"
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ====== TECH STACK ====== */}
        <TechStack />

        <div className="section-divider" />

        {/* ====== TESTIMONIALS ====== */}
        <Testimonials />

        <div className="section-divider" />

        {/* ====== TEAM SECTION ====== */}
        <section className="py-24 md:py-36 px-6 md:px-20 relative overflow-hidden" id="team">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/[0.02] blur-[160px] rounded-full pointer-events-none" />

          <div className="max-w-[1440px] mx-auto relative z-10">
            <ScrollReveal>
              <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/[0.05] bg-white/[0.02] mb-6">
                    <span className="material-symbols-outlined text-[12px] text-primary/50">groups</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/40 font-medium">
                      Leadership Team
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-[56px] text-on-surface tracking-[-0.04em] font-bold leading-[1.05]">
                    The Minds Behind
                    <br />
                    <span className="text-gradient-subtle">the Extraordinary</span>
                  </h2>
                </div>
                <p className="text-base text-on-surface-variant/50 max-w-sm font-light leading-relaxed">
                  A world-class team of engineers, designers, and strategists
                  united by a shared obsession with excellence.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TEAM_MEMBERS.map((member, i) => (
                <ScrollReveal key={member.name} delay={i * 80} direction="up" distance={40}>
                  <SpotlightCard className="p-0">
                    <div className="group relative cursor-pointer p-1">
                      {/* Portrait */}
                      <div className="aspect-[4/5] overflow-hidden rounded-[18px] mb-0 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 relative">
                        <ParallaxImage
                          src={member.image}
                          alt={member.alt}
                          speed={0.05}
                          className="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          {["work", "link", "mail"].map((social) => (
                            <div
                              key={social}
                              className="w-9 h-9 rounded-lg bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.12] transition-colors duration-300"
                            >
                              <span className="material-symbols-outlined text-[14px] text-white/60">
                                {social}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6 pt-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-on-surface transition-colors duration-300 group-hover:text-primary tracking-[-0.01em]">
                            {member.name}
                          </h3>
                          <span className="text-[10px] text-white/[0.06] font-mono">
                            {member.num}
                          </span>
                        </div>
                        <p className="text-[11px] text-primary/40 uppercase tracking-[0.2em] font-medium">
                          {member.role}
                        </p>
                        <p className="text-[13px] text-on-surface-variant/40 font-light leading-relaxed">
                          {member.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {member.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2.5 py-1 rounded text-[9px] uppercase tracking-[0.1em] font-medium bg-primary/[0.04] border border-primary/[0.06] text-primary/40 group-hover:text-primary/70 group-hover:border-primary/[0.12] transition-all duration-500"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
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
              <div className="glass-panel-elevated rounded-[32px] p-16 md:p-28 text-center border-t border-t-primary/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                {/* Decorative orbs */}
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/[0.04] rounded-full blur-[100px] animate-float-glow pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-primary/[0.02] rounded-full blur-[100px] animate-float-glow pointer-events-none" style={{ animationDelay: "3s" }} />

                {/* Rotating ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] animate-rotate-slow pointer-events-none opacity-[0.02]">
                  <div className="w-full h-full rounded-full border border-dashed border-primary/50" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.04] bg-white/[0.015] mb-8">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/35 font-medium">
                      Available for new projects
                    </span>
                  </div>

                  <TextReveal className="text-[clamp(32px,6vw,68px)] tracking-[-0.05em] text-on-surface mb-6 font-bold leading-[1.05]">
                    Let&apos;s build the future.
                  </TextReveal>
                  <p className="text-lg md:text-xl text-on-surface-variant/50 max-w-xl mx-auto mb-14 font-light leading-relaxed">
                    Partner with StackOne to engineer your next extraordinary
                    digital product. From concept to scale, we deliver excellence.
                  </p>
                  <a
                    className="relative z-10 inline-flex items-center justify-center btn-primary text-white px-16 py-5 rounded-xl hover:scale-[1.02] transition-all duration-400 uppercase tracking-[0.2em] text-[12px] font-bold shadow-xl shadow-primary/15"
                    href="/auth/register"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="bg-surface-container-lowest border-t border-white/[0.03] w-full relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 py-16">
            <div className="col-span-2">
              <div className="text-xl font-bold text-on-surface mb-4 tracking-[-0.02em] flex items-center gap-2">
                <div className="w-7 h-7 rounded-md overflow-hidden bg-primary-container/15 ring-1 ring-white/[0.06]">
                  <img
                    alt="StackOne"
                    className="w-full h-full object-cover"
                    src="/images/stackone-logo.png"
                  />
                </div>
                StackOne
              </div>
              <p className="text-[13px] text-on-surface-variant/30 font-light leading-relaxed max-w-xs mb-6">
                Engineering the extraordinary. We build digital products for the
                world&apos;s most ambitious brands.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: "work", label: "LinkedIn" },
                  { icon: "link", label: "Twitter" },
                  { icon: "code", label: "GitHub" },
                  { icon: "mail", label: "Email" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                    aria-label={social.label}
                  >
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant/30 hover:text-primary transition-colors duration-300">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {FOOTER_LINKS_COLUMNS.map((column) => (
              <div key={column.title}>
                <h4 className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/20 font-semibold mb-4">
                  {column.title}
                </h4>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        className="text-[13px] text-on-surface-variant/35 hover:text-on-surface-variant/60 transition-colors duration-300 font-light"
                        href="#"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.03] py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-on-surface-variant/15 uppercase tracking-[0.1em] font-medium">
              &copy; 2024 StackOne Architectural Systems. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Cookies", "Security"].map((link) => (
                <a
                  key={link}
                  className="text-[10px] text-on-surface-variant/15 hover:text-on-surface-variant/35 uppercase tracking-[0.1em] font-medium transition-colors duration-300"
                  href="#"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
