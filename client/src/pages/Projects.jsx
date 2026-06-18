import React, { useEffect, useState } from "react";
import { FolderKanban, Plus, Users, Calendar, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/axios";

function Projects() {
  const { userData } = useSelector((state) => state.user);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");

  const [memberProjectId, setMemberProjectId] = useState("");
  const [memberUserId, setMemberUserId] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/api/project/all");
      setProjects(res.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!title.trim()) return alert("Project title required");

    try {
      await api.post("/api/project/create", {
        title,
        description,
        priority,
        deadline,
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDeadline("");

      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || "Project creation failed");
    }
  };

  const addMember = async () => {
    if (!memberProjectId || !memberUserId) {
      return alert("Project ID and Employee User ID required");
    }

    try {
      await api.post("/api/project/add-member", {
        projectId: memberProjectId,
        userId: memberUserId,
      });

      setMemberProjectId("");
      setMemberUserId("");

      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add member");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-4">
          <FolderKanban size={16} />
          Project Workspace
        </div>

        <h1 className="page-title">Projects</h1>
        <p className="muted-text mt-2">
          Create projects, manage teams and monitor project structure.
        </p>
      </div>

      {userData?.role === "manager" && (
        <div className="grid xl:grid-cols-2 gap-6 mb-8">
          <section className="glass-card p-6">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <Plus className="text-cyan-400" />
              Create Project
            </h2>

            <div className="space-y-3">
              <input
                className="input"
                placeholder="Project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="input min-h-[110px]"
                placeholder="Project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

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

              <button onClick={createProject} className="primary-btn w-full">
                Create Project
              </button>
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <Users className="text-cyan-400" />
              Add Team Member
            </h2>

            <div className="space-y-3">
              <select
                className="input"
                value={memberProjectId}
                onChange={(e) => setMemberProjectId(e.target.value)}
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>

              <input
                className="input"
                placeholder="Employee User ID"
                value={memberUserId}
                onChange={(e) => setMemberUserId(e.target.value)}
              />

              <button onClick={addMember} className="primary-btn w-full">
                Add Member
              </button>

              <p className="text-xs text-slate-400">
                For now, paste employee MongoDB User ID. Later we’ll replace this
                with employee search/dropdown.
              </p>
            </div>
          </section>
        </div>
      )}

      <section className="glass-card p-6">
        <h2 className="text-xl font-black mb-5">All Projects</h2>

        {loading ? (
          <div className="flex items-center gap-3 text-cyan-300">
            <Loader2 className="animate-spin" />
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <p className="text-slate-400">No projects found.</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

const ProjectCard = ({ project }) => (
  <div className="glass-card glass-card-hover p-5">
    <div className="flex justify-between gap-3 mb-4">
      <div>
        <h3 className="text-xl font-black">{project.title}</h3>
        <p className="text-sm text-slate-400 mt-1">
          {project.description || "No description"}
        </p>
      </div>

      <span
        className={`h-fit px-3 py-1 rounded-full text-xs border capitalize ${
          project.priority === "high"
            ? "text-red-300 border-red-400/30 bg-red-500/10"
            : project.priority === "medium"
            ? "text-yellow-300 border-yellow-400/30 bg-yellow-500/10"
            : "text-emerald-300 border-emerald-400/30 bg-emerald-500/10"
        }`}
      >
        {project.priority}
      </span>
    </div>

    <div className="space-y-3 text-sm text-slate-300">
      <p className="flex items-center gap-2">
        <Users size={16} className="text-cyan-400" />
        Members: {project.teamMembers?.length || 0}
      </p>

      <p className="flex items-center gap-2">
        <Calendar size={16} className="text-cyan-400" />
        Deadline:{" "}
        {project.deadline
          ? new Date(project.deadline).toLocaleDateString()
          : "Not set"}
      </p>

      <p className="capitalize">Status: {project.status}</p>
    </div>
  </div>
);

export default Projects;