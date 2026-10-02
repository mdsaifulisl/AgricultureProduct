/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Layers,
  Upload,
  Loader2,
} from "lucide-react";

import { compressAndConvertToBase64 } from "../../../utils/imageUtils";
import { confirm } from "../../../features/confirm/confirmSlice";
import { useAppDispatch } from "../../../app/hooks";
import { useProduct } from "../../../features/product/useProduct";
import { useCategory } from "../../../features/category/useCategory";
import type { Category } from "../../../features/category/categoryTypes";
import { showToast } from "../../../features/toast/toastSlice";
import { useAuth } from "../../../features/auth/useAuth";

export const CategoriesList: React.FC = () => {
  const dispatch = useAppDispatch();

  // useCategory Hook integration
  const {
    categories,
    loading,
    getCategories,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategory();

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isAdminOrModerator = isAdmin || user?.role === "moderator";

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const { products } = useProduct(true);

  // পেজ লোড হলে ক্যাটাগরি ফ্রেচ করা
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Products থেকে Autocomplete এর জন্য ক্যাটাগরি সাজেশন বের করা
  const categorySuggestions = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    const names = new Set<string>();
    products.forEach((product: any) => {
      if (product?.category) {
        if (typeof product.category === "string") {
          names.add(product.category);
        } else if (
          typeof product.category === "object" &&
          product.category.name
        ) {
          names.add(product.category.name);
        }
      }
    });

    return Array.from(names);
  }, [products]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    badge: "",
  });

  // Create / Edit মোডাল ওপেন করা
  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || "",
        image: category.image || "",
        description: category.description || "",
        badge: category.badge || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        image: "",
        description: "",
        badge: "",
      });
    }
    setIsModalOpen(true);
  };

  // ইমেজ ফাইল আপলোড ও কম্প্রেস করা
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const base64Image = await compressAndConvertToBase64(file);
      setFormData((prev) => ({ ...prev, image: base64Image }));
    } catch (error) {
      console.error("Image processing failed:", error);
      alert("ছবি প্রসেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsCompressing(false);
    }
  };

  // ক্যাটাগরি ডিলিট করা
  const handleDelete = async (id: string) => {
    const isConfirmed = await dispatch(
      confirm({
        title: "ক্যাটাগরি মুছে ফেলার নিশ্চিতকরণ",
        message: "আপনি কি নিশ্চিত যে এই ক্যাটাগরিটি মুছে ফেলতে চান?",
        confirmText: "হ্যাঁ, ডিলিট করুন",
        cancelText: "বাতিল",
        type: "danger",
      }),
    );

    if (!isConfirmed) return;

    try {
      await removeCategory(id).unwrap();
    } catch (err: any) {
      alert(err || "ক্যাটাগরি ডিলিট করা সম্ভব হয়নি");
    }
  };

  // ফর্ম সাবমিশন (Create / Edit Redux dispatch)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert("অনুগ্রহ করে ক্যাটাগরির ছবি আপলোড করুন");
      return;
    }

    try {
      if (editingCategory) {
        const categoryPayload = {
          ...formData,
          id: editingCategory.id,
        };

        await editCategory(editingCategory.id, categoryPayload).unwrap();
        dispatch(showToast("ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে!", "info"));
      } else {
        await addCategory(formData).unwrap();
        dispatch(showToast("নতুন ক্যাটাগরি সংরক্ষণ করা হয়েছে!", "success"));
      }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 500);
    } catch (err: any) {
      // alert(err || 'অপারেশনটি সম্পন্ন করতে ব্যর্থ হয়েছে');
      dispatch(
        showToast(err || "অপারেশনটি সম্পন্ন করতে ব্যর্থ হয়েছে", "error"),
      );
    }
  };

  // নাম এবং বিবরণ দিয়ে ফিল্টার করা
  const filteredCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.filter(
      (cat) =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>ক্যাটাগরি ম্যানেজমেন্ট</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">সকল ক্যাটাগরি</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              আপনার শপের ক্যাটাগরি তালিকা পরিচালনা ও সম্পাদনা করুন
            </p>
          </div>

          {isAdminOrModerator && (
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ক্যাটাগরি যোগ করুন</span>
            </button>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ক্যাটাগরি খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
            />
          </div>
          <span className="text-xs font-bold text-gray-500">
            মোট ক্যাটাগরি:{" "}
            <span className="text-primary-600 font-black">
              {filteredCategories.length}
            </span>{" "}
            টি
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
                  <th className="py-4 px-6">ব্যাজ</th>
                  {isAdminOrModerator && (
                    <th className="py-4 px-6 text-right">অ্যাকশন</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan={isAdminOrModerator ? 4 : 3}
                      className="py-12 text-center text-gray-500"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                        <span>ডাটা লোড হচ্ছে...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Image & Category Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h2 className="font-bold text-gray-900">
                            {category.name}
                          </h2>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-6 text-gray-600 max-w-sm truncate">
                        {category.description || "-"}
                      </td>

                      {/* Badge */}
                      <td className="py-4 px-6">
                        {category.badge ? (
                          <span className="inline-block bg-primary-50 text-primary-700 font-bold text-xs px-2.5 py-1 rounded-md">
                            {category.badge}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      {isAdminOrModerator && (
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
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isAdminOrModerator ? 5 : 4}
                      className="py-12 text-center text-gray-500"
                    >
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
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingCategory
                    ? "ক্যাটাগরি এডিট করুন"
                    : "নতুন ক্যাটাগরি যোগ করুন"}
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
                {/* Datalist for Product Categories Autocomplete */}
                <datalist id="product-categories-suggestion">
                  {categorySuggestions.map((catName, idx) => (
                    <option key={idx} value={catName} />
                  ))}
                </datalist>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ক্যাটাগরি নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="product-categories-suggestion"
                    placeholder="যেমন: Fresh Vegetables"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ব্যাজ (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সেরা বিক্রেতা"
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData({ ...formData, badge: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Image Upload */}
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
                          onClick={() =>
                            setFormData({ ...formData, image: "" })
                          }
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
                          <div className="text-xs font-bold text-primary-600 animate-pulse flex items-center gap-1.5">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>ছবি সাইজ ছোট করা হচ্ছে...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-600 font-bold">
                              ছবি নির্বাচন করতে ক্লিক করুন
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              PNG, JPG বা WEBP (স্বয়ংক্রিয়ভাবে কম্প্রেস হবে)
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

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    বিবরণ
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ক্যাটাগরি সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
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
                    disabled={isCompressing || loading}
                    className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    <span>
                      {editingCategory ? "আপডেট করুন" : "সংরক্ষণ করুন"}
                    </span>
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
