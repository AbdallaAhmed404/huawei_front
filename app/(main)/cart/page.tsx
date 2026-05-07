"use client";
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, Ticket, ShoppingBag, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useLang } from '../context/LanguageContext';


const translations = {
    en: {
        cartTitle: "Cart",
        emptyCart: "Your cart is empty",
        continueShopping: "Continue Shopping",
        orderSummary: "Order Summary",
        subtotal: "Subtotal",
        savings: "Savings",
        couponDiscount: "Coupon Discount",
        total: "Total",
        vatInclude: "Including VAT",
        checkout: "Check out",
        applyCoupon: "Apply Coupon",
        couponCode: "Coupon Code",
        apply: "Apply",
        remove: "Remove",
        enterCoupon: "Enter your coupon code",
        invalidCoupon: "Invalid or expired coupon",
        omr: "OMR"
    },
    ar: {
        cartTitle: "السلة",
        emptyCart: "سلة التسوق فارغة",
        continueShopping: "مواصلة التسوق",
        orderSummary: "ملخص الطلب",
        subtotal: "المجموع الفرعي",
        savings: "المدخرات",
        couponDiscount: "خصم الكوبون",
        total: "الإجمالي",
        vatInclude: "شامل ضريبة القيمة المضافة",
        checkout: "إتمام الشراء",
        applyCoupon: "تطبيق الكوبون",
        couponCode: "رمز الكوبون",
        apply: "تطبيق",
        remove: "إزالة",
        enterCoupon: "أدخل رمز الكوبون الخاص بك",
        invalidCoupon: "الكوبون غير صالح أو منتهي الصلاحية",
        omr: "ر.ع."
    }
};

