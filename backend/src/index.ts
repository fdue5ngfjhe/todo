import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// میدلورها
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
});

// روت‌ها
app.use("/api/tasks", tasksRouter);

// 404
app.use((_req, res) => {
    res.status(404).json({ message: "مسیر پیدا نشد" });
});

// شروع سرور
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://127.0.0.1:${PORT}`);
});