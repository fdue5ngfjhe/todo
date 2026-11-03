import { prisma } from "../db/prisma";
import { CreateTaskInput } from "../validators/taskSchema";
import { Task } from "@prisma/client";

// تبدیل خروجی Prisma به فرمت مورد انتظار فرانت (created_at با underscore)
function formatTask(task: Task) {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.createdAt.toISOString(),
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
};