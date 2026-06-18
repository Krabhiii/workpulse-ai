import React, { useEffect, useState } from "react";
import {
  BrainCircuit,
  Loader2,
  Sparkles,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function ManagerInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/insights/manager");
      setInsights(res.data?.insights || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load AI insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <BrainCircuit size={16} />
          AI Management Intelligence
        </div>

        <h1 className="page-title">AI Insights</h1>
        <p className="muted-text mt-2">
          AI-generated observations about team productivity, project risks and operational improvements.
        </p>
      </div>

      <section className="glass-card p-7 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black mb-2">
              Manager Intelligence Summary
            </h2>
            <p className="text-slate-400">
              Refresh insights after new tasks, worklogs or project updates.
            </p>
          </div>

          <button
            onClick={fetchInsights}
            disabled={loading}
            className="primary-btn flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
            Refresh Insights
          </button>
        </div>
      </section>

      {loading ? (
        <div className="glass-card p-8 flex items-center gap-3 text-cyan-300">
          <Loader2 className="animate-spin" />
          Generating AI insights...
        </div>
      ) : insights.length === 0 ? (
        <section className="glass-card p-12 text-center">
          <Sparkles className="text-cyan-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-black mb-2">No insights yet</h2>
          <p className="text-slate-400">
            Add tasks and worklogs to generate AI-powered team insights.
          </p>
        </section>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {insights.map((item, index) => (
            <InsightCard key={index} index={index + 1} text={item} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

const InsightCard = ({ index, text }) => (
  <div className="glass-card glass-card-hover p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 font-black">
        {index}
      </div>

      <h3 className="font-black text-lg flex items-center gap-2">
        <AlertTriangle className="text-cyan-400" size={18} />
        Insight
      </h3>
    </div>

    <p className="text-slate-300 leading-relaxed">{text}</p>
  </div>
);

export default ManagerInsights;