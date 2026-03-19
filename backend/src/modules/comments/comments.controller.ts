import { Request, Response } from "express";
import { AppDataSource } from "../../config/data-source";
import { Comment } from "./comment.entity";
import { Post } from "../posts/post.entity";
import { User } from "../users/user.entity";
import { HttpError } from "../../utils/http-error";
import { validateSchema } from "../../utils/validation";
import { commentCreateSchema, commentUpdateSchema } from "./comments.schemas";

const commentRepository = AppDataSource.getRepository(Comment);
const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export const listCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  const comments = await commentRepository.find({
    where: { post: { id: req.params.postId } },
    relations: ["author"],
    order: { createdAt: "DESC" }
  });

  res.json(comments);
};

export const createComment = async (req: Request, res: Response): Promise<void> => {
  const { content } = validateSchema<{ content: string }>(commentCreateSchema, req.body);

  const [post, user] = await Promise.all([
    postRepository.findOne({ where: { id: req.params.postId } }),
    userRepository.findOne({ where: { id: req.user!.userId } })
  ]);

  if (!post) {
    throw new HttpError(404, "Post no encontrado");
  }

  if (!user) {
    throw new HttpError(401, "Usuario no valido");
  }

  const comment = commentRepository.create({ content, post, author: user });
  await commentRepository.save(comment);

  const saved = await commentRepository.findOne({ where: { id: comment.id }, relations: ["author"] });
  res.status(201).json(saved);
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
  const { content } = validateSchema<{ content?: string }>(commentUpdateSchema, req.body);

  const comment = await commentRepository.findOne({ where: { id: req.params.commentId }, relations: ["author"] });
  if (!comment) {
    throw new HttpError(404, "Comentario no encontrado");
  }

  const isOwner = comment.author.id === req.user!.userId;
  const isAdmin = req.user!.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new HttpError(403, "No autorizado para editar este comentario");
  }

  comment.content = content ?? comment.content;
  await commentRepository.save(comment);
  res.json(comment);
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const comment = await commentRepository.findOne({ where: { id: req.params.commentId }, relations: ["author"] });
  if (!comment) {
    throw new HttpError(404, "Comentario no encontrado");
  }

  const isOwner = comment.author.id === req.user!.userId;
  const isAdmin = req.user!.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new HttpError(403, "No autorizado para eliminar este comentario");
  }

  await commentRepository.remove(comment);
  res.status(204).send();
};
