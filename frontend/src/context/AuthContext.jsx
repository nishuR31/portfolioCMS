import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, clearCurrentUser } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const current = await getCurrentUser();
        setUser(current);
      } catch (error) {
        console.error("Failed to fetch user session", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    // Listen to auth expiration event
    const handleAuthExpired = () => {
      setUser(null);
    };
    window.addEventListener("auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
