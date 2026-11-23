import { Router } from "express";
import { taskController } from "../controllers/taskController";
import { validate } from "../middlewares/validate";
import { createTaskSchema, updateTaskSchema } from "../validators/taskSchema";

const router = Router();

router.get("/", taskController.list);
router.post("/", validate(createTaskSchema), taskController.create);

// هماهنگ با فرانت‌اند: استفاده از PUT برای ویرایش
router.put("/:id", validate(updateTaskSchema), taskController.update);

// هماهنگ با فرانت‌اند: مسیر اختصاصی برای Toggle
router.patch("/:id/toggle", taskController.toggle);

router.delete("/:id", taskController.remove);

export default router;