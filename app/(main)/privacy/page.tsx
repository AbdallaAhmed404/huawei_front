"use client";
import React from 'react';
import { useLang } from '../context/LanguageContext'; 
import { ChevronRight, ChevronLeft, ShieldCheck, Truck, Globe, Mail, MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const translations = {
    en: {
        title: "Delivery Policy",
        lastUpdated: "Last Updated: May 2026",
        back: "Back to Home",
        print: "Print Version",
        officialStore: "Huawei Official Store Oman",
        securePlatform: "Reliable Delivery Service",
        sections: [
            {
                id: "1",
                title: "1. Delivery Coverage",
                content: [
                    "1.1 We currently provide delivery services exclusively within the Sultanate of Oman.",
                    "1.2 We strive to deliver your orders through our approved logistics partners to ensure speed and safety."
                ]
            },
            {
                id: "2",
                title: "2. Email Notifications",
                content: [
                    "2.1 We will send you updates via email to keep you informed about your delivery status.",
                    "2.2 Once your order leaves the warehouse, we will send an email containing the order number and a tracking link. You will also receive notifications on the delivery day based on the selected method and carrier. You may receive approximately two (2) notifications for each product in your order."
                ]
            },
            {
                id: "3",
                title: "3. Order Changes",
                content: [
                    "3.1 Once your order is prepared for dispatch or has been dispatched, we may be unable to change the delivery address. If the order is already with the carrier, you may contact them directly to request an address modification if possible.",
                    "3.2 If you do not receive a dispatch notification via email, please contact our customer service immediately."
                ]
            },
            {
                id: "4",
                title: "4. Order Tracking",
                content: [
                    "4.1 For deliveries handled by our carriers, you can track your order status at any time through the online order status tool.",
                    "4.2 In your account page, you can view the current status of the order, see ordered items, check estimated dispatch and delivery dates, and track the shipment."
                ]
            },
            {
                id: "5",
                title: "5. Delivery Information",
                content: [
                    "5.1 Products will be delivered to the address specified in your order. Please ensure the address and contact details are accurate. Incorrect instructions may lead to delays, and additional fees may apply for a second delivery attempt or result in non-delivery.",
                    "5.2 If your address is not available on the carrier's network, they will contact you to find the most suitable alternative address.",
                    "5.3 For corporate addresses, the carrier will deliver to a mailroom or designated delivery point and request a signature from the supervisor. Individual signatures are not required for specific order details.",
                    "5.4 For residential addresses with a reception or security service, the carrier will deliver to the guard/receptionist, provided they have a fixed location within the building."
                ]
            },
            {
                id: "6",
                title: "6. Undelivered or Damaged Orders",
                content: [
                    "6.1 Non-Delivery: (A) If no one is available at the time of delivery, a note will be left informing you if the package was left in a safe place (e.g., with neighbors) or if you need to contact the carrier to reschedule. (B) If the estimated delivery date has passed and you haven't received your package, please contact us. We will investigate with the carrier.",
                    "6.2 Damaged Orders: If an item is damaged upon receipt, you can refuse delivery. If damage is discovered after receipt, please contact us immediately. Huawei will coordinate with the delivery service to resolve the issue and provide a replacement as quickly as possible."
                ]
            }
        ]
    },
    ar: {
        title: "سياسة التوصيل",
        lastUpdated: "آخر تحديث: مايو 2026",
        back: "العودة للرئيسية",
        print: "طباعة نسخة",
        officialStore: "متجر هواوي الرسمي - عُمان",
        securePlatform: "خدمة توصيل موثوقة",
        sections: [
            {
                id: "1",
                title: "1. نطاق التوصيل",
                content: [
                    "1.1 نوفر حالياً خدمات التوصيل حصرياً داخل أراضي سلطنة عُمان.",
                    "1.2 نسعى لتوصيل طلباتكم من خلال شركائنا اللوجستيين المعتمدين لضمان السرعة والأمان."
                ]
            },
            {
                id: "2",
                title: "2. إشعارات البريد الإلكتروني",
                content: [
                    "2.1 سوف نرسل إليك التحديثات عبر البريد الإلكتروني، حتى تظل على علم بمستجدات التوصيل.",
                    "2.2 لدى مغادرة طلبك المستودع، سوف نرسل إليك رسالة بريد إلكتروني تحتوي على رقم الطلب ورابط لمعلومات التتبع. وسوف نرسل إليك كذلك إشعارات في يوم التوصيل بناءً على طريقة التوصيل المحددة والعنوان. ومن المحتمل أن تتلقى حوالي إشعارين (2) لكل منتج في طلبك."
                ]
            },
            {
                id: "3",
                title: "3. تغيير الطلب",
                content: [
                    "3.1 لدى إعداد طلبك للإرسال أو لدى إرساله، فإنه قد يتعذر علينا تغيير عنوان التوصيل. وإذا كان الطلب مع شركة التوصيل، يمكنك الاتصال بهم مباشرة وسوف يعدلون العنوان إن أمكن.",
                    "3.2 في حال عدم استلامك إشعار الإرسال عبر البريد الإلكتروني، فالرجاء التواصل معنا."
                ]
            },
            {
                id: "4",
                title: "4. تتبّع الطلب",
                content: [
                    "4.1 بخصوص عمليات التوصيل عبر شركة التوصيل، يمكنك تتبع حالة الطلب في أي وقت من خلال حالة الطلب عبر الإنترنت.",
                    "4.2 في صفحة الحساب، يمكنك عرض الحالة الحالية للطلب، وعرض العناصر المطلوبة، ومعرفة مواعيد الإرسال والتوصيل المقدرة، وتتبع التوصيل."
                ]
            },
            {
                id: "5",
                title: "5. معلومات التوصيل",
                content: [
                    "5.1 سوف يتم توصيل المنتجات إلى عنوان التوصيل الذي حددته. يُرجى الحرص على كتابة العنوان وبيانات الاتصال بشكل صحيح، حيث يؤدي عدم صحة التعليمات إلى تأخر الشحنة وقد نضطر لفرض رسوم لمحاولة التوصيل الثانية.",
                    "5.2 في حال عدم توفر عنوان التوصيل على شبكة شركة التوصيل، فسوف تتصل بك الشركة للحصول على العنوان الأنسب.",
                    "5.3 في حالة التوصيل لعنوان شركة، ستسلم شركة التوصيل الطلب إلى غرفة بريد أو نقطة توصيل وتطلب توقيعاً من المشرف، ولا تتطلب شركة التوصيل توقيعاً مخصصاً لتفاصيل الطلب.",
                    "5.4 في حال تقديم عنوان منزل يضم خدمة استقبال أو حراسة، ستسلم الشركة الطلب للحارس ما دام له موقع ثابت في قسم الاستقبال."
                ]
            },
            {
                id: "6",
                title: "6. استفسارات بخصوص الطلبات غير المسلمة أو التالفة",
                content: [
                    "6.1 عدم التوصيل: (أ) في حال عدم وجود أحد وقت التوصيل، تترك ملاحظة لإخطارك بما إذا كان طلبك قد تُرِك في مكان آمن أو إذا كان عليك الاتصال لترتيب موعد جديد. (ب) في حال تجاوز تاريخ التوصيل المقدر ولم تستلم الطرد، فالرجاء التواصل معنا للتحقيق مع شركة التوصيل.",
                    "6.2 الطلبات التالفة: إذا كان العنصر تالفًا عند استلامه، يمكنك رفض الاستلام. وإذا اكتشفت التلف بعد الاستلام، فالرجاء التواصل معنا مباشرة. ستتصل هواوي بخدمة التوصيل لحل المشكلة وتزويدك بالبديل في أسرع وقت."
                ]
            }
        ]
    }
};

export default function DeliveryPolicyPage() {
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
                            <Truck size={16} className="text-[#CF1322]" />
                            <span>Oman Shipping Services</span>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 gap-12">
                    {t.sections.map((section) => (
                        <section key={section.id} className="relative">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="mt-1">
                                    {section.id === "2" && <Mail className="text-gray-400" size={20} />}
                                    {section.id === "5" && <MapPin className="text-gray-400" size={20} />}
                                    {section.id === "6" && <AlertCircle className="text-gray-400" size={20} />}
                                </div>
                                <h2 className="text-xl font-bold text-black uppercase tracking-tight">
                                    {section.title}
                                </h2>
                            </div>
                            <div className="space-y-5 px-0 md:px-9">
                                {section.content.map((paragraph, index) => (
                                    <p key={index} className="text-gray-600 leading-relaxed text-base md:text-[17px] text-justify">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Trust Footer */}
                
            </div>

             <style jsx global>{`
                .rtl { font-family: 'Tajawal', sans-serif; }
                .ltr { font-family: 'Inter', sans-serif; }
                p { text-align: justify; }
            `}</style>
        </main>
    );
}