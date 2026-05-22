"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
// استيراد المكتبة
import * as XLSX from "xlsx"; 
import { 
  Users, TrendingUp, BarChart3, 
  Globe, Share2, ArrowUpRight, Loader2, FileSpreadsheet
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get("https://api.huaweioman.com/admin/data", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStats(res.data.stats || null);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // وظيفة التصدير إلى اكسيل
  const exportToExcel = () => {
    if (!stats) return;

    // 1. تحضير البيانات
    const reportData = stats.sources.map((source: any) => {
      const percentage = stats.count > 0 ? ((source.count / stats.count) * 100).toFixed(2) : 0;
      return {
        "Source Name": source.sourceName.toUpperCase(),
        "Visits": source.count,
        "Engagement Share (%)": `${percentage}%`
      };
    });

    // إضافة سطر الإجمالي في النهاية
    reportData.push({
      "Source Name": "TOTAL SITE VISITS",
      "Visits": stats.count,
      "Engagement Share (%)": "100%"
    });

    // 2. إنشاء ورقة العمل (Worksheet)
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Traffic Report");

    // 3. تحميل الملف
    XLSX.writeFile(wb, `Site_Traffic_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-white" size={40} />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      
      {/* TOOLBAR مع زر التصدير */}
      <div className="flex justify-end">
        <button 
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-black uppercase text-[12px] tracking-widest transition-all shadow-lg shadow-green-900/20"
        >
          <FileSpreadsheet size={18} /> Export Excel
        </button>
      </div>

      {/* 1. OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/40 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={80} className="text-white" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 font-black uppercase text-[11px] tracking-widest">
              <TrendingUp size={14} /> Total Visitors
            </div>
            <div className="text-6xl font-black text-white tracking-tighter">
              {stats?.count?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe size={80} className="text-white" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 font-black uppercase text-[11px] tracking-widest">
              <BarChart3 size={14} /> Active Sources
            </div>
            <div className="text-6xl font-black text-white tracking-tighter">
              {stats?.sources?.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SOURCES BREAKDOWN TABLE (نفس الكود السابق مع الاحتفاظ بالـ UI) */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter ml-2 flex items-center gap-3">
          Traffic Breakdown <div className="h-px flex-1 bg-white/10" />
        </h2>
        
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[12px] font-black text-zinc-500 border-b border-white/5 bg-white/[0.01] uppercase tracking-widest">
                <th className="px-8 py-6">Origin Source</th>
                <th className="px-8 py-6 text-center">Engagement Share</th>
                <th className="px-8 py-6 text-right">Raw Visits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {stats?.sources?.sort((a:any, b:any) => b.count - a.count).map((source: any, index: number) => {
                const percentage = stats.count > 0 ? (source.count / stats.count) * 100 : 0;
                return (
                  <tr key={source._id || index} className="group hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-8 italic font-black text-white uppercase">{source.sourceName}</td>
                    <td className="px-8 py-8 text-center text-zinc-400 font-bold">{percentage.toFixed(1)}%</td>
                    <td className="px-8 py-8 text-right font-black text-white">{source.count.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}