import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Phone, 
  Mail,  
} from 'lucide-react';
import { useSiteSettings } from '../../features/siteSettings/useSiteSettings';

export const Footer: React.FC = () => {
  const { settings, fetchSettings } = useSiteSettings();

  useEffect(() => {
    if (fetchSettings) {
      fetchSettings();
    }
  }, [fetchSettings]);

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* প্রধান ফুটার কনটেন্ট */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          
          {/* ব্র্যান্ড ইনফো */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-xl text-white">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Expert<span className="text-primary-500">Shop</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {settings ? settings?.siteDescription : 'কৃষক ও ভোক্তার মাঝে আস্থার নিরাপদ সেতু'}
            </p>
            
            <div className="space-y-2 pt-2 text-sm">
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                <span>+88 {settings ? settings?.contactPhone : '1234567890'}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <span>{settings ? settings.contactEmail : 'Hs9oq@example.com'}</span> 
              </div>
            </div>
          </div>

          {/* কুইক লিঙ্কস */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">কুইক লিঙ্ক</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop" className="hover:text-primary-500 transition-colors">সকল পণ্য</Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-primary-500 transition-colors">অফারসমূহ</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary-500 transition-colors">ব্লগ</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-500 transition-colors">আমাদের সম্পর্কে</Link>
              </li>
            </ul>
          </div>

          {/* জনপ্রিয় ক্যাটাগরি */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">ক্যাটাগরি</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=তাজা সবজি" className="hover:text-primary-500 transition-colors">তাজা সবজি</Link>
              </li>
              <li>
                <Link to="/shop?category=ফলমূল" className="hover:text-primary-500 transition-colors">ফলমূল</Link>
              </li>
              <li>
                <Link to="/shop?category=মাংস ও মাছ" className="hover:text-primary-500 transition-colors">মাংস ও মাছ</Link>
              </li>
              <li>
                <Link to="/shop?category=মশলা ও তেল" className="hover:text-primary-500 transition-colors">মশলা ও তেল</Link>
              </li>
            </ul>
          </div>

          {/* পলিসি ও সোশ্যাল মিডিয়া */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">সহায়তা ও নীতি</h3>
            <ul className="space-y-2.5 text-sm mb-6">
              <li>
                <Link to="/terms" className="hover:text-primary-500 transition-colors">শর্তাবলী</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-500 transition-colors">প্রাইভেসি পলিসি</Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-primary-500 transition-colors">রিটার্ন ও রিফান্ড পলিসি</Link>
              </li>
            </ul>

            <h4 className="text-white font-semibold text-sm mb-3">আমাদের সাথে যুক্ত থাকুন</h4>
            <div className="flex flex-wrap gap-2.5">
              {/* Facebook Icon */}
              <a 
                href={settings?.facebookUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-lg transition-colors" 
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram Icon */}
              <a 
                href={settings?.instagramUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-lg transition-colors" 
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* TikTok Icon */}
              <a 
                href={settings?.tiktokUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-lg transition-colors" 
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.3 2.55.01.98.54 1.92 1.38 2.43.83.52 1.91.58 2.8.19.89-.38 1.55-1.22 1.75-2.16.12-.66.07-1.35.07-2.03V.02z"/>
                </svg>
              </a>

              {/* LinkedIn Icon */}
              <a 
                href={settings?.linkedinUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-lg transition-colors" 
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* YouTube Icon */}
              <a 
                href={settings?.youtubeUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-lg transition-colors" 
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* কপিরাইট সেকশন */}
        <div className="pt-6 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} ExpertShop. সর্বস্বত্ব সংরক্ষিত।</p>
          <p>Cash on Delivery Available Across Bangladesh</p>
        </div>

      </div>
    </footer>
  );
};