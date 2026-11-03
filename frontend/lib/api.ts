import { Task, CreateTaskInput } from "./types";

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