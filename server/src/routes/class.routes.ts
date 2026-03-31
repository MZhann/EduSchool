import { Router } from "express";
import * as classController from "../controllers/class.controller";
import { authenticate, requireRole } from "../middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  requireRole("teacher"),
  classController.createClass
);

router.get(
  "/teacher",
  authenticate,
  requireRole("teacher"),
  classController.getTeacherClasses
);

router.get(
  "/teacher/:classId",
  authenticate,
  requireRole("teacher"),
  classController.getClassById
);

router.post(
  "/join",
  authenticate,
  requireRole("student"),
  classController.joinClass
);

router.get(
  "/student",
  authenticate,
  requireRole("student"),
  classController.getStudentClasses
);

router.delete(
  "/:classId/students/:studentId",
  authenticate,
  requireRole("teacher"),
  classController.removeStudent
);

export default router;
