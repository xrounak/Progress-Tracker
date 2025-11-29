import React, { useEffect, useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabase/client";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface DayData {
  date: string;
  points: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [pointsByDate, setPointsByDate] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLogs = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("task_logs")
        .select("log_date, points_earned");

      if (data) {
        const aggregated = data.reduce((acc, log) => {
          acc[log.log_date] = (acc[log.log_date] || 0) + log.points_earned;
          return acc;
        }, {} as Record<string, number>);
        setPointsByDate(aggregated);
      }
      setLoading(false);
    };

    void fetchLogs();
  }, [user]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek === -1) firstDayOfWeek = 6;

    const days: DayData[] = [];
    const today = new Date().toISOString().slice(0, 10);

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const dateStr = date.toISOString().slice(0, 10);
      days.push({
        date: dateStr,
        points: pointsByDate[dateStr] || 0,
        isCurrentMonth: false,
        isToday: dateStr === today
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().slice(0, 10);
      days.push({
        date: dateStr,
        points: pointsByDate[dateStr] || 0,
        isCurrentMonth: true,
        isToday: dateStr === today
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateStr = date.toISOString().slice(0, 10);
      days.push({
        date: dateStr,
        points: pointsByDate[dateStr] || 0,
        isCurrentMonth: false,
        isToday: dateStr === today
      });
    }

    return days;
  }, [currentDate, pointsByDate]);

  const maxPoints = useMemo(() => {
    return Math.max(...Object.values(pointsByDate), 1);
  }, [pointsByDate]);

  const getIntensityClass = (points: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return "bg-muted/20";
    if (points === 0) return "bg-muted/40";

    const intensity = points / maxPoints;
    if (intensity < 0.25) return "bg-emerald-500/20";
    if (intensity < 0.5) return "bg-emerald-500/40";
    if (intensity < 0.75) return "bg-emerald-500/60";
    return "bg-emerald-500/80 shadow-emerald-500/50";
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthYear = currentDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Activity Calendar
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your daily progress and build streaks
          </p>
        </div>
        <Button onClick={goToToday} variant="outline" size="sm">
          Today
        </Button>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <h2 className="text-lg font-semibold">{monthYear}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                  const dayNum = new Date(day.date).getDate();

                  return (
                    <div key={idx} className="group relative">
                      <div
                        className={`
                          aspect-square rounded-md transition-all duration-200
                          flex items-center justify-center text-xs font-medium
                          ${getIntensityClass(day.points, day.isCurrentMonth)}
                          ${day.isCurrentMonth ? "text-foreground" : "text-muted-foreground/40"}
                          ${day.isToday ? "ring-2 ring-emerald-500 ring-offset-1 ring-offset-background" : ""}
                          hover:ring-2 hover:ring-emerald-400/50 cursor-pointer
                        `}
                      >
                        <span>{dayNum}</span>
                      </div>

                      {day.points > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 animate-in fade-in duration-150">
                          <div className="rounded-md bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg border border-border whitespace-nowrap">
                            <div className="font-medium">{new Date(day.date).toLocaleDateString()}</div>
                            <div className="text-emerald-500 font-semibold">{day.points} points</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium">Less</span>
                <div className="flex gap-1.5">
                  <div className="h-4 w-4 rounded-sm bg-muted/40" />
                  <div className="h-4 w-4 rounded-sm bg-emerald-500/20" />
                  <div className="h-4 w-4 rounded-sm bg-emerald-500/40" />
                  <div className="h-4 w-4 rounded-sm bg-emerald-500/60" />
                  <div className="h-4 w-4 rounded-sm bg-emerald-500/80" />
                </div>
                <span className="font-medium">More</span>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
