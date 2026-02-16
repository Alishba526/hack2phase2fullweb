export interface Todo {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  user_id: string;
}