const supertest = require("supertest");
const app = require("../app");
const { todoInput, wrongTodoInput } = require("../public/test_input");

const request = supertest(app);

describe("User API", () => {
    let token;

    // Log in before tests
    beforeAll(async () => {
        const response = await request.post("/api/v1/auth/register").send({
            email: "test@example.com",
            password: "password",
        });

        token = response?.body?.data?.token;
    });

    describe("GET /api/v1/user/profile", () => {
        test("should return 500 if token is empty", async () => {
            const response = await request.get("/api/v1/user/profile");
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe("Invalid access token.");
        });
    });

    describe("GET /api/v1/user/profile", () => {
        test("should return 201 with profile details", async () => {
            const response = await request
                .get("/api/v1/user/profile")
                .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe(
                "User Profile fetched successfully."
            );
        });
    });

    describe("GET /api/v1/user/todo", () => {
        test("should return 500 if token is empty", async () => {
            const response = await request.get("/api/v1/user/todo");
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe("Unable To Validate Token");
        });
    });

    describe("GET /api/v1/user/todo", () => {
        test("should return 404 if todo tasks are not present", async () => {
            const response = await request
                .get("/api/v1/user/todo")
                .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe(
                "No todo tasks found for this user."
            );
        });
    });

    describe("POST /api/v1/user/todo", () => {
        test("should return 400 for invalid payload", async () => {
            const samplePayload = wrongTodoInput;

            const response = await request
                .post("/api/v1/user/todo")
                .set("Authorization", `Bearer ${token}`)
                .send(samplePayload);

            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe('"name" cannot be empty.');
        });
    });

    describe("POST /api/v1/user/todo", () => {
        test("should return 500 with a invalid or empty token", async () => {
            const samplePayload = todoInput;

            const response = await request
                .post("/api/v1/user/todo")
                .set("Authorization", `Bearer `)
                .send(samplePayload);

            expect(response.statusCode).toBe(500);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe("Unable To Validate Token");
        });
    });

    describe("POST /api/v1/user/todo", () => {
        test("should add todo tasks successfully with a valid token", async () => {
            const samplePayload = todoInput;

            const response = await request
                .post("/api/v1/user/todo")
                .set("Authorization", `Bearer ${token}`)
                .send(samplePayload);

            expect(response.statusCode).toBe(201);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe(
                "Todo tasks added successfully."
            );
        });
    });

    describe("GET /api/v1/user/todo", () => {
        test("should return 201 with todo tasks", async () => {
            const response = await request
                .get("/api/v1/user/todo")
                .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe(
                "Todo tasks fetched successfully."
            );
        });
    });
});
