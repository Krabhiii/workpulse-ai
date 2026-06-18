import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  ClipboardList,
  BarChart3,
  FileText,
  BrainCircuit,Users,Brain
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={19} /> },
  { name: "Projects", path: "/projects", icon: <FolderKanban size={19} /> },
  { name: "Tasks", path: "/tasks", icon: <CheckSquare size={19} /> },
  { name: "WorkLogs", path: "/worklogs", icon: <ClipboardList size={19} /> },
  { name: "Analytics", path: "/analytics", icon: <BarChart3 size={19} /> },
  { name: "Reports", path: "/reports", icon: <FileText size={19} /> },
  { name: "AI Insights", path: "/insights", icon: <BrainCircuit size={19} /> },
   { name: "Team", path: "/team", icon: <Users size={19} /> },
   {name: "AI Assistant",path: "/assistant",icon: <Brain size={19} />,},
];

function Sidebar() {
  return (
    <aside className="w-72 min-h-[calc(100vh-80px)] border-r border-white/10 bg-[#020617]/80 backdrop-blur-xl p-5 hidden lg:block">
      <div className="glass-card p-4 mb-6">
        <p className="text-xs text-slate-400">Workspace</p>
        <h2 className="font-black text-lg">Team Operations</h2>
      </div>

      <div className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_35px_rgba(14,165,233,0.35)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;