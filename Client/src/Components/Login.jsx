import React, { useState } from "react";

import axios from "axios";
import { Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import Backdrop from "./Backdrop";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ensure the port matches your backend (2724)
      const res = await axios.post(" https://vpms-4neo.onrender.com/staff/login", formData);

      if (res.data.success) {
        const { token, user } = res.data;

        // 1. Store session data
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);

        // 2. Redirect based on role - This is the "Particular Dashboard" logic
        if (user.role === "Admin") {
          window.location.href = "/admin";
        } else if (user.role === "Host") {
          window.location.href = "/host";
        } else if (user.role === "Security") {
          window.location.href = "/security";
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
   <Backdrop/>
   
<div className="min-h-[calc(100vh-74px)] bg-slate-50 flex items-center justify-center p-6 font-sans mt-0">
        
      <div className="w-full max-w-[450px] bg-white rounded-[40px] shadow-2xl border border-slate-100 p-10 relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50" />

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Staff Login</h1>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] mt-2">
            Secure Terminal Access
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="email"
                name="email"
                placeholder="staff@gatekeeper.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-slate-200 mt-4 flex items-center justify-center gap-3 disabled:bg-slate-300"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                Authorize Access <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-xs font-medium">
            Forgot your credentials? <span className="text-blue-600 font-bold cursor-pointer">Contact Admin</span>
          </p>
        </div>
      </div>
    </div></>
  );
};

export default Login;