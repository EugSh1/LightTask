import { Router } from "express";
import AuthController from "./auth.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import rateLimitMiddleware from "../../middleware/rateLimitMiddleware.js";
const router = Router();

router.post("/", rateLimitMiddleware, AuthController.createUser);
router.post("/login", rateLimitMiddleware, AuthController.logIn);
router.post("/logout", authMiddleware, AuthController.logOut);
router.delete("/", authMiddleware, AuthController.deleteUser);
router.get("/check", authMiddleware, AuthController.checkAuth);

const authRouter = router;
export default authRouter;
