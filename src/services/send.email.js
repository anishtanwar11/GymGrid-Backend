import dotenv from "dotenv";
dotenv.config();

import User from "../models/Users.model.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { generateOtp } from "./otp.generator.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//USER SING UP

// Route for Send OTP to User Email
export const signUpWithOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const userEmail = await User.findOne({ email });
    if (userEmail) return res.status(409).json("Email already in use");

    const OTP = generateOtp();
    console.log("OTP -", OTP);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_MAIL,
        pass: process.env.AUTH_PASS,
      },
    });

    var mailOptions = {
      from: process.env.AUTH_MAIL,
      to: email,
      subject: "GymGrid send you an email for OTP verification",
      text: `Your OPT is: ${OTP}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        req.session.OTP = OTP;
        req.session.email = email;

        console.log("OPT ---", req.session.OTP);
        console.log("Email sent: " + info.response);
        return res.status(200).json({ message: "OTP sent to your email" });
      }
    });
  } catch (error) {
    console.error("Error signing up with OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Route for Verify OTP
export const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  try {
    const { OTP } = req.session; // Retrieve OTP and email from the session
    if (!OTP) {
      return res.status(400).json({ message: "OTP not found in session" });
    }
    // Check if the provided OTP matches the OTP stored in the session
    if (OTP === otp) {
      // Clear the OTP from the session after successful verification
      const secret = 'your-secret-key';
      req.session.secret = secret;
      delete req.session.OTP;
      return res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Route for Create User Account
export const createUserProfile = async (req, res) => {
  const { firstName, lastName, userName, password } = req.body;
  const file = req.files.userImg;
  try {
    const { email , secret } = req.session;
    if (!email || !secret )
      return res.status(400).json({ message: "Email or Secret not found in session!" });

    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      console.log(result);
      const userImg = result.url;
      const userImgPublicId = result.public_id;
      try {
        // Check username exist or not
        const existUsername = await User.findOne({ userName });
        if (existUsername)
          return res.status(400).json({ message: "Username alreadu exist" });
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({
          firstName,
          lastName,
          userName,
          email,
          password: hashedPassword,
          userImg,
          userImgPublicId,
        });
        await newUser.save();
        delete req.session.email;
        delete req.session.secret;
        res.status(201).json({ message: "User created successfully" });
      } catch (error) {
        console.error(error);
        res.status(505).json({ message: "Internal server error" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(506).json({ message: "Internal server error" });
  }
};