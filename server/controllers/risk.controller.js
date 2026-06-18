import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import WorkLog from "../models/worklog.model.js";
import Project from "../models/project.model.js";

export const getRiskAnalysis = async (req, res) => {
  try {
    const projects = await Project.find({
      manager: req.userId,
    });

    const projectIds = projects.map((p) => p._id);

    const employeeIds = [
      ...new Set(
        projects.flatMap((p) =>
          p.teamMembers.map((m) => m.toString())
        )
      ),
    ];

    const employees = await User.find({
      _id: { $in: employeeIds },
    });

    const results = [];

    for (const employee of employees) {
      const tasks = await Task.find({
        assignedTo: employee._id,
        project: { $in: projectIds },
      });

      const worklogs = await WorkLog.find({
        employee: employee._id,
        project: { $in: projectIds },
      });

      const pendingTasks = tasks.filter(
        (t) =>
          t.status === "todo" ||
          t.status === "in-progress"
      ).length;

      const blockedTasks = tasks.filter(
        (t) => t.status === "blocked"
      ).length;

      const avgConfidence =
        worklogs.length > 0
          ? worklogs.reduce(
              (sum, w) =>
                sum + w.productivityConfidence,
              0
            ) / worklogs.length
          : 0;

      let burnoutRisk = "low";
      let workload = "normal";

      if (
        pendingTasks >= 8 ||
        blockedTasks >= 3
      ) {
        burnoutRisk = "high";
      } else if (
        pendingTasks >= 5 ||
        blockedTasks >= 1
      ) {
        burnoutRisk = "medium";
      }

      if (pendingTasks >= 8) {
        workload = "overloaded";
      }

      results.push({
        employee: employee.name,
        pendingTasks,
        blockedTasks,
        avgConfidence:
          Number(avgConfidence.toFixed(1)),
        burnoutRisk,
        workload,
      });
    }

    return res.json(results);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};