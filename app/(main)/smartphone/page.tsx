"use client";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Link from "next/link"; // إضافة Link للانتقال بين الصفحات
import { X } from "lucide-react";
import Image from "next/image";
// استيراد الـ Hook الخاص بالترجمة
import { useLang } from "../context/LanguageContext";

// كائن الترجمة للنصوص الثابتة في الصفحة
const translations = {
  en: {
    save: "Save",
    buyNow: "Buy Now",
    latestFrom: "Latest from",
    viewAll: "View All",
    allProducts: "All products under this category",
    loading: "Loading..."
  },
  ar: {
    save: "وفر",
    buyNow: "اشتر الآن",
    latestFrom: "أحدث إصدارات",
    viewAll: "عرض الكل",
    allProducts: "جميع المنتجات في هذه الفئة",
    loading: "جاري التحميل..."
  }
};

const ProductCard = ({ product, t, lang }: { product: any, t: any, lang: string }) => (
  // إضافة Link حول الكارت بالكامل ليوجه لصفحة التفاصيل بناءً على الـ ID
  <Link href={`/product/${product._id}-${product.name.replace(/\s+/g, '-').toLowerCase()}`} className="block h-full group">
    <div className="bg-[#F9F9F9] rounded-[15px] p-6 flex flex-col transition-all duration-300  shadow-lg border border-transparent hover:border-gray-100 h-[400px]">
      <div className="relative w-full h-[160px] mb-6 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-contain max-h-full max-w-full transform transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className={`flex flex-col flex-grow w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        <h3 className="text-[17px] font-bold text-black mb-1.5 leading-tight">{product.name}</h3>
        <p className="text-[12px] text-[#666666] leading-relaxed mb-4 line-clamp-2">{product.description}</p>
        <div className="mt-auto w-full pt-2">
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
                <span className="text-[10px]  font-bold truncate">
                  {product.discount.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          <div className={`text-black text-[14px] font-bold flex items-center gap-1 hover:gap-2 transition-all ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            {t.buyNow} <span className={`text-lg leading-none ${lang === 'ar' ? 'rotate-180' : ''}`}>›</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

// مكون الأيقونات بدون خلفية رمادية
const TopCategoryCard = ({ title, img }: { title: string; img: string }) => (
  <div className="flex flex-col items-center gap-3 group cursor-pointer min-w-[100px]">
    <div className="w-24 h-24 md:w-24 md:h-24 flex items-center justify-center p-2 transition-transform group-hover:scale-110">
      <img src={img} alt={title} className="object-contain max-h-full" />
    </div>
    <span className="text-xs font-bold text-black text-center">{title}</span>
  </div>
);

export default function SmartphonePage() {
  const { lang } = useLang();
  const t = translations[lang];

  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any>(null); // للتحكم في البوب اب

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("https://api.huaweioman.com/admin/categories"),
          axios.get("https://api.huaweioman.com/admin/allproduct")
        ]);
        const smartphoneMain = catRes.data.categories.find((c: any) => c.mainCategoryName === "Smartphone");
        setSubCategories(smartphoneMain?.subCategories || []);
        setProducts(prodRes.data.filter((p: any) => p.category === "Smartphone") || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">{t.loading}</div>;

  return (
    <main className="bg-white min-h-screen pb-20">
      {/* 1. Header Categories - بدون باك جراوند للأيقونات */}
      <section className="max-w-[1200px] mx-auto px-6 py-12 flex justify-center gap-8 md:gap-20 overflow-x-auto mt-5">
        {subCategories.map((sub) => (
          <TopCategoryCard key={sub._id} title={sub.name} img={sub.icon} />
        ))}
      </section>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {subCategories.map((sub) => {
          const subProducts = products.filter(p => p.subCategory === sub.name);
          if (subProducts.length === 0) return null;

          return (
            <section key={sub._id} className="py-14 border-b border-gray-50 last:border-0">
              <div className={`mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <h2 className="text-[30px] font-bold text-black">{sub.name}</h2>
                <p className="text-gray-500 text-[17px]">{t.latestFrom} {sub.name}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {subProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} t={t} lang={lang} />)}
              </div>

              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setSelectedCategory({ name: sub.name, products: subProducts })}
                  className={`bg-black text-white px-9 py-2.5 rounded-[15px] text-xs font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                >
                  {t.viewAll} <span className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black">+</span>
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {/* --- بوب اب عرض المنتجات (Modal) --- */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[1200px] max-h-[90vh] rounded-[15px] overflow-hidden flex flex-col relative shadow-2xl">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} p-2 hover:bg-gray-100 rounded-full transition-colors z-10`}
            >
              <X size={24} className="text-black" />
            </button>

            <div className={`p-8 md:p-12 overflow-y-auto ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="mb-10">
                <h2 className="text-[32px] font-bold text-black">{selectedCategory.name}</h2>
                <p className="text-gray-500">{t.allProducts}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCategory.products.map((p: any) => (
                  <ProductCard key={p._id} product={p} t={t} lang={lang} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}