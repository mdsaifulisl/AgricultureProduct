import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ChevronRight, BookOpen } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

interface BlogGridProps {
  blogs: BlogPost[];
  emptyMessage?: string;
}

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {blogs.map((blog) => (
        <article 
          key={blog.id} 
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col"
        >
          <div className="relative h-56 overflow-hidden">
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-primary-700">
              {blog.category}
            </div>
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{blog.readTime}</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
              <Link to={`/blog/post/${blog.id}`}>{blog.title}</Link>
            </h2>

            <div 
              className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1"
              dangerouslySetInnerHTML={{ __html: blog.excerpt }}
            />

            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">{blog.author}</span>
              </div>
              <Link 
                to={`/blog/post/${blog.id}`}
                className="text-primary-600 text-xs font-bold flex items-center gap-1 hover:text-primary-800 transition-colors"
              >
                বিস্তারিত পড়ুন <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};