import React from "react";
import AnalyticsDashboard from "@/src/components/admin/analytics-dashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      {/* Header Section */}
      <section className="p-10 border-b border-white/10 bg-black">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
              Traffic <span className="text-white/30">Analytics</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium max-w-md">
              Real-time monitoring of site visitors and marketing source performance.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">System Live</span>
             </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="flex-1">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}