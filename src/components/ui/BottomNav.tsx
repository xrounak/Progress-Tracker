import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import { LayoutDashboard, Target, Calendar, User } from "lucide-react";

const links = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/goals", label: "Goals", icon: Target },
  { to: "/app/calendar", label: "Calendar", icon: Calendar },
  { to: "/app/profile", label: "Profile", icon: User }
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 block border-t border-border bg-background/95 backdrop-blur-lg md:hidden">
      <ul className="flex items-center justify-around px-2 py-2">
        {links.map((link) => (
          <li key={link.to} className="flex-1">
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all duration-200",
                  "text-muted-foreground hover:text-foreground",
                  isActive && "bg-primary/10 text-primary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                  <span className={cn(
                    "text-[10px] font-medium",
                    isActive && "text-primary"
                  )}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
