import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createDatabase } from "./database.js";
import { migrateDatabase } from "./migrations.js";
import { createProjectRepository } from "./repositories/projectRepository.js";
import { createContactRepository } from "./repositories/contactRepository.js";
import { contactSchema } from "./validation/contact.js";

describe("SQLite database layer", () => {
  let db;
  let temporaryDirectory;

  afterEach(() => {
    if (typeof db?.close === "function") db.close();
    db = undefined;
    if (temporaryDirectory) {
      fs.rmSync(temporaryDirectory, { recursive: true, force: true });
      temporaryDirectory = undefined;
    }
  });

  it("initializes the schema, constraints, indexes, and SQLite reliability settings", () => {
    db = createDatabase(":memory:");

    const tables = db.prepare(`
      SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name
    `).all().map(row => row.name);
    const projectColumns = db.prepare("PRAGMA table_info(projects)").all();
    const contactColumns = db.prepare("PRAGMA table_info(contact_messages)").all();
    const indexes = db.prepare(`
      SELECT name FROM sqlite_master WHERE type = 'index'
    `).all().map(row => row.name);

    expect(tables).toContain("projects");
    expect(tables).toContain("contact_messages");
    expect(projectColumns.map(column => column.name)).toEqual(expect.arrayContaining([
      "id", "slug", "title", "short_description", "full_description", "category",
      "live_url", "repository_url", "technologies", "featured", "created_at", "updated_at"
    ]));
    expect(contactColumns.map(column => column.name)).toEqual([
      "id", "name", "email", "subject", "message", "created_at"
    ]);
    expect(projectColumns.find(column => column.name === "slug").notnull).toBe(1);
    expect(contactColumns.filter(column => column.name !== "id").every(column => column.notnull === 1)).toBe(true);
    expect(indexes).toEqual(expect.arrayContaining([
      "sqlite_autoindex_projects_1",
      "projects_featured_created_at_idx",
      "projects_category_idx",
      "contact_messages_created_at_idx"
    ]));
    expect(db.pragma("foreign_keys", { simple: true })).toBe(1);
    expect(db.pragma("busy_timeout", { simple: true })).toBe(5000);
  });

  it("creates nested database directories and opens the configured file path", () => {
    temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-sqlite-"));
    const databasePath = path.join(temporaryDirectory, "nested", "local.sqlite");
    db = createDatabase(databasePath);

    expect(fs.existsSync(databasePath)).toBe(true);
    expect(db.prepare("SELECT COUNT(*) AS count FROM projects").get().count).toBe(2);
  });

  it("seeds project data idempotently and does not overwrite existing edits", () => {
    db = createDatabase(":memory:");
    db.prepare(`
      UPDATE projects SET title = ?, updated_at = ? WHERE slug = ?
    `).run("A locally edited title", "2026-01-01T00:00:00.000Z", "civicguard");
    migrateDatabase(db);

    expect(db.prepare("SELECT title, updated_at FROM projects WHERE slug = ?").get("civicguard"))
      .toEqual({
        title: "A locally edited title",
        updated_at: "2026-01-01T00:00:00.000Z"
      });
    expect(db.prepare("SELECT COUNT(*) AS count FROM projects").get().count).toBe(2);
  });

  it("preserves existing contact records when the new project schema is applied", () => {
    db = createDatabase(":memory:");
    db.prepare(`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `).run("Existing sender", "sender@example.com", "Existing subject", "Existing private message.");
    migrateDatabase(db);

    expect(db.prepare(`
      SELECT name, email, subject FROM contact_messages WHERE id = 1
    `).get()).toEqual({
      name: "Existing sender",
      email: "sender@example.com",
      subject: "Existing subject"
    });
    expect(db.prepare("SELECT COUNT(*) AS count FROM projects").get().count).toBe(2);
  });

  it("queries seeded project data and parses the technologies JSON field", async () => {
    db = createDatabase(":memory:");
    const repository = createProjectRepository(db);
    const projects = await repository.list();
    const civicguard = await repository.findBySlug("civicguard");
    const school = await repository.findBySlug("school-website-refresh");

    expect(projects).toHaveLength(2);
    expect(school).toMatchObject({
      slug: "school-website-refresh",
      title: "School Website Refresh",
      live_url: "",
      technologies: ["HTML", "CSS", "JavaScript"],
      featured: true
    });
    expect(civicguard).toMatchObject({
      title: "CivicGuard — Municipal Incident Intelligence",
      repository_url: "https://github.com/rexis67/civicguard",
      technologies: ["React", "Vite", "Express", "SQLite", "Gemini", "JWT"],
      number: "01"
    });
    expect(await repository.findBySlug("does-not-exist")).toBeUndefined();
  });

  it("inserts contacts using prepared parameters", async () => {
    db = createDatabase(":memory:");
    const repository = createContactRepository(db);
    const receipt = await repository.create({
      name: "Test'); DROP TABLE projects;--",
      email: "person@example.com",
      subject: "Contact test",
      message: "A valid message that should be stored as data."
    });

    expect(receipt.id).toBe(1);
    expect(db.prepare("SELECT name FROM contact_messages WHERE id = ?").get(receipt.id).name)
      .toBe("Test'); DROP TABLE projects;--");
    expect(db.prepare("SELECT COUNT(*) AS count FROM projects").get().count).toBe(2);
  });

  it("accepts contact validation boundaries and normalizes whitespace and email case", () => {
    const parsed = contactSchema.safeParse({
      name: ` ${"N".repeat(80)} `,
      email: " Person@Example.com ",
      subject: "Sub",
      message: "0123456789"
    });

    expect(parsed.success).toBe(true);
    expect(parsed.data).toMatchObject({
      name: "N".repeat(80),
      email: "person@example.com",
      subject: "Sub",
      message: "0123456789"
    });
    expect(contactSchema.safeParse({
      name: "N".repeat(81),
      email: "person@example.com",
      subject: "Sub",
      message: "0123456789"
    }).success).toBe(false);
  });

  it("surfaces database initialization errors without leaving a partial database", () => {
    temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-sqlite-failure-"));
    const pathThatIsDirectory = path.join(temporaryDirectory, "not-a-database");
    fs.mkdirSync(pathThatIsDirectory);

    expect(() => createDatabase(pathThatIsDirectory)).toThrow();
  });
});
