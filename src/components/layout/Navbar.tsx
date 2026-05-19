"use client";
import React, { useEffect, useState } from "react";
import { Search, ShoppingBag, X, Menu, User, Languages } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../../../app/(main)/context/CartContext";
import { useAuth } from "../../../app/(main)/context/AuthContext";
import { useLang } from "../../../app/(main)/context/LanguageContext";

// كائن الترجمة الخاص بالـ Navbar
const translations = {
  en: {
    links: [
      { name: "Store", href: "/" },
      { name: "Smartphone", href: "/smartphone" },
      { name: "Wearable", href: "/wearable" },
      { name: "Tablet", href: "/tablet" },
      { name: "Audio", href: "/audio" },
    ],
    quickView: "Quick View",
    productsFound: "Products Found",
    noResults: 'No results for "{query}"',
    searchPlaceholder: "Search HUAWEI...",
    account: "Account",
    trackOrder: "order",
    logout: "Logout",
    login: "Login",
  },
  ar: {
    links: [
      { name: "المتجر", href: "/" },
      { name: "الهواتف الذكية", href: "/smartphone" },
      { name: "الأجهزة القابلة للارتداء", href: "/wearable" },
      { name: "التابلت", href: "/tablet" },
      { name: "الصوتيات", href: "/audio" },
    ],
    quickView: "روابط سريعة",
    productsFound: "المنتجات التي تم العثور عليها",
    noResults: 'لا توجد نتائج لـ "{query}"',
    searchPlaceholder: "ابحث في هواوي...",
    account: "حسابي",
    trackOrder: "الطلب",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
  }
};

