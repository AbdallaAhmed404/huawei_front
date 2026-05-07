"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Ticket, Plus, Trash2, Calendar, Hash, 
  Percent, DollarSign, X, Loader2, Search, Package, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CouponRegistry() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]); // قائمة المنتجات للاختيار منها
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiryDate: "",
    usageLimit: 100,
    couponType: "global", // الحقل الجديد
    applicableProduct: "" // الحقل الجديد
  });

  useEffect(() => {
    fetchCoupons();
    fetchProducts(); // جلب المنتجات عند تحميل الصفحة
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get("https://api.huaweioman.com/admin/getAllCoupons", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCoupons(res.data.coupons || []);
    } catch (err) { console.error("Error fetching coupons:", err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://api.huaweioman.com/admin/allpr"); // تأكد من مسار جلب المنتجات عندك
      setProducts(res.data || []);
    } catch (err) { console.error("Error fetching products:", err); }
  };

  const handleCreate = async () => {
    if (!formData.code || !formData.discountValue || !formData.expiryDate) {
      return alert("Please fill all required fields");
    }
    if (formData.couponType === "product-specific" && !formData.applicableProduct) {
      return alert("Please select a product for this coupon");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post("https://api.huaweioman.com/admin/createCoupon", formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCoupons();
      setIsModalOpen(false);
      setFormData({ 
        code: "", discountType: "percentage", discountValue: "", 
        expiryDate: "", usageLimit: 100, couponType: "global", applicableProduct: "" 
      });
    } catch (err) { alert("Failed to create coupon"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://api.huaweioman.com/admin/deleteCoupon/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCoupons();
    } catch (err) { alert("Delete failed"); }
  };

  const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 space-y-6">
      
      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-zinc-900/40 p-5 rounded-2xl border border-white/10 sticky top-0 z-20 backdrop-blur-xl">
        <div className="relative w-full lg:max-w-md">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search coupons by code..." 
            className="w-full bg-black/40 border border-white/10 py-3.5 pl-12 pr-4 rounded-xl text-[15px] text-white outline-none focus:border-white/30 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all"
        >
          <Plus size={20} /> Create Coupon
        </button>
      </div>

      {/* COUPONS TABLE */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[14px] font-bold text-zinc-400 border-b border-white/10 bg-white/[0.02]">
              <th className="px-6 py-6">Promo Code</th>
              <th className="px-6 py-6">Target</th>
              <th className="px-6 py-6">Value</th>
              <th className="px-6 py-6">Usage Status</th>
              <th className="px-6 py-6">Expiry Date</th>
              <th className="px-6 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredCoupons.map((coupon) => (
              <tr key={coupon._id} className="group hover:bg-white/[0.01] transition-all">
                
                <td className="px-6 py-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 text-white">
                      <Ticket size={18} />
                    </div>
                    <span className="font-black text-white text-[16px] tracking-tight uppercase">{coupon.code}</span>
                  </div>
                </td>

                {/* Target (Global vs Product) */}
                <td className="px-6 py-8">
                  <div className="flex flex-col gap-1">
                    <span className={cn(
                      "w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                      coupon.couponType === "global" 
                        ? "text-green-500 bg-green-500/10 border-green-500/20" 
                        : "text-purple-500 bg-purple-500/10 border-purple-500/20"
                    )}>
                      {coupon.couponType}
                    </span>
                    {coupon.applicableProduct && (
                      <span className="text-[11px] text-zinc-500 font-bold truncate max-w-[150px]">
                        {coupon.applicableProduct.name}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-8">
                  <div className="flex items-center gap-1 font-black text-white text-lg">
                    {coupon.discountValue}
                    <span className="text-zinc-500 text-xs font-bold">
                      {coupon.discountType === 'percentage' ? '%' : 'OMR'}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-8">
                  <div className="w-48 space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                      <span className="text-zinc-500">Redeemed</span>
                      <span className="text-white">{coupon.usedCount} / {coupon.usageLimit}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-500" 
                        style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-6 py-8 text-zinc-400 font-medium text-[14px]">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-zinc-600" />
                    {new Date(coupon.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </td>

                <td className="px-6 py-8 text-right">
                  <button 
                    onClick={() => handleDelete(coupon._id)}
                    className="p-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl space-y-6 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white"><X /></button>
            
            <div className="space-y-2 text-center lg:text-left">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">New Promotion</h3>
              <p className="text-zinc-500 text-sm font-medium">Configure discount parameters and limits.</p>
            </div>

            <div className="space-y-4">
              {/* Coupon Type Switcher */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-black border border-white/5 rounded-2xl">
                <button 
                  onClick={() => setFormData({...formData, couponType: 'global', applicableProduct: ''})}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase transition-all",
                    formData.couponType === 'global' ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                  )}
                >
                  <Globe size={14} /> Global
                </button>
                <button 
                  onClick={() => setFormData({...formData, couponType: 'product-specific'})}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase transition-all",
                    formData.couponType === 'product-specific' ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                  )}
                >
                  <Package size={14} /> Specific
                </button>
              </div>

              {/* Product Selection (Conditional) */}
              {formData.couponType === "product-specific" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[11px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Select Product</label>
                  <select 
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none cursor-pointer appearance-none"
                    value={formData.applicableProduct}
                    onChange={(e) => setFormData({...formData, applicableProduct: e.target.value})}
                  >
                    <option value="">Choose a product...</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Code Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Code</label>
                <div className="flex items-center gap-3 bg-black border border-white/10 p-4 rounded-2xl">
                  <Hash size={18} className="text-zinc-600" />
                  <input 
                    type="text" 
                    placeholder="SAVE20" 
                    className="bg-transparent outline-none w-full text-white uppercase font-black"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                  />
                </div>
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Type</label>
                  <select 
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none appearance-none"
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (OMR)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Value</label>
                  <input 
                    type="number" 
                    placeholder="20" 
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                  />
                </div>
              </div>

              {/* Expiry & Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Expiry</label>
                  <input 
                    type="date" 
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Limit</label>
                  <input 
                    type="number" 
                    placeholder="100" 
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleCreate}
              disabled={loading}
              className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Deploy Code"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}