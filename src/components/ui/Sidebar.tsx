import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

const links = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/goals", label: "Goals" },
  { to: "/app/calendar", label: "Calendar" },
  { to: "/app/profile", label: "Profile" }
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden h-full w-60 flex-col border-r border-border bg-background/80 px-3 py-4 backdrop-blur-lg md:flex">
      <div className="mb-6 flex items-center justify-between px-1">
        <span className="text-sm font-semibold tracking-tight">
          HabitTracker
        </span>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          beta
        </span>
      </div>

      <nav className="space-y-1 text-sm">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-2.5 py-2 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground",
                isActive && "bg-accent/10 text-accent"
              )
            }
          >
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};


