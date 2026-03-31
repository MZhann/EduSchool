import { Router } from "express";
import authRoutes from "./auth.routes";
import classRoutes from "./class.routes";
import homeworkRoutes from "./homework.routes";
import submissionRoutes from "./submission.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/classes", classRoutes);
router.use("/homework", homeworkRoutes);
router.use("/submissions", submissionRoutes);

export default router;
