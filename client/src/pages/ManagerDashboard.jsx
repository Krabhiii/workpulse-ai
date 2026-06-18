import React, { useEffect, useState } from "react";
import {
  Activity,
  Briefcase,
  CheckCircle2,
  Users,
  AlertTriangle,
  Loader2,
  BrainCircuit,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setError("");
      const res = await api.get("/api/dashboard/overview");
      setData(res.data);
    } catch (err) {
      console.log("DASHBOARD ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error) {
    return (
      <DashboardLayout>
        <div className="glass-card p-8 text-center">
          <AlertTriangle className="text-red-400 mx-auto mb-4" size={44} />
          <h1 className="text-2xl font-black mb-2">Dashboard Error</h1>
          <p className="text-red-300">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="h-[60vh] flex items-center justify-center text-cyan-300">
          <Loader2 className="animate-spin mr-3" />
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  const stats = data.stats || {};

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <BrainCircuit size={16} />
          AI Work Intelligence
        </div>

        <h1 className="page-title">Manager Dashboard</h1>
        <p className="muted-text mt-2">
          Monitor productivity, workload, risks, projects and recent team activity.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        <Card icon={<Briefcase />} title="Projects" value={stats.totalProjects || 0} />
        <Card icon={<Users />} title="Employees" value={stats.totalEmployees || 0} />
        <Card icon={<CheckCircle2 />} title="Completed" value={stats.completedTasks || 0} />
        <Card icon={<AlertTriangle />} title="High Risk" value={stats.highRiskReports || 0} />
        <Card icon={<Activity />} title="Confidence" value={`${stats.avgConfidence || 0}%`} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-8">
        <section className="glass-card p-6">
          <h2 className="text-xl font-black mb-4">Quick Insights</h2>

          <div className="space-y-3">
            {(data.quickInsights || []).map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-xl font-black mb-4">Recent Activity</h2>

          <div className="space-y-3">
            {(data.recentActivities || []).length === 0 ? (
              <p className="text-slate-400">No activity yet.</p>
            ) : (
              data.recentActivities.map((activity) => (
                <div
                  key={activity._id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <p className="text-white">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <section className="glass-card p-6">
          <h2 className="text-xl font-black mb-4">Project Health</h2>

          <div className="space-y-4">
            {(data.projectHealth || []).length === 0 ? (
              <p className="text-slate-400">No project health data yet.</p>
            ) : (
              data.projectHealth.map((project) => (
                <div
                  key={project.projectId}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold">{project.title}</h3>
                    <span className="text-cyan-300 text-sm">
                      {project.completionRate}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-600"
                      style={{ width: `${project.completionRate}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-400 mt-2 capitalize">
                    Health: {project.healthStatus}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-xl font-black mb-4">Employee Risk</h2>

          <div className="space-y-4">
            {(data.employeeRisk || []).length === 0 ? (
              <p className="text-slate-400">No employee risk data yet.</p>
            ) : (
              data.employeeRisk.map((item) => (
                <div
                  key={item.employee._id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold">{item.employee.name}</h3>
                      <p className="text-xs text-slate-400">{item.employee.email}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${
                        item.burnoutRisk === "high"
                          ? "text-red-300 border-red-400/30 bg-red-500/10"
                          : item.burnoutRisk === "medium"
                          ? "text-yellow-300 border-yellow-400/30 bg-yellow-500/10"
                          : "text-emerald-300 border-emerald-400/30 bg-emerald-500/10"
                      }`}
                    >
                      {item.burnoutRisk}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                    <Mini label="Pending" value={item.pendingTasks} />
                    <Mini label="Blocked" value={item.blockedTasks} />
                    <Mini label="Confidence" value={`${item.avgConfidence}%`} />
                  </div>
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

const Mini = ({ label, value }) => (
  <div className="rounded-2xl bg-[#020617]/60 border border-white/10 p-3">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="font-black text-lg">{value}</p>
  </div>
);

export default ManagerDashboard;