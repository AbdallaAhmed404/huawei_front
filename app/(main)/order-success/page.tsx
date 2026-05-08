"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { useLang } from '../context/LanguageContext'; // تأكد من المسار الصحيح

const translations = {
    en: {
        confirming: "Confirming payment status...",
        successTitle: "Order Confirmed Successfully!",
        successDesc: "Thank you for shopping with Huawei Oman. Your payment has been received, and we have started preparing your order.",
        detailsTitle: "Transaction Details",
        transactionId: "Transaction ID:",
        paymentStatus: "Payment Status:",
        completed: "Completed (Success)",
        paymentMethod: "Payment Method:",
        methodName: "Credit Card (Paymob)",
        confirmationMsg: "A confirmation email with invoice details and delivery time will be sent to you within minutes.",
        backHome: "Back to Home",
        trackOrder: "Track Order",
        supportText: "If you have any questions, please contact Huawei Oman technical support.",
        notAvailable: "N/A"
    },
    ar: {
        confirming: "جاري تأكيد حالة الدفع...",
        successTitle: "تم تأكيد طلبك بنجاح!",
        successDesc: "شكراً لك على تسوقك من هواوي عُمان. تم استلام مدفوعاتك وبدأنا في تجهيز طلبك.",
        detailsTitle: "تفاصيل العملية",
        transactionId: "رقم العملية (Transaction ID):",
        paymentStatus: "حالة الدفع:",
        completed: "مكتمل (Success)",
        paymentMethod: "طريقة الدفع:",
        methodName: "بطاقة بنكية (Paymob)",
        confirmationMsg: "ستصلك رسالة تأكيد بتفاصيل الفاتورة وموعد التوصيل على بريدك الإلكتروني خلال دقائق.",
        backHome: "العودة للرئيسية",
        trackOrder: "تتبع الطلب",
        supportText: "إذا كان لديك أي استفسار، يرجى التواصل مع الدعم الفني لهواوي عُمان.",
        notAvailable: "غير متوفر"
    }
};

export default function OrderSuccessPage() {
    const { lang } = useLang();
    const t = translations[lang];
    const searchParams = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(true);
    
    const transactionId = searchParams.get('id');
    const isRTL = lang === 'ar';

    useEffect(() => {
        const timer = setTimeout(() => setIsProcessing(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isProcessing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-[#CF1322] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">{t.confirming}</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F5F5] py-12 px-4" dir={isRTL ? "rtl" : "ltr"}>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-[20px] p-8 shadow-sm text-center">
                    {/* أيقونة النجاح */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckCircle2 className="w-16 h-16 text-green-600" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-black mb-2">{t.successTitle}</h1>
                    <p className="text-gray-600 mb-8">{t.successDesc}</p>

                    {/* تفاصيل العملية */}
                    <div className="bg-[#F9F9F9] rounded-[15px] p-6 mb-8 text-start">
                        <h2 className="font-bold text-lg mb-4 border-b pb-2">{t.detailsTitle}</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t.transactionId}</span>
                                <span className="font-mono font-bold">{transactionId || t.notAvailable}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t.paymentStatus}</span>
                                <span className="text-green-600 font-bold">{t.completed}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t.paymentMethod}</span>
                                <span className="font-medium">{t.methodName}</span>
                            </div>
                        </div>
                    </div>

                    {/* رسالة توضيحية */}
                    <div className={`border-${isRTL ? 'r' : 'l'}-4 border-blue-500 bg-blue-50 p-4 mb-8 text-start`}>
                        <p className="text-blue-800 text-sm">
                            {t.confirmationMsg}
                        </p>
                    </div>

                    {/* أزرار التحكم */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/"
                            className="flex items-center justify-center gap-2 bg-[#CF1322] text-white px-8 py-4 rounded-[12px] font-bold hover:bg-black transition-all"
                        >
                            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                            {t.backHome}
                        </Link>
                        <Link 
                            href="/orders"
                            className="flex items-center justify-center gap-2 border border-gray-200 text-black px-8 py-4 rounded-[12px] font-bold hover:bg-gray-50 transition-all"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {t.trackOrder}
                        </Link>
                    </div>
                </div>

                {/* تذييل الصفحة */}
                <p className="text-center text-gray-400 mt-8 text-sm">
                    {t.supportText}
                </p>
            </div>
        </main>
    );
}