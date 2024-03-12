const supertest = require("supertest");
const app = require("../app");

const request = supertest(app);

describe("Authentication API", () => {
    describe("POST /api/v1/auth/register", () => {
        test("should return 400 if email is empty", async () => {
            const response = await request.post("/api/v1/auth/register").send({
                password: "password",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Email is required");
        });

        test("should return 400 if password is empty", async () => {
            const response = await request.post("/api/v1/auth/register").send({
                email: "test@example.com",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Password is required");
        });

        test("should return 400 if email is missing", async () => {
            const response = await request.post("/api/v1/auth/register").send({
                email: "",
                password: "password",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Email cannot be empty");
        });

        test("should return 400 if password is missing", async () => {
            const response = await request.post("/api/v1/auth/register").send({
                email: "test@example.com",
                password: "",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Password cannot be empty");
        });

        test("should register a new user successfully", async () => {
            const response = await request.post("/api/v1/auth/register").send({
                email: "test@example.com",
                password: "password",
            });
            expect(response.status).toBe(201);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("User signed up successfully.");
            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data).toHaveProperty("token");
        });

        test("should return 500 if email is already registered", async () => {
            const response = await request.post("/api/v1/auth/register").send({
                email: "test@example.com",
                password: "password",
            });
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(
                "Email already signed up. Sign in to continue."
            );
        });
    });

    describe("POST /api/v1/auth/login", () => {
        test("should return 400 if email is empty", async () => {
            const response = await request.post("/api/v1/auth/register").send({
                password: "password",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Email is required");
        });

        test("should return 400 if password is empty", async () => {
            const response = await request.post("/api/v1/auth/register").send({
                email: "test@example.com",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Password is required");
        });

        test("should return 400 if email is missing", async () => {
            const response = await request.post("/api/v1/auth/register").send({
                email: "",
                password: "password",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Email cannot be empty");
        });

        test("should return 400 if password is missing", async () => {
            const response = await request.post("/api/v1/auth/register").send({
                email: "test@example.com",
                password: "",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Password cannot be empty");
        });

        test("should return 500 if wrong email", async () => {
            const userData = {
                email: "wrong@example.com",
                password: "password",
            };
            const response = await request
                .post("/api/v1/auth/login")
                .send(userData);

            expect(response.status).toBe(500);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe("User not found!");
        });

        test("should return 500 if wrong password", async () => {
            const userData = {
                email: "test@example.com",
                password: "wrong_password",
            };
            const response = await request
                .post("/api/v1/auth/login")
                .send(userData);

            expect(response.status).toBe(500);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe("Invalid user/password!");
        });

        test("should log in an existing user", async () => {
            const userData = {
                email: "test@example.com",
                password: "password",
            };

            const response = await request
                .post("/api/v1/auth/login")
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("User signed in successfully.");
            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data).toHaveProperty("token");
        });
    });
});
