import { z } from "zod";

export const commentCreateSchema = z.object({
  content: z.string().min(2).max(1000)
});

export const commentUpdateSchema = commentCreateSchema.partial();
