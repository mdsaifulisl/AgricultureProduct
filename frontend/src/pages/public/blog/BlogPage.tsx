/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from 'react';
import { Leaf, Search, Loader2, AlertCircle } from 'lucide-react';
import { BlogGrid } from '../../../components/public/blog/BlogGrid';
import { useBlog } from '../../../features/blog/useBlog';

const stripHtml = (html?: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল পোস্ট');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // useBlog Hook Integration
  const { blogs, isLoading, isError, errorMessage, getAllBlogs } = useBlog();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getAllBlogs();
  }, [getAllBlogs]);

  // Dynamic Categories Extraction
  const blogCategories = useMemo(() => {
    if (!blogs || blogs.length === 0) return ['সকল পোস্ট'];

    const extractedCategories = Array.from(
      new Set(
        blogs
          .map((blog) => blog.category)
          .filter((cat): cat is string => Boolean(cat && cat.trim()))
      )
    );

    return ['সকল পোস্ট', ...extractedCategories];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return (blogs || []).filter((blog) => {
      const matchesCategory =
        selectedCategory === 'সকল পোস্ট' || blog.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!query) return true;

      const rawText = blog.metaDescription || blog.content || '';
      const plainExcerpt = stripHtml(rawText).toLowerCase();
      const titleMatches = blog.title?.toLowerCase().includes(query);

      return titleMatches || plainExcerpt.includes(query);
    });
  }, [blogs, selectedCategory, searchQuery]);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-primary-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-800/50 backdrop-blur-sm border border-primary-700/50 px-4 py-1.5 rounded-full text-primary-100 text-xs sm:text-sm font-semibold mb-6">
            <Leaf className="w-4 h-4" />
            <span>কৃষি বিষয়ক তথ্যের ভাণ্ডার</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            আমাদের <span className="text-accent-400">কৃষি ব্লগ</span>
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-2xl mx-auto">
            আধুনিক চাষাবাদ, গাছের যত্ন, জৈব সার ব্যবহার এবং কৃষির নিত্যনতুন প্রযুক্তি সম্পর্কে পড়ুন।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-10 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {blogCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ব্লগ খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-3" />
            <p className="text-sm font-medium">ব্লগ পোস্ট লোড হচ্ছে...</p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto my-10">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-red-800 mb-1">সমস্যা হয়েছে</h3>
            <p className="text-sm text-red-600 mb-4">{errorMessage || 'ব্লগসমূহ লোড করা সম্ভব হয়নি।'}</p>
            <button
              onClick={() => getAllBlogs()}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        )}

        {/* Blog Grid Component */}
        {!isLoading && !isError && <BlogGrid blogs={filteredBlogs as any} />}
      </div>
    </div>
  );
};

export default BlogPage;