import React, { useState } from "react";
import { api, setCurrentUser } from "../services/api";
import { LogIn, UserPlus, KeyRound, ShieldAlert, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    identifier: "",
  });

  const [totpRequired, setTotpRequired] = useState(false);
  const [totpToken, setTotpToken] = useState("");
  const [userIdForTotp, setUserIdForTotp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (totpRequired) {
        // Submit standard login again but with totpToken
        const res = await api.auth.login({
          identifier: formData.identifier,
          password: formData.password,
          totpToken: totpToken,
        });

        setCurrentUser(res.data.user);
        setSuccessMsg("Logged in successfully!");
        setTimeout(() => {
          onAuthSuccess(res.data.user);
        }, 800);
        return;
      }

      if (isLogin) {
        const res = await api.auth.login({
          identifier: formData.identifier,
          password: formData.password,
        });

        // The response might be { success: true, message: "...", data: { requireTotp: true, userId: "..." } }
        if (res.data?.requireTotp) {
          setTotpRequired(true);
          setUserIdForTotp(res.data.userId);
          setLoading(false);
          return;
        }

        // Standard successful login
        setCurrentUser(res.data.user);
        setSuccessMsg("Logged in successfully!");
        setTimeout(() => {
          onAuthSuccess(res.data.user);
        }, 800);
      } else {
        const res = await api.auth.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        // Registration success
        setCurrentUser(res.data.user);
        setSuccessMsg("Registered successfully!");
        setTimeout(() => {
          onAuthSuccess(res.data.user);
        }, 800);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "1rem" }}>
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
            {totpRequired ? "Two-Factor Auth" : isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {totpRequired
              ? "Enter the 6-digit verification code from your authenticator app."
              : isLogin ? "Access your multi-user portfolio builder" : "Get started by creating your user profile"}
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="error-banner">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="error-banner" style={{ background: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.2)", color: "#a7f3d0" }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {totpRequired ? (
            /* TOTP code input */
            <div className="form-group">
              <label className="form-label" htmlFor="totpToken">Verification Code</label>
              <input
                type="text"
                id="totpToken"
                name="totpToken"
                className="form-input"
                placeholder="123456"
                maxLength={6}
                required
                value={totpToken}
                onChange={(e) => setTotpToken(e.target.value)}
                style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.3em", padding: "0.5rem" }}
              />
            </div>
          ) : (
            /* Standard Auth Fields */
            <>
              {isLogin ? (
                <div className="form-group">
                  <label className="form-label" htmlFor="identifier">Username or Email</label>
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    className="form-input"
                    placeholder="jane_doe or jane@example.com"
                    required
                    value={formData.identifier}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="username">Username </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-input"
                      placeholder="jane_doe"
                      required
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder="jane@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="form-label" htmlFor="password">Password</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}><input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                  {isPasswordVisible ?
                    <EyeOff className="icon" size={18} style={{ position: "absolute", right: "1rem", cursor: "pointer" }} onClick={() => setIsPasswordVisible(!isPasswordVisible)} /> :
                    <Eye className="icon" size={18} style={{ position: "absolute", right: "1rem", cursor: "pointer" }} onClick={() => setIsPasswordVisible(!isPasswordVisible)} />}
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.75rem", marginTop: "1rem" }} disabled={loading}>
            {loading ? (
              <span className="spinner">Authenticating...</span>
            ) : totpRequired ? (
              <>
                <KeyRound size={18} /> Verify & Log In
              </>
            ) : isLogin ? (
              <>
                <LogIn size={18} /> Sign In
              </>
            ) : (
              <>
                <UserPlus size={18} /> Sign Up
              </>
            )}
          </button>
        </form>

        {/* Footer switch */}
        {!totpRequired && (
          <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontWeight: "600",
                cursor: "pointer",
                padding: "0 0.25rem",
              }}
            >
              {isLogin ? "Register here" : "Sign In here"}
            </button>
          </div>
        )}

        {totpRequired && (
          <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem" }}>
            <button
              onClick={() => {
                setTotpRequired(false);
                setTotpToken("");
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              Back to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
