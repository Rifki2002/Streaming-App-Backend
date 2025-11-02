import express from "express";
import {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.post("/", addMovie);
router.patch("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
