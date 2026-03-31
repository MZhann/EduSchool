import { z } from "zod";

const htmlBlockSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    tag: z.string(),
    content: z.string().default(""),
    children: z.array(htmlBlockSchema).default([]),
    attributes: z.record(z.string()).optional().default({}),
  })
);

export const saveSubmissionSchema = z.object({
  blocks: z.array(htmlBlockSchema),
  generatedHtml: z.string(),
});

export const submitSubmissionSchema = z.object({
  blocks: z.array(htmlBlockSchema).min(1),
  generatedHtml: z.string().min(1),
});

export type SaveSubmissionInput = z.infer<typeof saveSubmissionSchema>;
export type SubmitSubmissionInput = z.infer<typeof submitSubmissionSchema>;
