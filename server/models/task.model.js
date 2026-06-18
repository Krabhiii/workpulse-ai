import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:"",
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    createdBy:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:["todo","in-progress","completed","blocked","overdue"],
        default:"todo",
    },
     priority:{
        type:String,
        enum:["low","medium","high"],
        default:"medium",
    },
    deadline:{
        type:Date,
    },
    estimatedHours:{
        type:Number,
        default:0,
    },
    completedAt:{
     type:Date,
    }
   
},
    {
        timestamps:true,
    }
);
const Task = mongoose.model("Task",taskSchema);
export default Task;