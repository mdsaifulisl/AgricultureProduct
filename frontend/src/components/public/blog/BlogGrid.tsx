import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ChevronRight, BookOpen, ImageIcon } from 'lucide-react';
import type { BlogPost } from '../../../types/index';

// BlogPost টাইপ পেলেও যদি এক্সট্রা ফিল্ড আসে তার জন্য নিরাপদ টাইপ
interface ExtendedBlogPost extends BlogPost {
  excerpt?: string;
  formattedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BlogGridProps {
  blogs: ExtendedBlogPost[];
  emptyMessage?: string;
}

// HTML ট্যাগ এবং স্পেশাল এনটিটি (যেমন &nbsp;) সেফলি রিমুভ করার হেলপার
const stripHtml = (html?: string): string => {
  if (!html) return '';
  
  // HTML tags মুছে ফেলা
  const cleanText = html.replace(/<[^>]*>/g, '');
  
  // সাধারণ HTML Entities ক্লিন করা
  return cleanText
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
};

// তারিখ সুন্দরভাবে বাংলায় ফরম্যাট করার হেলপার
const formatDate = (dateValue?: string): string => {
  if (!dateValue) return '';

  const parsedDate = new Date(dateValue);

  // যদি ইনপুটটি একটি ভ্যালিড ISO/Standard Date string হয়
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleDateString('bn-BD', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // যদি আগে থেকেই কাস্টম স্ট্রিং বা অন্য কোনো ফরম্যাটে থাকে
  return dateValue;
};

export const BlogGrid: React.FC<BlogGridProps> = ({ 
  blogs, 
  emptyMessage = "কোনো ব্লগ পাওয়া যায়নি" 
}) => {
  if (blogs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <BookOpen className="w-8 h-8 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">{emptyMessage}</h3>
      </div>
    );
  }

  // ক্লিন সারসংক্ষেপ তৈরি করার হেলপার
  const createExcerpt = (content?: string, length = 120) => {
    const plainText = stripHtml(content);
    if (!plainText) return '';
    return plainText.length > length ? plainText.substring(0, length) + '...' : plainText;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {blogs.map((blog) => {
        // Excerpt বা Content সেফলি প্রসেস করা (HTML Sanitization সহ)
        const excerptText = blog.excerpt 
          ? stripHtml(blog.excerpt) 
          : createExcerpt(blog.content);

        // API থেকে প্রপার্টি খোঁজা
        const rawDate = blog.formattedDate || blog.date || blog.createdAt;
        const displayDate = formatDate(rawDate);

        return (
          <article 
            key={blog.id} 
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col"
          >
            <div className="relative h-56 overflow-hidden bg-gray-100">
              {blog.category && (
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-lg text-xs font-bold text-primary-700">
                  {blog.category}
                </div>
              )}
              {blog.image ? (
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                {displayDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{displayDate}</span>
                  </div>
                )}
                {blog.readTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{blog.readTime}</span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                <Link to={`/blog/post/${blog.id}`}>{blog.title}</Link>
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                {excerptText}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                    {blog.author ? blog.author.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {blog.author || 'এডমিন'}
                  </span>
                </div>
                <Link 
                  to={`/blog/post/${blog.id}`}
                  className="text-primary-600 text-xs font-bold flex items-center gap-1 hover:text-primary-800 transition-colors cursor-pointer"
                >
                  বিস্তারিত পড়ুন <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};