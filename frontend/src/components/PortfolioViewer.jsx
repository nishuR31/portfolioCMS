import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  Globe, FileText, MapPin, Briefcase, GraduationCap, Code, Trophy,
  ShieldAlert, Award, Calendar, ExternalLink
} from "lucide-react";

// Premium custom inline social icons to bypass dependency version issues
const Github = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = ({ size = 20, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);


export default function PortfolioViewer({ username }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPortfolio() {
      setLoading(true);
      setError("");
      try {
        const res = await api.portfolio.getFull(username);
        setData(res.data);
        console.table(res.data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load the public portfolio.");
      } finally {
        setLoading(false);
      }
    }
    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column", gap: "1rem" }}>
        <div className="spinner" style={{ width: "40px", height: "40px", border: "4px solid rgba(255,255,255,0.1)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <p style={{ color: "var(--text-secondary)" }}>Loading portfolio data...</p>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "1rem" }}>
        <div className="glass-panel" style={{ padding: "3rem", maxWidth: "500px", textAlign: "center" }}>
          <ShieldAlert size={48} color="var(--danger)" style={{ marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Portfolio Not Found</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            {error || "We couldn't retrieve any portfolio info for this user."}
          </p>
          <a href="/" className="btn btn-primary">Go to Homepage</a>
        </div>
      </div>
    );
  }

  const { user, profile, education, experience, projects, hackathons, skills, certifications, achievements } = data;

  // Group skills by category
  const skillsByCategory = (skills || []).reduce((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const getProficiencyColor = (level) => {
    switch (level) {
      case "EXPERT": return "var(--accent)";
      case "ADVANCED": return "var(--primary)";
      case "INTERMEDIATE": return "var(--success)";
      default: return "var(--text-muted)";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 1.5rem", display: "flex", flexDirection: "column", gap: "3rem", width: "100%" }}>

      {/* Profile/Hero Section */}
      <header className="glass-panel animate-fade-in" style={{ padding: "3rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.5rem" }}>

        {/* Avatar */}
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={user.name}
            style={{ width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(99, 102, 241, 0.4)", boxShadow: "var(--shadow-glow)" }}
          />
        ) : (
          <div style={{ width: "130px", height: "130px", borderRadius: "50%", background: "var(--primary-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", fontWeight: "700", border: "4px solid rgba(255,255,255,0.1)", boxShadow: "var(--shadow-glow)" }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* User Info */}
        <div>
          <h1 style={{ fontSize: "2.75rem", fontWeight: "800", marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>{user.name}</h1>
          {profile?.headline && (
            <p style={{ fontSize: "1.2rem", fontWeight: "500", color: "var(--primary)", marginBottom: "0.75rem" }}>{profile.headline}</p>
          )}
          {profile?.location && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              <MapPin size={16} />
              <span>{profile.location}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only" title="GitHub">
              <Github size={20} />
            </a>
          )}
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only" title="LinkedIn">
              <Linkedin size={20} />
            </a>
          )}
          {profile?.twitter && (
            <a href={profile.twitter} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only" title="Twitter/X">
              <Twitter size={20} />
            </a>
          )}
          {profile?.website && (
            <a href={profile.website} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon-only" title="Website">
              <Globe size={20} />
            </a>
          )}
          {profile?.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}>
              <FileText size={18} /> View Resume
            </a>
          )}
        </div>
      </header>

      {/* Bio Section */}
      {profile?.bio && (
        <section className="animate-fade-in">
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1rem" }}>About Me</h2>
          <div className="glass-panel" style={{ padding: "2rem", lineHeight: "1.7", color: "var(--text-secondary)" }}>
            <p style={{ whiteSpace: "pre-line" }}>{profile.bio}</p>
          </div>
        </section>
      )}

      {/* Experience & Education Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="grid-2 animate-fade-in">

        {/* Experience Timeline */}
        {experience && experience.length > 0 && (
          <section>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Briefcase size={24} color="var(--primary)" /> Experience
            </h2>
            <div className="timeline">
              {experience.map((item) => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "600" }}>{item.role}</h4>
                  <p style={{ color: "var(--primary)", fontSize: "0.9rem", fontWeight: "500" }}>
                    {item.companyUrl ? (
                      <a href={item.companyUrl} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                        {item.company} <ExternalLink size={12} style={{ display: "inline", marginLeft: "2px" }} />
                      </a>
                    ) : item.company}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                    {formatDate(item.startDate)} - {item.isCurrent ? "Present" : formatDate(item.endDate)}
                    {item.location && ` | ${item.location}`}
                  </p>
                  {item.description && (
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Timeline */}
        {education && education.length > 0 && (
          <section>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <GraduationCap size={24} color="var(--primary)" /> Education
            </h2>
            <div className="timeline">
              {education.map((item) => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "600" }}>{item.degree}</h4>
                  <p style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>{item.institution}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                    {formatDate(item.startDate)} - {item.isCurrent ? "Present" : formatDate(item.endDate)}
                    {item.grade && ` | GPA: ${item.grade}`}
                  </p>
                  {item.description && (
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Projects Grid */}
      {projects && projects.length > 0 && (
        <section className="animate-fade-in">
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Code size={24} color="var(--primary)" /> Projects
          </h2>
          <div className="grid-3">
            {projects.map((project) => (
              <div key={project.id} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>
                {project.imageUrl && (
                  <img src={project.imageUrl} alt={project.title} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px" }} />
                )}
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                    {project.title}
                    {project.isFeatured && <span className="badge badge-primary" style={{ marginLeft: "0.5rem" }}>Featured</span>}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", minHeight: "60px" }}>{project.description}</p>
                </div>
                {/* Tech Badges */}
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "auto" }}>
                  {project.techStack?.map((tech, idx) => (
                    <span key={idx} className="badge badge-secondary">{tech}</span>
                  ))}
                </div>
                {/* Links */}
                <div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--text-primary)", fontSize: "0.85rem", textDecoration: "none", fontWeight: "500" }}>
                      <Github size={16} /> Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--primary)", fontSize: "0.85rem", textDecoration: "none", fontWeight: "500" }}>
                      <Globe size={16} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Showcase */}
      {skills && skills.length > 0 && (
        <section className="animate-fade-in">
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1.5rem" }}>Skills & Expertise</h2>
          <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {Object.keys(skillsByCategory).map((cat) => (
              <div key={cat}>
                <h4 style={{ color: "var(--text-primary)", fontWeight: "600", fontSize: "1rem", marginBottom: "0.75rem" }}>{cat}</h4>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {skillsByCategory[cat].map((skill) => (
                    <div
                      key={skill.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.4rem 0.8rem",
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid rgba(255,255,255,0.05)`,
                        borderRadius: "var(--radius-md)"
                      }}
                    >
                      {skill.iconUrl && <img src={skill.iconUrl} alt={skill.name} style={{ width: "16px", height: "16px" }} />}
                      <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{skill.name}</span>
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: getProficiencyColor(skill.proficiency),
                          marginLeft: "4px"
                        }}
                        title={skill.proficiency}
                      ></span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hackathons, Certifications & Achievements Section */}
      {(hackathons?.length > 0 || certifications?.length > 0 || achievements?.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="grid-2 animate-fade-in">

          {/* Hackathons */}
          {hackathons && hackathons.length > 0 && (
            <section>
              <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Trophy size={24} color="var(--primary)" /> Hackathons
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {hackathons.map((hack) => (
                  <div key={hack.id} className="glass-card" style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                      <h4 style={{ fontWeight: "600", fontSize: "1.05rem" }}>{hack.name}</h4>
                      {hack.position && <span className="badge badge-primary">{hack.position}</span>}
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.25rem 0 0.5rem" }}>
                      {hack.organizer} {hack.date && `| ${formatDate(hack.date)}`}
                    </p>
                    {hack.description && <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{hack.description}</p>}
                    {hack.projectUrl && (
                      <a href={hack.projectUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--primary)", fontSize: "0.8rem", textDecoration: "none", marginTop: "0.5rem", fontWeight: "500" }}>
                        <Globe size={12} /> View Submission
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications & Achievements */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {certifications && certifications.length > 0 && (
              <section>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Award size={22} color="var(--primary)" /> Certifications
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {certifications.map((cert) => (
                    <div key={cert.id} className="glass-card" style={{ padding: "1rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      {cert.logoUrl && <img src={cert.logoUrl} alt={cert.issuer} style={{ width: "35px", height: "35px", objectFit: "contain" }} />}
                      <div>
                        <h4 style={{ fontWeight: "600", fontSize: "0.95rem" }}>{cert.name}</h4>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                          {cert.issuer} | Issued {formatDate(cert.issueDate)}
                        </p>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                            Verify <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {achievements && achievements.length > 0 && (
              <section>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Calendar size={22} color="var(--primary)" /> Key Achievements
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {achievements.map((ach) => (
                    <div key={ach.id} className="glass-card" style={{ padding: "1rem" }}>
                      <h4 style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-primary)" }}>{ach.title}</h4>
                      {ach.description && <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>{ach.description}</p>}
                      {ach.url && (
                        <a href={ach.url} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "2px", marginTop: "0.25rem" }}>
                          Learn more <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
