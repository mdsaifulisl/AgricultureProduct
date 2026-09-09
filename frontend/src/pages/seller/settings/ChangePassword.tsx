import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('সবগুলো ফিল্ড সঠিকভাবে পূরণ করুন');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না');
      return;
    }

    setLoading(true);

    // Simulated API call delay
    setTimeout(() => {
      setLoading(false);
      setToast('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });

      setTimeout(() => setToast(''), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-primary-600" />
          পাসওয়ার্ড পরিবর্তন করুন
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে নিয়মিত শক্তিশালী পাসওয়ার্ড ব্যবহার করুন
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              বর্তমান পাসওয়ার্ড (Current Password)
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <hr className="border-gray-100 my-2" />

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              নতুন পাসওয়ার্ড (New Password)
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="নতুন শক্তিশালী পাসওয়ার্ড দিন"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="নতুন পাসওয়ার্ডটি পুনরায় লিখুন"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Tip Box */}
          <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-blue-800 leading-relaxed">
              <strong>পাসওয়ার্ড সুরক্ষা টিপস:</strong> পাসওয়ার্ডে সংখ্যা, বড় ও ছোট হাতের অক্ষর এবং সিম্বল (@, #, $) সংমিশ্রণ ব্যবহার করার চেষ্টা করুন।
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'আপডেট হচ্ছে...' : 'পাসওয়ার্ড আপডেট করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;