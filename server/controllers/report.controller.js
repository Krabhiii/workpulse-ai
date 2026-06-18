import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import WorkLog from "../models/worklog.model.js";
import { askAi } from "../services/openRouter.service.js";

export const generateWeeklyReport = async (req, res) => {
  try {
    const projects = await Project.find({
      manager: req.userId,
    });

    const projectIds = projects.map((p) => p._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
    }).populate("assignedTo", "name email");

    const worklogs = await WorkLog.find({
      project: { $in: projectIds },
    }).populate("employee", "name email");

    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const blockedTasks = tasks.filter(
      (task) => task.status === "blocked"
    ).length;

    const highRiskLogs = worklogs.filter(
      (log) => log.fakeReportRisk === "high"
    ).length;

    const avgConfidence =
      worklogs.length > 0
        ? worklogs.reduce(
            (sum, log) => sum + (log.productivityConfidence || 0),
            0
          ) / worklogs.length
        : 0;

    const reportData = {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks,
      blockedTasks,
      highRiskLogs,
      avgConfidence: Number(avgConfidence.toFixed(1)),
      projects: projects.map((p) => ({
        title: p.title,
        status: p.status,
        priority: p.priority,
      })),
      tasks: tasks.map((t) => ({
        title: t.title,
        status: t.status,
        priority: t.priority,
        assignedTo: t.assignedTo?.name,
      })),
      worklogs: worklogs.map((w) => ({
        employee: w.employee?.name,
        confidence: w.productivityConfidence,
        risk: w.fakeReportRisk,
        summary: w.workSummary,
        insight: w.aiInsight,
      })),
    };

    const messages = [
      {
        role: "system",
        content: `
You are an AI workplace productivity analyst.

Generate a weekly manager report from company productivity data.

Return ONLY valid JSON:

{
  "summary": "short weekly summary",
  "keyWins": ["win1", "win2", "win3"],
  "risks": ["risk1", "risk2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "overallHealth": "healthy | needs-attention | at-risk"
}

Rules:
- Be professional.
- Use practical management language.
- Keep each point concise.
- Do not add text outside JSON.
`,
      },
      {
        role: "user",
        content: JSON.stringify(reportData),
      },
    ];

    let aiReport;

    try {
      const aiResponse = await askAi(messages);
      const match = aiResponse.match(/\{[\s\S]*\}/);

      aiReport = match
        ? JSON.parse(match[0])
        : null;
    } catch (error) {
      aiReport = null;
    }

    if (!aiReport) {
      aiReport = {
        summary: "Weekly productivity data has been analyzed successfully.",
        keyWins: [
          `${completedTasks} tasks were completed this week.`,
          `Average confidence score is ${Number(avgConfidence.toFixed(1))}.`,
        ],
        risks: [
          `${blockedTasks} tasks are currently blocked.`,
          `${highRiskLogs} high-risk worklogs detected.`,
        ],
        recommendations: [
          "Review blocked tasks with the team.",
          "Follow up on low-confidence worklogs.",
          "Balance workload across team members.",
        ],
        overallHealth:
          highRiskLogs > 2 || blockedTasks > 3
            ? "at-risk"
            : "needs-attention",
      };
    }

    return res.status(200).json({
      metrics: {
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks,
        blockedTasks,
        highRiskLogs,
        avgConfidence: Number(avgConfidence.toFixed(1)),
      },
      aiReport,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};