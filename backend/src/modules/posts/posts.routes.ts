import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createPost, deletePost, getPostById, listPosts, updatePost } from "./posts.controller";
import commentsRoutes from "../comments/comments.routes";

const router = Router();

router.get("/", listPosts);
router.get("/:id", getPostById);
router.post("/", authMiddleware, createPost);
router.patch("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

router.use("/:postId/comments", commentsRoutes);

export default router;
