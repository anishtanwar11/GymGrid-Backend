import express from 'express';
import { CreateExercise } from '../controllers/exercise.js';

const  router = express.Router();

// Router for create new exercise
router.post('/new-exercise', CreateExercise);

export default router