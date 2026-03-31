import { Response, NextFunction } from "express";
import { submissionService } from "../services";
import {
  saveSubmissionSchema,
  submitSubmissionSchema,
  gradeSubmissionSchema,
  returnSubmissionSchema,
} from "../validators";
import { AuthRequest } from "../types";

export async function getStudentSubmission(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await submissionService.getStudentSubmission(
      req.params.homeworkId as string,
      req.user!.userId
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function saveProgress(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = saveSubmissionSchema.parse(req.body);
    const submission = await submissionService.saveProgress(
      req.params.homeworkId as string,
      req.user!.userId,
      data
    );
    res.json(submission);
  } catch (error) {
    next(error);
  }
}

export async function submitWork(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = submitSubmissionSchema.parse(req.body);
    const submission = await submissionService.submitWork(
      req.params.homeworkId as string,
      req.user!.userId,
      data
    );
    res.json(submission);
  } catch (error) {
    next(error);
  }
}

export async function gradeSubmission(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = gradeSubmissionSchema.parse(req.body);
    const submission = await submissionService.gradeSubmission(
      req.params.submissionId as string,
      req.user!.userId,
      data
    );
    res.json(submission);
  } catch (error) {
    next(error);
  }
}

export async function returnSubmission(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = returnSubmissionSchema.parse(req.body);
    const submission = await submissionService.returnSubmission(
      req.params.submissionId as string,
      req.user!.userId,
      data
    );
    res.json(submission);
  } catch (error) {
    next(error);
  }
}

export async function getSubmissionById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const submission = await submissionService.getSubmissionById(
      req.params.submissionId as string
    );
    res.json(submission);
  } catch (error) {
    next(error);
  }
}

export async function getClassStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const stats = await submissionService.getClassStats(
      req.params.classId as string,
      req.user!.userId
    );
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getTeacherGrades(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const classId = req.query.classId as string | undefined;
    const grades = await submissionService.getTeacherGrades(
      req.user!.userId,
      classId
    );
    res.json(grades);
  } catch (error) {
    next(error);
  }
}

export async function getStudentGrades(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const grades = await submissionService.getStudentGrades(req.user!.userId);
    res.json(grades);
  } catch (error) {
    next(error);
  }
}
