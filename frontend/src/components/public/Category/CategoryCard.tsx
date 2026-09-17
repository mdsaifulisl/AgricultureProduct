import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  description: string;
  badge?: string;
}

interface CategoryCardProps {
  category: CategoryItem;
  onClick: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div
      onClick={() => onClick(category.name)}
      className="group relative rounded-2xl border border-gray-100 bg-white p-2.5 sm:p-4 lg:p-5 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Top Image Container */}
        <div className="relative w-full aspect-4/3 sm:aspect-16/9 rounded-xl overflow-hidden mb-2.5 sm:mb-3 bg-gray-50">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Optional Badge */}
          {category.badge && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
              {category.badge}
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="space-y-1 px-1">
          <h3 className="text-sm sm:text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {category.name}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {category.description}
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-2 sm:pt-4 mt-2 sm:mt-4 border-t border-gray-100/80 flex items-center justify-between px-1">
        <span className="text-[10px] sm:text-xs font-bold text-emerald-700 group-hover:underline truncate">
          ব্রাউজ করুন
        </span>
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};