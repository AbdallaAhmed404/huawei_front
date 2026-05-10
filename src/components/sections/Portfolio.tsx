"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
// استيراد الـ Hook الخاص بالترجمة
import { useLang } from "../../../app/(main)/context/LanguageContext";

// كائن الترجمة للنصوص الثابتة المطلوبة
const translations = {
  en: {
    welcomeTitle: "Welcome to HUAWEI Store",
    welcomeSub: "The latest, fastest and most convenient way to shop for HUAWEI products.",
    latestTitle: "Latest Releases",
    latestSub: "Newly added innovation for you.",
    explore: "Explore the latest in",
    more: "More",
    orderNow: "Order Now",
    save: "Save",
    buy: "Buy",
    loading: "Loading Store..."
  },
  ar: {
    welcomeTitle: "مرحباً بكم في متجر هواوي",
    welcomeSub: "الطريقة الأحدث والأسرع والأكثر ملاءمة لتسوق منتجات هواوي.",
    latestTitle: "أحدث الإصدارات",
    latestSub: "ابتكارات جديدة تمت إضافتها من أجلك.",
    explore: "استكشف الأحدث في عالم",
    more: "المزيد",
    orderNow: "اطلب الآن",
    save: "وفر",
    buy: "شراء",
    loading: "جاري تحميل المتجر..."
  }
};

// --- الواجهات (Interfaces) المطابقة للـ API ---
interface SubCategory {
  name: string;
  icon: string;
}

interface CategoryConfig {
  mainCategoryName: string;
  mainIcon: string;
  subCategories: SubCategory[];
}

interface Gift {
  name: string;
  image: string;
}

interface ColorVariant {
  colorCode: string;
  images: string[];
}

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  modelName: string;
  price: number;
  discount: number;
  installmentPrice?: number;
  category: "Smartphone" | "Tablet" | "Audio" | "Wearable";
  subCategory: string;
  gifts: Gift[];
  colors: ColorVariant[];
  createdAt: string;
}

