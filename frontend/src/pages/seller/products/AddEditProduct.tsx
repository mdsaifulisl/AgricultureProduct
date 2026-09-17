import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Loader2
} from 'lucide-react';
import type { Product } from '../../../types/index';
import { compressAndConvertToBase64 } from '../../../utils/imageUtils';
import { useProduct } from "../../../features/product/useProduct";
import { useAppDispatch } from '../../../app/hooks';
import { showToast } from '../../../features/toast/toastSlice';

export const AddEditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEditMode = Boolean(id);

  // useProduct থেকে প্রয়োজনীয় ডাটা ও অ্যাকশন হ্যান্ডলার আনা হলো
const { 
  products, 
  createNewProduct, 
  editProduct,
  isLoading 
} = useProduct(isEditMode); // <--- এখানে isEditMode দিন

  // Extract all unique categories dynamically from products array
  const availableCategories = useMemo(() => {
    if (!products) return [];
    const categories = products.map((p) => p.category);
    return Array.from(new Set(categories)).filter(Boolean);
  }, [products]);

  // Form Initial State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    categorySlug: 'vegetables',
    price: 0,
    originalPrice: undefined,
    unit: '',
    images: [],
    description: '',
    shortDescription: '',
    metaDescription: '',
    badge: '',
    inStock: true,
    stockCount: 0,
    sku: '',
    isFeatured: false,
    specifications: [{ key: '', value: '' }],
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing product data if in Edit Mode
 useEffect(() => {
  if (isEditMode && id && products && products.length > 0) {
    const existingProduct = products.find((p) => p.id === id);
    if (existingProduct) {
      // queueMicrotask ব্যবহার করলে synchronous render loop ব্রেক হয়
      queueMicrotask(() => {
        setFormData({
          ...existingProduct,
          metaDescription: existingProduct.metaDescription || ''
        });
      });
    } else {
      alert('পণ্যটি পাওয়া যায়নি!');
      navigate('/seller/products');
    }
  }
}, [id, isEditMode, navigate, products]);

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value === '' ? undefined : Number(value) 
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Category change with slug sync & custom typing
  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const category = e.target.value;
    const slug = category
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]+/g, '');

    setFormData((prev) => ({
      ...prev,
      category,
      categorySlug: slug || 'other'
    }));
  };

  // Specification Handlers
  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedSpecs = [...(formData.specifications || [])];
    updatedSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: updatedSpecs }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...(formData.specifications || []), { key: '', value: '' }]
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, i) => i !== index)
    }));
  };

  // Device File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);

    try {
      const base64Images = await Promise.all(
        fileList.map((file) => compressAndConvertToBase64(file))
      );

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...base64Images]
      }));
    } catch (error) {
      console.error('Image processing error:', error);
    }

    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  // Tag Handlers
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove)
    }));
  };

  // Form Submission with createNewProduct & editProduct
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanedSpecs = (formData.specifications || []).filter(
      (spec) => spec.key.trim() !== '' && spec.value.trim() !== ''
    );

    const payload: Partial<Product> = {
      ...formData,
      rating: formData.rating || 5.0,
      reviewsCount: formData.reviewsCount || 0,
      specifications: cleanedSpecs,
      inStock: (formData.stockCount || 0) > 0
    };

    try {
      if (isEditMode && id) {
        // Edit Existing Product
        await editProduct(id, payload);
        dispatch(showToast('পণ্য সফলভাবে আপডেট করা হয়েছে!', 'info'));
      } else {
        // Create New Product
        await createNewProduct(payload as Omit<Product, 'id'>);
        dispatch(showToast('নতুন পণ্য সংরক্ষণ করা হয়েছে!', 'success'));
      }

      setTimeout(() => {
        navigate('/seller/products');
      }, 1200);
    } catch (err) {
      console.error('Submit error:', err);
      alert('পণ্য সংরক্ষণ করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
    
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/seller/products"
            className="p-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যোগ করুন'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditMode ? `SKU: ${formData.sku || 'N/A'}` : 'পণ্যের যাবতীয় তথ্য সঠিকভাবে পূরণ করুন'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Main Section (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
              মৌলিক তথ্য
            </h2>

            {/* Product Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                পণ্যের নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="যেমন: তাজা প্রিমিয়াম লাল টমেটো"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-xs sm:text-sm"
              />
            </div>

            {/* Short & Meta Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                সংক্ষিপ্ত বিবরণ (Short Description)
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription || ''}
                onChange={handleChange}
                placeholder="এক লাইনে সংক্ষেপে লিখুন..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                SEO মেটা ডেসক্রিপশন (Meta Description)
              </label>
              <textarea
                name="metaDescription"
                rows={2}
                value={formData.metaDescription || ''}
                onChange={handleChange}
                placeholder="গুগল সার্চ ও সোশ্যাল মিডিয়া শেয়ারিংয়ের জন্য সংক্ষিপ্ত বিবরণ (১৫০-১৬০ অক্ষরের মধ্যে)..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-xs sm:text-sm resize-y"
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                বিস্তারিত বিবরণ (Full Description)
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="পণ্যের বিস্তারিত বিবরণ এখানে লিখুন..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-xs sm:text-sm resize-y"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
              পণ্যের ছবি আপলোড
            </h2>

            <label className="border-2 border-dashed border-gray-200 hover:border-primary-500 bg-gray-50/50 hover:bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
              <div className="p-3 bg-white group-hover:bg-primary-50 rounded-full border border-gray-200 group-hover:border-primary-200 transition-colors">
                <Upload className="w-6 h-6 text-gray-500 group-hover:text-primary-600" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700 group-hover:text-primary-600">
                  ডিভাইস থেকে ফাইল নির্বাচন করুন
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  PNG, JPG, WEBP (একাধিক ছবি একসাথে বেছে নিতে পারবেন)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Image Preview List */}
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {formData.images.map((imgUrl, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                    <img src={imgUrl} alt={`Product ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-800">
                স্পেসিফিকেশন (Specifications)
              </h2>
              <button
                type="button"
                onClick={addSpecification}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন স্পেক যোগ করুন</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.specifications?.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="কী (যেমন: উৎস)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-primary-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="ভ্যালু (যেমন: রাজশাহী)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-primary-500 outline-none"
                  />
                  {formData.specifications!.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right / Sidebar Section (1 Col) */}
        <div className="space-y-6">
          {/* Pricing & Stock */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
              মূল্য ও স্টক
            </h2>

            {/* Price & Original Price */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                বিক্রয় মূল্য (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                min={0}
                value={formData.price ?? ''}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-xs sm:text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                পূর্বের মূল্য (অরিজিনাল প্রাইস)
              </label>
              <input
                type="number"
                name="originalPrice"
                min={0}
                value={formData.originalPrice ?? ''}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-xs sm:text-sm"
              />
            </div>

            {/* Unit & Stock Count */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  একক (Unit) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="unit"
                  required
                  list="unit-options"
                  value={formData.unit || ''}
                  onChange={handleChange}
                  placeholder="কেজি / টি / প্যাকেট"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
                />
                <datalist id="unit-options">
                  <option value="কেজি" />
                  <option value="গ্রাম" />
                  <option value="টি" />
                  <option value="লিটার" />
                  <option value="মি.লি." />
                  <option value="প্যাকেট" />
                  <option value="বোতল" />
                  <option value="ডজন" />
                  <option value="বস্তা" />
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  স্টক পরিমাণ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stockCount"
                  required
                  min={0}
                  value={formData.stockCount ?? ''}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs font-bold"
                />
              </div>
            </div>

            {/* SKU (Optional) */}
            <div className="hidden">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                SKU কোড <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku || ''}
                onChange={handleChange}
                placeholder="যেমন: VEG-TOM-01"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs font-mono uppercase"
              />
            </div>
          </div>

          {/* Organization / Category */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3">
              ক্যাটাগরি ও ব্যাজ
            </h2>

            {/* Dynamic Typeable Category Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                ক্যাটাগরি <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                required
                list="category-options"
                value={formData.category || ''}
                onChange={handleCategoryInputChange}
                placeholder="ক্যাটাগরি লিখুন বা নির্বাচন করুন..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-xs sm:text-sm bg-white"
              />
              <datalist id="category-options">
                {availableCategories.map((cat, index) => (
                  <option key={index} value={cat} />
                ))}
              </datalist>
            </div>

            {/* Badge */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                ব্যাজ (Badge)
              </label>
              <input
                type="text"
                name="badge"
                value={formData.badge || ''}
                onChange={handleChange}
                placeholder="যেমন: ২৫% ছাড় / সেরা মান"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                ট্যাগ (Enter চাপুন)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="ট্যাগ লিখে Enter চাপুন..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-xs font-bold text-gray-800">
                  হোমপেজে ফিচার্ড পণ্য হিসেবে প্রদর্শন করুন
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting || isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {isSubmitting || isLoading
                ? 'সংরক্ষণ করা হচ্ছে...' 
                : isEditMode 
                  ? 'পণ্য আপডেট করুন' 
                  : 'পণ্য প্রকাশ করুন'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;