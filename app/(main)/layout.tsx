import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from "next/script";
import { LanguageProvider } from "./context/LanguageContext";
import ClientLayoutContent from "./ClientLayoutContent"; // استدعاء الملف الجديد

export const metadata: Metadata = {
  title: { default: "Huawei", template: "%s | Huawei" },
  description: "Experience the future of technology with Huawei's official e-commerce platform. Shop the latest smartphones, laptops, and premium accessories.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* سكربت عداد الزوار */}
      <Script id="visitor-counter" strategy="afterInteractive">
        {`
          fetch('https://api.huaweioman.com/admin/hit', { 
            method: 'POST',
            mode: 'no-cors' 
          }).catch(err => console.log('Analytics sync failed'));
        `}
      </Script>

      <LanguageProvider>
        {/* نمرر الـ children للمكون العميل لإدارة التفاعل والاتجاه */}
        <ClientLayoutContent>
          {children}
        </ClientLayoutContent>
        
        <Analytics />
        <GoogleAnalytics gaId="G-C169XH8R4G" />
      </LanguageProvider>
    </>
  );
}