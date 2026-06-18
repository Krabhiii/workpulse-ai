import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Loader2,
  Sparkles,
  ShieldAlert,
  Clock,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function WorkLogs() {
  const {userData} = useSelector((state)=>state.user)
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [worklogs, setWorklogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [project, setProject] = useState("");
  const [tasksWorkedOn, setTasksWorkedOn] = useState([]);
  const [workSummary, setWorkSummary] = useState("");
  const [blockers, setBlockers] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [meetingsCount, setMeetingsCount] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const taskRes = await api.get("/api/task/my");
      const projectRes = await api.get("/api/project/all");
     let logRes;

if (userData?.role === "manager") {
  logRes = await api.get("/api/worklog/team");
} else {
  logRes = await api.get("/api/worklog/my");
}
      setTasks(taskRes.data || []);
      setProjects(projectRes.data || []);
      setWorklogs(logRes.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskId) => {
    setTasksWorkedOn((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const submitWorkLog = async () => {
    if (!workSummary.trim()) {
      alert("Work summary is required");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/api/worklog/create", {
        project: project || null,
        tasksWorkedOn,
        workSummary,
        blockers,
        hoursWorked: Number(hoursWorked || 0),
        meetingsCount: Number(meetingsCount || 0),
      });

      setProject("");
      setTasksWorkedOn([]);
      setWorkSummary("");
      setBlockers("");
      setHoursWorked("");
      setMeetingsCount("");

      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Worklog submit failed");
    } finally {
      setSubmitting(false);
    }
  };

 useEffect(() => {
  if (userData) {
    fetchData();
  }
}, [userData]);

  const filteredTasks = project
    ? tasks.filter((task) => task.project?._id === project)
    : tasks;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <ClipboardList size={16} />
          Daily Work Intelligence
        </div>

        <h1 className="page-title">WorkLogs</h1>
        <p className="muted-text mt-2">
          Submit your daily work update and get AI-based productivity confidence.
        </p>
      </div>

      {loading ? (
        <div className="glass-card p-8 flex items-center gap-3 text-cyan-300">
          <Loader2 className="animate-spin" />
          Loading worklogs...
        </div>
      ) : (
        <div className="grid xl:grid-cols-2 gap-6">
          {userData?.role === "employee" && (
          <section className="glass-card p-6">
            <h2 className="text-xl font-black mb-5 flex items-center gap-2">
              <Sparkles className="text-cyan-400" />
              Submit Daily WorkLog
            </h2>

            <div className="space-y-4">
              <select
                className="input"
                value={project}
                onChange={(e) => {
                  setProject(e.target.value);
                  setTasksWorkedOn([]);
                }}
              >
                <option value="">Select project optional</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>

              <div>
                <p className="text-sm text-slate-400 mb-2">
                  Select tasks worked on
                </p>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {filteredTasks.length === 0 ? (
                    <p className="text-slate-500 text-sm">
                      No assigned tasks found.
                    </p>
                  ) : (
                    filteredTasks.map((task) => (
                      <button
                        key={task._id}
                        onClick={() => toggleTask(task._id)}
                        type="button"
                        className={`w-full text-left p-3 rounded-2xl border transition ${
                          tasksWorkedOn.includes(task._id)
                            ? "bg-cyan-500/15 border-cyan-400/40 text-cyan-200"
                            : "bg-white/5 border-white/10 text-slate-300"
                        }`}
                      >
                        <div className="font-bold">{task.title}</div>
                        <div className="text-xs text-slate-400 capitalize">
                          Status: {task.status} • Priority: {task.priority}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <textarea
                className="input min-h-[140px]"
                placeholder="What did you complete today? Be specific. Example: Implemented task status API and fixed dashboard card layout."
                value={workSummary}
                onChange={(e) => setWorkSummary(e.target.value)}
              />

              <textarea
                className="input min-h-[90px]"
                placeholder="Any blockers? Example: Waiting for analytics endpoint."
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="input"
                  type="number"
                  placeholder="Hours worked"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(e.target.value)}
                />

                <input
                  className="input"
                  type="number"
                  placeholder="Meetings attended"
                  value={meetingsCount}
                  onChange={(e) => setMeetingsCount(e.target.value)}
                />
              </div>

              <button
                onClick={submitWorkLog}
                disabled={submitting}
                className="primary-btn w-full flex justify-center items-center gap-2"
              >
                {submitting && <Loader2 className="animate-spin" size={18} />}
                Submit WorkLog
              </button>
            </div>
          </section>
)}
          <section className="glass-card p-6">
          <h2 className="text-xl font-black mb-5">
  {userData?.role === "manager"
    ? "Team WorkLogs"
    : "My Recent WorkLogs"}
</h2>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {worklogs.length === 0 ? (
                <p className="text-slate-400">No worklogs submitted yet.</p>
              ) : (
                worklogs.map((log) => (
                  <WorkLogCard key={log._id} log={log} />
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}

const WorkLogCard = ({ log }) => {
  const riskClass =
    log.fakeReportRisk === "high"
      ? "text-red-300 border-red-400/30 bg-red-500/10"
      : log.fakeReportRisk === "medium"
      ? "text-yellow-300 border-yellow-400/30 bg-yellow-500/10"
      : "text-emerald-300 border-emerald-400/30 bg-emerald-500/10";

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex justify-between gap-3 mb-3">
        <div>
          <h3 className="font-black">
            {log.project?.title || "General WorkLog"}
          </h3>

          <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
            <Clock size={13} />
            {new Date(log.createdAt).toLocaleString()}
          </p>
        </div>

        <span className={`h-fit px-3 py-1 rounded-full text-xs border capitalize ${riskClass}`}>
          {log.fakeReportRisk}
        </span>
      </div>
      {log.employee && (
  <p className="text-cyan-300 text-sm mb-2">
    Employee: {log.employee.name}
  </p>
)}

      <p className="text-slate-300 text-sm mb-4">{log.workSummary}</p>

      {log.blockers && (
        <p className="text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-400/20 rounded-2xl p-3 mb-4">
          Blocker: {log.blockers}
        </p>
      )}

      <div className="grid grid-cols-3 gap-3 text-center mb-4">
        <Mini label="Hours" value={log.hoursWorked} />
        <Mini label="Meetings" value={log.meetingsCount} />
        <Mini label="Confidence" value={`${log.productivityConfidence}%`} />
      </div>

      {log.aiInsight && (
        <div className="rounded-2xl bg-cyan-500/10 border border-cyan-400/20 p-3 text-sm text-cyan-200">
          AI Insight: {log.aiInsight}
        </div>
      )}
    </div>
  );
};

const Mini = ({ label, value }) => (
  <div className="rounded-2xl bg-[#020617]/60 border border-white/10 p-3">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="font-black">{value}</p>
  </div>
);

export default WorkLogs;