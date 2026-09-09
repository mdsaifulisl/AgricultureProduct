import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingBag, 
  Folders, 
  Image, 
  X, 
  LogOut, 
  Store,
  Video,
  FileText,
  Award,
  Users, 
  Settings,
  Lock // পাসওয়ার্ড চেঞ্জের জন্য আইকন
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'ড্যাশবোর্ড', path: '/seller', icon: LayoutDashboard },
    { name: 'অর্ডারসমূহ', path: '/seller/orders', icon: ShoppingBag },
    { name: 'পণ্যসমূহ', path: '/seller/products', icon: Package },
    { name: 'নতুন পণ্য যোগ করুন', path: '/seller/add-product', icon: PlusCircle },
    { name: 'ক্যাটাগরি সমূহ', path: '/seller/categories', icon: Folders },
    { name: 'হুম পেজ স্লাইডার', path: '/seller/sliders', icon: Image },
    { name: 'ভিডিওসমূহ', path: '/seller/videos', icon: Video },
    { name: 'ব্লগ পোস্টসমূহ', path: '/seller/blogs', icon: FileText },
    { name: 'মিডিয়া লোগো', path: '/seller/media-logos', icon: Award },
    { name: 'ইউজার ও রোলস', path: '/seller/users', icon: Users },
    { name: 'সাইট সেটিংস & SEO', path: '/seller/settings', icon: Settings },
  ];

  return (
    <>
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex-1 overflow-y-auto">
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <Link to="/seller" className="flex items-center gap-2 text-primary-600 font-black text-xl">
              <Store className="w-6 h-6" />
              <span>সেলার প্যানেল</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Menu Section */}
        <div className="p-4 border-t border-gray-100 space-y-1 bg-white shrink-0">
          <Link
            to="/seller/change-password"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-colors ${
              location.pathname === '/seller/change-password'
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Lock className="w-4 h-4 text-gray-400" />
            <span>পাসওয়ার্ড পরিবর্তন</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-primary-600 rounded-xl transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </Link>

          <button
            onClick={() => alert('লগআউট করা হচ্ছে...')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

// site logo favicon এগুলা কোথায় আপ্লোড করবো? 