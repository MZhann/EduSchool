import { z } from "zod";

export const createClassSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  joinPassword: z.string().min(4).max(50),
});

export const joinClassSchema = z.object({
  joinCode: z.string().min(1).trim(),
  joinPassword: z.string().min(1),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type JoinClassInput = z.infer<typeof joinClassSchema>;
