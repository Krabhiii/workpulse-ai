import React, { useEffect, useState } from "react";
import {
  BrainCircuit,
  Loader2,
  CheckCircle2,
  ClipboardList,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function EmployeeInsights() {
  const [tasks, setTasks] = useState([]);
  const [worklogs, setWorklogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const taskRes = await api.get("/api/task/my");
      const logRes = await api.get("/api/worklog/my");

      setTasks(taskRes.data || []);
      setWorklogs(logRes.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const completedTasks = tasks.filter((task) => task.status === "completed").length;

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

  const insights = [];

  if (tasks.length === 0) {
    insights.push("No assigned tasks yet. Once tasks are assigned, your productivity insights will improve.");
  }

  if (completedTasks > 0) {
    insights.push(`You completed ${completedTasks} task(s). Maintain this consistency across upcoming work.`);
  }

  if (avgConfidence >= 75) {
    insights.push("Your worklog confidence is strong. Continue writing specific and measurable updates.");
  } else if (worklogs.length > 0) {
    insights.push("Your worklog confidence can improve. Add more detail about what was completed and any blockers.");
  }

  if (highRiskLogs > 0) {
    insights.push(`${highRiskLogs} worklog(s) were marked high risk. Avoid vague updates and connect logs with actual tasks.`);
  }

  if (insights.length === 0) {
    insights.push("Submit worklogs and update task status regularly to receive better AI insights.");
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <BrainCircuit size={16} />
          Personal AI Insights
        </div>

        <h1 className="page-title">My AI Insights</h1>
        <p className="muted-text mt-2">
          Personalized suggestions based on your tasks, worklogs and confidence score.
        </p>
      </div>

      {loading ? (
        <div className="glass-card p-8 flex items-center gap-3 text-cyan-300">
          <Loader2 className="animate-spin" />
          Loading personal insights...
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            <Card icon={<CheckCircle2 />} title="Completed Tasks" value={completedTasks} />
            <Card icon={<ClipboardList />} title="WorkLogs" value={worklogs.length} />
            <Card icon={<ShieldAlert />} title="Avg Confidence" value={`${avgConfidence}%`} />
          </div>

          <section className="glass-card p-7">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-2">
              <Sparkles className="text-cyan-400" />
              Personalized Recommendations
            </h2>

            <div className="space-y-4">
              {insights.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-3xl bg-white/5 border border-white/10 text-slate-300 leading-relaxed"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </>
      )}
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

export default EmployeeInsights;