import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  X,
  Sprout,
  ChevronDown,
  Percent,
  Store,
  Home,
  Info,
  Phone,
  Truck,
  Sparkles,
  Tag,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  onOpenAuthModal?: () => void;
  onOpenCart?: () => void;
  onSearch?: (query: string) => void;
}

const MOCK_PRODUCTS = [
  { id: '1', name: 'তাজা লাল টমেটো', category: 'তাজা সবজি', price: '৪০৳ / কেজি', image: '🍅' },
  { id: '2', name: 'দেশি সবুজ শসা', category: 'তাজা সবজি', price: '৩০৳ / কেজি', image: '🥒' },
  { id: '3', name: 'মিষ্টি আলফান্সো আম', category: 'ফলমূল', price: '১২০৳ / কেজি', image: '🥭' },
  { id: '4', name: 'উচ্চ ফলনশীল বেগুন বীজ', category: 'বীজ ও চারা', price: '৫০৳ / প্যাকেট', image: '🌱' },
  { id: '5', name: 'জৈব কেঁচো সার (Vermicompost)', category: 'জৈব সার ও কীটনাশক', price: '২৫৳ / কেজি', image: '🧪' },
  { id: '6', name: 'স্প্রে মেশিন ১০ লিটার', category: 'কৃষি যন্ত্রপাতি', price: '১২০০৳', image: '🚜' }
];

const CATEGORIES = [
  { name: 'তাজা সবজি', desc: 'রাসায়নিক মুক্ত তাজা সবজি', icon: '🥬' },
  { name: 'ফলমূল', desc: 'দেশি ও আমদানিকৃত তাজা ফল', icon: '🍎' },
  { name: 'বীজ ও চারা', desc: 'উচ্চ ফলনশীল বীজ ও উন্নত চারা', icon: '🌱' },
  { name: 'জৈব সার ও কীটনাশক', desc: 'পরিবেশবান্ধব মাটির উপাদান', icon: '🧪' },
  { name: 'কৃষি যন্ত্রপাতি', desc: 'আধুনিক কৃষি সরঞ্জাম', icon: '🚜' }
];

const HOTLINE_NUMBER = '০১৭০০-০০০০০';

