import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import WorkLog from "../models/worklog.model.js";
import User from "../models/user.model.js";

//Manager Dashboard

export const getManagerDashboard = async(req,res)=>{
    try {
        const managerId = req.userId;
        const projects = await Project.find({manager:managerId});
        const projectIds = projects.map((p)=>p._id);
        const tasks = await Task.find({project:{$in:projectIds},});
        const worklogs = await WorkLog.find({project:{$in:projectIds}})
        const totalProjects = projects.length;
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task)=>task.status === "completed").length;
        const pendingTasks = tasks.filter((task)=>task.status === "todo" || task.status === "in-progress").length;
        const blockedTasks = tasks.filter((task)=>task.status === "blocked").length;
        const overdueTasks = tasks.filter((task)=>{
            
            return(
              task.deadline && new Date(task.deadline)<new Date() && task.status !== "completed");
        }).length;
        const highRiskReports = worklogs.filter((log)=>log.fakeReportRisk === "high").length;
        const avgConfidence= worklogs.length>0?worklogs.reduce((sum,log)=>sum +(log.productivityConfidence || 0),0)/worklogs.length:0;
        return res.status(200).json({
            totalProjects,
            totalTasks,
            completedTasks,
            pendingTasks,
            blockedTasks,
            overdueTasks,
            highRiskReports,
            avgConfidence:Number(avgConfidence.toFixed(1)),
        });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}// EMPLOYEE PERFORMANCE ANALYTICS
export const getEmployeePerformance = async (req, res) => {
  try {
    const managerId = req.userId;

    const projects = await Project.find({ manager: managerId });
    const projectIds = projects.map((p) => p._id);

    const teamMemberIds = [
      ...new Set(
        projects.flatMap((project) =>
          project.teamMembers.map((member) => member.toString())
        )
      ),
    ];

    const employees = await User.find({
      _id: { $in: teamMemberIds },
    }).select("name email role department designation");

    const result = [];

    for (const employee of employees) {
      const tasks = await Task.find({
        project: { $in: projectIds },
        assignedTo: employee._id,
      });

      const worklogs = await WorkLog.find({
        project: { $in: projectIds },
        employee: employee._id,
      });

      const totalTasks = tasks.length;

      const completedTasks = tasks.filter(
        (task) => task.status === "completed"
      ).length;

      const blockedTasks = tasks.filter(
        (task) => task.status === "blocked"
      ).length;

      const avgConfidence =
        worklogs.length > 0
          ? worklogs.reduce(
              (sum, log) => sum + (log.productivityConfidence || 0),
              0
            ) / worklogs.length
          : 0;

      const highRiskLogs = worklogs.filter(
        (log) => log.fakeReportRisk === "high"
      ).length;

      let overallRisk = "low";

      if (highRiskLogs >= 2 || avgConfidence < 40) {
        overallRisk = "high";
      } else if (highRiskLogs === 1 || avgConfidence < 65) {
        overallRisk = "medium";
      }

      result.push({
        employee,
        totalTasks,
        completedTasks,
        blockedTasks,
        worklogs: worklogs.length,
        avgConfidence: Number(avgConfidence.toFixed(1)),
        highRiskLogs,
        overallRisk,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// PROJECT HEALTH ANALYTICS
export const getProjectHealth = async (req, res) => {
  try {
    const managerId = req.userId;

    const projects = await Project.find({ manager: managerId });

    const result = [];

    for (const project of projects) {
      const tasks = await Task.find({ project: project._id });
      const worklogs = await WorkLog.find({ project: project._id });

      const totalTasks = tasks.length;

      const completedTasks = tasks.filter(
        (task) => task.status === "completed"
      ).length;

      const blockedTasks = tasks.filter(
        (task) => task.status === "blocked"
      ).length;

      const overdueTasks = tasks.filter((task) => {
        return (
          task.deadline &&
          new Date(task.deadline) < new Date() &&
          task.status !== "completed"
        );
      }).length;

      const completionRate =
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      const avgConfidence =
        worklogs.length > 0
          ? worklogs.reduce(
              (sum, log) => sum + (log.productivityConfidence || 0),
              0
            ) / worklogs.length
          : 0;

      let healthStatus = "healthy";

      if (overdueTasks > 0 || blockedTasks >= 2 || avgConfidence < 45) {
        healthStatus = "at-risk";
      } else if (completionRate < 50 || avgConfidence < 65) {
        healthStatus = "needs-attention";
      }

      result.push({
        projectId: project._id,
        title: project.title,
        status: project.status,
        priority: project.priority,
        deadline: project.deadline,
        totalTasks,
        completedTasks,
        blockedTasks,
        overdueTasks,
        completionRate: Number(completionRate.toFixed(1)),
        avgConfidence: Number(avgConfidence.toFixed(1)),
        healthStatus,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};