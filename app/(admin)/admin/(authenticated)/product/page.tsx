import React from "react";
import ProductRegistry from "@/src/components/admin/admin-registry"; 

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      
      {/* HEADER SECTION */}
      <section className="p-10 border-b border-white/10 bg-black">
        <div className="flex flex-col gap-2">
          {/* النص هنا أصبح Bold وباللون الأبيض بالكامل */}
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">
            Product Inventory
          </h1>
          
        </div>
      </section>

      {/* CONTENT AREA */}
      <div className="p-8 bg-[#050505]">
        <ProductRegistry />
      </div>
    </div>
  );
}