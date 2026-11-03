import { Router } from "express";
import { taskController } from "../controllers/taskController";
import { validate } from "../middlewares/validate";
import { createTaskSchema } from "../validators/taskSchema";

const router = Router();

router.get("/", taskController.list);
router.post("/", validate(createTaskSchema), taskController.create);

export default router;