import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useProjects } from "~/modules/review-workflow/src/hooks/use-projects";
import { UserRole } from "~/modules/authentication/authentication.types";
import { ProjectStatus, STATUS_LABEL } from "~/modules/review-workflow/src/types/project-status.types";
import { FolderOpen, Plus, CheckCircle, Clock, RefreshCw, ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user };
}

function StatusBadge({ status }: { status: string }) {
  const s = status as ProjectStatus;
  const colorMap: Record<ProjectStatus, string> = {
    [ProjectStatus.Draft]: "bg-gray-800 text-gray-400 border-gray-700",
    [ProjectStatus.InReview]: "bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/20",
    [ProjectStatus.InRevision]: "bg-amber-900/30 text-amber-400 border-amber-800/30",
    [ProjectStatus.Approved]: "bg-green-900/20 text-green-400 border-green-800/30",
  };
  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold", colorMap[s] ?? "bg-gray-800 text-gray-400 border-gray-700")}>
      {STATUS_LABEL[s] ?? status}
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useLoaderData<typeof loader>();
  const { user: authUser } = useAuth();
  const { projects, loading } = useProjects();

  const isAgency = user.role === UserRole.Agency || user.role === UserRole.Admin;

  const stats = {
    total: projects.length,
    inReview: projects.filter((p) => p.status === ProjectStatus.InReview).length,
    inRevision: projects.filter((p) => p.status === ProjectStatus.InRevision).length,
    approved: projects.filter((p) => p.status === ProjectStatus.Approved).length,
  };

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() - new Date(a.updatedAt ?? a.createdAt ?? 0).getTime())
    .slice(0, 5);

  return (
    <div className="flex h-screen bg-[#080810]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-8">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Welcome back, {authUser?.username ?? user.username}
              </h1>
              <p className="mt-1 text-gray-400">Here's what's happening across your projects.</p>
            </div>
            {isAgency && (
              <Link
                to="/projects/new"
                className="flex items-center gap-2 rounded-xl bg-[#ec4899] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#be185d] transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            )}
          </div>

          {/* Stats grid */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Projects" value={loading ? "-" : String(stats.total)} icon={<FolderOpen className="h-5 w-5 text-[#ec4899]" />} bgColor="bg-[#ec4899]/10" />
            <StatCard label="In Review" value={loading ? "-" : String(stats.inReview)} icon={<Clock className="h-5 w-5 text-[#ec4899]" />} bgColor="bg-[#ec4899]/10" />
            <StatCard label="In Revision" value={loading ? "-" : String(stats.inRevision)} icon={<RefreshCw className="h-5 w-5 text-amber-400" />} bgColor="bg-amber-900/20" />
            <StatCard label="Approved" value={loading ? "-" : String(stats.approved)} icon={<CheckCircle className="h-5 w-5 text-green-400" />} bgColor="bg-green-900/20" />
          </div>

          {/* Recent projects */}
          <div className="rounded-2xl border border-[#1f1f2e] bg-[#111118] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#1f1f2e] px-6 py-4">
              <h2 className="font-bold text-white">Recent Projects</h2>
              <Link to="/projects" className="flex items-center gap-1 text-sm text-[#ec4899] hover:text-[#f9a8d4] transition-colors">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-px">
                {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse bg-[#1a1a28]/50" />)}
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a1a28] border border-[#1f1f2e]">
                  <FolderOpen className="h-7 w-7 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-white">No projects yet</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {isAgency ? "Create your first project to get started." : "You haven't been added to any projects yet."}
                  </p>
                </div>
                {isAgency && (
                  <Link to="/projects/new" className="flex items-center gap-2 rounded-xl bg-[#ec4899] px-4 py-2 text-sm font-semibold text-white hover:bg-[#be185d] transition-colors">
                    <Plus className="h-4 w-4" /> Create project
                  </Link>
                )}
              </div>
            ) : (
              <div>
                {recentProjects.map((project, i) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className={cn(
                      "flex items-center justify-between px-6 py-4 hover:bg-[#1a1a28] transition-colors group",
                      i < recentProjects.length - 1 && "border-b border-[#1f1f2e]"
                    )}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1a1a28] border border-[#1f1f2e] group-hover:border-[#ec4899]/30 transition-colors">
                        <FolderOpen className="h-4 w-4 text-gray-500 group-hover:text-[#ec4899] transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate">{project.title}</p>
                        {project.description && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">{project.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <StatusBadge status={project.status} />
                      {project.round > 1 && (
                        <span className="rounded-full bg-[#1a1a28] border border-[#1f1f2e] px-2 py-0.5 text-xs text-gray-500">R{project.round}</span>
                      )}
                      <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-[#ec4899] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, bgColor }: { label: string; value: string; icon: React.ReactNode; bgColor: string }) {
  return (
    <div className="rounded-2xl border border-[#1f1f2e] bg-[#111118] p-5">
      <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl", bgColor)}>
        {icon}
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
