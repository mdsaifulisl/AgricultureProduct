import React from "react";
import { ArrowLeft, Heart, Share2, CheckCircle2 } from "lucide-react";

interface BlogHeaderNavProps {
  onBack: () => void;
  onLikeToggle: () => void;
  onCopyLink: () => void;
  isLiked: boolean;
  totalLikes: number;
  copied: boolean;
}

export const BlogHeaderNav: React.FC<BlogHeaderNavProps> = ({
  onBack,
  onLikeToggle,
  onCopyLink,
  isLiked,
  totalLikes,
  copied,
}) => {
  return (
    <div className="bg-white border-b border-gray-100 py-4 sticky top-20 z-30 shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ব্লগ তালিকায় ফিরুন</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onLikeToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isLiked
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isLiked ? "fill-rose-600 text-rose-600" : ""
              }`}
            />
            <span>{totalLikes}</span>
          </button>

          <button
            onClick={onCopyLink}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors relative cursor-pointer"
            title="লিঙ্ক কপি করুন"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};