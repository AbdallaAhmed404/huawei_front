"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  User, Plus, Trash2, Shield, Mail, 
  Lock, X, Loader2, Search, Edit3, CheckCircle2, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminManagement() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isActive: true
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("https://api.huaweioman.com/admin/all", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAdmins(res.data || []);
    } catch (err) { console.error("Error fetching admins:", err); }
  };

  const handleOpenModal = (admin: any = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({ email: admin.email, password: "", isActive: admin.isActive });
    } else {
      setEditingAdmin(null);
      setFormData({ email: "", password: "", isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.email || (!editingAdmin && !formData.password)) {
      return alert("Please fill required fields");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (editingAdmin) {
        // Update
        await axios.put(`https://api.huaweioman.com/admin/update/${editingAdmin._id}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        // Create
        await axios.post("https://api.huaweioman.com/admin/add", formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      
      fetchAdmins();
      setIsModalOpen(false);
    } catch (err: any) { 
      alert(err.response?.data?.message || "Operation failed"); 
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://api.huaweioman.com/admin/delete/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAdmins();
    } catch (err) { alert("Delete failed"); }
  };

  const filteredAdmins = admins.filter(a => a.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white p-8 space-y-6">
      
      {/* HEADER */}
      <section className="mb-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Team <span className="text-white/40">Managers</span>
        </h1>
        <p className="text-zinc-500 font-medium">Control administrative access and permissions.</p>
      </section>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-zinc-900/40 p-5 rounded-2xl border border-white/10 sticky top-0 z-20 backdrop-blur-xl">
        <div className="relative w-full lg:max-w-md">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search by email..." 
            className="w-full bg-black/40 border border-white/10 py-3.5 pl-12 pr-4 rounded-xl text-[15px] outline-none focus:border-white/30 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-white text-black px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-lg"
        >
          <Plus size={20} /> Add Admin
        </button>
      </div>

      {/* ADMINS TABLE */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[12px] font-black text-zinc-500 border-b border-white/10 bg-white/[0.02] uppercase tracking-widest">
              <th className="px-6 py-5">Admin Profile</th>
              <th className="px-6 py-5">Role</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Created At</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredAdmins.map((admin) => (
              <tr key={admin._id} className="group hover:bg-white/[0.01] transition-all">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-zinc-900 rounded-full border border-white/10">
                      <User size={18} className="text-white/60" />
                    </div>
                    <span className="font-bold text-[15px]">{admin.email}</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-tighter text-zinc-400">
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <div className={cn(
                    "flex items-center gap-1.5 text-[12px] font-bold",
                    admin.isActive ? "text-green-500" : "text-red-500"
                  )}>
                    {admin.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {admin.isActive ? "Active" : "Disabled"}
                  </div>
                </td>
                <td className="px-6 py-6 text-zinc-500 text-sm font-medium">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleOpenModal(admin)}
                      className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(admin._id)}
                      className="p-2.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl space-y-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white"><X /></button>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                {editingAdmin ? "Edit Admin" : "New Manager"}
              </h3>
              <p className="text-zinc-500 text-sm font-medium">Define access credentials and status.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Email Address</label>
                <div className="flex items-center gap-3 bg-black border border-white/10 p-4 rounded-2xl">
                  <Mail size={18} className="text-zinc-600" />
                  <input 
                    type="email" 
                    placeholder="admin@huaweioman.com" 
                    className="bg-transparent outline-none w-full text-white font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">
                  {editingAdmin ? "New Password (Leave blank to keep current)" : "Password"}
                </label>
                <div className="flex items-center gap-3 bg-black border border-white/10 p-4 rounded-2xl">
                  <Lock size={18} className="text-zinc-600" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-transparent outline-none w-full text-white font-medium"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {/* Toggle Active Status */}
              <div className="flex items-center justify-between p-4 bg-black border border-white/10 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-white uppercase tracking-tighter">Account Status</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase italic">Permit dashboard access</span>
                </div>
                <button 
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={cn(
                    "w-14 h-7 rounded-full transition-all relative",
                    formData.isActive ? "bg-white" : "bg-zinc-800"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-5 h-5 rounded-full transition-all",
                    formData.isActive ? "right-1 bg-black" : "left-1 bg-zinc-500"
                  )} />
                </button>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : editingAdmin ? "Update Settings" : "Grant Access"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}