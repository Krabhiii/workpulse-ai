import React, { useEffect, useState } from "react";
import {
  Users,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Brain,
  Activity,
} from "lucide-react";
import { useSelector } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function Team() {
  const { userData } = useSelector((state) => state.user);

  if (userData?.role === "manager") {
    return <ManagerTeam />;
  }

  return <EmployeeTeam />;
}

function ManagerTeam() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/analytics/employees");
      setEmployees(res.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <Users size={16} />
          Team Intelligence
        </div>

        <h1 className="page-title">Team Management</h1>
        <p className="muted-text mt-2">
          Monitor employee workload, task completion, productivity confidence and risk signals.
        </p>
      </div>

      {loading ? (
        <div className="glass-card p-8 flex items-center gap-3 text-cyan-300">
          <Loader2 className="animate-spin" />
          Loading team data...
        </div>
      ) : employees.length === 0 ? (
        <section className="glass-card p-10 text-center">
          <Users className="text-cyan-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-black mb-2">No team members yet</h2>
          <p className="text-slate-400">
            Add employees to projects to start tracking team performance.
          </p>
        </section>
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-5 mb-8">
            <Card icon={<Users />} title="Employees" value={employees.length} />
            <Card
              icon={<CheckCircle2 />}
              title="Completed Tasks"
              value={employees.reduce((sum, e) => sum + (e.completedTasks || 0), 0)}
            />
            <Card
              icon={<ShieldAlert />}
              title="High Risk Logs"
              value={employees.reduce((sum, e) => sum + (e.highRiskLogs || 0), 0)}
            />
            <Card
              icon={<Brain />}
              title="Avg Confidence"
              value={`${getAverageConfidence(employees)}%`}
            />
          </div>

          <div className="grid xl:grid-cols-2 gap-6">
            {employees.map((item) => (
              <EmployeeCard key={item.employee._id} item={item} />
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

function EmployeeTeam() {
  const [tasks, setTasks] = useState([]);
  const [worklogs, setWorklogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSelf = async () => {
    try {
      setLoading(true);
      const taskRes = await api.get("/api/task/my");
      const logRes = await api.get("/api/worklog/my");

      setTasks(taskRes.data || []);
      setWorklogs(logRes.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelf();
  }, []);

  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter(
    (t) => t.status === "todo" || t.status === "in-progress"
  ).length;
  const blocked = tasks.filter((t) => t.status === "blocked").length;

  const avgConfidence =
    worklogs.length > 0
      ? (
          worklogs.reduce((sum, w) => sum + (w.productivityConfidence || 0), 0) /
          worklogs.length
        ).toFixed(1)
      : 0;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <Activity size={16} />
          My Team Profile
        </div>

        <h1 className="page-title">My Performance Profile</h1>
        <p className="muted-text mt-2">
          View your personal workload, completed tasks and worklog confidence.
        </p>
      </div>

      {loading ? (
        <div className="glass-card p-8 flex items-center gap-3 text-cyan-300">
          <Loader2 className="animate-spin" />
          Loading your profile...
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-5">
          <Card icon={<Clock />} title="Total Tasks" value={tasks.length} />
          <Card icon={<CheckCircle2 />} title="Completed" value={completed} />
          <Card icon={<ShieldAlert />} title="Blocked" value={blocked} />
          <Card icon={<Brain />} title="Confidence" value={`${avgConfidence}%`} />
        </div>
      )}

      <section className="glass-card p-7 mt-8">
        <h2 className="text-2xl font-black mb-4">Performance Summary</h2>
        <p className="text-slate-300">
          You currently have {pending} pending task(s), {completed} completed task(s),
          and an average worklog confidence score of {avgConfidence}%.
        </p>
      </section>
    </DashboardLayout>
  );
}

const EmployeeCard = ({ item }) => {
  const riskClass =
    item.overallRisk === "high"
      ? "text-red-300 border-red-400/30 bg-red-500/10"
      : item.overallRisk === "medium"
      ? "text-yellow-300 border-yellow-400/30 bg-yellow-500/10"
      : "text-emerald-300 border-emerald-400/30 bg-emerald-500/10";

  return (
    <div className="glass-card glass-card-hover p-6">
      <div className="flex justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-black">{item.employee.name}</h2>
          <p className="text-slate-400 text-sm">{item.employee.email}</p>
          <p className="text-xs text-cyan-300 mt-1 capitalize">
            {item.employee.department || "General"} •{" "}
            {item.employee.designation || "Employee"}
          </p>
        </div>

        <span className={`h-fit px-3 py-1 rounded-full text-xs border capitalize ${riskClass}`}>
          {item.overallRisk} risk
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
        <Mini label="Tasks" value={item.totalTasks} />
        <Mini label="Completed" value={item.completedTasks} />
        <Mini label="Blocked" value={item.blockedTasks} />
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Confidence</span>
          <span className="text-cyan-300">{item.avgConfidence}%</span>
        </div>

        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-600"
            style={{ width: `${item.avgConfidence}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-slate-400">
        WorkLogs: {item.worklogs} • High Risk Logs: {item.highRiskLogs}
      </p>
    </div>
  );
};

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

const getAverageConfidence = (employees) => {
  if (!employees.length) return 0;

  const total = employees.reduce((sum, e) => sum + (e.avgConfidence || 0), 0);
  return (total / employees.length).toFixed(1);
};

export default Team;