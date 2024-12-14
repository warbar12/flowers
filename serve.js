import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "./module/User.js";
import adminRouter from "./routs/admin.js";
import dotenv from "dotenv";
import { dataValidator } from "./validator/auth.js";
import { validationResult } from "express-validator";
import { ADMIN_USER_ROLES } from "./const/adminUser.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB_CONECT)
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.error("DB Connection Error:", err));

const appFlowers = express();

appFlowers.use(express.json());
appFlowers.use("/admin", adminRouter);

// Login route
appFlowers.get("/admin/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({
        message: "Неверный логин или пароль!",
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);

    if (!isValidPass) {
      return res.status(404).json({
        message: "Неверный логин или пароль!",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось авторизоваться!",
    });
  }
});

// Registration route
appFlowers.post("/admin/geristration", dataValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new User({
      username: req.body.username,
      passwordHash: hash,
      role: req.body.role || ADMIN_USER_ROLES.user,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться!",
    });
  }
});

// Server listening
appFlowers.listen(process.env.PORT, (error) => {
  if (error) {
    return console.error("Server Error:", error);
  }
 });
