import Exercise from "../models/Exercise.model.js";

export const CreateExercise = async (req, res) => {
    const {title, name, set, weight, rep, category} = req.body;

    if(!title || !name || !set || !weight || !rep || !category) {
        res.status(400);
        throw new Error("Please Fill Maindatory Fields!");
        return;
    } else {
        const exercise = new Exercise({user: req.user._id, title, name, set, weight, rep, category });

        const createExercise = await exercise.save();

        res.status(201).json("Exercise saved successfully!");
    }
};