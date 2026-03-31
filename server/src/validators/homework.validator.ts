import { z } from "zod";

export const createHomeworkSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  topic: z.string().min(1).trim(),
  classId: z.string().min(1),
  theoryContent: z.string().optional().default(""),
  dueDate: z.string().datetime().optional(),
});

export const gradeSubmissionSchema = z.object({
  grade: z.number().min(0).max(100),
  feedback: z.string().optional().default(""),
  feedbackAnnotations: z
    .array(
      z.object({
        blockId: z.string(),
        comment: z.string(),
      })
    )
    .optional()
    .default([]),
});

export const returnSubmissionSchema = z.object({
  feedback: z.string().min(1),
  feedbackAnnotations: z
    .array(
      z.object({
        blockId: z.string(),
        comment: z.string(),
      })
    )
    .optional()
    .default([]),
});

export type CreateHomeworkInput = z.infer<typeof createHomeworkSchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
export type ReturnSubmissionInput = z.infer<typeof returnSubmissionSchema>;
