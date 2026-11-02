export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "incomplete" | "in_progress" | "completed";
  created_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}