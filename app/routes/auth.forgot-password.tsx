import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { CheckCircle } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try { await AuthService.forgotPassword(String(formData.get("email") ?? "")); } catch {}
  return { success: true, message: "If that email exists, a reset link has been sent. Check your inbox." };
}

interface ActionData { success?: boolean; message?: string }

export default function ForgotPasswordRoute() {
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
          <p className="mt-4 text-sm text-gray-400">Reset your password</p>
        </div>

        <div className="rounded-2xl border border-[#1f1f2e] bg-[#111118] p-8">
          {actionData?.success ? (
            <div className="text-center space-y-4">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-green-900/20 border border-green-800/30">
                <CheckCircle className="h-7 w-7 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Check your inbox</p>
                <p className="mt-1 text-sm text-gray-400">{actionData.message}</p>
              </div>
              <Link to="/auth/login" className="block text-sm text-[#ec4899] hover:text-[#f9a8d4] transition-colors">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-gray-400">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <Form method="post" className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@agency.com"
                    className="w-full rounded-xl border border-[#1f1f2e] bg-[#16161f] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ec4899]/50 focus:outline-none focus:ring-1 focus:ring-[#ec4899]/30 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#ec4899] py-3 text-sm font-semibold text-white hover:bg-[#be185d] disabled:opacity-60 transition-colors"
                >
                  {isSubmitting ? "Sending…" : "Send reset link"}
                </button>
              </Form>
              <p className="mt-5 text-center text-sm text-gray-500">
                <Link to="/auth/login" className="text-[#ec4899] hover:text-[#f9a8d4] transition-colors">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
