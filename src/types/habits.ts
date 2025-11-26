export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  duration_days: number;
  start_date: string; // ISO date
  created_at: string;
}

export interface Task {
  id: string;
  goal_id: string;
  title: string;
  points: number;
  created_at: string;
}

export interface TaskLog {
  id: string;
  task_id: string;
  log_date: string; // ISO date (yyyy-mm-dd)
  status: boolean;
  points_earned: number;
  created_at: string;
}


