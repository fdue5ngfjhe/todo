import { z } from "zod";

export const createTaskSchema = z.object({
    title: z
        .string({ required_error: "عنوان الزامی است" })
        .trim()
        .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
        .max(100, "عنوان نباید بیشتر از ۱۰۰ کاراکتر باشد"),
    description: z
        .string()
        .trim()
        .max(500, "توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد")
        .optional()
        .or(z.literal("")),
});

// اسکیمای جدید برای ویرایش
export const updateTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
        .max(100, "عنوان نباید بیشتر از ۱۰۰ کاراکتر باشد")
        .optional(),
    description: z
        .string()
        .trim()
        .max(500, "توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد")
        .optional()
        .nullable(), // اجازه می‌دهیم توضیحات پاک شود (null)
    status: z
        .enum(["incomplete", "in_progress", "completed"])
        .optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;