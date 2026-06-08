import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { LogIn, UserPlus, KeyRound, ShieldAlert, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import PixelBlast from "../components/PixelBlast";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

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
        const res = await api.auth.login({
          identifier: formData.identifier,
          password: formData.password,
          totpToken: totpToken,
        });

        setSuccessMsg("Logged in successfully!");
        setAuthUser(res.data.user);
        setTimeout(() => navigate("/dashboard"), 800);
        return;
      }

      if (isLogin) {
        const res = await api.auth.login({
          identifier: formData.identifier,
          password: formData.password,
        });

        if (res.data?.requireTotp) {
          setTotpRequired(true);
          setUserIdForTotp(res.data.userId);
          setSuccessMsg("Enter the TOTP code from your authenticator app.");
        } else {
          setSuccessMsg("Logged in successfully!");
          setAuthUser(res.data.user);
          setTimeout(() => navigate("/dashboard"), 800);
        }
      } else {
        await api.auth.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        setSuccessMsg("Registration successful! You can now log in.");
        setTimeout(() => setIsLogin(true), 1500);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-[calc(100vh-100px)] w-full p-6 md:p-12 flex-1 overflow-hidden">
      {/* Interactive PixelBlast Background */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#8b5cf6"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples={true}
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={true}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent={true}
        />
      </div>

      <div className="relative z-10 glass-panel w-full max-w-[440px] p-8 sm:p-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">
            {totpRequired ? "Two-Factor Auth" : isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-slate-400 text-sm">
            {totpRequired
              ? "Enter the 6-digit verification code."
              : isLogin ? "Access your multi-user portfolio builder" : "Get started by creating your user profile"}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 mb-6">
            <ShieldAlert size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 mb-6">
            <CheckCircle2 size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {totpRequired ? (
            <Input
              label="Verification Code"
              name="totpToken"
              placeholder="123456"
              maxLength={6}
              required
              value={totpToken}
              onChange={(e) => setTotpToken(e.target.value)}
              className="text-center text-2xl tracking-[0.3em] font-mono"
            />
          ) : (
            <div className="space-y-4">
              {isLogin ? (
                <Input
                  label="Username or Email"
                  name="identifier"
                  placeholder="jane_doe or jane@example.com"
                  required
                  value={formData.identifier}
                  onChange={handleChange}
                />
              ) : (
                <>
                  <Input
                    label="Username"
                    name="username"
                    placeholder="jane_doe"
                    required
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </>
              )}

              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-4 top-[38px] text-slate-400 hover:text-white transition-colors"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  tabIndex={-1}
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full mt-8 py-3 text-lg font-semibold flex items-center justify-center gap-2" disabled={loading}>
            {loading ? "Authenticating..." : totpRequired ? <><KeyRound size={20} /> Verify & Log In</> : isLogin ? <><LogIn size={20} /> Sign In</> : <><UserPlus size={20} /> Sign Up</>}
          </Button>
        </form>

        {!totpRequired && (
          <div className="text-center mt-8 text-sm">
            <span className="text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors px-1"
            >
              {isLogin ? "Register here" : "Sign In here"}
            </button>
          </div>
        )}

        {totpRequired && (
          <div className="text-center mt-8 text-sm">
            <button 
              type="button"
              onClick={() => { setTotpRequired(false); setTotpToken(""); setError(""); }} 
              className="text-slate-400 hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
