const request = require("supertest");
const { app } = require("../src/app");

describe("Authentication API", () => {

    test("refuse une requête sans données", async () => {
        const response = await request(app)
            .post("/api/login")
            .send({});

        expect(response.statusCode).not.toBe(500);
    });

    test("ne doit pas accepter un utilisateur arbitraire", async () => {
        const response = await request(app)
            .post("/api/login")
            .send({
                google_id: "fake-user-123",
                username: "Hacker",
                image: "https://example.com/fake.png"
            });

        expect(response.statusCode).not.toBe(200);
    });

});


describe("Message API", () => {

    test("Get image non reference", async () => {
        const response = await request(app)
            .get("/api/image/z");

        expect(response.statusCode).not.toBe(400);
    });

});