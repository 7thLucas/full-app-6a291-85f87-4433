import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { UserRole } from "~/modules/authentication/authentication.types";
import { getReviewWorkflowCapabilities } from "~/modules/review-workflow/src/types/workflow-capabilities.types";
import { useProjectFiles } from "~/modules/file-review/src/hooks/use-project-files";
import { FileViewer } from "~/modules/file-review/src/components/file-viewer/file-viewer";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return {
    user,
    projectId: params.projectId ?? "",
    fileId: params.fileId ?? "",
  };
}

export default function FileViewerPage() {
  const { user, projectId, fileId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { files, loading } = useProjectFiles(projectId, { basePath: "/api/review-workflow" });

  const isAgency = user.role === UserRole.Agency || user.role === UserRole.Admin;
  const file = files.find((f) => f._id === fileId);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#080810]">
        <div className="text-gray-400 text-sm">Loading file…</div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#080810]">
        <p className="text-white font-semibold">File not found</p>
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="rounded-xl bg-[#ec4899] px-4 py-2 text-sm font-semibold text-white hover:bg-[#be185d] transition-colors"
        >
          Back to project
        </button>
      </div>
    );
  }

  // We don't have the project status here, default to permissive for file viewer
  const capabilities = getReviewWorkflowCapabilities(undefined, isAgency ? UserRole.Agency : UserRole.Client);

  return (
    <FileViewer
      file={file}
      canAnnotate={capabilities.canAnnotate}
      canComment={capabilities.canComment}
      canResolve={capabilities.canResolve}
      readOnly={capabilities.readOnly}
      currentUserId={user.id}
      onClose={() => navigate(`/projects/${projectId}`)}
    />
  );
}
