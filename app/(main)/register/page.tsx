"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const translations = {
    en: {
        title: "Register HUAWEI ID",
        haveAccount: "Already have an account?",
        login: "Log in",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email address",
        phone: "Phone number",
        district: "District",
        password: "Password",
        registerBtn: "REGISTER",
        loading: "CREATING ACCOUNT...",
        agreement: "By clicking Register, you agree to the HUAWEI ID User Agreement and Privacy Statement.",
        errorDefault: "Something went wrong during registration"
    },
    ar: {
        title: "إنشاء حساب HUAWEI ID",
        haveAccount: "لديك حساب بالفعل؟",
        login: "تسجيل الدخول",
        firstName: "الاسم الأول",
        lastName: "اسم العائلة",
        email: "عنوان البريد الإلكتروني",
        phone: "رقم الهاتف",
        district: "المنطقة/الحي",
        password: "كلمة المرور",
        registerBtn: "تسجيل",
        loading: "جاري إنشاء الحساب...",
        agreement: "بالنقر فوق تسجيل، فإنك توافق على اتفاقية مستخدم HUAWEI ID وبيان الخصوصية.",
        errorDefault: "حدث خطأ ما أثناء التسجيل"
    }
};

const OMAN_CITIES = [
    "Muscat (مسقط)",
    "Dhofar (ظفار)",
    "Musandam (مسندم)",
    "Al Buraimi (البريمي)",
    "Ad Dakhiliyah (الداخلية)",
    "Al Batinah North (شمال الباطنة)",
    "Al Batinah South (جنوب الباطنة)",
    "Ash Sharqiyah North (شمال الشرقية)",
    "Ash Sharqiyah South (جنوب الشرقية)",
    "Ad Dhahirah (الظاهرة)",
    "Al Wusta (الوسطى)"
];


export default function RegisterPage() {
    const router = useRouter();
    const { lang } = useLang();
    const t = translations[lang];
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // State مطابق للـ Schema
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        city: '', // القيمة الافتراضية بناءً على التصميم
        district: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post('https://api.huaweioman.com/user/register', formData);
            login(res.data.token, res.data.user);
            router.push('/'); // التوجه للرئيسية بعد النجاح
        } catch (err: any) {
            setError(err.response?.data?.message || t.errorDefault);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center pt-12 px-4 font-sans">
            <div className="w-full max-w-[450px] mt-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-normal text-black mb-2">{t.title}</h1>
                    <div className="text-[14px] text-gray-600">
                        {t.haveAccount}
                        <Link href="/login" className="text-blue-600 hover:underline ml-1">
                            {t.login}{'>'}
                        </Link>
                    </div>
                </div>

                {error && <p className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Names Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder={t.firstName}
                            required
                            onChange={handleChange}
                            className="w-full bg-[#f2f2f2] rounded-xl p-4 outline-none focus:ring-1 focus:ring-blue-400 transition-all text-[15px]"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder={t.lastName}
                            required
                            onChange={handleChange}
                            className="w-full bg-[#f2f2f2] rounded-xl p-4 outline-none focus:ring-1 focus:ring-blue-400 transition-all text-[15px]"
                        />
                    </div>

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder={t.email}
                        required
                        onChange={handleChange}
                        className="w-full bg-[#f2f2f2] rounded-xl p-4 outline-none focus:ring-1 focus:ring-blue-400 transition-all text-[15px]"
                    />

                    {/* Phone Input Design */}
                    <div className="flex bg-[#f2f2f2] rounded-xl overflow-hidden border border-transparent focus-within:border-blue-400 transition-all">

                        <input
                            type="tel"
                            name="phone"
                            placeholder={t.phone}
                            required
                            onChange={handleChange}
                            className="w-full bg-transparent p-4 outline-none text-[15px]"
                        />
                    </div>

                    {/* City Select */}
                    <div className="relative bg-[#f2f2f2] rounded-xl overflow-hidden border border-transparent focus-within:border-blue-400 transition-all">
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full bg-transparent p-4 outline-none text-[15px] appearance-none cursor-pointer"
                        >
                            {OMAN_CITIES.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <ChevronDown size={18} />
                        </div>
                    </div>

                    {/* District */}
                    <input
                        type="text"
                        name="district"
                        placeholder={t.district}
                        onChange={handleChange}
                        className="w-full bg-[#f2f2f2] rounded-xl p-4 outline-none focus:ring-1 focus:ring-blue-400 transition-all text-[15px]"
                    />

                    {/* Password */}
                    <div className="relative bg-[#f2f2f2] rounded-xl overflow-hidden">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder={t.password}
                            required
                            onChange={handleChange}
                            className="w-full bg-transparent p-4 outline-none text-[15px]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 mt-8 rounded-full font-bold text-white transition-all text-[15px]
                   ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#CF1322] hover:bg-black shadow-sm'}`}
                    >
                        {loading ? t.loading : t.registerBtn}
                    </button>
                </form>

                {/* Footer Info */}
                <p className="text-[11px] text-gray-400 mt-8 text-center leading-relaxed">
                    By clicking Register, you agree to the HUAWEI ID User Agreement and Privacy Statement.
                </p>
            </div>
        </main>
    );
}