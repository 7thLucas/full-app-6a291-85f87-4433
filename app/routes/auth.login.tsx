import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest, signJwt, buildAuthCookie } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { GoogleLoginButton } from "~/modules/authentication-google/components/google-login-button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    const user = await AuthService.login({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    const token = signJwt({ sub: user.id, role: user.role, username: user.username, email: user.email });
    return redirect("/dashboard", { headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) } });
  } catch (error: any) {
    return { error: error.message ?? "Invalid credentials" };
  }
}

interface ActionData { error?: string }

export default function LoginRoute() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config } = useConfigurables();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080810] px-4">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[#ec4899]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ec4899]/10 border border-[#ec4899]/20">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="#ec4899" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              {config?.appName ?? "Approvly"}
            </span>
          </Link>
          <p className="mt-4 text-sm text-gray-400">Sign in to your workspace</p>
        </div>

        <div className="rounded-2xl border border-[#1f1f2e] bg-[#111118] p-8">
          {actionData?.error && (
            <div className="mb-5 rounded-xl bg-red-900/20 border border-red-800/30 px-4 py-3 text-sm text-red-400">
              {actionData.error}
            </div>
          )}

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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                <Link to="/auth/forgot-password" className="text-xs text-[#ec4899] hover:text-[#f9a8d4] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#1f1f2e] bg-[#16161f] px-4 py-3 pr-11 text-sm text-white placeholder-gray-600 focus:border-[#ec4899]/50 focus:outline-none focus:ring-1 focus:ring-[#ec4899]/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#ec4899] py-3 text-sm font-semibold text-white hover:bg-[#be185d] disabled:opacity-60 transition-colors mt-2"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </Form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1f1f2e]" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-[#1f1f2e]" />
          </div>

          <GoogleLoginButton redirectTo="/dashboard" className="rounded-xl border-[#1f1f2e] bg-[#16161f] text-gray-300 hover:bg-[#1f1f2e]" />

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-[#ec4899] hover:text-[#f9a8d4] font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
