import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import PortfolioViewer from "./components/PortfolioViewer";
import { getCurrentUser, clearAuthSession } from "./services/api";

export default function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [route, setRoute] = useState({ name: "home" });

  useEffect(() => {
    // Determine initial route
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/user/")) {
        const userId = hash.replace("#/user/", "");
        setRoute({ name: "portfolio", userId });
      } else {
        setRoute({ name: "home" });
      }
    };

    // Listen to hash changes
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
    clearAuthSession();
    setUser(null);
    window.location.hash = "";
  };

  return (
    <div className="app-container">
      {/* Background glow layers */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Navigation Header */}
      <nav className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", margin: "1rem", borderRadius: "var(--radius-md)" }}>
        <a href="/" style={{ fontSize: "1.35rem", fontWeight: "700", textDecoration: "none", color: "var(--text-primary)", background: "var(--primary-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          CMS Portfolio
        </a>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {user && (
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Signed in as <strong>{user.email}</strong>
            </span>
          )}
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textDecoration: "none" }}>
            GitHub
          </a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {route.name === "portfolio" ? (
          <PortfolioViewer userId={route.userId} />
        ) : user ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <Auth onAuthSuccess={handleAuthSuccess} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.85rem", borderTop: "1px solid var(--border-color)", marginTop: "auto" }}>
        &copy; {new Date().getFullYear()} Antigravity Portfolio Network. All rights reserved.
      </footer>
    </div>
  );
}
