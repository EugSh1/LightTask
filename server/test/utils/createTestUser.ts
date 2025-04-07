import request from "supertest";
import app from "../../src/main.js";

export default async function createTestUser() {
    const now = Date.now();
    const name = `Test User ${now}`;
    const password = `Test User's ${now} password`;

    await request(app).post("/user").send({ name, password });
    const response1 = await request(app).post("/user/login").send({ name, password });

    const tokenCookie = response1.headers["set-cookie"];

    if (!tokenCookie) {
        throw new Error("Token cookie not found");
    }

    return {
        name,
        password,
        tokenCookie: tokenCookie[0]
    };
}
