import React from "react";
import { Brain, BarChart3, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="app-bg px-6">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/10 blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto py-8">
        <nav className="flex items-center justify-between mb-24">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_35px_rgba(34,211,238,0.4)]">
              <Brain />
            </div>
            <h1 className="text-2xl font-black">
              WorkPulse<span className="text-cyan-400">AI</span>
            </h1>
          </div>

          <button onClick={() => navigate("/login")} className="primary-btn">
            Get Started
          </button>
        </nav>

        <section className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-6">
              <Sparkles size={16} />
              AI Workplace Intelligence
            </div>

            <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Understand your team’s real
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {" "}work pulse
              </span>
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
              Track projects, tasks, worklogs, employee workload, burnout risk,
              fake report risk, and AI-powered productivity insights in one
              modern enterprise dashboard.
            </p>

            <div className="flex gap-4">
              <button onClick={() => navigate("/login")} className="primary-btn flex items-center gap-2">
                Start Now <ArrowRight size={18} />
              </button>
              <button className="secondary-btn">View Demo</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card glass-card-hover p-6"
          >
            <div className="grid grid-cols-2 gap-4 mb-5">
              <Feature icon={<BarChart3 />} title="Analytics" value="92%" />
              <Feature icon={<ShieldCheck />} title="Risk Control" value="Low" />
              <Feature icon={<Brain />} title="AI Insights" value="Active" />
              <Feature icon={<Sparkles />} title="Confidence" value="84%" />
            </div>

            <div className="rounded-3xl bg-[#020617]/70 border border-white/10 p-5">
              <h3 className="font-bold mb-3">AI Insight</h3>
              <p className="text-slate-400">
                Backend team productivity is stable, but two blocked tasks may
                impact delivery if not resolved this week.
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

const Feature = ({ icon, title, value }) => (
  <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
    <div className="text-cyan-400 mb-3">{icon}</div>
    <p className="text-slate-400 text-sm">{title}</p>
    <h3 className="text-2xl font-black">{value}</h3>
  </div>
);

export default Landing;