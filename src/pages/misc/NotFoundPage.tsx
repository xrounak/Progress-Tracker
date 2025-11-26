import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center px-4 py-10">
      <div className="space-y-4 text-center">
        <p className="text-xs font-semibold tracking-[0.25em] text-muted-foreground">
          404
        </p>
        <h1 className="text-lg font-semibold text-foreground">
          This page got off track
        </h1>
        <p className="text-xs text-muted-foreground">
          The habit you&apos;re looking for doesn&apos;t exist. Yet.
        </p>
        <Button asChild size="sm">
          <Link to="/app/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
};


