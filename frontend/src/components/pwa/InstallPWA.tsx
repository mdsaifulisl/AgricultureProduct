/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // ব্রাউজারের ডিফল্ট প্রম্পট বন্ধ রাখা
      e.preventDefault();
      // ইভেন্টটি স্টেট-এ সেভ করে রাখা
      setDeferredPrompt(e);
      // বাটন দেখানোর অনুমতি দেওয়া
      setIsInstallable(true); 
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // ইনস্টল পপআপ প্রদর্শন করা
    deferredPrompt.prompt();

    // ইউজার অ্যাকসেপ্ট করলো নাকি ক্যানসেল করলো তা চেক করা
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User installed the PWA');
    }

    // স্টেট ক্লিয়ার করা
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // প্রজেক্ট অলরেডি ইনস্টলড থাকলে বা ব্রাউজার রেডি না থাকলে বাটন হাইড থাকবে
  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center gap-2 transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Install App
    </button>
  );
};

export default InstallPWA;



