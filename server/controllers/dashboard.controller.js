import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import WorkLog from "../models/worklog.model.js";
import Activity from "../models/activity.model.js";
import User from "../models/user.model.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const managerId = req.userId;

    const projects = await Project.find({
      manager: managerId,
    });

    const projectIds = projects.map((project) => project._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
    });

    const worklogs = await WorkLog.find({
      project: { $in: projectIds },
    });

    const activities = await Activity.find({
      project: { $in: projectIds },
    })
      .populate("user", "name email role")
      .populate("project", "title")
      .populate("task", "title status")
      .sort({ createdAt: -1 })
      .limit(10);

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

    const totalProjects = projects.length;
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const pendingTasks = tasks.filter(
      (task) =>
        task.status === "todo" ||
        task.status === "in-progress"
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

    const highRiskReports = worklogs.filter(
      (log) => log.fakeReportRisk === "high"
    ).length;

    const avgConfidence =
      worklogs.length > 0
        ? worklogs.reduce(
            (sum, log) => sum + (log.productivityConfidence || 0),
            0
          ) / worklogs.length
        : 0;

    const projectHealth = [];

    for (const project of projects) {
      const projectTasks = tasks.filter(
        (task) => task.project.toString() === project._id.toString()
      );

      const projectWorklogs = worklogs.filter(
        (log) =>
          log.project &&
          log.project.toString() === project._id.toString()
      );

      const projectTotalTasks = projectTasks.length;

      const projectCompletedTasks = projectTasks.filter(
        (task) => task.status === "completed"
      ).length;

      const projectBlockedTasks = projectTasks.filter(
        (task) => task.status === "blocked"
      ).length;

      const projectOverdueTasks = projectTasks.filter((task) => {
        return (
          task.deadline &&
          new Date(task.deadline) < new Date() &&
          task.status !== "completed"
        );
      }).length;

      const completionRate =
        projectTotalTasks > 0
          ? (projectCompletedTasks / projectTotalTasks) * 100
          : 0;

      const projectAvgConfidence =
        projectWorklogs.length > 0
          ? projectWorklogs.reduce(
              (sum, log) =>
                sum + (log.productivityConfidence || 0),
              0
            ) / projectWorklogs.length
          : 0;

      let healthStatus = "healthy";

      if (
        projectOverdueTasks > 0 ||
        projectBlockedTasks >= 2 ||
        projectAvgConfidence < 45
      ) {
        healthStatus = "at-risk";
      } else if (
        completionRate < 50 ||
        projectAvgConfidence < 65
      ) {
        healthStatus = "needs-attention";
      }

      projectHealth.push({
        projectId: project._id,
        title: project.title,
        status: project.status,
        priority: project.priority,
        deadline: project.deadline,
        totalTasks: projectTotalTasks,
        completedTasks: projectCompletedTasks,
        blockedTasks: projectBlockedTasks,
        overdueTasks: projectOverdueTasks,
        completionRate: Number(completionRate.toFixed(1)),
        avgConfidence: Number(projectAvgConfidence.toFixed(1)),
        healthStatus,
      });
    }

    const employeeRisk = [];

    for (const employee of employees) {
      const employeeTasks = tasks.filter(
        (task) =>
          task.assignedTo.toString() === employee._id.toString()
      );

      const employeeWorklogs = worklogs.filter(
        (log) =>
          log.employee.toString() === employee._id.toString()
      );

      const employeePendingTasks = employeeTasks.filter(
        (task) =>
          task.status === "todo" ||
          task.status === "in-progress"
      ).length;

      const employeeBlockedTasks = employeeTasks.filter(
        (task) => task.status === "blocked"
      ).length;

      const employeeAvgConfidence =
        employeeWorklogs.length > 0
          ? employeeWorklogs.reduce(
              (sum, log) =>
                sum + (log.productivityConfidence || 0),
              0
            ) / employeeWorklogs.length
          : 0;

      const highRiskLogs = employeeWorklogs.filter(
        (log) => log.fakeReportRisk === "high"
      ).length;

      let burnoutRisk = "low";
      let workload = "normal";

      if (
        employeePendingTasks >= 8 ||
        employeeBlockedTasks >= 3 ||
        highRiskLogs >= 2
      ) {
        burnoutRisk = "high";
      } else if (
        employeePendingTasks >= 5 ||
        employeeBlockedTasks >= 1 ||
        highRiskLogs === 1
      ) {
        burnoutRisk = "medium";
      }

      if (employeePendingTasks >= 8) {
        workload = "overloaded";
      }

      employeeRisk.push({
        employee: {
          _id: employee._id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          department: employee.department,
          designation: employee.designation,
        },
        totalTasks: employeeTasks.length,
        pendingTasks: employeePendingTasks,
        blockedTasks: employeeBlockedTasks,
        worklogs: employeeWorklogs.length,
        avgConfidence: Number(employeeAvgConfidence.toFixed(1)),
        highRiskLogs,
        burnoutRisk,
        workload,
      });
    }

    const quickInsights = [];

    if (overdueTasks > 0) {
      quickInsights.push(`${overdueTasks} overdue tasks need attention.`);
    }

    if (blockedTasks > 0) {
      quickInsights.push(`${blockedTasks} blocked tasks may delay delivery.`);
    }

    if (highRiskReports > 0) {
      quickInsights.push(`${highRiskReports} high-risk worklogs detected.`);
    }

    if (avgConfidence < 60 && worklogs.length > 0) {
      quickInsights.push("Average productivity confidence is low.");
    }

    if (quickInsights.length === 0) {
      quickInsights.push("Team performance looks stable right now.");
    }

    return res.status(200).json({
      stats: {
        totalProjects,
        totalEmployees: employees.length,
        totalTasks,
        completedTasks,
        pendingTasks,
        blockedTasks,
        overdueTasks,
        highRiskReports,
        avgConfidence: Number(avgConfidence.toFixed(1)),
      },
      projectHealth,
      employeeRisk,
      recentActivities: activities,
      quickInsights,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};