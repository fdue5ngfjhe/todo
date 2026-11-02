"use client";

import { useState, FormEvent } from "react";
import { createTask } from "@/lib/api";
import { taskSchema } from "@/lib/validation";
import { showToast } from "@/lib/toast";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // اعتبارسنجی با Zod
    const parseResult = taskSchema.safeParse({ title, description });
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message;
      showToast(firstError || "ورودی نامعتبر است", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask({
        title: parseResult.data.title,
        description: parseResult.data.description,
      });
      showToast("✓ وظیفه با موفقیت اضافه شد!", "success");
      setTitle("");
      setDescription("");
      // تریگر رفرش لیست
      window.dispatchEvent(new CustomEvent("tasks:refresh"));
    } catch (err: any) {
      showToast(err?.message || "خطا در ثبت وظیفه", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* آمار */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number" id="total-tasks">
            0
          </span>
          <span className="stat-label">کل وظایف</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" id="pending-tasks">
            0
          </span>
          <span className="stat-label">در انتظار</span>
        </div>
      </div>

      {/* فرم */}
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-header">
          <h2>وظیفه جدید</h2>
          <p>وظیفه‌ای که می‌خواهید انجام دهید را اضافه کنید</p>
        </div>

        <div className="input-group">
          <label htmlFor="title">
            عنوان وظیفه <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً: مطالعه فصل اول کتاب..."
            maxLength={100}
            required
          />
          <span className="char-counter">
            <span>{title.length}</span>/100
          </span>
        </div>

        <div className="input-group">
          <label htmlFor="description">
            توضیحات <span className="optional">(اختیاری)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="جزئیات بیشتری درباره وظیفه بنویسید..."
            rows={3}
            maxLength={500}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>{isSubmitting ? "در حال ثبت..." : "افزودن وظیفه"}</span>
        </button>
      </form>
    </>
  );
}