export default function Portfolio() {
  const { lang } = useLang();
  const t = translations[lang];

  const [categories, setCategories] = useState<CategoryConfig[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("https://api.huaweioman.com/admin/categories"),
          axios.get("https://api.huaweioman.com/admin/allproduct")
        ]);
        setCategories(catRes.data.categories || []);
        setProducts(prodRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const latestProducts = categories.map(cat => {
    const categoryProducts = products
      .filter(p => p.category === cat.mainCategoryName)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return categoryProducts[0];
  }).filter(product => product !== undefined);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-zinc-400">{t.loading}</div>;

  return (
    <section className="relative w-full bg-[#f9f9f9] rounded-t-[30px] md:rounded-t-[60px] pb-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 max-w-[1440px] pt-10">

        {/* 1. الترحيب والكاتيجوري الأساسي */}
        <div className={`mb-8 space-y-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <h2 className="text-[24px] md:text-[40px] font-bold text-black tracking-tight">{t.welcomeTitle}</h2>
          <p className="text-[14px] md:text-[18px] text-[#666666]">{t.welcomeSub}</p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-4 gap-y-10 mb-28">
          {categories.map((cat) => (
            <Link key={cat.mainCategoryName} href={`/${cat.mainCategoryName.toLowerCase()}`} className="group flex flex-col items-center text-center">
              <div className="relative w-full aspect-square max-w-[70px] md:max-w-[140px] transition-transform duration-500 group-hover:scale-110">
                <Image src={cat.mainIcon} alt={cat.mainCategoryName} fill className="object-contain" />
              </div>
              <span className="text-[10px] md:text-[12px] font-bold text-[#333333] mt-5 uppercase tracking-wider">{cat.mainCategoryName}</span>
            </Link>
          ))}
        </div>

        {/* 2. سكشن Latest Releases مع Slider */}
        <div className={`mb-10 flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex items-baseline gap-4 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <h3 className="text-[24px] md:text-[30px] font-bold text-black">{t.latestTitle}</h3>
            <p className="hidden md:block text-[#666666] text-[14px] md:text-[16px]">{t.latestSub}</p>
          </div>
          {/* أزرار التحكم */}
          <div className={`flex gap-3 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <button onClick={() => scroll(lang === 'ar' ? "right" : "left")} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button onClick={() => scroll(lang === 'ar' ? "left" : "right")} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 mb-32 no-scrollbar scroll-smooth "
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {latestProducts.map((item) => (
            <Link key={item._id} href={`/product/${item._id}-${item.name.replace(/\s+/g, '-').toLowerCase()}`} className="block  min-w-[100%] md:min-w-[calc(50%-12px)] h-full group">
              <div className={`flex flex-col md:flex-row bg-white rounded-[15px] overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-50 h-full ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                <div className="relative w-full md:w-[48%] bg-[#f3f4f1] flex items-center justify-center p-6 min-h-[360px]">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className={`w-full md:w-[52%] p-8 flex flex-col ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className="relative w-full aspect-[4/3] max-w-[180px] mb-4 self-center md:self-start">
                    <Image src={item.colors[0]?.images[0] || item.image} alt={item.modelName} fill className="object-contain" />
                  </div>
                  {item.colors.length > 0 && (
                    <div className={`flex gap-2 mb-6 justify-center md:justify-start ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                      {item.colors.slice(0, 3).map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded-[15px] border border-gray-200" style={{ backgroundColor: c.colorCode }} />
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col flex-grow">
                    <span className="text-red-500 text-[11px] font-bold uppercase">New in {item.category}</span>
                    <h4 className="text-[22px] font-bold text-black mt-1 mb-2">{item.name}</h4>
                    <p className="text-[12px] text-[#666666] leading-relaxed mb-6 line-clamp-3">{item.description}</p>
                    <div className={`mt-auto flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex flex-col min-w-0 ${lang === 'ar' ? 'items-end' : 'items-start'}`}>
                        <div className={`text-[20px] font-bold text-black flex items-center gap-1.5 whitespace-nowrap ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <div className="relative w-5 h-5 md:w-6 md:h-6 flex-shrink-0">
                            <Image src="/oman-riyal.svg" alt="OMR" fill className="object-contain" />
                          </div>
                          <span className="truncate">{item.price.toLocaleString()}</span>
                        </div>

                        {item.discount > 0 && (
                          <div className={`flex items-center gap-1 mt-0.5 whitespace-nowrap ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[11px] text-[#CF1322] font-bold uppercase">{t.save}</span>
                            <div className="relative w-3.5 h-3.5 flex-shrink-0">
                              <Image src="/oman-riyal.svg" alt="OMR" fill className="object-contain" />
                            </div>
                            <span className="text-[10px] font-bold truncate">{item.discount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <span className="px-8 py-2.5 bg-black text-white rounded-[15px] font-bold text-[13px] hover:bg-gray-800 transition-colors">{t.orderNow}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 3. سكاشن الأرفف */}
        {categories.map((catConfig) => {
          const categoryProducts = products.filter(p => p.category === catConfig.mainCategoryName);
          if (categoryProducts.length === 0) return null;
          return (
            <div key={catConfig.mainCategoryName} className="mb-24">
              <div className={`mb-8 flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-baseline gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-[26px] md:text-[30px] font-bold text-black">{catConfig.mainCategoryName}s</h3>
                  <p className="hidden md:block text-[#666666] text-[16px]">{t.explore} {catConfig.mainCategoryName.toLowerCase()}.</p>
                </div>
                <Link href={`/${catConfig.mainCategoryName.toLowerCase()}`} className={`text-gray-500 hover:text-black flex items-center gap-1 text-[14px] ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  {t.more} <span className={`text-[18px] ${lang === 'ar' ? 'rotate-180' : ''}`}>›</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categoryProducts.slice(0, 3).map((prod) => (
                  <Link key={prod._id} href={`/product/${prod._id}-${prod.name.replace(/\s+/g, '-').toLowerCase()}`} className="block group">
                    <div className="bg-white shadow-lg rounded-[15px] p-6 flex flex-col h-full transition-all border border-gray-50">
                      <div className="relative w-full aspect-[4/3] mb-6 rounded-[15px] overflow-hidden bg-white flex items-center justify-center">
                        <Image src={prod.image} alt={prod.name} fill className="object-contain p-6 transform group-hover:scale-105 transition-all duration-500" />
                      </div>
                      <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                        <span className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest">{prod.subCategory}</span>
                        <h4 className="text-[18px] font-bold text-black mt-1 mb-2">{prod.name}</h4>
                        <p className="text-[12px] text-[#666666] leading-snug line-clamp-2 h-9 mb-6">{prod.description}</p>
                      </div>
                      <div className={`mt-auto pt-4 flex items-end justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <div className={lang === 'ar' ? 'flex flex-col items-end' : ''}>
                          <div className={`text-[18px] font-bold text-black flex items-center gap-1.5 whitespace-nowrap ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <div className="relative w-5 h-5 md:w-6 md:h-6 flex-shrink-0">
                              <Image src="/oman-riyal.svg" alt="OMR" fill className="object-contain" />
                            </div>
                            <span className="truncate">{prod.price.toLocaleString()}</span>
                          </div>

                          {prod.discount > 0 && (
                            <div className={`flex items-center gap-1 mt-0.5 whitespace-nowrap ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                              <span className="text-[11px] text-[#CF1322] font-bold uppercase">{t.save}</span>
                              <div className="relative w-3.5 h-3.5 flex-shrink-0">
                                <Image src="/oman-riyal.svg" alt="OMR" fill className="object-contain" />
                              </div>
                              <span className="text-[10px] font-bold truncate">{prod.discount.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        {prod.gifts.length > 0 ? (
                          <div className="w-12 h-12 bg-[#f9f9f9] rounded-[15px] p-2 border border-gray-100 flex items-center justify-center relative group/gift">
                            <span className={`absolute -top-7 ${lang === 'ar' ? 'left-0' : 'right-0'} text-[9px] bg-white shadow-sm px-2 py-1 rounded opacity-0 group-hover/gift:opacity-100 transition-opacity whitespace-nowrap`}>Free {prod.gifts[0].name}</span>
                            <Image src={prod.gifts[0].image} alt="gift" width={32} height={32} className="object-contain" />
                          </div>
                        ) : (
                          <span className="text-black font-bold text-sm">{t.buy} <span className={lang === 'ar' ? 'inline-block rotate-180' : ''}>›</span></span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}