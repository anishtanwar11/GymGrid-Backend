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
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://gymgrid.netlify.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
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
// app.use(session({
//   secret: 'your-secret-key', // Specify a secret key for session encryption
//   resave: false,
//   saveUninitialized: false
// }));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true } // Set secure cookie if using HTTPS
  })
);

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/exercise", exerciseRouter);

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("GYM server served on http://localhost:" + port);
});
