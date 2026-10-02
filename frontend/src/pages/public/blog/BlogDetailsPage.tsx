/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Loader2 } from "lucide-react";

import { useLike } from "../../../features/like/useLike";
import { useBlog } from "../../../features/blog/useBlog";
import { confirm } from "../../../features/confirm/confirmSlice";
import { showToast } from "../../../features/toast/toastSlice";
import { useAppDispatch } from "../../../app/hooks";

import { BlogHeaderNav } from "../../../components/public/blog/BlogHeaderNav";
import { BlogArticle } from "../../../components/public/blog/BlogArticle";
import { CommentForm } from "../../../components/public/blog/CommentForm";
import { CommentList } from "../../../components/public/blog/CommentList";

export const BlogDetailsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    singleBlog,
    isLoading,
    isError,
    errorMessage,
    getBlogById,
    handleAddComment,
    handleDeleteComment,
    handleLikeBlog,
  } = useBlog();

  const { toggleLike, isLiked } = useLike();

  const [copied, setCopied] = useState<boolean>(false);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id) {
      getBlogById(id);
    }
  }, [id, getBlogById]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (isError || !singleBlog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <p className="text-red-500 font-semibold mb-4">
          {errorMessage || "ব্লগটি খুঁজে পাওয়া যায়নি।"}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>পিছনে ফিরে যান</span>
        </button>
      </div>
    );
  }

  const currentIsLiked = isLiked(singleBlog.id);
  const totalLikes = singleBlog.likes || 0;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleLike = async () => {
    if (!singleBlog) return;

    const willLike = !currentIsLiked;

    // ১. লোকাল ইউজার ইন্টারফেসে লাইক স্টেট টগল
    toggleLike(singleBlog.id);

    // ২. অ্যাকশন সহ ব্যাকএন্ডে API কল
    try {
      await handleLikeBlog(singleBlog.id, willLike ? "like" : "unlike");
    } catch (error) {
      console.error("Failed to update like status:", error);
      // এপিআই কল ফেল করলে UI আগের অবস্থায় ফিরিয়ে আনা
      toggleLike(singleBlog.id);
    }
  };

const onSubmitComment = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!userName.trim() || !commentText.trim()) return;

  setIsSubmitting(true);
  try {
    const response = await handleAddComment({
      blogId: singleBlog.id,
      commentData: {
        userName: userName.trim(),
        commentText: commentText.trim(),
      },
    });

    // response.message সরাসরি ব্যাকএন্ডের পাঠানো মেসেজ ধারণ করে
    const successMessage = response?.message || "কমেন্ট সফলভাবে যুক্ত হয়েছে!";
    
    dispatch(showToast(successMessage));

    setCommentText("");
    setUserName("");
  } catch (error: any) {
    console.error("Failed to add comment:", error);
    
    const errorMessage = typeof error === "string" 
      ? error 
      : error?.message || "কমেন্ট যোগ করতে ব্যর্থ হয়েছে";

    dispatch(showToast(errorMessage));
  } finally {
    setIsSubmitting(false);
  }
};

  const onDeleteComment = async (commentId: string) => {
    try {
      const isConfirmed = await dispatch(
        confirm({
          title: "কমেন্ট মুছে ফেলার নিশ্চিতকরণ",
          message:
            "আপনি কি নিশ্চিত যে এই কমেন্টটি মুছে ফেলতে চান? এই অ্যাকশনটি ফিরিয়ে আনা যাবে না।",
          confirmText: "হ্যাঁ, ডিলিট করুন",
          cancelText: "বাতিল",
          type: "danger",
        })
      );

      if (isConfirmed) {
        await handleDeleteComment(commentId);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16">
      <BlogHeaderNav
        onBack={() => navigate(-1)}
        onLikeToggle={handleToggleLike}
        onCopyLink={handleCopyLink}
        isLiked={currentIsLiked}
        totalLikes={totalLikes}
        copied={copied}
      />

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <BlogArticle blog={singleBlog} onCopyLink={handleCopyLink} />

        <section className="mt-10 bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            <span>মন্তব্যসমূহ ({singleBlog.comments?.length || 0})</span>
          </h3>

          <CommentForm
            userName={userName}
            commentText={commentText}
            isSubmitting={isSubmitting}
            setUserName={setUserName}
            setCommentText={setCommentText}
            onSubmit={onSubmitComment}
          />

          <CommentList
            comments={singleBlog.comments}
            onDeleteComment={onDeleteComment}
          />
        </section>
      </div>
    </div>
  );
};

export default BlogDetailsPage;