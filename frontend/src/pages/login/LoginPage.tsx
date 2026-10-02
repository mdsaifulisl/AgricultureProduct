/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from "../../features/toast/toastSlice";
import { useAppDispatch } from "../../app/hooks";
import { useAuth } from '../../features/auth/useAuth';
import { 
  Sprout, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck,
  ChevronLeft,
  X,
  KeyRound,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Custom hook destructuring
  const { 
    error,
    isLoading,
    handleLogin, 
    handleForgotPassword, 
    handleVerifyOtp, 
    handleResetPassword,
  } = useAuth();

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forget Password Modal States
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1: Send OTP, 2: Verify OTP, 3: New Password
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Modal Specific Local Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login Submit Handler
  const onLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await handleLogin({ email, password, rememberMe });
      dispatch(showToast('সফলভাবে লগইন হয়েছে!', 'success'));
      navigate('/seller');
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err : err?.message || error || 'লগইন ব্যর্থ হয়েছে';
      dispatch(showToast(errorMessage, 'error'));
    }
  };

  // Open Forgot Password Modal
  const handleOpenForgotModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotStep(1);
    setResetEmail(email);
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
    setIsForgotModalOpen(true);
  };

  // Close Forgot Password Modal & Clear States
  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
    setForgotStep(1);
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
    setIsSubmitting(false);
  };

  // Step 1: Send OTP Handler
  const onSendOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!resetEmail.trim()) {
      dispatch(showToast('অনুগ্রহ করে সঠিক ইমেইল দিন', 'error'));
      return;
    }

    setIsSubmitting(true);
    try {
      await handleForgotPassword({ email: resetEmail });
      dispatch(showToast('আপনার ইমেইলে OTP পাঠানো হয়েছে', 'info'));
      setForgotStep(2);
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err : err?.message || error || 'ওটিপি পাঠাতে ব্যর্থ হয়েছে';
      dispatch(showToast(errorMessage, 'error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP Handler
  const onVerifyOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const cleanedOtp = otpCode.trim();
    if (cleanedOtp.length < 4) {
      dispatch(showToast('সঠিক OTP কোড প্রদান করুন', 'error'));
      return;
    }

    setIsSubmitting(true);
    try {
      await handleVerifyOtp({ email: resetEmail, otp: cleanedOtp });
      dispatch(showToast('OTP সফলভাবে ভেরিফাই হয়েছে', 'success'));
      setForgotStep(3);
    } catch (err: any) {
      dispatch(showToast(err?.message || 'ভুল OTP প্রদান করা হয়েছে', 'error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Reset Password Handler
  const onResetPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (newPassword.length < 8) {
      dispatch(showToast('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে', 'error'));
      return;
    }

    if (newPassword !== confirmPassword) {
      dispatch(showToast('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না', 'error'));
      return;
    }

    setIsSubmitting(true);
    try {
      await handleResetPassword({ 
        email: resetEmail, 
        otp: otpCode.trim(), 
        newPassword 
      });
      dispatch(showToast('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!', 'success'));
      closeForgotModal();
    } catch (err: any) {
      dispatch(showToast(err?.message || 'পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি', 'error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Top Back Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 px-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Brand Logo & Header */}
        <div className="text-center px-4">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-200 group-hover:scale-105 transition-transform">
              <Sprout className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black text-gray-900 tracking-tight block leading-none">
                Reliable<span className="text-primary-600">Krishi</span>
              </span>
              <span className="text-[10px] font-bold text-primary-700 tracking-widest uppercase block mt-1">
                কৃষি ই-কমার্স
              </span>
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mt-2">
            অ্যাকাউন্টে লগইন করুন
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            স্বাগতম! আপনার ইমেইল ও পাসওয়ার্ড দিয়ে লগইন সম্পন্ন করুন।
          </p>
        </div>

        {/* Card Container */}
        <div className="mt-6 bg-white py-8 px-4 shadow-xl shadow-gray-200/50 border border-gray-100 sm:rounded-3xl sm:px-10">
          
          <form onSubmit={onLoginSubmit} className="space-y-5">
            
            {/* Input: Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                ইমেইল ঠিকানা
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition-all bg-gray-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Input: Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  পাসওয়ার্ড
                </label>
                <button
                  type="button"
                  onClick={handleOpenForgotModal}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition-all bg-gray-50/50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-gray-700 cursor-pointer select-none">
                আমাকে মনে রাখুন
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-primary-200 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    <span>লগইন করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Social Login Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400 font-medium">
                  অথবা সামাজিক মাধ্যমে
                </span>
              </div>
            </div>

            {/* Google Social Login */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => dispatch(showToast('গুগল লগইন শীঘ্রই আসছে!', 'info'))}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl shadow-2xs bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>গুগল দিয়ে প্রবেশ করুন</span>
              </button>
            </div>
          </div>

          {/* Registration Redirect Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              এখনও কোনো অ্যাকাউন্ট নেই?{' '}
              <Link 
                to="/signup" 
                className="font-bold text-primary-600 hover:text-primary-800 transition-colors"
              >
                নতুন অ্যাকাউন্ট তৈরি করুন
              </Link>
            </p>
          </div>

        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-primary-600" />
          <span>আপনার ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত</span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeForgotModal}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            
            <button
              type="button"
              onClick={closeForgotModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step 1: Request OTP */}
            {forgotStep === 1 && (
              <form onSubmit={onSendOtpSubmit} className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-3">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">পাসওয়ার্ড ভুলে গেছেন?</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    আপনার অ্যাকাউন্টের ইমেইল ঠিকানা দিন। আমরা আপনাকে একটি ওটিপি (OTP) ভেরিফিকেশন কোড পাঠাব।
                  </p>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    ইমেইল ঠিকানা
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>ওটিপি পাঠান</span>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {forgotStep === 2 && (
              <form onSubmit={onVerifyOtpSubmit} className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-3">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">ইমেইল ভেরিফিকেশন</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-semibold text-gray-700">{resetEmail}</span> ঠিকানায় পাঠানো OTP কোডটি লিখুন।
                  </p>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 text-center">
                    ওটিপি (OTP) কোড
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="block w-full text-center tracking-[0.5em] text-lg font-bold py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>কোড ভেরিফাই করুন</span>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-xs text-gray-500 hover:text-primary-600 font-semibold cursor-pointer"
                  >
                    ইমেইল সঠিক নয়? পুনরায় চেষ্টা করুন
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {forgotStep === 3 && (
              <form onSubmit={onResetPasswordSubmit} className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">নতুন পাসওয়ার্ড সেট করুন</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী নতুন পাসওয়ার্ড তৈরি করুন।
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      নতুন পাসওয়ার্ড
                    </label>
                    <div className="relative rounded-xl">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      পাসওয়ার্ড নিশ্চিত করুন
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>পাসওয়ার্ড নিশ্চিত করুন</span>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;