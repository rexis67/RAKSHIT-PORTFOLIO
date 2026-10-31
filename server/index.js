import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { createDatabase } from "./database.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const db = createDatabase();
const app = createApp({
  db,
  staticDirectory: path.resolve(here, "../dist")
});
const port = Number(process.env.PORT ?? 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  db.close();
  throw new Error("PORT must be an integer between 1 and 65535.");
}

const server = app.listen(port, () => {
  console.log(`Portfolio server listening on http://localhost:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => {
      db.close();
      process.exit(0);
    });
  });
}
