"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, // Overview
  Package,         // Product
  ShoppingCart,    // Order
  Settings2,       // Customization
  LogOut,
  ChevronLeft,
  Menu,
  Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlert } from "@/src/components/global/alert-provider";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Products", icon: Package, href: "/admin/product" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/order" },
  { label: "Customization", icon: Settings2, href: "/admin/customization" },
  { label: "coupons", icon: Ticket, href: "/admin/coupons" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showConfirm } = useAlert();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleLogout = async () => {
  const confirmed = await showConfirm("Are you sure you want to logout?", {
    title: "Logout Confirmation",
    type: "warning"
  });

  if (confirmed) {
    // 1. مسح التوكن من الـ Local Storage
    localStorage.removeItem("adminToken");

    // 2. (اختياري) مسح أي بيانات أخرى متعلقة بالأدمن لو مخزنها
    // localStorage.clear(); // دي بتمسح كل حاجة تماماً

    // 3. التوجه لصفحة تسجيل الدخول
    router.push("/admin/login");
  }
};

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      // تم إضافة h-screen و sticky لجعل السايد بار ثابت أثناء السكرول
      className="sticky top-0 left-0 h-screen border-r border-white/10 flex flex-col bg-black z-50 print:hidden"
    >
      {/* Header Section - زر التحكم فقط */}
      <div className={cn(
        "h-20 flex items-center border-b border-white/10 transition-all",
        isCollapsed ? "justify-center" : "px-6 justify-end"
      )}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all shadow-sm"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-white/9 text-white font-semibold"
                  : "text-zinc-400 hover:text-white hover:bg-white/5",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 1.5} 
                className={cn(isActive ? "text-white" : "group-hover:text-white")} 
              />

              {!isCollapsed && (
                <span className="text-[14px] whitespace-nowrap">
                  {item.label}
                </span>
              )}

              {/* Indicator for Active State */}
              {!isCollapsed && isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" 
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout Section */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-4 p-4 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all w-full",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && (
            <span className="text-sm font-bold uppercase tracking-wider">Logout</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}