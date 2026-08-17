import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Phone, 
  Mail, 
  MapPin, 
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* সার্ভিস হাইলাইটস / ফিচার সেকশন */}
        

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
              আমরা আপনাকে দিচ্ছি তাজা ও সেরা মানের পণ্যের নিশ্চয়তা। সহজে ও নিরাপদে কেনাকাটা করুন আমাদের সাথে।
            </p>
            
            <div className="space-y-2 pt-2 text-sm">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <span>support@expertshop.com</span>
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
            <div className="flex space-x-3">
              {/* Facebook Icon */}
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-lg transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>

              {/* Instagram Icon */}
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-lg transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* YouTube Icon */}
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 text-gray-300 hover:text-white rounded-lg transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor"></polygon>
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