import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import session from 'express-session';


import { dbConnect } from './src/configs/database.config.js';

// Database connection
dbConnect();


import userRouter from './src/routes/user.router.js';

// Initialize dotenv



const app = express();

app.set('trust proxy', 1);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://gymgrid.netlify.app", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Middleware
app.use(fileUpload({
  useTempFiles: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["https://gymgrid.netlify.app", "http://localhost:3000"],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
}));

// Session middleware using RedisStore
app.use(session({ 
  secret: 'your-secret-key', // Specify a secret key for session encryption
  resave: false,
  saveUninitialized: false,
  maxAge: 1000 * 60 * 15,
  cookie:{
    secure: true
       }
}));

// Routes
app.use("/api/v1/user", userRouter);

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("GYM server served on http://localhost:" + port);
});
