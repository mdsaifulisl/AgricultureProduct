/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { X, Upload, AlertCircle } from "lucide-react";
import { RichTextEditor } from "../../../components/common/RichTextEditor";
import { compressAndConvertToBase64 } from "../../../utils/imageUtils";
import type { BlogPost } from "../../../types/index";
import { showToast } from "../../../features/toast/toastSlice";
import { useAppDispatch } from "../../../app/hooks";



interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: BlogFormData) => void;
  editingBlog: BlogPost | null;
  categories: string[];
  errorMessage?: string | null;
}

export interface BlogFormData {
  author?: string;
  title: string;
  metaDescription?: string;
  category: string;
  readTime: string;
  image: string;
  tags: string;
  content: string;
  status: "published" | "draft" | "archived";
}

const BlogModalContent: React.FC<BlogModalProps> = ({
  onClose,
  onSubmit,
  editingBlog,
  categories,
  errorMessage,
}) => {
  const dispatch = useAppDispatch();
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>(() => {
    if (editingBlog) {
      return {
        author: editingBlog.author || "Admin",
        title: editingBlog.title || "",
        metaDescription:
          editingBlog.metaDescription ||
          (editingBlog as any).description ||
          "",
        category: editingBlog.category || "",
        readTime: editingBlog.readTime || "৫ মিনিট",
        image: editingBlog.image || "",
        tags: Array.isArray(editingBlog.tags)
          ? editingBlog.tags.join(", ")
          : editingBlog.tags || "",
        content: editingBlog.content || "",
        status: editingBlog.status || "published",
      };
    }

    return {
      author: "Admin",
      title: "",
      metaDescription: "",
      category: "",
      readTime: "৫ মিনিট",
      image: "",
      tags: "",
      content: "",
      status: "published",
    };
  });

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const base64Image = await compressAndConvertToBase64(file);
      setFormData((prev) => ({ ...prev, image: base64Image }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
  e.preventDefault();

  if (errorMessage) {
    dispatch(showToast(errorMessage, "error"));
    return;
  }

  onSubmit(formData);
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {editingBlog ? "ব্লগ এডিট করুন" : "নতুন ব্লগ তৈরি করুন"}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="p-4 md:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                ব্লগ টাইটেল *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="ব্লগের শিরোনাম লিখুন"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* সরাসরি টাইপ করার জন্য ক্যাটাগরি ইনপুট (Datalist Autocomplete সহ) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                ক্যাটাগরি *
              </label>
              <input
                type="text"
                required
                list="category-suggestions"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="ক্যাটাগরি টাইপ করুন"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
              />
              <datalist id="category-suggestions">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              মেটা ডেসক্রিপশন (SEO এর জন্য)
            </label>
            <textarea
              rows={2}
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({ ...formData, metaDescription: e.target.value })
              }
              placeholder="ব্লগের একটি সংক্ষিপ্ত বিবরণ লিখুন (SEO & Share Preview)"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                পড়ার সময় (Read Time)
              </label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) =>
                  setFormData({ ...formData, readTime: e.target.value })
                }
                placeholder="যেমন: ৫ মিনিট"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                স্ট্যাটাস
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as
                      | "published"
                      | "draft"
                      | "archived",
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              কভার ইমেজ
            </label>
            {formData.image ? (
              <div className="relative h-32 w-full rounded-xl overflow-hidden border border-gray-200 group">
                <img
                  src={formData.image}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="px-3 py-1.5 bg-white/90 hover:bg-white text-gray-800 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                    চেঞ্জ করুন
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    মুছুন
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">
                  {imageUploading
                    ? "প্রসেসিং হচ্ছে..."
                    : "ছবি আপলোড করতে ক্লিক করুন"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={imageUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              ট্যাগসমূহ (Commas দ্বারা আলাদা করুন)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="ছাদ বাগান, টমেটো চাষ, জৈব কৃষি"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              ব্লগের বিস্তারিত বিষয়বস্তু *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(newContent) =>
                setFormData({ ...formData, content: newContent })
              }
              placeholder="ব্লগের বিস্তারিত লেখা এখানে শুরু করুন..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-xs"
            >
              {editingBlog ? "আপডেট করুন" : "পাবলিশ করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const BlogModal: React.FC<BlogModalProps> = (props) => {
  if (!props.isOpen) return null;

  const modalKey = props.editingBlog
    ? props.editingBlog.id || (props.editingBlog as any)._id
    : "new-blog";

  return <BlogModalContent key={modalKey} {...props} />;
};


