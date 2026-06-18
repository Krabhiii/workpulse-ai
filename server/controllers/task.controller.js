import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import Activity from "../models/activity.model.js";
import Notification from "../models/notification.model.js"

//Create task

export const createTask = async(req,res)=>{
    try {
        const{title,description,project,assignedTo,priority,deadline,estimatedHours} = req.body;
        if(!title || !project || !assignedTo){
            return res.status(400).json({message:"Title,Project and assigned emploee are required"});
        }
        const existingProject = await Project.findById(project);
        if(!existingProject){
            return res.status(404).json({message:"project not found"});
        }
        if(existingProject.manager.toString() !== req.userId.toString()){
         return res.status(403).json({message:"Only project manager can create task"});
        }
        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            createdBy:req.userId,
            priority,
            deadline,
            estimatedHours,
        });
        await Activity.create({
  user: req.userId,
  project: task.project,
  task: task._id,
  type: "task-created",
  message: `Created task "${task.title}"`,
});
await Notification.create({
  user:assignedTo,
  title:"New task Assigned",
  message:`You have been assigned to a new task ${task.title}`,
  type:"task-assigned",
})
        return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({message:error.message});  
    }
}
//get all task (user)
export const getTasks = async(req,res)=>{
    try {
        const tasks = await Task.find({
            $or:[
                {createdBy:req.userId},
                {assignedTo:req.userId},
            ],
        })
        .populate("project","little status priority")
        .populate("assignedTo","name email role")
        .populate("createdBy","name email role")
        .sort({createdAt:-1});
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({message:error.message});  
    }
}
//get task by project
export const getProjectTasks = async(req,res) =>{
    try {
        const {projectId} = req.params;
        const tasks = await Task.find({project:projectId})
         .populate("assignedTo","name email role")
        .populate("createdBy","name email role")
        .sort({createdAt:-1});
          return res.status(200).json(tasks);
    } catch (error) {
         return res.status(500).json({message:error.message});  
    }
}
// get my assigned task
export const getMyTasks = async(req,res) =>{
    try {
        const tasks = await Task.find({
            assignedTo:req.userId,
        })
        .populate("project","title status priority")
            .sort({createdAt:-1});
              return res.status(200).json(tasks);
    } catch (error) {
         return res.status(500).json({message:error.message});  
    }
} 
//update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "todo",
      "in-progress",
      "completed",
      "blocked",
      "overdue",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const isAssignedUser =
      task.assignedTo.toString() === req.userId.toString();

    const isCreator =
      task.createdBy.toString() === req.userId.toString();

    if (!isAssignedUser && !isCreator) {
      return res.status(403).json({
        message: "You are not allowed to update this task",
      });
    }

    task.status = status;

    if (status === "completed") {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();
    if(status === "completed"){
      await Notification.create({
        user:task.createdBy,
        title:"Task-completed",
        message:`Task "${task.title}"has been completed`,
        type:"task-completed",
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.log("UPDATE TASK STATUS ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};