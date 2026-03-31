import { Request, Response, NextFunction } from "express";
import { authService } from "../services";
import { registerSchema, loginSchema, updateProfileSchema } from "../validators";
import { AuthRequest } from "../types";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await authService.getProfile(req.user!.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await authService.updateProfile(req.user!.userId, data);
    res.json(user);
  } catch (error) {
    next(error);
  }
}
