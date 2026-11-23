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

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: "شناسه نامعتبر است" });

            const task = await taskService.update(id, req.body);
            res.json(task);
        } catch (err: any) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({ message: "وظیفه مورد نظر یافت نشد" });
            }
            console.error("Error in update:", err);
            res.status(500).json({ message: "خطای سرور در ویرایش وظیفه" });
        }
    },

    async remove(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: "شناسه نامعتبر است" });

            await taskService.delete(id);
            res.status(204).send();
        } catch (err: any) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({ message: "وظیفه مورد نظر یافت نشد" });
            }
            console.error("Error in delete:", err);
            res.status(500).json({ message: "خطای سرور در حذف وظیفه" });
        }
    },

    // کنترلر جدید برای تغییر وضعیت
    async toggle(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: "شناسه نامعتبر است" });

            const task = await taskService.toggleStatus(id);
            res.json(task);
        } catch (err: any) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({ message: "وظیفه مورد نظر یافت نشد" });
            }
            console.error("Error in toggle:", err);
            res.status(500).json({ message: "خطای سرور در تغییر وضعیت وظیفه" });
        }
    },
};