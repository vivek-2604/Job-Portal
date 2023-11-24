import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";

import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import errorHandlingMiddelware from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

dotenv.config();
const app = express();
const port = process.env.PORT || 8001;
connectDB();

app.use(helmet(``));
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to JOB Portal");
});

app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/jobs", jobRoutes);

app.use(errorHandlingMiddelware);

app.listen(port, () => {
  console.log("Server start on Port:", port);
});
