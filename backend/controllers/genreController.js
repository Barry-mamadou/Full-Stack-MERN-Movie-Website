import Genre from "../models/genre.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import genre from "../models/genre.js";

const createGenreController = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.json({ error: "Name is required" });
  }

  const existingName = await Genre.findOne({ name });

  if (existingName) {
    return res.json({ error: "Existing genre" });
  }
  const genre = await new Genre({ name }).save();
  res.json({ genre });
});

const updateGenreControler = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const genre = await Genre.findOne({ _id: id });

  if (!genre) {
    return res.status(404).json({ error: "Genre not found" });
  }
  genre.name = name;

  const updatedGenre = await genre.save();

  res.json(updatedGenre);
});

const removeGenreController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const removed = await Genre.findByIdAndDelete(id);

  if (!removed) {
    return res.status(404).json({ error: "Genre not found" });
  }

  res.json(removed);
});

const getAllGenres = asyncHandler(async (req, res) => {
  const allGenres = await Genre.find({});

  if (allGenres.length === 0) {
    return res.status(404).json({ error: "No genres listed Yet" });
  }

  res.json(allGenres);
});

// const getGenre = asyncHandler(async (req, res) => {
//   const genre = await Genre.findOne({ _id: req.params.id });

//   if (!genre) {
//     return res
//       .status(404)
//       .json({ error: "This specific genre does not exist" });
//   }
//   res.json(genre);
// });

export {
  createGenreController,
  updateGenreControler,
  removeGenreController,
  getAllGenres,
  // getGenre,
};
