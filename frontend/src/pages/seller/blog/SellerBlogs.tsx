/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import { type BlogPost } from "../../../types/index";
import { confirm } from "../../../features/confirm/confirmSlice";
import { useAppDispatch } from "../../../app/hooks";

import { BlogStats } from "../../../components/seller/blog/BlogStats";
import { BlogFilters } from "../../../components/seller/blog/BlogFilters";
import { BlogTable } from "../../../components/seller/blog/BlogTable";
import { BlogModal } from "../../../components/seller/blog/BlogModal";
import type { BlogFormData } from "../../../components/seller/blog/BlogModal";
import { showToast } from "../../../features/toast/toastSlice";
import { useBlog } from "../../../features/blog/useBlog";

export const SellerBlogs: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    blogs: rawBlogs = [],
    isLoading,
    getAllBlogs,
    handleCreateBlog,
    handleUpdateBlog,
    handleDeleteBlog,
    errorMessage,
  } = useBlog();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft" | "archived"
  >("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    getAllBlogs();
  }, [getAllBlogs]);

  // IBlog/API Response থেকে BlogPost টাইপে প্রপার ট্রান্সফর্মেশন
  const blogs: BlogPost[] = useMemo(() => {
    if (!Array.isArray(rawBlogs)) return [];

    return rawBlogs.map((item: any, index: number) => ({
      id: String(item.id || item._id || `blog-${index}`),
      title: String(item.title || ""),
      metaDescription: String(item.metaDescription || item.description || ""),
      content: String(item.content || ""),
      category: String(item.category || "Uncategorized"),
      author: String(item.author || "Unknown"),
      date: String(item.date || item.createdAt || new Date().toISOString()),
      readTime: String(item.readTime || "5 min read"),
      image: String(item.image || item.coverImage || ""),
      status: (item.status as BlogPost["status"]) || "published",
      tags: Array.isArray(item.tags) ? item.tags : [],
      likes: Number(item.likes) || 0,
      commentsCount:
        Number(item.commentsCount) ||
        (Array.isArray(item.comments) ? item.comments.length : 0),
    }));
  }, [rawBlogs]);

  // ডাইনামিক ক্যাটাগরি এক্সট্র্যাক্ট
  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(blogs.map((blog) => blog.category).filter(Boolean))
      ),
    ];
  }, [blogs]);

  // Modal Open Handlers (useCallback দিয়ে অপটিমাইজ করা হয়েছে)
  const handleOpenModal = useCallback((blog?: BlogPost) => {
    if (blog && typeof blog === "object" && blog.id) {
      setEditingBlog(blog);
    } else {
      setEditingBlog(null);
    }
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingBlog(null);
  }, []);

  const handleSubmit = async (formData: BlogFormData) => {
  try {
    const tagArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      title: formData.title,
      metaDescription: formData.metaDescription,
      category: formData.category,
      content: formData.content,
      image: formData.image,
      readTime: formData.readTime || "5 min read",
      status: formData.status || "published",
      tags: tagArray,
      author: editingBlog?.author || "Admin",
      date: editingBlog?.date || new Date().toISOString(),
    };

    if (editingBlog) {
      await handleUpdateBlog(editingBlog.id, payload);
    } else {
      await handleCreateBlog(payload);
    }

    // ✅ API সফল হলে কেবল এই লাইনে পৌঁছাবে এবং মোডাল বন্ধ করবে
    await handleCloseModal();
    dispatch(showToast("ব্লগ সফলভাবে তৈরি করা হয়েছে!", "success"));
  } catch (error) {
    // ❌ ব্যাকএন্ড থেকে এরর আসলে .unwrap() Exception থ্রো করে এখানে চলে আসবে
    // তাই handleCloseModal() কল হবে না এবং মোডাল খোলা থাকবে!
    console.error("ব্লগ সেভ করতে সমস্যা হয়েছে:", error);
  }
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
      })
    );

    if (!isConfirmed) return;

    try {
      await handleDeleteBlog(id);
    } catch (error) {
      console.error("ব্লগ ডিলিট করতে সমস্যা হয়েছে:", error);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || blog.category === selectedCategory;
      const matchesStatus =
        statusFilter === "all" || (blog.status || "published") === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogs, searchQuery, selectedCategory, statusFilter]);

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

      <BlogStats blogs={blogs} />

      <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-4">
        <BlogFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categories={categories}
        />

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">লোড হচ্ছে...</div>
        ) : (
          <BlogTable
            blogs={filteredBlogs}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        )}
      </div>

      <BlogModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingBlog={editingBlog}
        categories={categories}
        errorMessage={errorMessage}
      />
    </div>
  );
};
