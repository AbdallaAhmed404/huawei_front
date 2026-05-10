"use client";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Link from "next/link"; // إضافة Link للانتقال لصفحة التفاصيل
import { X } from "lucide-react";
import Image from "next/image";
// استيراد الـ Hook الخاص بالترجمة
import { useLang } from "../context/LanguageContext";

// كائن الترجمة للنصوص الثابتة في الصفحة
const translations = {
  en: {
    save: "Save",
    buyNow: "Buy Now",
    viewAll: "View All",
    discoverAll: "Discover all {name} models",
    loading: "Loading Tablets..."
  },
  ar: {
    save: "وفر",
    buyNow: "اشتر الآن",
    viewAll: "عرض الكل",
    discoverAll: "اكتشف جميع موديلات {name}",
    loading: "جاري تحميل الأجهزة اللوحية..."
  }
};

// مكون الكارد الأفقي للتابلت - محدث لبيانات الـ API ليدعم الترجمة والاتجاه
const TabletHorizontalCard = ({ product, t, lang }: { product: any, t: any, lang: string }) => (
  <Link href={`/product/${product._id}-${product.name.replace(/\s+/g, '-').toLowerCase()}`} className="block group">
    <div className={`bg-white rounded-[15px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 border border-transparent hover:border-gray-100 shadow-lg transition-all duration-300 min-h-[380px] ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <img
          src={product.image}
          alt={product.name}
          className="object-contain max-h-[240px] md:max-h-[280px] w-auto transform transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className={`w-full md:w-1/2 flex flex-col justify-center ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        <h3 className="text-[22px] md:text-[26px] font-bold text-black mb-3 leading-tight">
          {product.name}
        </h3>
        <p className="text-[13px] text-gray-500 mb-6 line-clamp-2">
          {product.description}
        </p>

        <div className={`mb-3 flex flex-col min-w-0 ${lang === 'ar' ? 'items-end' : ''}`}>
          {/* السعر الأساسي مع اللوجو */}
          <div className={`text-[18px] font-bold text-black flex items-center gap-1.5 whitespace-nowrap ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className="relative w-5 h-5 flex-shrink-0">
              <Image
                src="/oman-riyal.svg"
                alt="OMR"
                fill
                className="object-contain"
              />
            </div>
            <span className="truncate">{product.price?.toLocaleString()}</span>
          </div>

          {/* سطر الخصم مع اللوجو الصغير */}
          {product.discount > 0 && (
            <div className={`flex items-center gap-1 mt-1 whitespace-nowrap ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span className="text-[11px] text-[#CF1322] font-bold uppercase">{t.save}</span>
              <div className="relative w-3.5 h-3.5 flex-shrink-0">
                <Image
                  src="/oman-riyal.svg"
                  alt="OMR"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[10px] font-bold truncate">
                {product.discount.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-6 mt-auto ${lang === 'ar' ? 'justify-end' : ''}`}>
          <div className={`text-black text-[14px] font-bold flex items-center gap-1 hover:gap-2 transition-all ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            {t.buyNow} <span className={`text-lg ${lang === 'ar' ? 'rotate-180' : ''}`}>›</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default function TabletPage() {
  const { lang } = useLang();
  const t = translations[lang];

  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("https://api.huaweioman.com/admin/categories"),
          axios.get("https://api.huaweioman.com/admin/allproduct")
        ]);

        const tabletMain = catRes.data.categories.find(
          (c: any) => c.mainCategoryName === "Tablet"
        );

        setSubCategories(tabletMain?.subCategories || []);
        setProducts(prodRes.data.filter((p: any) => p.category === "Tablet") || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">{t.loading}</div>;

  return (
    <main className="bg-[#FBFBFB] min-h-screen pb-20 font-sans">

      {/* 1. Header Categories */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {subCategories.map((sub) => (
            <div key={sub._id} className="flex flex-col items-center gap-3 group cursor-pointer text-center max-w-[120px]">
              <div className="w-30 h-16 md:w-30 md:h-20 rounded-[15px] flex items-center justify-center p-4 group-hover:scale-110 transition-all duration-300">
                <img src={sub.icon} alt={sub.name} className="object-contain" />
              </div>
              <span className="text-[12px] font-bold text-black leading-tight">{sub.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. أقسام التابلت الديناميكية */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-24">
        {subCategories.map((sub) => {
          const subProducts = products.filter(p => p.subCategory === sub.name);
          if (subProducts.length === 0) return null;

          return (
            <section key={sub._id} className="space-y-8">
              <h2 className={`text-[32px] md:text-[38px] font-bold text-black ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{sub.name}</h2>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {subProducts.slice(0, 2).map((p) => (
                  <TabletHorizontalCard key={p._id} product={p} t={t} lang={lang} />
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setSelectedCategory({ name: sub.name, products: subProducts })}
                  className={`bg-black text-white px-10 py-3 rounded-[15px] text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                >
                  {t.viewAll} <span className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black">+</span>
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {/* --- بوب اب عرض المنتجات للتابلت (Modal) --- */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FBFBFB] w-full max-w-[1200px] max-h-[90vh] rounded-[15px] overflow-hidden flex flex-col relative shadow-2xl">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} p-2 hover:bg-gray-200 rounded-full transition-colors z-10`}
            >
              <X size={24} className="text-black" />
            </button>

            <div className={`p-8 md:p-12 overflow-y-auto ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="mb-10">
                <h2 className="text-[32px] font-bold text-black">{selectedCategory.name}</h2>
                <p className="text-gray-500">{t.discoverAll.replace("{name}", selectedCategory.name)}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {selectedCategory.products.map((p: any) => (
                  <TabletHorizontalCard key={p._id} product={p} t={t} lang={lang} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}