function toProject(row, number) {
  if (!row) return undefined;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    short_description: row.short_description,
    full_description: row.full_description,
    category: row.category,
    live_url: row.live_url,
    repository_url: row.repository_url,
    technologies: JSON.parse(row.technologies),
    featured: Boolean(row.featured),
    created_at: row.created_at,
    updated_at: row.updated_at,
    number: String(number).padStart(2, "0")
  };
}

export function createProjectRepository(db) {
  const listStatement = db.prepare(`
    SELECT id, slug, title, short_description, full_description, category,
           live_url, repository_url, technologies, featured, created_at, updated_at
    FROM projects
    ORDER BY featured DESC, created_at ASC, id ASC
  `);
  const findStatement = db.prepare(`
    SELECT id, slug, title, short_description, full_description, category,
           live_url, repository_url, technologies, featured, created_at, updated_at
    FROM projects
    WHERE slug = ?
  `);

  function listProjects() {
    return listStatement.all().map((row, index) => toProject(row, index + 1));
  }

  return {
    async list() {
      return listProjects();
    },
    async findBySlug(slug) {
      const row = findStatement.get(slug);
      if (!row) return undefined;
      const number = listStatement.all().findIndex(project => project.id === row.id) + 1;
      return toProject(row, number);
    }
  };
}
