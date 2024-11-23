import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const port = process.env.PORT;
import connectDB from "./config/mongooseDB.js";

dotenv.config();

connectDB();

const App = express();

App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(cookieParser());

App.use("/api/v1/users", userRoutes);
App.use("/api/v1/genres", genreRoutes);
App.use("/api/v1/movies", movieRoutes);
App.use("/api/v1/uploads", uploadRoutes);

const __dirname = path.resolve();
App.use("/uploads", express.static(path.join(__dirname + "/uploads")));

App.listen(port, () => {
  console.log(`Server is app on ${port}`);
});
