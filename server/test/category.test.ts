import request from "supertest";
import app from "../src/main.js";
import { describe, it, expect, expectTypeOf, afterAll, beforeAll } from "vitest";
import { Category } from "@prisma/client";
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

    it("Should return a list of categories", async () => {
        const response = await request(baseURL)
            .get("/category")
            .set("Cookie", tokenCookie)
            .expect(200);
        expectTypeOf(response.body).toMatchTypeOf<Category[]>();
    });

    it("Should get a category by name properly", async () => {
        const uniqueName = Date.now().toString();

        await request(baseURL)
            .post("/category")
            .send({ name: uniqueName })
            .set("Cookie", tokenCookie);

        const response = await request(baseURL)
            .get(`/category/${uniqueName}`)
            .set("Cookie", tokenCookie)
            .expect(200);
        expectTypeOf(response.body).toMatchTypeOf<Category>();
    });

    it("Should add a category properly", async () => {
        const prevResponse = await request(baseURL).get("/category").set("Cookie", tokenCookie);
        const prevLength = prevResponse.body.length;

        const uniqueName = Date.now().toString();

        const newCategoryResponse = await request(baseURL)
            .post("/category")
            .send({ name: uniqueName })
            .set("Cookie", tokenCookie)
            .expect(201);
        const newCategory = newCategoryResponse.body;
        expect(typeof newCategory.id).toBe("string");
        expect(newCategory.name).toBe(uniqueName);

        const response = await request(baseURL).get("/category").set("Cookie", tokenCookie);
        const length = response.body.length;
        expect(prevLength + 1).toBe(length);

        const addedCategory = response.body.find(
            (category: Category) => category.name === uniqueName
        );
        expect(addedCategory).not.toBeUndefined();
    });

    it("Should respond with an error if you try to create a category with a name already taken", async () => {
        const uniqueName = Date.now().toString();
        await request(baseURL)
            .post("/category")
            .send({ name: uniqueName })
            .set("Cookie", tokenCookie)
            .expect(201);
        await request(baseURL)
            .post("/category")
            .send({ name: uniqueName })
            .set("Cookie", tokenCookie)
            .expect(400);
    });

    it("Should respond with an error if you send an invalid data when adding a new category", async () => {
        await request(baseURL).post("/category").set("Cookie", tokenCookie).expect(400);
        await request(baseURL)
            .post("/category")
            .send({ name: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/category")
            .send({ name: "t".repeat(25) })
            .set("Cookie", tokenCookie)
            .expect(400);
    });

    it("Should update a category properly", async () => {
        const uniqueName = Date.now().toString();

        const newCategoryResponse = await request(baseURL)
            .post("/category")
            .send({ name: uniqueName })
            .set("Cookie", tokenCookie);
        const newCategoryId = newCategoryResponse.body.id;

        const newUniqueName = Date.now().toString();
        const updateCategoryResponse = await request(baseURL)
            .put("/category")
            .send({ id: newCategoryId, name: newUniqueName })
            .set("Cookie", tokenCookie);
        expect(updateCategoryResponse.status).toBe(200);
        expect(updateCategoryResponse.body.name).toBe(newUniqueName);

        const allCategoriesResponse = await request(baseURL)
            .get("/category")
            .set("Cookie", tokenCookie);

        const updatedCategory = allCategoriesResponse.body.find(
            (category: Category) => category.name === newUniqueName
        );
        expect(updatedCategory).not.toBeUndefined();
    });

    it("Should respond with an error if you send an invalid data when updating a category", async () => {
        await request(baseURL).put("/category").set("Cookie", tokenCookie).expect(400);
        await request(baseURL)
            .put("/category")
            .send({ name: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/category")
            .send({ name: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/category")
            .send({ name: "t".repeat(25) })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/category")
            .send({ name: "test", id: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/category")
            .send({ name: "", id: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/category")
            .send({ id: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/category")
            .send({ id: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
    });

    it("Should delete a category properly", async () => {
        const uniqueName = Date.now().toString();

        const newCategoryResponse = await request(baseURL)
            .post("/category")
            .send({ name: uniqueName })
            .set("Cookie", tokenCookie);
        const newCategoryId = newCategoryResponse.body.id;

        await request(baseURL)
            .delete(`/category/${newCategoryId}`)
            .set("Cookie", tokenCookie)
            .expect(200);

        const getCategoriesResponse = await request(baseURL)
            .get("/category")
            .set("Cookie", tokenCookie);

        const deletedCategory = getCategoriesResponse.body.find(
            (category: Category) => category.id === newCategoryId
        );
        expect(deletedCategory).toBeUndefined();
    });

    it("Should respond with an error if you submit a non-existent task id when deleting a category", async () => {
        await request(baseURL)
            .delete("/category/non-existent-id")
            .set("Cookie", tokenCookie)
            .expect(500);
    });

    afterAll(async () => {
        await clearDatabase();
    });
});
