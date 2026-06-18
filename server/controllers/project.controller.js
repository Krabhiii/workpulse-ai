import Project from "../models/project.model.js";
import Activity from "../models/activity.model.js";
import Notification from "../models/notification.model.js"

export const createProjct = async(req,res)=>{
    try {
        const {title,description,deadline,priority,teamMembers} = req.body;
        if(!title){
            return res.status(400).json({message:" Project title required"});
        }
        const project = await Project.create({
            title,
            description,
            deadline,
            priority,
            teamMembers,
            manager:req.userId,

        });
        await Activity.create({
  user: req.userId,
  project: project._id,
  type: "project-created",
  message: `Created project "${project.title}"`,
});
        return res.status(201).json({project})
        
    } catch (error) {
        return res.status(500).json({message:error.message});
        
    }
}
//Getall projects
export const getProjects = async(req,res)=>{
    try {
        const projects = await Project.find({
            $or:[
                {manager:req.userId},
                {teamMembers:req.userId}
            ],
        })
        .populate("manager","name email")
        .populate("teamMembers","name email role")
        .sort({createdAt:-1});
        return res.status(200).json(projects);
    } catch (error) {
         return res.status(500).json({message:error.message});
    }
}

//Get Single Project

export const getSingleProject = async(req,res)=>{
    try {
        const project = await Project.findById(req.params.id)
       .populate("manager","name email")
        .populate("teamMembers","name email role")
        if(!project){
            return res.status(404).json({message:"project not found"});
        }
        return res.status(200).json(project)
    } catch (error) {
           return res.status(500).json({message:error.message});
    }
}
export const addTeamMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
      return res.status(400).json({
        message: "Project ID and User ID are required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.manager.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "Only project manager can add members",
      });
    }

    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({
        message: "User already added to project",
      });
    }

    project.teamMembers.push(userId);

    await project.save();
    await Notification.create({
  user: userId,
  title: "Added to Project",
  message: `You have been added to project "${project.title}".`,
  type: "project-added",
});
    await Activity.create({
  user: req.userId,
  project: project._id,
  type: "member-added",
  message: `Added a new team member to "${project.title}"`,
});

    const updatedProject = await Project.findById(projectId)
      .populate("manager", "name email")
      .populate("teamMembers", "name email role");

    return res.status(200).json(updatedProject);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};