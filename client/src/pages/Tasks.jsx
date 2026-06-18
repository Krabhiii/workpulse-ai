import React, { useEffect, useState } from "react";
import {
  CheckSquare,
  Plus,
  Loader2,
  User,
  FolderKanban,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function Tasks() {
  const { userData } = useSelector((state) => state.user);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const taskUrl =
        userData?.role === "manager" ? "/api/task/all" : "/api/task/my";

      const taskRes = await api.get(taskUrl);
      const projectRes = await api.get("/api/project/all");

      setTasks(taskRes.data || []);
      setProjects(projectRes.data || []);
    } catch (error) {
      console.log("TASK FETCH ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!title.trim() || !project || !assignedTo) {
      alert("Title, project and assigned employee are required");
      return;
    }

    try {
      await api.post("/api/task/create", {
        title,
        description,
        project,
        assignedTo,
        priority,
        deadline,
        estimatedHours: Number(estimatedHours || 0),
      });

      setTitle("");
      setDescription("");
      setProject("");
      setAssignedTo("");
      setPriority("medium");
      setDeadline("");
      setEstimatedHours("");

      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Task creation failed");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      setUpdatingId(taskId);

      await api.patch(`/api/task/status/${taskId}`, {
        status,
      });

      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingId("");
    }
  };

  useEffect(() => {
    if (userData) {
      fetchData();
    }
  }, [userData]);

  const selectedProject = projects.find((p) => p._id === project);
  const teamMembers = selectedProject?.teamMembers || [];

  const todo = tasks.filter((t) => t.status === "todo");
  const progress = tasks.filter((t) => t.status === "in-progress");
  const blocked = tasks.filter((t) => t.status === "blocked");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <CheckSquare size={16} />
          Task Management
        </div>

        <h1 className="page-title">Tasks</h1>

        <p className="muted-text mt-2">
          {userData?.role === "manager"
            ? "Create, assign and monitor team tasks."
            : "View your assigned tasks and update progress."}
        </p>
      </div>

      {userData?.role === "manager" && (
        <section className="glass-card p-6 mb-8">
          <h2 className="text-xl font-black mb-5 flex items-center gap-2">
            <Plus className="text-cyan-400" />
            Create New Task
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className="input"
              value={project}
              onChange={(e) => {
                setProject(e.target.value);
                setAssignedTo("");
              }}
            >
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>

            <select
              className="input"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={!project}
            >
              <option value="">
                {project ? "Select employee" : "Select project first"}
              </option>

              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} - {member.email}
                </option>
              ))}
            </select>

            <select
              className="input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              className="input"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <input
              className="input"
              type="number"
              placeholder="Estimated hours"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
            />

            <textarea
              className="input md:col-span-2 min-h-[100px]"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button onClick={createTask} className="primary-btn md:col-span-2">
              Create Task
            </button>
          </div>
        </section>
      )}

      {loading ? (
        <div className="glass-card p-8 flex items-center gap-3 text-cyan-300">
          <Loader2 className="animate-spin" />
          Loading tasks...
        </div>
      ) : (
        <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-5">
          <TaskColumn
            title="Todo"
            tasks={todo}
            updateStatus={updateStatus}
            updatingId={updatingId}
            userRole={userData?.role}
          />

          <TaskColumn
            title="In Progress"
            tasks={progress}
            updateStatus={updateStatus}
            updatingId={updatingId}
            userRole={userData?.role}
          />

          <TaskColumn
            title="Blocked"
            tasks={blocked}
            updateStatus={updateStatus}
            updatingId={updatingId}
            userRole={userData?.role}
          />

          <TaskColumn
            title="Completed"
            tasks={completed}
            updateStatus={updateStatus}
            updatingId={updatingId}
            userRole={userData?.role}
          />
        </div>
      )}
    </DashboardLayout>
  );
}

const TaskColumn = ({ title, tasks, updateStatus, updatingId, userRole }) => (
  <section className="glass-card p-5">
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-black text-lg">{title}</h2>

      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
        {tasks.length}
      </span>
    </div>

    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500">No tasks</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            updateStatus={updateStatus}
            updatingId={updatingId}
            userRole={userRole}
          />
        ))
      )}
    </div>
  </section>
);

const TaskCard = ({ task, updateStatus, updatingId, userRole }) => {
  const isUpdating = updatingId === task._id;

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-5 hover:-translate-y-1 transition-all shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex justify-between gap-3 mb-3">
        <h3 className="font-black text-lg">{task.title}</h3>

        <span
          className={`h-fit px-3 py-1 rounded-full text-xs border capitalize ${
            task.priority === "high"
              ? "text-red-300 border-red-400/30 bg-red-500/10"
              : task.priority === "medium"
              ? "text-yellow-300 border-yellow-400/30 bg-yellow-500/10"
              : "text-emerald-300 border-emerald-400/30 bg-emerald-500/10"
          }`}
        >
          {task.priority}
        </span>
      </div>

      <p className="text-sm text-slate-400 mb-4">
        {task.description || "No description"}
      </p>

      <div className="space-y-2 text-xs text-slate-400 mb-4">
        <p className="flex items-center gap-2">
          <FolderKanban size={14} className="text-cyan-400" />
          {task.project?.title || "No project"}
        </p>

        {task.assignedTo && (
          <p className="flex items-center gap-2">
            <User size={14} className="text-cyan-400" />
            {task.assignedTo.name || task.assignedTo.email}
          </p>
        )}

        <p className="flex items-center gap-2">
          <Clock size={14} className="text-cyan-400" />
          {task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "No deadline"}
        </p>

        <p className="capitalize">
          Status: <span className="text-white">{task.status}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {task.status !== "in-progress" && task.status !== "completed" && (
          <button
            disabled={isUpdating}
            onClick={() => updateStatus(task._id, "in-progress")}
            className="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Start"}
          </button>
        )}

        {task.status !== "blocked" && task.status !== "completed" && (
          <button
            disabled={isUpdating}
            onClick={() => updateStatus(task._id, "blocked")}
            className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 text-xs disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Block"}
          </button>
        )}

        {task.status !== "completed" && (
          <button
            disabled={isUpdating}
            onClick={() => updateStatus(task._id, "completed")}
            className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Complete"}
          </button>
        )}

        {userRole === "manager" && task.status !== "todo" && (
          <button
            disabled={isUpdating}
            onClick={() => updateStatus(task._id, "todo")}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs disabled:opacity-50"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default Tasks;