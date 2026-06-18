import React from "react";
import {
  Brain,
  BarChart3,
  ClipboardCheck,
  ShieldAlert,
  Users,
  ArrowRight,
  Sparkles,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function AppHome() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <section className="grid xl:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-5">
            <Sparkles size={16} />
            Enterprise Work Intelligence Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              WorkPulse AI
            </span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-2xl">
            Track projects, tasks, worklogs, productivity confidence, employee
            workload, fake report risk, burnout risk, and AI-powered management
            insights from one modern SaaS workspace.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="primary-btn flex items-center gap-2"
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="glass-card glass-card-hover p-6">
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard
              icon={<BarChart3 />}
              title="Smart Analytics"
              text="Visualize task progress, project health and team output."
            />
            <FeatureCard
              icon={<ShieldAlert />}
              title="Fake Report Risk"
              text="Detect vague or inconsistent employee worklogs."
            />
            <FeatureCard
              icon={<ClipboardCheck />}
              title="Worklog Validation"
              text="AI reviews daily updates and productivity confidence."
            />
            <FeatureCard
              icon={<Users />}
              title="Team Intelligence"
              text="Find overloaded employees and burnout risk early."
            />
          </div>

          <div className="mt-5 rounded-3xl bg-[#020617]/70 border border-white/10 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="text-cyan-400" />
              <h3 className="font-black text-xl">AI Insight Preview</h3>
            </div>

            <p className="text-slate-400">
              “Backend team performance is stable, but blocked tasks and low
              confidence worklogs may affect delivery this week.”
            </p>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mt-12">
        <InfoCard
          icon={<Activity />}
          title="For Managers"
          text="Monitor team performance, risks, projects, reports and AI suggestions."
        />
        <InfoCard
          icon={<ClipboardCheck />}
          title="For Employees"
          text="View assigned tasks, update progress and submit daily worklogs."
        />
        <InfoCard
          icon={<Brain />}
          title="For Companies"
          text="Improve transparency, detect bottlenecks and reduce fake reporting."
        />
      </section>
    </DashboardLayout>
  );
}

const FeatureCard = ({ icon, title, text }) => (
  <div className="rounded-3xl bg-white/5 border border-white/10 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
    <div className="text-cyan-400 mb-3">{icon}</div>
    <h3 className="font-black text-lg mb-1">{title}</h3>
    <p className="text-sm text-slate-400">{text}</p>
  </div>
);

const InfoCard = ({ icon, title, text }) => (
  <div className="glass-card glass-card-hover p-6">
    <div className="text-cyan-400 mb-4">{icon}</div>
    <h3 className="font-black text-xl mb-2">{title}</h3>
    <p className="text-slate-400">{text}</p>
  </div>
);

export default AppHome;