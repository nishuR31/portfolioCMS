import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { 
  User, Briefcase, GraduationCap, FolderGit2, Trophy, 
  Settings, Plus, Trash2, Edit3, X, Check, ExternalLink,
  ShieldAlert, CheckCircle2
} from "lucide-react";

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    headline: "", bio: "", location: "", avatarUrl: "", resumeUrl: "",
    github: "", linkedin: "", twitter: "", website: ""
  });
  
  // Lists for other models
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [hackathonList, setHackathonList] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [certificationList, setCertificationList] = useState([]);
  const [achievementList, setAchievementList] = useState([]);

  // Form states
  const [editId, setEditId] = useState(null); // ID of item being edited
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadTabContent(activeTab);
  }, [activeTab]);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const loadTabContent = async (tab) => {
    setError("");
    setLoading(true);
    setEditId(null);
    setFormData({});

    try {
      switch (tab) {
        case "profile":
          const prof = await api.portfolio.getProfile(user.id);
          if (prof.data) setProfile(prof.data);
          break;
        case "education":
          const edu = await api.portfolio.getEducation(user.id);
          setEducationList(edu.data || []);
          break;
        case "experience":
          const exp = await api.portfolio.getExperience(user.id);
          setExperienceList(exp.data || []);
          break;
        case "projects":
          const proj = await api.portfolio.getProjects(user.id);
          setProjectList(proj.data || []);
          break;
        case "hackathons":
          const hack = await api.portfolio.getHackathons(user.id);
          setHackathonList(hack.data || []);
          break;
        case "skills":
          const sk = await api.portfolio.getSkills(user.id);
          setSkillList(sk.data || []);
          break;
        case "certifications":
          const cert = await api.portfolio.getCertifications(user.id);
          setCertificationList(cert.data || []);
          break;
        case "achievements":
          const ach = await api.portfolio.getAchievements(user.id);
          setAchievementList(ach.data || []);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(err);
      if (err.status !== 404) {
        setError("Failed to fetch data: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Profile Save
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.portfolio.upsertProfile(profile);
      setProfile(res.data);
      showSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Generic Create/Update Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let dataToSend = { ...formData };
      
      // Special conversions
      if (activeTab === "projects" && typeof dataToSend.techStack === "string") {
        dataToSend.techStack = dataToSend.techStack.split(",").map(t => t.trim()).filter(Boolean);
      }
      if (activeTab === "hackathons" && dataToSend.teamSize) {
        dataToSend.teamSize = parseInt(dataToSend.teamSize, 10);
      }

      if (editId) {
        // Update
        await api.portfolio[`update${capitalize(activeTab)}`](editId, dataToSend);
        showSuccess(`${capitalize(activeTab)} updated successfully!`);
      } else {
        // Create
        await api.portfolio[`create${capitalize(activeTab)}`](dataToSend);
        showSuccess(`${capitalize(activeTab)} added successfully!`);
      }
      
      setFormData({});
      setEditId(null);
      loadTabContent(activeTab);
    } catch (err) {
      setError(err.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  // Generic Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setError("");
    try {
      await api.portfolio[`delete${capitalize(activeTab)}`](id);
      showSuccess("Item deleted successfully!");
      loadTabContent(activeTab);
    } catch (err) {
      setError(err.message || "Failed to delete item");
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    
    // Format dates for HTML date inputs (yyyy-MM-dd)
    const formatted = { ...item };
    Object.keys(formatted).forEach(key => {
      if ((key.toLowerCase().includes("date") || key === "startDate" || key === "endDate") && formatted[key]) {
        formatted[key] = formatted[key].substring(0, 10);
      }
    });

    if (activeTab === "projects" && Array.isArray(formatted.techStack)) {
      formatted.techStack = formatted.techStack.join(", ");
    }

    setFormData(formatted);
  };

  const capitalize = (str) => {
    if (str === "projects") return "Project";
    if (str === "hackathons") return "Hackathon";
    if (str === "skills") return "Skill";
    if (str === "certifications") return "Certification";
    if (str === "achievements") return "Achievement";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "2rem 1rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
      {/* Header Panel */}
      <div className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Hello, {user.name}!</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Manage your resume data or view your public profile.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <a href={`/#/user/${user.id}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ textDecoration: "none" }}>
            <ExternalLink size={16} /> Public Portfolio
          </a>
          <button onClick={onLogout} className="btn btn-danger">Sign Out</button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "2rem" }} className="grid-2">
        
        {/* Navigation Sidebar */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", padding: "1rem", gap: "0.25rem", height: "fit-content" }}>
          {[
            { id: "profile", label: "Profile", icon: <User size={18} /> },
            { id: "education", label: "Education", icon: <GraduationCap size={18} /> },
            { id: "experience", label: "Experience", icon: <Briefcase size={18} /> },
            { id: "projects", label: "Projects", icon: <FolderGit2 size={18} /> },
            { id: "hackathons", label: "Hackathons", icon: <Trophy size={18} /> },
            { id: "skills", label: "Skills", icon: <Settings size={18} /> },
            { id: "certifications", label: "Certifications", icon: <GraduationCap size={18} /> },
            { id: "achievements", label: "Achievements", icon: <Trophy size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                background: activeTab === tab.id ? "var(--primary-gradient)" : "none",
                border: "none",
                color: activeTab === tab.id ? "white" : "var(--text-secondary)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-primary)",
                fontWeight: "500",
                transition: "var(--transition)"
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Workspace panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Notifications */}
          {error && (
            <div className="error-banner animate-fade-in">
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="error-banner animate-fade-in" style={{ background: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.2)", color: "#a7f3d0" }}>
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* Profile Form */}
          {activeTab === "profile" && (
            <div className="glass-panel animate-fade-in" style={{ padding: "2rem" }}>
              <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>Edit Profile</h3>
              <form onSubmit={handleProfileSave}>
                <div className="form-group">
                  <label className="form-label">Headline</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Full Stack Engineer | React & Bun Specialist"
                    value={profile.headline || ""}
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Tell visitors about yourself, your skills, and what you build..."
                    value={profile.bio || ""}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="San Francisco, CA"
                      value={profile.location || ""}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Website URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://myportfolio.com"
                      value={profile.website || ""}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Avatar Image URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://images.com/myavatar.png"
                      value={profile.avatarUrl || ""}
                      onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Resume PDF URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://drive.google.com/resume.pdf"
                      value={profile.resumeUrl || ""}
                      onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">GitHub URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://github.com/username"
                      value={profile.github || ""}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://linkedin.com/in/username"
                      value={profile.linkedin || ""}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row" style={{ marginBottom: "1.5rem" }}>
                  <div className="form-group">
                    <label className="form-label">Twitter/X URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://x.com/username"
                      value={profile.twitter || ""}
                      onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  Save Profile Settings
                </button>
              </form>
            </div>
          )}

          {/* CRUD Workspace for lists (Education, Experience, Project, Hackathon, Skill, Certifications, Achievements) */}
          {activeTab !== "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              
              {/* Form Card (Add/Edit) */}
              <div className="glass-panel animate-fade-in" style={{ padding: "2rem" }}>
                <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                  {editId ? `Edit ${capitalize(activeTab)}` : `Add New ${capitalize(activeTab)}`}
                </h3>

                <form onSubmit={handleFormSubmit}>
                  {activeTab === "education" && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Institution Name *</label>
                          <input type="text" className="form-input" required placeholder="University of Science" value={formData.institution || ""} onChange={(e) => setFormData({...formData, institution: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Degree *</label>
                          <input type="text" className="form-input" required placeholder="Bachelor of Science" value={formData.degree || ""} onChange={(e) => setFormData({...formData, degree: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Field of Study</label>
                          <input type="text" className="form-input" placeholder="Computer Science" value={formData.fieldOfStudy || ""} onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Grade / GPA</label>
                          <input type="text" className="form-input" placeholder="3.8 / 4.0" value={formData.grade || ""} onChange={(e) => setFormData({...formData, grade: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Start Date *</label>
                          <input type="date" className="form-input" required value={formData.startDate || ""} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">End Date</label>
                          <input type="date" className="form-input" disabled={formData.isCurrent} value={formData.endDate || ""} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Institution Logo URL</label>
                          <input type="url" className="form-input" placeholder="https://image.com/logo.png" value={formData.logoUrl || ""} onChange={(e) => setFormData({...formData, logoUrl: e.target.value})} />
                        </div>
                        <div className="form-group" style={{ justifyContent: "center" }}>
                          <label className="form-checkbox">
                            <input type="checkbox" checked={formData.isCurrent || false} onChange={(e) => setFormData({...formData, isCurrent: e.target.checked, endDate: e.target.checked ? null : formData.endDate})} />
                            Currently studying here
                          </label>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" placeholder="Special achievements, coursework details..." value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                      </div>
                    </>
                  )}

                  {activeTab === "experience" && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Company *</label>
                          <input type="text" className="form-input" required placeholder="Google Inc." value={formData.company || ""} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Role *</label>
                          <input type="text" className="form-input" required placeholder="Software Engineer" value={formData.role || ""} onChange={(e) => setFormData({...formData, role: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Experience Type</label>
                          <select className="form-select" value={formData.type || "FULL_TIME"} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="INTERNSHIP">Internship</option>
                            <option value="FREELANCE">Freelance</option>
                            <option value="CONTRACT">Contract</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Location</label>
                          <input type="text" className="form-input" placeholder="Mountain View, CA (Remote)" value={formData.location || ""} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Start Date *</label>
                          <input type="date" className="form-input" required value={formData.startDate || ""} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">End Date</label>
                          <input type="date" className="form-input" disabled={formData.isCurrent} value={formData.endDate || ""} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Company Website URL</label>
                          <input type="url" className="form-input" placeholder="https://google.com" value={formData.companyUrl || ""} onChange={(e) => setFormData({...formData, companyUrl: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Company Logo URL</label>
                          <input type="url" className="form-input" placeholder="https://image.com/logo.png" value={formData.logoUrl || ""} onChange={(e) => setFormData({...formData, logoUrl: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group" style={{ marginBottom: "1rem" }}>
                        <label className="form-checkbox">
                          <input type="checkbox" checked={formData.isCurrent || false} onChange={(e) => setFormData({...formData, isCurrent: e.target.checked, endDate: e.target.checked ? null : formData.endDate})} />
                          Currently working in this role
                        </label>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" placeholder="Implemented core features, refactored database layout, managed engineering teams..." value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                      </div>
                    </>
                  )}

                  {activeTab === "projects" && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Project Title *</label>
                          <input type="text" className="form-input" required placeholder="E-Commerce API Service" value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Tech Stack (comma separated) *</label>
                          <input type="text" className="form-input" required placeholder="React, Node.js, Prisma, PostgreSQL" value={formData.techStack || ""} onChange={(e) => setFormData({...formData, techStack: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Github Code URL</label>
                          <input type="url" className="form-input" placeholder="https://github.com/project" value={formData.githubUrl || ""} onChange={(e) => setFormData({...formData, githubUrl: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Live App URL</label>
                          <input type="url" className="form-input" placeholder="https://project.com" value={formData.liveUrl || ""} onChange={(e) => setFormData({...formData, liveUrl: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Start Date</label>
                          <input type="date" className="form-input" value={formData.startDate || ""} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">End Date</label>
                          <input type="date" className="form-input" value={formData.endDate || ""} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Showcase Image URL</label>
                          <input type="url" className="form-input" placeholder="https://image.com/project.png" value={formData.imageUrl || ""} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
                        </div>
                        <div className="form-group" style={{ justifyContent: "center" }}>
                          <label className="form-checkbox">
                            <input type="checkbox" checked={formData.isFeatured || false} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} />
                            Feature this project on main showcase
                          </label>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" placeholder="Describe project features, design decisions, and system constraints..." value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                      </div>
                    </>
                  )}

                  {activeTab === "hackathons" && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Hackathon Name *</label>
                          <input type="text" className="form-input" required placeholder="Global AI Hackathon" value={formData.name || ""} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Organizer</label>
                          <input type="text" className="form-input" placeholder="OpenAI / Devpost" value={formData.organizer || ""} onChange={(e) => setFormData({...formData, organizer: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Position Secured</label>
                          <input type="text" className="form-input" placeholder="1st Place / Finalist" value={formData.position || ""} onChange={(e) => setFormData({...formData, position: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Award Name</label>
                          <input type="text" className="form-input" placeholder="$5000 Cash Prize & API Credits" value={formData.award || ""} onChange={(e) => setFormData({...formData, award: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Team Size</label>
                          <input type="number" min={1} className="form-input" placeholder="4" value={formData.teamSize || ""} onChange={(e) => setFormData({...formData, teamSize: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Hackathon Date</label>
                          <input type="date" className="form-input" value={formData.date || ""} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Project Details URL</label>
                          <input type="url" className="form-input" placeholder="https://devpost.com/software/my-app" value={formData.projectUrl || ""} onChange={(e) => setFormData({...formData, projectUrl: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Certificate URL</label>
                          <input type="url" className="form-input" placeholder="https://certificate.com/image.png" value={formData.certificateUrl || ""} onChange={(e) => setFormData({...formData, certificateUrl: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" placeholder="Briefly describe what your team designed, build constraints, and technology APIs integrated..." value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                      </div>
                    </>
                  )}

                  {activeTab === "skills" && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Skill Name *</label>
                          <input type="text" className="form-input" required placeholder="JavaScript" value={formData.name || ""} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Category *</label>
                          <input type="text" className="form-input" required placeholder="Frontend / Backend / Database / DevOps" value={formData.category || ""} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Proficiency Level</label>
                          <select className="form-select" value={formData.proficiency || "INTERMEDIATE"} onChange={(e) => setFormData({...formData, proficiency: e.target.value})}>
                            <option value="BEGINNER">Beginner</option>
                            <option value="INTERMEDIATE">Intermediate</option>
                            <option value="ADVANCED">Advanced</option>
                            <option value="EXPERT">Expert</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Icon Image URL</label>
                          <input type="url" className="form-input" placeholder="https://devicons.com/js.svg" value={formData.iconUrl || ""} onChange={(e) => setFormData({...formData, iconUrl: e.target.value})} />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "certifications" && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Certification Name *</label>
                          <input type="text" className="form-input" required placeholder="AWS Solutions Architect" value={formData.name || ""} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Issuer *</label>
                          <input type="text" className="form-input" required placeholder="Amazon Web Services" value={formData.issuer || ""} onChange={(e) => setFormData({...formData, issuer: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Credential ID</label>
                          <input type="text" className="form-input" placeholder="AWS-12345ABC" value={formData.credentialId || ""} onChange={(e) => setFormData({...formData, credentialId: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Credential Verification URL</label>
                          <input type="url" className="form-input" placeholder="https://aws.verify/123" value={formData.credentialUrl || ""} onChange={(e) => setFormData({...formData, credentialUrl: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Issue Date *</label>
                          <input type="date" className="form-input" required value={formData.issueDate || ""} onChange={(e) => setFormData({...formData, issueDate: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Expiry Date</label>
                          <input type="date" className="form-input" value={formData.expiryDate || ""} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Issuer Logo URL</label>
                          <input type="url" className="form-input" placeholder="https://image.com/aws-logo.png" value={formData.logoUrl || ""} onChange={(e) => setFormData({...formData, logoUrl: e.target.value})} />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "achievements" && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Achievement Title *</label>
                          <input type="text" className="form-input" required placeholder="Dean's List / Hackathon Winner" value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Date Completed</label>
                          <input type="date" className="form-input" value={formData.date || ""} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">External Proof URL</label>
                          <input type="url" className="form-input" placeholder="https://news.university.edu/dean-list" value={formData.url || ""} onChange={(e) => setFormData({...formData, url: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Badge/Icon (Name or URL)</label>
                          <input type="text" className="form-input" placeholder="Trophy / Star" value={formData.icon || ""} onChange={(e) => setFormData({...formData, icon: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" placeholder="Describe the accomplishment details..." value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                      </div>
                    </>
                  )}

                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {editId ? <Check size={18} /> : <Plus size={18} />} 
                      {editId ? "Update Entry" : "Add Entry"}
                    </button>
                    {editId && (
                      <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setFormData({}); }}>
                        <X size={18} /> Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List View */}
              <div className="glass-panel" style={{ padding: "2rem" }}>
                <h3 style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                  Existing {capitalize(activeTab)} Items
                </h3>
                
                {loading ? (
                  <p style={{ color: "var(--text-secondary)" }}>Loading items...</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {activeTab === "education" && educationList.length === 0 && <p style={{ color: "var(--text-muted)" }}>No education entries found.</p>}
                    {activeTab === "education" && educationList.map((item) => (
                      <div key={item.id} className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ fontWeight: "600" }}>{item.degree} in {item.fieldOfStudy || "General"}</h4>
                          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.institution} ({item.startDate.substring(0,4)} - {item.isCurrent ? "Present" : item.endDate?.substring(0,4)})</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => startEdit(item)} className="btn btn-secondary btn-sm"><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}

                    {activeTab === "experience" && experienceList.length === 0 && <p style={{ color: "var(--text-muted)" }}>No professional experience entries found.</p>}
                    {activeTab === "experience" && experienceList.map((item) => (
                      <div key={item.id} className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ fontWeight: "600" }}>{item.role} @ {item.company}</h4>
                          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.type} | {item.startDate.substring(0,7)} to {item.isCurrent ? "Present" : item.endDate?.substring(0,7)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => startEdit(item)} className="btn btn-secondary btn-sm"><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}

                    {activeTab === "projects" && projectList.length === 0 && <p style={{ color: "var(--text-muted)" }}>No projects found.</p>}
                    {activeTab === "projects" && projectList.map((item) => (
                      <div key={item.id} className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ fontWeight: "600" }}>
                            {item.title} {item.isFeatured && <span className="badge badge-primary">Featured</span>}
                          </h4>
                          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.description}</p>
                          <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                            {item.techStack?.map((t, idx) => (
                              <span key={idx} className="badge badge-secondary">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => startEdit(item)} className="btn btn-secondary btn-sm"><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}

                    {activeTab === "hackathons" && hackathonList.length === 0 && <p style={{ color: "var(--text-muted)" }}>No hackathon achievements found.</p>}
                    {activeTab === "hackathons" && hackathonList.map((item) => (
                      <div key={item.id} className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ fontWeight: "600" }}>{item.name}</h4>
                          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.position || "Participant"} | {item.organizer}</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => startEdit(item)} className="btn btn-secondary btn-sm"><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}

                    {activeTab === "skills" && skillList.length === 0 && <p style={{ color: "var(--text-muted)" }}>No skills configured.</p>}
                    {activeTab === "skills" && skillList.map((item) => (
                      <div key={item.id} className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ fontWeight: "600" }}>{item.name}</h4>
                          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Category: {item.category} | Level: {item.proficiency}</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => startEdit(item)} className="btn btn-secondary btn-sm"><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}

                    {activeTab === "certifications" && certificationList.length === 0 && <p style={{ color: "var(--text-muted)" }}>No certifications configured.</p>}
                    {activeTab === "certifications" && certificationList.map((item) => (
                      <div key={item.id} className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ fontWeight: "600" }}>{item.name}</h4>
                          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Issuer: {item.issuer} | Date: {item.issueDate.substring(0,10)}</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => startEdit(item)} className="btn btn-secondary btn-sm"><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}

                    {activeTab === "achievements" && achievementList.length === 0 && <p style={{ color: "var(--text-muted)" }}>No achievements configured.</p>}
                    {activeTab === "achievements" && achievementList.map((item) => (
                      <div key={item.id} className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ fontWeight: "600" }}>{item.title}</h4>
                          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.description}</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => startEdit(item)} className="btn btn-secondary btn-sm"><Edit3 size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
