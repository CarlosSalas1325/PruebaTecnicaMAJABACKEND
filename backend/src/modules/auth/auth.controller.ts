import { Request, Response } from "express";
import { AppDataSource } from "../../config/data-source";
import { User } from "../users/user.entity";
import { HttpError } from "../../utils/http-error";
import { validateSchema } from "../../utils/validation";
import { loginSchema, registerSchema } from "./auth.schemas";
import { signToken } from "../../utils/jwt";

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response): Promise<void> => {
  const data = validateSchema<{ name: string; email: string; password: string }>(registerSchema, req.body);

  const existing = await userRepository.findOne({ where: { email: data.email } });
  if (existing) {
    throw new HttpError(409, "El email ya existe");
  }

  const user = userRepository.create({
    name: data.name,
    email: data.email,
    passwordHash: data.password,
    role: "author"
  });

  await userRepository.save(user);

  const token = signToken({ userId: user.id, role: user.role });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const data = validateSchema<{ email: string; password: string }>(loginSchema, req.body);

  const user = await userRepository.findOne({ where: { email: data.email } });
  if (!user) {
    throw new HttpError(401, "Credenciales invalidas");
  }

  const isValid = await user.comparePassword(data.password);
  if (!isValid) {
    throw new HttpError(401, "Credenciales invalidas");
  }

  const token = signToken({ userId: user.id, role: user.role });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};
