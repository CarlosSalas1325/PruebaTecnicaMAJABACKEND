import { z } from "zod";

export const postCreateSchema = z.object({
  title: z.string().min(5).max(150),
  content: z.string().min(20),
  status: z.enum(["draft", "published"]).default("draft"),
  categoryIds: z.array(z.string().uuid()).default([]),
  imageUrl: z.string().url().max(500).optional()
});

export const postUpdateSchema = postCreateSchema.partial();
