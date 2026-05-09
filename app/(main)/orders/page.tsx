"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Package, Clock, CheckCircle2, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

// تعريف أنواع البيانات (Interfaces)
interface OrderItem {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    colorCode?: string;
}

interface Order {
    _id: string;
    total: number;
    status: string;
    paymentStatus: string;
    items: OrderItem[];
    createdAt: string;
}

export default function MyOrdersPage() {
    const { lang } = useLang();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError(lang === 'ar' ? "يرجى تسجيل الدخول أولاً" : "Please login first");
                    setLoading(false);
                    return;
                }

                const response = await fetch('https://api.huaweioman.com/user/my-orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (data.success) {
                    setOrders(data.orders);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError(lang === 'ar' ? "حدث خطأ أثناء جلب البيانات" : "Error fetching orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [lang]);

    // دالة لتنسيق التاريخ
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // دالة لتنسيق حالة الطلب
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-[#CF1322]" size={40} />
        </div>
    );

    return (
        <main className="bg-gray-50 min-h-screen py-24 px-4 md:px-10 font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-[1000px] mx-auto">
                <h1 className="text-3xl font-black mb-8 text-gray-900 flex items-center gap-4">
                    <Package size={32} className="text-[#CF1322]" />
                    {lang === 'ar' ? "طلباتي" : "My Orders"}
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-6">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {orders.length === 0 && !error ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                        <Package size={60} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">
                            {lang === 'ar' ? "لا توجد طلبات سابقة" : "You have no previous orders"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                {/* رأس البطاقة */}
                                <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                {lang === 'ar' ? "رقم الطلب" : "Order ID"}
                                            </p>
                                            <p className="font-mono text-sm text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden sm:block"></div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                {lang === 'ar' ? "التاريخ" : "Date"}
                                            </p>
                                            <p className="text-sm text-gray-600 font-medium">{formatDate(order.createdAt)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {order.paymentStatus === 'Paid' ? (lang === 'ar' ? 'تم الدفع' : 'Paid') : (lang === 'ar' ? 'لم يدفع' : 'Unpaid')}
                                        </span>
                                    </div>
                                </div>

                                {/* محتوى الطلب (المنتجات) */}
                                <div className="p-6 bg-white">
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-lg p-2 border flex-shrink-0">
                                                    <img src={item.photo} alt={item.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-gray-800 truncate">{item.name}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {lang === 'ar' ? 'الكمية' : 'Qty'}: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm font-bold text-gray-900">{item.price.toLocaleString()}</span>
                                                        <span className="text-[10px] font-bold text-gray-400">OMR</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* تذييل البطاقة (الإجمالي) */}
                                <div className="px-6 py-4 bg-gray-50/50 flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-500">
                                        {lang === 'ar' ? 'إجمالي الطلب' : 'Order Total'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-black text-[#CF1322]">{order.total.toLocaleString()}</span>
                                        <span className="text-xs font-bold text-gray-400">OMR</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}