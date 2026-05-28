"use client";

const CLIENTS = [
  "Google", "Microsoft", "Stripe", "Vercel", "Linear",
  "Figma", "Notion", "Spotify", "Airbnb", "Shopify",
  "Slack", "Datadog", "Cloudflare", "Twilio", "Okta",
  "Segment", "Framer", "Supabase", "Railway", "Planetscale",
];

const LOGO_STYLES: Record<string, { color: string; weight: number }> = {
  Google: { color: "#4285f4", weight: 700 },
  Microsoft: { color: "#00a4ef", weight: 700 },
  Stripe: { color: "#635bff", weight: 700 },
  Vercel: { color: "#ffffff", weight: 700 },
  Linear: { color: "#5e6ad2", weight: 600 },
  Figma: { color: "#a259ff", weight: 700 },
  Notion: { color: "#ffffff", weight: 700 },
  Spotify: { color: "#1db954", weight: 700 },
  Airbnb: { color: "#ff5a5f", weight: 700 },
  Shopify: { color: "#96bf48", weight: 700 },
  Slack: { color: "#e01e5a", weight: 700 },
  Datadog: { color: "#632ca6", weight: 700 },
  Cloudflare: { color: "#f6821f", weight: 700 },
  Twilio: { color: "#f22f46", weight: 700 },
  Okta: { color: "#007dc1", weight: 700 },
  Segment: { color: "#52bd95", weight: 700 },
  Framer: { color: "#0055ff", weight: 700 },
  Supabase: { color: "#3ecf8e", weight: 700 },
  Railway: { color: "#ffffff", weight: 700 },
  Planetscale: { color: "#ffffff", weight: 700 },
};

export function TrustMarquee() {
  const firstHalf = CLIENTS.slice(0, CLIENTS.length / 2);
  const secondHalf = CLIENTS.slice(CLIENTS.length / 2);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20 mb-10">
        <p className="text-center text-[11px] text-on-surface-variant/30 uppercase tracking-[0.3em] font-medium">
          Trusted by industry leaders worldwide
        </p>
      </div>

      {/* Row 1 - Left to Right */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee">
          {[...firstHalf, ...firstHalf].map((client, i) => (
            <div
              key={`row1-${client}-${i}`}
              className="flex items-center justify-center shrink-0 mx-8 md:mx-12 group cursor-default"
            >
              <span
                className="text-lg md:text-xl whitespace-nowrap transition-all duration-500 group-hover:opacity-100 opacity-40 font-semibold tracking-tight"
                style={{
                  color: LOGO_STYLES[client]?.color || "rgba(255,255,255,0.4)",
                  fontWeight: LOGO_STYLES[client]?.weight || 600,
                }}
              >
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Right to Left */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee-reverse">
          {[...secondHalf, ...secondHalf].map((client, i) => (
            <div
              key={`row2-${client}-${i}`}
              className="flex items-center justify-center shrink-0 mx-8 md:mx-12 group cursor-default"
            >
              <span
                className="text-lg md:text-xl whitespace-nowrap transition-all duration-500 group-hover:opacity-100 opacity-40 font-semibold tracking-tight"
                style={{
                  color: LOGO_STYLES[client]?.color || "rgba(255,255,255,0.4)",
                  fontWeight: LOGO_STYLES[client]?.weight || 600,
                }}
              >
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
