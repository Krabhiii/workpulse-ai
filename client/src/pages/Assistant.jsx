import React, { useEffect, useRef, useState } from "react";
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  User,
  Bot,
  MessageSquare,
  Zap,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function Assistant() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `👋 Welcome to WorkPulse AI

I can help you analyze:

• Team productivity
• Project health
• Employee performance
• Task bottlenecks
• Worklog risks
• Weekly progress

Try asking: "Which employee is performing best?"`,
    },
  ]);

  const suggestions = [
    "Which employee is performing best?",
    "Which project needs attention?",
    "Summarize this week's productivity",
    "Show blocked tasks",
    "Which team member has highest confidence?",
    "Which employee needs support?",
  ];

  useEffect(() => {
    const box = chatContainerRef.current;

    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }, [messages, loading]);

  const askAI = async (text) => {
    const prompt = text || question;

    if (!prompt.trim() || loading) return;

    try {
      setLoading(true);

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
        },
      ]);

      setQuestion("");

      const res = await api.post("/api/assistant/ask", {
        question: prompt,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.answer || "No response generated.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "Something went wrong while asking WorkPulse AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `👋 Chat cleared.

Ask me anything about your projects, tasks, worklogs, team performance, risks, or productivity.`,
      },
    ]);
  };

  return (
    <DashboardLayout>
      <div className="mb-8 mt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <Brain size={16} />
          AI Productivity Assistant
        </div>

        <h1 className="page-title">WorkPulse AI Assistant</h1>

        <p className="muted-text mt-2 max-w-3xl">
          Ask smart questions about projects, tasks, worklogs, employee
          performance, blockers, productivity confidence and team risk.
        </p>
      </div>

      <div className="grid xl:grid-cols-[340px_1fr] gap-6">
        <section className="glass-card p-6 h-fit">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black">Suggested Questions</h2>
              <p className="text-xs text-slate-400">Click to ask instantly</p>
            </div>
          </div>

          <div className="space-y-3">
            {suggestions.map((item, index) => (
              <button
                key={index}
                onClick={() => askAI(item)}
                disabled={loading}
                className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
              >
                <div className="flex items-start gap-3">
                  <Zap size={16} className="text-cyan-400 mt-1" />
                  <span className="text-slate-200 text-sm leading-relaxed">
                    {item}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-[#020617]/70 border border-white/10 p-5">
            <h3 className="font-black mb-2 flex items-center gap-2">
              <MessageSquare size={17} className="text-cyan-400" />
              What it can analyze
            </h3>

            <div className="space-y-2 text-sm text-slate-400">
              <p>• Project health and risks</p>
              <p>• Employee productivity</p>
              <p>• Blocked and pending tasks</p>
              <p>• Worklog quality and confidence</p>
            </div>
          </div>
        </section>

        <section className="glass-card p-0 flex flex-col h-[76vh] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_35px_rgba(34,211,238,0.35)]">
                <Bot size={22} />
              </div>

              <div>
                <h2 className="font-black text-xl">WorkPulse AI</h2>
                <p className="text-xs text-slate-400">
                  Context-aware assistant for your workspace
                </p>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 transition"
            >
              Clear
            </button>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-5 p-6 pr-3 custom-scroll"
          >
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}

            {loading && (
              <div className="flex gap-3">
                <Avatar type="assistant" />

                <div className="bg-white/5 border border-white/10 rounded-3xl px-5 py-4 flex items-center gap-3">
                  <Loader2 className="animate-spin text-cyan-300" size={18} />
                  <span className="text-slate-400 text-sm">
                    WorkPulse AI is analyzing workspace data...
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-white/10 bg-white/[0.03]">
            <div className="flex gap-3">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    askAI();
                  }
                }}
                placeholder="Ask WorkPulse AI..."
                rows={1}
                className="flex-1 resize-none bg-[#020617]/80 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10 transition text-slate-100 placeholder:text-slate-500"
              />

              <button
                onClick={() => askAI()}
                disabled={loading || !question.trim()}
                className="primary-btn min-w-[58px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Press Enter to send, Shift + Enter for new line.
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar type="assistant" />}

      <div
        className={`max-w-[82%] rounded-3xl px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)] ${
          isUser
            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
            : "bg-[#111827]/95 border border-white/10 text-slate-200"
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
          {content}
        </p>
      </div>

      {isUser && <Avatar type="user" />}
    </div>
  );
}

function Avatar({ type }) {
  const isUser = type === "user";

  return (
    <div
      className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
        isUser
          ? "bg-white/10 border border-white/10"
          : "bg-cyan-500/20 border border-cyan-400/20 text-cyan-300"
      }`}
    >
      {isUser ? <User size={18} /> : <Brain size={18} />}
    </div>
  );
}

export default Assistant;