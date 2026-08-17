import React, { useState, useMemo, useEffect } from 'react';
import { Leaf, Search } from 'lucide-react';
import { BlogGrid, type BlogPost } from '../../../components/public/blog/BlogGrid';
import blogsData from '../../../data/blogs.json';

// JSON থেকে আনা ডাটা টাইপকাস্ট করে নিচ্ছি
const MOCK_BLOGS = blogsData as BlogPost[];

const stripHtml = (html: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const BLOG_CATEGORIES = ['সকল পোস্ট', 'কৃষি টিপস', 'জৈব চাষাবাদ', 'গাছের যত্ন', 'আধুনিক প্রযুক্তি'];

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল পোস্ট');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredBlogs = useMemo(() => {
    return MOCK_BLOGS.filter((blog) => {
      const matchesCategory = selectedCategory === 'সকল পোস্ট' || blog.category === selectedCategory;
      const plainExcerpt = stripHtml(blog.excerpt).toLowerCase();
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            plainExcerpt.includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
            {BLOG_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
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
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Blog Grid Component */}
        <BlogGrid blogs={filteredBlogs} />
      </div>
    </div>
  );
};

export default BlogPage;




