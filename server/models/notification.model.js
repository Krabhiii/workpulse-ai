import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        enum:[
            "task-assigned",
            "task-completed",
            "worklog-submitted",
            "project-added",
            "risk-alert",
            "general",
        ],
        default:"general",
    },
    isRead:{
        type:Boolean,
        default:false,
    },
},
{
    timestamps:true,
},
);
const Notification = mongoose.model("Notification",notificationSchema);
export default Notification;