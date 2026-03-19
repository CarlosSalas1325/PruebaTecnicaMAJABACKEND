import { Request, Response } from "express";
import { AppDataSource } from "../../config/data-source";
import { User } from "./user.entity";
import { HttpError } from "../../utils/http-error";

const userRepository = AppDataSource.getRepository(User);

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await userRepository.findOne({ where: { id: req.user!.userId } });

  if (!user) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
};
