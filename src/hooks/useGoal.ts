import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import type { Goal } from "@/types/habits";

interface UseGoalResult {
  goal: Goal | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGoal = (goalId: string | null): UseGoalResult => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoal = useCallback(async () => {
    if (!goalId) {
      setGoal(null);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("goals")
      .select("*")
      .eq("id", goalId)
      .single();

    if (err) {
      setError(err.message);
      setGoal(null);
    } else {
      setError(null);
      setGoal(data as Goal);
    }
    setLoading(false);
  }, [goalId]);

  useEffect(() => {
    void fetchGoal();
  }, [fetchGoal]);

  useEffect(() => {
    if (!goalId) return;

    const channel = supabase
      .channel(`public:goals:${goalId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "goals", filter: `id=eq.${goalId}` },
        () => {
          void fetchGoal();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [goalId, fetchGoal]);

  return {
    goal,
    loading,
    error,
    refetch: fetchGoal
  };
};


