import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, password, email, isAdmin } = req.body;

  if (!username || !password || !email) {
    throw new Error("Please fill all the fields");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    isAdmin,
    password: hashPassword,
  });
  await newUser.save();
  generateToken(res, newUser._id);

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (validPassword) {
      generateToken(res, existingUser._id);
      res.status(201).json(existingUser);
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } else {
    res.status(401).json({ message: "User invalid" });
  }
});

const logOutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Successfully logout" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find({});
  res.status(200).json(allUsers);
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userProfile = req.user;
  if (userProfile) {
    res.status(201).json({ userProfile });
  } else {
    res.status(401).json({ message: Error });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = req.user;
  if (updatedUser) {
    updatedUser.username = req.body.username || updatedUser.username;
    updatedUser.email = req.body.email || updatedUser.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updatedUser.password = hashedPassword;
    }
    await updatedUser.save();

    res.status(201).json(updatedUser);
  } else {
    res.status(404);
  }
});

export {
  createUser,
  loginUser,
  logOutCurrentUser,
  getAllUsers,
  getUserProfile,
  updateUser,
};
