"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          company: form.company,
          phone: form.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard/overview");
        router.refresh();
      } else {
        router.push("/auth/signin");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up-fade">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary-container/15 flex items-center justify-center ring-1 ring-white/[0.06] group-hover:ring-primary/20 transition-all duration-300">
            <img
              alt="StackOne Logo"
              className="w-full h-full object-cover"
              src="/images/stackone-logo.png"
            />
          </div>
          <span className="text-2xl font-bold text-gradient-subtle tracking-[-0.03em]">
            StackOne
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="glass-panel-elevated rounded-2xl p-8 md:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-on-surface tracking-[-0.02em] mb-2">
            Create your account
          </h1>
          <p className="text-on-surface-variant/50 text-sm font-light">
            Join StackOne and start building the extraordinary
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs uppercase tracking-[0.15em] text-on-surface-variant/50 font-medium mb-2"
              >
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-[0.15em] text-on-surface-variant/50 font-medium mb-2"
              >
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="company"
                className="block text-xs uppercase tracking-[0.15em] text-on-surface-variant/50 font-medium mb-2"
              >
                Company
              </label>
              <input
                id="company"
                type="text"
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm"
                placeholder="Your company"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs uppercase tracking-[0.15em] text-on-surface-variant/50 font-medium mb-2"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm"
                placeholder="+260 97X XXX XXX"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-[0.15em] text-on-surface-variant/50 font-medium mb-2"
            >
              Password *
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs uppercase tracking-[0.15em] text-on-surface-variant/50 font-medium mb-2"
            >
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm"
              placeholder="Confirm your password"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-white/[0.1] bg-white/[0.03] text-primary focus:ring-primary/20 focus:ring-offset-0"
              />
              <span className="text-xs text-on-surface-variant/40 font-light leading-relaxed">
                I agree to the{" "}
                <span className="text-primary/60 hover:text-primary transition-colors cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-primary/60 hover:text-primary transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-white px-8 py-3.5 rounded-lg uppercase tracking-[0.15em] text-[11px] font-bold relative z-10 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
          <p className="text-on-surface-variant/40 text-sm font-light">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-primary/70 hover:text-primary transition-colors duration-200 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Back to home */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-on-surface-variant/30 hover:text-on-surface-variant/60 text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-300"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
