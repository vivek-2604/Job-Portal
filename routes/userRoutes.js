import express from "express";
import userAuth  from "../middleware/authMiddleware.js";
import { updateUser } from "../controllers/userController.js";

const router = express.Router();

router.put("/update-user", userAuth, updateUser);

export default router;
