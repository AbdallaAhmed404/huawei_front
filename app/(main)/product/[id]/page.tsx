"use client";
import { useLang } from '../../context/LanguageContext';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // استيراد الأسهم
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from 'next/link'; // استيراد Link للتنقل بين الـ variants
import { useAuth } from '../../../(main)/context/AuthContext';


const translations = {
    en: {
        back: "Back",
        freeGift: "Free Gift",
        installment: "or starting from {amount} OMR/month",
        addToCart: "Add to Cart",
        buyNow: "Check out",
        gallery: "Gallery",
        specifications: "Specifications",
        omr: "OMR",
        Model: "Model",
        Color: "Color",
        Save: "Save",
        stock: " This color is currently out of stock",
        Qty: "Qty",
        cart: "Add to cart",
        Check: "Check out"
    },
    ar: {
        back: "رجوع",
        freeGift: "هدية مجانية",
        installment: "أو قسط يبدأ من {amount} ر.ع./شهراً",
        addToCart: "إضافة إلى السلة",
        buyNow: "شراء الآن",
        gallery: "معرض الصور",
        specifications: "المواصفات",
        omr: "ر.ع.",
        Model: "موديل",
        Color: "اللون",
        Save: "وفر",
        stock: "هذا اللون غير متوفر",
        Qty: "الكمية",
        cart: "اضف للعربة",
        Check: "اتمام الشراء"
    }
};
// --- تعريف الأنواع (Interfaces) لمنع أخطاء TypeScript ---
interface Gift {
    name: string;
    image: string;
}

interface ColorVariant {
    colorCode: string;
    images: string[];
    count: number;
}

interface GalleryItem {
    label: string;
    images: string[];
    isGrid?: boolean;
}

interface Product {
    _id: string;
    name: string;
    image: string;
    description: string;
    modelName: string;
    price: number;
    installmentPrice?: number;
    category: string;
    subCategory: string;
    discount: number;
    gifts: Gift[];
    colors: ColorVariant[];
    variants?: Product[]; // تم تحديثه ليدعم الـ populate من الـ Backend
}

const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i);
};

