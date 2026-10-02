import React from "react";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import type { BlogPost } from "../../../types/index";

interface BlogStatsProps {
  blogs: BlogPost[];
}

export const BlogStats: React.FC<BlogStatsProps> = ({ blogs }) => {
  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter(
    (b) => (b.status || "published") === "published",
  ).length;
  const draftBlogs = blogs.filter((b) => b.status === "draft").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center gap-4">
        <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-500">মোট ব্লগ</p>
          <h3 className="text-xl font-bold text-gray-900">{totalBlogs}</h3>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center gap-4">
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-500">পাবলিশড ব্লগ</p>
          <h3 className="text-xl font-bold text-gray-900">{publishedBlogs}</h3>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center gap-4">
        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-500">ড্রাফট</p>
          <h3 className="text-xl font-bold text-gray-900">{draftBlogs}</h3>
        </div>
      </div>
    </div>
  );
};