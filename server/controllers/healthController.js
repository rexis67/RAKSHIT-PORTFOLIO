export function createHealthController(db) {
  return function getHealth(_req, res) {
    try {
      const result = db.prepare("SELECT 1 AS connected").get();
      if (result?.connected !== 1) throw new Error("Database health check returned no result.");
      return res.json({ status: "ok", database: "connected" });
    } catch {
      return res.status(503).json({
        error: "The service is temporarily unavailable.",
        code: "DATABASE_UNAVAILABLE"
      });
    }
  };
}
