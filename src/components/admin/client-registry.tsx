"use client";
import * as XLSX from "xlsx";
import React, { useState, useEffect } from "react";
import { Search, CheckCircle2, Clock, Truck, Ban, Trash2, Loader2, MapPin, Phone, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. تعريف شكل البيانات (Interfaces)
interface OrderItem {
  name: string;
  photo: string;
  quantity: number;
  colorCode: string;
}

interface Order {
  _id: string;
  status: string;
  total: number;
  items: OrderItem[];
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    district: string;
  };
  trafficSource?: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
  };
}

const STATUS_OPTIONS = [
  { id: "Pending", icon: Clock, color: "text-amber-500", label: "Pending (Waiting for Payment)" },
  { id: "Processing", icon: Truck, color: "text-blue-500", label: "Processing" },
  { id: "Completed", icon: CheckCircle2, color: "text-emerald-500", label: "Completed" },
  { id: "Cancelled", icon: Ban, color: "text-red-500", label: "Cancelled" },
];

export default function OrderRegistry() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://api.huaweioman.com/admin/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`https://api.huaweioman.com/admin/Orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`https://api.huaweioman.com/admin/Orders/${orderId}`, { method: "DELETE" });
      if (response.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      }
    } catch (error) {
      alert("Failed to delete order");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userData?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userData?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userData?.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "ALL" || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );



  const exportToExcel = () => {
    // تجهيز البيانات بالشكل اللي الإكسيل يفهمه
    const dataToExport = orders.map((order) => ({
      "Order ID": order._id,
      "First Name": order.userData?.firstName,
      "Last Name": order.userData?.lastName,
      "Email": order.userData?.email,
      "Phone": order.userData?.phone,
      "City": order.userData?.city,
      "District": order.userData?.district,
      "Total (OMR)": order.total,
      "Status": order.status
    }));

    // إنشاء الورقة (Worksheet)
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // تحميل الملف
    XLSX.writeFile(workbook, "Orders_Data.xlsx");
  };

  return (
    <div className="p-8 space-y-6 bg-black min-h-screen font-sans">
      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-zinc-900/40 p-5 rounded-2xl border border-white/10 sticky top-0 z-20 backdrop-blur-xl">
        <div className="relative w-full lg:max-w-md">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by ID or Name..."
            className="w-full bg-black/40 border border-white/10 py-3.5 pl-12 pr-4 rounded-xl text-white outline-none focus:border-white/30 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-black/50 p-1 rounded-xl border border-white/5 overflow-x-auto">
          {["ALL", "Pending", "Processing", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-lg text-[13px] font-bold uppercase transition-all whitespace-nowrap",
                activeTab === tab ? "bg-white text-black" : "text-zinc-500 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all"
          >
            <FileDown size={18} /> {/* تأكد من استيراد أيقونة FileDown من lucide-react */}
            Export Excel
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[14px] font-bold text-zinc-400 border-b border-white/10 bg-white/[0.02]">
              <th className="px-6 py-6">Order ID</th>
              <th className="px-6 py-6">Customer & Shipping</th>
              <th className="px-6 py-6">Products</th>
              <th className="px-6 py-6">Total (OMR)</th>
              <th className="px-6 py-6">Source</th>
              <th className="px-6 py-6 text-right">Actions</th>

            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="group hover:bg-white/[0.01] transition-colors">

                {/* ID */}
                <td className="px-6 py-8 text-white font-bold text-[14px]">
                  #{order._id.slice(-6).toUpperCase()}
                </td>

                {/* Customer Details & Address */}
                <td className="px-6 py-8 text-white">
                  <div className="flex flex-col gap-1.5">
                    <div className="font-bold text-[16px]">{order.userData?.firstName} {order.userData?.lastName}</div>
                    <div className="text-zinc-500 text-xs">{order.userData?.email}</div>
                    <div className="text-emerald-500 text-xs font-bold flex items-center gap-1.5">
                      <Phone size={12} /> {order.userData?.phone}
                    </div>
                    <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/5 inline-flex items-center gap-2 w-fit">
                      <MapPin size={12} className="text-blue-400" />
                      <span className="text-[11px] text-zinc-300 uppercase tracking-wider">
                        {order.userData?.city} / {order.userData?.district}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Products */}
                <td className="px-6 py-8">
                  <div className="space-y-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg p-1 flex-shrink-0">
                          <img src={item.photo} className="w-full h-full object-contain" alt="" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-white font-medium truncate max-w-[150px]">{item.name}</span>
                          <span className="text-[10px] text-zinc-500 font-bold">QTY: {item.quantity}</span>
                          <div
                            style={{
                              backgroundColor: item.colorCode,
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              display: 'inline-block', // ليظهر بجانب النصوص إذا أردت
                              border: '1px solid #ccc' // اختياري: لإظهار إطار إذا كان اللون أبيض أو فاتح جداً
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </td>

                {/* Total */}
                <td className="px-6 py-8 font-black text-white text-[15px]">
                  OMR {order.total?.toLocaleString()}
                </td>


                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase w-fit",
                      order.trafficSource?.utm_source?.toLowerCase() === 'facebook'
                        ? "bg-blue-500/10 text-blue-500"
                        : order.trafficSource?.utm_source?.toLowerCase() === 'google'
                          ? "bg-red-500/10 text-red-500"
                          : "bg-zinc-500/10 text-zinc-400"
                    )}>
                      {order.trafficSource?.utm_source || 'Direct'}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-8 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 min-h-[44px]">
                      {STATUS_OPTIONS.map((opt) => {
                        const isCurrentStatus = order.status === opt.id;

                        // المنطق الجديد للإخفاء التام:
                        // 1. لو الطلب Pending: اظهر فقط أيقونة الـ Pending.
                        // 2. لو الطلب مش Pending: اظهر كل الأيقونات ماعدا الـ Pending.
                        const shouldShow =
                          (order.status === "Pending" && opt.id === "Pending") ||
                          (order.status !== "Pending" && opt.id !== "Pending");

                        // لو الشرط ملم يتحقق، نرجع null عشان الزرار ميترسمش أصلاً
                        if (!shouldShow) return null;

                        return (
                          <button
                            key={opt.id}
                            // بنقفل الزرار لو هو الحالة الحالية عشان نمنع ضغطات ملهاش لازمة
                            disabled={isCurrentStatus}
                            onClick={() => handleUpdateStatus(order._id, opt.id)}
                            className={cn(
                              "p-2 rounded-lg transition-all relative group",
                              isCurrentStatus ? `${opt.color} bg-white/10` : "text-zinc-700 hover:text-zinc-400",
                              isCurrentStatus && "cursor-default"
                            )}
                            title={opt.label}
                          >
                            <opt.icon size={18} />

                            {isCurrentStatus && (
                              <span className={cn(
                                "absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse",
                                opt.color.replace('text', 'bg')
                              )} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="p-2.5 text-red-900 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}