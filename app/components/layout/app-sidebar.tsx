import { Link, useLocation, Form } from "react-router";
import { useAuth } from "~/modules/authentication/use-authentication";
import { useConfigurables } from "~/modules/configurables";
import { UserRole } from "~/modules/authentication/authentication.types";
import { cn } from "~/lib/utils";
import { FolderOpen, Home, LogOut, User, ChevronRight } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export function AppSidebar() {
  const { user } = useAuth();
  const { config, loading } = useConfigurables();
  const location = useLocation();

  const isAgency = user?.role === UserRole.Agency || user?.role === UserRole.Admin;

  const navItems: NavItem[] = [
    { to: "/dashboard", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { to: "/projects", label: "Projects", icon: <FolderOpen className="h-4 w-4" /> },
  ];

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-[#1f1f2e] bg-[#0d0d14]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-[#1f1f2e] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ec4899]/10 border border-[#ec4899]/20">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="#ec4899" strokeWidth="2.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <span className="text-base font-black tracking-tight text-white">
          {loading ? "…" : (config?.appName ?? "Approvly")}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== "/dashboard" && location.pathname.startsWith(item.to + "/"));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-[#ec4899]/10 text-[#ec4899] border border-[#ec4899]/20"
                  : "text-gray-400 hover:bg-[#111118] hover:text-white border border-transparent"
              )}
            >
              <span className={cn(isActive ? "text-[#ec4899]" : "text-gray-500")}>
                {item.icon}
              </span>
              {item.label}
              {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#ec4899]/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Role badge */}
      <div className="px-3 mb-2">
        <div className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-widest",
          isAgency
            ? "bg-[#ec4899]/10 text-[#ec4899] border border-[#ec4899]/20"
            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
        )}>
          <User className="h-3.5 w-3.5" />
          {isAgency ? "Agency" : "Client"}
        </div>
      </div>

      {/* User footer */}
      <div className="border-t border-[#1f1f2e] p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ec4899]/20 border border-[#ec4899]/30">
            <span className="text-xs font-bold text-[#ec4899]">
              {user?.username?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.username ?? "User"}</p>
            <p className="truncate text-xs text-gray-500">{user?.email ?? ""}</p>
          </div>
        </div>
        <Form action="/auth/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-[#111118] hover:text-gray-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </Form>
      </div>
    </aside>
  );
}
