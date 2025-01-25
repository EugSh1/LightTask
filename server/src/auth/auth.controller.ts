import { Request, Response } from "express";
import AuthService from "./auth.service.js";
import { catchErrors } from "../utils/errorUtils.js";
import { userSchema } from "./auth.schema.js";

export default class AuthController {
    public static async createUser(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const parsedBody = userSchema.parse(req.body);
            const { name, password } = parsedBody;

            await AuthService.createUser(name.trim(), password.trim());
            res.sendStatus(200);
        });
    }

    public static async logIn(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const parsedBody = userSchema.parse(req.body);
            const { name, password } = parsedBody;

            const token = await AuthService.logIn(name.trim(), password.trim());
            res.cookie("token", token, {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({ message: "Login successful" });
        });
    }

    public static async logOut(_req: Request, res: Response): Promise<void> {
        res.clearCookie("token");
        res.status(200).json({ message: "Successfully logged out" });
    }

    public static async deleteUser(req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            const userId = req?.userId as string;

            await AuthService.deleteUser(userId);
            res.status(200).json({ message: "User deleted successfully" });
        });
    }

    public static async checkAuth(_req: Request, res: Response): Promise<void> {
        catchErrors(res, async () => {
            res.sendStatus(200);
        });
    }
}
