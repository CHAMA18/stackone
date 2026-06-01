"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard/overview");
        router.refresh();
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
      <div className="text-center mb-10">
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
            Welcome back
          </h1>
          <p className="text-on-surface-variant/50 text-sm font-light">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-[0.15em] text-on-surface-variant/50 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-[0.15em] text-on-surface-variant/50 font-medium"
              >
                Password
              </label>
              <button
                type="button"
                className="text-[11px] text-primary/60 hover:text-primary transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300 text-sm"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-white px-8 py-3.5 rounded-lg uppercase tracking-[0.15em] text-[11px] font-bold relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
          <p className="text-on-surface-variant/40 text-sm font-light">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary/70 hover:text-primary transition-colors duration-200 font-medium"
            >
              Create one
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
