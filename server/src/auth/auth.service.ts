import { PrismaClient } from "@prisma/client";
import HTTPError from "../httpError.js";
import { handleServiceError } from "../utils/errorUtils.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export default class AuthService {
    public static async createUser(name: string, password: string): Promise<void> {
        try {
            if (await this.checkIfNameTaken(name)) {
                throw new HTTPError("A user with this name already exists", 400);
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.create({
                data: {
                    name,
                    password: hashedPassword
                }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error creating new user");
        }
    }

    public static async logIn(name: string, password: string): Promise<string> {
        try {
            const user = await prisma.user.findUnique({
                where: { name }
            });

            if (!user) {
                throw new HTTPError("User not found", 404);
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new HTTPError("Invalid credentials", 401);
            }

            return jwt.sign({ id: user.id }, JWT_SECRET, {
                expiresIn: "7d"
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error logging in");
        }
    }

    public static async deleteUser(id: string): Promise<void> {
        try {
            await prisma.user.delete({
                where: { id }
            });
        } catch (error: unknown) {
            handleServiceError(error, "Error deleting user");
        }
    }

    public static async checkIfNameTaken(name: string) {
        const user = await prisma.user.findFirst({
            where: { name }
        });

        return !!user;
    }
}
