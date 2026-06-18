import Activity from "../models/activity.model.js";
import Project from "../models/project.model.js";

export const getActivities = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { manager: req.userId },
        { teamMembers: req.userId },
      ],
    }).select("_id");

    const projectIds = projects.map((p) => p._id);

    const activities = await Activity.find({
      $or: [
        { user: req.userId },
        { project: { $in: projectIds } },
      ],
    })
      .populate("user", "name email role")
      .populate("project", "title")
      .populate("task", "title status")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json(activities);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};