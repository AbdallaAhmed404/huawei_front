"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Package, TrendingUp, Clock, LayoutGrid, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  countInStock: number;
  createdAt: string;
}

interface Order {
  _id: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  total: number;
  userData: { firstName: string; lastName: string };
  createdAt: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState<number>(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes , visitorRes] = await Promise.all([
          fetch("https://huawei-production.up.railway.app/admin/allpr"),
          fetch("https://huawei-production.up.railway.app/admin/orders"),
          fetch("https://huawei-production.up.railway.app/admin/data")
        ]);
        const prodData = await prodRes.json();
        const orderData = await orderRes.json();
        const visitorData = await visitorRes.json();

        setProducts(prodData);
        setOrders(orderData);
        setVisitors(visitorData.totalVisits || 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Calculations ---
  const outOfStockProducts = products.filter(p => p.countInStock === 0);
  
  const today = new Date().toISOString().split('T')[0];
  const todaySales = orders
    .filter(o => o.createdAt.split('T')[0] === today && o.status !== "Pending")
    .reduce((sum, o) => sum + o.total, 0);

  const recentTransactions = [...orders].reverse();

  const categories = Array.from(new Set(products.map(p => p.category)));
  const latestByCat = categories.map(cat => {
    return products
      .filter(p => p.category === cat)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  });

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#050505] text-white">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-zinc-300 font-sans pb-10">
      
      {/* HEADER SECTION */}
      {/* HEADER SECTION */}
<section className="px-8 py-10 border-b border-white/5 bg-black flex flex-col md:flex-row justify-between items-center gap-6">
  <h1 className="text-3xl font-bold text-white tracking-tight text-right">
    Control <span className="text-zinc-500">Center</span>
  </h1>

  {/* تعديل الـ Grid هنا */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
    <QuickStat label="Total Products" value={products.length.toString()} icon={<Package size={16} />} />
    <QuickStat label="Total Orders" value={orders.length.toString()} icon={<ShoppingBag size={16} />} />
    
    {/* كارت الزوار الجديد */}
    <QuickStat 
  label="Total Visitors" // غيرنا الاسم هنا
  value={visitors.toString()} 
  icon={<TrendingUp size={16} />} 
  color="text-blue-500" 
/>
    <QuickStat 
      label="Today Sales" 
      value={`OMR ${todaySales}`} 
      icon={<TrendingUp size={16} />} 
      color="text-emerald-500" 
    />
  </div>
</section>

      <main className="p-8 space-y-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* RECENT TRANSACTIONS WITH SCROLL & GRADIENT */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 px-1">
              <Clock size={20} className="text-blue-500" /> Recent Transactions
            </h2>
            <div className="relative group">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-y-auto max-h-[400px] no-scrollbar shadow-2xl">
                {recentTransactions.map((order) => (
                    <div key={order._id} className="p-6 border-b last:border-0 border-white/5 hover:bg-white/[0.02] flex justify-between items-center transition-all">
                    <div className="flex items-center gap-4">
                        <div className={cn("w-1 h-10 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]", order.status === "Pending" ? "bg-amber-500" : "bg-emerald-500")} />
                        <div>
                        <h3 className="text-sm font-bold text-white tracking-widest uppercase">#{order._id.slice(-6)}</h3>
                        <p className="text-xs text-zinc-500">{order.userData?.firstName} {order.userData?.lastName}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-black text-white">OMR {order.total}</div>
                        <span className={cn("text-[10px] font-bold uppercase px-3 py-1 rounded-md mt-2 inline-block border", 
                        order.status === "Pending" ? "text-amber-500 border-amber-500/20 bg-amber-500/5" : "text-emerald-500 border-emerald-500/20 bg-emerald-500/5")}>
                        {order.status}
                        </span>
                    </div>
                    </div>
                ))}
                </div>
                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none rounded-b-2xl" />
            </div>
          </div>

          {/* CRITICAL STOCK WITH SCROLL & GRADIENT */}
          <div className="lg:col-span-5 space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 px-1">
              <AlertCircle size={20} className="text-red-500" /> Critical Stock ({outOfStockProducts.length})
            </h2>
            <div className="relative group">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-y-auto max-h-[400px] no-scrollbar shadow-2xl p-2">
                {outOfStockProducts.length > 0 ? outOfStockProducts.map((item) => (
                    <div key={item._id} className="p-5 flex items-center justify-between border-b last:border-0 border-white/5 hover:bg-red-500/[0.01]">
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-white mb-1">{item.name}</h3>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Out of Stock</span>
                    </div>
                    <div className="text-right text-zinc-500 text-[10px] font-black uppercase tracking-widest">{item.category}</div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center h-[380px] text-zinc-600">
                    <p className="text-xs italic">All products are in stock</p>
                    </div>
                )}
                </div>
                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none rounded-b-2xl" />
            </div>
          </div>
        </div>

        {/* LATEST BY CATEGORY */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 px-1">
            <LayoutGrid size={20} className="text-zinc-500" /> Newly Added per Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestByCat.map((prod, idx) => (
              <div key={idx} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all group">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-3 group-hover:text-blue-500 transition-colors">{prod.category}</span>
                <h3 className="text-sm font-semibold text-white mb-4 leading-snug h-10 line-clamp-2">{prod.name}</h3>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-emerald-500 font-bold text-xs">OMR {prod.price}</span>
                  <span className="text-[10px] text-zinc-600 font-medium">{new Date(prod.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

function QuickStat({ label, value, icon, color = "text-white" }: { label: string, value: string, icon: React.ReactNode, color?: string }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl min-w-[160px] hover:bg-white/[0.02] transition-all group shadow-sm">
      <div className="flex items-center gap-2 text-zinc-500 mb-3 font-bold text-[10px] uppercase tracking-widest group-hover:text-zinc-300 transition-colors">
        {icon} {label}
      </div>
      <div className={cn("text-2xl font-black tracking-tighter", color)}>{value}</div>
    </div>
  );
}