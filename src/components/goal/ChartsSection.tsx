import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import type { Task, TaskLog } from "@/types/habits";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

interface ChartsSectionProps {
  tasks: Task[];
  logs: TaskLog[];
  dates: string[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  tasks,
  logs,
  dates
}) => {
  const dailyData = useMemo(
    () =>
      dates.map((date) => {
        const totalPoints = logs
          .filter((l) => l.log_date === date && l.status)
          .reduce((sum, l) => sum + l.points_earned, 0);
        return { date, totalPoints };
      }),
    [dates, logs]
  );

  const taskBarData = useMemo(
    () =>
      tasks.map((task) => {
        const completedCount = logs.filter(
          (l) => l.task_id === task.id && l.status
        ).length;
        return {
          taskTitle: task.title,
          completedCount
        };
      }),
    [tasks, logs]
  );

  const streakInfo = useMemo(() => {
    let currentStreak = 0;
    let longestStreak = 0;

    dates.forEach((date) => {
      const dayPoints = logs
        .filter((l) => l.log_date === date && l.status)
        .reduce((sum, l) => sum + l.points_earned, 0);
      if (dayPoints > 0) {
        currentStreak += 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return { currentStreak, longestStreak };
  }, [dates, logs]);

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-xs font-semibold text-foreground">
              Daily points trend
            </h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Total points earned per day across all tasks.
            </p>
          </div>
        </CardHeader>
        <CardBody className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickFormatter={(value: string) =>
                  new Date(value).getDate().toString()
                }
              />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderRadius: 8,
                  border: "1px solid #1f2937",
                  fontSize: 11
                }}
                labelFormatter={(value: string) =>
                  new Date(value).toLocaleDateString()
                }
              />
              <Line
                type="monotone"
                dataKey="totalPoints"
                stroke="#34d399"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <h2 className="text-xs font-semibold text-foreground">
              Completions per task
            </h2>
          </CardHeader>
          <CardBody className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskBarData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#1f2933"
                />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="taskTitle"
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderRadius: 8,
                    border: "1px solid #1f2937",
                    fontSize: 11
                  }}
                />
                <Bar
                  dataKey="completedCount"
                  fill="#38bdf8"
                  radius={[4, 4, 4, 4]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xs font-semibold text-foreground">
              Streaks
            </h2>
          </CardHeader>
          <CardBody className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              <p className="text-[11px]">Current streak</p>
              <p className="mt-1 text-lg font-semibold text-emerald-400">
                {streakInfo.currentStreak}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  days
                </span>
              </p>
            </div>
            <div>
              <p className="text-[11px]">Longest streak</p>
              <p className="mt-1 text-lg font-semibold text-emerald-400">
                {streakInfo.longestStreak}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  days
                </span>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};


