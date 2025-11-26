import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/ui/Sidebar";
import { BottomNav } from "@/components/ui/BottomNav";
import { TopBar } from "@/components/ui/TopBar";

export const AppShell: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-black">
      <TopBar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-0 px-0 md:px-4">
        <Sidebar />
        <main className="relative flex-1 pb-16 md:pb-4">
          <div className="h-full px-4 py-4 md:px-6 md:py-6">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};


