import React from 'react';

interface CategoryEmptyStateProps {
  searchQuery: string;
  onReset: () => void;
}

export const CategoryEmptyState: React.FC<CategoryEmptyStateProps> = ({ searchQuery, onReset }) => {
  return (
    <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm">
      <p className="text-gray-500 text-sm sm:text-base font-medium">
        "{searchQuery}" নামে কোনো ক্যাটাগরি পাওয়া যায়নি।
      </p>
      <button
        onClick={onReset}
        className="mt-4 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
      >
        সব ক্যাটাগরি আবার দেখুন
      </button>
    </div>
  );
};