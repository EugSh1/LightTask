import request from "supertest";
import app from "../src/main.js";
import { describe, it, expect, afterAll, beforeAll } from "vitest";
import clearDatabase from "./utils/clearDatabase.js";
import createTestUser from "./utils/createTestUser.js";
import { Server } from "http";

let server: Server;
let baseURL: string;
let tokenCookie: string;

describe("Test operations with categories", () => {
    beforeAll(async () => {
        server = app.listen(0);
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        baseURL = `http://localhost:${port}`;
        await clearDatabase();
        ({ tokenCookie } = await createTestUser());
    });

    it("Should add a user properly", async () => {
        const now = Date.now();
        const name = `Test User ${now}`;
        const password = `Test User's ${now} password`;

        await request(baseURL).post("/user").send({ name, password }).expect(200);
    });

    it("Should respond with an error if you send an invalid data when adding user", async () => {
        await request(baseURL).post("/user").set("Cookie", tokenCookie).expect(400);
        await request(baseURL)
            .post("/user")
            .send({ name: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user")
            .send({ name: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user")
            .send({ name: "test", password: "1".repeat(5) })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user")
            .send({ name: "test", password: "1".repeat(65) })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user")
            .send({ name: "test", password: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user")
            .send({ name: "", password: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user")
            .send({ password: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user")
            .send({ password: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
    });

    it("Should log in properly", async () => {
        const now = Date.now();
        const name = `Test User ${now}`;
        const password = `Test User's ${now} password`;

        await request(baseURL).post("/user").send({ name, password });
        const response = await request(baseURL)
            .post("/user/login")
            .send({ name, password })
            .expect(200);

        const tokenCookie = response.headers["set-cookie"];
        expect(tokenCookie).not.toBeUndefined();
    });

    it("Should respond with an error if you send an invalid data when logging in", async () => {
        await request(baseURL).post("/user/login").set("Cookie", tokenCookie).expect(400);
        await request(baseURL)
            .post("/user/login")
            .send({ name: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user/login")
            .send({ name: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user/login")
            .send({ name: "test", password: "1".repeat(5) })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user/login")
            .send({ name: "test", password: "1".repeat(65) })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user/login")
            .send({ name: "test", password: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user/login")
            .send({ name: "", password: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user/login")
            .send({ password: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/user/login")
            .send({ password: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
    });

    it("Should return a 401 code if the user attempts to send a request to a secure path without the token cookie", async () => {
        await request(baseURL).get("/category").expect(401);
        await request(baseURL).post("/user/logout").expect(401);
        await request(baseURL).delete("/user").expect(401);
    });

    it("Should log out properly", async () => {
        const response = await request(baseURL)
            .post("/user/logout")
            .set("Cookie", tokenCookie)
            .expect(200);
        expect(response.body.message).toBe("Successfully logged out");
    });

    it("Should delete user properly", async () => {
        await request(baseURL).delete("/user").set("Cookie", tokenCookie).expect(200);
    });

    it("Should check if user is authenticated properly", async () => {
        await request(baseURL).get("/user/check").set("Cookie", tokenCookie).expect(200);
        await request(baseURL).get("/user/check").expect(401);
    });

    afterAll(async () => {
        await clearDatabase();
    });
});
