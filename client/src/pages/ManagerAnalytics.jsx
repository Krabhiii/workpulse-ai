import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Loader2,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Users,
  Activity,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function ManagerAnalytics() {
  const [dashboard, setDashboard] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const dashRes = await api.get("/api/analytics/dashboard");
      const empRes = await api.get("/api/analytics/employees");
      const projRes = await api.get("/api/analytics/projects");

      setDashboard(dashRes.data || {});
      setEmployees(empRes.data || []);
      setProjects(projRes.data || []);
    } catch (error) {
      console.log("ANALYTICS ERROR:", error.response?.data || error.message);
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
          Loading manager analytics...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <BarChart3 size={16} />
          Manager Analytics
        </div>

        <h1 className="page-title">Analytics Dashboard</h1>
        <p className="muted-text mt-2">
          Project health, task progress, employee performance and risk overview.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <Card icon={<FolderKanban />} title="Projects" value={dashboard?.totalProjects || 0} />
        <Card icon={<CheckCircle2 />} title="Completed Tasks" value={dashboard?.completedTasks || 0} />
        <Card icon={<AlertTriangle />} title="Blocked Tasks" value={dashboard?.blockedTasks || 0} />
        <Card icon={<Activity />} title="Avg Confidence" value={`${dashboard?.avgConfidence || 0}%`} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-8">
        <section className="glass-card p-6">
          <h2 className="text-xl font-black mb-5">Task Status Summary</h2>

          <div className="grid grid-cols-2 gap-4">
            <Mini label="Total Tasks" value={dashboard?.totalTasks || 0} />
            <Mini label="Pending" value={dashboard?.pendingTasks || 0} />
            <Mini label="Overdue" value={dashboard?.overdueTasks || 0} />
            <Mini label="High Risk Logs" value={dashboard?.highRiskReports || 0} />
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-xl font-black mb-5">Employee Performance</h2>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {employees.length === 0 ? (
              <p className="text-slate-400">No employee analytics yet.</p>
            ) : (
              employees.map((item) => (
                <div key={item.employee?._id} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-black">{item.employee?.name}</h3>
                      <p className="text-xs text-slate-400">{item.employee?.email}</p>
                    </div>

                    <span className="text-cyan-300 text-sm">
                      {item.avgConfidence || 0}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-600"
                      style={{ width: `${item.avgConfidence || 0}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Tasks: {item.totalTasks} • Completed: {item.completedTasks} • Risk: {item.overallRisk}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="glass-card p-6">
        <h2 className="text-xl font-black mb-5">Project Health</h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.length === 0 ? (
            <p className="text-slate-400">No project health data.</p>
          ) : (
            projects.map((project) => (
              <div key={project.projectId} className="rounded-3xl bg-white/5 border border-white/10 p-5">
                <div className="flex justify-between mb-3">
                  <h3 className="font-black text-lg">{project.title}</h3>
                  <span className="text-cyan-300">{project.completionRate}%</span>
                </div>

                <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-600"
                    style={{ width: `${project.completionRate || 0}%` }}
                  />
                </div>

                <p className="text-sm text-slate-400 capitalize">
                  Health: {project.healthStatus}
                </p>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <Mini label="Tasks" value={project.totalTasks} />
                  <Mini label="Blocked" value={project.blockedTasks} />
                  <Mini label="Overdue" value={project.overdueTasks} />
                </div>
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

const Mini = ({ label, value }) => (
  <div className="rounded-2xl bg-[#020617]/60 border border-white/10 p-3 text-center">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="font-black text-lg">{value}</p>
  </div>
);

export default ManagerAnalytics;