/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Download, X, MoreVertical, Share } from 'lucide-react';

const FooterInstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [browserType, setBrowserType] = useState<'ios' | 'firefox' | 'chrome' | 'other'>('other');

  useEffect(() => {
    // ১. অ্যাপ আগে থেকেই ইনস্টলড কি না চেক
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    if (checkStandalone) {
      setIsStandalone(true);
      return;
    }

    // ২. ব্রাউজার ডিটেকশন
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setBrowserType('ios');
    } else if (/firefox/.test(ua)) {
      setBrowserType('firefox');
    } else if (/chrome|crios/.test(ua)) {
      setBrowserType('chrome');
    }

    // ৩. নেটিভ ইনস্টল ইভেন্ট ক্যাপচার
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    // যদি ব্রাউজার নেটিভ প্রম্পট রেডি রাখে
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('App installed successfully');
      }
      setDeferredPrompt(null);
    } else {
      // যদি প্রম্পট রেডি না থাকে, তবে কোনোভাবেই ফাইল ডাউনলোড হতে না দিয়ে গাইড মোডাল ওপেন হবে
      setShowGuideModal(true);
    }
  };

  if (isStandalone) return null;

  return (
    <>
      <div className="mt-2">
        <button
          onClick={handleInstallClick}
          type="button" // ব্রাউজারের ডিফল্ট ফর্ম সাবমিট বা ফাইল ডাউনলোড প্রিভেন্ট করার জন্য
          className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 border border-primary-500/30 cursor-pointer active:scale-95"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Install App</span>
        </button>
      </div>

      {/* কাস্টম গাইড মোডাল */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-sm w-full shadow-xl relative border border-gray-200 dark:border-gray-700 animate-fade-in">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Download className="w-5 h-5 text-primary-600" />
              অ্যাপ ইনস্টল নির্দেশিকা
            </h3>

            {browserType === 'firefox' ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Firefox ব্রাউজারে অ্যাপ ইনস্টল করতে:
                <br />
                ১. ব্রাউজারের <MoreVertical className="inline w-4 h-4 text-primary-600" /> <b>৩-ডট (Menu)</b> আইকনে চাপ দিন।
                <br />
                ২. <b>Install</b> অথবা <b>Add to Home Screen</b> অপশনটি বেছে নিন।
              </p>
            ) : browserType === 'ios' ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                iOS / Safari-তে অ্যাপ ইনস্টল করতে:
                <br />
                ১. নিচে দেওয়া <Share className="inline w-4 h-4 text-primary-600" /> <b>Share</b> বাটনে চাপ দিন।
                <br />
                ২. <b>Add to Home Screen</b> অপশনটি সিলেক্ট করুন।
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                অ্যান্ড্রয়েড ক্রোম ব্রাউজারে অ্যাপ ইনস্টল করতে:
                <br />
                ১. ওপরের ডানপাশের <MoreVertical className="inline w-4 h-4 text-primary-600" /> <b>৩-ডট মেনু</b> তে ক্লিক করুন।
                <br />
                ২. <b>Install app</b> বা <b>Add to Home screen</b> অপশনটিতে ক্লিক করুন।
              </p>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full bg-primary-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterInstallPWA;