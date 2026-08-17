import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BlogGrid, type BlogPost } from '../blog/BlogGrid';
import blogsData from '../../../data/blogs.json';

const blogs = blogsData as BlogPost[];

export const HomeBlogSection: React.FC = () => {
  // হোম পেজের জন্য শুধুমাত্র প্রথম ৩টি ব্লগ ফিল্টার করে নেওয়া হচ্ছে
  const recentBlogs = blogs.slice(0, 3);

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-primary-600 font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>আমাদের ব্লগ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              কৃষি বিষয়ক পরামর্শ ও তথ্য
            </h2>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-bold text-sm transition-colors group"
          >
            <span>সব পোস্ট দেখুন</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Grid (Showing 3 items) */}
        <BlogGrid blogs={recentBlogs} />

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 text-gray-800 font-bold text-sm rounded-xl shadow-xs hover:bg-gray-50 transition-colors"
          >
            <span>সব পোস্ট দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};