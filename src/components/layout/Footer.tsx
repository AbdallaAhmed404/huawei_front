"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/app/(main)/context/LanguageContext";

// كائن الترجمة الشامل للفوتر
const footerTranslations = {
  en: {
    home: "Home",
    breadcrumb: "Explore HUAWEI Exclusive Offers 2026",
    sections: {
      products: "Products",
      store: "Store",
      follow: "Follow Us",
      cards: "Cards Supported"
    },
    navigation: {
      products: [
        { name: "Smartphone", href: "/category/smartphone" },
        { name: "Wearable", href: "/category/wearable" },
        { name: "Tablet", href: "/category/tablet" },
        { name: "Audio", href: "/category/audio" },
      ],
      store: [
        { name: "Terms and Conditions of Sale", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Return Policy", href: "/returns" },
        { name: "FAQ", href: "/faq" },
      ],
      social: [
        { name: "Facebook", href: "#" },
        { name: "Twitter", href: "#" },
        { name: "Youtube", href: "#" },
        { name: "Instagram", href: "#" },
      ],
      cards: [
        { name: "Visa Card", href: "#" },
        { name: "Mastercard", href: "#" },
        { name: "Tabby Payment", href: "#" },
      ]
    }
  },
  ar: {
    home: "الرئيسية",
    breadcrumb: "اكتشف عروض هواوي الحصرية 2026",
    sections: {
      products: "المنتجات",
      store: " المتجر",
      follow: "تابعنا",
      cards: "البطاقات المدعومة"
    },
    navigation: {
      products: [
        { name: "الهواتف الذكية", href: "/category/smartphone" },
        { name: "الأجهزة القابلة للارتداء", href: "/category/wearable" },
        { name: "الأجهزة اللوحية", href: "/category/tablet" },
        { name: "الصوتيات", href: "/category/audio" },
      ],
      store: [
        { name: "شروط وأحكام البيع", href: "/terms" },
        { name: "سياسة الخصوصية", href: "/privacy" },
        { name: "سياسة الإرجاع", href: "/returns" },
        { name: "الأسئلة الشائعة", href: "/faq" },
      ],
      social: [
        { name: "فيسبوك", href: "#" },
        { name: "تويتر", href: "#" },
        { name: "يوتيوب", href: "#" },
        { name: "إنستغرام", href: "#" },
      ],
      cards: [
        { name: "بطاقة فيزا", href: "#" },
        { name: "ماستر كارد", href: "#" },
        { name: "تابي للمدفوعات", href: "#" },
      ]
    }
  }
};

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useLang(); // جلب اللغة الحالية
  const t = footerTranslations[lang]; // اختيار الترجمة المناسبة

  const isErrorPage = pathname === "/404" || pathname === "/500";
  if (isErrorPage) return null;

  return (
    <footer className="bg-white text-[#333] font-linseed pt-16 pb-12 border-t border-gray-200">
      <div className="container mx-auto px-6 max-w-[1440px]">
        
        {/* Breadcrumb Section */}
        <div className={`flex items-center gap-2 text-[13px] text-gray-500 mb-12 ${lang === 'ar' ? 'justify-start' : ''}`}>
          <Link href="/" className="hover:text-black transition-colors">{t.home}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-black font-medium uppercase tracking-tight">{t.breadcrumb}</span>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          
          {/* 01. Products */}
          <div className="space-y-6">
            <h4 className={`text-[14px] font-bold uppercase text-black tracking-tight ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.sections.products}
            </h4>
            <ul className={`flex flex-col gap-3 text-[13px] text-gray-600 ${lang === 'ar' ? 'items-start' : 'items-start'}`}>
              {t.navigation.products.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-black hover:underline transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 02. Store */}
          <div className="space-y-6">
            <h4 className={`text-[14px] font-bold uppercase text-black tracking-tight ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.sections.store}
            </h4>
            <ul className={`flex flex-col gap-3 text-[13px] text-gray-600 ${lang === 'ar' ? 'items-start' : 'items-start'}`}>
              {t.navigation.store.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-black hover:underline transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 03. Follow Us */}
          <div className="space-y-6">
            <h4 className={`text-[14px] font-bold uppercase text-black tracking-tight ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.sections.follow}
            </h4>
            <ul className={`flex flex-col gap-3 text-[13px] text-gray-600 ${lang === 'ar' ? 'items-start' : 'items-start'}`}>
              {t.navigation.social.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-black hover:underline transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 04. Cards Supported */}
          <div className="space-y-6">
            <h4 className={`text-[14px] font-bold uppercase text-black tracking-tight ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.sections.cards}
            </h4>
            <ul className={`flex flex-col gap-3 text-[13px] text-gray-400 ${lang === 'ar' ? 'items-start' : 'items-start'}`}>
              {t.navigation.cards.map((card) => (
                <li key={card.name} className="cursor-default select-none">
                  {card.name}
                </li>
              ))}
            </ul>
          </div>

        </div>
        
      </div>
    </footer>
  );
}