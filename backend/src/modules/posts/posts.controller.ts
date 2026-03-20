import { Request, Response } from "express";
import { In } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { Post } from "./post.entity";
import { Category } from "../categories/category.entity";
import { User } from "../users/user.entity";
import { HttpError } from "../../utils/http-error";
import { validateSchema } from "../../utils/validation";
import { postCreateSchema, postUpdateSchema } from "./posts.schemas";

const postRepository = AppDataSource.getRepository(Post);
const categoryRepository = AppDataSource.getRepository(Category);
const userRepository = AppDataSource.getRepository(User);

const parsePagination = (req: Request): { page: number; limit: number; skip: number } => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 10)));
  return { page, limit, skip: (page - 1) * limit };
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const data = validateSchema<{ title: string; content: string; status: "draft" | "published"; categoryIds: string[]; imageUrl?: string }>(
    postCreateSchema,
    req.body
  );

  const user = await userRepository.findOne({ where: { id: req.user!.userId } });
  if (!user) {
    throw new HttpError(401, "Usuario no valido");
  }

  const categories = data.categoryIds.length
    ? await categoryRepository.find({ where: { id: In(data.categoryIds) } })
    : [];

  const post = postRepository.create({
    title: data.title,
    content: data.content,
    status: data.status,
    imageUrl: data.imageUrl,
    author: user,
    categories
  });

  await postRepository.save(post);
  const saved = await postRepository.findOne({ where: { id: post.id }, relations: ["author", "categories"] });
  res.status(201).json(saved);
};

export const listPosts = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req);
  const query = postRepository
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.author", "author")
    .leftJoinAndSelect("post.categories", "categories")
    .orderBy("post.createdAt", (req.query.order as "ASC" | "DESC") ?? "DESC")
    .skip(skip)
    .take(limit);

  if (req.query.search) {
    query.andWhere("(post.title ILIKE :search OR post.content ILIKE :search)", {
      search: `%${String(req.query.search)}%`
    });
  }

  if (req.query.status) {
    query.andWhere("post.status = :status", { status: req.query.status });
  }

  if (req.query.authorId) {
    query.andWhere("author.id = :authorId", { authorId: req.query.authorId });
  }

  if (req.query.categoryId) {
    query.andWhere("categories.id = :categoryId", { categoryId: req.query.categoryId });
  }

  if (req.query.startDate) {
    query.andWhere("post.createdAt >= :startDate", { startDate: req.query.startDate });
  }

  if (req.query.endDate) {
    query.andWhere("post.createdAt <= :endDate", { endDate: req.query.endDate });
  }

  const [items, total] = await query.getManyAndCount();

  res.json({
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  const post = await postRepository.findOne({
    where: { id: req.params.id },
    relations: ["author", "categories", "comments", "comments.author"]
  });

  if (!post) {
    throw new HttpError(404, "Post no encontrado");
  }

  res.json(post);
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  const data = validateSchema<{ title?: string; content?: string; status?: "draft" | "published"; categoryIds?: string[]; imageUrl?: string }>(
    postUpdateSchema,
    req.body
  );

  const post = await postRepository.findOne({ where: { id: req.params.id }, relations: ["author", "categories"] });

  if (!post) {
    throw new HttpError(404, "Post no encontrado");
  }

  const isOwner = post.author.id === req.user!.userId;
  const isAdmin = req.user!.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new HttpError(403, "No autorizado para modificar este post");
  }

  if (data.categoryIds) {
    post.categories = data.categoryIds.length
      ? await categoryRepository.find({ where: { id: In(data.categoryIds) } })
      : [];
  }

  postRepository.merge(post, {
    title: data.title ?? post.title,
    content: data.content ?? post.content,
    status: data.status ?? post.status,
    imageUrl: data.imageUrl !== undefined ? data.imageUrl : post.imageUrl
  });

  await postRepository.save(post);
  res.json(post);
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  const post = await postRepository.findOne({ where: { id: req.params.id }, relations: ["author"] });

  if (!post) {
    throw new HttpError(404, "Post no encontrado");
  }

  const isOwner = post.author.id === req.user!.userId;
  const isAdmin = req.user!.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new HttpError(403, "No autorizado para eliminar este post");
  }

  await postRepository.remove(post);
  res.status(204).send();
};
