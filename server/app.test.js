import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import { createDatabase } from "./database.js";
import { migrateDatabase } from "./migrations.js";

const validContact = {
  name: "  Alex Doe  ",
  email: "  ALEX@EXAMPLE.COM ",
  subject: "  Project question ",
  message: "  I would love to hear more about your project.  "
};

describe("portfolio API", () => {
  let db;

  afterEach(() => {
    if (typeof db?.close === "function") db.close();
    db = undefined;
    vi.restoreAllMocks();
  });

  function makeApp(options = {}) {
    db = options.database ?? createDatabase(":memory:");
    return createApp({
      db,
      frontendOrigin: options.frontendOrigin ?? "http://localhost:5173",
      contactRateLimit: options.contactRateLimit
    });
  }

  it("checks database connectivity and allows the configured frontend origin", async () => {
    const response = await request(makeApp({ frontendOrigin: "https://portfolio.example" }))
      .get("/api/health")
      .set("Origin", "https://portfolio.example");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", database: "connected" });
    expect(response.headers["access-control-allow-origin"]).toBe("https://portfolio.example");
    expect(response.headers["content-security-policy"]).toContain("https://fonts.googleapis.com");
  });

  it("does not grant CORS access to an unconfigured origin", async () => {
    const response = await request(makeApp({ frontendOrigin: "https://portfolio.example" }))
      .get("/api/projects")
      .set("Origin", "https://untrusted.example");

    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("reports an unavailable database without leaking the underlying error", async () => {
    const app = makeApp();
    db.close();
    db = undefined;
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      error: "The service is temporarily unavailable.",
      code: "DATABASE_UNAVAILABLE"
    });
    expect(JSON.stringify(response.body)).not.toContain("private database");
  });

  it("returns all explicitly defined portfolio projects", async () => {
    const response = await request(makeApp()).get("/api/projects");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.map(project => project.slug)).toEqual([
      "civicguard",
      "school-website-refresh"
    ]);
  });

  it("returns one project by slug and a 404 for an unknown project", async () => {
    const app = makeApp();
    const project = await request(app).get("/api/projects/civicguard");
    const missing = await request(app).get("/api/projects/not-a-project");

    expect(project.status).toBe(200);
    expect(project.body).toMatchObject({
      slug: "civicguard",
      title: "CivicGuard — Municipal Incident Intelligence",
      repository_url: "https://github.com/rexis67/civicguard",
      technologies: ["React", "Vite", "Express", "SQLite", "Gemini", "JWT"]
    });
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({
      error: "Project not found.",
      code: "PROJECT_NOT_FOUND"
    });
  });

  it("normalizes valid contact fields and only confirms a persisted submission", async () => {
    const response = await request(makeApp()).post("/api/contact").send(validContact);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 1,
      message: "Thanks for reaching out. Your message has been received."
    });
    expect(db.prepare("SELECT name, email, subject, message FROM contact_messages").get())
      .toEqual({
        name: "Alex Doe",
        email: "alex@example.com",
        subject: "Project question",
        message: "I would love to hear more about your project."
      });
  });

  it("rejects missing and malformed fields with structured HTTP 400 errors", async () => {
    const response = await request(makeApp()).post("/api/contact").send({
      name: "A",
      email: "not-an-email",
      subject: "Hi",
      message: "Short"
    });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
    expect(response.body.details).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: "name" }),
      expect.objectContaining({ field: "email" }),
      expect.objectContaining({ field: "message" })
    ]));
    expect(db.prepare("SELECT COUNT(*) AS count FROM contact_messages").get().count).toBe(0);
  });

  it("returns a JSON 400 for malformed JSON", async () => {
    const response = await request(makeApp())
      .post("/api/contact")
      .set("Content-Type", "application/json")
      .send('{"name":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Request body must be valid JSON.",
      code: "INVALID_JSON"
    });
  });

  it("rejects oversized JSON requests", async () => {
    const response = await request(makeApp())
      .post("/api/contact")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ message: "x".repeat(12_000) }));

    expect(response.status).toBe(413);
    expect(response.body.code).toBe("REQUEST_TOO_LARGE");
  });

  it("rate limits contact submissions and returns a consistent 429 response", async () => {
    const app = makeApp({ contactRateLimit: { limit: 2, windowMs: 60_000 } });
    await request(app).post("/api/contact").send(validContact);
    await request(app).post("/api/contact").send(validContact);
    const limited = await request(app).post("/api/contact").send(validContact);

    expect(limited.status).toBe(429);
    expect(limited.body).toEqual({
      error: "Too many contact requests. Please try again later.",
      code: "RATE_LIMITED"
    });
    expect(limited.headers.ratelimit).toContain("2-in-1min");
    expect(db.prepare("SELECT COUNT(*) AS count FROM contact_messages").get().count).toBe(2);
  });

  it("returns a generic server error when SQLite cannot store a contact", async () => {
    const failingDatabase = {
      prepare: () => ({
        run: () => { throw new Error("private database detail and message contents"); }
      })
    };
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await request(makeApp({ database: failingDatabase }))
      .post("/api/contact")
      .send(validContact);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "An unexpected server error occurred.",
      code: "INTERNAL_SERVER_ERROR"
    });
    expect(JSON.stringify(response.body)).not.toContain("private database");
    expect(log).toHaveBeenCalledWith("Request failed:", "Error", "UNEXPECTED");
    expect(log.mock.calls.flat().join(" ")).not.toContain("message contents");
  });

  it("does not expose contact submissions and returns consistent unknown-route errors", async () => {
    const app = makeApp();
    const privateRoute = await request(app).get("/api/contact/messages");
    const unknownRoute = await request(app).get("/api/missing");

    expect(privateRoute.status).toBe(404);
    expect(unknownRoute.body).toEqual({
      error: "Route not found.",
      code: "NOT_FOUND"
    });
  });

  it("keeps database initialization idempotent", () => {
    db = createDatabase(":memory:");
    expect(() => migrateDatabase(db)).not.toThrow();
    expect(db.prepare("SELECT COUNT(*) AS count FROM contact_messages").get().count).toBe(0);
  });
});
