import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import todoRoute from "./routes/todo.route.js";
import userRouter from "./routes/users.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("The database is connected"))
  .catch((err) => console.log("The error is occured", err));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/todo", todoRoute);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`The server is start on the port http://localhost:${port}`);
});
