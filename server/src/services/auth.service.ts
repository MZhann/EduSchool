import jwt from "jsonwebtoken";
import { User, IUser } from "../models";
import { env } from "../config/env";
import { AppError } from "../middleware";
import { RegisterInput, LoginInput, UpdateProfileInput } from "../validators";
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

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (data.email && data.email !== user.email) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new AppError(409, "Email already in use");
    }
    user.email = data.email;
  }

  if (data.name) {
    user.name = data.name;
  }

  if (data.newPassword) {
    if (!data.currentPassword) {
      throw new AppError(400, "Current password is required");
    }
    const isMatch = await user.comparePassword(data.currentPassword);
    if (!isMatch) {
      throw new AppError(401, "Current password is incorrect");
    }
    user.password = data.newPassword;
  }

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
