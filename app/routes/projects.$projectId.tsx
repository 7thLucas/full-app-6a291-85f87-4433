import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { useProjectDetail } from "~/modules/review-workflow/src/hooks/use-project-detail";
import { ProjectDetail } from "~/modules/review-workflow/src/components/project-detail/project-detail";
import { UserRole } from "~/modules/authentication/authentication.types";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return { user, projectId: params.projectId ?? "" };
}

export default function ProjectDetailPage() {
  const { user, projectId } = useLoaderData<typeof loader>();
  const { project, loading, refetch } = useProjectDetail(projectId);

  const isAgency = user.role === UserRole.Agency || user.role === UserRole.Admin;

  return (
    <div className="flex h-screen bg-[#080810]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-8">
          <Link
            to="/projects"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>

          {loading ? (
            <div className="space-y-6">
              <div className="h-10 w-64 animate-pulse rounded-xl bg-[#1a1a28]" />
              <div className="h-4 w-48 animate-pulse rounded-lg bg-[#1a1a28]" />
              <div className="h-40 animate-pulse rounded-2xl bg-[#111118] border border-[#1f1f2e]" />
            </div>
          ) : (
            <ProjectDetail
              project={project}
              isAgency={isAgency}
              currentUserId={user.id}
              onRefetch={refetch}
            />
          )}
        </div>
      </main>
    </div>
  );
}
