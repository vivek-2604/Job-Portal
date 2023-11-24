import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
const router = express.Router();

router.post("/register", limiter, registerController);
router.post("/login", limiter, loginController);

export default router;
