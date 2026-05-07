import React from "react";
import OrderRegistry from "@/src/components/admin/client-registry";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      {/* هيدر الصفحة بتصميم Huawei Dark */}
      <section className="p-10 border-b border-white/10 bg-black">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">
            Order <span className="text-white/50">Tracking</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Monitor incoming sales, shipping status, and customer fulfillment.
          </p>
        </div>
      </section>

      {/* الـ Component اللي فيه الجدول والداتا */}
      <div className="flex-1">
        <OrderRegistry />
      </div>
    </div>
  );
}