export default function Navbar() {
  const { lang, toggleLang } = useLang();
  const t = translations[lang]; // اختيار نصوص اللغة الحالية

  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const { cart } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (isSearchOpen) setIsSearchOpen(false);
      if (isMenuOpen) setIsMenuOpen(false);
      if (isAccountOpen) setIsAccountOpen(false);
    };
    if (isSearchOpen || isMenuOpen || isAccountOpen) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSearchOpen, isMenuOpen, isAccountOpen]);

  useEffect(() => {
    setMounted(true);
    fetch("https://api.huaweioman.com/admin/allproduct")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([]);
    } else {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleProductClick = (product: any) => {
    // الآن أصبح كائن product متاحاً داخل هذه الدالة
    const slug = `${product._id}-${product.name.replace(/\s+/g, '-').toLowerCase()}`;
    router.push(`/product/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery("");
};

  const handleLogout = () => {
    logout();
    setIsAccountOpen(false);
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <>
      <nav className="absolute top-0 left-0 w-full bg-[#f5f5f5] z-[110] px-6 md:px-20 h-[55px] flex items-center justify-between ">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center group cursor-pointer">
            <Image src="/huawei.png" alt="Huawei Logo" width={40} height={40} className="object-contain pt-1" />
            <span className="font-bold text-black text-[12px] uppercase tracking-wider">HUAWEI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {t.links.map((link) => (
              <Link key={link.name} href={link.href} className="relative text-[12px] font-bold text-black py-2 group overflow-hidden">
                {link.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-black transition-all duration-300 ease-out -translate-x-1/2 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-black">
          {/* زر تبديل اللغة */}
          {/* زر تبديل اللغة باستخدام الأيقونة */}
          <button
            onClick={toggleLang}
            className="hidden lg:flex items-center gap-1 p-2 hover:text-gray-600 transition-colors outline-none"
            title={lang === 'en' ? 'تغيير اللغة للعربية' : 'Switch to English'}
          >
            <Languages size={20} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase">
              {lang === 'en' ? 'Ar' : 'En'}
            </span>
          </button>

          <Link href="/cart" className="relative group p-2">
            <button className="cursor-pointer outline-none transition-colors">
              <ShoppingBag size={20} strokeWidth={2.5} />
            </button>
            {totalItems > 0 && (
              <span className="absolute top-1 right-0 bg-[#CF1322] text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1 border-2 border-[#f5f5f5]">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMenuOpen(false); setIsAccountOpen(false); }}
            className="transition-colors p-2 cursor-pointer outline-none"
          >
            {isSearchOpen ? <X size={20} strokeWidth={2.5} /> : <Search size={20} strokeWidth={2.5} />}
          </button>

          <button
            onClick={() => { setIsMenuOpen(!isMenuOpen); setIsSearchOpen(false); setIsAccountOpen(false); }}
            className="lg:hidden transition-colors p-2 cursor-pointer outline-none"
          >
            {isMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
          </button>

          <div className="relative hidden lg:block">
            <button
              onClick={() => { setIsAccountOpen(!isAccountOpen); setIsSearchOpen(false); setIsMenuOpen(false); }}
              className="p-2 cursor-pointer outline-none hover:text-gray-600 transition-colors"
            >
              <User size={21} strokeWidth={2} />
            </button>

            {isAccountOpen && (
              <div className={`absolute top-[45px] ${lang === 'ar' ? 'left-0' : 'right-0'} bg-white shadow-xl rounded-lg py-4 w-[180px] z-[120] border border-gray-100 animate-in fade-in zoom-in-95 duration-200`}>
                <div className="flex flex-col">
                  
                  <Link href="/orders" onClick={() => setIsAccountOpen(false)} className={`px-6 py-3 text-[14px] font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-50 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t.trackOrder}
                  </Link>

                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className={`px-6 py-3 text-[14px] font-bold text-[#CF1322] hover:bg-gray-50 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    >
                      {t.logout}
                    </button>
                  ) : (
                    <Link href="/login" onClick={() => setIsAccountOpen(false)} className={`px-6 py-3 text-[14px] font-bold text-blue-500 hover:bg-gray-50 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                      {t.login}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[105] lg:hidden transition-all duration-500 ${isMenuOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-full bg-white shadow-xl transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
          <div className="pt-[70px] pb-10 px-10">
            <div className={`flex flex-col gap-6 ${lang === 'ar' ? 'items-start' : 'items-start'}`}>
              {t.links.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-[16px] text-bold hover:text-zinc-500 transition-colors">
                  {link.name}
                </Link>
              ))}
              <div className="w-full h-[1px] bg-gray-100 my-2"></div>

              {/* خيارات الحساب داخل المنيو */}
             
              <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="text-[16px] font-medium text-gray-700">
                {t.trackOrder}
              </Link>

              {isAuthenticated ? (
                <button onClick={handleLogout} className="text-[16px] font-bold text-[#CF1322]">
                  {t.logout}
                </button>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[16px] font-bold text-blue-500">
                  {t.login}
                </Link>
              )}

              <div className="w-full h-[1px] bg-gray-100 my-2"></div>

              {/* زر تبديل اللغة داخل المنيو */}
              <button
                onClick={() => { toggleLang(); setIsMenuOpen(false); }}
                className="flex items-center gap-2 text-[16px] font-bold text-gray-700"
              >
                <Languages size={20} />
                {lang === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </div> بيطلع برا الحدود حل المشكلة دي فقط

      {/* Search Overlay */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isSearchOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-zinc-500/20 transition-all duration-500 ease-in-out ${isSearchOpen ? "backdrop-blur-md opacity-100" : "backdrop-blur-none opacity-0"}`} onClick={() => setIsSearchOpen(false)}></div>
        <div className={`absolute top-0 left-0 w-full bg-[#f5f5f5] shadow-2xl transition-transform duration-500 ease-out ${isSearchOpen ? "translate-y-0" : "-translate-y-full"}`} style={{ height: '60vh', paddingTop: '55px' }}>
          <div className="max-w-[1100px] mx-auto pt-16 px-6 relative h-full flex flex-col">
            <div className={`flex items-center gap-4 border-b border-zinc-300 pb-4 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <Search size={23} className="text-zinc-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className={`w-full bg-transparent text-[18px] font-light outline-none text-black placeholder:text-zinc-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                autoFocus={isSearchOpen}
              />
            </div>
            <div className="flex-1 mt-10 overflow-y-auto pb-10 flex flex-col justify-between">
              <div>
                {searchQuery.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <h3 className={`text-zinc-500 text-[12px] uppercase mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.productsFound}</h3>
                    <div className={`flex flex-col gap-4 ${lang === 'ar' ? 'items-end' : 'items-start'}`}>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <div key={product._id} onClick={() => handleProductClick(product)} className="text-[13px] font-medium text-black hover:underline cursor-pointer transition-all inline-block w-fit">
                            {product.name}
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-400 text-[13px]">{t.noResults.replace("{query}", searchQuery)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className={`transition-all duration-500 ease-in-out ${isInputFocused ? "opacity-0 invisible h-0 overflow-hidden" : "opacity-100 visible mt-auto pt-8"}`}>
                <h3 className={`text-zinc-500 text-[12px] uppercase mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.quickView}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {t.links.slice(1, 5).map((link) => (
                    <Link key={link.name} href={link.href} onClick={() => setIsSearchOpen(false)} className="text-[12px] font-bold text-black hover:underline transition-all w-fit">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}