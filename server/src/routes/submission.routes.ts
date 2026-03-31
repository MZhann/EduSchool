import { Router } from "express";
import * as submissionController from "../controllers/submission.controller";
import { authenticate, requireRole } from "../middleware";

const router = Router();

router.get(
  "/homework/:homeworkId",
  authenticate,
  requireRole("student"),
  submissionController.getStudentSubmission
);

router.put(
  "/homework/:homeworkId/save",
  authenticate,
  requireRole("student"),
  submissionController.saveProgress
);

router.post(
  "/homework/:homeworkId/submit",
  authenticate,
  requireRole("student"),
  submissionController.submitWork
);

router.get(
  "/grades/teacher",
  authenticate,
  requireRole("teacher"),
  submissionController.getTeacherGrades
);

router.get(
  "/grades/student",
  authenticate,
  requireRole("student"),
  submissionController.getStudentGrades
);

router.get(
  "/:submissionId",
  authenticate,
  submissionController.getSubmissionById
);

router.post(
  "/:submissionId/grade",
  authenticate,
  requireRole("teacher"),
  submissionController.gradeSubmission
);

router.post(
  "/:submissionId/return",
  authenticate,
  requireRole("teacher"),
  submissionController.returnSubmission
);

router.get(
  "/stats/class/:classId",
  authenticate,
  requireRole("teacher"),
  submissionController.getClassStats
);

export default router;
