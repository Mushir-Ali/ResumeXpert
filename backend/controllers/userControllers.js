import userModel from "../models/userModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

//  generate a token jwt
const generateToken = (userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:'7d'});
}


export const registerUser = async(req,res)=>{
    try{
        // sign up method
        const {name,email,password} = req.body;
        // check if user is already present
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"user already exist"});
        }
        if(password.length<8){
            return res.status(400).json({success:false,message : "password must be at least of 8 characters"})
        }
        // Hashing password 
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);

        // create a user
        const user = await User.create({
            name,
            email,
            password: hashedpassword
        })
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    }
    catch(error){
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
}

// login function
export const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"invalid email or password"})
        }

        // compare password 
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"invalid email or password"})
        }
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    }
    catch(error){
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
}

// getuser profile function
export const getUserProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        res.json(user);
    }
    catch(error){
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
}