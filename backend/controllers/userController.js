import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

// login user
const loginUser = async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message:"USer doesn't exist"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const token = createToken(user._id)
        res.json({
            success:true,
            token
        })
    }
    catch(error){
        console.log(error)
        res.json({
            success:false,
            message:"Error"
        })

    }
}

//register user
const registerUser = async(req,res)=>{
    const {name,password,email}=req.body;
    try {
        const exists= await userModel.findOne({email})
        if(exists){
            return res.json({
                success:false,
                message:"USer Already exist"
            })
        }
        //validating email format and password
        if(!validator.isEmail(email)){
            return res.json({
                success:false,
                message:"Enter Valid Email"
            })
        }
        if(password.length<8){
            return res.json({
                success:false,
                message:"Enter Strong Password"
            })
        }
        // hashing user password
        const salt= await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt);

        //new user
        const newUSer=new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUSer.save();
        const token= createToken(user._id)
        res.json({
            success:true,
            token
        })

    } catch (error) {
        console.log(error)
        res.json({
            success:"false",
            message:"Error"
        })
    }

}

export {loginUser,registerUser}