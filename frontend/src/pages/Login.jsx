import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../api/client";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/login", { email, password });
      const token = response.data || response.data;
      console.log(token);
      if (token) {
        localStorage.setItem("token", token);

        // Decode token and redirect based on role
        const { jwtDecode } = await import("jwt-decode");
        const decoded = jwtDecode(token);
        // Assume roles property or array is available
        const role = decoded.role || decoded.roles || decoded.authorities;
        if (
          role === "CONDUCTOR" ||
          (Array.isArray(role) && role.includes("CONDUCTOR"))
        ) {
          navigate("/dashboard");
        } else if (
          role === "ADMIN" ||
          (Array.isArray(role) && role.includes("ADMIN"))
        ) {
          navigate("/admin-dashboard");
        } else {
          navigate("/student-dashboard"); // Assuming students have their own
        }
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Failed to login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-950 flex items-center justify-center p-4">
      {/* Dynamic Background Elements - Educational Blue Palette */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-blob" />
        <div
          className="absolute top-[20%] right-[-10%] w-[35%] h-[45%] rounded-full bg-sky-600/20 blur-[120px] animate-blob"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] animate-blob"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass rounded-2xl p-8 sm:p-10 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-50">
              Welcome Back Student
            </h1>
            <p className="text-slate-400">
              Sign in to continue your learning journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-slate-300"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    placeholder="student@university.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium text-slate-300"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-500 hover:from-blue-500 hover:via-sky-400 hover:to-indigo-400 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Enter Classroom
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>

            <p className="text-center text-slate-400 text-sm">
              New to the platform?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Enroll now
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
