import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  bnName: string;
  itemCount: number;
  image: string;
  icon: string;
  description: string;
  slug: string;
  badge?: string;
  bgGradient: string;
}

interface CategoryCardProps {
  category: CategoryItem;
  onClick: (slug: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div
      onClick={() => onClick(category.slug)}
      className="group relative rounded-2xl border border-gray-100 bg-white p-2.5 sm:p-4 lg:p-5 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      {/* Background Subtle Gradient Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

      <div>
        {/* Top Image Container */}
        <div className="relative w-full aspect-4/3 sm:aspect-16/9 rounded-xl overflow-hidden mb-2.5 sm:mb-3 bg-gray-50">
          <img
            src={category.image}
            alt={category.bnName}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Emoji Icon */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-md w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-xl shadow-md border border-white/50">
            {category.icon}
          </div>

          {/* Optional Badge */}
          {category.badge && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
              {category.badge}
            </div>
          )}

          {/* Item Count */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-gray-900/80 backdrop-blur-xs text-white text-[9px] sm:text-[11px] font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-1">
            <Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
            <span>{category.itemCount}+ টি</span>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1 px-1">
          <h3 className="text-xs sm:text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {category.bnName}
          </h3>
          <p className="hidden sm:block text-xs text-gray-500 leading-relaxed line-clamp-2">
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