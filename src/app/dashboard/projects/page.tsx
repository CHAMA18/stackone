"use client";

import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  category: string | null;
  budget: string | null;
  progress: number;
  deadline: string | null;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    category: "",
    budget: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/dashboard/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/dashboard/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        setShowNew(false);
        setNewProject({ name: "", description: "", category: "", budget: "" });
        fetchProjects();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-400/10 text-green-400/70 border-green-400/10",
    completed: "bg-primary/10 text-primary/70 border-primary/10",
    paused: "bg-amber-400/10 text-amber-400/70 border-amber-400/10",
    cancelled: "bg-red-400/10 text-red-400/70 border-red-400/10",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-[-0.02em]">
            Projects
          </h1>
          <p className="text-on-surface-variant/50 text-sm font-light mt-1">
            Manage and track all your projects
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="btn-primary text-white px-6 py-2.5 rounded-lg uppercase tracking-[0.15em] text-[10px] font-bold relative z-10"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px]">add</span>
            New Project
          </span>
        </button>
      </div>

      {/* New project form */}
      {showNew && (
        <div className="glass-panel-elevated rounded-xl p-6 animate-slide-up-fade">
          <h3 className="text-sm font-semibold text-on-surface mb-4">
            Create New Project
          </h3>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-on-surface-variant/50 font-medium mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                  placeholder="Project name"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] text-on-surface-variant/50 font-medium mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={newProject.category}
                  onChange={(e) =>
                    setNewProject((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                  placeholder="e.g. Fintech, HealthTech"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.12em] text-on-surface-variant/50 font-medium mb-2">
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm resize-none"
                placeholder="Describe your project..."
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.12em] text-on-surface-variant/50 font-medium mb-2">
                Budget
              </label>
              <input
                type="text"
                value={newProject.budget}
                onChange={(e) =>
                  setNewProject((p) => ({ ...p, budget: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-on-surface placeholder-on-surface-variant/25 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                placeholder="e.g. $10,000 - $25,000"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={creating}
                className="btn-primary text-white px-6 py-2.5 rounded-lg text-[10px] uppercase tracking-[0.12em] font-bold relative z-10 disabled:opacity-50"
              >
                <span className="relative z-10">
                  {creating ? "Creating..." : "Create Project"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowNew(false)}
                className="px-6 py-2.5 rounded-lg text-[10px] uppercase tracking-[0.12em] font-medium text-on-surface-variant/40 border border-white/[0.05] hover:bg-white/[0.02] transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-xl p-6 animate-pulse">
              <div className="w-3/4 h-4 bg-white/[0.03] rounded mb-3" />
              <div className="w-1/2 h-3 bg-white/[0.02] rounded mb-4" />
              <div className="w-full h-2 bg-white/[0.02] rounded" />
            </div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-panel rounded-xl p-6 hover:border-white/[0.08] transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] uppercase tracking-[0.1em] font-medium border ${
                    statusColors[project.status] || statusColors.active
                  }`}
                >
                  {project.status}
                </span>
              </div>
              {project.description && (
                <p className="text-xs text-on-surface-variant/35 font-light leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}
              <div className="flex items-center gap-4 mb-4">
                {project.category && (
                  <span className="text-[9px] text-on-surface-variant/25 uppercase tracking-[0.1em]">
                    {project.category}
                  </span>
                )}
                {project.budget && (
                  <span className="text-[9px] text-on-surface-variant/25 uppercase tracking-[0.1em]">
                    {project.budget}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/30 rounded-full transition-all duration-700"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-on-surface-variant/30 font-medium">
                  {project.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-xl p-16 text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/10 mb-4 block">
            folder_off
          </span>
          <h3 className="text-lg font-medium text-on-surface-variant/40 mb-2">
            No projects yet
          </h3>
          <p className="text-sm text-on-surface-variant/25 font-light mb-6">
            Create your first project to get started
          </p>
          <button
            onClick={() => setShowNew(true)}
            className="btn-primary text-white px-6 py-2.5 rounded-lg text-[10px] uppercase tracking-[0.12em] font-bold relative z-10"
          >
            <span className="relative z-10">Create Project</span>
          </button>
        </div>
      )}
    </div>
  );
}
