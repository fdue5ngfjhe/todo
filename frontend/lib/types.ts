export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "incomplete" | "completed";
  created_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  title: string;
  description?: string;
}