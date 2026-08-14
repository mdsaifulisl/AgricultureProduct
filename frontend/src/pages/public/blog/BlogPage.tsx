import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ChevronRight, BookOpen, Leaf, Search } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string; // এখানে Quill Rich Text / HTML String থাকবে
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

// HTML থেকে প্লেন টেক্সট বের করার জন্য হেলপার
const stripHtml = (html: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const BLOG_CATEGORIES = ['সকল পোস্ট', 'কৃষি টিপস', 'জৈব চাষাবাদ', 'গাছের যত্ন', 'আধুনিক প্রযুক্তি'];

// Quill-এর মত HTML সমৃদ্ধ Mock Data
const MOCK_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'ছাদ বাগানে টমেটো চাষের সহজ পদ্ধতি ও পরিচর্যা',
    excerpt: '<p>শহরের যান্ত্রিক জীবনে এক চিলতে <strong>সবুজের ছোঁয়া</strong> পেতে অনেকেই ছাদ বাগান করছেন। আজ আমরা জানব কীভাবে সহজেই ছাদে টমেটো চাষ করা যায়...</p>',
    category: 'কৃষি টিপস',
    author: 'কৃষিবিদ হাসান',
    date: '১৫ আগস্ট, ২০২৬',
    readTime: '৫ মিনিট',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'জৈব সার ব্যবহারের ৫টি বড় সুবিধা',
    excerpt: '<p>মাটির উর্বরতা বৃদ্ধি ও <em>বিষমুক্ত ফসল উৎপাদনের</em> জন্য জৈব সারের কোনো বিকল্প নেই। রাসায়নিক সারের ক্ষতিকর দিক আলোচনা করা হলো...</p>',
    category: 'জৈব চাষাবাদ',
    author: 'ড. আমিনুল ইসলাম',
    date: '১২ আগস্ট, ২০২৬',
    readTime: '৪ মিনিট',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=600&auto=format&fit=crop'
  }
];

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল পোস্ট');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredBlogs = useMemo(() => {
    return MOCK_BLOGS.filter((blog) => {
      const matchesCategory = selectedCategory === 'সকল পোস্ট' || blog.category === selectedCategory;
      
      // HTML ট্যাগ ছাড়া সাধারণ টেক্সটে সার্চ করা
      const plainExcerpt = stripHtml(blog.excerpt).toLowerCase();
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            plainExcerpt.includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16">
      {/* Header & Controls */}
      <div className="bg-primary-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-800/50 backdrop-blur-sm border border-primary-700/50 px-4 py-1.5 rounded-full text-primary-100 text-xs sm:text-sm font-semibold mb-6">
            <Leaf className="w-4 h-4" />
            <span>কৃষি বিষয়ক তথ্যের ভাণ্ডার</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            আমাদের <span className="text-accent-400">কৃষি ব্লগ</span>
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-2xl mx-auto">
            আধুনিক চাষাবাদ, গাছের যত্ন, জৈব সার ব্যবহার এবং কৃষির নিত্যনতুন প্রযুক্তি সম্পর্কে পড়ুন।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
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

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((blog) => (
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

                  {/* Option A: HTML Format Render (যদি HTML ট্যাগসহ সরাসরি দেখাতে চান) */}
                  <div 
                    className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1"
                    dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                  />

                  {/* Option B: Plain Text Excerpt (যদি HTML ট্যাগ বাদ দিয়ে শুধুমাত্র সাধারণ টেক্সট দেখাতে চান) */}
                  {/* 
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {stripHtml(blog.excerpt)}
                  </p> 
                  */}

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
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <BookOpen className="w-8 h-8 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">কোনো ব্লগ পাওয়া যায়নি</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;