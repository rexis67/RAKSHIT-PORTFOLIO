import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createContactRepository } from "./repositories/contactRepository.js";
import { createProjectRepository } from "./repositories/projectRepository.js";
import { createContactRouter } from "./routes/contact.js";
import { createHealthRouter } from "./routes/health.js";
import { createProjectsRouter } from "./routes/projects.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export function createApp({
  db,
  frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  staticDirectory,
  contactRateLimit
} = {}) {
  if (!db) throw new Error("A database connection is required.");

  const app = express();
  app.disable("x-powered-by");
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"]
      }
    }
  }));
  app.use(cors({
    origin(origin, callback) {
      callback(null, origin === frontendOrigin);
    }
  }));
  app.use(express.json({ limit: "10kb" }));

  app.use("/api/health", createHealthRouter(db));
  app.use("/api/projects", createProjectsRouter(createProjectRepository(db)));
  app.use("/api/contact", createContactRouter({
    contactRepository: createContactRepository(db),
    rateLimitOptions: contactRateLimit
  }));
  app.use("/api", notFoundHandler);

  if (staticDirectory) {
    app.use(express.static(staticDirectory));
    app.get("*path", (_req, res) => res.sendFile("index.html", { root: staticDirectory }));
  } else {
    app.use(notFoundHandler);
  }

  app.use(errorHandler);
  return app;
}
