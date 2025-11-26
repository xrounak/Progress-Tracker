import React from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

const days = ["M", "T", "W", "T", "F", "S", "S"];

export const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <section className="space-y-1">
        <h1 className="text-lg font-semibold text-foreground sm:text-xl">
          Calendar
        </h1>
        <p className="text-xs text-muted-foreground">
          Visualize your completion history as a grid.
        </p>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Heatmap</span>
            <span>Month: Placeholder</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
            {days.map((d, index) => (
              <div key={`${d}-${index}`}>{d}</div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-[4px] bg-muted/60"
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};


