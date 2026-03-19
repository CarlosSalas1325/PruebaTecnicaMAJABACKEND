import { Router } from "express";
import { authMiddleware, adminOnly } from "../../middlewares/auth.middleware";
import { createCategory, deleteCategory, listCategories, updateCategory } from "./categories.controller";

const router = Router();

router.get("/", listCategories);
router.post("/", authMiddleware, adminOnly, createCategory);
router.patch("/:id", authMiddleware, adminOnly, updateCategory);
router.delete("/:id", authMiddleware, adminOnly, deleteCategory);

export default router;
