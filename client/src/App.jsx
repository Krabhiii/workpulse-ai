import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "./services/axios";
import { setLoadingUser, setUserData } from "./redux/userSlice";
import AppHome from "./pages/AppHome"
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import WorkLogs from "./pages/WorkLogs";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Insights from "./pages/Insights";
import Team from "./pages/Team";
import Assistant from "./pages/Assistant";

function ProtectedRoute({ children }) {
  const { userData } = useSelector((state) => state.user);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const dispatch = useDispatch();
  const { userData, loadingUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await api.get("/api/auth/current-user");
        dispatch(setUserData(res.data));
      } catch {
        dispatch(setUserData(null));
      } finally {
        dispatch(setLoadingUser(false));
      }
    };

    getCurrentUser();
  }, [dispatch]);

  if (loadingUser) {
    return (
      <div className="app-bg flex items-center justify-center text-cyan-300">
        Loading WorkPulse AI...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/app" />}
      />

      <Route
        path="/app"
        element={
    <ProtectedRoute>
      <AppHome />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/worklogs"
        element={
          <ProtectedRoute>
            <WorkLogs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
<Route
path="/team"
element={
  <ProtectedRoute>
    <Team />
  </ProtectedRoute>
}
/>
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <Insights />
          </ProtectedRoute>
        }
      />
      <Route
  path="/assistant"
  element={
    <ProtectedRoute>
      <Assistant />
    </ProtectedRoute>
  }
/>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;