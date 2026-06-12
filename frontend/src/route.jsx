import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Privacy } from "./pages/Privacy";
import { FAQ } from "./pages/FAQ";
import { Docs } from "./pages/Docs";
import { NotFound } from "./pages/NotFound";
import Dashboard from "./components/Dashboard";
import PortfolioViewer from "./components/PortfolioViewer";
import { useAuth } from "./context/AuthContext";

export function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/user/:username" element={<PortfolioViewer />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
