"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLang } from '../context/LanguageContext';

const translations = {
    en: {
        loginTitle: "Log in",
        loginDesc: "Log in to make purchase and view your orders.",
        loginBtn: "Log in",
        register: "Register",
        guestTitle: "OR Continue as guest",
        guestDesc: "You can complete your purchase without creating an account.",
        continueBtn: "Continue"
    },
    ar: {
        loginTitle: "تسجيل الدخول",
        loginDesc: "سجل دخولك لإتمام عملية الشراء واستعراض طلباتك.",
        loginBtn: "دخول",
        register: "إنشاء حساب جديد",
        guestTitle: "أو المتابعة كزائر",
        guestDesc: "يمكنك إتمام عملية الشراء دون الحاجة لإنشاء حساب.",
        continueBtn: "متابعة"
    }
};

export default function CheckoutMethodPage() {
    const router = useRouter();
    const { lang } = useLang();
    const t = translations[lang];
    const handleGuestContinue = () => {
        // توجيه لصفحة الـ checkout مع إضافة flag في الـ URL أو الـ state
        // ليعرف الـ Checkout أن هذا العميل زائر
        router.push('/checkout?method=guest');
    };

    return (
        <main className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-6">
            <div className="max-w-[1000px] w-full grid md:grid-cols-2 gap-8">
                
                {/* Left Card: Log in */}
                <div className="bg-white rounded-[24px] p-12 flex flex-col items-center text-center shadow-sm">
                    <h2 className="text-3xl font-bold mb-4">{t.loginTitle}</h2>
                    <p className="text-gray-500 mb-10 text-[15px]">
                        {t.loginDesc}
                    </p>
                    
                    <Link 
                        href="/login?redirect=checkout" 
                        className="w-full max-w-[200px] bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors mb-6"
                    >
                        {t.loginBtn}
                    </Link>

                    <Link href="/register" className="text-blue-600 font-medium hover:underline">
                        {t.register}
                    </Link>
                </div>

                {/* Right Card: Continue as guest */}
                <div className="bg-white rounded-[24px] p-12 flex flex-col items-center text-center shadow-sm">
                    <h2 className="text-3xl font-bold mb-4">{t.guestTitle}</h2>
                    <p className="text-gray-500 mb-16 text-[15px]">
                        {t.guestDesc}
                    </p>
                    
                    {/* تم إلغاء حقل الإيميل بناءً على طلبك */}
                    
                    <button 
                        onClick={handleGuestContinue}
                        className="w-full max-w-[200px] border-2 border-gray-200 text-black py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                    >
                        {t.continueBtn}
                    </button>
                </div>

            </div>
        </main>
    );
}