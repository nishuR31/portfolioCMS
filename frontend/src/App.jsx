import React from "react";
import { Link, Navigate } from "react-router-dom";
import { GitBranch, Moon, Sun, LayoutDashboard, LogOut, GitBranchIcon, GitGraph } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { Home } from "./pages/Home.jsx";
import { AppRoutes } from "./route.jsx";

import Dock from "./components/Dock";
import { Home as HomeIcon, FileText, User as UserIcon, Settings, HelpCircle, FileJson } from "lucide-react";
import { SiGithub } from "react-icons/si";

export default function App() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const dockItems = [
    { icon: <HomeIcon size={18} />, label: 'Home', onClick: () => <Link to="/" /> },
    { icon: <FileText size={18} />, label: 'Docs', onClick: () => <Link to="/docs" /> },
    { icon: <HelpCircle size={18} />, label: 'FAQ', onClick: () => <Link to="/faq" /> },
    ...(user ? [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', onClick: () => <Link to="/dashboard" /> },
      { icon: <UserIcon size={18} />, label: 'Profile', onClick: () => <Link to={`/user/${user.username}`} /> },
    ] : [
      { icon: <UserIcon size={18} />, label: 'Login', onClick: () => <Link to="/login" /> }
    ])
  ];

  return (
    <div className="app-container">

      {/* Background glow layers */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Navigation Header */}
      <nav className="relative z-10 w-full flex items-center justify-around px-15 h-15 md:px-12 py-4 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-sm">
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link to="/" style={{ fontSize: "1.35rem", fontWeight: "700", textDecoration: "none", color: "var(--text-primary)", background: "var(--primary-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CMS Portfolio
          </Link>
          <div style={{ display: "flex", gap: "1.5rem" }} className="hidden md:flex">
            <Link to="/docs" style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: "500", fontSize: "0.95rem" }}>Docs</Link>
            <Link to="/faq" style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: "500", fontSize: "0.95rem" }}>FAQ</Link>
          </div>
          {user && <div style={{ display: "flex", gap: "1.5rem" }} className="hidden md:flex">
            {user.github && <a href={user.github} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: "500", fontSize: "0.95rem" }}>{user.github.split("/").pop() || "GitHub"}</a>}
            {user.linkedin && <a href={user.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: "500", fontSize: "0.95rem" }}>{user.linkedin.split("/").pop() || "Linkedin"}</a>}
            {user.twitter && <a href={user.twitter} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: "500", fontSize: "0.95rem" }}>{user.twitter.split("/").pop() || "Twitter"}</a>}
            {user.website && <a href={user.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: "500", fontSize: "0.95rem" }}>{user.website.split("/").pop() || "Website"}</a>}
          </div>}
        </div>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <button
            onClick={toggleTheme}
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", padding: "0.5rem" }}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {!loading && user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <span className="hidden md:inline" style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                {user.username}
              </span>
              <Link to="/dashboard" style={{ color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <LayoutDashboard size={18} /> <span className="hidden md:inline">Dashboard</span>
              </Link>
              <button
                onClick={logout}
                style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.95rem" }}
              >
                <LogOut size={18} /> <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            !loading && (
              <Link to="/login" style={{ textDecoration: "none", color: "var(--primary)", fontWeight: "600" }}>
                Sign In
              </Link>
            )
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-1 w-full max-w-[100vw] overflow-x-hidden pb-24">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading session...</div>
        ) : (<AppRoutes />)}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full p-6 md:p-8 backdrop-blur-md bg-white/5 border-t border-white/10 text-center text-md text-slate-400 mt-auto">
        <div className="flex justify-around flex-wrap flex-row gap-10 md:gap-10 mb-4">
          <Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
          <Link to="/docs" className="hover:text-white transition-colors duration-200">Documentation</Link>
          <Link to="/faq" className="hover:text-white transition-colors duration-200">FAQ</Link>
        </div>
        <div className="flex justify-center flex-wrap flex-row gap-10 md:gap-10 mb-4">

          <p>&copy; {new Date().getFullYear()} CMS Portfolio. All rights reserved</p>
          <a href="https://github.com/nishur31" target="_blank" rel="noreferrer" className="inline-flex items-center hover:text-white transition-colors duration-200">
            <SiGithub size={16} />
          </a>
        </div>
      </footer>

      {/* Floating Mac-like Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <Dock
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </div>
  );
}
