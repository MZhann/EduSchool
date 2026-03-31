import { Response, NextFunction } from "express";
import { homeworkService } from "../services";
import { createHomeworkSchema } from "../validators";
import { AuthRequest } from "../types";

export async function createHomework(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createHomeworkSchema.parse(req.body);
    const homework = await homeworkService.createHomework(
      req.user!.userId,
      data
    );
    res.status(201).json(homework);
  } catch (error) {
    next(error);
  }
}

export async function getTeacherHomeworks(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const classId = req.query.classId as string | undefined;
    const homeworks = await homeworkService.getTeacherHomeworks(
      req.user!.userId,
      classId as string | undefined
    );
    res.json(homeworks);
  } catch (error) {
    next(error);
  }
}

export async function getHomeworkById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const homework = await homeworkService.getHomeworkById(
      req.params.homeworkId as string,
      req.user!.userId
    );
    res.json(homework);
  } catch (error) {
    next(error);
  }
}

export async function getStudentHomeworks(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const homeworks = await homeworkService.getStudentHomeworks(
      req.user!.userId
    );
    res.json(homeworks);
  } catch (error) {
    next(error);
  }
}

export async function getHomeworkMonitoring(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await homeworkService.getHomeworkMonitoring(
      req.params.homeworkId as string,
      req.user!.userId
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function closeHomework(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const homework = await homeworkService.closeHomework(
      req.params.homeworkId as string,
      req.user!.userId
    );
    res.json(homework);
  } catch (error) {
    next(error);
  }
}

export async function getTopics(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const topics = await homeworkService.getTopics();
    res.json(topics);
  } catch (error) {
    next(error);
  }
}
