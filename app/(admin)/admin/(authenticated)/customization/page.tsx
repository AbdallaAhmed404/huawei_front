import React from "react";
import StoreCustomizer from "@/src/components/admin/planning-registry";

export const dynamic = "force-dynamic";

export default async function PlanningPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      <StoreCustomizer />
    </div>
  );
}