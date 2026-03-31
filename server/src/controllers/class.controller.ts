import { Response, NextFunction } from "express";
import { classService } from "../services";
import { createClassSchema, joinClassSchema } from "../validators";
import { AuthRequest } from "../types";

export async function createClass(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createClassSchema.parse(req.body);
    const cls = await classService.createClass(req.user!.userId, data);
    res.status(201).json(cls);
  } catch (error) {
    next(error);
  }
}

export async function getTeacherClasses(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const classes = await classService.getTeacherClasses(req.user!.userId);
    res.json(classes);
  } catch (error) {
    next(error);
  }
}

export async function getClassById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const cls = await classService.getClassById(
      req.params.classId as string,
      req.user!.userId
    );
    res.json(cls);
  } catch (error) {
    next(error);
  }
}

export async function joinClass(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = joinClassSchema.parse(req.body);
    const cls = await classService.joinClass(req.user!.userId, data);
    res.json({ message: "Successfully joined the class", class: cls });
  } catch (error) {
    next(error);
  }
}

export async function getStudentClasses(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const classes = await classService.getStudentClasses(req.user!.userId);
    res.json(classes);
  } catch (error) {
    next(error);
  }
}

export async function removeStudent(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const cls = await classService.removeStudent(
      req.params.classId as string,
      req.params.studentId as string,
      req.user!.userId
    );
    res.json(cls);
  } catch (error) {
    next(error);
  }
}
