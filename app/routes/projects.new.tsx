import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { UserRole } from "~/modules/authentication/authentication.types";
import { ArrowLeft, Calendar } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  if (user.role !== UserRole.Agency && user.role !== UserRole.Admin) {
    return redirect("/projects");
  }
  return { user };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const deadline = String(formData.get("deadline") ?? "").trim();

  if (!title) return { error: "Project title is required" };

  try {
    const { ReviewProjectService } = await import("~/modules/review-workflow/src/services/review-project.service");
    const project = await ReviewProjectService.create({
      title,
      description: description || undefined,
      deadline: deadline ? new Date(deadline) : undefined,
      agency_id: user.id,
    });
    return redirect(`/projects/${project._id}`);
  } catch (error: any) {
    return { error: error.message ?? "Failed to create project" };
  }
}

interface ActionData { error?: string }

export default function NewProjectPage() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex h-screen bg-[#080810]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl p-8">
          <Link
            to="/projects"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>

          <h1 className="mb-8 text-3xl font-black tracking-tight text-white">New Project</h1>

          <div className="rounded-2xl border border-[#1f1f2e] bg-[#111118] p-8">
            {actionData?.error && (
              <div className="mb-6 rounded-xl bg-red-900/20 border border-red-800/30 px-4 py-3 text-sm text-red-400">
                {actionData.error}
              </div>
            )}

            <Form method="post" className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-300">
                  Project Title <span className="text-[#ec4899]">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Summer Campaign 2026 — Brand Identity"
                  className="w-full rounded-xl border border-[#1f1f2e] bg-[#16161f] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ec4899]/50 focus:outline-none focus:ring-1 focus:ring-[#ec4899]/30 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-300">
                  Description
                  <span className="ml-1.5 text-xs text-gray-600 font-normal">Optional</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Describe the scope, deliverables, or any context for the client…"
                  className="w-full resize-none rounded-xl border border-[#1f1f2e] bg-[#16161f] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ec4899]/50 focus:outline-none focus:ring-1 focus:ring-[#ec4899]/30 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="deadline" className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Deadline
                  <span className="text-xs text-gray-600 font-normal">Optional</span>
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  className="w-full rounded-xl border border-[#1f1f2e] bg-[#16161f] px-4 py-3 text-sm text-white focus:border-[#ec4899]/50 focus:outline-none focus:ring-1 focus:ring-[#ec4899]/30 transition-colors [color-scheme:dark]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#ec4899] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#be185d] disabled:opacity-60 transition-colors"
                >
                  {isSubmitting ? "Creating…" : "Create Project"}
                </button>
                <Link
                  to="/projects"
                  className="rounded-xl border border-[#1f1f2e] bg-[#16161f] px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-[#1f1f2e] transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
