import asyncHandler from "../middlewares/asyncHandler.js";
import Movie from "../models/Movie.js";

const createMovie = asyncHandler(async (req, res) => {
  const newMovie = new Movie(req.body);
  const savedMovie = await newMovie.save();
  res.json(savedMovie);
});

const getAllMovies = asyncHandler(async (req, res) => {
  const allMovies = await Movie.find({});
  res.json(allMovies);
});

const getSpecificMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const specificMovie = await Movie.findById({ _id: id });

  if (!specificMovie) {
    res.status(404).json({ message: "Movie not found" });
  }
  res.json(specificMovie);
});

const updateSpecificMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedMovie) {
    res.status(404).json({ message: "Movie not found" });
  }
  res.json(updatedMovie);
});
const movieReviews = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const movie = await Movie.findById(req.params.id);

  if (movie) {
    const alreadyReviewed = movie.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Movie already reviewed");
    }
    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment: comment,
      user: req.user._id,
    };

    movie.reviews.push(review);
    movie.numReviews = movie.reviews.length;
    movie.rating =
      movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
      movie.reviews.length;

    await movie.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Movie not found");
  }
});

const deleteMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedMovie = await Movie.findByIdAndDelete(id);

  if (!deletedMovie) {
    res.status(404).json({ Message: "Movie not found" });
  }

  res.status(201).json({ Message: "Movie deleted successfully" });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { movieId, reviewId } = req.body;

  const movie = await Movie.findById({ _id: movieId });

  if (!movie) {
    res.status(404).json({ Message: "Movie not found" });
  }

  const reviewIndex = movie.reviews.findIndex(
    (index) => index._id.toString() === reviewId
  );

  if (reviewIndex === -1) {
    res.status(404).json({ Message: "Review not found" });
  }
  movie.reviews.splice(reviewIndex, 1);
  movie.numReviews = movie.reviews.length;
  movie.rating =
    movie.numReviews > 0
      ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length
      : 0;
  await movie.save();
  res.status(201).json({ Message: "Review successfully deleted" });
});

const getNewMovies = asyncHandler(async (req, res) => {
  const newMovies = await Movie.find().sort({ createdAt: -1 }).limit(4);
  res.json(newMovies);
});

const getTopMovies = asyncHandler(async (req, res) => {
  const topRatedMovies = await Movie.find().sort({ numReviews: -1 }).limit(4);

  res.json(topRatedMovies);
});

const getRandomMovies = asyncHandler(async (req, res) => {
  const ramdomMovies = await Movie.aggregate([{ $sample: { size: 4 } }]);

  res.json(ramdomMovies);
});

export {
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
};
