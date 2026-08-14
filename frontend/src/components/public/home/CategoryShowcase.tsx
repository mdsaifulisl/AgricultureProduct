import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

import { CategoryGrid } from '../Category/CategoryGrid';
import { CategoryEmptyState } from '../Category/CategoryEmptyState';
import CATEGORIES_DATA from '../../../data/categoriesData.json';

export const CategoryShowcase: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    navigate(`/shop?category=${slug}`);
  };

  // হোমপেজ শো-কেসের জন্য প্রথম ৪টি ক্যাটাগরি নেওয়া হলো
  const featuredCategories = CATEGORIES_DATA.slice(0, 6);

  return (
    <section className="py-10 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 lg:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-800 border border-primary-200/60 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent-500" />
              <span>পণ্য ক্যাটালগ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              আমাদের ক্যাটাগরি সমূহ
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-normal mt-1 max-w-xl">
              আপনার প্রয়োজনীয় কৃষিপণ্য বা তাজা খাবার সহজে খুঁজে পেতে নিচের ক্যাটাগরিগুলো ব্রাউজ করুন।
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all self-start md:self-auto cursor-pointer"
          >
            <span>সব ক্যাটাগরি দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Content */}
        {featuredCategories.length === 0 ? (
          <CategoryEmptyState searchQuery={''} onReset={function (): void {
            throw new Error('Function not implemented.');
          } } />
        ) : (
          <CategoryGrid 
            categories={featuredCategories} 
            onCategoryClick={handleCategoryClick} 
          />
        )}

      </div>
    </section>
  );
};