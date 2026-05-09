"use client";
import React from 'react';
import { useLang } from '../context/LanguageContext'; 
import { ChevronRight, ChevronLeft, ShieldCheck, FileText, Globe } from 'lucide-react';
import Link from 'next/link';

const translations = {
    en: {
        title: "Terms and Conditions of Sale",
        lastUpdated: "Last Updated: May 2026",
        back: "Back to Home",
        print: "Print Version",
        officialStore: "Huawei Official Store Oman",
        securePlatform: "Secure & Licensed Platform",
        sections: [
            {
                id: "1",
                title: "1. Applicability",
                content: [
                    "1.1 These Terms of Sale apply to all offers, contracts, and deliveries available from Huawei on the Platform (huaweioman.com).",
                    "1.2 These Terms of Sale are binding and applicable to every person who accesses or uses the Platform ('you').",
                    "1.3 By using the Platform, you acknowledge your agreement to these Terms of Sale. If you do not agree, you must immediately stop using the Platform.",
                    "1.4 We may update these Terms of Sale from time to time. Your continued use represents your acceptance of the updated terms.",
                    "1.5 You must be at least 18 years old and possess full legal capacity to use this Platform in the Sultanate of Oman."
                ]
            },
            {
                id: "2",
                title: "2. Your Contract with Us",
                content: [
                    "2.1 Each order is a binding offer by you to purchase the goods specified in the order ('Product').",
                    "2.2 Contracts will be concluded only through this Platform and upon your acceptance of the Terms of Sale.",
                    "2.3 Order Stages: (A) After placing an order, you will receive an 'Order Confirmation' email (receipt notification only). (B) The contract is formed only when we send the 'Acceptance' email with shipping details.",
                    "2.4 Your contract with us will be concluded in English or Arabic."
                ]
            },
            {
                id: "3",
                title: "3. Prices and Payment",
                content: [
                    "3.1 Payment must be made before receipt via Credit/Debit cards, or via Cash on Delivery (COD) for selected products.",
                    "3.2 All prices include Value Added Tax (VAT) applicable in the Sultanate of Oman (currently 5%) and any government fees.",
                    "3.3 In case of obvious pricing errors (technical glitches), Huawei reserves the right to cancel the contract before shipment.",
                    "3.4 Delivery charges may be added and will be shown before completing the purchase."
                ]
            },
            {
                id: "4",
                title: "4. Delivery",
                content: [
                    "4.1 We only support delivery within the Sultanate of Oman. Cross-border delivery is not supported.",
                    "4.2 Responsibility for loss or damage passes to you upon delivery to the specified address.",
                    "4.3 If delivery is delayed beyond the specified period, you have the right to cancel and receive a refund."
                ]
            },
            {
                id: "5",
                title: "5. Right of Withdrawal & Returns",
                content: [
                    "5.1 Consumers have the right to withdraw within seven (7) days of receipt, provided the product is in its original unopened packaging.",
                    "5.2 Exclusions: (A) Custom-made products. (B) Unsealed or downloaded software. (C) Used products or hygiene-sensitive items (e.g., opened earbuds)."
                ]
            },
            {
                id: "6",
                title: "6. Warranty and Consumer Rights",
                content: [
                    "6.1 Huawei is committed to providing products that conform to the contract.",
                    "6.2 Products are subject to the official Huawei Warranty Policy applicable in Oman.",
                    "6.3 In case of manufacturing defects, you may replace the product within 14 days or have it repaired under warranty terms."
                ]
            },
            {
                id: "7",
                title: "7. Liability and Force Majeure",
                content: [
                    "7.1 Huawei is not liable for delays caused by Force Majeure (natural disasters, network failures, or pandemics).",
                    "7.2 Huawei’s total liability shall not exceed 100% of the value of the disputed contract."
                ]
            },
            {
                id: "8",
                title: "8. Governing Law",
                content: [
                    "8.1 These terms are governed by the laws of the Sultanate of Oman.",
                    "8.2 The Courts of Oman shall have exclusive jurisdiction over any disputes arising from this contract."
                ]
            },
            {
                id: "9",
                title: "9. For End-Users Only",
                content: [
                    "This platform is for end-users only. Reselling products is strictly prohibited. We reserve the right to cancel orders suspected of being for commercial resale purposes."
                ]
            }
        ]
    },
    ar: {
        title: "بنود وشروط البيع",
        lastUpdated: "آخر تحديث: مايو 2026",
        back: "العودة للرئيسية",
        print: "طباعة نسخة",
        officialStore: "متجر هواوي الرسمي - عُمان",
        securePlatform: "منصة آمنة ومعتمدة",
        sections: [
            {
                id: "1",
                title: "1. قابلية التطبيق",
                content: [
                    "1.1 تنطبق بنود المبيعات هذه على جميع العروض والعقود والتسليمات المتاحة من هواوي على المنصة (huaweioman.com).",
                    "1.2 وتكون بنود المبيعات هذه ملزمة وسارية على كل شخص يدخل إلى المنصة أو يستخدمها ('أنت').",
                    "1.3 باستخدام المنصة، فإنك تقر بموافقتك على بنود المبيعات هذه. وفي حال عدم موافقتك، فيجب عليك عدم استخدام المنصة.",
                    "1.4 يجوز لنا تحديث بنود المبيعات من حين لآخر، ويعد استخدامك المستمر دليلاً على موافقتك على التحديثات.",
                    "1.5 باستخدام المنصة، فإنك تقر بأنك تبلغ من العمر 18 سنة أو أكثر، وأنك تتمتع بالأهلية القانونية الكاملة لإبرام هذا العقد في سلطنة عُمان."
                ]
            },
            {
                id: "2",
                title: "2. عقدك معنا",
                content: [
                    "2.1 يعتبر كل طلب هو عرض ملزم من قبلك لشراء البضائع المحددة في الطلب ('المنتج').",
                    "2.2 سيتم إبرام العقود فقط من خلال هذه المنصة وعند قبولك لشروط البيع.",
                    "2.3 مراحل الطلب: (أ) بعد التقديم ستتلقى 'تأكيد الطلب' (إشعار استلام). (ب) ينعقد العقد عند إرسال رسالة 'القبول' التي تتضمن تفاصيل الشحن.",
                    "2.4 تبرم العقود باللغتين العربية والإنجليزية."
                ]
            },
            {
                id: "3",
                title: "3. الأسعار والدفع",
                content: [
                    "3.1 يجب الدفع قبل الاستلام عبر البطاقة الائتمانية/المدين، أو الدفع عند الاستلام (COD) لمنتجات مختارة.",
                    "3.2 أسعار مبيعاتنا مدرجة على المنصة وتشمل جميع الضرائب بما في ذلك ضريبة القيمة المضافة في سلطنة عُمان (5%).",
                    "3.3 لهواوي الحق في إلغاء العقد قبل الشحن والتسليم في حال وجود خطأ مادي واضح في التسعير نتيجة خطأ تقني."
                ]
            },
            {
                id: "4",
                title: "4. التوصيل",
                content: [
                    "4.1 يتم التوصيل فقط داخل أراضي سلطنة عُمان. نحن لا ندعم الشحن عبر الحدود.",
                    "4.2 تنتقل مسؤولية ضياع المنتجات أو تلفها إليك بعد توصيل المنتجات إلى العنوان المحدد.",
                    "4.3 في حال تأخر التوصيل عن المدة المحددة، يحق لك إلغاء العقد واسترداد المبالغ المدفوعة."
                ]
            },
            {
                id: "5",
                title: "5. حق الانسحاب والإرجاع",
                content: [
                    "5.1 للمستهلك الحق في الانسحاب من العقد خلال سبعة (7) أيام من الاستلام بشرط أن يكون المنتج في تغليفه الأصلي المغلق.",
                    "5.2 الاستثناءات: (أ) المنتجات المصنعة بمواصفات خاصة. (ب) البرمجيات المفتوحة. (ج) المنتجات المستخدمة أو الحساسة صحياً (مثل السماعات المفتوحة)."
                ]
            },
            {
                id: "6",
                title: "6. الضمان وحقوق المستهلك",
                content: [
                    "6.1 تلتزم هواوي بتوفير منتجات مطابقة للعقد.",
                    "6.2 تخضع المنتجات لسياسة ضمان هواوي الرسمية المعمول بها في عُمان.",
                    "6.3 يحق لك استبدال المنتج خلال 14 يوماً في حال وجود عيب مصنعي أو إصلاحه وفقاً لشروط الضمان."
                ]
            },
            {
                id: "7",
                title: "7. المسؤولية والقوة القاهرة",
                content: [
                    "7.1 لا تتحمل هواوي مسؤولية أي تأخير ناتج عن قوة قاهرة (كوارث طبيعية، تعطل شبكات الاتصالات، أو أوبئة).",
                    "7.2 لا تتجاوز مسؤولية هواوي الإجمالية تجاه أي مطالبة 100% من قيمة العقد محل النزاع."
                ]
            },
            {
                id: "8",
                title: "8. القانون الحاكم وحل النزاعات",
                content: [
                    "8.1 تخضع هذه البنود وتفسر وفقاً لقوانين سلطنة عُمان.",
                    "8.2 يكون لمحاكم سلطنة عُمان الاختصاص القضائي الحصري للنظر في أي نزاع ينشأ عن هذا العقد."
                ]
            },
            {
                id: "9",
                title: "9. للمستخدمين النهائيين فقط",
                content: [
                    "هذه المنصة مخصصة للبيع للمستخدمين النهائيين فقط. يُحظر تماماً شراء المنتجات بغرض إعادة البيع التجاري. يحق للمنصة إلغاء أي طلبات يشتبه في أنها لأغراض تجارية أو إعادة بيع."
                ]
            }
        ]
    }
};

export default function TermsPage() {
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
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="bg-gray-50 px-3 py-1 rounded-full">{t.lastUpdated}</span>
                        <div className="flex items-center gap-1">
                            <Globe size={14} />
                            <span>Oman / English & Arabic</span>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-12">
                    {t.sections.map((section) => (
                        <section key={section.id} className="group">
                            <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                                {section.title}
                            </h2>
                            <div className="space-y-4">
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