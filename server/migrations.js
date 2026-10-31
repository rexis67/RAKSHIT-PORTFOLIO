const seedProjects = [
  {
    slug: "civicguard",
    title: "CivicGuard — Municipal Incident Intelligence",
    shortDescription: "Civic issue reporting platform with Gemini-assisted triage.",
    fullDescription: "A civic issue reporting platform for potholes, streetlight failures, accessibility blockers, and sanitation issues, with Gemini-assisted incident triage.",
    category: "Full-stack platform",
    liveUrl: "https://civicguard-o1ik.onrender.com/",
    repositoryUrl: "https://github.com/rexis67/civicguard",
    technologies: ["React", "Vite", "Express", "SQLite", "Gemini", "JWT"]
  },
  {
    slug: "school-website-refresh",
    title: "School Website Refresh",
    shortDescription: "School website refresh featuring a notice board, quick links, gallery, and online registration.",
    fullDescription: "A refresh of a school website, bringing the notice board, quick links, an image gallery, and online registration into one clearer experience.",
    category: "Website refresh",
    liveUrl: "",
    repositoryUrl: null,
    technologies: ["HTML", "CSS", "JavaScript"]
  }
];

export function migrateDatabase(db) {
  const migrate = db.transaction(() => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        short_description TEXT NOT NULL,
        full_description TEXT NOT NULL,
        category TEXT NOT NULL,
        live_url TEXT NOT NULL,
        repository_url TEXT,
        technologies TEXT NOT NULL DEFAULT '[]'
          CHECK (json_valid(technologies) AND json_type(technologies) = 'array'),
        featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
      CREATE INDEX IF NOT EXISTS projects_featured_created_at_idx
        ON projects(featured DESC, created_at ASC);
      CREATE INDEX IF NOT EXISTS projects_category_idx
        ON projects(category);

      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
      CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
        ON contact_messages(created_at);
    `);

    const insertProject = db.prepare(`
      INSERT INTO projects (
        slug, title, short_description, full_description, category,
        live_url, repository_url, technologies, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      ON CONFLICT(slug) DO NOTHING
    `);

    for (const project of seedProjects) {
      insertProject.run(
        project.slug,
        project.title,
        project.shortDescription,
        project.fullDescription,
        project.category,
        project.liveUrl,
        project.repositoryUrl,
        JSON.stringify(project.technologies)
      );
    }
  });

  migrate();
}
