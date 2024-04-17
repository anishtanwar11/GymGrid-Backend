import dotenv  from 'dotenv';
dotenv.config();

// Database connection
import { dbConnect } from './src/configs/database.config.js';
dbConnect();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload  from 'express-fileupload';
import session from 'express-session';

import userRouter from './src/routes/user.router.js'
import exerciseRouter from './src/routes/excersie.router.js'

const app = express();

// Middleware
app.use(fileUpload({
  useTempFiles:true
}))
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["https://gymgrid.netlify.app"],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
}));
app.use(session({
  secret: 'your-secret-key', // Specify a secret key for session encryption
  resave: false,
  saveUninitialized: false
}));
// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/exercise", exerciseRouter);

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("GYM server served on http://localhost:" + port);
});
