import { Task, CreateTaskInput } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت وظایف");
  }

  return res.json();
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message =
      data?.title?.[0] || data?.message || "خطا در ثبت وظیفه";
    throw new Error(message);
  }

  return res.json();
}