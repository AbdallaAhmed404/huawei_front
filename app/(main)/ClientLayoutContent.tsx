"use client";

import React from "react";
import Navbar from "@/src/components/layout/Navbar";
import FooterRegistry from "@/src/components/layout/FooterRegistry";
import WhatsAppButton from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";
import { useLang } from "./context/LanguageContext";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { usePathname } from "next/navigation";

export default function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { lang } = useLang(); // الحصول على اللغة الحالية من السياق
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/ar" || pathname === "/en";
  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} // تغيير اتجاه الموقع فورياً
      className={cn(
        "flex min-h-screen flex-col", 
        lang === 'ar' ? "font-arabic" : "font-sans" // تبديل الخطوط بناءً على اللغة
      )}
    >
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main className="flex-1 relative">
            {children}
          </main>
          {!isHomePage && <FooterRegistry />}
          <WhatsAppButton />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}