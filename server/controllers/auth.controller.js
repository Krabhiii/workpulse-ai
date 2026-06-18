import bcrypt from "bcryptjs";
import User from "../models/user.model.js"
import genToken from "../config/token.js";
const cookieOptions = {
    httpOnly:true,
    secure:false,
    samesite:"lax",
    maxAge:7*24*60*60*1000,
};
//Register
export const register = async(req,res)=>{
    try {
        const{name,email,password,role} = req.body;
        if(!name || !email|| !password){
            return res.status(400).json({message:"Name,email and password are required.",});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role:role||"employee"
        });
        const token = genToken(user._id);
        res.cookie("token",token,cookieOptions);

        return res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            department:user.department,
            designation:user.designation,
            avatar:user.avatar,
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
        
    }
}
//Login
export const login = async(req,res)=>{
    try {
        const{email,password} = req.body;
        if(!email || !password){
        return res.status(400).json({message:"email and password are required.",});
        }
        const user = await User.findOne({email});
        if(!user || !user.password){
             return res.status(400).json({message:"Invalid email or password.",});
        }
        const isMatch  = await bcrypt.compare(password,user.password);
        if(!isMatch){
             return res.status(400).json({message:"Invalid email or password.",});
        }
const token = genToken(user._id);
  res.cookie("token",token,cookieOptions);
   return res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            department:user.department,
            designation:user.designation,
            avatar:user.avatar,
        })
        }
    catch (error) {
        return res.status(500).json({message:error.message});
        
    }
};
// Google Auth

export const googleAuth = async(req,res)=>{
try {
      const{name,email,avatar,role} = req.body;
    
      if(!email){
          return res.status(400).json({message:"email is required.",});
      }
      let user = await User.findOne({email});
      if(!user){
       user = await User.create({
  name,
  email,
  avatar,
  googleAuth: true,
  role: role || "employee",
});
      }
      const token = genToken(user._id);
        res.cookie("token",token,cookieOptions);

        return res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            department:user.department,
            designation:user.designation,
            avatar:user.avatar,
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
        
    }
};
//Current user 
export const currentUser = async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({message:"User not found.",});
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};
//Logout
export const logout = async(req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure:false,
            samesite:"lax"
        });
        return res.status(200).json({message:"successfully logout"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};