import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Layers,
  Eye,
  EyeOff,
  Upload
} from 'lucide-react';

import catagoriesData from '../../../data/categoriesData.json';
import { type Category } from '../../../types/category';
import { compressAndConvertToBase64 } from '../../../utils/imageUtils';

export const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(catagoriesData as Category[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    bnName: '',
    name: '',
    icon: '📦',
    image: '', // Base64 or backend URL
    description: '',
    badge: ''
  });

  // Open modal for Create/Edit
  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        bnName: category.bnName,
        name: category.name,
        icon: category.icon,
        image: category.image, // URL from backend
        description: category.description,
        badge: category.badge || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        bnName: '',
        name: '',
        icon: '📦',
        image: '',
        description: '',
        badge: ''
      });
    }
    setIsModalOpen(true);
  };

  // Image File Upload and Compression
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

  // Delete Category
  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ক্যাটাগরি মুছে ফেলতে চান?')) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = (id: string) => {
    setCategories(
      categories.map((cat) => {
        if (cat.id === id) {
          return {
            ...cat,
            status: cat.status === 'inactive' ? 'active' : 'inactive'
          };
        }
        return cat;
      })
    );
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('অনুগ্রহ করে ক্যাটাগরির ছবি আপলোড করুন');
      return;
    }

    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, '-') }
            : cat
        )
      );
    } else {
      const newCat: Category = {
          id: Date.now().toString(),
          ...formData,
          itemCount: 0,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          status: 'active',
          bgGradient: ''
      };
      setCategories([newCat, ...categories]);
    }
    setIsModalOpen(false);
  };

  // Search Filter
  const filteredCategories = categories.filter(
    (cat) =>
      cat.bnName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>ক্যাটাগরি ম্যানেজমেন্ট</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">সকল ক্যাটাগরি</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              আপনার শপের ক্যাটাগরি তৈরি, পরিবর্তন ও কন্ট্রোল করুন
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ক্যাটাগরি যোগ করুন</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ক্যাটাগরি সার্চ করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
            />
          </div>
          <span className="text-xs font-bold text-gray-500">
            মোট ক্যাটাগরি: <span className="text-primary-600 font-black">{filteredCategories.length}</span> টি
          </span>
        </div>

        {/* Categories Table View */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                  <th className="py-4 px-6">ক্যাটাগরি</th>
                  <th className="py-4 px-6">বিবরণ</th>
                  <th className="py-4 px-6">পণ্য সংখ্যা</th>
                  <th className="py-4 px-6">ব্যাজ</th>
                  <th className="py-4 px-6">স্ট্যাটাস</th>
                  <th className="py-4 px-6 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Image & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <img 
                              src={category.image} 
                              alt={category.bnName} 
                              className="w-full h-full object-cover" 
                            />
                            <span className="absolute bottom-0 right-0 bg-white/90 text-xs px-1 rounded-tl">
                              {category.icon}
                            </span>
                          </div>
                          <div>
                            <h2 className="font-bold text-gray-900">{category.bnName}</h2>
                            <p className="text-xs text-gray-400 font-mono">{category.name}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                        {category.description}
                      </td>

                      <td className="py-4 px-6 font-bold text-gray-700">
                        {category.itemCount} টি
                      </td>

                      <td className="py-4 px-6">
                        {category.badge ? (
                          <span className="inline-block bg-primary-50 text-primary-700 font-bold text-xs px-2.5 py-1 rounded-md">
                            {category.badge}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(category.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                            category.status !== 'inactive'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {category.status !== 'inactive' ? (
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

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(category)}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
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
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      কোনো ক্যাটাগরি পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingCategory ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি যোগ করুন'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      বাংলা নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: তাজা সবজি"
                      value={formData.bnName}
                      onChange={(e) => setFormData({ ...formData, bnName: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ইংরেজি নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fresh Vegetables"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      আইকন/ইমোজি
                    </label>
                    <input
                      type="text"
                      placeholder="🥬"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm text-center focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ব্যাজ (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: সেরা বিক্রেতা"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* File Upload Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ক্যাটাগরি ছবি <span className="text-red-500">*</span>
                  </label>
                  
                  {formData.image ? (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                      <img 
                        src={formData.image} 
                        alt="Category Preview" 
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
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 hover:border-primary-500 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-primary-50/20 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isCompressing ? (
                          <div className="text-xs font-bold text-primary-600 animate-pulse">
                            ছবি সাইজ ছোট করা হচ্ছে...
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-600 font-bold">
                              ছবি নির্বাচন করতে ক্লিক করুন
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

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    বিবরণ
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ক্যাটাগরি সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 resize-none"
                  />
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
                    {editingCategory ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
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