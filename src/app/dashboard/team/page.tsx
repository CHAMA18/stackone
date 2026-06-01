"use client";

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Chungu Chipimo Chama",
      role: "Founder & Managing Director",
      email: "chungu@thestackone.com",
      initials: "CC",
      color: "bg-primary/15 text-primary",
    },
    {
      name: "Clivate Maiba",
      role: "Co-Founder/Director",
      email: "clivate@thestackone.com",
      initials: "CM",
      color: "bg-amber-400/15 text-amber-400",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-[-0.02em]">
            Team
          </h1>
          <p className="text-on-surface-variant/50 text-sm font-light mt-1">
            Manage your team members and roles
          </p>
        </div>
        <button className="btn-primary text-white px-6 py-2.5 rounded-lg uppercase tracking-[0.15em] text-[10px] font-bold relative z-10">
          <span className="relative z-10 flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px]">
              person_add
            </span>
            Invite Member
          </span>
        </button>
      </div>

      {/* Team list */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="divide-y divide-white/[0.03]">
          {teamMembers.map((member) => (
            <div
              key={member.email}
              className="p-6 flex items-center gap-5 hover:bg-white/[0.01] transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center text-sm font-bold shrink-0`}
              >
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">
                  {member.name}
                </p>
                <p className="text-xs text-on-surface-variant/40 font-light mt-0.5">
                  {member.role}
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs text-on-surface-variant/30 font-light">
                  {member.email}
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center px-2.5 py-1 rounded text-[9px] uppercase tracking-[0.1em] font-medium bg-primary/[0.04] border border-primary/[0.06] text-primary/40">
                  Admin
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending invitations */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary/50">
            pending
          </span>
          Pending Invitations
        </h3>
        <div className="text-center py-8">
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant/10 mb-3 block">
            mail_off
          </span>
          <p className="text-sm text-on-surface-variant/30 font-light">
            No pending invitations
          </p>
        </div>
      </div>
    </div>
  );
}
