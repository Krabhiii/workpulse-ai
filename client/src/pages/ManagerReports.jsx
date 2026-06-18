import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  FileText,
  Loader2,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Brain,
  ShieldAlert,
  Sparkles,
  Download,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function ManagerReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef(null);

  const generateReport = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/report/weekly");
      setReport(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      if (!reportRef.current) return;

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#020617",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210;
      const pageHeight = 295;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("WorkPulse-Weekly-Report.pdf");
    } catch (error) {
      console.log("PDF DOWNLOAD ERROR:", error);
      alert("Failed to download PDF");
    }
  };

  const metrics = report?.metrics;
  const aiReport = report?.aiReport;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <FileText size={16} />
          Manager Executive Report
        </div>

        <h1 className="page-title">Weekly AI Team Report</h1>

        <p className="muted-text mt-2">
          Team productivity, project health, risk signals and AI recommendations.
        </p>
      </div>

      <section className="glass-card glass-card-hover p-7 mb-8">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black mb-2">
              Generate AI Management Summary
            </h2>

            <p className="text-slate-400 max-w-2xl">
              Analyze projects, tasks, worklogs, confidence scores and risk data
              to produce a professional weekly management report.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={generateReport}
              disabled={loading}
              className="primary-btn flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Brain size={18} />
              )}

              {loading ? "Generating..." : "Generate Weekly Report"}
            </button>

            {report && (
              <button
                onClick={downloadPDF}
                className="secondary-btn flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>
            )}
          </div>
        </div>
      </section>

      {!report ? (
        <section className="glass-card p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-5 shadow-[0_0_60px_rgba(34,211,238,0.25)]">
            <Sparkles className="text-cyan-400" size={42} />
          </div>

          <h2 className="text-3xl font-black mb-3">
            No report generated yet
          </h2>

          <p className="text-slate-400 max-w-xl mx-auto">
            Click the generate button to create an AI-powered weekly report for
            management decisions.
          </p>
        </section>
      ) : (
        <div ref={reportRef} className="bg-[#020617] p-2 rounded-3xl">
          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
            <Card
              icon={<Activity />}
              title="Total Tasks"
              value={metrics?.totalTasks || 0}
            />

            <Card
              icon={<CheckCircle2 />}
              title="Completed"
              value={metrics?.completedTasks || 0}
            />

            <Card
              icon={<AlertTriangle />}
              title="Blocked"
              value={metrics?.blockedTasks || 0}
            />

            <Card
              icon={<ShieldAlert />}
              title="High Risk Logs"
              value={metrics?.highRiskLogs || 0}
            />

            <Card
              icon={<Brain />}
              title="Avg Confidence"
              value={`${metrics?.avgConfidence || 0}%`}
            />
          </div>

          <section className="glass-card p-7 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <h2 className="text-2xl font-black">
                AI Executive Summary
              </h2>

              <span
                className={`px-4 py-2 rounded-full text-sm border capitalize ${
                  aiReport?.overallHealth === "healthy"
                    ? "text-emerald-300 border-emerald-400/30 bg-emerald-500/10"
                    : aiReport?.overallHealth === "at-risk"
                    ? "text-red-300 border-red-400/30 bg-red-500/10"
                    : "text-yellow-300 border-yellow-400/30 bg-yellow-500/10"
                }`}
              >
                Overall Health: {aiReport?.overallHealth || "needs-attention"}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed text-lg">
              {aiReport?.summary || "No summary generated."}
            </p>
          </section>

          <div className="grid xl:grid-cols-3 gap-6">
            <ReportList
              title="Key Wins"
              items={aiReport?.keyWins || []}
              tone="green"
            />

            <ReportList
              title="Risks"
              items={aiReport?.risks || []}
              tone="red"
            />

            <ReportList
              title="Recommendations"
              items={aiReport?.recommendations || []}
              tone="cyan"
            />
          </div>
        </div>
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

const ReportList = ({ title, items, tone }) => {
  const toneClass =
    tone === "green"
      ? "text-emerald-300 border-emerald-400/20 bg-emerald-500/10"
      : tone === "red"
      ? "text-red-300 border-red-400/20 bg-red-500/10"
      : "text-cyan-300 border-cyan-400/20 bg-cyan-500/10";

  return (
    <section className="glass-card glass-card-hover p-6">
      <h2 className="text-xl font-black mb-4">{title}</h2>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-slate-400">No data available.</p>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl border text-sm leading-relaxed ${toneClass}`}
            >
              {item}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ManagerReports;