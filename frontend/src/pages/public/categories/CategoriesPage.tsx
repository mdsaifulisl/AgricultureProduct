import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Grid, 
  SlidersHorizontal 
} from 'lucide-react';

import { CategoryGrid } from '../../../components/public/Category/CategoryGrid';
import { CategoryEmptyState } from '../../../components/public/Category/CategoryEmptyState';
import CATEGORIES_DATA from '../../../data/categoriesData.json'; 

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    return CATEGORIES_DATA.filter((cat) =>
      cat.bnName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleCategoryClick = (slug: string) => {
    navigate(`/shop?category=${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white mb-8 lg:mb-12 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>সমস্ত ক্যাটালগ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
              সব ক্যাটাগরি ব্রাউজ করুন
            </h1>
            <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed mb-6">
              কৃষি সরঞ্জাম, তাজা শাকসবজি থেকে শুরু করে উন্নত মানের বীজ ও সার—আপনার প্রয়োজনীয় সব কিছু এক জায়গায় সহজেই খুঁজুন।
            </p>

            {/* Live Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ক্যাটাগরির নাম লিখে খুঁজুন..."
                className="w-full pl-12 pr-4 py-3 bg-white text-gray-900 text-sm rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Categories Section Control Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-emerald-700" />
            <span className="text-base sm:text-lg font-bold text-gray-900">
              মোট ক্যাটাগরি ({filteredCategories.length})
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <SlidersHorizontal className="w-4 h-4" />
            <span>সাজানো: নাম অনুসারে</span>
          </div>
        </div>

        {/* Empty State and Categories Grid */}
        {filteredCategories.length === 0 ? (
          <CategoryEmptyState 
            searchQuery={searchQuery} 
            onReset={() => setSearchQuery('')} 
          />
        ) : (
          <CategoryGrid 
            categories={filteredCategories} 
            onCategoryClick={handleCategoryClick} 
          />
        )}

      </div>
    </div>
  );
};