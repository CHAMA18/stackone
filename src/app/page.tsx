"use client";

import { HeroParticles } from "@/components/hero-particles";
import { MouseGradient } from "@/components/mouse-gradient";

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
      "Defining the roadmap from inception to launch, ensuring market fit and technical viability.",
  },
  {
    icon: "code_blocks",
    title: "Full-Stack Dev",
    description:
      "End-to-end engineering utilizing modern frameworks to build robust and performant applications.",
  },
  {
    icon: "memory",
    title: "AI & Machine Learning",
    description:
      "Integrating intelligent algorithms to automate processes and unlock data-driven insights.",
  },
  {
    icon: "cloud",
    title: "Cloud Infrastructure",
    description:
      "Architecting secure, scalable cloud environments optimized for high availability and low latency.",
  },
];

const VENTURES = [
  {
    title: "Nexus Financial",
    description:
      "Real-time trading execution engine processing 10k+ tx/sec with sub-millisecond latency.",
    tag: "Fintech",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDD3Ed8az5N31HraKPEEqVJDdtOdRgxgFuVx5I-KDTTmtxpEM6mHYtLXexf3ju6AnUd2l5Ixe0RmrVSUcG26iuHbdx1NVqA_TRhGL-8NFzGhXYfHo-VhKnBZ3QwTkVbOK34F0QpAJ15Y7muTQVEt96vojjqW5HOyrYUwLmRu5Yx3hcHRllHeZ37ZQfYaz6xY43CK5ypvvAoLd44fJSHnROkARLNSzM1EnYyZN0QrvrNAYdUtnxbr0zRnSwbg0UjO64s6KDzSnnjdIM",
    alt: "Fintech Dashboard",
    offset: false,
  },
  {
    title: "AeroLogix",
    description:
      "Predictive maintenance AI for aerospace logistics, reducing downtime by 34%.",
    tag: "AI/ML",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVS4v2egfHS-TdrlON1FABh4Lpr9kLx6Ju6Ho-YOkTHsKqq6LWBFNC8sRpGhhU3lLU2SjtfeQa2z9IKPRavJnK8WGuX1hywC1fa0UmPP1RRxwrhCw4rRW-AHT3Jddi7HoUC7IOMz13Edivsl3UTji8cb_utXaxYgQ_IeL2F6Swjqy-m__cQgetuaJrEKeW9R8qb4uk9I264CIEl6mL9M0a9jh8ctU0vjnmTC13eCduT5Lt5BWtz3YXi5rKqBHgeg9Gy9kRHs_gP98",
    alt: "Hardware Integration",
    offset: true,
  },
];

