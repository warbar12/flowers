import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRouter from "./routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_DB_CONECT;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("DB connected successfully"))
  .catch((error) => console.error("DB connection error:", error));

app.use(express.json());

// Подключение маршрута для администраторов
app.use("/admin", adminRouter);

app.listen(PORT, (error) => {
  if (error) {
    console.error("Server Error:", error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
