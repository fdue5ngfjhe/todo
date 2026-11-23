import { prisma } from "../db/prisma";
import { CreateTaskInput, UpdateTaskInput } from "../validators/taskSchema";
import { Task } from "@prisma/client";

// تبدیل خروجی Prisma به فرمت مورد انتظار فرانت
function formatTask(task: Task) {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.createdAt.toISOString(),
        // اگر updatedAt وجود داشت، تبدیل به رشته کن، وگرنه createdAt را بفرست
        updated_at: task.updatedAt ? task.updatedAt.toISOString() : task.createdAt.toISOString(),
    };
}

export const taskService = {
    async getAll() {
        const tasks = await prisma.task.findMany({
            orderBy: { createdAt: "desc" },
        });
        return tasks.map(formatTask);
    },

    async create(input: CreateTaskInput) {
        const task = await prisma.task.create({
            data: {
                title: input.title,
                description: input.description?.trim() || null,
            },
        });
        return formatTask(task);
    },

    async update(id: number, input: UpdateTaskInput) {
        const existingTask = await prisma.task.findUnique({ where: { id } });
        if (!existingTask) throw new Error("NOT_FOUND");

        const task = await prisma.task.update({
            where: { id },
            data: {
                ...(input.title !== undefined && { title: input.title }),
                ...(input.description !== undefined && { description: input.description?.trim() || null }),
                ...(input.status !== undefined && { status: input.status }),
            },
        });
        return formatTask(task);
    },

    async delete(id: number) {
        const existingTask = await prisma.task.findUnique({ where: { id } });
        if (!existingTask) throw new Error("NOT_FOUND");

        await prisma.task.delete({ where: { id } });
        return { success: true };
    },

    // تابع تغییر وضعیت (Toggle)
    async toggleStatus(id: number) {
        const existingTask = await prisma.task.findUnique({ where: { id } });
        if (!existingTask) throw new Error("NOT_FOUND");

        const newStatus = existingTask.status === "completed" ? "incomplete" : "completed";

        const task = await prisma.task.update({
            where: { id },
            data: { status: newStatus },
        });
        return formatTask(task);
    }
};