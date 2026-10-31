import { Router } from "express";
import { createHealthController } from "../controllers/healthController.js";

export function createHealthRouter(db) {
  const router = Router();
  router.get("/", createHealthController(db));
  return router;
}
