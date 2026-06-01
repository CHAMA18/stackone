"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/dashboard/profile");
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || "",
            email: data.email || "",
            company: data.company || "",
            phone: data.phone || "",
            bio: data.bio || "",
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully" });
      } else {
        setMessage({ type: "error", text: "Failed to update profile" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-on-surface tracking-[-0.02em]">
          Settings
        </h1>
        <p className="text-on-surface-variant/50 text-sm font-light mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile section */}
      <div className="glass-panel rounded-xl p-6 md:p-8">
        <h3 className="text-sm font-semibold text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary/50">
            person
          </span>
          Profile Information
        </h3>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-400/10 border border-green-400/20 text-green-400"
                : "bg-red-400/10 border border-red-400/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.12em] text-on-surface-variant/50 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.12em] text-on-surface-variant/50 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.015] border border-white/[0.04] text-on-surface-variant/40 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.12em] text-on-surface-variant/50 font-medium mb-2">
                Company
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.12em] text-on-surface-variant/50 font-medium mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.12em] text-on-surface-variant/50 font-medium mb-2">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-white px-8 py-2.5 rounded-lg text-[10px] uppercase tracking-[0.12em] font-bold relative z-10 disabled:opacity-50"
          >
            <span className="relative z-10">
              {saving ? "Saving..." : "Save Changes"}
            </span>
          </button>
        </form>
      </div>

      {/* Email Settings */}
      <div className="glass-panel rounded-xl p-6 md:p-8">
        <h3 className="text-sm font-semibold text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary/50">
            mail
          </span>
          Email Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.015] border border-white/[0.03]">
            <div>
              <p className="text-sm text-on-surface font-medium">
                Email Notifications
              </p>
              <p className="text-xs text-on-surface-variant/30 font-light mt-0.5">
                Receive email notifications for project updates and messages
              </p>
            </div>
            <div className="w-11 h-6 bg-primary/30 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.015] border border-white/[0.03]">
            <div>
              <p className="text-sm text-on-surface font-medium">
                Weekly Digest
              </p>
              <p className="text-xs text-on-surface-variant/30 font-light mt-0.5">
                Get a weekly summary of your project activity
              </p>
            </div>
            <div className="w-11 h-6 bg-white/[0.06] rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-on-surface-variant/30 rounded-full transition-all" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.015] border border-white/[0.03]">
            <div>
              <p className="text-sm text-on-surface font-medium">
                Marketing Emails
              </p>
              <p className="text-xs text-on-surface-variant/30 font-light mt-0.5">
                Receive product updates and feature announcements
              </p>
            </div>
            <div className="w-11 h-6 bg-white/[0.06] rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-on-surface-variant/30 rounded-full transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-panel rounded-xl p-6 md:p-8 border-red-500/10">
        <h3 className="text-sm font-semibold text-red-400/70 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">warning</span>
          Danger Zone
        </h3>
        <p className="text-xs text-on-surface-variant/30 font-light mb-4">
          These actions are irreversible. Please be certain.
        </p>
        <div className="flex gap-3">
          <button className="px-5 py-2 rounded-lg text-[10px] uppercase tracking-[0.12em] font-medium text-red-400/60 border border-red-400/10 hover:bg-red-400/5 transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
