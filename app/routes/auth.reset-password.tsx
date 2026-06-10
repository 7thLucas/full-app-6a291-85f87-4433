import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "react-router";
import { useConfigurables } from "~/modules/configurables";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  const token = new URL(request.url).searchParams.get("token");
  if (!token) return redirect("/auth/forgot-password");
  return { token };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    await AuthService.resetPassword({
      token: String(formData.get("token") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });
    return redirect("/auth/login");
  } catch (error: any) {
    return { error: error.message ?? "Reset failed. The link may have expired." };
  }
}

interface ActionData { error?: string }

export default function ResetPasswordRoute() {
  const { token } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config } = useConfigurables();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080810] px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[#ec4899]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ec4899]/10 border border-[#ec4899]/20">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="#ec4899" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-white">{config?.appName ?? "Approvly"}</span>
          </Link>
          <p className="mt-4 text-sm text-gray-400">Set a new password</p>
        </div>

        <div className="rounded-2xl border border-[#1f1f2e] bg-[#111118] p-8">
          {actionData?.error && (
            <div className="mb-5 rounded-xl bg-red-900/20 border border-red-800/30 px-4 py-3 text-sm text-red-400">
              {actionData.error}
            </div>
          )}
          <Form method="post" className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-xl border border-[#1f1f2e] bg-[#16161f] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ec4899]/50 focus:outline-none focus:ring-1 focus:ring-[#ec4899]/30 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-xl border border-[#1f1f2e] bg-[#16161f] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ec4899]/50 focus:outline-none focus:ring-1 focus:ring-[#ec4899]/30 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#ec4899] py-3 text-sm font-semibold text-white hover:bg-[#be185d] disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? "Resetting…" : "Reset password"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
