import mongoose from "mongoose";


const worklogSchema = new mongoose.Schema({
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

   project: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Project",
        
    },
    tasksWorkedOn:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task",

    },],
    workSummary:{
         type:String,
        required:true,
    },
    blockers:{
        type:String,
        default:"",
    },
     hoursWorked:{
        type:Number,
        default:0,
    },
    meetingsCount:{
        type:Number,
        default:0,
    },
    productivityConfidence:{
        type:Number,
        default:0,
    },
    fakeReportRisk:{
     type:String,
     enum:["low","medium","high"],
     default:"low",
    },
    ailnsight:{
        type:String,
        default:"",
    },
   
},
    {
        timestamps:true,
    }
);
const WorkLog = mongoose.model("WorkLog",worklogSchema);
export default WorkLog;