import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import WorkLog from "../models/worklog.model.js";
import User from "../models/user.model.js";
import { askAi } from "../services/openRouter.service.js";

export const askAssistant = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const user = await User.findById(req.userId).select(
      "name email role department designation"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let dataContext = {};

    if (user.role === "manager") {
      const projects = await Project.find({
        manager: req.userId,
      })
        .populate("teamMembers", "name email role")
        .populate("manager", "name email role");

      const projectIds = projects.map((p) => p._id);

      const tasks = await Task.find({
        project: { $in: projectIds },
      })
        .populate("project", "title status priority")
        .populate("assignedTo", "name email role");

      const worklogs = await WorkLog.find({
        project: { $in: projectIds },
      })
        .populate("project", "title")
        .populate("employee", "name email role");

      dataContext = {
        role: "manager",
        user,
        projects: projects.map((p) => ({
          title: p.title,
          status: p.status,
          priority: p.priority,
          teamMembers: p.teamMembers,
        })),
        tasks: tasks.map((t) => ({
          title: t.title,
          status: t.status,
          priority: t.priority,
          project: t.project?.title,
          assignedTo: t.assignedTo?.name,
          estimatedHours: t.estimatedHours,
        })),
        worklogs: worklogs.map((w) => ({
          employee: w.employee?.name,
          project: w.project?.title,
          summary: w.workSummary,
          blockers: w.blockers,
          hoursWorked: w.hoursWorked,
          meetingsCount: w.meetingsCount,
          productivityConfidence: w.productivityConfidence,
          fakeReportRisk: w.fakeReportRisk,
          aiInsight: w.aiInsight,
        })),
      };
    } else {
      const tasks = await Task.find({
        assignedTo: req.userId,
      })
        .populate("project", "title status priority")
        .populate("assignedTo", "name email role");

      const worklogs = await WorkLog.find({
        employee: req.userId,
      }).populate("project", "title");

      dataContext = {
        role: "employee",
        user,
        tasks: tasks.map((t) => ({
          title: t.title,
          status: t.status,
          priority: t.priority,
          project: t.project?.title,
          estimatedHours: t.estimatedHours,
        })),
        worklogs: worklogs.map((w) => ({
          project: w.project?.title,
          summary: w.workSummary,
          blockers: w.blockers,
          hoursWorked: w.hoursWorked,
          meetingsCount: w.meetingsCount,
          productivityConfidence: w.productivityConfidence,
          fakeReportRisk: w.fakeReportRisk,
          aiInsight: w.aiInsight,
        })),
      };
    }

    const messages = [
      {
        role: "system",
        content: `
You are WorkPulse AI Assistant.

Answer only using the provided WorkPulse data context.

Rules:
- If user is manager, answer about their projects, team, tasks, worklogs and risks.
- If user is employee, answer only about their own tasks and worklogs.
- Be concise, practical and professional.
- If data is insufficient, say what data is missing.
- Do not invent employees, projects or task details.
- Give actionable suggestions.
`,
      },
      {
        role: "user",
        content: `
Question:
${question}

WorkPulse Data Context:
${JSON.stringify(dataContext, null, 2)}
`,
      },
    ];

    const answer = await askAi(messages);

    return res.status(200).json({
      answer,
    });
  } catch (error) {
    console.log("ASSISTANT ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};