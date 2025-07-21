import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://mushirmahdi123:mushir123@cluster0.16tvgip.mongodb.net/RESUME')
    .then(()=>console.log('DB Connected'));
}