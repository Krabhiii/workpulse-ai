import React, { useState } from "react";
import {
  Brain,
  Loader2,
  User,
  Shield,
  ArrowRight,
} from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import { setUserData } from "../redux/userSlice";

function Login() {
  const [authMode, setAuthMode] = useState("login"); // login | register
  const [role, setRole] = useState("employee"); // employee | manager

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLogin = authMode === "login";

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const url = isLogin ? "/api/auth/login" : "/api/auth/register";

      const payload = isLogin
        ? { email, password }
        : { name, email, password, role };

      const res = await api.post(url, payload);

      dispatch(setUserData(res.data));
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setError("");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await api.post("/api/auth/google", {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        role,
      });

      dispatch(setUserData(res.data));
      navigate("/app");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || err.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="app-bg flex items-center justify-center px-4 py-10">
      <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-cyan-500/10 blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[550px] h-[550px] bg-violet-500/10 blur-[150px]" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* LEFT */}
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-5">
            <Brain size={16} />
            AI Workplace Intelligence
          </div>

          <h1 className="text-6xl font-black leading-tight mb-6">
            One platform for{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              real work visibility
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            Managers track project risk, employee workload and productivity
            confidence. Employees manage tasks and submit AI-validated worklogs.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8 max-w-xl">
            <MiniCard title="AI Validation" value="Worklogs" />
            <MiniCard title="Risk Engine" value="Burnout" />
            <MiniCard title="Dashboard" value="Manager" />
            <MiniCard title="Workspace" value="Employee" />
          </div>
        </div>

        {/* RIGHT AUTH CARD */}
        <div className="glass-card p-7 md:p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.45)]">
              <Brain />
            </div>

            <h2 className="text-3xl font-black">
              WorkPulse<span className="text-cyan-400">AI</span>
            </h2>
          </div>

          {/* AUTH MODE */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setAuthMode("login")}
              className={`rounded-2xl py-3 font-bold border transition ${
                authMode === "login"
                  ? "bg-cyan-500 text-white border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.35)]"
                  : "bg-white/5 border-white/10 text-slate-300"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setAuthMode("register")}
              className={`rounded-2xl py-3 font-bold border transition ${
                authMode === "register"
                  ? "bg-cyan-500 text-white border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.35)]"
                  : "bg-white/5 border-white/10 text-slate-300"
              }`}
            >
              Register
            </button>
          </div>

          {/* ROLE MODE */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setRole("employee")}
              className={`rounded-2xl p-4 border transition text-left ${
                role === "employee"
                  ? "bg-blue-500/20 border-blue-400/50"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <User className="text-blue-400 mb-2" />
              <h3 className="font-black">
                {isLogin ? "Login as Employee" : "Register as Employee"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tasks, worklogs and personal productivity.
              </p>
            </button>

            <button
              onClick={() => setRole("manager")}
              className={`rounded-2xl p-4 border transition text-left ${
                role === "manager"
                  ? "bg-violet-500/20 border-violet-400/50"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <Shield className="text-violet-400 mb-2" />
              <h3 className="font-black">
                {isLogin ? "Login as Manager" : "Register as Manager"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Team analytics, risk alerts and AI insights.
              </p>
            </button>
          </div>

          {!isLogin && (
            <input
              className="input mb-3"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className="input mb-3"
            placeholder={`${role === "manager" ? "Manager" : "Employee"} email`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input mb-4"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="mb-4 rounded-2xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="primary-btn w-full flex justify-center items-center gap-2 mb-4"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {isLogin
              ? role === "manager"
                ? "Login as Manager"
                : "Login as Employee"
              : role === "manager"
              ? "Register as Manager"
              : "Register as Employee"}
            {!loading && <ArrowRight size={18} />}
          </button>

          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="secondary-btn w-full flex justify-center items-center gap-3"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <GoogleIcon />
            )}

            Continue with Google as {role}
          </button>

          <p className="text-center text-slate-500 text-xs mt-5">
            Select employee or manager before continuing.
          </p>
        </div>
      </div>
    </div>
  );
}

const MiniCard = ({ title, value }) => (
  <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
    <p className="text-slate-400 text-sm">{title}</p>
    <h3 className="text-2xl font-black text-white mt-1">{value}</h3>
  </div>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

export default Login;