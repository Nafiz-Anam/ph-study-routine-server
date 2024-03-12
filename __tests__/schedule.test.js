const supertest = require("supertest");
const app = require("../app");
const { sampleInput, sampleWrongInput } = require("../public/test_input");

const request = supertest(app);

describe("Schedule API", () => {
    let token;

    // Log in before tests
    beforeAll(async () => {
        const response = await request.post("/api/v1/auth/register").send({
            email: "test@example.com",
            password: "password",
        });

        token = response?.body?.data?.token;
    });

    describe("GET /api/v1/schedule/initial", () => {
        test("should return 500 if token is empty", async () => {
            const response = await request.get("/api/v1/schedule/initial");
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe("Unable To Validate Token");
        });
    });

    describe("GET /api/v1/schedule/initial", () => {
        test("should return 404 if block-logs are not present", async () => {
            const response = await request
                .get("/api/v1/schedule/initial")
                .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe(
                "Block-logs not found for this user."
            );
        });
    });

    describe("POST /api/v1/schedule/initial", () => {
        test("should return 400 for invalid payload", async () => {
            const samplePayload = sampleWrongInput;

            const response = await request
                .post("/api/v1/schedule/initial")
                .set("Authorization", `Bearer ${token}`)
                .send(samplePayload);

            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe(
                "Missing time blocks for Monday"
            );
        });
    });

    describe("POST /api/v1/schedule/initial", () => {
        test("should return 500 with a invalid or empty token", async () => {
            const samplePayload = sampleInput;

            const response = await request
                .post("/api/v1/schedule/initial")
                .set("Authorization", `Bearer `)
                .send(samplePayload);

            expect(response.statusCode).toBe(500);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe("Unable To Validate Token");
        });
    });

    describe("POST /api/v1/schedule/initial", () => {
        test("should add block-logs successfully with a valid token", async () => {
            const samplePayload = sampleInput;

            const response = await request
                .post("/api/v1/schedule/initial")
                .set("Authorization", `Bearer ${token}`)
                .send(samplePayload);

            expect(response.statusCode).toBe(201);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe(
                "Block-logs added successfully."
            );
        });
    });

    describe("GET /api/v1/schedule/initial", () => {
        test("should return 201 if block-logs are present", async () => {
            const response = await request
                .get("/api/v1/schedule/initial")
                .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe(
                "Block-logs fetched successfully."
            );
        });
    });
});
