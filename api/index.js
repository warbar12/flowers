import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRouter from "#routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_DB_CONECT;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("DB connected successfully"))
  .catch((error) => console.error("DB connection error:", error));

app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("welcome from flowers api");
});

app.listen(PORT, (error) => {
  if (error) {
    console.error("Server Error:", error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
