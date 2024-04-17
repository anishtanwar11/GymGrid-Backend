import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  set: {
    type: Number,
    required: true,
  },
  weight: {
    type: String,
  },
  rep: {
    type: Number,
  },
  category: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
},
{
  timestamps: true,
}
);

const Exercise = mongoose.model("Exercise", ExerciseSchema);

export default Exercise;
