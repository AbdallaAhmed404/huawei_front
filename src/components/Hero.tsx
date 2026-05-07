"use client";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useLang } from "../../app/(main)/context/LanguageContext"; // تأكد من المسار

// تعريف نوع البيانات بناءً على الـ Schema الخاصة بك
interface SliderItem {
  _id: string;
  imageUrl: string;
  link?: string;
}

export default function HeroSlider() {
  const { lang } = useLang();
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. جلب البيانات من الـ API
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axios.get("https://huawei-production.up.railway.app/admin/sliders");
        // السيرفر يرجع { sliders: [...] } حسب الكود الخاص بك
        setSliders(res.data.sliders || []);
      } catch (err) {
        console.error("Failed to fetch sliders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  const autoplay = Autoplay({ delay: 4000, stopOnInteraction: false });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30,
      direction: lang === "ar" ? "rtl" : "ltr" },
    [autoplay, Fade()]
  );

  const onNavButtonClick = useCallback((callback: () => void) => {
    if (!emblaApi) return;
    callback();
    const autoplayPlugin = emblaApi.plugins().autoplay;
    if (autoplayPlugin) autoplayPlugin.reset();
  }, [emblaApi]);

  // حالة التحميل
  if (loading) {
    return (
      <div className="w-full h-[400px] md:h-[600px] bg-zinc-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    );
  }

  // إذا لم توجد صور
  if (sliders.length === 0) return null;

  return (
    <section className="relative w-full h-[350px] md:h-[600px] lg:h-[600px] overflow-hidden bg-white group mt-4">
      {/* Viewport */}
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {sliders.map((slider, index) => (
            <div key={slider._id || index} className="flex-[0_0_100%] min-w-0 h-full relative">
              {/* إذا كان هناك رابط للسلايدر كما في السكيما */}
              <a href={slider.link || "#"} className="block w-full h-full relative">
                <Image
                  src={slider.imageUrl}
                  alt="Huawei Promotion"
                  fill
                  className="object-contain md:object-cover"
                  priority={index === 0}
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Control Buttons - تظهر فقط إذا كان هناك أكثر من سلايدر */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={() => onNavButtonClick(() => emblaApi?.scrollPrev())}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-all duration-300 z-20 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 cursor-pointer"
          >
            <ChevronLeft size={32} strokeWidth={1} />
          </button>
          
          <button
            onClick={() => onNavButtonClick(() => emblaApi?.scrollNext())}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-all duration-300 z-20 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 cursor-pointer"
          >
            <ChevronRight size={32} strokeWidth={1} />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 transition-all duration-300 opacity-0 group-hover:opacity-100">
            {sliders.map((_, index) => (
              <div 
                key={index} 
                className={cn(
                   "w-2 h-2 rounded-full transition-all bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}