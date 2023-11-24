import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  createJobController,
  deleteJobController,
  getJobController,
  jobStatsController,
  updateJobController,
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/create-job", userAuth, createJobController);
router.get("/get-jobs", userAuth, getJobController);
router.patch("/update-job/:id", userAuth, updateJobController);
router.delete("/delete-job/:id", userAuth, deleteJobController);
router.get("/job-stats", userAuth, jobStatsController);

export default router;
