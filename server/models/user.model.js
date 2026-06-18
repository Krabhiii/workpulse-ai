import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
        },
        role:{
            type:String,
            enum:["employee","manager"],
            default:"employee"
        },
        department:{
            type:String,
            default:"",
        },
        jobTitle:{
            type:String,
            default:"",
        },
        isActive:{
            type:Boolean,
            default:true,

        },

designation: {
  type: String,
  default: ""
}
    },
    {
        timestamps:true,
    }
);
const User = mongoose.model("User",userSchema);
export default User;