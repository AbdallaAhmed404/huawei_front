import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import Script from "next/script";
import { LanguageProvider } from "./context/LanguageContext";
import ClientLayoutContent from "./ClientLayoutContent"; // استدعاء الملف الجديد

export const metadata: Metadata = {
  title: { default: "Huawei Oman | Official Store", template: "%s | Huawei Oman" },
  description: "Experience the future of technology with Huawei's official e-commerce platform. Shop the latest smartphones, Wearable, Audio and Tablet.",
  keywords: ["Huawei", "Huawei Oman", "هواوي عمان", "Huaweioman", "Wearable"],
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://huaweioman.com",
  }
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <GoogleTagManager gtmId="GTM-N8ZQ8TDR" />
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OnlineStore",
            "name": "Huawei Oman",
            "url": "https://huaweioman.com",
            "description": "The official e-commerce platform for Huawei products in Oman.",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "OM"
            }
          }),
        }}
      />
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