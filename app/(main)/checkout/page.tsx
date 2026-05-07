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
    const { isAuthenticated } = useAuth(); // سحب حالة التسجيل
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
    const handleContinue = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
            return;
        }

        setLoading(true);
        try {
            const orderPayload = {
                userData: formData,
                items: cart.map(item => ({
                    name: item.name,
                    photo: item.image,
                    price: item.price - item.discount,
                    quantity: item.quantity
                })),
                total: finalTotal
            };

            const response = await fetch('https://api.huaweioman.com/user/Order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            if (response.ok) {
                setOrderSaved(true);
            }
        } catch (error) {
            console.error("Error saving order:", error);
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
                            onClick={handleContinue}
                            disabled={loading || orderSaved}
                            className="mt-8 bg-black text-white px-10 py-3 rounded-[15px] font-bold flex items-center gap-2 hover:bg-gray-800 transition-all disabled:bg-gray-400"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                            {orderSaved ? t.addressSaved : t.continue}
                        </button>
                    </section>

                    <section className="bg-white rounded-[15px] p-8 shadow-sm">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                            Payment Method
                        </h2>
                        <div className={`bg-gray-50 border-2 rounded-[15px] p-6 flex justify-between items-center transition-all ${orderSaved ? 'border-black opacity-100' : 'border-gray-200 opacity-50'}`}>
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="text-green-600" />
                                <div>
                                    <p className="font-bold text-sm">Credit / Debit Card</p>
                                    <p className="text-xs text-gray-500">Secure payment via checkout gateway</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <img src="/visa-logo.png" className="h-4" alt="visa" />
                                <img src="/master-logo.png" className="h-4" alt="mastercard" />
                            </div>
                        </div>
                    </section>

                    <button
                        disabled={!orderSaved}
                        className={`w-full py-5 rounded-[15px] font-bold text-lg transition-all ${orderSaved ? 'bg-[#CF1322] text-white hover:bg-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        Pay OMR {finalTotal.toLocaleString()}
                    </button>
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