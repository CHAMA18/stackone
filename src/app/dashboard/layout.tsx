"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const NAV_ITEMS = [
  {
    href: "/dashboard/overview",
    label: "Overview",
    icon: "dashboard",
  },
  {
    href: "/dashboard/projects",
    label: "Projects",
    icon: "folder",
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: "mail",
  },
  {
    href: "/dashboard/team",
    label: "Team",
    icon: "groups",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: "settings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-8 w-8 text-primary"
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
          <p className="text-on-surface-variant/40 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050507] flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-surface-container-lowest border-r border-white/[0.04] z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/[0.04]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary-container/15 flex items-center justify-center ring-1 ring-white/[0.06]">
                <img
                  alt="StackOne"
                  className="w-full h-full object-cover"
                  src="/images/stackone-logo.png"
                />
              </div>
              <span className="text-lg font-bold text-gradient-subtle tracking-[-0.02em]">
                StackOne
              </span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/10"
                      : "text-on-surface-variant/50 hover:text-on-surface-variant/80 hover:bg-white/[0.02] border border-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
                {session?.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-on-surface font-medium truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-[10px] text-on-surface-variant/30 truncate">
                  {session?.user?.email || ""}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-on-surface-variant/30 hover:text-red-400 transition-colors duration-200"
                title="Sign out"
              >
                <span className="material-symbols-outlined text-[18px]">
                  logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/[0.04] bg-[#050507]/80 backdrop-blur-xl flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 text-on-surface-variant/50 hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="flex-1">
            <h2 className="text-sm font-medium text-on-surface-variant/60">
              {NAV_ITEMS.find((i) => i.href === pathname)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              <span className="text-[9px] text-on-surface-variant/40 uppercase tracking-[0.1em] font-medium">
                Online
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
