import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../modules/user.js";
import { validationResult } from "express-validator";
import { dataValidator } from "../validator/auth.js";
import { ADMIN_USER_ROLES } from "../constants/adminUser.js";

const adminRouter = express.Router();

// Логин администратора
adminRouter.get("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Incorrect login or password!" });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );
    if (!isValidPassword) {
      return res.status(403).json({ message: "Incorrect login or password!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {   
    res.status(500).json({ message: "Login failed. Try again later." });
  }
});

// Регистрация администратора
adminRouter.post("/registration", dataValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      passwordHash: hash,
      role: req.body.role || ADMIN_USER_ROLES.user,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.SECRET);
    const { passwordHash, ...userData } = savedUser._doc;

    res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({ message: "Registration failed. Try again later." });
  }
});

export default adminRouter;
