import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import {
  FolderOpen,
  MessageSquare,
  CheckCircle,
  Users,
  History,
  Bell,
  ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  FolderOpen: <FolderOpen className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  CheckCircle: <CheckCircle className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  History: <History className="h-5 w-5" />,
  Bell: <Bell className="h-5 w-5" />,
};

export default function LandingPage() {
  const { config, loading } = useConfigurables();

  const appName = config?.appName ?? "Approvly";
  const tagline = config?.tagline ?? "Where great work gets approved.";
  const heroHeading = config?.heroHeading ?? tagline;
  const heroSubheading = config?.heroSubheading ?? "Replace scattered email feedback with a single workspace for creative review and approval.";
  const ctaLabel = config?.ctaLabel ?? "Get Started Free";
  const features = config?.features ?? [];
  const footerText = config?.footerText ?? `© 2026 ${appName}. Built for creative agencies.`;

  if (loading) {
    return <div className="min-h-screen bg-[#080810]" />;
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 left-1/2 -translate-x-1/2 h-[800px] w-[800px] rounded-full bg-[#ec4899]/6 blur-3xl" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[#be185d]/4 blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between border-b border-[#1f1f2e] px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ec4899]/10 border border-[#ec4899]/20">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="#ec4899" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="text-lg font-black tracking-tight text-white">{appName}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/auth/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/auth/register"
            className="rounded-xl bg-[#ec4899] px-4 py-2 text-sm font-semibold text-white hover:bg-[#be185d] transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center lg:py-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3d1040] bg-[#ec4899]/10 px-4 py-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ec4899]">
            Creative Review Platform
          </span>
        </div>

        <h1 className="mx-auto max-w-3xl text-5xl font-black leading-tight tracking-tight text-white lg:text-6xl" style={{ letterSpacing: "-0.03em" }}>
          {heroHeading}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
          {heroSubheading}
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/auth/register"
            className="group flex items-center gap-2 rounded-xl bg-[#ec4899] px-6 py-3 text-base font-semibold text-white hover:bg-[#be185d] transition-colors"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/auth/login"
            className="rounded-xl border border-[#1f1f2e] bg-[#16161f] px-6 py-3 text-base font-medium text-gray-300 hover:bg-[#1f1f2e] hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Hero visual */}
        <div className="mt-16 mx-auto max-w-4xl rounded-2xl border border-[#1f1f2e] bg-[#111118] p-1 shadow-2xl shadow-[#ec4899]/5">
          <div className="rounded-xl border border-[#1f1f2e] bg-[#0d0d14] overflow-hidden">
            {/* Mockup header */}
            <div className="flex items-center gap-3 border-b border-[#1f1f2e] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#1f1f2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#1f1f2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#1f1f2e]" />
              </div>
              <div className="flex-1 h-3 max-w-40 rounded-full bg-[#1f1f2e]" />
            </div>
            {/* Mockup content */}
            <div className="grid grid-cols-3 gap-3 p-4">
              {[
                { status: "In Review", color: "text-[#ec4899]", bg: "bg-[#ec4899]/10 border-[#ec4899]/20" },
                { status: "Approved", color: "text-green-400", bg: "bg-green-900/20 border-green-800/30" },
                { status: "In Revision", color: "text-amber-400", bg: "bg-amber-900/20 border-amber-800/30" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-[#1f1f2e] bg-[#111118] p-3">
                  <div className="mb-2 h-3 w-3/4 rounded-full bg-[#1f1f2e]" />
                  <div className="mb-3 h-2 w-1/2 rounded-full bg-[#1a1a28]" />
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${item.color} ${item.bg}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3d1040] bg-[#ec4899]/10 px-4 py-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ec4899]">Features</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>
              Everything your agency needs
            </h2>
            <p className="mt-3 text-gray-400">Built for the creative review workflow. Nothing more, nothing less.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#1f1f2e] bg-[#111118] p-6 hover:border-[#ec4899]/30 hover:bg-[#1a1a28] transition-all group"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#ec4899]/10 border border-[#ec4899]/20 text-[#ec4899] group-hover:bg-[#ec4899]/20 transition-colors">
                  {iconMap[feature.icon ?? ""] ?? <CheckCircle className="h-5 w-5" />}
                </div>
                <h3 className="font-bold text-white">{feature.title}</h3>
                {feature.description && (
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="rounded-2xl border border-[#3d1040] bg-[#111118] p-12" style={{ background: "linear-gradient(135deg, #111118 0%, #1a0d1f 100%)" }}>
          <h2 className="text-4xl font-black tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>
            Ready to streamline your approvals?
          </h2>
          <p className="mt-4 text-gray-400">
            Join agencies using {appName} to deliver work clients love.
          </p>
          <Link
            to="/auth/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#ec4899] px-8 py-3.5 text-base font-semibold text-white hover:bg-[#be185d] transition-colors"
          >
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1f1f2e] px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ec4899]/10 border border-[#ec4899]/20">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="#ec4899" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white">{appName}</span>
        </div>
        <p className="text-sm text-gray-600">{footerText}</p>
      </footer>
    </div>
  );
}
