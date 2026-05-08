"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import axios from "axios";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    try {
      const response = await axios.post("https://api.huaweioman.com/admin/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        router.push("/admin");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid email or password";
      setError(message);
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
            Admin Login
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Enter your credentials to access the Huawei dashboard.
          </p>
        </div>

        {/* Access Form */}
        <form onSubmit={handleEntry} className="space-y-6">
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
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-gray-300">Password</label>
              </div>
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
          </div>

          {/* Error Feedback */}
          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-sm text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20"
            >
              <AlertCircle size={18} />
              {error}
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
              "Sign In"
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={14} className="text-[#CF0A2C]" />
          <span>Secure Administration Environment</span>
        </div>
      </motion.div>
    </div>
  );
}