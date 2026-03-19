import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createComment, deleteComment, listCommentsByPost, updateComment } from "./comments.controller";

const router = Router({ mergeParams: true });

router.get("/", listCommentsByPost);
router.post("/", authMiddleware, createComment);
router.patch("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
