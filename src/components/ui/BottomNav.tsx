import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

const links = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/goals", label: "Goals" },
  { to: "/app/calendar", label: "Calendar" },
  { to: "/app/profile", label: "Profile" }
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 block border-t border-border bg-background/90 px-3 py-2 backdrop-blur md:hidden">
      <ul className="flex items-center justify-between gap-1">
        {links.map((link) => (
          <li key={link.to} className="flex-1">
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center rounded-md px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors",
                  isActive && "bg-accent/10 text-accent"
                )
              }
            >
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};


