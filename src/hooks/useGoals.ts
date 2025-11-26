import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Goal } from "@/types/habits";

interface UseGoalsResult {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  createGoal: (payload: {
    title: string;
    description?: string;
    duration_days: number;
    start_date: string;
  }) => Promise<void>;
  updateGoal: (id: string, patch: Partial<Pick<Goal, "title" | "description">>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useGoals = (): UseGoalsResult => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setError(null);
      setGoals((data ?? []) as Goal[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void fetchGoals();
  }, [fetchGoals]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("public:goals")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "goals", filter: `user_id=eq.${user.id}` },
        () => {
          void fetchGoals();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user, fetchGoals]);

  const createGoal: UseGoalsResult["createGoal"] = async (payload) => {
    if (!user) return;
    const { error: err } = await supabase.from("goals").insert({
      user_id: user.id,
      title: payload.title,
      description: payload.description ?? null,
      duration_days: payload.duration_days,
      start_date: payload.start_date
    });
    if (err) {
      setError(err.message);
    }
  };

  const updateGoal: UseGoalsResult["updateGoal"] = async (id, patch) => {
    const { error: err } = await supabase
      .from("goals")
      .update({
        title: patch.title,
        description: patch.description
      })
      .eq("id", id);
    if (err) {
      setError(err.message);
    }
  };

  const deleteGoal: UseGoalsResult["deleteGoal"] = async (id) => {
    const { error: err } = await supabase.from("goals").delete().eq("id", id);
    if (err) {
      setError(err.message);
    }
  };

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
};


