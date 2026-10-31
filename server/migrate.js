import "dotenv/config";
import { createDatabase } from "./database.js";

const db = createDatabase();
try {
  console.log("Database migration completed.");
} finally {
  db.close();
}
