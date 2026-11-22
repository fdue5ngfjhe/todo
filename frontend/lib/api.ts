import { Task, CreateTaskInput, UpdateTaskInput } from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

// لاگ دیباگ فقط در حالت توسعه
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line no-console
  console.log("[api] API_URL =", API_URL);
}

/**
 * استخراج پیام خطا از پاسخ سرور.
 * فرمت‌های ممکن:
 *   { title: ["..."] }   → خطای اعتبارسنجی Zod
 *   { message: "..." }   → خطای عمومی سرور
 *   { errors: {...} }    → خطاهای چندگانه
 */
function extractErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;

  const obj = data as Record<string, unknown>;

  // ۱. خطای Zod برای title
  if (Array.isArray(obj.title) && obj.title.length > 0) {
    return String(obj.title[0]);
  }

  // ۲. پیام عمومی
  if (typeof obj.message === "string" && obj.message.trim()) {
    return obj.message;
  }

  // ۳. سایر فیلدهای خطا (description و ...)
  for (const value of Object.values(obj)) {
    if (Array.isArray(value) && value.length > 0) {
      return String(value[0]);
    }
  }

  return fallback;
}

/**
 * خواندن امن JSON از پاسخ.
 * اگر پاسخ JSON نبود، null برمی‌گرداند.
 */
async function safeJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * دریافت لیست وظایف.
 * GET /api/tasks
 */
export async function getTasks(): Promise<Task[]> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}/api/tasks`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    // خطای شبکه (سرور خاموش، DNS، ...)
    throw new Error(
      "اتصال به سرور برقرار نشد. لطفاً از روشن بودن بک‌اند مطمئن شوید."
    );
  }

  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(
      extractErrorMessage(data, "خطا در دریافت وظایف از سرور")
    );
  }

  const data = await safeJson(res);
  if (!Array.isArray(data)) {
    throw new Error("پاسخ سرور در فرمت صحیح نیست");
  }

  return data as Task[];
}

/**
 * ایجاد وظیفه جدید.
 * POST /api/tasks
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch (err) {
    throw new Error(
      "اتصال به سرور برقرار نشد. لطفاً از روشن بودن بک‌اند مطمئن شوید."
    );
  }

  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(
      extractErrorMessage(data, "خطا در ثبت وظیفه در سرور")
    );
  }

  const data = await safeJson(res);
  if (!data || typeof data !== "object") {
    throw new Error("پاسخ سرور در فرمت صحیح نیست");
  }

  return data as Task;
}

export async function updateTask(
  id: number,
  input: UpdateTaskInput
): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("وظیفه مورد نظر یافت نشد");
    }
    const data = await res.json().catch(() => ({}));
    const message = data?.title?.[0] || data?.message || "خطا در ویرایش وظیفه";
    throw new Error(message);
  }

  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("وظیفه مورد نظر یافت نشد");
    }
    throw new Error("خطا در حذف وظیفه");
  }
}

export async function toggleTaskStatus(id: number): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks/${id}/toggle`, {
    method: "PATCH",
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("وظیفه مورد نظر یافت نشد");
    }
    throw new Error("خطا در تغییر وضعیت");
  }

  return res.json();
}