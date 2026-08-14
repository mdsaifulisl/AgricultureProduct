import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Phone, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock Login Action (এখানে আপনার API call হবে)
    setTimeout(() => {
      setIsLoading(false);
      navigate('/'); // হোম পেজে রিডাইরেক্ট
    }, 1200);
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
            স্বাগতম! আপনার অ্যাকাউন্ট তথ্য দিয়ে লগইন সম্পন্ন করুন।
          </p>
        </div>

        {/* Card Container */}
        <div className="mt-6 bg-white py-8 px-4 shadow-xl shadow-gray-200/50 border border-gray-100 sm:rounded-3xl sm:px-10">
          
          {/* Login Method Toggle Tab */}
          <div className="flex rounded-xl bg-gray-100/80 p-1 mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2.5 rounded-lg transition-all text-center cursor-pointer ${
                loginMethod === 'password'
                  ? 'bg-white text-primary-800 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              ইমেইল / পাসওয়ার্ড
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-2.5 rounded-lg transition-all text-center cursor-pointer ${
                loginMethod === 'otp'
                  ? 'bg-white text-primary-800 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              মোবাইল ওটিপি (OTP)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input: Email or Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {loginMethod === 'password' ? 'ইমেইল বা মোবাইল নম্বর' : 'মোবাইল নম্বর'}
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  {loginMethod === 'password' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </div>
                <input
                  type={loginMethod === 'password' ? 'text' : 'tel'}
                  required
                  placeholder={
                    loginMethod === 'password' 
                      ? 'উদাহরণ: 01700000000 বা user@example.com' 
                      : 'উদাহরণ: 01700000000'
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition-all bg-gray-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Input: Password (Only for password method) */}
            {loginMethod === 'password' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    পাসওয়ার্ড
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </Link>
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
            )}

            {/* Remember Me Checkbox */}
            {loginMethod === 'password' && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-gray-700 cursor-pointer">
                  আমাকে মনে রাখুন
                </label>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-primary-200 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{loginMethod === 'password' ? 'লগইন করুন' : 'ওটিপি পাঠোন (Send OTP)'}</span>
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
                onClick={() => alert('গুগল লগইন শীঘ্রই আসছে!')}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl shadow-2xs bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>গুগল দিয়ে প্রবেশ করুন</span>
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
    </div>
  );
};

export default LoginPage;