export default function ProductPurchasePage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { lang } = useLang();
    const t = translations[lang];
    const router = useRouter();
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
    const { addToCart } = useCart();
    // إضافة State لمؤشر الصورة الحالية
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { isAuthenticated } = useAuth();

    // حالة التحكم في السلايدر لكل قسم في الجاليري
    const [gallerySlideIndices, setGallerySlideIndices] = useState<number[]>([]);

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: selectedColor ? selectedColor.images[0] : product.image,
            quantity: 1,
            colorCode: selectedColor?.colorCode || 'Default',
            modelName: product.modelName,
            discount: product.discount
        });

        router.push('/cart');
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`https://api.huaweioman.com/user/product/${id}`);
                const data: Product = res.data;
                setProduct(data);
                if (data.colors?.length > 0) {
                    setSelectedColor(data.colors[0]);
                }

                // جلب بيانات الجاليري (Key Features)
                try {
                    const galleryRes = await axios.get(`https://api.huaweioman.com/admin/gallery/${id}`);
                    if (galleryRes.data) {
                        const items = galleryRes.data.galleryItems || [];
                        setGallery(items);
                        setGallerySlideIndices(new Array(items.length).fill(0));
                    }
                } catch (err) {
                    console.log("No gallery found for this product");
                }

            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    // دالة الشراء الفوري (Check out)
    const handleCheckout = () => {
        if (!product) return;

        // إضافة المنتج للسلة أولاً لضمان وجود الداتا في الـ Context
        addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: selectedColor ? selectedColor.images[0] : product.image,
            quantity: 1,
            colorCode: selectedColor?.colorCode || 'Default',
            modelName: product.modelName,
            discount: product.discount
        });

        if (isAuthenticated) {
            // إذا كان مسجل دخول، توجه مباشرة لصفحة التشيك أوت
            router.push('/checkout');
        } else {
            // إذا لم يكن مسجلاً، توجه لصفحة الـ Login أولاً
            // يمكنك إضافة query parameter لإعادته للتشيك أوت بعد الدخول
            router.push('/checkout-method');
        }
    };

    // إعادة ضبط مؤشر الصورة عند تغيير اللون المختار
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedColor]);

    // وظائف التنقل في سلايدر الجاليري
    const nextGallerySlide = (sectionIdx: number) => {
        setGallerySlideIndices(prev => {
            const newState = [...prev];
            const totalImages = gallery[sectionIdx].images.length;
            const maxScroll = totalImages - 4;
            newState[sectionIdx] = newState[sectionIdx] >= maxScroll ? 0 : newState[sectionIdx] + 1;
            return newState;
        });
    };

    const prevGallerySlide = (sectionIdx: number) => {
        setGallerySlideIndices(prev => {
            const newState = [...prev];
            const totalImages = gallery[sectionIdx].images.length;
            const maxScroll = totalImages - 4;
            newState[sectionIdx] = newState[sectionIdx] <= 0 ? (maxScroll > 0 ? maxScroll : 0) : newState[sectionIdx] - 1;
            return newState;
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center font-bold">Product not found.</div>;

    // تحديد مصفوفة الصور الحالية بناءً على اللون المختار أو الصورة الأساسية
    const currentImages = selectedColor ? selectedColor.images : [product.image];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
    };

    return (
        <main className="bg-white min-h-screen pt-20 pb-10 font-sans">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* <div className="w-full lg:w-[60%] lg:sticky lg:top-24 h-full group">
                        <div className="rounded-[15px] overflow-hidden relative flex items-center justify-center p-8 h-full min-h-[500px] bg-white">

                            {currentImages.length > 1 && (
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 z-10 p-2 rounded-full bg-white/80 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                                >
                                    <ChevronLeft size={24} className="text-black" />
                                </button>
                            )}

                            <img
                                src={currentImages[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-contain max-h-[70vh] transition-all duration-500"
                            />

                            {currentImages.length > 1 && (
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 z-10 p-2 rounded-full bg-white/80 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                                >
                                    <ChevronRight size={24} className="text-black" />
                                </button>
                            )}
                        </div>

                        <div className="flex justify-center gap-2 mt-6">
                            {currentImages.map((_, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentImageIndex(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-black w-4' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div> */}

                    <div className="w-full lg:w-[60%] lg:sticky lg:top-24 h-fit group">
                        {/* الحاوية الرئيسية للصور - أضفنا h-auto أو ارتفاع محدد للموبايل */}
                        <div className="rounded-[15px] overflow-hidden relative flex items-center bg-white min-h-[400px] md:min-h-[500px]">

                            {/* زر السهم الأيسر - مخفي في الموبايل لتسهيل التصفح باللمس (اختياري) */}
                            {currentImages.length > 1 && (
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 z-20 p-2 rounded-full bg-transparent   lg:group-hover:opacity-100 transition-opacity duration-300 block"
                                >
                                    <ChevronLeft size={24} className="text-black" />
                                </button>
                            )}

                            {/* الحاوية المتحركة (Slider Track) */}
                            <div
                                className="flex transition-transform duration-500 ease-in-out w-full h-full"
                                style={{
                                    transform: `translateX(${lang === 'ar' ? (currentImageIndex * 100) : -(currentImageIndex * 100)}%)`,
                                    // التأكد من أن الـ Direction لا يؤثر على الحسابات
                                    direction: 'ltr'
                                }}
                            >
                                {currentImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="w-full flex-shrink-0 flex items-center justify-center p-4 md:p-8"
                                        style={{ minWidth: '100%' }} // تأكيد أن كل شريحة تأخذ 100% بالظبط
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} - ${idx}`}
                                            className="w-full h-auto max-h-[50vh] md:max-h-[70vh] object-contain select-none"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* زر السهم الأيمن */}
                            {currentImages.length > 1 && (
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 z-20 p-2 rounded-full bg-transparent  lg:group-hover:opacity-100 transition-opacity duration-300  block"
                                >
                                    <ChevronRight size={24} className="text-black" />
                                </button>
                            )}
                        </div>

                        {/* مؤشرات النقاط (Dots) */}
                        <div className="flex justify-center gap-2 mt-4 md:mt-6">
                            {currentImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentImageIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-black w-6' : 'bg-gray-300'
                                        }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 2. الجانب الأيمن: الخيارات */}
                    <div className="w-full lg:w-[40%] space-y-8 text-left ">
                        <div>
                            <h1 className="text-[32px] md:text-[40px] font-bold text-black mt-2 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-gray-500 text-sm mt-2">{product.description}</p>
                        </div>

                        <div className="space-y-4 border-t border-gray-90 pt-5">
                            <h4 className="text-[16px] font-bold text-black">{t.Model}</h4>
                            <div className="flex flex-col gap-3">
                                {/* الموديل الحالي */}
                                <div className="border-2 border-black p-4 rounded-[15px] bg-gray-50">
                                    <p className="font-bold text-sm">{product.modelName}</p>
                                    <p className="text-xs text-gray-500 mt-1">{product.category} - {product.subCategory} </p>
                                </div>

                                {/* عرض الـ Variants المرتبطة */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                        {product.variants.map((variant) => (
                                            <Link
                                                key={variant._id}
                                                href={`/product/${variant._id}`}
                                                className="border border-gray-200 p-4 rounded-[15px] hover:border-black transition-all group"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold text-sm group-hover:text-black">{variant.modelName}</p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <div className="relative w-3.5 h-3.5">
                                                                <Image
                                                                    src="/oman-riyal.svg"
                                                                    alt="OMR"
                                                                    fill
                                                                    className="object-contain"
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-400 group-hover:text-black font-bold">
                                                                {variant.price.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-black" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {product.colors?.length > 0 && (
                            <div className="space-y-4 border-t border-gray-90 pt-5">
                                <h4 className="text-[16px] font-bold text-black">{t.Color}</h4>
                                <div className="flex gap-4">
                                    {product.colors.map((color: ColorVariant, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 p-1 ${selectedColor?.colorCode === color.colorCode ? 'border-black' : 'border-transparent'}`}
                                        >
                                            <div
                                                className="w-full h-full rounded-full shadow-inner"
                                                style={{ backgroundColor: color.colorCode }}
                                            />
                                        </button>
                                    ))}

                                </div>
                                {selectedColor && (
                                    <span className={`text-[12px] font-bold px-2 py-0.5 rounded-md ${selectedColor.count > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {selectedColor.count > 0 ? `In Stock: ${selectedColor.count}` : 'Out of Stock'}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* سيتم فحص وجود الهدايا وطول المصفوفة قبل عرض أي شيء */}
                        {product.gifts && product.gifts.length > 0 && (
                            <div className="space-y-4 border-t border-gray-90 pt-5">
                                <h4 className="text-[16px] font-bold text-black">{t.freeGift}</h4>
                                <div className="space-y-6">
                                    {product.gifts.map((gift: Gift, idx: number) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="w-25 h-25 bg-gray-50 rounded-[15px] p-2">
                                                <img src={gift.image} alt={gift.name} className="object-contain" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold leading-snug">{gift.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500">{t.Qty}: 1</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="sticky bottom-0 bg-white/90 backdrop-blur-md pt-8 pb-4 border-t border-gray-100 flex flex-col gap-4">
                            <div className="flex justify-between items-end">
                                <div className="min-w-0">
                                    {/* السعر بعد الخصم (السعر الحالي الذي يدفعه العميل) */}
                                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                                        <div className="relative w-6 h-6 flex-shrink-0">
                                            <Image
                                                src="/oman-riyal.svg"
                                                alt="OMR"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <p className="text-[24px] font-bold text-black truncate">
                                            {(product.price - (product.discount || 0)).toLocaleString()}
                                        </p>

                                        {/* السعر الأصلي قبل الخصم (عليه خط ولونه رمادي) */}
                                        {product.discount > 0 && (
                                            <div className="flex items-center gap-1 ml-2 opacity-60">
                                                <div className="relative w-4 h-4 flex-shrink-0">
                                                    <Image
                                                        src="/oman-riyal.svg"
                                                        alt="OMR"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <p className="text-[16px] text-zinc-400 line-through truncate">
                                                    {product.price?.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* تفاصيل الخصم: القيمة الموفرة */}
                                    {product.discount > 0 && (
                                        <div className="mt-1 flex items-center gap-1 whitespace-nowrap">
                                            <p className="text-[13px] text-[#CF1322] font-bold uppercase">{t.Save}</p>
                                            <div className="relative w-3.5 h-3.5 flex-shrink-0">
                                                <Image
                                                    src="/oman-riyal.svg"
                                                    alt="OMR"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <p className="text-[13px] font-bold truncate">
                                                {product.discount.toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {selectedColor && selectedColor.count > 0 ? (
                                    <>
                                        <button onClick={handleAddToCart} className="bg-white border-2 border-black py-4 rounded-[15px] font-bold text-sm hover:bg-gray-50 transition-colors">
                                            {t.cart}
                                        </button>
                                        <button onClick={handleCheckout} className="bg-[#CF1322] text-white py-4 rounded-[15px] font-bold text-sm hover:bg-[#b0101d] transition-colors">
                                            {t.Check}
                                        </button>
                                    </>
                                ) : (
                                    <div className="col-span-2 py-4 px-6 bg-gray-100 text-gray-500 rounded-[15px] font-bold text-center border border-gray-200">
                                        {t.stock}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- إضافة قسم الجاليري (Key Features) مع عناوين مجموعات الصور --- */}
                {/* {gallery.length > 0 && (
                    <section className="mt-24 border-t border-gray-100 pt-16">
                        <div className="space-y-24">
                            {gallery.map((item, idx) => (
                                <div key={idx} className="space-y-6">
                                    <div className="flex justify-start">
                                        <h3 className="text-[22px] font-bold text-black  pl-4 text-left">
                                            {item.label}
                                        </h3>
                                    </div>
                                    
                                    <div className="relative group/slider w-full">
                                        <div className="overflow-hidden rounded-[20px]">
                                            <div 
                                                className="flex transition-transform duration-500 ease-in-out gap-4"
                                                style={{ transform: `translateX(-${gallerySlideIndices[idx] * 25}%)` }}
                                            >
                                                {item.images.map((imgUrl, imgIdx) => (
                                                    <div key={imgIdx} className="min-w-[calc(25%-12px)] relative bg-gray-50 rounded-[15px] overflow-hidden aspect-square border border-gray-100">
                                                        <img 
                                                            src={imgUrl} 
                                                            alt={`${item.label} ${imgIdx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {item.images.length > 4 && (
                                            <>
                                                <button 
                                                    onClick={() => prevGallerySlide(idx)}
                                                    className="absolute -left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-xl text-black hover:bg-gray-50 transition-all z-10"
                                                >
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button 
                                                    onClick={() => nextGallerySlide(idx)}
                                                    className="absolute -right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-xl text-black hover:bg-gray-50 transition-all z-10"
                                                >
                                                    <ChevronRight size={24} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )} */}

                {/* --- قسم الجاليري بنظام Grid ذكي --- */}
                {/* --- قسم الجاليري المتطور (Grid أو Slider) --- */}
                {gallery.length > 0 && (
                    <section className="mt-24 border-t border-gray-100 pt-16">
                        <div className="space-y-24">
                            {gallery.map((item, idx) => (
                                <div key={idx} className="space-y-6">
                                    {/* عنوان المجموعة مع خط أحمر جانبي */}
                                    <div className="flex justify-start">
                                        <h3 className="text-[22px] font-bold text-black pl-4 border-l-4 border-[#CF1322] text-left">
                                            {item.label}
                                        </h3>
                                    </div>

                                    {item.isGrid ? (
                                        /* --- أولاً: عرض نظام الـ Grid الذكي --- */
                                        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-[200px_200px] md:grid-rows-[300px_300px] gap-0 overflow-hidden rounded-[20px] border border-gray-200">
                                            {item.images.map((imgUrl, imgIdx) => {
                                                let gridSpan = "col-span-1 row-span-1";
                                                if (item.images.length === 1) gridSpan = "col-span-4 row-span-2";
                                                else if (item.images.length === 2) gridSpan = "col-span-2 row-span-2";
                                                else if (imgIdx === 0) gridSpan = "col-span-2 row-span-2";
                                                else if (imgIdx === 1 && item.images.length > 2) gridSpan = "col-span-2 row-span-1";

                                                return (
                                                    <div
                                                        key={imgIdx}
                                                        onClick={() => setSelectedImage(imgUrl)}
                                                        className={`${gridSpan} relative group overflow-hidden border-[0.5px] border-white cursor-pointer`}
                                                    >
                                                        {/* الكود الجديد لدعم الفيديو والصور في الـ Grid */}
                                                        {isVideo(imgUrl) ? (
                                                            <video
                                                                src={imgUrl}
                                                                className="w-full h-full object-cover"
                                                                autoPlay
                                                                playsInline
                                                                muted
                                                                loop

                                                            />
                                                        ) : (
                                                            <img
                                                                src={imgUrl}
                                                                alt={`${item.label} ${imgIdx + 1}`}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        /* --- ثانياً: عرض نظام السلايدر مع الأسهم --- */
                                        <div className="relative group/slider w-full">
                                            <div className="overflow-hidden rounded-[20px]">
                                                <div
                                                    className="flex transition-transform duration-500 ease-in-out gap-4"
                                                    style={{ transform: `translateX(${lang === 'ar' ? (gallerySlideIndices[idx] * 25) : -(gallerySlideIndices[idx] * 25)}%)` }}
                                                >
                                                    {item.images.map((imgUrl, imgIdx) => (
                                                        <div
                                                            key={imgIdx}
                                                            onClick={() => setSelectedImage(imgUrl)}
                                                            className="min-w-[calc(25%-12px)] relative bg-gray-50 rounded-[15px] overflow-hidden aspect-square border border-gray-100 cursor-pointer group"
                                                        >
                                                            {/* الكود الجديد لدعم الفيديو والصور في الـ Slider */}
                                                            {isVideo(imgUrl) ? (
                                                                <video
                                                                    src={imgUrl}
                                                                    className="w-full h-full object-cover"
                                                                    autoPlay
                                                                    playsInline
                                                                    muted
                                                                    loop

                                                                />
                                                            ) : (
                                                                <img
                                                                    src={imgUrl}
                                                                    alt={`${item.label} ${imgIdx + 1}`}
                                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* أسهم التنقل للسلايدر - تظهر فقط إذا كان عدد الصور أكبر من 4 */}
                                            {item.images.length > 4 && (
                                                <>
                                                    <button
                                                        onClick={() => prevGallerySlide(idx)}
                                                        className="absolute -left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-xl text-black hover:bg-gray-50 transition-all z-10"
                                                    >
                                                        <ChevronLeft size={24} />
                                                    </button>
                                                    <button
                                                        onClick={() => nextGallerySlide(idx)}
                                                        className="absolute -right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-xl text-black hover:bg-gray-50 transition-all z-10"
                                                    >
                                                        <ChevronRight size={24} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* --- المودال الموحد (البوب أب) بخلفية Blur --- */}
                        {selectedImage && (
                            <div
                                className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all duration-300"
                                onClick={() => setSelectedImage(null)}
                            >
                                <button
                                    className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition-colors z-[1000]"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    &times;
                                </button>

                                {/* الكود الجديد لعرض الفيديو بشكل كامل عند الضغط عليه */}
                                <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
                                    {selectedImage && isVideo(selectedImage) ? (
                                        <video
                                            src={selectedImage}
                                            controls
                                            autoPlay
                                            muted={false}
                                            className="max-w-full max-h-full shadow-2xl animate-in zoom-in duration-300"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <img
                                            src={selectedImage || ''}
                                            alt="Full size view"
                                            className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in duration-300"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
}