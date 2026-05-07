"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import DashboardSidebar from "@/src/components/admin/dashboard-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // تحديد صفحات المصادقة (لا تحتاج لتوكن)
  const isAuthPage = pathname.includes("/login") || pathname.includes("/register");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (isAuthPage) {
      if (token) {
        // إذا كان لديه توكن وهو في صفحة اللوج ان، يتم توجيهه للداشبورد
        router.push("/admin");
      } else {
        setIsLoaded(true);
      }
      return;
    }

    // إذا كان يحاول دخول صفحات محمية ولا يوجد توكن
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // هنا نعتمد على وجود التوكن محلياً فقط للسماح بظهور الـ UI
    // والـ Middleware في الباك إند ستتولى حماية البيانات عند أي Request
    setIsAuthorized(true);
    setIsLoaded(true);

  }, [pathname, router, isAuthPage]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white font-mono admin-mode">
      
      {/* الـ Sidebar يظهر فقط في الصفحات غير الخاصة بالمصادقة وعند وجود توكن محلي */}
      {!isAuthPage && isAuthorized && <DashboardSidebar />}

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,transparent_100%)] opacity-20 pointer-events-none" />

        <main className={`flex-1 overflow-y-auto bg-transparent relative z-10 ${!isAuthPage ? 'p-4 md:p-8' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}