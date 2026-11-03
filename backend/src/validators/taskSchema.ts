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

export type CreateTaskInput = z.infer<typeof createTaskSchema>;