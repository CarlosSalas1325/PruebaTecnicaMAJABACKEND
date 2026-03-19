import { AnyZodObject, ZodError } from "zod";
import { HttpError } from "./http-error";

export const validateSchema = <T>(schema: AnyZodObject, payload: unknown): T => {
  try {
    return schema.parse(payload) as T;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError(400, error.errors.map((item) => item.message).join(", "));
    }
    throw error;
  }
};
