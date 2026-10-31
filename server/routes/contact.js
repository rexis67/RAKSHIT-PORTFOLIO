import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { createContactController } from "../controllers/contactController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export function createContactRouter({ contactRepository, rateLimitOptions = {} }) {
  const router = Router();
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: "Too many contact requests. Please try again later.",
      code: "RATE_LIMITED"
    },
    ...rateLimitOptions
  });

  router.post("/", limiter, asyncHandler(createContactController(contactRepository)));
  return router;
}
