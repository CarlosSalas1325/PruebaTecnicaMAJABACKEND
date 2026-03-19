import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(2).max(60),
  description: z.string().max(200).optional()
});

export const categoryUpdateSchema = categoryCreateSchema.partial();