export default function CartPage() {

    const { lang } = useLang();
    const t = translations[lang];

    const { cart, removeFromCart, updateQuantity, appliedCoupon, setAppliedCoupon } = useCart();

    // حالات الكوبون والـ Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const handleProceedToCheckout = (e: React.MouseEvent) => {
        e.preventDefault(); // منع السلوك الافتراضي للـ Link مؤقتاً

        if (isAuthenticated) {
            router.push('/checkout');
        } else {
            router.push('/checkout-method');
        }
    };
    // 1. حساب الإجماليات الأساسية (قبل كوبون الخصم الإضافي)
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const productSavings = cart.reduce((acc, item) => acc + (item.discount * item.quantity), 0);
    const currentTotal = subtotal - productSavings;

    // 2. حساب خصم الكوبون (المطور ليدعم النوعين)
    let couponDiscountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.couponType === 'product-specific') {
            // البحث عن المنتج المستهدف في السلة
            const targetItem = cart.find(item => item._id === appliedCoupon.applicableProduct);
            if (targetItem) {
                const targetItemTotal = (targetItem.price - targetItem.discount) * targetItem.quantity;
                if (appliedCoupon.type === 'percentage') {
                    couponDiscountAmount = (targetItemTotal * appliedCoupon.value) / 100;
                } else {
                    // الخصم الثابت يتم تطبيقه مرة واحدة أو لكل قطعة حسب سياسة العمل (هنا طبقناه على إجمالي المنتج المستهدف)
                    couponDiscountAmount = Math.min(appliedCoupon.value, targetItemTotal);
                }
            }
        } else {
            // تطبيق الخصم العالمي (Global) على إجمالي السلة
            if (appliedCoupon.type === 'percentage') {
                couponDiscountAmount = (currentTotal * appliedCoupon.value) / 100;
            } else {
                couponDiscountAmount = appliedCoupon.value;
            }
        }
    }

    const finalTotal = currentTotal - couponDiscountAmount;

    // دالة التحقق من الكوبون مع الباك اند (معدلة لإرسال محتويات السلة)
    const handleApplyCoupon = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`https://api.huaweioman.com/admin/validate-coupon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponInput,
                    cartItems: cart.map(item => ({ productId: item._id })) // إرسال الـ IDs للتحقق
                })
            });
            const data = await response.json();

            if (response.ok) {
                setAppliedCoupon({
                    code: data.code,
                    value: data.discountValue,
                    type: data.discountType,
                    couponType: data.couponType, // تخزين النوع (global أو specific)
                    applicableProduct: data.applicableProduct // تخزين الـ ID للمنتج المخصص
                });
                setIsModalOpen(false);
                setCouponInput("");
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Connection error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] px-6 ">
                <div className="bg-white p-12 rounded-[15px] shadow-sm flex flex-col items-center text-center w-full md:w-[500px] lg:w-[500px]">
                    <ShoppingBag size={80} className="text-gray-200 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.emptyCart}</h2>
                    <Link href="/" className="bg-[#CF1322] text-white px-10 py-3 rounded-[15px] font-bold hover:bg-[#b0101d] transition-all">
                        {t.continueShopping}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="bg-white min-h-screen py-20 px-6 font-sans">
            {/* Modal الكوبون */}
            {isModalOpen && (
                <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-[15px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-black">{t.applyCoupon}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                                placeholder="Enter coupon code (e.g. SAVE20)"
                                className="w-full border-2 border-gray-100 rounded-[15px] px-6 py-4 outline-none focus:border-[#CF1322] transition-all uppercase font-bold"
                            />
                            {error && <p className="text-[#CF1322] text-sm font-medium px-2">{error}</p>}
                            <button
                                onClick={handleApplyCoupon}
                                disabled={loading || !couponInput}
                                className="w-full bg-black text-white py-4 rounded-[15px] font-bold hover:bg-gray-800 transition-all disabled:bg-gray-200"
                            >
                                {loading ? "Checking..." : "Apply Coupon"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-6">
                    <h1 className="text-xl font-bold text-black px-4">{t.cartTitle} ({cart.length})</h1>
                    {cart.map((item) => (
                        <div key={`${item._id}-${item.colorCode}`} className="bg-white rounded-[15px] p-8 shadow-sm border border-gray-50">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-40 h-40 bg-[#F9F9F9] rounded-[15px] flex items-center justify-center p-4">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-black leading-tight">{item.name}</h3>
                                            <p className="text-xs text-gray-500 mt-2">{item.modelName}</p>
                                            <div
                                                className="w-3.5 h-3.5 rounded-[15px] border border-black/10 shadow-sm mt-2"
                                                style={{ backgroundColor: item.colorCode }}
                                                title={item.colorCode}
                                            > </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end min-w-0">
                                            {/* السعر الحالي بعد الخصم مع اللوجو */}
                                            <div className="flex items-center gap-1.5 whitespace-nowrap justify-end">
                                                <div className="relative w-5 h-5 flex-shrink-0">
                                                    <Image
                                                        src="/oman-riyal.svg"
                                                        alt="OMR"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <p className="text-lg font-bold text-black truncate">
                                                    {(item.price - item.discount).toLocaleString()}
                                                </p>
                                            </div>

                                            {/* السعر الأصلي قبل الخصم (المشطوب) مع اللوجو */}
                                            {item.discount > 0 && (
                                                <div className="flex items-center gap-1 mt-0.5 whitespace-nowrap justify-end opacity-60">
                                                    <div className="relative w-3.5 h-3.5 flex-shrink-0">
                                                        <Image
                                                            src="/oman-riyal.svg"
                                                            alt="OMR"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-400 line-through truncate">
                                                        {item.price.toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-10">
                                        <button onClick={() => removeFromCart(item._id, item.colorCode)} className="text-gray-400 hover:text-red-600 flex items-center gap-2 text-sm font-medium">
                                            <Trash2 size={18} /> {t.remove}
                                        </button>
                                        <div className="flex items-center border border-gray-200 rounded-[15px] overflow-hidden bg-white">
                                            <button onClick={() => updateQuantity(item._id, -1, item.colorCode)} className="px-4 py-2 hover:bg-gray-50 text-gray-500"><Minus size={14} /></button>
                                            <span className="px-4 py-2 font-bold text-sm min-w-[40px] text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, 1, item.colorCode)} className="px-4 py-2 hover:bg-gray-50 text-gray-500"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Section */}
                <div className="w-full lg:w-[420px]">
                    <div className="bg-white rounded-[15px] p-10 sticky top-24 shadow-sm border border-gray-50">
                        <h2 className="text-2xl font-bold text-black mb-8">{t.orderSummary}</h2>

                        {/* جزء الكوبون الديناميكي */}
                        {!appliedCoupon ? (
                            <div
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#FAFAFA] p-5 rounded-[15px] mb-8 flex justify-between items-center cursor-pointer group hover:bg-gray-100 transition-all border border-dashed border-gray-200"
                            >
                                <div className="flex items-center gap-4">
                                    <Ticket size={20} className="text-[#CF1322]" />
                                    <span className="text-sm font-bold text-gray-700">Use a coupon</span>
                                </div>
                                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">›</span>
                            </div>
                        ) : (
                            <div className="bg-green-50 p-5 rounded-[15px] mb-8 border border-green-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-green-600" />
                                    <div>
                                        <p className="text-xs text-green-700 font-bold uppercase">{appliedCoupon.code} Applied</p>
                                        <p className="text-[10px] text-green-600">
                                            {appliedCoupon.couponType === 'product-specific' ? 'Item savings applied' : 'Extra savings applied'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setAppliedCoupon(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}

                        <div className="space-y-4 mb-8">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{t.subtotal}</span>
                                <div className="flex items-center gap-1">
                                    <div className="relative w-4 h-4 flex-shrink-0">
                                        <Image src="/oman-riyal.svg" alt="OMR" fill className="object-contain" />
                                    </div>
                                    <span className="font-medium">{subtotal.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Total Savings */}
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold">{t.savings}</span>
                                <div className="flex items-center gap-1 text-[#CF1322] font-bold">

                                    <div className="relative w-4 h-4 flex-shrink-0">
                                        <Image src="/oman-riyal.svg" alt="OMR" fill className="object-contain" />
                                    </div>
                                    <span>-</span>
                                    <span>{(productSavings + couponDiscountAmount).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Coupon Discount */}
                            {appliedCoupon && (
                                <div className="flex justify-between items-center text-[13px] bg-gray-50 p-3 rounded-[15px]">
                                    <span className="text-gray-600 italic">Coupon ({appliedCoupon.code})</span>
                                    <div className="flex items-center gap-1 text-green-600 font-bold">
                                        <div className="relative w-3.5 h-3.5 flex-shrink-0">
                                            <Image src="/oman-riyal.svg" alt="OMR" fill className="object-contain" />
                                        </div>
                                        <span>-</span>
                                        <span>{couponDiscountAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            {/* Final Total */}
                            <div className="pt-6 border-t border-gray-100 flex justify-between items-start">
                                <span className="text-lg font-bold mt-1">{t.total}</span>
                                <div className="text-right">
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <div className="relative w-6 h-6 flex-shrink-0">
                                            <Image src="/oman-riyal.svg" alt="OMR" fill className="object-contain" />
                                        </div>
                                        <p className="text-2xl font-bold text-black leading-none">
                                            {finalTotal.toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 italic">{t.vatInclude}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleProceedToCheckout}
                            className="block w-full text-center bg-[#CF1322] text-white py-3 rounded-[15px] font-bold text-lg hover:bg-[#b0101d] transition-all shadow-lg shadow-red-50"
                        >
                            {t.checkout}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}