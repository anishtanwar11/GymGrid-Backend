import dotenv from 'dotenv'
dotenv.config();

import jwt from 'jsonwebtoken';
import User from '../models/Users.model.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
// import {v2 as cloudinary} from 'cloudinary';

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

//USER SING UP
// export const signup = async (req, res) => {
//     const { firstName, lastName , userName, email, password } = req.body;
//     const file = req.files.userImg;

//     cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
//         console.log(result);
//         const userImg = result.url;
//         const userImgPublicId = result.public_id;
//         try {
//             // Check username exist or not
//             const existUsername = await User.findOne({ userName });
//             if(existUsername) return res.status(400).json({message: "Username alreadu exist"});
//             // Check email exist or not
//             const existingUser = await User.findOne({ email });
//             if (existingUser) return res.status(400).json({ message: 'User already exists' });
//             // Hash the password
//             const hashedPassword = await bcrypt.hash(password, 10);
//             // Create new user
//             const newUser = new User({ firstName, lastName, userName, email, password: hashedPassword, userImg, userImgPublicId });
//             await newUser.save();
//             res.status(201).json({ message: 'User created successfully' });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     })
   
// };

// Router for update user details
export const updateProfile = async (req, res) => {
    const userId = req.userId;
    const userName = req.params.userName;
    const user = await User.findById(userId);
    const updateFeildes = req.body;
    const userImgPublicId = user.userImgPublicId;
    const file = req.files && req.files.userImg;
    try {
        let userImg = updateFeildes.userImg;
        let newUserImgPublicId = updateFeildes.userImgPublicId;
        if(file){
            const result = await cloudinary.uploader.upload(file.tempFilePath);
            console.log(result);

            if(userImgPublicId){
                await cloudinary.uploader.destroy(userImgPublicId);
            }
            userImg = result.url;
            newUserImgPublicId = result.public_id;
        }
        const updateUser = await User.findByIdAndUpdate(userId, {...updateFeildes, userImg, userImgPublicId: newUserImgPublicId} ,{new: true});
        if (!updateUser) return res.status(404).json({message:"User not found"});

        res.status(200).json(updateUser);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

// Route for delete existing user
export const deleteUser = async (req,res)=>{
    const userId = req.userId;
    if(userId){
        await User.findByIdAndDelete(userId);
        res.status(200).json({message:"User Deleted successfuly"});
    } else {
        res.status(400).json({message:"User Not exist"});
    }
}
//USER LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }
        console.log('Is Match:', isMatch);

        // Create JWT token
        const token = jwt.sign({
             userId: user._id,
             userName: user.userName
            }, 'your_secret_key', { expiresIn: '24h' });

        console.log("token:", token);
        // Set cookie with token
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration

        // If credentials are valid, return success message or token
        return res.status(200).send({
             message: 'Login successful...!',
             userId : user._id,
             userName: user.userName,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//USER PROFILE
export const getUserProfile = async (req, res) => {
    const userId = req.userId;
    const username = req.userName;
    try {
        const user = await User.findOne({userName: username});
        if (!user) return res.status(404).json({ error: "user not exist" });

        return res.status(200).json(user); // Return user profile data
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

//get all users
export const getAllUsers = async (req, res) => {
    const  users = await User.find();
    if(!users){
        return res.status(404).json({message:"Users not exist"})
    }else{
        res.status(200).json(users);
    }
}
//FORGOT PASSWORD
//ogvo imps wuli jhsk
export const forgotPassword = async (req, res) => {
    const { email } = req.body; 
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not exist!' });
        }
        const token = jwt.sign({id: user._id}, 'your_secret_key', {expiresIn: '5m'} )

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.AUTH_MAIL,
              pass: process.env.AUTH_PASS
            }
          });
          
          var mailOptions = {
            from: process.env.AUTH_MAIL,
            to: email,
            subject: 'Reset Password',
            text: `https://gymgrid.netlify.app/resetPassword/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              return res.json({message: "error sending email" });
            } else {
                return res.json({status: true, message: 'Email sent'});
            }
          });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//RESET PASSWORD
export const  resetPassword = async (req, res) => {
    const {token} = req.params;
    const {password} =req.body;
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        const id =  decoded.id;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate({_id: id} ,{ password : hashedPassword})
        return res.json({status: true, message:"Updated password"})
    } catch (error) {
        return res.json("Invalid token or password");
    }

};

// VERIFY USER MIDDLEWIRE
export const verify = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token ){
            return res.json({status: false, message: 'No token provided'});
        }
        const decoded = await jwt.verify(token, 'your_secret_key');
        next()
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Failed to authenticate token' });
    }
};
export const verifyUser = (req, res) => {
    return res.json({status: true, message: "Verified user!"});
}

//USER SIGN OUT
export const signout =  (req, res) => { 
    res.clearCookie('token')
    return res.json({status: true})
};

