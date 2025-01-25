import { Router } from "express";
import CategoryController from "./category.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
const router = Router();

router.get("/", authMiddleware, CategoryController.getCategories);
router.get("/:name", authMiddleware, CategoryController.getCategory);
router.post("/", authMiddleware, CategoryController.createCategory);
router.put("/", authMiddleware, CategoryController.updateCategory);
router.delete("/:id", authMiddleware, CategoryController.deleteCategory);

const categoryRouter = router;
export default categoryRouter;
