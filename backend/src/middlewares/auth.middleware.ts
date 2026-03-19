import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { HttpError } from "../utils/http-error";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Token no proporcionado");
  }

  const token = authHeader.split(" ")[1];
  req.user = verifyToken(token);
  next();
};

export const adminOnly = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    throw new HttpError(403, "No autorizado");
  }
  next();
};
