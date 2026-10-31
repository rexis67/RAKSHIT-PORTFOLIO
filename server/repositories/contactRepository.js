export function createContactRepository(db) {
  return {
    async create({ name, email, subject, message }) {
      const result = db.prepare(`
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES (?, ?, ?, ?)
      `).run(name, email, subject, message);

      return { id: result.lastInsertRowid };
    }
  };
}
