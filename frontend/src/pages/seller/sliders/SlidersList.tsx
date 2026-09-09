import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Sliders, 
  Eye, 
  EyeOff, 
  Upload, 
  ExternalLink 
} from 'lucide-react';

import heroSlidesData from '../../../data/heroSlidesData.json';
import { type Slide } from '../../../types/index';
import { compressAndConvertToBase64 } from '../../../utils/imageUtils';

export const SlidersList: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(heroSlidesData as Slide[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    badge: '',
    title: '',
    highlightText: '',
    description: '',
    primaryBtnText: '',
    primaryBtnLink: '',
    secondaryBtnText: '',
    secondaryBtnLink: '',
    image: '', // Base64 or backend URL
    imageAlt: '',
    tag: ''
  });

  // Open Modal for Create / Edit
  const handleOpenModal = (slide?: Slide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        badge: slide.badge || '',
        title: slide.title,
        highlightText: slide.highlightText || '',
        description: slide.description || '',
        primaryBtnText: slide.primaryBtnText || '',
        primaryBtnLink: slide.primaryBtnLink || '',
        secondaryBtnText: slide.secondaryBtnText || '',
        secondaryBtnLink: slide.secondaryBtnLink || '',
        image: slide.image,
        imageAlt: slide.imageAlt || '',
        tag: slide.tag || ''
      });
    } else {
      setEditingSlide(null);
      setFormData({
        badge: '',
        title: '',
        highlightText: '',
        description: '',
        primaryBtnText: 'পণ্যসমূহ দেখুন',
        primaryBtnLink: '/shop',
        secondaryBtnText: 'আজকের অফার',
        secondaryBtnLink: '/offers',
        image: '',
        imageAlt: '',
        tag: ''
      });
    }
    setIsModalOpen(true);
  };

  // Image Upload and Compression Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const base64Image = await compressAndConvertToBase64(file);
      setFormData((prev) => ({ ...prev, image: base64Image }));
    } catch (error) {
      console.error('Image processing failed:', error);
      alert('ছবি প্রসেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsCompressing(false);
    }
  };

  // Delete Slide
  const handleDelete = (id: string | number) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই স্লাইডারটি মুছে ফেলতে চান?')) {
      setSlides(slides.filter((slide) => slide.id !== id));
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = (id: string | number) => {
    setSlides(
      slides.map((slide) => {
        if (slide.id === id) {
          return {
            ...slide,
            status: slide.status === 'inactive' ? 'active' : 'inactive'
          };
        }
        return slide;
      })
    );
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('অনুগ্রহ করে স্লাইডারের ব্যানার ছবি আপলোড করুন');
      return;
    }

    if (editingSlide) {
      setSlides(
        slides.map((slide) =>
          slide.id === editingSlide.id
            ? { ...slide, ...formData }
            : slide
        )
      );
    } else {
      const newSlide: Slide = {
        id: Date.now(),
        ...formData,
        status: 'active'
      };
      setSlides([newSlide, ...slides]);
    }
    setIsModalOpen(false);
  };

  // Search Filter
  const filteredSlides = slides.filter(
    (slide) =>
      slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (slide.tag && slide.tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (slide.badge && slide.badge.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>স্লাইডার ম্যানেজমেন্ট</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">হোমপেজ স্লাইডারসমূহ</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              ওয়েবসাইটের প্রধান স্লাইডার ব্যানার, অফার ও বাটনসমূহ ম্যানেজ করুন
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন স্লাইডার যোগ করুন</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="স্লাইডার শিরোনাম বা ট্যাগ সার্চ করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
            />
          </div>
          <span className="text-xs font-bold text-gray-500">
            মোট স্লাইডার: <span className="text-primary-600 font-black">{filteredSlides.length}</span> টি
          </span>
        </div>

        {/* Sliders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                  <th className="py-4 px-6">ব্যানার ও টাইটেল</th>
                  <th className="py-4 px-6">ট্যাগ / ব্যাজ</th>
                  <th className="py-4 px-6">বাটন ও লিংক</th>
                  <th className="py-4 px-6">স্ট্যাটাস</th>
                  <th className="py-4 px-6 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredSlides.length > 0 ? (
                  filteredSlides.map((slide) => (
                    <tr key={slide.id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Image & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <img 
                              src={slide.image} 
                              alt={slide.imageAlt || slide.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="max-w-xs">
                            <h2 className="font-bold text-gray-900 leading-snug line-clamp-1">
                              {slide.title} <span className="text-primary-600">{slide.highlightText}</span>
                            </h2>
                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                              {slide.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tag / Badge */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {slide.tag && (
                            <span className="inline-block bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-0.5 rounded-md">
                              {slide.tag}
                            </span>
                          )}
                          {slide.badge && (
                            <p className="text-xs text-gray-500 truncate">{slide.badge}</p>
                          )}
                        </div>
                      </td>

                      {/* Buttons */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {slide.primaryBtnText && (
                            <div className="flex items-center gap-1 text-xs text-gray-700 font-medium">
                              <span className="font-bold text-primary-600">{slide.primaryBtnText}</span>
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-400">({slide.primaryBtnLink})</span>
                            </div>
                          )}
                          {slide.secondaryBtnText && (
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <span>{slide.secondaryBtnText}</span>
                              <span className="text-gray-400">({slide.secondaryBtnLink})</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(slide.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                            slide.status !== 'inactive'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {slide.status !== 'inactive' ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>সক্রিয়</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>নিষ্ক্রিয়</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(slide)}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(slide.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      কোনো স্লাইডার পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white w-full max-w-2xl my-8 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingSlide ? 'স্লাইডার এডিট করুন' : 'নতুন স্লাইডার যোগ করুন'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                
                {/* Title & Highlight */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      মূল শিরোনাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ক্ষেতের তাজা সবজি ও ফলমূল সরাসরি"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      হাইলাইটেড টেক্সট
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: আপনার দরজায়"
                      value={formData.highlightText}
                      onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Badge & Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ট্যাগ (ছোট টাইটেল)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: দৈনিক তাজা বাজার"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ব্যাজ টেক্সট
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ১০০% প্রাকৃতিকভাবে উৎপাদিত"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    সংক্ষিপ্ত বিবরণ
                  </label>
                  <textarea
                    rows={2}
                    placeholder="স্লাইডারের বিস্তারিত বর্ণনা..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>

                {/* Buttons Config */}
                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">বাটন কনফিগারেশন</h4>
                  
                  {/* Primary Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        প্রধান বাটন টেক্সট
                      </label>
                      <input
                        type="text"
                        placeholder="পণ্যসমূহ দেখুন"
                        value={formData.primaryBtnText}
                        onChange={(e) => setFormData({ ...formData, primaryBtnText: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        প্রধান বাটন লিংক
                      </label>
                      <input
                        type="text"
                        placeholder="/shop"
                        value={formData.primaryBtnLink}
                        onChange={(e) => setFormData({ ...formData, primaryBtnLink: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* Secondary Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        সেকেন্ডারি বাটন টেক্সট
                      </label>
                      <input
                        type="text"
                        placeholder="আজকের অফার"
                        value={formData.secondaryBtnText}
                        onChange={(e) => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        সেকেন্ডারি বাটন লিংক
                      </label>
                      <input
                        type="text"
                        placeholder="/offers"
                        value={formData.secondaryBtnLink}
                        onChange={(e) => setFormData({ ...formData, secondaryBtnLink: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ব্যানার ছবি <span className="text-red-500">*</span>
                  </label>
                  
                  {formData.image ? (
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                      <img 
                        src={formData.image} 
                        alt="Slide Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <Upload className="w-4 h-4 text-gray-700" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 hover:border-primary-500 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-primary-50/20 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isCompressing ? (
                          <div className="text-xs font-bold text-primary-600 animate-pulse">
                            ছবি সাইজ ছোট করা হচ্ছে...
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-600 font-bold">
                              স্লাইডার ব্যানার সিলেক্ট করুন
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              PNG, JPG বা WEBP (স্বয়ংক্রিয়ভাবে কম্প্রেস হবে)
                            </p>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        disabled={isCompressing}
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isCompressing}
                    className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {editingSlide ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};