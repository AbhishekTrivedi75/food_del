import mongoose from "mongoose";

export const connectDB =async()=>{
    await mongoose.connect('mongodb+srv://abhishektrivedi3064:GGi07o2VA0EX1u4N@cluster0.v7kbohl.mongodb.net/food-del')
    .then(()=>{
        console.log("DB connected")
    })
}