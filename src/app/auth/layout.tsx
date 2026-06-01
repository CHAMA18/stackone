"use client";

import { useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050507]">
      {/* Aurora background */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
      <div className="bg-grain" />
      <div
        id="hero-gradient"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 800px 600px at 50% 50%, rgba(59, 79, 255, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
