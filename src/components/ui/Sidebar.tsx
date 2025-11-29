import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import { LayoutDashboard, Target, Calendar, User, Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/goals", label: "Goals", icon: Target },
  { to: "/app/calendar", label: "Calendar", icon: Calendar },
  { to: "/app/profile", label: "Profile", icon: User }
];

export const Sidebar: React.FC = () => {
  const { profile } = useProfile();
  const { user } = useAuth();

  return (
    <aside className="hidden h-full w-64 flex-col border-r border-border bg-background/80 backdrop-blur-lg md:flex">
      {/* Header */}
      <div className="border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold tracking-tight text-foreground">
              HabitTracker
            </span>
            <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              beta
            </span>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-xl border-2 border-primary/20">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span>{profile?.mood_sticker || "😊"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.name || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                isActive && "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
              )
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 px-4 py-3">
        <p className="text-[10px] text-muted-foreground">
          © 2024 HabitTracker
        </p>
      </div>
    </aside>
  );
};
