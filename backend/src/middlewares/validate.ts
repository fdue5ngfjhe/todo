import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                // فرانت انتظار { title: ["پیام"] } یا { message: "..." } را دارد
                const fieldErrors = result.error.flatten().fieldErrors;

                // اگر خطا مربوط به title بود، فرمت { title: [...] } بده
                if (fieldErrors.title && fieldErrors.title.length > 0) {
                    return res.status(400).json({ title: fieldErrors.title });
                }

                // سایر خطاها
                return res.status(400).json({
                    message: result.error.errors[0]?.message || "ورودی نامعتبر است",
                    errors: fieldErrors,
                });
            }

            req.body = result.data;
            next();
        };