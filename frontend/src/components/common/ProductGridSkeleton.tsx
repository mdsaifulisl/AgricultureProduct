import React from "react";

interface ProductSkeletonProps {
  /** কয়টি প্রোডাক্ট কার্ড ডামি লোডার হিসেবে দেখাতে চান (Default: 4) */
  count?: number;
  /** সেকশন হেডার ডামি লোডার দেখাবে কিনা (Default: true) */
  showHeader?: boolean;
}

// 💀 একক প্রোডাক্ট কার্ড স্কেলিটন
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs animate-pulse space-y-3">
      {/* প্রোডাক্ট ইমেজ */}
      <div className="w-full h-44 sm:h-48 bg-gray-200 rounded-xl" />

      {/* টাইটেল */}
      <div className="h-4 bg-gray-200 rounded-md w-3/4" />

      {/* প্রাইস ও ইউনিট */}
      <div className="h-3 bg-gray-200 rounded-md w-1/2" />

      {/* বাটন */}
      <div className="h-9 bg-gray-200 rounded-xl w-full mt-2" />
    </div>
  );
};

// 💀 সম্পূর্ণ প্রোডাক্ট গ্রিড ও হেডার স্কেলিটন
export const ProductGridSkeleton: React.FC<ProductSkeletonProps> = ({
  count = 4,
  showHeader = true,
}) => {
  return (
    <div className="space-y-6">
      {/* সেকশন হেডার স্কেলিটন (ঐচ্ছিক) */}
      {showHeader && (
        <div className="flex justify-between items-end pb-4 border-b border-gray-200/80 animate-pulse">
          <div className="space-y-2">
            <div className="h-5 w-24 bg-gray-200 rounded-full" />
            <div className="h-7 w-40 bg-gray-200 rounded-md" />
          </div>
          <div className="h-8 w-32 bg-gray-200 rounded-xl hidden sm:block" />
        </div>
      )}

      {/* ডামি কার্ড গ্রিড */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

