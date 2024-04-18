import express  from 'express';
import { verifyTokenByUserId, verifyTokenByUserName } from '../middleware/user.middleware.js';
import { login, signout, 
        forgotPassword, resetPassword, 
        verifyUser, verify, 
        getAllUsers, getUserProfile, 
        updateProfile, deleteUser} from '../controllers/user.js';

import { signUpWithOTP, verifyOTP , createUserProfile} from '../services/send.email.js';        

const router = express.Router();

// Router for send otp to user email
router.post('/send-otp', signUpWithOTP);

//Router for verify otp
router.post('/verify-otp', verifyOTP)

// Route for user signup
router.post('/signup', createUserProfile);

// Route for user login
router.post('/login', login);

//Get all users
router.get("/allUsers", getAllUsers );

// Route for forgot password
router.post('/forgot-Password', forgotPassword);

// Route for reset password
router.post('/reset-Password/:token', resetPassword);

// Verify User middleware
router.get('/verify', verifyTokenByUserName, verifyUser);

//USER PROFILE, verifyToken middleware
router.get('/profile/:userName', verifyTokenByUserName, getUserProfile)

// Route for update  profile
router.put('/updateProfile/:userName', verifyTokenByUserId, updateProfile)

//Route for delete existing user
router.delete('/:userName', verifyTokenByUserId ,deleteUser)

// Route for user signout
router.get('/signout', signout);

// module.exports = router;
export default router
