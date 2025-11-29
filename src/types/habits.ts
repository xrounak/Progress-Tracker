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

export interface UserProfile {
  id: string;
  name: string | null;
  bio: string | null;
  aim: string | null;
  avatar_url: string | null;
  mood_sticker: string;
  location: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}
