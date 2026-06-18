import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import WorkLog from "../models/worklog.model.js";
import User from "../models/user.model.js";

import { askAi } from "../services/openRouter.service.js";

export const generateManagerInsights = async (req, res) => {
  try {
    const projects = await Project.find({
      manager: req.userId,
    });

    const projectIds = projects.map((p) => p._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
    })
      .populate("assignedTo", "name");

    const worklogs = await WorkLog.find({
      project: { $in: projectIds },
    })
      .populate("employee", "name");

    const summary = {
      projects: projects.map((p) => ({
        title: p.title,
        status: p.status,
      })),

      tasks: tasks.map((t) => ({
        title: t.title,
        status: t.status,
        assignedTo: t.assignedTo?.name,
      })),

      worklogs: worklogs.map((w) => ({
        employee: w.employee?.name,
        confidence: w.productivityConfidence,
        risk: w.fakeReportRisk,
        summary: w.workSummary,
      })),
    };

    const messages = [
      {
        role: "system",
        content: `
You are an AI management consultant.

Analyze company productivity data.

Return ONLY JSON:

{
  "insights": [
     "insight 1",
     "insight 2",
     "insight 3"
  ]
}

Give concise management insights.
`
      },
      {
        role: "user",
        content: JSON.stringify(summary)
      }
    ];

    const aiResponse = await askAi(messages);

    const match = aiResponse.match(/\{[\s\S]*\}/);

    const parsed = match
      ? JSON.parse(match[0])
      : {
          insights: [
            "No insights generated"
          ]
        };

    return res.json(parsed);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};