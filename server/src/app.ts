import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware";
import routes from "./routes";

const app = express();

const allowedOrigins = env.clientUrl
  .split(",")
  .map((o) => o.trim().replace(/\/+$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use(errorHandler);

async function start() {
  await connectDB();
  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch(console.error);

export default app;
