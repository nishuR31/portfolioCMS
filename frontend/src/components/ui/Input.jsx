import React, { forwardRef } from "react";

export const Input = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", marginBottom: "1rem" }}>
      {label && <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500" }}>{label}</label>}
      <input
        ref={ref}
        className={className}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          background: "var(--surface)",
          border: `1px solid ${error ? "var(--danger)" : "var(--border-color)"}`,
          borderRadius: "var(--radius-md)",
          color: "var(--text-primary)",
          fontSize: "1rem",
          outline: "none",
          transition: "var(--transition)",
          boxShadow: error ? "0 0 0 1px var(--danger)" : "none",
        }}
        {...props}
      />
      {error && <span style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
