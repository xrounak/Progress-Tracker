import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";
import { HomePage } from "@/pages/misc/HomePage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { DashboardPage } from "@/pages/app/DashboardPage";
import { GoalsPage } from "@/pages/app/GoalsPage";
import { CalendarPage } from "@/pages/app/CalendarPage";
import { ProfilePage } from "@/pages/app/ProfilePage";
import { GoalPage } from "@/pages/app/GoalPage";
import { NotFoundPage } from "@/pages/misc/NotFoundPage";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="goal/:goalId" element={<GoalPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </>
  ),
  {
    future: {
      v7_startTransition: true
    }
  }
);



