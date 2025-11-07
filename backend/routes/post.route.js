import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  uploadAuth,
  featurePost,
} from "../controllers/post.controller.js";
import increaseVisit from "../middlewares/increaseVisit.js";

const router = express.Router();

// Ordem importa para não conflitar com rotas dinâmicas
router.get("/upload-auth", uploadAuth);

router.get("/", getPosts);
router.get("/:slug", increaseVisit, getPost);

router.post("/", createPost);

// garantir que rota fixa venha antes da dinâmica
router.patch("/feature", featurePost);
router.patch("/:id", updatePost);

router.delete("/:id", deletePost);

export default router;
