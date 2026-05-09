"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../../../app/(main)/context/AuthContext'; // تأكد من المسار الصحيح للـ AuthContext
import { CheckCircle2, ShieldCheck, Info, Loader2 } from 'lucide-react';
import Image from "next/image";
import { useLang } from '../context/LanguageContext';

const translations = {
    en: {
        shippingAddress: "Shipping Address",
        firstName: "First Name*",
        lastName: "Last Name*",
        email: "Email Address*",
        phone: "Phone Number*",
        selectCity: "Select City",
        detailedAddress: "Detailed Address (Street, District, Building...)*",
        continue: "Continue",
        addressSaved: "Address Saved",
        paymentMethod: "Payment Method",
        cardPayment: "Credit / Debit Card",
        securePayment: "Secure payment via checkout gateway",
        pay: "Pay",
        orderSummary: "Order Summary",
        couponApplied: "Coupon {code} Applied",
        savedExtra: "You saved extra",
        subtotal: "Subtotal",
        totalSavings: "Total Savings",
        shipping: "Shipping",
        free: "Free",
        total: "Total",
        includingVat: "Including VAT",
        itemsInCart: "Items in your cart",
        qty: "Qty"
    },
    ar: {
        shippingAddress: "عنوان الشحن",
        firstName: "الاسم الأول*",
        lastName: "اسم العائلة*",
        email: "البريد الإلكتروني*",
        phone: "رقم الهاتف*",
        selectCity: "اختر المدينة",
        detailedAddress: "العنوان بالتفصيل (الشارع، الحي، المبنى...)*",
        continue: "متابعة",
        addressSaved: "تم حفظ العنوان",
        paymentMethod: "طريقة الدفع",
        cardPayment: "بطاقة ائتمان / خصم مباشر",
        securePayment: "دفع آمن عبر بوابة الدفع",
        pay: "دفع",
        orderSummary: "ملخص الطلب",
        couponApplied: "تم تطبيق الكوبون {code}",
        savedExtra: "لقد وفرت مبلع إضافي",
        subtotal: "المجموع الفرعي",
        totalSavings: "إجمالي الوفورات",
        shipping: "الشحن",
        free: "مجاني",
        total: "الإجمالي",
        includingVat: "شامل ضريبة القيمة المضافة",
        itemsInCart: "المنتجات في سلتك",
        qty: "الكمية"
    }
};

const OMAN_CITIES = [
    "Muscat (مسقط)", "Seeb (السيب)", "Salalah (صلالة)", "Bawshar (بوشر)",
    "Sohar (صحار)", "Suwayq (السويق)", "Ibri (عبري)", "Saham (صحم)",
    "Barka (بركاء)", "Rustaq (الرستاق)", "Nizwa (نزوى)", "Buraimi (البريمي)",
    "Sur (صور)", "Bahla (بهلاء)", "Khaburah (الخابورة)", "Shinas (شناص)",
    "Sama'il (سمائل)", "Amrat (العامرات)", "Liwa (لوى)", "Ibra (إبراء)",
    "Bidbid (بدبد)", "Al Kamil Wal Wafi (الكامل والوافي)", "Badiyah (بدية)"
];

