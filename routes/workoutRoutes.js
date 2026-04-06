import express from "express";
import {
  createWorkout,
  getWorkouts,
  getByWeek,
} from "../controllers/workoutController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

// 🔥 SINGLE CORRECT ROUTE WITH DEBUG
router.post("/", auth, (req, res, next) => {
  console.log("🔥 POST /workouts HIT");
  next();
}, createWorkout);

router.get("/", auth, getWorkouts);
router.get("/week/:week", auth, getByWeek);

export default router;