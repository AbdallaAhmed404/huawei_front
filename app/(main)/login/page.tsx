"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { useLang } from '../context/LanguageContext';


const translations = {
    en: {
        title: "Log in with HUAWEI ID",
       email: "Phone/Email/Login ID",
        password: "Password",
        loginBtn: "LOG IN",
        loading: "LOADING...",
        register: "Register",
        errorDefault: "Invalid credentials"
    },
    ar: {
        title: "تسجيل الدخول باستخدام حساب HUAWEI",
        email: "الهاتف/البريد الإلكتروني/اسم المستخدم",
        password: "كلمة المرور",
        loginBtn: "تسجيل الدخول",
        loading: "جاري التحميل...",
        register: "إنشاء حساب",
        errorDefault: "بيانات الاعتماد غير صالحة"
    }
};


export default function LoginPage() {
    const { lang } = useLang();
    const t = translations[lang];
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post('https://api.huaweioman.com/user/login', formData);
            login(res.data.token, res.data.user);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center pt-24 px-6 font-sans">
            <div className="w-full max-w-[420px]">

                {/* العنوان الرئيسي كما في هوية هواوي */}
                <div className="text-center mb-12">
                    <h1 className="text-[28px] font-normal text-black tracking-tight">{t.title}</h1>
                </div>

                {error && <p className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* حقل الإدخال الأول: Phone/Email/Login ID */}
                    <div className="bg-[#F2F2F2] rounded-[12px] p-1.5 transition-all focus-within:bg-[#E8E8E8]">
                        <input
                            type="email"
                            name="email"
                            placeholder={t.email}
                            required
                            onChange={handleChange}
                            className="w-full bg-transparent p-3.5 outline-none text-[16px] text-black placeholder-[#808080]"
                        />
                    </div>

                    {/* حقل كلمة المرور مع أيقونة العين */}
                    <div className="bg-[#F2F2F2] rounded-[12px] p-1.5 flex items-center transition-all focus-within:bg-[#E8E8E8] relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder={t.password}
                            required
                            onChange={handleChange}
                            className="w-full bg-transparent p-3.5 outline-none text-[16px] text-black placeholder-[#808080]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="pr-4 text-black opacity-80"
                        >
                            {showPassword ? <EyeOff size={22} strokeWidth={1.5} /> : <Eye size={22} strokeWidth={1.5} />}
                        </button>
                    </div>

                    {/* زر الـ LOG IN الكبير */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 mt-10 rounded-[12px] font-bold text-white transition-all text-[17px] tracking-wide
                          ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#CF1322] hover:bg-black'}`}
                    >
                       {loading ? t.loading : t.loginBtn}
                    </button>
                </form>

                {/* روابط إضافية أسفل الزر */}
                <div className="mt-8 flex justify-center gap-4 text-[14px]">
                    <Link href="/register" className="text-[#007DFF] hover:underline font-medium">
                        {t.register}
                    </Link>
                </div>
            </div>
        </main>
    );
}