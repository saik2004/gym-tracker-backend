import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    date: String,

    // ✅ Week as number
    week: Number,

    // ✅ Split type
    splitType: {
      type: String,
      default: "No Split",
    },

    // ✅ User reference
    userId: String,

    // 💪 Strength workouts
    exercises: [
      {
        name: String,
        sets: [
          {
            reps: Number,
            weight: Number,
          },
        ],
        intensity: {
          type: String,
          default: "Moderate",
        },
      },
    ],

    // 🏃 Cardio workouts
    cardio: {
      duration: {
        type: Number,
        default: 0, // minutes
      },
      distance: {
        type: Number,
        default: 0, // km
      },
      calories: {
        type: Number,
        default: 0, // 🔥 ADD THIS
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Workout", workoutSchema);