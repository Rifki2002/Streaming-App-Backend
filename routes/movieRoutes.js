import express from "express";
import {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie
} from "../controllers/movieController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllMovies);
router.get("/:id", verifyToken, getMovieById);
router.post("/", verifyToken, addMovie);
router.patch("/:id", verifyToken, updateMovie);
router.delete("/:id", verifyToken, deleteMovie);

export default router;
