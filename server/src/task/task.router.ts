import { Router } from "express";
import TaskController from "./task.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
const router = Router();

router.get("/", authMiddleware, TaskController.getTasks);
router.post("/", authMiddleware, TaskController.createTask);
router.put("/status", authMiddleware, TaskController.toggleTaskStatus);
router.delete("/:id", authMiddleware, TaskController.deleteTask);
router.put("/assign", authMiddleware, TaskController.assignTaskToCategory);
router.put("/unassign", authMiddleware, TaskController.unassignTaskFromCategory);

const taskRouter = router;
export default taskRouter;
