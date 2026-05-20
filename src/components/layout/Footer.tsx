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
        { name: "Smartphone", href: "/smartphone" },
        { name: "Wearable", href: "/wearable" },
        { name: "Tablet", href: "/tablet" },
        { name: "Audio", href: "/audio" },
      ],
      store: [
        { name: "Terms and Conditions of Sale", href: "/terms" },
        { name: "Delivery Policy", href: "/privacy" },
        { name: "Return Policy", href: "/return" },
        { name: "FAQ", href: "/faq" },
      ],
      social: [
        { name: "Facebook", href: "https://www.facebook.com/HuaweimobileEG/?brand_redir=112010774040957" },
        { name: "X", href: "https://x.com/HuaweiArabia" },
        { name: "Youtube", href: "https://www.youtube.com/channel/UClgn8sFLtpmr2FZZy31BImQ" },
        { name: "Instagram", href: "https://www.instagram.com/huaweimobileom/" },
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
        { name: "الهواتف الذكية", href: "/smartphone" },
        { name: "الأجهزة القابلة للارتداء", href: "/wearable" },
        { name: "الأجهزة اللوحية", href: "/tablet" },
        { name: "الصوتيات", href: "/audio" },
      ],
      store: [
        { name: "شروط وأحكام البيع", href: "/terms" },
        { name: "سياسة التوصيل", href: "/privacy" },
        { name: "سياسة الإرجاع", href: "/return" },
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-20">
          
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
                  <Link href={link.href} target="_blank"  className="hover:text-black hover:underline transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 04. Cards Supported */}
          

        </div>
        <div 
          dir="ltr"
          className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-dashed border-midnight/10 dark:border-white/10 w-full"
        >
          {/* AGENCY SIGNATURE */}
          <div className="flex items-center gap-1 opacity-40 hover:opacity-100 transition-all duration-500">
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-foreground/60 whitespace-nowrap pt-1">
              Powered by scarabix
            </span>
            {/* المحافظة على المقاسات المطلوبة بالملي */}
            <div className="relative scale-75 md:scale-100">
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}