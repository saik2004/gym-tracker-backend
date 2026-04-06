import Workout from "../models/Workout.js";

// =========================
// 🧠 HELPER → CLEAN WEEK
// =========================
const normalizeWeek = (week) => {
  if (!week) return null;

  // handles: "week2", "Week 2", "2"
  const num = Number(String(week).replace(/[^0-9]/g, ""));
  return isNaN(num) ? null : num;
};

// =========================
// ✅ CREATE WORKOUT
// =========================
export const createWorkout = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { date, week, splitType, exercises, cardio } = req.body;

    // 🔥 FIND EXISTING WORKOUT (same day + split)
    const existingWorkout = await Workout.findOne({
      userId,
      date,
      week,
      splitType,
    });

    if (existingWorkout) {
      // ✅ MERGE EXERCISES
      if (exercises && exercises.length > 0) {
        existingWorkout.exercises.push(...exercises);
      }

      // ✅ UPDATE CARDIO
      if (splitType === "Cardio" && cardio) {
        existingWorkout.cardio = cardio;
      }

      await existingWorkout.save();

      return res.json(existingWorkout);
    }

    // 🆕 CREATE NEW IF NOT EXIST
    const workout = await Workout.create({
      userId,
      date,
      week,
      splitType,
      exercises,
      cardio,
    });

    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// ✅ GET ALL WORKOUTS
// =========================
export const getWorkouts = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const workouts = await Workout.find({ userId }).sort({
      createdAt: -1,
    });

    res.json(workouts);
  } catch (err) {
    console.log("FETCH ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// =========================
// ✅ GET BY WEEK (FIXED)
// =========================
export const getByWeek = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // 🔥 FIX HERE ALSO
    const cleanWeek = normalizeWeek(req.params.week);

    const workouts = await Workout.find({
      week: cleanWeek,
      userId,
    });

    res.json(workouts);
  } catch (err) {
    console.log("WEEK ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};