export const Navbar: React.FC<NavbarProps> = ({
  cartCount = 0,
  onOpenCart,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  
  const categoryRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return MOCK_PRODUCTS.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    setIsSearching(false);
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSelectProduct = (productName: string) => {
    setSearchQuery(productName);
    setIsSearching(false);
    if (onSearch) onSearch(productName);
    navigate(`/shop?search=${encodeURIComponent(productName)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-primary-950 text-primary-100 text-[11px] sm:text-xs py-2 px-4 border-b border-primary-900/50 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium overflow-hidden whitespace-nowrap">
            <span className="bg-primary-800 text-primary-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-accent-400" /> অফার
            </span>
            <span className="truncate">
              🌾 ১০০% খাঁটি দেশি কৃষিপণ্য! আজই অর্ডার করুন ও দ্রুত ডেলিভারি পান।
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-primary-200/90 text-xs shrink-0 font-medium">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Truck className="w-3.5 h-3.5 text-primary-400" /> অর্ডার ট্র্যাকিং
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-primary-400" /> হটলাইন: <strong className="text-white">{HOTLINE_NUMBER}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search & Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 lg:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-md shadow-primary-200 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900 tracking-tight block leading-none">
                Reliable<span className="text-primary-600">Krishi</span>
              </span>
              <span className="text-[10px] font-bold text-primary-700 tracking-widest uppercase block mt-1">
                কৃষি ই-কমার্স
              </span>
            </div>
          </Link>

          {/* Search Bar with Live Results (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl relative" ref={searchRef}>
            <form 
              onSubmit={handleSearchSubmit} 
              className="flex w-full items-center bg-gray-50/80 border border-primary-200 rounded-full focus-within:bg-white focus-within:border-primary-600 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all overflow-hidden shadow-inner pl-4 pr-1.5 py-1.5"
            >
              <input
                type="text"
                placeholder="তাঁজা সবজি, ফল, বীজ বা সার খুঁজুন..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(true);
                }}
                onFocus={() => searchQuery.trim() && setIsSearching(true)}
                className="w-full text-sm bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 font-normal"
              />

              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 active:scale-95 text-white p-2.5 px-6 rounded-full flex items-center justify-center transition-all font-medium shrink-0 cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Search Results Dropdown */}
            {isSearching && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 z-50 animate-fade-in overflow-hidden">
                <div className="px-4 pb-2 mb-1 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                  <span>অনুসন্ধান ফলাফল</span>
                  <span>{searchResults.length} টি পাওয়া গেছে</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectProduct(item.name)}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-primary-50/60 cursor-pointer transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <div className="text-xs font-bold text-gray-800">{item.name}</div>
                            <div className="text-[10px] text-primary-600">{item.category}</div>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                          {item.price}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-xs text-gray-500">
                    "{searchQuery}" নামে কোনো পণ্য পাওয়া যায়নি।
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop / Main Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-all cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { navigate('/login'); }}
              className="hidden sm:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xs shadow-primary-200 transition-all cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>লগইন / সাইনআপ</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 relative">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-50 border border-primary-200 rounded-xl p-1.5 shadow-inner">
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              className="w-full text-xs bg-transparent px-3 focus:outline-none"
            />
            <button type="submit" className="bg-primary-600 text-white p-2 rounded-lg shrink-0 cursor-pointer">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mobile Live Search Results Dropdown */}
          {isSearching && searchQuery.trim().length > 0 && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectProduct(item.name)}
                  className="w-full flex items-center justify-between px-3 py-2 border-b border-gray-50 text-xs text-left cursor-pointer hover:bg-primary-50"
                >
                  <span className="font-medium text-gray-800">{item.image} {item.name}</span>
                  <span className="text-[10px] text-primary-600 font-bold">{item.price}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. NAVIGATION BAR */}
      <nav className="hidden md:block bg-gray-50/80 border-t border-primary-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm font-semibold text-gray-700">
          
          <div className="flex items-center gap-8">
            <div className="relative py-2" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-2.5 bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-all shadow-xs shadow-primary-200 cursor-pointer"
              >
                <Menu className="w-4 h-4" />
                <span>সকল ক্যাটাগরি</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 z-50 animate-slide-down">
                  <div className="px-3 pb-2 mb-2 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    পণ্য ক্যাটাগরি
                  </div>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-start gap-3 px-4 py-2.5 hover:bg-primary-50/60 transition-colors group"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-gray-800 group-hover:text-primary-700">{cat.name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{cat.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center gap-1.5 py-3 transition-colors ${isActive ? 'text-primary-700 font-bold border-b-2 border-primary-600' : 'hover:text-primary-600'}`
                }
              >
                <Home className="w-4 h-4" />
                <span>হোম</span>
              </NavLink>

              <NavLink 
                to="/shop" 
                className={({ isActive }) => 
                  `flex items-center gap-1.5 py-3 transition-colors ${isActive ? 'text-primary-700 font-bold border-b-2 border-primary-600' : 'hover:text-primary-600'}`
                }
              >
                <Store className="w-4 h-4" />
                <span>সকল পণ্য</span>
              </NavLink>

              <NavLink 
                to="/offers" 
                className={({ isActive }) => 
                  `flex items-center gap-1.5 py-3 transition-colors ${isActive ? 'text-primary-700 font-bold border-b-2 border-primary-600' : 'hover:text-primary-600'}`
                }
              >
                <Percent className="w-4 h-4 text-accent-500" />
                <span>অফার ও ডিসকাউন্ট</span>
              </NavLink>

              <NavLink 
                to="/blog" 
                className={({ isActive }) => 
                  `flex items-center gap-1.5 py-3 transition-colors ${isActive ? 'text-primary-700 font-bold border-b-2 border-primary-600' : 'hover:text-primary-600'}`
                }
              >
                <BookOpen className="w-4 h-4" />
                <span>ব্লগ</span>
              </NavLink>

              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `flex items-center gap-1.5 py-3 transition-colors ${isActive ? 'text-primary-700 font-bold border-b-2 border-primary-600' : 'hover:text-primary-600'}`
                }
              >
                <Info className="w-4 h-4" />
                <span>আমাদের সম্পর্কে</span>
              </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-primary-800 bg-primary-100/60 px-3 py-1.5 rounded-full">
            <Tag className="w-3.5 h-3.5 text-primary-600" />
            <span>কৃষকদের সরাসরি বাজার</span>
          </div>

        </div>
      </nav>

      {/* 4. MOBILE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in">
          <div className="flex flex-col text-sm text-gray-700 font-semibold space-y-1">
            <Link 
              to="/" 
              className="py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center gap-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-4 h-4 text-primary-600" /> হোম
            </Link>

            <div>
              <button
                onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                className="w-full py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center justify-between text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-primary-600" /> সকল ক্যাটাগরি
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileCategoryOpen && (
                <div className="pl-6 space-y-1 py-1 bg-gray-50 rounded-lg my-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="block py-2 text-xs font-medium text-gray-600 hover:text-primary-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.icon} {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/shop" 
              className="py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center gap-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Store className="w-4 h-4 text-primary-600" /> সকল পণ্য (Shop)
            </Link>

            <Link 
              to="/offers" 
              className="py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center gap-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Percent className="w-4 h-4 text-accent-500" /> অফার ও ডিসকাউন্ট
            </Link>

            <Link 
              to="/blog" 
              className="py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center gap-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="w-4 h-4 text-primary-600" /> ব্লগ
            </Link>

            {/* Mobile Menu Cart Button */}
            <button 
              className="w-full py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center justify-between cursor-pointer" 
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenCart) onOpenCart();
              }}
            >
              <span className="flex items-center gap-2 text-left">
                <ShoppingBag className="w-4 h-4 text-primary-600" /> শপিং কার্ট
              </span>
              {cartCount > 0 && (
                <span className="bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <Link 
              to="/about" 
              className="py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center gap-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Info className="w-4 h-4 text-primary-600" /> আমাদের সম্পর্কে
            </Link>
          </div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white py-3 rounded-xl font-semibold text-sm shadow-xs transition-all cursor-pointer mt-2"
          >
            <UserIcon className="w-4 h-4" />
            <span>লগইন / সাইনআপ</span>
          </button>

          <div className="pt-3 border-t border-gray-100 text-xs text-center text-gray-500">
            📞 হটলাইন: <strong className="text-primary-700 font-bold">{HOTLINE_NUMBER}</strong>
          </div>
        </div>
      )}

    </header>
  );
};