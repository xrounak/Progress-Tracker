import React, { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ErrorPage } from "@/pages/misc/ErrorPage";
import { Spinner } from "@/components/ui/Spinner";

// Lazy load pages
const HomePage = React.lazy(() => import("@/pages/misc/HomePage").then(module => ({ default: module.HomePage })));
const LoginPage = React.lazy(() => import("@/pages/auth/LoginPage").then(module => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import("@/pages/auth/RegisterPage").then(module => ({ default: module.RegisterPage })));
const DashboardPage = React.lazy(() => import("@/pages/app/DashboardPage").then(module => ({ default: module.DashboardPage })));
const GoalsPage = React.lazy(() => import("@/pages/app/GoalsPage").then(module => ({ default: module.GoalsPage })));
const CalendarPage = React.lazy(() => import("@/pages/app/CalendarPage").then(module => ({ default: module.CalendarPage })));
const ProfilePage = React.lazy(() => import("@/pages/app/ProfilePage").then(module => ({ default: module.ProfilePage })));
const GoalPage = React.lazy(() => import("@/pages/app/GoalPage").then(module => ({ default: module.GoalPage })));
const NotFoundPage = React.lazy(() => import("@/pages/misc/NotFoundPage").then(module => ({ default: module.NotFoundPage })));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <Spinner size="lg" />
  </div>
);

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route
        path="/"
        element={
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        }
      />
      <Route path="/auth">
        <Route
          path="login"
          element={
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="register"
          element={
            <Suspense fallback={<PageLoader />}>
              <RegisterPage />
            </Suspense>
          }
        />
      </Route>

      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="goals"
          element={
            <Suspense fallback={<PageLoader />}>
              <GoalsPage />
            </Suspense>
          }
        />
        <Route
          path="goal/:goalId"
          element={
            <Suspense fallback={<PageLoader />}>
              <GoalPage />
            </Suspense>
          }
        />
        <Route
          path="calendar"
          element={
            <Suspense fallback={<PageLoader />}>
              <CalendarPage />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        }
      />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true
    }
  }
);



