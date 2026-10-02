/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
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
  BookOpen,
  Video,
  Package,
} from "lucide-react";
import { useProduct } from "../../features/product/useProduct";
import { useSiteSettings } from "../../features/siteSettings/useSiteSettings";
import { useAuth } from "../../features/auth/useAuth";

interface NavbarProps {
  cartCount?: number;
  onOpenAuthModal?: () => void;
  onOpenCart?: () => void;
  onSearch?: (query: string) => void;
}

const STATIC_CATEGORIES = [
  { name: "তাজা সবজি", desc: "রাসায়নিক মুক্ত তাজা সবজি", icon: "🥬" },
  { name: "ফলমূল", desc: "দেশি ও আমদানিকৃত তাজা ফল", icon: "🍎" },
  { name: "বীজ ও চারা", desc: "উচ্চ ফলনশীল বীজ ও উন্নত চারা", icon: "🌱" },
  { name: "জৈব সার ও কীটনাশক", desc: "পরিবেশবান্ধব মাটির উপাদান", icon: "🧪" },
  { name: "কৃষি যন্ত্রপাতি", desc: "আধুনিক কৃষি সরঞ্জাম", icon: "🚜" },
];

export const Navbar: React.FC<NavbarProps> = ({
  cartCount = 0,
  onOpenCart,
  onSearch,
}) => {
  const { products } = useProduct();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings, fetchSettings } = useSiteSettings();

  const HOTLINE_NUMBER = settings?.contactPhone || "01700000000";

  useEffect(() => {
    if (fetchSettings) {
      fetchSettings();
    }
  }, [fetchSettings]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Route চেঞ্জ হলে সমস্ত UI ড্রপডাউন বন্ধ করার ব্যবস্থা
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsSearching(false);
  }, [location.pathname]);

  // Dynamic Categories
  const dynamicCategories = useMemo(() => {
    if (!products || products.length === 0) return STATIC_CATEGORIES;

    const uniqueCategoryNames = Array.from(
      new Set(products.map((item: any) => item.category).filter(Boolean)),
    );

    return uniqueCategoryNames.map((catName) => {
      const existing = STATIC_CATEGORIES.find((c) => c.name === catName);
      return {
        name: catName as string,
        desc: existing ? existing.desc : "উৎকৃষ্ট মানের কৃষিপণ্য",
        icon: existing ? existing.icon : "🌱",
      };
    });
  }, [products]);

  // Search Results Filtering
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query || !products || products.length === 0) return [];
    return products.filter(
      (item: any) =>
        item.name?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.shortDescription?.toLowerCase().includes(query),
    );
  }, [searchQuery, products]);

  // Click Outside Detection Fix
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(target)
      ) {
        setIsSearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) onSearch(searchQuery);
      setIsSearching(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSearchQuery("");
    setIsSearching(false);
    setIsMobileMenuOpen(false);
    navigate(`/product/${productId}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs">
      {/* TOP ANNOUNCEMENT BAR */}
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
              <Phone className="w-3.5 h-3.5 text-primary-400" /> হটলাইন:{" "}
              <strong className="text-white">{HOTLINE_NUMBER}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 lg:gap-8">
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

          {/* Desktop Search Bar */}
          <div
            className="hidden md:flex items-center flex-1 max-w-2xl relative"
            ref={searchRef}
          >
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
                onFocus={() => {
                  if (searchQuery.trim()) setIsSearching(true);
                }}
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

            {/* Desktop Live Search Dropdown */}
            {isSearching && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 z-50 animate-fade-in overflow-hidden">
                <div className="px-4 pb-2 mb-1 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                  <span>অনুসন্ধান ফলাফল</span>
                  <span>{searchResults.length} টি পাওয়া গেছে</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {searchResults.map((item: any) => (
                      <button
                        key={item.id || item._id}
                        type="button"
                        onClick={() => handleSelectProduct(item.id || item._id)}
                        className="w-full flex items-center justify-between p-2.5 hover:bg-primary-50/60 cursor-pointer text-left gap-2"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-gray-800 truncate">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-primary-600">
                              {item.category}
                            </div>
                          </div>
                        </div>
                        <div className="text-[11px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full shrink-0">
                          {item.price}৳
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
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-all cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {user ? (
              <button
                onClick={() => navigate("/seller")}
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm uppercase shadow-sm transition-all cursor-pointer active:scale-95 border-2 border-primary-200"
                title={user?.name}
              >
                {user?.name ? user.name.slice(0, 2) : "US"}
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xs shadow-primary-200 transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>লগইন / সাইনআপ</span>
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3 relative" ref={mobileSearchRef}>
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-50 border border-primary-200 rounded-xl p-1.5 shadow-inner"
          >
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsSearching(true);
              }}
              className="w-full text-xs bg-transparent px-3 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white p-2 rounded-lg shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mobile Search Results */}
          {isSearching && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-fade-in overflow-hidden">
              {searchResults.length > 0 ? (
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                  {searchResults.map((item: any) => (
                    <button
                      key={item.id || item._id}
                      type="button"
                      onClick={() => handleSelectProduct(item.id || item._id)}
                      className="w-full flex items-center justify-between p-2.5 hover:bg-primary-50/60 cursor-pointer text-left gap-2"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-gray-800 truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-primary-600">
                            {item.category}
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full shrink-0">
                        {item.price}৳
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-4 text-center text-xs text-gray-500">
                  কোনো পণ্য পাওয়া যায়নি।
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP NAVIGATION BAR */}
      <nav className="hidden md:block bg-gray-50/80 border-t border-primary-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm font-semibold text-gray-700">
          <div className="flex items-center gap-8">
            <div className="relative py-2" ref={categoryRef}>
              <button
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className="flex items-center gap-2.5 bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-all shadow-xs shadow-primary-200 cursor-pointer"
              >
                <Menu className="w-4 h-4" />
                <span>সকল ক্যাটাগরি</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 z-50 animate-slide-down">
                  <div className="px-3 pb-2 mb-2 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    পণ্য ক্যাটাগরি
                  </div>
                  {dynamicCategories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-start gap-3 px-4 py-2.5 hover:bg-primary-50/60 transition-colors group"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    >
                      <div>
                        <div className="text-xs font-bold text-gray-800 group-hover:text-primary-700">
                          {cat.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-normal">
                          {cat.desc.length > 40
                            ? cat.desc.slice(0, 40) + "..."
                            : cat.desc}
                        </div>
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
                  `flex items-center gap-1.5 py-3 transition-colors ${
                    isActive
                      ? "text-primary-700 font-bold border-b-2 border-primary-600"
                      : "hover:text-primary-600"
                  }`
                }
              >
                <Home className="w-4 h-4" />
                <span>হোম</span>
              </NavLink>

              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 py-3 transition-colors ${
                    isActive
                      ? "text-primary-700 font-bold border-b-2 border-primary-600"
                      : "hover:text-primary-600"
                  }`
                }
              >
                <Store className="w-4 h-4" />
                <span>সকল পণ্য</span>
              </NavLink>

              <NavLink
                to="/offers"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 py-3 transition-colors ${
                    isActive
                      ? "text-primary-700 font-bold border-b-2 border-primary-600"
                      : "hover:text-primary-600"
                  }`
                }
              >
                <Percent className="w-4 h-4 text-accent-500" />
                <span>অফার ও ডিসকাউন্ট</span>
              </NavLink>

              <NavLink
                to="/videos"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 py-3 transition-colors ${
                    isActive
                      ? "text-primary-700 font-bold border-b-2 border-primary-600"
                      : "hover:text-primary-600"
                  }`
                }
              >
                <Video className="w-4 h-4 text-primary-600" />
                <span>ভিডিও টিউটোরিয়াল</span>
              </NavLink>

              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 py-3 transition-colors ${
                    isActive
                      ? "text-primary-700 font-bold border-b-2 border-primary-600"
                      : "hover:text-primary-600"
                  }`
                }
              >
                <BookOpen className="w-4 h-4" />
                <span>ব্লগ</span>
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 py-3 transition-colors ${
                    isActive
                      ? "text-primary-700 font-bold border-b-2 border-primary-600"
                      : "hover:text-primary-600"
                  }`
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

      {/* MOBILE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col text-sm text-gray-700 font-semibold space-y-1">
            <Link
              to="/"
              className="py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center gap-2"
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
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isMobileCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMobileCategoryOpen && (
                <div className="pl-6 space-y-1 py-1 bg-gray-50 rounded-lg my-1 max-h-60 overflow-y-auto">
                  {dynamicCategories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="block py-2 text-xs font-medium text-gray-600 hover:text-primary-700"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/shop"
              className="py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-primary-600" /> সকল পণ্য (Shop)
            </Link>

            <Link
              to="/offers"
              className="py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center gap-2"
            >
              <Percent className="w-4 h-4 text-accent-500" /> অফার ও ডিসকাউন্ট
            </Link>

            <Link
              to="/videos"
              className="py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-primary-600" /> ভিডিও টিউটোরিয়াল
            </Link>

            <Link
              to="/blog"
              className="py-2.5 px-2 hover:bg-primary-50 rounded-lg flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-primary-600" /> ব্লগ
            </Link>

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
            >
              <Info className="w-4 h-4 text-primary-600" /> আমাদের সম্পর্কে
            </Link>
          </div>

          {user ? (
            <button
              onClick={() => navigate("/seller")}
              className="w-full flex items-center justify-between bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-800 p-2.5 rounded-xl transition-all cursor-pointer mt-2"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-600 text-white font-bold text-xs uppercase shadow-xs">
                  {user?.name ? user.name.slice(0, 2) : "US"}
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-primary-600 text-white px-2.5 py-1 rounded-md font-medium">
                ড্যাশবোর্ড
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white py-3 rounded-xl font-semibold text-sm shadow-xs transition-all cursor-pointer mt-2"
            >
              <UserIcon className="w-4 h-4" />
              <span>লগইন / সাইনআপ</span>
            </button>
          )}

          <div className="pt-3 border-t border-gray-100 text-xs text-center text-gray-500">
            📞 হটলাইন:{" "}
            <strong className="text-primary-700 font-bold">
              {HOTLINE_NUMBER}
            </strong>
          </div>
        </div>
      )}

      {/* FLOATING SIDE CART BUTTON */}
      {cartCount > 0 && location.pathname !== "/cart" && (
        <button
          onClick={onOpenCart}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white p-3 rounded-l-2xl shadow-2xl flex flex-col items-center gap-1.5 transition-all group cursor-pointer border-l-2 border-y-2 border-primary-400"
          aria-label="Open Shopping Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-[10px] font-black min-w-5 h-5 px-1 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase [writing-mode:vertical-lr] rotate-180 hidden sm:inline-block">
            কার্ট
          </span>
        </button>
      )}
    </header>
  );
};