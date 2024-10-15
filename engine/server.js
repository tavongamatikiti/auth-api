import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import colors from "colors";
import * as dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/afpi/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`.yellow.bold);
});
