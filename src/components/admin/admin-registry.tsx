"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Search, Pencil, Trash2, X, Loader2, Save,
  Palette, Image as ImageIcon, Gift as GiftIcon, Upload, Trash, Box, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Gift { name: string; image: string; }
interface ColorVariant { colorCode: string; images: string[]; count: number; }

interface Product {
  _id?: string;
  name: string;
  description: string;
  modelName: string;
  image: string;
  count: number;
  price: number;
  discount: number;
  category: "Smartphone" | "Tablet" | "Audio" | "Wearable";
  subCategory: string;
  colors: ColorVariant[];
  gifts: Gift[];
  countInStock: number;
  variants: string[]; // إضافة حقل النسخ المرتبطة لتخزين الـ IDs
}

const CATEGORIES = ["Smartphone", "Tablet", "Audio", "Wearable"] as const;

const SUB_CATEGORIES: Record<string, string[]> = {
  Smartphone: ["Mate Series", "Pura Series", "nova Series"],
  Tablet: ["HUAWEI MatePad Pro Series", "HUAWEI MatePad Mini Series", "HUAWEI MatePad Series", "HUAWEI MatePad SE Series"],
  Audio: ["FreeBuds Series", "FreeClip Series", "FreeArc Series", "FreeLace Series", "Eyewear"],
  Wearable: ["WATCH Ultimate Series", "WATCH Series", "WATCH GT Series", "WATCH FIT Series", "WATCH D Series", "Band Series"],
};

