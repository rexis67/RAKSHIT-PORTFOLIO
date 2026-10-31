import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";

export function createProjectsRouter(projectRepository) {
  const router = Router();

  router.get("/", asyncHandler(async (_req, res) => {
    res.json(await projectRepository.list());
  }));

  router.get("/:slug", asyncHandler(async (req, res) => {
    const project = await projectRepository.findBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({
        error: "Project not found.",
        code: "PROJECT_NOT_FOUND"
      });
    }
    return res.json(project);
  }));

  return router;
}
