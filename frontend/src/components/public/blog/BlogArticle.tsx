/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { User, Calendar, Clock, Tag } from "lucide-react";

interface BlogArticleProps {
  blog: any;
  onCopyLink: () => void;
}

export const BlogArticle: React.FC<BlogArticleProps> = ({ blog, onCopyLink }) => {
  return (
    <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-10 pb-6">
        <div className="inline-block bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-lg mb-4">
          {blog.category}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900">{blog.author}</div>
              {blog.authorRole && (
                <div className="text-[11px] text-gray-400">
                  {blog.authorRole}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" /> {blog.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" /> {blog.readTime}
            </span>
          </div>
        </div>
      </div>

      {blog.image && (
        <div className="px-6 sm:px-10">
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="p-6 sm:p-10">
        <div
          className="prose prose-emerald max-w-none 
            prose-headings:font-bold prose-headings:text-gray-900 
            prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-li:text-gray-700 prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-5 prose-ol:pl-5
            prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-gray-700
            prose-img:rounded-xl prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400 mr-1" />
            {blog.tags.map((tag: string) => (
              <span
                key={tag}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">
            পোস্টটি শেয়ার করুন:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onCopyLink}
              className="p-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 border border-gray-100 shadow-2xs transition-colors cursor-pointer"
              title="Facebook এ শেয়ার করুন"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            <button
              onClick={onCopyLink}
              className="p-2.5 bg-white text-gray-900 rounded-xl hover:bg-gray-100 border border-gray-100 shadow-2xs transition-colors cursor-pointer"
              title="X (Twitter) এ শেয়ার করুন"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>

            <button
              onClick={onCopyLink}
              className="p-2.5 bg-white text-blue-700 rounded-xl hover:bg-blue-50 border border-gray-100 shadow-2xs transition-colors cursor-pointer"
              title="LinkedIn এ শেয়ার করুন"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};