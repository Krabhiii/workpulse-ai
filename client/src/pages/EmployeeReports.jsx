import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Brain,
  Loader2,
  ShieldAlert,
  Activity,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function EmployeeReports() {
  const [tasks, setTasks] = useState([]);
  const [worklogs, setWorklogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);

      const taskRes = await api.get("/api/task/my");
      const logRes = await api.get("/api/worklog/my");

      setTasks(taskRes.data || []);
      setWorklogs(logRes.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="glass-card p-8 flex items-center gap-3 text-cyan-300">
          <Loader2 className="animate-spin" />
          Loading employee report...
        </div>
      </DashboardLayout>
    );
  }

  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = tasks.filter(
    (task) => task.status === "todo" || task.status === "in-progress"
  ).length;
  const blockedTasks = tasks.filter((task) => task.status === "blocked").length;

  const avgConfidence =
    worklogs.length > 0
      ? (
          worklogs.reduce(
            (sum, log) => sum + (log.productivityConfidence || 0),
            0
          ) / worklogs.length
        ).toFixed(1)
      : 0;

  const highRiskLogs = worklogs.filter((log) => log.fakeReportRisk === "high").length;

  const totalHours = worklogs.reduce(
    (sum, log) => sum + Number(log.hoursWorked || 0),
    0
  );

  const aiFeedback =
    worklogs.length === 0
      ? "Submit daily worklogs to generate personalized productivity feedback."
      : avgConfidence >= 75
      ? "Your worklog consistency and productivity confidence look strong. Keep updates specific and measurable."
      : avgConfidence >= 50
      ? "Your productivity is moderate. Add more specific task details and blockers in your worklogs."
      : "Your confidence score is low. Improve worklog quality and align updates with assigned tasks.";

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <ClipboardList size={16} />
          Personal Productivity Report
        </div>

        <h1 className="page-title">My Reports</h1>
        <p className="muted-text mt-2">
          Your personal work summary, task progress, confidence and AI feedback.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        <Card icon={<Activity />} title="Total Tasks" value={tasks.length} />
        <Card icon={<CheckCircle2 />} title="Completed" value={completedTasks} />
        <Card icon={<Clock />} title="Pending" value={pendingTasks} />
        <Card icon={<ShieldAlert />} title="Blocked" value={blockedTasks} />
        <Card icon={<Brain />} title="Confidence" value={`${avgConfidence}%`} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-8">
        <section className="glass-card glass-card-hover p-7">
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
            <Brain className="text-cyan-400" />
            AI Personal Feedback
          </h2>

          <p className="text-slate-300 leading-relaxed text-lg">
            {aiFeedback}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-6 text-center">
            <Mini label="WorkLogs" value={worklogs.length} />
            <Mini label="Hours" value={totalHours} />
            <Mini label="High Risk" value={highRiskLogs} />
          </div>
        </section>

        <section className="glass-card glass-card-hover p-7">
          <h2 className="text-2xl font-black mb-5">Productivity Health</h2>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Confidence Score</span>
              <span className="text-cyan-300">{avgConfidence}%</span>
            </div>

            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-600"
                style={{ width: `${avgConfidence}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-slate-300">
            {avgConfidence >= 75
              ? "Status: Strong and consistent performance."
              : avgConfidence >= 50
              ? "Status: Stable but needs improvement."
              : "Status: Needs attention and better reporting."}
          </div>
        </section>
      </div>

      <section className="glass-card p-6">
        <h2 className="text-xl font-black mb-5">Recent WorkLogs</h2>

        <div className="space-y-4">
          {worklogs.length === 0 ? (
            <p className="text-slate-400">No worklogs submitted yet.</p>
          ) : (
            worklogs.slice(0, 6).map((log) => <WorkLogItem key={log._id} log={log} />)
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

const Card = ({ icon, title, value }) => (
  <div className="glass-card glass-card-hover p-5">
    <div className="text-cyan-400 mb-4">{icon}</div>
    <p className="text-slate-400 text-sm">{title}</p>
    <h2 className="text-3xl font-black mt-1">{value}</h2>
  </div>
);

const Mini = ({ label, value }) => (
  <div className="rounded-2xl bg-[#020617]/60 border border-white/10 p-3">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="font-black">{value}</p>
  </div>
);

const WorkLogItem = ({ log }) => {
  const riskClass =
    log.fakeReportRisk === "high"
      ? "text-red-300 border-red-400/30 bg-red-500/10"
      : log.fakeReportRisk === "medium"
      ? "text-yellow-300 border-yellow-400/30 bg-yellow-500/10"
      : "text-emerald-300 border-emerald-400/30 bg-emerald-500/10";

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
      <div className="flex justify-between gap-4 mb-3">
        <div>
          <h3 className="font-black">{log.project?.title || "General WorkLog"}</h3>
          <p className="text-xs text-slate-500">
            {new Date(log.createdAt).toLocaleString()}
          </p>
        </div>

        <span className={`h-fit px-3 py-1 rounded-full text-xs border capitalize ${riskClass}`}>
          {log.fakeReportRisk}
        </span>
      </div>

      <p className="text-slate-300 text-sm mb-3">{log.workSummary}</p>

      <div className="grid md:grid-cols-3 gap-3 text-center">
        <Mini label="Hours" value={log.hoursWorked} />
        <Mini label="Meetings" value={log.meetingsCount} />
        <Mini label="Confidence" value={`${log.productivityConfidence}%`} />
      </div>
    </div>
  );
};

export default EmployeeReports;