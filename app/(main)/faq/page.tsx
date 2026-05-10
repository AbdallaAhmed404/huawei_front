"use client";
import React, { useState } from 'react';
import { useLang } from '../context/LanguageContext'; 
import { ChevronRight, ChevronLeft, ShieldCheck, HelpCircle, FileText, Globe, ChevronDown, ShoppingBag, Truck, RefreshCcw, Package } from 'lucide-react';
import Link from 'next/link';

const translations = {
    en: {
        title: "Frequently Asked Questions (FAQ)",
        lastUpdated: "Last Updated: May 2026",
        back: "Back to Home",
        print: "Print Version",
        officialStore: "Huawei Official Store Oman",
        securePlatform: "24/7 Support Center",
        questions: [
            {
                id: "1",
                icon: <ShoppingBag size={20} />,
                question: "Can I make a purchase via hotline, live chat, or email?",
                answer: "No, we only accept orders placed directly through our official website (huaweioman.com) to ensure the security of your transactions."
            },
            {
                id: "2",
                icon: <Package size={20} />,
                question: "How can I check the availability of an item?",
                answer: "If an item is in stock, the 'Add to Cart' button will be visible and active. If an item is out of stock, the button will be disabled or hidden."
            },
            {
                id: "3",
                icon: <HelpCircle size={20} />,
                question: "How can I track my order list?",
                answer: "When using a Huawei account: Log in to your personal account and click on 'Track Order' to see the real-time status of your shipments."
            },
            {
                id: "4",
                icon: <FileText size={20} />,
                question: "Can I modify order information (recipient, address, etc.) after dispatch?",
                answer: "No, order information cannot be modified once the shipment has been dispatched from our warehouse."
            },
            {
                id: "5",
                icon: <Truck size={20} />,
                question: "When will my order be shipped?",
                answer: "In general, if items are in stock, they will be shipped within two (2) business days after the order is placed. We will notify you if any items are temporarily out of stock or if more time is needed for delivery."
            },
            {
                id: "6",
                icon: <RefreshCcw size={20} />,
                question: "What is the return period for undamaged products?",
                answer: "You have seven (7) days to notify us of your desire to return a product, provided that the product has not been opened and the packaging is in its original condition."
            }
        ]
    },
    ar: {
        title: "الأسئلة الشائعة",
        lastUpdated: "آخر تحديث: مايو 2026",
        back: "العودة للرئيسية",
        print: "طباعة نسخة",
        officialStore: "متجر هواوي الرسمي - عُمان",
        securePlatform: "مركز الدعم والمساعدة",
        questions: [
            {
                id: "1",
                icon: <ShoppingBag size={20} />,
                question: "هل يمكنني إجراء عملية شراء من خلال الخط الساخن، أو الدردشة المباشرة، أو عبر البريد الإلكتروني؟",
                answer: "لا، فنحن لا نقبل سوى الطلبات المقدمة عبر موقع الويب الرسمي لضمان أمان وسلامة معاملاتكم."
            },
            {
                id: "2",
                icon: <Package size={20} />,
                question: "كيف يمكنني معرفة مدى توفر أحد العناصر في المخزون؟",
                answer: "في حال وجود أحد العناصر في المخزون، فسوف يتوفر الزر 'إضافة إلى عربة التسوق'. وفي حال نفاد مخزون أحد العناصر لن يتوفر الزر."
            },
            {
                id: "3",
                icon: <HelpCircle size={20} />,
                question: "كيف يمكنني تتبع لائحة الطلبات؟",
                answer: "عند استخدام حساب هواوي: قم بتسجيل الدخول إلى الحساب الشخصي وانقر فوق 'تتبع الطلب' لمتابعة حالة شحناتك."
            },
            {
                id: "4",
                icon: <FileText size={20} />,
                question: "هل يمكنني تعديل معلومات الطلب (المستلم، العنوان، وما إلى ذلك) بعد الإرسال؟",
                answer: "لا، لا يمكنك تعديل معلومات الطلب بعد إرساله من المستودع."
            },
            {
                id: "5",
                icon: <Truck size={20} />,
                question: "متى سيتم شحن لائحة الطلبات؟",
                answer: "بشكلٍ عام، إذا كانت العناصر متوفرة في المخزون، فسيتم شحنها خلال يومَي (2) عمل بعد إجراء الطلب. وسوف نخبرك في حالة نفاد أي من العناصر مؤقتًا أو الحاجة إلى مزيد من الوقت للتوصيل."
            },
            {
                id: "6",
                icon: <RefreshCcw size={20} />,
                question: "كم تبلغ مدة إرجاع (سحب) المنتجات غير التالفة؟",
                answer: "يتوفر لديك سبعة (7) أيام لإخطارنا برغبتك في إرجاع المنتج شريطة عدم فتح ذلك المنتج وأن يكون التغليف على حالته الأصلية."
            }
        ]
    }
};

export default function FAQPage() {
    const { lang } = useLang();
    const t = translations[lang];
    const isRtl = lang === 'ar';
    const [openId, setOpenId] = useState<string | null>("1");

    return (
        <main className={`min-h-screen bg-white py-20 px-6 font-sans ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="max-w-[900px] mx-auto">
                
                {/* Header Section */}
                <div className="mb-12 border-b border-gray-100 pb-8 text-center md:text-start">
                    
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                        {t.title}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 text-sm">
                        <span className="bg-gray-50 px-3 py-1 rounded-full">{t.lastUpdated}</span>
                        <div className="flex items-center gap-1">
                            <Globe size={14} />
                            <span>Support Oman</span>
                        </div>
                    </div>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {t.questions.map((item) => (
                        <div 
                            key={item.id} 
                            className={`border rounded-[20px] transition-all duration-300 ${openId === item.id ? 'border-[#CF1322] bg-red-50/10 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                        >
                            <button 
                                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                                className="w-full flex items-center justify-between p-6 text-start"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl transition-colors ${openId === item.id ? 'bg-[#CF1322] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-base md:text-lg font-bold transition-colors ${openId === item.id ? 'text-black' : 'text-gray-700'}`}>
                                        {item.question}
                                    </span>
                                </div>
                                <ChevronDown 
                                    size={20} 
                                    className={`text-gray-400 transition-transform duration-300 ${openId === item.id ? 'rotate-180 text-[#CF1322]' : ''}`} 
                                />
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ${openId === item.id ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-6 pb-6 pt-0">
                                    <div className="h-[1px] bg-gray-100 mb-4 w-full" />
                                    <p className="text-gray-600 leading-relaxed text-[16px] md:text-[17px] ps-12">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

               
            </div>

            <style jsx global>{`
                .rtl { font-family: 'Tajawal', sans-serif; }
                .ltr { font-family: 'Inter', sans-serif; }
                p { text-align: justify; }
            `}</style>
        </main>
    );
}