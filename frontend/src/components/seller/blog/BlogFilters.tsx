import React from "react";
import { Search, Filter } from "lucide-react";

interface BlogFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  statusFilter: "all" | "published" | "draft" | "archived";
  setStatusFilter: (
    status: "all" | "published" | "draft" | "archived",
  ) => void;
  categories: string[];
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  categories,
}) => {
  return (
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
            {categories.map((cat) => (
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
  );
};