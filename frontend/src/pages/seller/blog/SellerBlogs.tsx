import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  ImageIcon,
  Heart,
  User,
  Upload,
} from "lucide-react";
import { RichTextEditor } from "../../../components/common/RichTextEditor";
import BlogData from "../../../data/blogData.json";
import { compressAndConvertToBase64 } from "../../../utils/imageUtils";
import { type BlogPost } from "../../../types/index";
import { confirm } from "../../../features/confirm/confirmSlice";
import { useAppDispatch } from "../../../app/hooks";

const CATEGORIES = [
  "All",
  "কৃষি টিপস",
  "জৈব চাষাবাদ",
  "Fashion",
  "Shopping Guide",
  "Lifestyle",
];

export const SellerBlogs: React.FC = () => {
  const dispatch = useAppDispatch();
  const [blogs, setBlogs] = useState<BlogPost[]>(() =>
    (BlogData as BlogPost[]).map((item) => ({
      ...item,
      status: item.status ?? "published",
    })),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft" | "archived"
  >("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    metaDescription: "",
    category: "কৃষি টিপস",
    author: "Admin",
    authorRole: "লেখক",
    readTime: "৫ মিনিট",
    image: "",
    tags: "",
    content: "",
    status: "published" as "published" | "draft" | "archived",
  });

  const handleOpenModal = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        metaDescription: blog.metaDescription || "",
        category: blog.category,
        author: blog.author,
        authorRole: blog.authorRole || "",
        readTime: blog.readTime,
        image: blog.image,
        tags: blog.tags.join(", "),
        content: blog.content,
        status: blog.status || "published",
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        metaDescription: "",
        category: "কৃষি টিপস",
        author: "Admin",
        authorRole: "লেখক",
        readTime: "৫ মিনিট",
        image: "",
        tags: "",
        content: "",
        status: "published",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tagArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const formattedDate = new Date().toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (editingBlog) {
      setBlogs((prev) =>
        prev.map((item) =>
          item.id === editingBlog.id
            ? {
                ...item,
                ...formData,
                tags: tagArray,
              }
            : item,
        ),
      );
    } else {
      const newBlog: BlogPost = {
        id: Date.now().toString(),
        ...formData,
        tags: tagArray,
        date: formattedDate,
        likes: 0,
      };
      setBlogs((prev) => [newBlog, ...prev]);
    }

    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await dispatch(
      confirm({
        title: "ব্লগ মুছে ফেলার নিশ্চিতকরণ",
        message:
          "আপনি কি নিশ্চিত যে এই ব্লগটি মুছে ফেলতে চান? এই অ্যাকশনটি ফিরিয়ে আনা যাবে না।",
        confirmText: "হ্যাঁ, ডিলিট করুন",
        cancelText: "বাতিল",
        type: "danger",
      }),
    );

    // ইউজার বাতিল করলে ফাংশন থামবে
    if (!isConfirmed) return;

    setBlogs((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    const matchesStatus =
      statusFilter === "all" || (blog.status || "published") === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ব্লগ ম্যানেজমেন্ট
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            আপনার পোস্টসমূহ তৈরি ও পরিচালনা করুন
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          নতুন ব্লগ লিখুন
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">মোট ব্লগ</p>
            <h3 className="text-xl font-bold text-gray-900">{blogs.length}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">পাবলিশড ব্লগ</p>
            <h3 className="text-xl font-bold text-gray-900">
              {
                blogs.filter((b) => (b.status || "published") === "published")
                  .length
              }
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">ড্রাফট</p>
            <h3 className="text-xl font-bold text-gray-900">
              {blogs.filter((b) => b.status === "draft").length}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ব্লগের শিরোনাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl p-1 bg-gray-50">
              <Filter className="w-3.5 h-3.5 text-gray-400 ml-2" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs border-none bg-transparent focus:outline-none pr-2 text-gray-700"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1 bg-gray-50 text-xs">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-white shadow-xs font-semibold text-gray-900"
                    : "text-gray-600"
                }`}
              >
                সব
              </button>
              <button
                onClick={() => setStatusFilter("published")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === "published"
                    ? "bg-white shadow-xs font-semibold text-emerald-600"
                    : "text-gray-600"
                }`}
              >
                পাবলিশড
              </button>
              <button
                onClick={() => setStatusFilter("draft")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === "draft"
                    ? "bg-white shadow-xs font-semibold text-amber-600"
                    : "text-gray-600"
                }`}
              >
                ড্রাফট
              </button>
            </div>
          </div>
        </div>

        {/* ব্লগ তালিকা (List View) */}
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
              {filteredBlogs.map((blog) => (
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
                        onClick={() => handleOpenModal(blog)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
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

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">কোনো ব্লগ পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">
            <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingBlog ? "ব্লগ এডিট করুন" : "নতুন ব্লগ তৈরি করুন"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
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

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
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
                    setFormData({
                      ...formData,
                      metaDescription: e.target.value,
                    })
                  }
                  placeholder="ব্লগের একটি সংক্ষিপ্ত বিবরণ লিখুন (SEO & Share Preview)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    লেখকের নাম
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="যেমন: কৃষিবিদ হাসান"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    লেখকের পদবি (Role)
                  </label>
                  <input
                    type="text"
                    value={formData.authorRole}
                    onChange={(e) =>
                      setFormData({ ...formData, authorRole: e.target.value })
                    }
                    placeholder="যেমন: কৃষি পরামর্শক"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          onClick={() =>
                            setFormData({ ...formData, image: "" })
                          }
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
                  onClick={handleCloseModal}
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
      )}
    </div>
  );
};
