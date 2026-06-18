import WorkLog from "../models/worklog.model.js";
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import { validateWorklogWithAI } from "../services/aiValidation.service.js";
import Activity from "../models/activity.model.js";
import Notification from "../models/notification.model.js";

// BASIC FAKE REPORT CHECKER
const analyzeWorklogBasic = ({ workSummary, hoursWorked, meetingsCount, tasks }) => {
  let confidence = 70;
  let risk = "low";
  let insight = "Worklog looks acceptable.";

  const words = workSummary.trim().split(/\s+/).filter(Boolean).length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;

  if (words < 8) {
    confidence -= 35;
    insight = "Work summary is too short and lacks useful detail.";
  }

  if (hoursWorked > 10 && completedTasks === 0) {
    confidence -= 25;
    insight = "High working hours reported but no completed tasks found.";
  }

  if (meetingsCount >= 5) {
    confidence -= 10;
    insight = "High meeting load may have reduced focused productivity.";
  }

  if (confidence < 40) {
    risk = "high";
  } else if (confidence < 65) {
    risk = "medium";
  }

  return {
    productivityConfidence: Math.max(0, confidence),
    fakeReportRisk: risk,
    ailnsight: insight,
  };
};

// CREATE WORKLOG
export const createWorkLog = async (req, res) => {
  try {
    const {
      project,
      tasksWorkedOn,
      workSummary,
      blockers,
      hoursWorked,
      meetingsCount,
    } = req.body;

    if (!workSummary) {
      return res.status(400).json({
        message: "Work summary is required",
      });
    }

    if (project) {
      const projectDoc = await Project.findById(project);

      if (!projectDoc) {
        return res.status(404).json({
          message: "Project not found",
        });
      }
    }

    const tasks = await Task.find({
      _id: { $in: tasksWorkedOn || [] },
      assignedTo: req.userId,
    });

   let analysis = await validateWorklogWithAI({
  workSummary,
  blockers,
  hoursWorked: Number(hoursWorked || 0),
  meetingsCount: Number(meetingsCount || 0),
  tasks,
});

if (!analysis) {
  analysis = analyzeWorklogBasic({
    workSummary,
    hoursWorked: Number(hoursWorked || 0),
    meetingsCount: Number(meetingsCount || 0),
    tasks,
  });
}
    const worklog = await WorkLog.create({
      employee: req.userId,
      project: project || null,
      tasksWorkedOn: tasksWorkedOn || [],
      workSummary,
      blockers: blockers || "",
      hoursWorked: Number(hoursWorked || 0),
      meetingsCount: Number(meetingsCount || 0),
      productivityConfidence: analysis.productivityConfidence,
      fakeReportRisk: analysis.fakeReportRisk,
      ailnsight: analysis.ailnsight,
    });
    if (projectDoc) {
  await Notification.create({
    user: projectDoc.manager,
    title: "New WorkLog Submitted",
    message: "An employee submitted a new worklog for your project.",
    type: "worklog-submitted",
  });

  if (analysis.fakeReportRisk === "high") {
    await Notification.create({
      user: projectDoc.manager,
      title: "High Risk WorkLog Detected",
      message: "AI marked a submitted worklog as high risk.",
      type: "risk-alert",
    });
  }
}
    await Activity.create({
  user: req.userId,
  project: project || null,
  type: "worklog-submitted",
  message: "Submitted daily worklog",
});

    const populatedWorklog = await WorkLog.findById(worklog._id)
      .populate("employee", "name email role department designation")
      .populate("project", "title")
      .populate("tasksWorkedOn", "title status priority");

    return res.status(201).json(populatedWorklog);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET MY WORKLOGS
export const getMyWorkLogs = async (req, res) => {
  try {
    const worklogs = await WorkLog.find({
      employee: req.userId,
    })
      .populate("project", "title")
      .populate("tasksWorkedOn", "title status priority")
      .sort({ createdAt: -1 });

    return res.status(200).json(worklogs);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET TEAM WORKLOGS FOR MANAGER
export const getTeamWorkLogs = async (req, res) => {
  try {
    const managerProjects = await Project.find({
      manager: req.userId,
    }).select("_id");

    const projectIds = managerProjects.map((project) => project._id);

    const worklogs = await WorkLog.find({
      project: { $in: projectIds },
    })
      .populate("employee", "name email role department designation")
      .populate("project", "title")
      .populate("tasksWorkedOn", "title status priority")
      .sort({ createdAt: -1 });

    return res.status(200).json(worklogs);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};