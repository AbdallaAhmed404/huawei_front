import React from "react";
import CouponRegistry from "@/src/components/admin/coupon-registry";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      {/* Header */}
      <section className="p-10 border-b border-white/10 bg-black">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">
            Promo <span className="text-white/50">Codes</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Create and manage discount coupons for your store customers.
          </p>
        </div>
      </section>

      {/* Registry Component */}
      <div className="flex-1">
        <CouponRegistry />
      </div>
    </div>
  );
}