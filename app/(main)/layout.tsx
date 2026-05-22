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
      <Script id="analytics-utm-tracker" strategy="afterInteractive">
        {`
    (function() {
      // 1. التقاط الـ UTM من الـ URL الحالي
      const urlParams = new URLSearchParams(window.location.search);
      const currentSource = urlParams.get('utm_source');
      const currentMedium = urlParams.get('utm_medium');
      const currentCampaign = urlParams.get('utm_campaign');

      // لو اليوزر جاي بـ UTM جديد، بنخزنه في السيشين فوراً
      if (currentSource) {
        const utms = {
          utm_source: currentSource,
          utm_medium: currentMedium,
          utm_campaign: currentCampaign
        };
        sessionStorage.setItem('user_utm', JSON.stringify(utms));
      }

      // 2. استرجاع المصدر المخزن
      let activeSource = 'direct';
      const savedUtmString = sessionStorage.getItem('user_utm');
      
      if (savedUtmString) {
        try {
          const savedUtms = JSON.parse(savedUtmString);
          if (savedUtms && savedUtms.utm_source) {
            activeSource = savedUtms.utm_source;
          }
        } catch(e) {
          console.log('Error parsing UTMs');
        }
      }

      // 3. التعديل الذكي: منع التكرار مع الـ Refresh والتنقل
      // بنشوف هل بعتنا الـ hit دي قبل كدة في السيشين الحالي؟
      const hitSent = sessionStorage.getItem('hit_sent');

      if (!hitSent) {
        // لو متبعتتش قبل كدة، ابعتها للباك إيند
        fetch('https://api.huaweioman.com/admin/hit', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ utm_source: activeSource })
        })
        .then(() => {
          // نرفع العلامة إنها اتبعرت بنجاح عشان المرة الجاية متبعتش تاني
          sessionStorage.setItem('hit_sent', 'true');
        })
        .catch(err => console.log('Analytics sync failed'));
      }
    })();
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