export default function CheckoutPage() {
    const { lang } = useLang();
    const t = translations[lang];
    const { cart, appliedCoupon } = useCart();
    const { isAuthenticated, user} = useAuth(); // سحب حالة التسجيل
    const [loading, setLoading] = useState(false);
    const [orderSaved, setOrderSaved] = useState(false);

    // State لبيانات العميل متوافقة مع الموديل الجديد
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: 'Select City',
        district: ''
    });

    // جلب بيانات المستخدم المسجل تلقائياً
    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated) {
                try {
                    const token = localStorage.getItem('token'); // أو حسب طريقة تخزين التوكن عندك
                    const response = await fetch('https://api.huaweioman.com/user/profile', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();

                    if (response.ok && data) {
                        setFormData({
                            firstName: data.firstName || '',
                            lastName: data.lastName || '',
                            email: data.email || '',
                            phone: data.phone || '',
                            city: data.city || 'Select City',
                            district: data.district || ''
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [isAuthenticated]);

    // الحسابات
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const productSavings = cart.reduce((acc, item) => acc + (item.discount * item.quantity), 0);
    const afterProductDiscount = subtotal - productSavings;

    let couponDiscountAmount = 0;
    if (appliedCoupon) {
        couponDiscountAmount = appliedCoupon.type === 'percentage'
            ? (afterProductDiscount * appliedCoupon.value) / 100
            : appliedCoupon.value;
    }

    const finalTotal = afterProductDiscount - couponDiscountAmount;

    // دالة حفظ الطلب
    // const handleContinue = async () => {
    //     if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const orderPayload = {
    //             userData: formData,
    //             items: cart.map(item => ({
    //                 name: item.name,
    //                 photo: item.image,
    //                 price: item.price - item.discount,
    //                 quantity: item.quantity
    //             })),
    //             total: finalTotal
    //         };

    //         const response = await fetch('https://api.huaweioman.com/user/Order', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(orderPayload)
    //         });

    //         if (response.ok) {
    //             setOrderSaved(true);
    //         }
    //     } catch (error) {
    //         console.error("Error saving order:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handlePaymobPayment = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await fetch('https://api.huaweioman.com/user/paymob', { // رابط الـ API بتاعك
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 amount_cents: Math.round(finalTotal * 1000), // تحويل الريال لبيسة
    //                 customer_data: {
    //                     first_name: formData.firstName,
    //                     last_name: formData.lastName,
    //                     email: formData.email,
    //                     phone: formData.phone
    //                 }
    //             })
    //         });

    //         const data = await response.json();
    //         if (data.url) {
    //             window.location.href = data.url; // إعادة توجيه العميل لصفحة Paymob
    //         }
    //     } catch (error) {
    //         console.error("Payment Error:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    // دالة موحدة لحفظ الطلب ثم الانتقال للدفع
    const handleOrderAndPayment = async () => {
        // التأكد من ملء البيانات الأساسية
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
            alert(lang === 'ar' ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            // 1. تجهيز بيانات الطلب حسب الموديل الجديد
            const orderPayload = {
                user: isAuthenticated ? user?._id : null,
                userData: formData,
                items: cart.map(item => ({
                    productId: item._id, // ربط المنتج بـ ID
                    name: item.name,
                    photo: item.image,
                    price: item.price - item.discount,
                    quantity: item.quantity,
                    colorCode: item.colorCode || ""
                })),
                total: finalTotal,
                appliedCouponCode: appliedCoupon ? appliedCoupon.code : null,
                isGuest: !isAuthenticated
            };

            // 2. حفظ الطلب في قاعدة البيانات (MongoDB)
            const orderResponse = await fetch('https://api.huaweioman.com/user/Order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            const orderResult = await orderResponse.json();

            if (orderResponse.ok && orderResult._id) {
                // 3. مناداة API الدفع باستخدام الـ ID الناتج من الخطوة السابقة
                const paymentResponse = await fetch('https://api.huaweioman.com/user/paymob', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount_cents: Math.round(finalTotal * 1000), // تحويل المبلغ لبيسة
                        orderId: orderResult._id, // إرسال الـ ID لربط العملية بالويب هوك
                        customer_data: {
                            first_name: formData.firstName,
                            last_name: formData.lastName,
                            email: formData.email,
                            phone: formData.phone
                        }
                    })
                });

                const paymentData = await paymentResponse.json();
                if (paymentData.url) {
                    // الانتقال لصفحة Paymob
                    window.location.href = paymentData.url;
                }
            } else {
                throw new Error("Failed to save order");
            }
        } catch (error) {
            console.error("Process Error:", error);
            alert(lang === 'ar' ? "حدث خطأ أثناء معالجة الطلب" : "An error occurred while processing the order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-white min-h-screen py-23 px-4 md:px-10 font-sans">
            <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-8">

                {/* اليسار: بيانات العميل والدفع */}
                <div className="flex-1 space-y-6">
                    <section className="bg-white rounded-[15px] p-8 shadow-sm">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                            {t.shippingAddress}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border-b pb-2">
                                <input
                                    type="text"
                                    placeholder={t.firstName}
                                    className="w-full outline-none"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="border-b pb-2">
                                <input
                                    type="text"
                                    placeholder={t.lastName}
                                    className="w-full outline-none"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                            <div className="border-b pb-2">
                                <input
                                    type="email"
                                    placeholder={t.email}
                                    className="w-full outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="border-b pb-2">
                                <input
                                    type="text"
                                    placeholder={t.phone}
                                    className="w-full outline-none"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="border-b pb-2">
                                <select
                                    className="w-full outline-none bg-transparent cursor-pointer"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                >
                                    <option value="Select City" disabled>{t.selectCity}</option>
                                    {OMAN_CITIES.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2 border-b pb-2">
                                <input
                                    type="text"
                                    placeholder={t.detailedAddress}
                                    className="w-full outline-none"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleOrderAndPayment}
                            disabled={loading}
                            className="w-full mt-8 bg-[#CF1322] text-white py-5 rounded-[15px] font-bold text-lg flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg disabled:bg-gray-400"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <ShieldCheck size={22} />
                                    <span>
                                        {lang === 'ar' ? `الاستمرار للدفع` : `Continue to Payment`}
                                    </span>
                                </>
                            )}
                        </button>
                    </section>


                </div>

                {/* اليمين: ملخص الطلب والمنتجات */}
                <div className="w-full lg:w-[420px]">
                    <div className="bg-white rounded-[15px] p-8 sticky top-24 shadow-sm border border-gray-50">
                        <h2 className="text-xl font-bold mb-6">{t.orderSummary}</h2>

                        {appliedCoupon && (
                            <div className="bg-green-50 p-4 rounded-[15px] mb-6 border border-green-100 flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-green-600" />
                                <div>
                                    <p className="text-xs font-bold text-green-700 uppercase">{t.couponApplied.replace('{code}', appliedCoupon.code)}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <p className="text-[10px] text-green-600 font-medium">You saved extra</p>
                                        <div className="flex items-center gap-0.5">
                                            <div className="relative w-3 h-3 flex-shrink-0">
                                                <Image
                                                    src="/oman-riyal.svg"
                                                    alt="OMR"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <p className="text-[10px] text-green-600 font-bold">
                                                {couponDiscountAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 text-sm pb-6 border-b">
                            <div className="flex justify-between items-center text-gray-500">
                                <span>{t.subtotal}</span>
                                <div className="flex items-center gap-1">
                                    <div className="relative w-4 h-4 flex-shrink-0">
                                        <Image src="/oman-riyal.svg" alt="OMR" fill className="object-contain" />
                                    </div>
                                    <span>{subtotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center font-bold text-[#CF1322]">
                                <span>{t.totalSavings}</span>
                                <div className="flex items-center gap-1">
                                    <div className="relative w-4 h-4 flex-shrink-0">
                                        <Image src="/oman-riyal.svg" alt="OMR" fill className="object-contain" />
                                    </div>
                                    <span>-</span>
                                    <span>{(productSavings + couponDiscountAmount).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-gray-500">
                                <span>{t.shipping}</span>
                                <span className="text-green-600 font-bold uppercase">{t.free}</span>
                            </div>

                            <div className="pt-4 flex justify-between items-start">
                                <span className="font-bold text-lg mt-1">{t.total}</span>
                                <div className="text-right flex flex-col items-end">
                                    <div className="flex items-center gap-1.5">
                                        <div className="relative w-6 h-6 flex-shrink-0">
                                            <Image src="/oman-riyal.svg" alt="OMR" fill className="object-contain" />
                                        </div>
                                        <p className="text-2xl font-black text-black">
                                            {finalTotal.toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic mt-1">{t.includingVat}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            <p className="text-xs font-bold text-gray-400 uppercase">{t.itemsInCart} ({cart.length})</p>
                            {cart.map((item) => (
                                <div key={`${item._id}-${item.colorCode}`} className="flex gap-4 items-center">
                                    <div className="w-14 h-14 bg-gray-50 rounded-[15px] p-2 border flex-shrink-0">
                                        <img src={item.image} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[11px] font-bold truncate">{item.name}</h4>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-[10px] text-gray-500">{t.qty} {item.quantity}</span>
                                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                <div className="relative w-3.5 h-3.5 flex-shrink-0">
                                                    <Image
                                                        src="/oman-riyal.svg"
                                                        alt="OMR"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <span className="text-[11px] font-bold text-black">
                                                    {(item.price - item.discount).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}