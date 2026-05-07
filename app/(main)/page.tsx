"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import { X } from "lucide-react";
import Hero from "@/src/components/Hero";
import ProductCategories from "@/src/components/sections/Portfolio";
import FooterRegistry from "@/src/components/layout/FooterRegistry";

export default function Home() {
  const containerRef = useRef(null);
  
  // --- منطق البوب اب الجديد ---
  const [popup, setPopup] = useState<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const res = await axios.get("https://api.huaweioman.com/admin/popup");
        if (res.data.popup && res.data.popup.imageUrl) {
          setPopup(res.data.popup);
          // يظهر مرة واحدة فقط في كل جلسة متصفح
          const hasSeen = sessionStorage.getItem("hasSeenWelcomePopup");
          if (!hasSeen) {
            setIsPopupOpen(true);
          }
        }
      } catch (err) {
        console.error("Popup fetch error:", err);
      }
    };
    fetchPopup();
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
    sessionStorage.setItem("hasSeenWelcomePopup", "true");
  };
  // ---------------------------

  // تتبع السكرول (الكود الأصلي بدون تغيير)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // إضافة Spring لجعل السكرول ناعم جداً (Smooth transition)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100, // قوة الربيع
    damping: 30,    // سرعة التوقف (منع الاهتزاز)
    restDelta: 0.001
  });

  // 1. البلور بيزيد ببطء شديد على مسافة أطول (0.4 بدلاً من 0.1)
  const blurValue = useTransform(smoothProgress, [0, 0.4], ["blur(0px)", "blur(8px)"]);
  
  // 2. التعتيم الرمادي بيزيد تدريجياً
  const overlayColor = useTransform(
    smoothProgress, 
    [0, 0.4], 
    ["rgba(128, 128, 128, 0)", "rgba(0, 0, 0, 0.4)"] 
  );

  // 3. الـ Parallax بيتحرك لمسافة أكبر ببطء انسيابي
  const yValue = useTransform(smoothProgress, [0, 0.5], [0, -150]);

  return (
    <main ref={containerRef} className="relative bg-white h-[250vh] md:h-[250vh]">
      
      {/* --- واجهة البوب اب المنبثقة --- */}
      {isPopupOpen && popup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-500">
          <div className="relative max-w-[90%] w-[450px] animate-in fade-in zoom-in duration-300">
            <button 
              onClick={closePopup}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <Link href={popup.link || "#"} onClick={closePopup}>
              <div className="rounded-[15px] overflow-hidden shadow-2xl group bg-white">
                <img 
                  src={popup.imageUrl} 
                  alt="Welcome" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </Link>
          </div>
        </div>
      )}
      {/* --------------------------- */}

      {/* سكشن الهيرو الثابت */}
      <motion.div 
        style={{ y: yValue }}
        className="sticky top-0 z-0 h-[35vh] md:h-screen w-full overflow-hidden"
      >
        {/* طبقة الـ Overlay الرمادية والبلور */}
        <motion.div 
          style={{ 
            backdropFilter: blurValue, 
            backgroundColor: overlayColor,
            WebkitBackdropFilter: blurValue 
          }}
          className="absolute inset-0 z-10 pointer-events-none"
        />
        
        <Hero />
      </motion.div>

      {/* سكشن المحتوى */}
      <div className="relative z-20 mt-0 md:-mt-[23vh]">
        <ProductCategories />
        <FooterRegistry />
        {/* مساحة إضافية للسكرول لضمان السلاسة */}
      </div>
    </main>
  );
}