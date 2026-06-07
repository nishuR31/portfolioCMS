import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import { GitBranch } from "lucide-react"
import Dashboard from "./components/Dashboard";
import PortfolioViewer from "./components/PortfolioViewer";
import { getCurrentUser, clearCurrentUser } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [route, setRoute] = useState({ name: "home" });



  useEffect(() => {
    // Fetch current user on mount
    const fetchUser = async () => {
      try {
        const current = await getCurrentUser();
        setUser(current);
      } catch (e) {
        console.error('Failed to fetch current user', e);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();

    // Determine initial route and handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/user/")) {
        const username = hash.replace("#/user/", "");
        setRoute({ name: "portfolio", username });
      } else {
        setRoute({ name: "home" });
      }
    };

    // Set up listeners after fetching user
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run on initial load

    // Listen to auth expiration event
    const handleAuthExpired = () => {
      setUser(null);
      setRoute({ name: "home" });
    };
    window.addEventListener("auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  const handleAuthSuccess = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    clearCurrentUser();
    setUser(null);
    window.location.hash = "";
  };

  return (
    <div className="app-container">
      {loadingUser && <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>}

      {/* Background glow layers */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Navigation Header */}
      <nav className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", margin: "1rem", borderRadius: "var(--radius-md)" }}>
        <a href="/" style={{ fontSize: "1.35rem", fontWeight: "700", textDecoration: "none", color: "var(--text-primary)", background: "var(--primary-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          CMS Portfolio
        </a>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {user && user.id && (
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Signed in as <strong>{user?.username ?? "N/A"}</strong>
              <br />
              ID: {user?.id ?? "N/A"}
              <br />
              Email: {user?.email ?? "N/A"}
            </span>
          )}
          {user?.github && <a href={user?.github} target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textDecoration: "none" }}>
            GitHub
          </a>}
          {user?.linkedin && <a href={user?.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textDecoration: "none" }}>
            Linkedin
          </a>}
          {user?.twitter && <a href={user?.twitter} target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textDecoration: "none" }}>
            Twitter
          </a>}
          {user?.website && <a href={user?.website} target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textDecoration: "none" }}>
            Website
          </a>}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {route.name === "portfolio" ? (
          <PortfolioViewer username={route.username} />
        ) : user ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <Auth onAuthSuccess={handleAuthSuccess} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.85rem", borderTop: "1px solid var(--border-color)", marginTop: "auto" }}>
        &copy; {new Date().getFullYear()} CMS Portfolio. All rights reserved.
        <GitBranch /><a href="https://github.com/nishur31" target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textDecoration: "none" }}>
        </a>
      </footer>
    </div >
  );
}
