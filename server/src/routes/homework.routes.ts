import { Router } from "express";
import * as homeworkController from "../controllers/homework.controller";
import { authenticate, requireRole } from "../middleware";

const router = Router();

router.get("/topics", authenticate, homeworkController.getTopics);

router.post(
  "/",
  authenticate,
  requireRole("teacher"),
  homeworkController.createHomework
);

router.get(
  "/teacher",
  authenticate,
  requireRole("teacher"),
  homeworkController.getTeacherHomeworks
);

router.get(
  "/student",
  authenticate,
  requireRole("student"),
  homeworkController.getStudentHomeworks
);

router.get(
  "/:homeworkId",
  authenticate,
  homeworkController.getHomeworkById
);

router.get(
  "/:homeworkId/monitoring",
  authenticate,
  requireRole("teacher"),
  homeworkController.getHomeworkMonitoring
);

router.patch(
  "/:homeworkId/close",
  authenticate,
  requireRole("teacher"),
  homeworkController.closeHomework
);

export default router;
