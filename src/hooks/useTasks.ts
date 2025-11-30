import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/supabase/client";
import type { Task } from "@/types/habits";

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (payload: { goal_id: string; title: string; points: number }) => Promise<void>;
  updateTask: (id: string, payload: { title: string; points: number }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useTasks = (goalId: string | null): UseTasksResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!goalId) {
      setTasks([]);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("tasks")
      .select("*")
      .eq("goal_id", goalId)
      .order("created_at", { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setError(null);
      setTasks((data ?? []) as Task[]);
    }
    setLoading(false);
  }, [goalId]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (!goalId) return;

    const channel = supabase
      .channel(`public:tasks:goal:${goalId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `goal_id=eq.${goalId}` },
        () => {
          void fetchTasks();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [goalId, fetchTasks]);

  const createTask: UseTasksResult["createTask"] = async (payload) => {
    const { error: err } = await supabase.from("tasks").insert({
      goal_id: payload.goal_id,
      title: payload.title,
      points: payload.points
    });
    if (err) {
      setError(err.message);
    }
  };

  const deleteTask: UseTasksResult["deleteTask"] = async (id) => {
    const { error: err } = await supabase.from("tasks").delete().eq("id", id);
    if (err) {
      setError(err.message);
    }
  };

  const updateTask: UseTasksResult["updateTask"] = async (id, payload) => {
    const { error: err } = await supabase
      .from("tasks")
      .update({
        title: payload.title,
        points: payload.points
      })
      .eq("id", id);
    if (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};


