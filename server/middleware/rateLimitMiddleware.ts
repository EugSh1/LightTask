import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false
});

export default process.env.NODE_ENV === "test"
    ? (_req: Request, _res: Response, next: NextFunction) => next()
    : limiter;
