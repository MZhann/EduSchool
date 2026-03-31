import jwt from "jsonwebtoken";
import { User, IUser } from "../models";
import { env } from "../config/env";
import { AppError } from "../middleware";
import { RegisterInput, LoginInput } from "../validators";
import { JwtPayload } from "../types";

function generateToken(user: IUser): string {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
}

export async function register(data: RegisterInput) {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError(409, "Email already registered");
  }

  const user = await User.create(data);
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function login(data: LoginInput) {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getProfile(userId: string) {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}
