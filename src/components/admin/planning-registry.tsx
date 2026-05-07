"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ImageIcon, Layout, Plus, Trash2, Smartphone, Tablet, Watch, Headphones, 
  CheckCircle, Loader2, X, Link as LinkIcon, Type, Images, Edit, Save, Upload as UploadIcon, Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- الهيكل الثابت للكاتيجوري ---
const FULL_CATEGORIES = [
  { id: 1, name: "Smartphone", icon: <Smartphone size={24} />, subs: ["Mate Series", "Pura Series", "nova Series"] },
  { id: 3, name: "Tablet", icon: <Tablet size={24} />, subs: ["HUAWEI MatePad Pro Series", "HUAWEI MatePad Mini Series", "HUAWEI MatePad Series","HUAWEI MatePad SE Series"] },
  { id: 4, name: "Wearable", icon: <Watch size={24} />, subs: ["WATCH Ultimate Series", "WATCH Series", "WATCH GT Series","WATCH FIT Series","WATCH D Series","Band Series"] },
  { id: 5, name: "Audio", icon: <Headphones size={24} />, subs: ["FreeBuds Series", "FreeClip Series", "FreeArc Series","FreeLace Series","Eyewear"] },
];

export default function StoreCustomizer() {
  const [activeSection, setActiveSection] = useState<"slider" | "categories" | "popup" | "gallery">("slider");
  
  // --- States عامة ---
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]); 

  // --- States السلايدر ---
  const [sliders, setSliders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlider, setNewSlider] = useState({ link: "", file: null as File | null });

  // --- States الكاتيجوري ---
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [selectedMainName, setSelectedMainName] = useState("");
  const [selectedSubName, setSelectedSubName] = useState("");
  const [catFile, setCatFile] = useState<File | null>(null);

  // --- States البوب اب ---
  const [popupData, setPopupData] = useState<any>(null);
  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const [newPopup, setNewPopup] = useState({ link: "", file: null as File | null });

  // --- States الجاليري المحسن ---
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [galleryItems, setGalleryItems] = useState<{label: string, images: string[]}[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchSliders();
    fetchCategories();
    fetchPopup();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://huawei-production.up.railway.app/admin/allpr");
      setProducts(res.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchSliders = async () => {
    try {
      const res = await axios.get("https://huawei-production.up.railway.app/admin/sliders");
      setSliders(res.data.sliders || []);
    } catch (err) { console.error("Error fetching sliders:", err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://huawei-production.up.railway.app/admin/categories");
      setDbCategories(res.data.categories || []);
    } catch (err) { console.error("Error fetching categories:", err); }
  };

  const fetchPopup = async () => {
    try {
      const res = await axios.get("https://huawei-production.up.railway.app/admin/popup");
      setPopupData(res.data.popup);
    } catch (err) { console.error("Error fetching popup:", err); }
  };

  const fetchGallery = async (id: string) => {
      if(!id) return;
      setIsSyncing(true);
      try {
          const res = await axios.get(`https://huawei-production.up.railway.app/admin/gallery/${id}`);
          setGalleryItems(res.data.galleryItems || []);
      } catch (err) { 
          setGalleryItems([]); 
          console.log("No existing gallery for this product");
      } finally { setIsSyncing(false); }
  };

  // --- منطق الجاليري ---
  const handleAddGroup = () => setGalleryItems([...galleryItems, { label: "", images: [] }]);
  
  const handleUploadImagesToGroup = async (index: number, files: FileList | null) => {
      if (!files) return;
      setIsSyncing(true);
      try {
          const uploadedUrls = [];
          for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const { data: uploadData } = await axios.post("https://huawei-production.up.railway.app/admin/get-upload-url", {
                  folder: "product-gallery", filename: file.name, contentType: file.type
              });
              await axios.put(uploadData.signedUrl, file, { headers: { "Content-Type": file.type } });
              uploadedUrls.push(uploadData.publicUrl);
          }
          const updated = [...galleryItems];
          updated[index].images = [...updated[index].images, ...uploadedUrls];
          setGalleryItems(updated);
      } catch (err) { alert("Image upload failed"); }
      finally { setIsSyncing(false); }
  };

  const handleSyncGallery = async () => {
      if (!selectedProductId) return alert("Select a product first");
      setIsSyncing(true);
      try {
          await axios.post("https://huawei-production.up.railway.app/admin/gallery/sync", {
              productId: selectedProductId,
              galleryItems
          });
          setIsGalleryModalOpen(false);
      } catch (err) { alert("Sync failed"); }
      finally { setIsSyncing(false); }
  };

  // --- منطق السلايدر والكاتيجوري والبوب اب ---
  const handleAddSlider = async () => {
    if (!newSlider.file) return ;
    try {
      setIsLoading(true);
      const { data: uploadData } = await axios.post("https://huawei-production.up.railway.app/admin/get-upload-url", {
        folder: "sliders", filename: newSlider.file.name, contentType: newSlider.file.type
      });
      await axios.put(uploadData.signedUrl, newSlider.file, { headers: { "Content-Type": newSlider.file.type } });
      const { data: finalData } = await axios.post("https://huawei-production.up.railway.app/admin/sliders", {
        imageUrl: uploadData.publicUrl, title: "", link: newSlider.link || "#"
      });
      setSliders(finalData.sliders);
      setIsModalOpen(false);
      setNewSlider({ link: "", file: null });
    } catch (err) { console.error(err); alert("Upload failed"); } finally { setIsLoading(false); }
  };

  const handleDeleteSlider = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await axios.delete(`https://huawei-production.up.railway.app/admin/sliders/${id}`);
      setSliders(res.data.sliders);
    } catch (err) { alert("Delete failed"); }
  };

  const handleUpdateCategory = async () => {
    if (!catFile || !selectedMainName) return alert("Please select a category and an image");
    try {
      setCatLoading(true);
      const { data: uploadData } = await axios.post("https://huawei-production.up.railway.app/admin/get-upload-url", {
        folder: "categories", filename: catFile.name, contentType: catFile.type
      });
      await axios.put(uploadData.signedUrl, catFile, { headers: { "Content-Type": catFile.type } });
      const imageUrl = uploadData.publicUrl;
      if (selectedSubName === "") {
        await axios.patch(`https://huawei-production.up.railway.app/admin/categories/main/upsert`, { mainIcon: imageUrl, mainCategoryName: selectedMainName });
      } else {
        await axios.patch(`https://huawei-production.up.railway.app/admin/categories/sub/upsert`, { mainCategoryName: selectedMainName, subCategoryName: selectedSubName, icon: imageUrl });
      }
      await fetchCategories();
      setIsCatModalOpen(false);
    } catch (err) { console.error(err); alert("Failed to update"); } finally { setCatLoading(false); }
  };

  const handleUpdatePopup = async () => {
    if (!newPopup.file) return ;
    try {
      setPopupLoading(true);
      const { data: uploadData } = await axios.post("https://huawei-production.up.railway.app/admin/get-upload-url", {
        folder: "popups", filename: newPopup.file.name, contentType: newPopup.file.type
      });
      await axios.put(uploadData.signedUrl, newPopup.file, { headers: { "Content-Type": newPopup.file.type } });
      const res = await axios.patch("https://huawei-production.up.railway.app/admin/popup", {
        imageUrl: uploadData.publicUrl, link: newPopup.link || "#"
      });
      setPopupData(res.data.popup);
      setIsPopupModalOpen(false);
      setNewPopup({ link: "", file: null });
    } catch (err) { console.error(err); alert("Failed to update popup"); } finally { setPopupLoading(false); }
  };

  return (
    <div className="flex flex-col min-h-screen text-white font-sans pb-20 bg-black">
      
      {/* Header */}
      <section className="p-8 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Customization Center</h1>
          <p className="text-zinc-500 text-[14px] font-medium mt-1">Manage Store Content & Product Immersive Gallery.</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="px-8 mt-8">
        <div className="flex gap-2 p-1.5 bg-white/5 border border-white/5 rounded-2xl w-fit overflow-x-auto">
          {[
            { id: "slider", label: "Home Sliders", icon: ImageIcon },
            { id: "categories", label: "Categories", icon: Layout },
            { id: "popup", label: "Welcome Popup", icon: Monitor },
            { id: "gallery", label: "Product Gallery", icon: Images },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all whitespace-nowrap",
                activeSection === tab.id ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
              )}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto w-full">
        
        {/* --- MODAL الجاليري المحسن --- */}
        {isGalleryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-4xl rounded-[2.5rem] p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center sticky top-0 bg-[#0f0f0f] pb-4 z-20">
                <h3 className="text-xl font-bold">Manage Immersive Gallery</h3>
                <button onClick={() => setIsGalleryModalOpen(false)} className="text-zinc-500 hover:text-white"><X /></button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Select Target Product</label>
                  <select 
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none text-sm text-white cursor-pointer"
                    value={selectedProductId}
                    onChange={(e) => {setSelectedProductId(e.target.value); fetchGallery(e.target.value);}}
                  >
                    <option value="">-- Click to Choose a Product --</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>

                {selectedProductId && (
                   <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white uppercase">Gallery Content Groups</h4>
                        <button onClick={handleAddGroup} className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
                           <Plus size={14} /> Add Group
                        </button>
                      </div>

                      {galleryItems.map((item, idx) => (
                        <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 relative group/box">
                           <button 
                             onClick={() => setGalleryItems(galleryItems.filter((_, i) => i !== idx))} 
                             className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                           >
                             <Trash2 size={16} />
                           </button>

                           <div className="space-y-2">
                              <label className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest">Group Title</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Design, Performance..." 
                                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl outline-none text-sm focus:border-white/40 transition-all"
                                value={item.label}
                                onChange={(e) => {
                                   const updated = [...galleryItems];
                                   updated[idx].label = e.target.value;
                                   setGalleryItems(updated);
                                }}
                              />
                           </div>
                           
                           <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                              {item.images.map((img, imgIdx) => (
                                <div key={imgIdx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group/img">
                                  <img src={img} className="w-full h-full object-cover" />
                                  <button 
                                    onClick={() => {
                                      const updated = [...galleryItems];
                                      updated[idx].images = updated[idx].images.filter((_, i) => i !== imgIdx);
                                      setGalleryItems(updated);
                                    }}
                                    className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                </div>
                              ))}
                              <label className="aspect-square border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all gap-2">
                                <input type="file" multiple className="hidden" onChange={(e) => handleUploadImagesToGroup(idx, e.target.files)} />
                                <UploadIcon size={20} className="text-zinc-600" />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Upload</span>
                              </label>
                           </div>
                        </div>
                      ))}
                   </div>
                )}
              </div>

              {selectedProductId && (
                <div className="pt-6 border-t border-white/5">
                  <button 
                    onClick={handleSyncGallery}
                    disabled={isSyncing}
                    className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all"
                  >
                    {isSyncing ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                    Save Gallery Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sections UI */}
        {activeSection === "slider" && (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold uppercase tracking-tight">Home Sliders</h2>
      <button onClick={() => setIsModalOpen(true)} className="text-xs bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
        <Plus size={16} /> Add Banner
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {sliders.map((slide) => (
        <div key={slide._id} className="space-y-3">
          <div className="relative group bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden">
            <img src={slide.imageUrl} className="w-full aspect-[21/9] object-cover opacity-80" />
            <button onClick={() => handleDeleteSlider(slide._id)} className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 size={18} />
            </button>
          </div>
          {/* عرض اللينك هنا */}
          <div className="flex items-center gap-2 px-4 text-zinc-500">
            <LinkIcon size={14} />
            <a href={slide.link} target="_blank" className="text-xs hover:text-white truncate">
              {slide.link || "No link provided"}
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {activeSection === "gallery" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight">Active Galleries</h2>
                <p className="text-xs text-zinc-500 mt-1">Products with deep immersive content.</p>
              </div>
              <button onClick={() => {setSelectedProductId(""); setGalleryItems([]); setIsGalleryModalOpen(true);}} className="bg-white text-black px-8 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2">
                <Plus size={16} /> New Gallery
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2.5rem] hover:border-white/20 transition-all">
                  <div className="w-full aspect-square rounded-3xl bg-white/5 overflow-hidden border border-white/5 mb-6">
                    <img src={product.image} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-md truncate">{product.name}</h3>
                  <p className="text-zinc-500 text-xs mb-6">{product.modelName}</p>
                  <button 
                    onClick={() => {setSelectedProductId(product._id); fetchGallery(product._id); setIsGalleryModalOpen(true);}}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"
                  >
                    <Edit size={16} /> Edit Gallery
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category section as before */}
        {activeSection === "categories" && (
           <div className="space-y-8">
             <div className="flex justify-between items-center">
               <h2 className="text-xl font-bold">Category Architecture & Icons</h2>
               <button onClick={() => setIsCatModalOpen(true)} className="text-[13px] bg-white text-black px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2">
                 <Plus size={16} /> Update Icons
               </button>
             </div>
             <div className="grid grid-cols-1 gap-6">
               {FULL_CATEGORIES.map((staticCat) => {
                 const dbCat = dbCategories.find(c => c.mainCategoryName === staticCat.name);
                 return (
                   <div key={staticCat.id} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem] hover:border-white/10 transition-all">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                       <div className="flex items-center gap-5">
                         <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 overflow-hidden">
                           {dbCat?.mainIcon ? <img src={dbCat.mainIcon} className="w-full h-full object-cover" /> : staticCat.icon}
                         </div>
                         <div>
                           <h3 className="text-xl font-bold">{staticCat.name}</h3>
                           <p className="text-zinc-500 text-[14px]">Main Category Identity</p>
                         </div>
                       </div>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                       {staticCat.subs.map((subName, idx) => {
                         const dbSub = dbCat?.subCategories?.find((s: any) => s.name === subName);
                         return (
                           <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center gap-3 group hover:border-white/20 transition-all">
                              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/5">
                                 {dbSub?.icon ? <img src={dbSub.icon} className="w-full h-full object-cover" /> : <Layout size={18} className="text-zinc-500" />}
                              </div>
                              <span className="text-[13px] font-bold text-zinc-400 group-hover:text-white text-center">{subName}</span>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
        )}

        {/* Popup section as before */}
        {activeSection === "popup" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Welcome Modal (Pop-up)</h2>
              <button onClick={() => setIsPopupModalOpen(true)} className="text-[13px] bg-white text-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
                <Plus size={16} /> Update Popup
              </button>
            </div>
            {popupData ? (
              <div className="max-w-md mx-auto bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative group">
                <img src={popupData.imageUrl} className="w-full aspect-square object-cover" />
                <div className="p-6 bg-white/5 border-t border-white/5">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <LinkIcon size={14} />
                    <span className="text-sm font-medium">{popupData.link}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[400px] border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-zinc-600">
                <Monitor size={48} className="mb-4 opacity-20" />
                <p className="font-medium">No popup configured yet.</p>
              </div>
            )}
          </div>
        )}

        {/* MODAL SLIDER (Re-used for Popup & Slider) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Upload New Banner</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X /></button>
              </div>
              <div className="space-y-4">
                <label className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:bg-white/5 transition-all">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setNewSlider({...newSlider, file: e.target.files?.[0] || null})} />
                  {newSlider.file ? <CheckCircle className="text-emerald-500" /> : <UploadIcon className="text-zinc-500" />}
                  <span className="text-sm text-zinc-400">{newSlider.file ? newSlider.file.name : "Select Banner Image"}</span>
                </label>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <Type size={18} className="text-zinc-500" />
                  <input type="text" placeholder="Redirect Link" className="bg-transparent outline-none w-full text-sm" value={newSlider.link} onChange={(e) => setNewSlider({...newSlider, link: e.target.value})} />
                </div>
              </div>
              <button onClick={handleAddSlider} disabled={isLoading} className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="animate-spin" /> : "Publish Banner"}
              </button>
            </div>
          </div>
        )}

        {/* MODAL CATEGORY */}
        {isCatModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Update Category Icon</h3>
                <button onClick={() => setIsCatModalOpen(false)} className="text-zinc-500 hover:text-white"><X /></button>
              </div>
              <div className="space-y-4">
                <select className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none text-sm text-white appearance-none cursor-pointer" value={selectedMainName} onChange={(e) => {setSelectedMainName(e.target.value); setSelectedSubName("");}}>
                  <option value="">Select Main Category</option>
                  {FULL_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <select className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none text-sm text-white appearance-none disabled:opacity-30 cursor-pointer" disabled={!selectedMainName} value={selectedSubName} onChange={(e) => setSelectedSubName(e.target.value)}>
                  <option value="">Main Category Icon (Only)</option>
                  {FULL_CATEGORIES.find(c => c.name === selectedMainName)?.subs.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <label className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:bg-white/5 transition-all">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setCatFile(e.target.files?.[0] || null)} />
                  {catFile ? <CheckCircle className="text-emerald-500" /> : <UploadIcon className="text-zinc-500" />}
                  <span className="text-sm text-zinc-400">{catFile ? catFile.name : "Select Icon Image"}</span>
                </label>
              </div>
              <button onClick={handleUpdateCategory} disabled={catLoading || !catFile || !selectedMainName} className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                {catLoading ? <Loader2 className="animate-spin" /> : "Update Icon"}
              </button>
            </div>
          </div>
        )}

        {/* MODAL POPUP */}
        {isPopupModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Welcome Popup Settings</h3>
                <button onClick={() => setIsPopupModalOpen(false)} className="text-zinc-500 hover:text-white"><X /></button>
              </div>
              <div className="space-y-4">
                <label className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:bg-white/5 transition-all">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setNewPopup({...newPopup, file: e.target.files?.[0] || null})} />
                  {newPopup.file ? <CheckCircle className="text-emerald-500" /> : <UploadIcon className="text-zinc-500" />}
                  <span className="text-sm text-zinc-400">{newPopup.file ? newPopup.file.name : "Select Popup Image"}</span>
                </label>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <Type size={18} className="text-zinc-500" />
                  <input type="text" placeholder="Redirect Link" className="bg-transparent outline-none w-full text-sm" value={newPopup.link} onChange={(e) => setNewPopup({...newPopup, link: e.target.value})} />
                </div>
              </div>
              <button onClick={handleUpdatePopup} disabled={popupLoading} className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                {popupLoading ? <Loader2 className="animate-spin" /> : "Update Popup"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}