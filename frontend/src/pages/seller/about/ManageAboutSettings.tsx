/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Upload, Loader2, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import { compressAndConvertToBase64 } from '../../../utils/imageUtils';
import { showToast } from '../../../features/toast/toastSlice';
import { useAppDispatch } from '../../../app/hooks';
import { useAbout } from '../../../features/about/useAbout';
import { useAuth } from '../../../features/auth/useAuth';

export const ManageAboutSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { aboutData, getAboutData, handleUpdateAbout, isLoading } = useAbout();

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [formData, setFormData] = useState({
    imageUrl: '',
    badgeTitle: 'সেরা কৃষি ই-কমার্স',
    badgeSubtitle: 'গ্রাহক সন্তুষ্টি ও নির্ভরযোগ্যতায়',
    tagline: 'আমাদের মূল লক্ষ্য',
    title: 'আমরা কীভাবে বাজারে একটি ইতিবাচক পরিবর্তন আনছি?',
    description: 'প্রচলিত বাজার ব্যবস্থায় কৃষকরা কঠোর পরিশ্রম করেও উপযুক্ত মূল্য পান না...',
    features: [
      'কৃষক থেকে সরাসরি সংগৃহীত তাজা ফল, সবজি ও বীজ',
      'মধ্যস্বত্বভোগী মুক্ত স্বচ্ছ মূল্য নির্ধারণ ব্যবস্থা',
    ],
    buttonText: 'পণ্যসমূহ দেখুন',
    buttonLink: '/shop',
  });

  const [uploading, setUploading] = useState(false);

  // ইনিশিয়াল ডাটা ফেচ করা (কেবল অ্যাডমিন হলেই ফেচ করবে)
  useEffect(() => {
    if (isAdmin) {
      getAboutData();
    }
  }, [getAboutData, isAdmin]);

  // Redux Store থেকে ডাটা পেলে ফর্মে সেট করা
  useEffect(() => {
    if (aboutData) {
      setFormData({
        imageUrl: aboutData.imageUrl || '',
        badgeTitle: aboutData.badgeTitle || '',
        badgeSubtitle: aboutData.badgeSubtitle || '',
        tagline: aboutData.tagline || '',
        title: aboutData.title || '',
        description: aboutData.description || '',
        features: aboutData.features?.length ? aboutData.features : [''],
        buttonText: aboutData.buttonText || '',
        buttonLink: aboutData.buttonLink || '',
      });
    }
  }, [aboutData]);

  // ইউজার অ্যাডমিন না হলে Access Denied মেসেজ দেখানো হবে
  if (!isAdmin) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-xl mx-auto text-center my-10">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          অনুমতি নেই (Access Denied)
        </h3>
        <p className="text-sm text-gray-500">
          এই সেটিংসটি পরিবর্তন করার অনুমতি কেবল সিস্টেম অ্যাডমিনের রয়েছে।
        </p>
      </div>
    );
  }

  // ফাইল হ্যান্ডলার এবং Base64 কনভার্সন
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const base64Image = await compressAndConvertToBase64(file);
      setFormData((prev) => ({ ...prev, imageUrl: base64Image }));
      dispatch(showToast('ছবি প্রসেসিং সম্পন্ন হয়েছে', 'info'));
    } catch (error) {
      console.error('Image compression failed:', error);
      dispatch(showToast('ছবি প্রসেস করতে সমস্যা হয়েছে!', 'error'));
    } finally {
      setUploading(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    if (formData.features.length <= 1) {
      dispatch(showToast('কমপক্ষে একটি ফিচার পয়েন্ট থাকতে হবে', 'info'));
      return;
    }
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      dispatch(showToast('আপনার এই পরিবর্তন করার অধিকার নেই!', 'error'));
      return;
    }

    // খালি ফিচার ফিল্টার করা
    const cleanedFeatures = formData.features.filter((f) => f.trim() !== '');

    if (cleanedFeatures.length === 0) {
      dispatch(showToast('কমপক্ষে একটি ফিচার পয়েন্ট লিখুন', 'error'));
      return;
    }

    try {
      await handleUpdateAbout({
        ...formData,
        features: cleanedFeatures,
      });
      dispatch(showToast('About সেটিংস সফলভাবে আপডেট হয়েছে', 'success'));
    } catch (error: any) {
      dispatch(
        showToast(error || 'সেটিংস আপডেট করতে ব্যর্থ হয়েছে!', 'error')
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-4xl">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        About Section সেটিংস আপডেট করুন
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            ছবি আপলোড করুন
          </label>
          <div className="flex items-start gap-4">
            {/* Image Preview Box */}
            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 relative">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="About Section Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400 p-2">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[10px] block">কোনো ছবি নেই</span>
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white backdrop-blur-[1px]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
            </div>

            {/* Upload Button Input */}
            <div className="flex-1 space-y-2">
              <label className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer border border-primary-200">
                <Upload className="w-4 h-4" />
                <span>
                  {uploading ? 'প্রসেসিং হচ্ছে...' : 'নতুন ছবি পছন্দ করুন'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400">
                পরামর্শ: ৪:৩ অনুপাতের স্পষ্ট ছবি ব্যবহার করুন। আপলোড করার পর ইমেজটি অটোমেটিক কম্প্রেস হবে।
              </p>
            </div>
          </div>
        </div>

        {/* Badge Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              ব্যাজ টাইটেল
            </label>
            <input
              type="text"
              value={formData.badgeTitle}
              onChange={(e) =>
                setFormData({ ...formData, badgeTitle: e.target.value })
              }
              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              ব্যাজ সাবটাইটেল
            </label>
            <input
              type="text"
              value={formData.badgeSubtitle}
              onChange={(e) =>
                setFormData({ ...formData, badgeSubtitle: e.target.value })
              }
              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Tagline Input */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            ট্যাগলাইন (Tagline)
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) =>
              setFormData({ ...formData, tagline: e.target.value })
            }
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Main Title Input */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            মেন টাইটেল (Title)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            বিবরণ (Description)
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Dynamic Features List Inputs */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            ফিচার পয়েন্টসমূহ
          </label>
          <div className="space-y-2">
            {formData.features.map((feature, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  className="flex-1 border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  placeholder={`পয়েন্ট #${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="text-red-500 p-2.5 hover:bg-red-50 rounded-xl transition cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-1.5 text-xs font-bold text-primary-600 mt-3 hover:text-primary-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> নতুন পয়েন্ট যোগ করুন
          </button>
        </div>

        {/* Button Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              বাটন টেক্সট
            </label>
            <input
              type="text"
              value={formData.buttonText}
              onChange={(e) =>
                setFormData({ ...formData, buttonText: e.target.value })
              }
              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              বাটন লিংক
            </label>
            <input
              type="text"
              value={formData.buttonLink}
              onChange={(e) =>
                setFormData({ ...formData, buttonLink: e.target.value })
              }
              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={uploading || isLoading}
            className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700 transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>সেভ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>সেটিংস সেভ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};