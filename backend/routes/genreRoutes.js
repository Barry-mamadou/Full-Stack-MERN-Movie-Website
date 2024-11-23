import express from "express";
import {
  authMiddleWare,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

import {
  createGenreController,
  updateGenreControler,
  removeGenreController,
  getAllGenres,
  // getGenre,
} from "../controllers/genreController.js";

const router = express.Router();

router.route("/").post(authMiddleWare, authorizeAdmin, createGenreController);
router
  .route("/:id")
  .put(authMiddleWare, authorizeAdmin, updateGenreControler)
  .delete(authMiddleWare, authorizeAdmin, removeGenreController);
// .get(getGenre);
router.route("/allGenres").get(getAllGenres);
export default router;
