"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// --- تعريف شكل الكوبون ---
interface Coupon {
    code: string;
    value: number;
    type: 'percentage' | 'fixed';
    couponType: 'global' | 'product-specific'; // الحقل الجديد
    applicableProduct?: string;
}

// --- تعريف شكل المنتج داخل الكارت ---
interface CartItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    colorCode?: string;
    modelName: string;
    discount: number;
}

interface CartContextType {
    cart: CartItem[];
    appliedCoupon: Coupon | null; // إضافة حالة الكوبون
    addToCart: (product: CartItem) => void;
    removeFromCart: (id: string, colorCode?: string) => void;
    updateQuantity: (id: string, delta: number, colorCode?: string) => void;
    setAppliedCoupon: (coupon: Coupon | null) => void; // دالة لتحديث الكوبون
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null); // State الكوبون

    // 1. عند فتح الموقع: سحب البيانات من الـ LocalStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('huawei_cart');
        const savedCoupon = localStorage.getItem('huawei_coupon'); // سحب الكوبون المحفوظ

        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        if (savedCoupon) {
            setAppliedCoupon(JSON.parse(savedCoupon));
        }
    }, []);

    // 2. عند أي تغيير في الكارت أو الكوبون: الحفظ في الـ LocalStorage
    useEffect(() => {
        localStorage.setItem('huawei_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (appliedCoupon) {
            localStorage.setItem('huawei_coupon', JSON.stringify(appliedCoupon));
        } else {
            localStorage.removeItem('huawei_coupon');
        }
    }, [appliedCoupon]);

    // دالة إضافة منتج
    const addToCart = (product: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item._id === product._id && item.colorCode === product.colorCode);
            if (existingItem) {
                return prevCart.map(item =>
                    (item._id === product._id && item.colorCode === product.colorCode)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // دالة حذف منتج
    const removeFromCart = (id: string, colorCode?: string) => {
        setCart(prev => prev.filter(item =>
            // امسح العنصر فقط لو الأيدي واللون متطابقين
            !(item._id === id && item.colorCode === colorCode)
        ));
    };

    // 2. دالة تحديث الكمية (بناءً على الأيدي واللون)
    const updateQuantity = (id: string, delta: number, colorCode?: string) => {
        setCart(prev => prev.map(item =>
            (item._id === id && item.colorCode === colorCode)
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        ));
    };

    const clearCart = () => {
        setCart([]);
        setAppliedCoupon(null); // مسح الكوبون عند تفريغ السلة
    };

    return (
        <CartContext.Provider value={{
            cart,
            appliedCoupon,
            setAppliedCoupon,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};