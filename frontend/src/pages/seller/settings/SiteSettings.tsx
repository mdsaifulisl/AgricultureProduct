import React, { useState } from 'react';
import { Save, Globe, Share2, Phone, CheckCircle2, Upload, Image as ImageIcon } from 'lucide-react';

// Custom Safe Social Icons SVG Components
const FacebookIcon = () => (
  <svg className="w-4 h-4 text-blue-600 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 text-red-600 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 text-pink-600 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 text-blue-700 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TiktokIcon = () => (
  <svg className="w-4 h-4 text-gray-900 fill-current" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.3 2.56.01 1.01.55 1.96 1.38 2.51.81.56 1.9.68 2.83.33 1.01-.36 1.74-1.28 1.83-2.35.03-2.84.01-5.68.01-8.52 0-3.26.01-6.52 0-9.78z"/>
  </svg>
);

export const SiteSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteLogo: '',
    siteFavicon: '',
    siteTitle: 'কৃষি শপ - বিশ্বস্ত অর্গানিক কৃষি পণ্য ও সরঞ্জাম',
    siteDescription: 'বাংলাদেশের সেরা অনলাইন এগ্রো শপ। তাজা ফল, সবজি, বীজ, জৈব সার ও কৃষি যন্ত্রপাতি সহজে কিনুন।',
    metaKeywords: 'কৃষি, অর্গানিক খাবার, তাজা সবজি, সার, বীজ, এগ্রো শপ',
    contactPhone: '01700000000',
    contactEmail: 'info@agroshop.com',
    facebookUrl: 'https://facebook.com/yourpage',
    youtubeUrl: 'https://youtube.com/@yourchannel',
    tiktokUrl: 'https://tiktok.com/@yourprofile',
    instagramUrl: 'https://instagram.com/yourprofile',
    linkedinUrl: 'https://linkedin.com/company/yourcompany'
  });

  const [toast, setToast] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'siteLogo' | 'siteFavicon') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>সাইট সেটিংস সফলভাবে আপডেট হয়েছে!</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary-600" />
          সাইট সেটিংস, ব্র্যান্ডিং & SEO
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          ওয়েবসাইটের লোগো, ফেভিকন, টাইটেল, মেটা ডেসক্রিপশন এবং সোশ্যাল মিডিয়া প্রোফাইল লিংকসমূহ পরিচালনা করুন
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding (Logo & Favicon) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary-600" />
            ব্র্যান্ডিং ও ইমেজ (Logo & Favicon)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Site Logo */}
            <div className="p-4 border border-dashed border-gray-200 rounded-2xl space-y-3 bg-gray-50/50">
              <label className="block text-xs font-bold text-gray-800">
                সাইট লোগো (Header & Footer Logo)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  {settings.siteLogo ? (
                    <img src={settings.siteLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <label className="bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 shadow-xs transition-colors">
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span>লোগো আপলোড</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'siteLogo')}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[10px] text-gray-400">অনুমোদিত ফরম্যাট: PNG, SVG, WEBP (সুপারিশকৃত সাইজ: 300x80px)</p>
            </div>

            {/* Favicon Icon */}
            <div className="p-4 border border-dashed border-gray-200 rounded-2xl space-y-3 bg-gray-50/50">
              <label className="block text-xs font-bold text-gray-800">
                ফেভিকন (Browser Tab Icon)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  {settings.siteFavicon ? (
                    <img src={settings.siteFavicon} alt="Favicon" className="w-10 h-10 object-contain" />
                  ) : (
                    <Globe className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <label className="bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 shadow-xs transition-colors">
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span>ফেভিকন আপলোড</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'siteFavicon')}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[10px] text-gray-400">ব্রাউজার ট্যাবে প্রদর্শিত আইকন (সুপারিশকৃত সাইজ: 32x32px PNG/ICO)</p>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary-600" />
            SEO ও সার্চ ইঞ্জিন তথ্য
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              ওয়েবসাইট টাইটেল (Meta Title)
            </label>
            <input
              type="text"
              name="siteTitle"
              value={settings.siteTitle}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              মেটা ডেসক্রিপশন (Meta Description)
            </label>
            <textarea
              name="siteDescription"
              rows={3}
              value={settings.siteDescription}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              মেটা কি-ওয়ার্ডস (কমা দিয়ে আলাদা করুন)
            </label>
            <input
              type="text"
              name="metaKeywords"
              value={settings.metaKeywords}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary-600" />
            সোশ্যাল মিডিয়া পেজ লিংকসমূহ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                <FacebookIcon />
                <span>Facebook Page URL</span>
              </label>
              <input
                type="url"
                name="facebookUrl"
                value={settings.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                <YoutubeIcon />
                <span>YouTube Channel URL</span>
              </label>
              <input
                type="url"
                name="youtubeUrl"
                value={settings.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/@channel"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                <TiktokIcon />
                <span>TikTok Profile URL</span>
              </label>
              <input
                type="url"
                name="tiktokUrl"
                value={settings.tiktokUrl}
                onChange={handleChange}
                placeholder="https://tiktok.com/@yourprofile"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                <InstagramIcon />
                <span>Instagram Profile URL</span>
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={settings.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/yourprofile"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                <LinkedinIcon />
                <span>LinkedIn Company URL</span>
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={settings.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/yourcompany"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary-600" />
            যোগাযোগ তথ্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">হেল্পলাইন নম্বর</label>
              <input
                type="text"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">ইমেইল ঠিকানা</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          <span>সেটিংসে সেভ করুন</span>
        </button>
      </form>
    </div>
  );
};

export default SiteSettings;