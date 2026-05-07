"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }

    setIsPending(true);
    setStatus({ type: "", message: "" });

    try {
      await axios.post("https://api.huaweioman.com/admin/register", {
        email: formData.email,
        password: formData.password,
      });
      
      setStatus({ type: "success", message: "Account created successfully! Redirecting..." });
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] font-sans">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f0f0f] p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl"
      >
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Create Admin Account
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Set up your credentials to manage the Huawei ecosystem.
          </p>
        </div>

        {/* Access Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <input
                required
                type="email"
                placeholder="admin@huawei.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/10 py-3 px-4 rounded-xl text-sm text-white outline-none focus:border-[#CF0A2C] focus:bg-white/[0.08] transition-all placeholder:text-gray-600"
              />
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/10 py-3 px-4 rounded-xl text-sm text-white outline-none focus:border-[#CF0A2C] focus:bg-white/[0.08] transition-all placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/10 py-3 px-4 rounded-xl text-sm text-white outline-none focus:border-[#CF0A2C] focus:bg-white/[0.08] transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Status Feedback */}
          {status.message && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className={`flex items-center gap-3 text-sm p-4 rounded-xl border ${
                status.type === "success" 
                ? "text-green-500 bg-green-500/10 border-green-500/20" 
                : "text-red-500 bg-red-500/10 border-red-500/20"
              }`}
            >
              {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {status.message}
            </motion.div>
          )}

          {/* Submit Action */}
          <button
            disabled={isPending}
            className="w-full bg-[#CF0A2C] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#b00825] transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-black/20"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link 
              href="/admin/login" 
              className="text-[#CF0A2C] font-medium hover:text-[#ff1a3d] transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}