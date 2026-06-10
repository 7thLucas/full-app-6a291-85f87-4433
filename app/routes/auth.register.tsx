import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { getUserFromRequest, signJwt, buildAuthCookie } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { GoogleLoginButton } from "~/modules/authentication-google/components/google-login-button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UserRole } from "~/modules/authentication/authentication.types";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const accountType = String(formData.get("accountType") ?? "agency") as "agency" | "client";

  try {
    const user = await AuthService.register({
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    const role = accountType === "client" ? UserRole.Client : UserRole.Agency;
    const { UserModel } = await import("~/modules/authentication/authentication.model");
    await UserModel.updateOne({ _id: user.id }, { role });

    const token = signJwt({ sub: user.id, role, username: user.username, email: user.email, email_verified: user.email_verified ?? false });
    return redirect("/dashboard", { headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) } });
  } catch (error: any) {
    return { error: error.message ?? "Registration failed" };
  }
}

interface ActionData { error?: string }

export default function RegisterRoute() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config } = useConfigurables();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<"agency" | "client">("agency");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080810] px-4 py-8">
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
            <span className="text-xl font-black tracking-tight text-white">
              {config?.appName ?? "Approvly"}
            </span>
          </Link>
          <p className="mt-4 text-sm text-gray-400">Create your account</p>
        </div>

        <div className="rounded-2xl border border-[#1f1f2e] bg-[#111118] p-8">
          {actionData?.error && (
            <div className="mb-5 rounded-xl bg-red-900/20 border border-red-800/30 px-4 py-3 text-sm text-red-400">
              {actionData.error}
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">I am a…</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType("agency")}
                className={`rounded-xl border p-3 text-left transition-all ${
                  accountType === "agency"
                    ? "border-[#ec4899]/50 bg-[#ec4899]/10 text-white"
                    : "border-[#1f1f2e] bg-[#16161f] text-gray-400 hover:text-gray-300"
                }`}
              >
                <p className="text-sm font-semibold">Agency</p>
                <p className="text-xs opacity-70 mt-0.5">Create &amp; manage projects</p>
              </button>
              <button
                type="button"
                onClick={() => setAccountType("client")}
                className={`rounded-xl border p-3 text-left transition-all ${
                  accountType === "client"
                    ? "border-blue-500/50 bg-blue-500/10 text-white"
                    : "border-[#1f1f2e] bg-[#16161f] text-gray-400 hover:text-gray-300"
                }`}
              >
                <p className="text-sm font-semibold">Client</p>
                <p className="text-xs opacity-70 mt-0.5">Review &amp; approve work</p>
              </button>
            </div>
          </div>

          <Form method="post" className="space-y-4">
            <input type="hidden" name="accountType" value={accountType} />

            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">Name</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Your name"
                className="w-full rounded-xl border border-[#1f1f2e] bg-[#16161f] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ec4899]/50 focus:outline-none focus:ring-1 focus:ring-[#ec4899]/30 transition-colors"
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="Minimum 8 characters"
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
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </Form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1f1f2e]" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-[#1f1f2e]" />
          </div>

          <GoogleLoginButton redirectTo="/dashboard" className="rounded-xl border-[#1f1f2e] bg-[#16161f] text-gray-300 hover:bg-[#1f1f2e]" />

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-[#ec4899] hover:text-[#f9a8d4] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
