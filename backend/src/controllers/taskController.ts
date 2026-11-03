import { Request, Response } from "express";
import { taskService } from "../services/taskService";

export const taskController = {
    async list(_req: Request, res: Response) {
        try {
            const tasks = await taskService.getAll();
            res.json(tasks);
        } catch (err) {
            console.error("Error in list:", err);
            res.status(500).json({ message: "خطای سرور در دریافت وظایف" });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const task = await taskService.create(req.body);
            res.status(201).json(task);
        } catch (err) {
            console.error("Error in create:", err);
            res.status(500).json({ message: "خطای سرور در ثبت وظیفه" });
        }
    },
};