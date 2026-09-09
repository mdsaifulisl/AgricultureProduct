import React, { useState, useMemo, useEffect } from 'react';
import { Tag, Sparkles, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, X, Percent, Loader2, AlertCircle } from 'lucide-react';

import type { Product } from "../../../types/index";
import { ProductGrid } from "../../../components/common/ProductGrid";
import { useProduct } from "../../../features/product/useProduct";

const ITEMS_PER_PAGE = 8;

interface OffersPageProps {
  onAddToCart?: (product: Product) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('discount-high');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Redux store থেকে প্রোডাক্ট ডাটা ও মেথড আনা
  const { products, isLoading, isError, error, fetchAllProducts } = useProduct(true);

  // ১. প্রোডাক্টের ভেতর থেকে ডাইনামিক ইউনিক ক্যাটাগরি লিস্ট তৈরি
  const offerCategories = useMemo(() => {
    const defaultCat = { id: 'all', name: 'সকল অফার' };
    
    if (!products || products.length === 0) {
      return [defaultCat];
    }

    // সব প্রোডাক্ট থেকে ইউনিক ক্যাটাগরির নাম ফিল্টার করা
    const uniqueCategoryNames = Array.from(
      new Set(
        products
          .map((p) => p.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    );

    const mappedCategories = uniqueCategoryNames.map((catName) => ({
      id: catName,
      name: catName,
    }));

    return [defaultCat, ...mappedCategories];
  }, [products]);

  // ২. শুধুমাত্র যেসব পণ্যে ছাড় বা Badge আছে সেগুলোকে ফিল্টার ও সর্ট করা
  const discountedProducts = useMemo(() => {
    return products.filter((product) => {
      const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
      const hasBadge = Boolean(product.badge);
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      return (hasDiscount || hasBadge) && matchesCategory;
    }).sort((a, b) => {
      const getDiscountPercent = (p: Product) => {
        if (!p.originalPrice || p.originalPrice <= p.price) return 0;
        return ((p.originalPrice - p.price) / p.originalPrice) * 100;
      };

      if (sortBy === 'discount-high') {
        return getDiscountPercent(b) - getDiscountPercent(a);
      }
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [products, selectedCategory, sortBy]);

  // ফিল্টার বদলালে ১ম পেজে ফেরত যাওয়া
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);

  // পেজিনেশন চেঞ্জ হলে স্ক্রোল করে উপরে চলে যাওয়া
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  const totalPages = Math.ceil(discountedProducts.length / ITEMS_PER_PAGE) || 1;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return discountedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [discountedProducts, currentPage]);

  // লোডিং স্টেট
  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 text-emerald-600">
        <Loader2 className="w-10 h-10 animate-spin mb-3" />
        <p className="text-sm font-medium text-gray-600">অফার প্রোডাক্টসমূহ লোড হচ্ছে...</p>
      </div>
    );
  }

  // এরর স্টেট
  if (isError && products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-1">ডাটা লোড করতে সমস্যা হয়েছে!</h2>
        <p className="text-gray-600 text-sm mb-4">{error || 'সার্ভার থেকে অফার ডাটা ফেচ করা যায়নি।'}</p>
        <button
          onClick={fetchAllProducts}
          className="bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-sm"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/60 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600 rounded-3xl p-6 sm:p-10 mb-8 text-white shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>সীমিত সময়ের বিশেষ ধামাকা অফার</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
              সেরা দামে কিনুন <br />প্রাকৃতিক ও খাঁটি পণ্য!
            </h1>
            <p className="text-emerald-100 text-xs sm:text-base font-medium">
              আপনার পছন্দের তাজা সবজি, ফলমূল, খাঁটি খাবার এবং কৃষি সরঞ্জামে পাচ্ছেন আকর্ষণীয় ছাড়। স্টক শেষ হওয়ার আগেই অর্ডার করুন!
            </p>
          </div>

          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block opacity-25">
            <Percent className="w-64 h-64 stroke-[1.5]" />
          </div>
        </div>

        {/* Top Toolbar & Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Category Quick Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            {offerCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Mobile Filter */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="sm:hidden flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>ফিল্টার</span>
            </button>

            <div className="relative flex items-center w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 py-2.5 pl-3.5 pr-8 rounded-xl focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="discount-high">সর্বোচ্চ ছাড় আগে</option>
                <option value="price-low">কম দাম থেকে শুরু</option>
                <option value="price-high">বেশি দাম থেকে শুরু</option>
                <option value="rating">সেরা রেটিং</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <main>
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <Tag className="w-6 h-6" />
              </div>
              <p className="text-base font-bold text-gray-800">বর্তমানে কোনো অফার চলছে না!</p>
              <p className="text-xs text-gray-500">
                অন্য ক্যাটাগরি সিলেক্ট করুন অথবা পরবর্তীতে আবার চেক করুন।
              </p>
            </div>
          ) : (
            <>
              <ProductGrid 
                products={paginatedProducts} 
                onAddToCart={onAddToCart} 
              />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-gray-700 px-3">
                    পৃষ্ঠা {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h2 className="text-base font-bold text-gray-900">ক্যাটাগরি ফিল্টার</h2>
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {offerCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsFilterDrawerOpen(false);
                    }}
                    className={`w-full text-left text-xs font-medium px-3 py-2.5 rounded-xl transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full bg-emerald-600 text-white text-xs font-bold py-3 rounded-xl mt-6 cursor-pointer"
            >
              ফলাফল দেখুন
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default OffersPage;