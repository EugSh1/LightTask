import { Response } from "express";
import HTTPError from "../httpError.js";
import { ZodError } from "zod";

export async function catchErrors(res: Response, fn: () => Promise<void>): Promise<void> {
    try {
        await fn();
    } catch (error: unknown) {
        if (error instanceof HTTPError) {
            res.status(error.statusCode).json({ error: error.message });
        } else if (error instanceof ZodError) {
            const errorsArray = error.issues.map((issue) => issue.message);
            res.status(400).json({ error: errorsArray.join(", ") });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export function handleServiceError(error: unknown, defaultMessage: string): never {
    if (error instanceof HTTPError) {
        throw error;
    }
    throw new HTTPError(defaultMessage, 500);
}
