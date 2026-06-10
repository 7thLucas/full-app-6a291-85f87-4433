import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { useProjects } from "~/modules/review-workflow/src/hooks/use-projects";
import { UserRole } from "~/modules/authentication/authentication.types";
import { ProjectStatus, STATUS_LABEL } from "~/modules/review-workflow/src/types/project-status.types";
import { FolderOpen, Plus, Calendar, Users, ArrowRight } from "lucide-react";
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

export default function ProjectsPage() {
  const { user } = useLoaderData<typeof loader>();
  const { projects, loading } = useProjects();
  const isAgency = user.role === UserRole.Agency || user.role === UserRole.Admin;

  return (
    <div className="flex h-screen bg-[#080810]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Projects</h1>
              <p className="mt-1 text-gray-400">
                {loading ? "Loading…" : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            {isAgency && (
              <Link to="/projects/new" className="flex items-center gap-2 rounded-xl bg-[#ec4899] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#be185d] transition-colors">
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl border border-[#1f1f2e] bg-[#111118]" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-[#1f1f2e] py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a1a28] border border-[#1f1f2e]">
                <FolderOpen className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">No projects yet</p>
                <p className="mt-1 max-w-xs text-sm text-gray-500">
                  {isAgency
                    ? "Create your first project and invite clients to start reviewing."
                    : "You haven't been added to any projects. Ask your agency for an invite link."}
                </p>
              </div>
              {isAgency && (
                <Link to="/projects/new" className="flex items-center gap-2 rounded-xl bg-[#ec4899] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#be185d] transition-colors">
                  <Plus className="h-4 w-4" /> Create your first project
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-[#1f1f2e] bg-[#111118] p-5 hover:border-[#ec4899]/30 hover:bg-[#1a1a28] transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold leading-tight text-white group-hover:text-[#ec4899] transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <StatusBadge status={project.status} />
                  </div>

                  {project.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{project.description}</p>
                  )}

                  <div className="mt-auto flex items-center gap-4 text-xs text-gray-500">
                    {project.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {project.client_ids?.length ?? 0} client{project.client_ids?.length !== 1 ? "s" : ""}
                    </span>
                    {project.round > 1 && (
                      <span className="ml-auto rounded-full bg-[#1a1a28] border border-[#1f1f2e] px-2 py-0.5 text-gray-500">R{project.round}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-[#ec4899]">
                    Open project <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
