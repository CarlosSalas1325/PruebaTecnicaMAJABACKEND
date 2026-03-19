import { Request, Response } from "express";
import { AppDataSource } from "../../config/data-source";
import { Category } from "./category.entity";
import { HttpError } from "../../utils/http-error";
import { validateSchema } from "../../utils/validation";
import { categoryCreateSchema, categoryUpdateSchema } from "./categories.schemas";

const categoryRepository = AppDataSource.getRepository(Category);

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const data = validateSchema<{ name: string; description?: string }>(categoryCreateSchema, req.body);

  const exists = await categoryRepository.findOne({ where: { name: data.name } });
  if (exists) {
    throw new HttpError(409, "La categoria ya existe");
  }

  const category = categoryRepository.create(data);
  await categoryRepository.save(category);

  res.status(201).json(category);
};

export const listCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await categoryRepository.find({ order: { name: "ASC" } });
  res.json(categories);
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = validateSchema<{ name?: string; description?: string }>(categoryUpdateSchema, req.body);

  const category = await categoryRepository.findOne({ where: { id } });
  if (!category) {
    throw new HttpError(404, "Categoria no encontrada");
  }

  categoryRepository.merge(category, data);
  await categoryRepository.save(category);
  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const category = await categoryRepository.findOne({ where: { id } });

  if (!category) {
    throw new HttpError(404, "Categoria no encontrada");
  }

  await categoryRepository.remove(category);
  res.status(204).send();
};
