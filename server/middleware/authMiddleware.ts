import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

declare module "express-serve-static-core" {
    interface Request {
        userId?: string;
    }
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ error: "Token is missing" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        req.userId = decoded.id;
        return next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
        return;
    }
}
