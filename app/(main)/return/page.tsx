"use client";
import React from 'react';
import { useLang } from '../context/LanguageContext'; 
import { ChevronRight, ChevronLeft, ShieldCheck, RefreshCcw, FileText, Globe, HelpCircle, AlertTriangle, CreditCard, PackageCheck } from 'lucide-react';
import Link from 'next/link';

const translations = {
    en: {
        title: "Return & Replacement Policy",
        lastUpdated: "Last Updated: May 2026",
        back: "Back to Home",
        print: "Print Version",
        officialStore: "Huawei Official Store Oman",
        securePlatform: "Verified Consumer Rights",
        sections: [
            {
                id: "1",
                title: "1. Returning Non-Damaged Products",
                content: [
                    "1.1 Upon delivery of the products purchased on this platform, you have seven (7) days to decide whether to keep them, provided the products are unopened and the packaging is in its original condition. You have an additional seven (7) days to return the products once Huawei approves your return request. You will receive a return voucher with a 'pick-up' service at no personal cost. If you do not use the provided voucher, you may have to cover the shipping costs yourself.",
                    "1.2 All returned products must be in their original packaging, including all accessories and promotional items. These items are provided on the condition that you keep the products. To receive a full refund, we recommend returning all accessories; otherwise, a reasonable compensation fee may be charged.",
                    "1.3 Products must be free from any damage. If the products are returned incomplete or in a deteriorated condition, you may be required to compensate Huawei for the loss in value."
                ]
            },
            {
                id: "2",
                title: "2. Replacement or Repair of Defective Products",
                content: [
                    "2.1 If products purchased on this platform are defective, legal consumer rights in the Sultanate of Oman apply, in addition to the rights granted under Huawei's Voluntary Warranty Policy.",
                    "2.2 For manufacturing defects, you can request a replacement within fourteen (14) days of receipt or a repair during the warranty period. Contact us to arrange the return for assessment. If the inspection confirms a defect, under Oman's Consumer Protection Law, you are entitled to a repair or replacement. If no fault is found, the product will be returned to you, and shipping costs may apply.",
                    "2.3 We recommend using the original packaging when returning products.",
                    "2.4 The following are NOT 'manufacturing defects': (a) Wear and tear; (b) Unauthorized alterations or repairs; (c) Misuse or incorrect use; (d) Non-compliance with manufacturer instructions; (e) Use of non-original accessories; (f) Exclusions stated in the warranty policy.",
                    "2.5 Do not accept delivery of clearly damaged items. If discovered after receipt, report it within twenty-four (24) hours for assessment.",
                    "2.6 Damage caused by misuse or unauthorized alterations excludes any right to repair, replacement, or refund.",
                    "2.7 Huawei is not liable for data loss on products returned for replacement or repair."
                ]
            },
           
            {
                id: "3",
                title: "3. Refunds",
                content: [
                    "3.1 Orders can be cancelled before packaging. Refunds will be processed within fourteen (14) days of receiving the request. The actual receipt date depends on your bank.",
                    "3.2 For returns after receipt, we will refund all payments (excluding shipping fees) within fourteen (14) days of receiving the return request, subject to receiving the products or proof of return. We use the same payment method used for the order, except for Cash on Delivery (COD), where refunds are processed via a method chosen by you in a formal written format. Refunds are subject to the products passing inspection."
                ]
            }
        ]
    },
    ar: {
        title: "سياسة الإرجاع والاستبدال",
        lastUpdated: "آخر تحديث: مايو 2026",
        back: "العودة للرئيسية",
        print: "طباعة نسخة",
        officialStore: "متجر هواوي الرسمي - عُمان",
        securePlatform: "حقوق مستهلك مضمونة",
        sections: [
            {
                id: "1",
                title: "1. إرجاع المنتجات غير التالفة",
                content: [
                    "1.1 لدى تسليمك المنتجات، يكون لديك سبعة أيام (7) لتحديد ما إذا كنت ستحتفظ بها أم لا، شريطة عدم فتح المنتجات وأن يكون التغليف على حالته الأصلية. ويكون أمامك سبعة (7) أيام أخرى لإعادة المنتجات بعد اعتماد طلب الإرجاع. ستحصل على قسيمة إرجاع مع خدمة 'الاستلام' مجاناً؛ وفي حال عدم استخدامها، قد تضطر لتغطية تكاليف الشحن بنفسك.",
                    "1.2 يجب أن يكون تغليف المنتجات المُرجَعة على حالته الأصلية، مع إرجاع كافة الملحقات والعناصر الترويجية. ولا تقدم هذه الملحقات إلا بشرط احتفاظك بالمنتجات. لاسترداد أموالك بالكامل، نوصي بإرجاع الملحقات بالكامل وإلا قد تضطر لدفع تعويض مناسب.",
                    "1.3 يجب أن تكون المنتجات خالية من أي تلف. إذا تعذر إرجاع المنتجات كاملة أو كانت حالتها متدهورة، فيتعين عليك تعويض هواوي عن قيمتها عند الضرورة."
                ]
            },
            {
                id: "2",
                title: "2. استبدال أو إصلاح المنتجات المعيبة",
                content: [
                    "2.1 إذا كانت المنتجات معيبة، تُطبق حقوق المستهلك القانونية المعمول بها في سلطنة عُمان، بالإضافة إلى سياسة الضمان الطوعية لشركة هواوي.",
                    "2.2 لعيوب التصنيع، يمكنك طلب الاستبدال خلال (14) يوماً من الاستلام أو الإصلاح خلال مدة الضمان. تواصل معنا لترتيب الإرجاع والتقييم؛ وإذا ثبت العيب، يحق لك الإصلاح أو الاستبدال وفقاً لقانون حماية المستهلك العُماني. في حال عدم وجود عطل، سيتم إرجاع المنتج وتحميلك تكاليف الشحن.",
                    "2.3 نوصي باستخدام التغليف الأصلي عند إرجاع المنتجات.",
                    "2.4 لا تشكل الحالات التالية 'عيوب تصنيع': (أ) البلى العادي؛ (ب) الإصلاح غير المصرح به؛ (ج) سوء الاستخدام؛ (د) مخالفة تعليمات التشغيل؛ (هـ) استخدام ملحقات غير أصلية؛ (و) الاستثناءات المذكورة في سياسة الضمان.",
                    "2.5 يُرجى عدم استلام أي منتج تالف بوضوح. وإذا اكتشف التلف لاحقاً، يُرجى إبلاغنا خلال 24 ساعة للتقييم.",
                    "2.6 سوء الاستخدام أو التعديل من غير موظفينا يستبعد أي حق لك في الإصلاح أو الاستبدال أو استرداد القيمة.",
                    "2.7 لا نتحمل المسؤولية عن فقدان البيانات من المنتجات المُرجَعة للاستبدال أو الإصلاح."
                ]
            },
            
            {
                id: "3",
                title: "3. استرداد الأموال",
                content: [
                    "3.1 يمكنك إلغاء الطلب قبل تغليفه، وسوف نرد الأموال خلال (14) يوماً من طلب الإلغاء. موعد الاستلام الفعلي يعتمد على البنك الخاص بك.",
                    "3.2 للإرجاع بعد الاستلام، سنرد جميع المدفوعات (باستثناء مصاريف الشحن) خلال (14) يوماً من طلب الإرجاع، بشرط استلام المنتجات أو ما يثبت إرجاعها. نستخدم نفس طريقة الدفع الأصلية، ما عدا 'الدفع عند الاستلام' حيث يتم رد المبلغ عبر طريقة يتم التنسيق بشأنها بتنسيق رسمي مكتوب."
                ]
            }
        ]
    }
};

