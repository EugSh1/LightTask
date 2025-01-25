import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function clearDatabase() {
    await prisma.task.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
}
