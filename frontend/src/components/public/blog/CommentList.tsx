/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Trash2 } from "lucide-react";

interface CommentListProps {
  comments?: any[]; // optional tag (?) অথবা any[] | undefined টাইপ দিন
  onDeleteComment: (commentId: string) => void;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments = [], // default parameter হিসেবে খালি array প্রদান করুন
  onDeleteComment,
}) => {
  if (!comments || comments.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        এখনো কোনো মন্তব্য করা হয়নি। প্রথম মন্তব্যটি আপনিই করুন!
      </p>
    );
  }

  return (
    <div className="space-y-4 divide-y divide-gray-100">
      {comments.map((comment: any) => (
        <div
          key={comment.id || comment._id}
          className="pt-4 first:pt-0 flex items-start justify-between gap-4 group"
        >
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-900">
                {comment.userName || comment.author}
              </span>
              {comment.createdAt && (
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString("bn-BD")}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {comment.commentText || comment.text}
            </p>
          </div>

          <button
            onClick={() => onDeleteComment(comment.id || comment._id)}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
            title="মন্তব্যটি মুছে ফেলুন"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};