export default function ReturnPolicyPage() {
    const { lang } = useLang();
    const t = translations[lang];
    const isRtl = lang === 'ar';

    return (
        <main className={`min-h-screen bg-white py-20 px-6 font-sans ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="max-w-[1000px] mx-auto">
                
                {/* Header Section */}
                <div className="mb-12 border-b border-gray-100 pb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 leading-tight">
                        {t.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                        <span className="bg-gray-50 px-3 py-1 rounded-full">{t.lastUpdated}</span>
                        <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-4">
                            <RefreshCcw size={16} className="text-[#CF1322]" />
                            <span>Oman Consumer Rights</span>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 gap-12">
                    {t.sections.map((section) => (
                        <section key={section.id} className="relative group">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="mt-1">
                                    {section.id === "1" && <PackageCheck className="text-gray-400" size={24} />}
                                    {section.id === "2" && <AlertTriangle className="text-gray-400" size={24} />}
                                    {section.id === "3" && <HelpCircle className="text-gray-400" size={24} />}
                                    {section.id === "4" && <CreditCard className="text-gray-400" size={24} />}
                                </div>
                                <h2 className="text-xl font-bold text-black tracking-tight uppercase">
                                    {section.title}
                                </h2>
                            </div>
                            <div className="space-y-5 px-0 md:px-10">
                                {section.content.map((paragraph, index) => (
                                    <p key={index} className="text-gray-600 leading-relaxed text-base md:text-[17px] text-justify">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
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