import express from "express";
import {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateSpecificMovie,
  movieReviews,
  deleteMovie,
  deleteReview,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
} from "../controllers/movieController.js";

const router = express.Router();

import {
  authMiddleWare,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router.get("/all-movies", getAllMovies);
router.get("/specific-movie/:id", getSpecificMovie);
router.get("/new-movies", getNewMovies);
router.get("/top-movies", getTopMovies);
router.get("/random-movies", getRandomMovies);

router.post("/:id/review", authMiddleWare, checkId, movieReviews);
router.post("/create-movie", authMiddleWare, authorizeAdmin, createMovie);

router.put(
  "/update-movie/:id",
  authMiddleWare,
  authorizeAdmin,
  updateSpecificMovie
);

router.delete("/delete-movie/:id", authMiddleWare, authorizeAdmin, deleteMovie);
router.delete("/delete-review", authMiddleWare, authorizeAdmin, deleteReview);

export default router;
