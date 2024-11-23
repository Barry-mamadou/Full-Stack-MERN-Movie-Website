import express from "express";
import {
  authMiddleWare,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
import {
  createUser,
  loginUser,
  logOutCurrentUser,
  getAllUsers,
  getUserProfile,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authMiddleWare, authorizeAdmin, getAllUsers);
router.post("/login", loginUser);
router.post("/logOut", logOutCurrentUser);

router
  .route("/profile")
  .get(authMiddleWare, getUserProfile)
  .put(authMiddleWare, updateUser);

export default router;