const APPROACH_STEPS = [
  {
    num: "01",
    title: "Discovery",
    description:
      "Deep contextual analysis to understand business objectives, constraints, and user needs.",
  },
  {
    num: "02",
    title: "Architecture",
    description:
      "Designing resilient system blueprints and intuitive interaction paradigms.",
  },
  {
    num: "03",
    title: "Engineering",
    description:
      "Precision-driven execution utilizing cutting-edge stacks and robust CI/CD pipelines.",
  },
  {
    num: "04",
    title: "Evolution",
    description:
      "Continuous monitoring, optimization, and scaling post-deployment.",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Elena Vance",
    role: "Founder & CEO",
    description:
      "Visionary leader with 15+ years in disruptive technology and product strategy.",
    num: "01",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDafczTE0c6RGKaL4WSrDCX9-OeRfw77sG-F0rCQo3a4TtE4DZl2qQn5o00JUBb_3UgtLgrOznVZdflSDx77zlHqwGyzncF-Xumz36DfYQZWdt0smQATFNPI1UXRIbLfbpxC8Coy0sbaNmqwAxZPqoQOnx68wXe7_DPVQvnTUJMtv7a5hDggg-nOCg72JM7ecwbgOIumx9Q2n-6xGnoYdIVAIhDghyEOwRI44cXACMOkmDq2qbutK9aVM97lmErDATP-niJIfKMJ0",
    alt: "Elena Vance - Founder & CEO",
  },
  {
    name: "Marcus Chen",
    role: "Chief Technology Officer",
    description:
      "Expert architect specializing in distributed systems and high-precision engineering.",
    num: "02",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGiZVshg_2b7vGAMqcpmFEAQFzm6VEaacILtTG2UvMCq2hU_8fZ-Kw5cv9bZ0QVwkPy84uRPwn68AEQ36oOBZTfx517toT5EgDzAvGhfImmAWEglaNKJeLRZS3nrzvXsN4xAtVoOMlPWJ79AC3PU5FeSkZDisKUlAEZoLKyp96b95qpMGy1-30PH9sfIfgk5I8JEU5ABjIr_AIoSHFNiifmV7UzObixfayUqjzszITEjvWZ8lE7tniyRe9czHEh24p_3610U8yn6Q",
    alt: "Marcus Chen - Chief Technology Officer",
  },
  {
    name: "Sienna Rivers",
    role: "Design Director",
    description:
      "Award-winning designer focused on human-centric interfaces and brand narratives.",
    num: "03",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABMaBMzKGtWizniFUTT_vO5DdTh5H4myUzgd049S44Comi3s03iUNsggjgWpms2mxwHmFxchviKJwhUjHbxWefw6jkXYZ9J-gBEWUVRNny3z2s741lAtOztuS7wvb7Q9-0TH8Kesus3_-KSAIsSw_v_kxor3TEAvkw9unRj2_dRPNQpKtoJUeUz08VlZuJZcgLGFF8cXHfYlmQGZFdK2gV9aOcoHOWg-wNn0_T0OrjVCiWbNzh9GU4mxgtbsvAcmOXc1yptWbLQM8",
    alt: "Sienna Rivers - Design Director",
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

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="flex justify-between items-center px-5 md:px-20 h-20 w-full max-w-[1440px] mx-auto">
          <a
            className="text-2xl md:text-[32px] font-bold tracking-tighter text-on-surface flex items-center gap-2"
            href="#"
          >
            <img
              alt="StackOne Logo"
              className="w-8 h-8 rounded"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsm5oVYuzy4bNcfnqjYU64YVGCX6hheX_CQlOHtfRpSEDs5NCl9G00FgLJ00waqutu9u5-B9BKAErjKRWhrVOeRqXPg81THWGi9EeiaMaVzzmcIS76gewu1hdzfhcHMLH60j8NU4BuxYnpMzwoa-iIoxII9gJBteI9QN8gzAonBhguBhSzd76aUYsh4AHi7yg4vHBm0K8jBZH82Z16ZgfwCLYJmRX7HQBGGQO6Yam4Nl7LxLiB1yw8nMPeCWoGHbInhYMG8Eaz3dk"
            />
            StackOne
          </a>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 uppercase tracking-[0.2em] text-[10px] font-medium"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            className="hidden md:inline-flex items-center justify-center bg-primary-container text-on-primary-container px-6 py-2.5 rounded-sm hover:bg-primary-fixed transition-colors duration-300 uppercase tracking-wider text-[11px] font-bold"
            href="#contact"
          >
            Start a Project
          </a>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-20 relative z-10 flex-1">
        {/* Hero Section */}
        <section
          className="relative min-h-[921px] flex items-center justify-center px-5 md:px-20 py-32 md:py-0 overflow-hidden"
          id="hero-section"
        >
          <HeroParticles />
          <div className="relative z-10 max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 md:col-start-3 text-center space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 bg-surface-container-low inner-glow animate-slide-up-fade">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_10px_rgba(46,91,255,0.8)]" />
                <span className="uppercase tracking-[0.2em] text-[11px] text-on-surface-variant font-medium">
                  Defining Next-Gen Software
                </span>
              </div>
              <h1 className="text-[48px] md:text-[72px] tracking-[-0.04em] md:tracking-[-0.04em] text-gradient leading-[1.1] font-bold animate-slide-up-fade delay-100">
                Engineering the <br />
                Extraordinary.
              </h1>
              <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto animate-slide-up-fade delay-200 font-light leading-relaxed">
                We build digital products for the world&apos;s most ambitious
                brands. Transforming complex challenges into elegant,
                high-performance solutions through precision engineering and
                visionary design.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-slide-up-fade delay-300">
                <a
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-container text-on-primary-container px-8 py-4 rounded-sm hover:bg-primary-fixed hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(46,91,255,0.2)] transition-all duration-300 ease-out uppercase tracking-[0.2em] text-[11px] font-bold"
                  href="#expertise"
                >
                  Explore Services
                </a>
                <a
                  className="w-full sm:w-auto inline-flex items-center justify-center glass-panel px-8 py-4 rounded-sm hover:bg-white/5 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-white/20 transition-all duration-300 ease-out uppercase tracking-[0.2em] text-[11px] text-on-surface font-medium"
                  href="#contact"
                >
                  Start a Project
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Expertise Section */}
        <section
          className="py-32 px-5 md:px-20 relative"
          id="expertise"
        >
          <div className="max-w-[1440px] mx-auto">
            <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-[32px] text-on-surface tracking-tight font-bold">
                  Expertise &amp; Services
                </h2>
                <p className="text-base text-on-surface-variant mt-4 max-w-lg font-light">
                  Our core capabilities designed to architect scalable,
                  resilient, and forward-thinking digital platforms.
                </p>
              </div>
              <div className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium">
                Core Competencies
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {EXPERTISE_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="glass-panel inner-glow rounded-xl p-8 hover:border-white/20 transition-all duration-500 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined">
                      {card.icon}
                    </span>
                  </div>
                  <h3 className="text-[20px] font-semibold text-on-surface mb-3 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-[15px] text-on-surface-variant font-light leading-relaxed">
                    {card.description}
                  </p>
                  <div className="mt-8 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="uppercase tracking-wider text-[10px] text-primary font-medium">
                      Discover
                    </span>
                    <span className="material-symbols-outlined text-primary text-sm transform group-hover:translate-x-1 transition-transform duration-300">
                      arrow_forward
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Ventures Section */}
        <section
          className="py-32 px-5 md:px-20 relative"
          id="ventures"
        >
          <div className="max-w-[1440px] mx-auto">
            <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-[32px] text-on-surface tracking-tight font-bold">
                  Select Ventures
                </h2>
                <p className="text-base text-on-surface-variant mt-4 max-w-lg font-light">
                  A curated selection of our most ambitious engineering and
                  design challenges.
                </p>
              </div>
              <div className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium">
                Recent Work
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {VENTURES.map((venture) => (
                <div
                  key={venture.title}
                  className={`group cursor-pointer ${venture.offset ? "md:mt-24" : ""}`}
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-high relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                      alt={venture.alt}
                      className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                      src={venture.image}
                    />
                    <div className="absolute bottom-6 left-6 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full uppercase tracking-[0.2em] text-[10px] font-medium">
                        View Case Study{" "}
                        <span className="material-symbols-outlined text-[14px]">
                          arrow_outward
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors duration-300">
                        {venture.title}
                      </h3>
                      <p className="text-[15px] text-on-surface-variant font-light">
                        {venture.description}
                      </p>
                    </div>
                    <span className="uppercase tracking-[0.2em] text-[10px] text-on-surface-variant border border-white/10 px-2 py-1 rounded font-medium">
                      {venture.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Approach Section */}
        <section
          className="py-32 px-5 md:px-20 relative"
          id="approach"
        >
          <div className="max-w-[1440px] mx-auto">
            <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-[32px] text-on-surface tracking-tight font-bold">
                  Our Approach
                </h2>
                <p className="text-base text-on-surface-variant mt-4 max-w-lg font-light">
                  A rigorous, multi-disciplinary methodology ensuring excellence
                  from concept to deployment.
                </p>
              </div>
              <div className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium">
                Methodology
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute top-[24px] left-0 w-full h-[0.5px] bg-white/10" />
              {APPROACH_STEPS.map((step, idx) => (
                <div
                  key={step.num}
                  className="relative pt-6 md:pt-12 group"
                >
                  <div
                    className={`hidden md:block absolute top-0 left-0 w-3 h-3 bg-background rounded-full group-hover:scale-150 transition-transform duration-300 z-10 -mt-[5px] ${
                      idx === 0
                        ? "border-2 border-primary"
                        : "border-2 border-white/20 group-hover:border-primary"
                    }`}
                  />
                  <div className="text-[32px] font-light text-white/10 mb-4 group-hover:text-primary/30 transition-colors duration-300">
                    {step.num}
                  </div>
                  <h3 className="text-[18px] font-semibold text-on-surface mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-on-surface-variant font-light leading-relaxed pr-4">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Team Section */}
        <section
          className="py-32 px-5 md:px-20 relative overflow-hidden"
          id="team"
        >
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-[32px] text-on-surface tracking-tight font-bold">
                  The Minds Behind the Extraordinary
                </h2>
              </div>
              <div className="uppercase tracking-[0.2em] text-[10px] text-primary/50 font-medium">
                Leadership Team
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.name}
                  className="group relative cursor-pointer"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-xl mb-6 border border-white/5 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 shadow-2xl">
                    <img
                      alt={member.alt}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      src={member.image}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-on-surface transition-colors duration-300 group-hover:text-primary tracking-tight">
                        {member.name}
                      </h3>
                      <span className="text-[10px] text-white/20 font-medium">
                        {member.num}
                      </span>
                    </div>
                    <p className="text-[11px] text-primary/70 uppercase tracking-[0.2em] font-medium">
                      {member.role}
                    </p>
                    <p className="text-[14px] text-on-surface-variant font-light leading-relaxed pt-2">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Subtle background accent */}
          <div className="absolute top-1/2 left-0 w-full h-[500px] bg-primary/5 blur-[120px] -translate-y-1/2 pointer-events-none" />
        </section>

        <div className="section-divider" />

        {/* CTA Section */}
        <section
          className="py-32 px-5 md:px-20 relative"
          id="contact"
        >
          <div className="max-w-[1440px] mx-auto">
            <div className="glass-panel inner-glow rounded-2xl p-16 md:p-32 text-center border-t border-t-primary/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <h2 className="text-[48px] md:text-[72px] tracking-[-0.04em] text-on-surface mb-6 relative z-10 font-bold">
                Let&apos;s build the future.
              </h2>
              <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto mb-12 font-light relative z-10">
                Partner with StackOne to engineer your next extraordinary
                digital product.
              </p>
              <a
                className="relative z-10 inline-flex items-center justify-center bg-primary-container text-on-primary-container px-12 py-5 rounded-sm hover:bg-primary-fixed hover:scale-[1.02] transition-all duration-300 uppercase tracking-[0.2em] text-[12px] font-bold shadow-lg shadow-primary/20"
                href="#"
              >
                Start a Project{" "}
                <span className="material-symbols-outlined ml-2 text-[16px]">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-white/5 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-20 py-16 w-full max-w-[1440px] mx-auto">
          <div className="md:col-span-1">
            <div className="text-2xl font-bold text-on-surface mb-4 tracking-tight">
              StackOne
            </div>
            <p className="uppercase tracking-[0.2em] text-[10px] text-on-surface-variant/50 leading-relaxed font-medium">
              © 2024 StackOne Architectural Systems.
              <br />
              All rights reserved.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-wrap gap-8 justify-start md:justify-end items-start pt-4 md:pt-2">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link}
                className="uppercase tracking-[0.2em] text-[11px] text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium"
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
