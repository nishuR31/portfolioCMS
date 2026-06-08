import React from "react";
import { motion } from "framer-motion";

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyle = {
    padding: "0.75rem 1.5rem",
    borderRadius: "var(--radius-md)",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "var(--transition)",
    outline: "none",
  };

  const variants = {
    primary: {
      background: "var(--primary-gradient)",
      color: "#fff",
      boxShadow: "var(--shadow-glow)",
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-color)",
    },
    danger: {
      background: "var(--danger)",
      color: "#fff",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary)",
    },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ ...baseStyle, ...variants[variant] }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};
