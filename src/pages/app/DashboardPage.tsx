import React from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground sm:text-xl">
            Today&apos;s snapshot
          </h1>
          <p className="text-xs text-muted-foreground">
            Quick overview of your progress and streaks.
          </p>
        </div>
        <Button size="sm" variant="outline">
          New goal
        </Button>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div>
              <h2 className="text-xs font-semibold text-foreground">
                Progress overview
              </h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Recharts analytics will render here.
              </p>
            </div>
          </CardHeader>
          <CardBody className="min-h-[220px] text-xs text-muted-foreground">
            Chart placeholder
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-xs font-semibold text-foreground">
              Streak summary
            </h2>
          </CardHeader>
          <CardBody className="space-y-2 text-xs text-muted-foreground">
            <p>Longest streak: —</p>
            <p>Current streak: —</p>
            <p>Points today: —</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};


