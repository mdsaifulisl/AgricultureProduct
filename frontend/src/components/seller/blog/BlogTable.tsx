import React from "react";
import {
  Tag,
  ImageIcon,
  User,
  Calendar,
  Heart,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import type { BlogPost } from "../../../types/index";

interface BlogTableProps {
  blogs: BlogPost[];
  onEdit: (blog: BlogPost) => void;
  onDelete: (id: string) => void;
}

export const BlogTable: React.FC<BlogTableProps> = ({
  blogs,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="p-3.5">ব্লগ</th>
              <th className="p-3.5">ক্যাটাগরি</th>
              <th className="p-3.5">লেখক</th>
              <th className="p-3.5">তারিখ ও সময়</th>
              <th className="p-3.5">স্ট্যাটাস</th>
              <th className="p-3.5 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-3.5 max-w-md">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-16 shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 hover:text-primary-600 transition-colors">
                        {blog.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1">
                        {blog.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 whitespace-nowrap">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200">
                    {blog.category}
                  </span>
                </td>
                <td className="p-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>{blog.author}</span>
                    {blog.authorRole && (
                      <span className="text-gray-400">
                        ({blog.authorRole})
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3.5 whitespace-nowrap text-xs text-gray-500">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {blog.date}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Heart className="w-3 h-3 text-red-500" />
                      {blog.likes} লাইক • {blog.readTime}
                    </div>
                  </div>
                </td>
                <td className="p-3.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${
                      (blog.status || "published") === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {(blog.status || "published") === "published"
                      ? "Published"
                      : "Draft"}
                  </span>
                </td>
                <td className="p-3.5 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(blog)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(blog.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">কোনো ব্লগ পাওয়া যায়নি</p>
        </div>
      )}
    </>
  );
};