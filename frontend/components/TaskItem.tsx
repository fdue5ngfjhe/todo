"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { deleteTask, toggleTaskStatus } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { formatDate, getStatusText } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onRefresh: () => void;
}

export default function TaskItem({ task, onEdit, onRefresh }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await toggleTaskStatus(task.id);
      showToast(
        task.status === "incomplete"
          ? "✓ وظیفه تکمیل شد"
          : "↺ وظیفه به حالت در انتظار برگشت",
        "success"
      );
      onRefresh();
    } catch (err: any) {
      showToast(err.message || "خطا در تغییر وضعیت", "error");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("آیا از حذف این وظیفه مطمئن هستید؟")) return;

    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      showToast("✓ وظیفه با موفقیت حذف شد", "success");
      onRefresh();
    } catch (err: any) {
      showToast(err.message || "خطا در حذف وظیفه", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const isCompleted = task.status === "completed";

  return (
    <li className={`task-item ${isCompleted ? "task-completed" : ""}`}>
      <div className="task-header">
        <h3 className={`task-title ${isCompleted ? "completed" : ""}`}>
          {task.title}
        </h3>
        <span className={`task-badge ${isCompleted ? "completed" : ""}`}>
          {getStatusText(task.status)}
        </span>
      </div>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-footer">
        <span className="task-id">#{task.id}</span>
        <span className="task-date">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {formatDate(task.created_at)}
        </span>
      </div>
      <div className="task-actions">
        <button
          className="btn-action btn-toggle"
          onClick={handleToggle}
          disabled={isToggling}
          title={isCompleted ? "بازگشت به حالت در انتظار" : "تکمیل وظیفه"}
        >
          {isCompleted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10"></path>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
          <span>{isCompleted ? "بازگشت" : "تکمیل"}</span>
        </button>
        <button
          className="btn-action btn-edit"
          onClick={() => onEdit(task)}
          title="ویرایش"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>ویرایش</span>
        </button>
        <button
          className="btn-action btn-delete"
          onClick={handleDelete}
          disabled={isDeleting}
          title="حذف"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
          </svg>
          <span>{isDeleting ? "در حال حذف..." : "حذف"}</span>
        </button>
      </div>
    </li>
  );
}