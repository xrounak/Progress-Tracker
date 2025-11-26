import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import type { TaskLog } from "@/types/habits";

interface UseTaskLogsResult {
  logs: TaskLog[];
  loading: boolean;
  error: string | null;
  upsertLog: (params: {
    task_id: string;
    log_date: string;
    status: boolean;
    points_earned: number;
  }) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useTaskLogs = (taskIds: string[] | null): UseTaskLogsResult => {
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!taskIds || taskIds.length === 0) {
      setLogs([]);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("task_logs")
      .select("*")
      .in("task_id", taskIds)
      .order("log_date", { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setError(null);
      setLogs((data ?? []) as TaskLog[]);
    }
    setLoading(false);
  }, [taskIds]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!taskIds || taskIds.length === 0) return;

    const channel = supabase
      .channel("public:task_logs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "task_logs" },
        () => {
          void fetchLogs();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [taskIds, fetchLogs]);

  const upsertLog: UseTaskLogsResult["upsertLog"] = async ({
    task_id,
    log_date,
    status,
    points_earned
  }) => {
    const { error: err } = await supabase.from("task_logs").upsert(
      {
        task_id,
        log_date,
        status,
        points_earned
      },
      {
        onConflict: "task_id,log_date"
      }
    );
    if (err) {
      setError(err.message);
    }
  };

  return {
    logs,
    loading,
    error,
    upsertLog,
    refetch: fetchLogs
  };
};


