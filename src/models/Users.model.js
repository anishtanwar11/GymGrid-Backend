import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    }, 
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      unique: true
    },
    email: { 
      type: String, 
      unique: true 
    },
    otp:{
      type: String
    },
    userImg: {
      type: String,
    },
    userImgPublicId: {
      type: String,
    },
    password: {
      type: String
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    userBio: {
      type: String
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;