export default function ProductRegistry() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [popup, setPopup] = useState<{ show: boolean; type: 'confirm' | 'info'; message: string; onConfirm?: () => void }>({
    show: false,
    type: 'info',
    message: '',
  });

  const initialForm: Product = {
    name: "", description: "", modelName: "", image: "",
    price: 0, discount: 0, count: 0,
    category: "Smartphone", subCategory: "Mate Series",
    colors: [], gifts: [], countInStock: 0,
    variants: [] // تهيئة مصفوفة النسخ
  };

  const [formData, setFormData] = useState<Product>(initialForm);
  
  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://api.huaweioman.com/admin/allpr");
      setProducts(res.data);
    } catch (err) { console.error("Fetch error", err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const uploadToR2 = async (file: File) => {
    try {
      const { data } = await axios.post("https://api.huaweioman.com/admin/get-upload-url", {
        folder: "products", filename: file.name, contentType: file.type,
      });
      await axios.put(data.signedUrl, file, { headers: { "Content-Type": file.type } });
      return data.publicUrl;
    } catch (err) { return null; }
  };

  const handleDelete = (id: string) => {
    setPopup({
      show: true,
      type: 'confirm',
      message: "Are you sure you want to delete this asset? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await axios.delete(`https://api.huaweioman.com/admin/delete/${id}`);
          fetchProducts();
        } catch (err) {
          setPopup({ show: true, type: 'info', message: "Delete failed. Please try again." });
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isEditing ? "updateproduct" : "addproduct";
    try {
      await axios.post(`https://api.huaweioman.com/admin/${endpoint}`, formData);
      setIsFormOpen(false);
      setFormData(initialForm);
      fetchProducts();
    } catch (err) {
      setPopup({ show: true, type: 'info', message: "Operation failed. Check your connection." });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen text-white font-sans">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
            placeholder="Search by name or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => { setFormData(initialForm); setIsEditing(false); setIsFormOpen(true); }} className="bg-red-600 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-600/20">
          <Plus size={20} /> New Product
        </button>
      </div>

      <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-x-auto backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 border-b border-white/5">
              <th className="p-8 font-semibold">Asset Identification</th>
              <th className="p-8 font-semibold">Classification</th>
              <th className="p-8 font-semibold">Commercial</th>
              <th className="p-8 font-semibold">Inventory</th>
              <th className="p-8 font-semibold">Configuration</th>
              <th className="p-8 font-semibold text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map((p) => (
              <tr key={p._id} className="group hover:bg-white/[0.03] transition-colors">
                <td className="p-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black border border-white/10 flex-shrink-0">
                      <img src={p.image} className="w-12 h-12 rounded-lg object-cover" alt={p.name} />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-100 text-base">{p.name}</div>
                      <div className="text-xs text-zinc-500 font-mono mt-1">{p.modelName}</div>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <div className="inline-block px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-[10px] font-bold uppercase tracking-wider border border-red-600/20">{p.category}</div>
                  <div className="text-xs text-zinc-400 mt-2 ml-1">{p.subCategory}</div>
                </td>
                <td className="p-8">
                  <div className="text-base font-bold text-zinc-100">{p.price} OMR</div>
                  {p.discount > 0 && <div className="text-[10px] text-green-500 font-medium mt-1">SAVE {p.discount} OMR</div>}
                </td>
                <td className="p-8">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-bold ${p.countInStock > 0 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                    <Box size={14} />
                    {p.countInStock} Units
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1.5 text-[10px] bg-white/5 px-3 py-1 rounded-lg border border-white/10 text-zinc-300"><Palette size={12} /> {p.colors.length}</span>
                    <span className="flex items-center gap-1.5 text-[10px] bg-white/5 px-3 py-1 rounded-lg border border-white/10 text-zinc-300"><GiftIcon size={12} /> {p.gifts.length}</span>
                  </div>
                </td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setFormData({ ...p, variants: p.variants || [] }); setIsEditing(true); setIsFormOpen(true); }} className="p-3 bg-zinc-800/50 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all"><Pencil size={18} /></button>
                    <button onClick={() => handleDelete(p._id!)} className="p-3 bg-zinc-800/50 hover:bg-red-900/30 rounded-xl text-zinc-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl overflow-y-auto custom-scrollbar">
            <motion.div initial={{ opacity: 0, scale: 0.98, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 30 }}
              className="bg-zinc-950 border border-white/10 p-10 rounded-[3rem] w-full max-w-6xl shadow-2xl my-auto">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-white">{isEditing ? 'Sync' : 'Deploy'} Huawei Asset</h2>
                  <p className="text-zinc-500 text-sm mt-1">Configure technical specifications and visual variants.</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors"><X size={28} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-1 space-y-4">
                    <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Product Core Visual</label>
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-dashed border-white/10 bg-zinc-900/50 group hover:border-red-600/50 transition-all flex items-center justify-center">
                      {formData.image ? (
                        <>
                          <img src={formData.image} className="w-full h-full object-cover" alt="preview" />
                          <button type="button" onClick={() => setFormData({ ...formData, image: "" })} className="absolute inset-0 bg-red-600/90 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <Trash size={24} className="text-white" />
                          </button>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                          <Upload size={32} className="text-zinc-600 group-hover:text-red-500 transition-colors" />
                          <span className="text-[10px] mt-3 text-zinc-600 font-black uppercase tracking-widest">Upload Image</span>
                          <input type="file" hidden onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await uploadToR2(file);
                              if (url) setFormData({ ...formData, image: url });
                            }
                          }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Asset Title" placeholder="e.g. Huawei P60 Pro" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} required />
                    <InputField label="Model Reference" placeholder="MNA-LX9" value={formData.modelName} onChange={(e: any) => setFormData({ ...formData, modelName: e.target.value })} required />
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-3">Technical Description</label>
                      <textarea placeholder="Define product features and specs..." className="w-full bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-sm h-32 outline-none focus:border-red-600 transition-all font-medium" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white/[0.02] rounded-[2rem] border border-white/5">
                  <SelectField label="Global Category" value={formData.category} options={CATEGORIES} onChange={(val: string) => setFormData({ ...formData, category: val as any, subCategory: SUB_CATEGORIES[val][0], variants: [] })} />
                  <SelectField label="Line / Series" value={formData.subCategory} options={SUB_CATEGORIES[formData.category]} onChange={(val: string) => setFormData({ ...formData, subCategory: val, variants: [] })} />
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2"><Layers size={14}/> Linked Variants</label>
                    <select 
                      multiple 
                      value={formData.variants} 
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setFormData({ ...formData, variants: values });
                      }}
                      className="w-full bg-zinc-900 border border-white/10 px-4 py-3 rounded-2xl text-sm outline-none focus:border-red-600 min-h-[120px] custom-scrollbar cursor-pointer transition-all"
                    >
                      {products
                        .filter(p => p.subCategory === formData.subCategory && p._id !== formData._id)
                        .map(p => (
                          <option key={p._id} value={p._id} className="bg-zinc-950 py-2 px-2 my-1 rounded-lg checked:bg-red-600 checked:text-white">
                            {p.name}
                          </option>
                        ))
                      }
                    </select>
                    <div className="flex justify-between items-center px-1">
                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Hold Ctrl/Cmd to multi-select</p>
                        <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-1">{formData.variants.length} Selected</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-3"><Palette className="text-red-600" /> Variant Color Palette</h3>
                    <button type="button" onClick={() => setFormData({ ...formData, colors: [...formData.colors, { colorCode: "#000000", images: [], count: 0 }] })} className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest">+ Add Variant</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.colors.map((col, idx) => (
                      <div key={idx} className="bg-zinc-900/80 p-5 rounded-[2rem] border border-white/5 flex items-center gap-6 group">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-inner flex-shrink-0">
                          <div className="absolute inset-0" style={{ backgroundColor: col.colorCode }} />
                          <input type="color" value={col.colorCode} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => {
                            const newCols = [...formData.colors];
                            newCols[idx].colorCode = e.target.value;
                            setFormData({ ...formData, colors: newCols });
                          }} />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{col.colorCode}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase">Stock:</span>
                                    <input 
                                    type="number" 
                                    min="0"
                                    value={col.count} 
                                    placeholder="0"
                                    className="w-16 bg-black border border-white/10 rounded-lg px-2 py-1 text-xs outline-none focus:border-red-600 transition-all font-bold text-red-500"
                                    onChange={(e) => {
                                        const newCols = [...formData.colors];
                                        newCols[idx].count = Number(e.target.value);
                                        const total = newCols.reduce((acc, curr) => acc + (curr.count || 0), 0);
                                        setFormData({ ...formData, colors: newCols, countInStock: total });
                                    }}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                              {col.images.map((img, i) => (
                                <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 relative group/img">
                                  <img src={img} className="w-full h-full object-cover" alt="variant" />
                                  <button type="button" onClick={() => {
                                    const newCols = [...formData.colors];
                                    newCols[idx].images = newCols[idx].images.filter((_, imgIdx) => imgIdx !== i);
                                    setFormData({ ...formData, colors: newCols });
                                  }} className="absolute inset-0 bg-red-600/90 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity"><X size={10} /></button>
                                </div>
                              ))}
                              <label className="w-8 h-8 rounded-lg border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                                <Plus size={12} />
                                <input type="file" hidden onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const url = await uploadToR2(file);
                                    if (url) {
                                      const newCols = [...formData.colors];
                                      newCols[idx].images.push(url);
                                      setFormData({ ...formData, colors: newCols });
                                    }
                                  }
                                }} />
                              </label>
                            </div>
                          </div>
                        </div>
                        <button type="button" onClick={() => {
                            const newCols = formData.colors.filter((_, i) => i !== idx);
                            const total = newCols.reduce((acc, curr) => acc + (curr.count || 0), 0);
                            setFormData({ ...formData, colors: newCols, countInStock: total });
                        }} className="p-2 text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-3"><GiftIcon className="text-red-600" /> Bundle Gifts</h3>
                    <button type="button" onClick={() => setFormData({ ...formData, gifts: [...formData.gifts, { name: "", image: "" }] })} className="text-xs font-bold text-red-500 uppercase tracking-widest">+ New Gift</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {formData.gifts.map((gift, idx) => (
                      <div key={idx} className="bg-zinc-900 p-4 rounded-3xl border border-white/5 space-y-4 relative group">
                        <div className="aspect-square bg-black rounded-2xl overflow-hidden relative border border-white/5">
                          {gift.image ? <img src={gift.image} className="w-full h-full object-cover" alt="gift" /> : <div className="absolute inset-0 flex items-center justify-center text-zinc-800"><ImageIcon size={32} /></div>}
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await uploadToR2(file);
                              if (url) {
                                const newGifts = [...formData.gifts];
                                newGifts[idx].image = url;
                                setFormData({ ...formData, gifts: newGifts });
                              }
                            }
                          }} />
                        </div>
                        <input placeholder="Gift Name" className="w-full bg-transparent text-xs text-center font-bold outline-none border-b border-white/5 pb-1 focus:border-red-600 transition-colors" value={gift.name} onChange={(e) => {
                          const newGifts = [...formData.gifts];
                          newGifts[idx].name = e.target.value;
                          setFormData({ ...formData, gifts: newGifts });
                        }} />
                        <button type="button" onClick={() => setFormData({ ...formData, gifts: formData.gifts.filter((_, i) => i !== idx) })} className="absolute -top-2 -right-2 bg-zinc-800 hover:bg-red-600 text-white rounded-full p-1.5 shadow-xl transition-colors"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 p-10 bg-red-600/5 rounded-[2.5rem] border border-red-600/10">
                  <InputField label="Base Price (OMR)" type="number" value={formData.price} onChange={(e: any) => setFormData({ ...formData, price: Number(e.target.value) })} />
                  <InputField label="Marketing Discount" type="number" value={formData.discount} onChange={(e: any) => setFormData({ ...formData, discount: Number(e.target.value) })} />
                  <InputField label="Stock Availability (Auto)" type="number" value={formData.countInStock} readOnly className="w-full bg-zinc-950/50 border border-white/10 px-5 py-4 rounded-2xl text-sm outline-none text-zinc-500 cursor-not-allowed" />
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-zinc-900 py-5 rounded-3xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all">Discard</button>
                  <button disabled={loading} className="flex-[2] bg-red-600 py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-red-600/30">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isEditing ? 'Push Updates' : 'Confirm Deployment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {popup.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-950 border border-white/10 p-8 rounded-[2rem] max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                {popup.type === 'confirm' ? <Trash2 className="text-red-500" size={28} /> : <Box className="text-red-500" size={28} />}
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">System Notification</h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">{popup.message}</p>
              
              <div className="flex gap-3">
                {popup.type === 'confirm' ? (
                  <>
                    <button onClick={() => setPopup({ ...popup, show: false })} className="flex-1 px-6 py-3 rounded-xl bg-zinc-900 font-bold text-xs uppercase hover:bg-zinc-800 transition-colors">Cancel</button>
                    <button onClick={() => { popup.onConfirm?.(); setPopup({ ...popup, show: false }); }} className="flex-1 px-6 py-3 rounded-xl bg-red-600 font-bold text-xs uppercase hover:bg-red-700 transition-colors">Confirm</button>
                  </>
                ) : (
                  <button onClick={() => { setPopup({ ...popup, show: false }); fetchProducts(); }} className="w-full px-6 py-3 rounded-xl bg-red-600 font-bold text-xs uppercase hover:bg-red-700 transition-colors">Acknowledge</button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ label, className, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</label>
      <input {...props} className={className || "w-full bg-zinc-900 border border-white/10 px-5 py-4 rounded-2xl text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-zinc-700"} />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: readonly string[] | string[];
  onChange: (val: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-zinc-900 border border-white/10 px-5 py-4 rounded-2xl text-sm outline-none focus:border-red-600 appearance-none cursor-pointer transition-all">
        {options.map((opt: string) => <option key={opt} value={opt} className="bg-zinc-950">{opt}</option>)}
      </select>
    </div>
  );
}