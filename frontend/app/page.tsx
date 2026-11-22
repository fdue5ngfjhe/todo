"use client";

import { useEffect } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Home() {
  // ۱. مقداردهی اولیه تم هنگام لود صفحه (برای جلوگیری از پرش تم)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // ۲. تابع تغییر تم
  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <div className="app-container">
      {/* هدر */}
      <header className="app-header">
        <div className="logo">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
          </svg>
          <h1>TaskFlow</h1>
        </div>
        
        {/* دکمه تغییر تم */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="تغییر تم"
        >
          <svg
            className="sun-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg
            className="moon-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
          </svg>
        </button>
      </header>

      {/* کارت اصلی */}
      <main className="main-card">
        {/* ۳. بخش آمار (اضافه شدن آیتم "تکمیل شده" برای اسپرینت ۲) */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number" id="total-tasks">0</span>
            <span className="stat-label">کل وظایف</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" id="pending-tasks">0</span>
            <span className="stat-label">در انتظار</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" id="completed-tasks">0</span>
            <span className="stat-label">تکمیل شده</span>
          </div>
        </div>

        <TaskForm />
        <TaskList />
      </main>

      {/* فوتر */}
      <footer className="app-footer">
        <p>پروژه درس مهندسی نرم‌افزار</p>
      </footer>
    </div>
  );
}