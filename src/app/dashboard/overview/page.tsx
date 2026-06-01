"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface DashboardData {
  projectCount: number;
  activeProjects: number;
  messageCount: number;
  unreadMessages: number;
  recentProjects: { id: string; name: string; status: string; progress: number; category: string | null }[];
  recentMessages: { id: string; subject: string; sender: string; read: boolean; createdAt: string }[];
}

export default function OverviewPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard/overview");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const stats = [
    {
      label: "Total Projects",
      value: data?.projectCount ?? 0,
      icon: "folder",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Active",
      value: data?.activeProjects ?? 0,
      icon: "rocket_launch",
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Messages",
      value: data?.messageCount ?? 0,
      icon: "mail",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      label: "Unread",
      value: data?.unreadMessages ?? 0,
      icon: "mark_email_unread",
      color: "text-rose-400",
      bg: "bg-rose-400/10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-[-0.02em] mb-2">
          Welcome back, {session?.user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-on-surface-variant/50 text-sm font-light">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-panel rounded-xl p-5 hover:border-white/[0.08] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <span className={`material-symbols-outlined text-[18px] ${stat.color}`}>
                  {stat.icon}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-on-surface tracking-tight">
              {loading ? (
                <div className="w-8 h-7 bg-white/[0.04] rounded animate-pulse" />
              ) : (
                stat.value
              )}
            </div>
            <div className="text-[10px] text-on-surface-variant/35 uppercase tracking-[0.12em] font-medium mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-on-surface">
              Recent Projects
            </h3>
            <a
              href="/dashboard/projects"
              className="text-[10px] text-primary/60 hover:text-primary uppercase tracking-[0.12em] font-medium transition-colors"
            >
              View All
            </a>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.03] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-3 bg-white/[0.03] rounded animate-pulse" />
                    <div className="w-20 h-2 bg-white/[0.02] rounded animate-pulse" />
                  </div>
                </div>
              ))
            ) : data?.recentProjects && data.recentProjects.length > 0 ? (
              data.recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-5 flex items-center gap-4 hover:bg-white/[0.01] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/[0.06] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-primary/50">
                      folder
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface font-medium truncate">
                      {project.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] uppercase tracking-[0.1em] font-medium ${
                          project.status === "active"
                            ? "bg-green-400/10 text-green-400/70 border border-green-400/10"
                            : "bg-white/[0.02] text-on-surface-variant/30 border border-white/[0.03]"
                        }`}
                      >
                        {project.status}
                      </span>
                      {project.category && (
                        <span className="text-[9px] text-on-surface-variant/25 uppercase tracking-[0.1em]">
                          {project.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-on-surface-variant/40 font-medium">
                      {project.progress}%
                    </div>
                    <div className="w-16 h-1 bg-white/[0.04] rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-primary/40 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant/15 mb-3 block">
                  folder_off
                </span>
                <p className="text-sm text-on-surface-variant/30">No projects yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-on-surface">
              Recent Messages
            </h3>
            <a
              href="/dashboard/messages"
              className="text-[10px] text-primary/60 hover:text-primary uppercase tracking-[0.12em] font-medium transition-colors"
            >
              View All
            </a>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/[0.03] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="w-40 h-3 bg-white/[0.03] rounded animate-pulse" />
                    <div className="w-24 h-2 bg-white/[0.02] rounded animate-pulse" />
                  </div>
                </div>
              ))
            ) : data?.recentMessages && data.recentMessages.length > 0 ? (
              data.recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-5 flex items-center gap-4 hover:bg-white/[0.01] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-400/[0.06] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-amber-400/50">
                      {msg.read ? "drafts" : "mark_email_unread"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${msg.read ? "text-on-surface-variant/50 font-light" : "text-on-surface font-medium"}`}>
                      {msg.subject}
                    </p>
                    <p className="text-[11px] text-on-surface-variant/30 mt-0.5 truncate">
                      from {msg.sender}
                    </p>
                  </div>
                  <div className="text-[10px] text-on-surface-variant/20">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant/15 mb-3 block">
                  inbox
                </span>
                <p className="text-sm text-on-surface-variant/30">No messages yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-sm font-semibold text-on-surface mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "New Project", icon: "add_circle", href: "/dashboard/projects" },
            { label: "Send Message", icon: "send", href: "/dashboard/messages" },
            { label: "Invite Team", icon: "person_add", href: "/dashboard/team" },
            { label: "Settings", icon: "tune", href: "/dashboard/settings" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-lg bg-white/[0.015] border border-white/[0.03] hover:bg-white/[0.03] hover:border-white/[0.06] transition-all duration-300 group"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant/30 group-hover:text-primary/60 transition-colors">
                {action.icon}
              </span>
              <span className="text-xs text-on-surface-variant/40 group-hover:text-on-surface-variant/70 font-medium transition-colors">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
