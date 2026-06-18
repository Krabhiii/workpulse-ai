import React, { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Brain,
  Loader2,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function EmployeeAnalytics() {
  const [tasks, setTasks] = useState([]);
  const [worklogs, setWorklogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const taskRes = await api.get("/api/task/my");
      const logRes = await api.get("/api/worklog/my");

      setTasks(taskRes.data || []);
      setWorklogs(logRes.data || []);
    } catch (error) {
      console.log("EMPLOYEE ANALYTICS ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="glass-card p-8 flex items-center gap-3 text-cyan-300">
          <Loader2 className="animate-spin" />
          Loading analytics...
        </div>
      </DashboardLayout>
    );
  }

  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "todo" || t.status === "in-progress").length;
  const blocked = tasks.filter((t) => t.status === "blocked").length;

  const avgConfidence =
    worklogs.length > 0
      ? (
          worklogs.reduce((sum, log) => sum + (log.productivityConfidence || 0), 0) /
          worklogs.length
        ).toFixed(1)
      : 0;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <BarChart3 size={16} />
          Employee Analytics
        </div>

        <h1 className="page-title">My Analytics</h1>
        <p className="muted-text mt-2">
          Track your tasks, worklog quality and productivity confidence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        <Card icon={<Clock />} title="Total Tasks" value={tasks.length} />
        <Card icon={<CheckCircle2 />} title="Completed" value={completed} />
        <Card icon={<Clock />} title="Pending" value={pending} />
        <Card icon={<ShieldAlert />} title="Blocked" value={blocked} />
        <Card icon={<Brain />} title="Confidence" value={`${avgConfidence}%`} />
      </div>

      <section className="glass-card p-6">
        <h2 className="text-xl font-black mb-5">Recent WorkLog Confidence</h2>

        <div className="space-y-4">
          {worklogs.length === 0 ? (
            <p className="text-slate-400">No worklogs submitted yet.</p>
          ) : (
            worklogs.slice(0, 6).map((log) => (
              <div key={log._id} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex justify-between mb-2">
                  <p className="text-slate-300">{log.workSummary}</p>
                  <span className="text-cyan-300">{log.productivityConfidence}%</span>
                </div>

                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-600"
                    style={{ width: `${log.productivityConfidence || 0}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Risk: {log.fakeReportRisk}
                </p>
              </div>
            ))
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

export default EmployeeAnalytics;