"use client";

import { useEffect, useState } from "react";

interface Message {
  id: string;
  subject: string;
  body: string;
  sender: string;
  read: boolean;
  starred: boolean;
  createdAt: string;
  project: { name: string } | null;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch("/api/dashboard/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      await fetch(`/api/dashboard/messages/${id}`, { method: "PATCH" });
      fetchMessages();
    } catch (e) {
      console.error(e);
    }
  }

  async function toggleStar(id: string, starred: boolean) {
    try {
      await fetch(`/api/dashboard/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred: !starred }),
      });
      fetchMessages();
    } catch (e) {
      console.error(e);
    }
  }

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "starred") return m.starred;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-[-0.02em]">
            Messages
          </h1>
          <p className="text-on-surface-variant/50 text-sm font-light mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.02] border border-white/[0.04] w-fit">
        {(
          [
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "starred", label: "Starred" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-[0.12em] font-medium transition-all duration-200 ${
              filter === tab.key
                ? "bg-primary/10 text-primary border border-primary/10"
                : "text-on-surface-variant/40 hover:text-on-surface-variant/60 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message list */}
        <div className={`lg:col-span-${selected ? "1" : "3"} transition-all`}>
          <div className="glass-panel rounded-xl overflow-hidden">
            {loading ? (
              <div className="divide-y divide-white/[0.03]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-5 flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-white/[0.03]" />
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-3 bg-white/[0.03] rounded" />
                      <div className="w-1/2 h-2 bg-white/[0.02] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="divide-y divide-white/[0.03] max-h-[600px] overflow-y-auto">
                {filtered.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelected(msg);
                      if (!msg.read) markAsRead(msg.id);
                    }}
                    className={`p-5 flex items-start gap-4 cursor-pointer hover:bg-white/[0.01] transition-colors ${
                      !msg.read ? "bg-primary/[0.02]" : ""
                    } ${selected?.id === msg.id ? "border-l-2 border-l-primary/40" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-400/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-amber-400/50">
                        {msg.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={`text-xs truncate ${
                            msg.read
                              ? "text-on-surface-variant/40 font-light"
                              : "text-on-surface font-medium"
                          }`}
                        >
                          {msg.sender}
                        </p>
                        <span className="text-[9px] text-on-surface-variant/20">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p
                        className={`text-sm truncate mb-1 ${
                          msg.read
                            ? "text-on-surface-variant/30 font-light"
                            : "text-on-surface font-medium"
                        }`}
                      >
                        {msg.subject}
                      </p>
                      <p className="text-xs text-on-surface-variant/20 truncate">
                        {msg.body.slice(0, 80)}...
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(msg.id, msg.starred);
                      }}
                      className="shrink-0 mt-1"
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] transition-colors ${
                          msg.starred
                            ? "text-amber-400"
                            : "text-on-surface-variant/15 hover:text-on-surface-variant/30"
                        }`}
                      >
                        {msg.starred ? "star" : "star_border"}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/10 mb-4 block">
                  inbox
                </span>
                <h3 className="text-lg font-medium text-on-surface-variant/40 mb-2">
                  No messages
                </h3>
                <p className="text-sm text-on-surface-variant/25 font-light">
                  {filter === "unread"
                    ? "You've read everything!"
                    : filter === "starred"
                      ? "Star important messages to find them here"
                      : "Messages will appear here when they arrive"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message detail */}
        {selected && (
          <div className="lg:col-span-2 glass-panel rounded-xl p-6 animate-slide-up-fade">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-on-surface mb-2">
                  {selected.subject}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400/[0.06] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-amber-400/50">
                      {selected.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface font-medium">
                      {selected.sender}
                    </p>
                    <p className="text-[10px] text-on-surface-variant/30">
                      {new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-on-surface-variant/30 hover:text-on-surface-variant/60 transition-colors lg:hidden"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>
            {selected.project && (
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/[0.04] border border-primary/[0.06]">
                <span className="material-symbols-outlined text-[12px] text-primary/40">
                  folder
                </span>
                <span className="text-[10px] text-primary/50 uppercase tracking-[0.1em] font-medium">
                  {selected.project.name}
                </span>
              </div>
            )}
            <div className="text-sm text-on-surface-variant/50 font-light leading-relaxed whitespace-pre-wrap">
              {selected.body}
            </div>
            <div className="mt-8 pt-6 border-t border-white/[0.04] flex gap-3">
              <button className="btn-primary text-white px-5 py-2 rounded-lg text-[10px] uppercase tracking-[0.12em] font-bold relative z-10">
                <span className="relative z-10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">
                    reply
                  </span>
                  Reply
                </span>
              </button>
              <button className="px-5 py-2 rounded-lg text-[10px] uppercase tracking-[0.12em] font-medium text-on-surface-variant/40 border border-white/[0.05] hover:bg-white/[0.02] transition-all">
                Forward
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
