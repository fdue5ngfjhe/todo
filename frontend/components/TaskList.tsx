"use client";

import { useEffect, useState } from "react";
import { getTasks } from "@/lib/api";
import { Task } from "@/lib/types";
import { formatDate, getStatusText } from "@/lib/utils";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);

      // بروزرسانی آمار
      const totalEl = document.getElementById("total-tasks");
      const pendingEl = document.getElementById("pending-tasks");
      if (totalEl) totalEl.textContent = String(data.length);
      if (pendingEl)
        pendingEl.textContent = String(
          data.filter((t) => t.status === "incomplete").length
        );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();

    // گوش دادن به ایونت رفرش
    const handler = () => loadTasks();
    window.addEventListener("tasks:refresh", handler);
    return () => window.removeEventListener("tasks:refresh", handler);
  }, []);

  return (
    <section className="tasks-section">
      <div className="section-header">
        <h2>وظایف من</h2>
        <button
          className="btn-refresh"
          onClick={loadTasks}
          aria-label="بروزرسانی"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"></path>
          </svg>
        </button>
      </div>

      {/* لودینگ */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>در حال بارگذاری وظایف...</p>
        </div>
      )}

      {/* حالت خالی */}
      {!loading && tasks.length === 0 && (
        <div className="empty-state">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <h3>هنوز وظیفه‌ای ثبت نشده!</h3>
          <p>اولین وظیفه خود را از فرم بالا اضافه کنید</p>
        </div>
      )}

      {/* لیست */}
      {!loading && tasks.length > 0 && (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <span className="task-badge">{getStatusText(task.status)}</span>
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
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}