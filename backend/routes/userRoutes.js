import express from 'express'
import {getUserProfile,loginUser, registerUser} from '../controllers/userControllers.js'
import { protect } from '../middlewares/authMiddleware.js';
const userRouter = express.Router();
userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
// protected route as token will be required
userRouter.get('/profile',protect,getUserProfile);

export default userRouter;