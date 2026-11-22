"use client";

import { useState, useEffect } from "react";
import { Task } from "@/lib/types";
import { updateTask } from "@/lib/api";
import { taskSchema } from "@/lib/validation";
import { showToast } from "@/lib/toast";

interface EditModalProps {
  task: Task | null;
  onClose: () => void;
  onRefresh: () => void;
}

export default function EditModal({ task, onClose, onRefresh }: EditModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parseResult = taskSchema.safeParse({ title, description });
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message;
      showToast(firstError || "ورودی نامعتبر است", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateTask(task.id, {
        title: parseResult.data.title,
        description: parseResult.data.description,
      });
      showToast("✓ وظیفه با موفقیت ویرایش شد", "success");
      onRefresh();
      onClose();
    } catch (err: any) {
      showToast(err.message || "خطا در ویرایش وظیفه", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>ویرایش وظیفه</h2>
          <button className="btn-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label htmlFor="edit-title">
              عنوان وظیفه <span className="required">*</span>
            </label>
            <input
              type="text"
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان وظیفه"
              maxLength={100}
              required
            />
            <span className="char-counter">
              <span>{title.length}</span>/100
            </span>
          </div>
          <div className="input-group">
            <label htmlFor="edit-description">
              توضیحات <span className="optional">(اختیاری)</span>
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات"
              rows={3}
              maxLength={500}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              انصراف
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}