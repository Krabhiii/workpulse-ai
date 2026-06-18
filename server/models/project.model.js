import mongoose  from "mongoose";

const projectSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:"",
    },
    manager:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    teamMembers:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"User",
        },
    ],
    dedaline:{
        type:Date,
    },
    status:{
        type:String,
        enum:["planning","active","completed","delayed",],
        default:"planning"
    },
    priority:{
        type:String,
        enum:["low","medium","high"],
        default:"medium",
    },
},
    {
        timestamps:true,
    }
);
const Project = mongoose.model("Project",projectSchema);
export default Project;