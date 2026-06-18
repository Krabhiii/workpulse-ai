import React, { useEffect, useState } from "react";
import {
  CheckSquare,
  Clock,
  ClipboardList,
  Loader2,
  Activity,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [worklogs, setWorklogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const taskRes = await api.get("/api/task/my");
      const logRes = await api.get("/api/worklog/my");

      setTasks(taskRes.data || []);
      setWorklogs(logRes.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[60vh] flex items-center justify-center text-cyan-300">
          <Loader2 className="animate-spin mr-3" />
          Loading employee dashboard...
        </div>
      </DashboardLayout>
    );
  }

  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter(
    (t) => t.status === "todo" || t.status === "in-progress"
  ).length;

  const avgConfidence =
    worklogs.length > 0
      ? (
          worklogs.reduce(
            (sum, log) => sum + (log.productivityConfidence || 0),
            0
          ) / worklogs.length
        ).toFixed(1)
      : 0;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <Activity size={16} />
          Employee Workspace
        </div>

        <h1 className="page-title">My Work Dashboard</h1>
        <p className="muted-text mt-2">
          View your assigned tasks, worklog confidence and daily progress.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <Card icon={<CheckSquare />} title="Total Tasks" value={tasks.length} />
        <Card icon={<CheckSquare />} title="Completed" value={completed} />
        <Card icon={<Clock />} title="Pending" value={pending} />
        <Card
          icon={<ClipboardList />}
          title="Avg Confidence"
          value={`${avgConfidence}%`}
        />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <section className="glass-card p-6">
          <h2 className="text-xl font-black mb-4">My Tasks</h2>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-slate-400">No tasks assigned yet.</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-sm text-slate-400">{task.description}</p>
                  <p className="text-xs text-cyan-300 mt-2 capitalize">
                    {task.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-xl font-black mb-4">Recent WorkLogs</h2>

          <div className="space-y-3">
            {worklogs.length === 0 ? (
              <p className="text-slate-400">No worklogs submitted yet.</p>
            ) : (
              worklogs.slice(0, 5).map((log) => (
                <div
                  key={log._id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <p className="text-white">{log.workSummary}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Confidence: {log.productivityConfidence}% • Risk:{" "}
                    {log.fakeReportRisk}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
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

export default EmployeeDashboard;