import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || "5001", 10),
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/eduschool",
  jwtSecret: process.env.JWT_SECRET || "default-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
} as const;
