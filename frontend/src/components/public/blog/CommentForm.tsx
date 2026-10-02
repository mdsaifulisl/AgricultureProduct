import React from "react";
import { Send, Loader2 } from "lucide-react";

interface CommentFormProps {
  userName: string;
  commentText: string;
  isSubmitting: boolean;
  setUserName: (val: string) => void;
  setCommentText: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  userName,
  commentText,
  isSubmitting,
  setUserName,
  setCommentText,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="mb-8 space-y-4">
      <input
        type="text"
        placeholder="আপনার নাম *"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        required
      />
      <textarea
        rows={3}
        placeholder="আপনার মতামত বা প্রশ্ন লিখুন... *"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        <span>মন্তব্য পোস্ট করুন</span>
      </button>
    </form>
  );
};