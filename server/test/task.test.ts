import request from "supertest";
import app from "../src/main.js";
import { describe, it, expect, expectTypeOf, afterAll, beforeAll } from "vitest";
import { Task } from "@prisma/client";
import clearDatabase from "./utils/clearDatabase.js";
import createTestUser from "./utils/createTestUser.js";
import { Server } from "http";

let server: Server;
let baseURL: string;
let tokenCookie: string;

describe("Test operations with tasks", () => {
    beforeAll(async () => {
        server = app.listen(0);
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        baseURL = `http://localhost:${port}`;
        await clearDatabase();
        ({ tokenCookie } = await createTestUser());
    });

    it("Should return a list of tasks", async () => {
        const response = await request(baseURL).get("/task").set("Cookie", tokenCookie).expect(200);
        expectTypeOf(response.body).toMatchTypeOf<Task[]>();
    });

    it("Should respond with an error if you submit a non-existent category name when receiving issues by category name", async () => {
        await request(baseURL)
            .get("/task/non-existent-category-id")
            .set("Cookie", tokenCookie)
            .expect(404);
    });

    it("Should add a task properly", async () => {
        const prevResponse = await request(baseURL).get("/task").set("Cookie", tokenCookie);
        const prevLength = prevResponse.body.length;

        const newTaskResponse = await request(baseURL)
            .post("/task")
            .send({ name: "Test task" })
            .set("Cookie", tokenCookie)
            .expect(201);
        const newTask = newTaskResponse.body;
        expect(typeof newTask.id).toBe("string");
        expect(newTask.name).toBe("Test task");
        expect(newTask.isDone).toBe(false);

        const response = await request(baseURL).get("/task").set("Cookie", tokenCookie);
        const length = response.body.length;
        expect(prevLength + 1).toBe(length);

        const addedTask = response.body.find((task: Task) => task.name === "Test task");
        expect(addedTask).not.toBeUndefined();
    });

    it("Should respond with an error if you send an invalid data when adding a new task", async () => {
        await request(baseURL).post("/task").set("Cookie", tokenCookie).expect(400);
        await request(baseURL)
            .post("/task")
            .send({ name: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .post("/task")
            .send({ name: "t".repeat(129) })
            .set("Cookie", tokenCookie)
            .expect(400);
    });

    it("Should switch a task completion status properly", async () => {
        const newTaskResponse = await request(baseURL)
            .post("/task")
            .send({ name: "Test task" })
            .set("Cookie", tokenCookie)
            .expect(201);
        const { id } = newTaskResponse.body;

        const updatedTaskResponse1 = await request(baseURL)
            .put("/task/status")
            .send({ id })
            .set("Cookie", tokenCookie)
            .expect(200);
        const updatedTask1 = updatedTaskResponse1.body;
        expect(updatedTask1.name).toBe("Test task");
        expect(updatedTask1.isDone).toBe(true);

        const updatedTaskResponse2 = await request(baseURL)
            .put("/task/status")
            .send({ id })
            .set("Cookie", tokenCookie)
            .expect(200);
        const updatedTask2 = updatedTaskResponse2.body;
        expect(updatedTask2.name).toBe("Test task");
        expect(updatedTask2.isDone).toBe(false);
    });

    it("Should respond with an error if you send an empty request body when switching task completion status", async () => {
        await request(baseURL).put("/task/status").set("Cookie", tokenCookie).expect(400);
    });

    it("Should respond with an error if you send an empty task id when switching task completion status", async () => {
        await request(baseURL)
            .put("/task/status")
            .send({ name: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
    });

    it("Should respond with an error if you submit a non-existent task id when switching task completion status", async () => {
        await request(baseURL)
            .put("/task/status")
            .send({ name: "non-existent-id" })
            .set("Cookie", tokenCookie)
            .expect(400);
    });

    it("Should delete a task properly", async () => {
        const newTaskResponse = await request(baseURL)
            .post("/task")
            .send({ name: "Test task" })
            .set("Cookie", tokenCookie)
            .expect(201);
        const { id } = newTaskResponse.body;

        const prevResponse = await request(baseURL).get("/task").set("Cookie", tokenCookie);
        const prevLength = prevResponse.body.length;

        await request(baseURL).delete(`/task/${id}`).set("Cookie", tokenCookie).expect(200);

        const response = await request(baseURL).get("/task").set("Cookie", tokenCookie);
        const length = response.body.length;
        expect(prevLength - 1).toBe(length);

        const removedTask = response.body.find((task: Task) => task.id === id);
        expect(removedTask).toBeUndefined();
    });

    it("Should respond with an error if you submit a non-existent task id when deleting a task", async () => {
        await request(baseURL)
            .delete("/task/non-existent-id")
            .set("Cookie", tokenCookie)
            .expect(500);
    });

    it("Should assign a task to a category properly", async () => {
        const uniqueName = Date.now().toString();

        const newTaskResponse = await request(baseURL)
            .post("/task")
            .send({ name: "New task" })
            .set("Cookie", tokenCookie);
        const newTaskId = newTaskResponse.body.id;

        const newCategoryResponse = await request(baseURL)
            .post("/category")
            .send({ name: uniqueName })
            .set("Cookie", tokenCookie)
            .expect(201);
        const newCategoryId = newCategoryResponse.body.id;
        const newCategoryName = newCategoryResponse.body.name;

        await request(baseURL)
            .put("/task/assign")
            .send({ taskId: newTaskId, categoryId: newCategoryId })
            .set("Cookie", tokenCookie)
            .expect(200);

        const tasksByCategoryNameResponse = await request(baseURL)
            .get(`/task/?categoryName=${newCategoryName}`)
            .set("Cookie", tokenCookie)
            .expect(200);
        expectTypeOf(tasksByCategoryNameResponse.body).toMatchTypeOf<Task[]>();

        const assignedCategory = tasksByCategoryNameResponse.body.find(
            (task: Task) => task.id === newTaskId
        );
        expect(assignedCategory).not.toBeUndefined();
    });

    it("Should respond with an error if you send an empty request body, taskId or categoryId when assigning a task to a category", async () => {
        await request(baseURL).put("/task/assign").set("Cookie", tokenCookie).expect(400);
        await request(baseURL)
            .put("/task/assign")
            .send({ taskId: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/task/assign")
            .send({ taskId: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/task/assign")
            .send({ taskId: "test", categoryId: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/task/assign")
            .send({ taskId: "", categoryId: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/task/assign")
            .send({ categoryId: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/task/assign")
            .send({ categoryId: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
    });

    it("Should unassign a task from a category properly", async () => {
        const uniqueName = Date.now().toString();

        const newTaskResponse = await request(baseURL)
            .post("/task")
            .send({ name: "New task" })
            .set("Cookie", tokenCookie);
        const newTaskId = newTaskResponse.body.id;

        const newCategoryResponse = await request(baseURL)
            .post("/category")
            .send({ name: uniqueName })
            .set("Cookie", tokenCookie)
            .expect(201);
        const newCategoryId = newCategoryResponse.body.id;
        const newCategoryName = newCategoryResponse.body.name;

        await request(baseURL)
            .put("/task/assign")
            .send({ taskId: newTaskId, categoryId: newCategoryId })
            .set("Cookie", tokenCookie)
            .expect(200);

        const tasksByCategoryNameResponse1 = await request(baseURL)
            .get(`/task/?categoryName=${newCategoryName}`)
            .set("Cookie", tokenCookie)
            .expect(200);
        expectTypeOf(tasksByCategoryNameResponse1.body).toMatchTypeOf<Task[]>();

        const assignedTask = tasksByCategoryNameResponse1.body.find(
            (task: Task) => task.id === newTaskId
        );
        expect(assignedTask).not.toBeUndefined();

        await request(baseURL)
            .put("/task/unassign")
            .send({ taskId: newTaskId, categoryId: newCategoryId })
            .set("Cookie", tokenCookie)
            .expect(200);

        const tasksByCategoryNameResponse2 = await request(baseURL)
            .get(`/task/?categoryName=${newCategoryName}`)
            .set("Cookie", tokenCookie)
            .expect(200);
        expectTypeOf(tasksByCategoryNameResponse2.body).toMatchTypeOf<Task[]>();

        const unassignedTask = tasksByCategoryNameResponse2.body.find(
            (task: Task) => task.id === newTaskId
        );
        expect(unassignedTask).toBeUndefined();
    });

    it("Should respond with an error if you send an empty request body, taskId or categoryId when unassigning a task from a category", async () => {
        await request(baseURL).put("/task/unassign").set("Cookie", tokenCookie).expect(400);
        await request(baseURL)
            .put("/task/unassign")
            .send({ taskId: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/task/unassign")
            .send({ taskId: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/task/unassign")
            .send({ taskId: "test", categoryId: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/task/unassign")
            .send({ taskId: "", categoryId: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/task/unassign")
            .send({ categoryId: "test" })
            .set("Cookie", tokenCookie)
            .expect(400);
        await request(baseURL)
            .put("/task/unassign")
            .send({ categoryId: "" })
            .set("Cookie", tokenCookie)
            .expect(400);
    });

    afterAll(async () => {
        await clearDatabase();
    });
});
