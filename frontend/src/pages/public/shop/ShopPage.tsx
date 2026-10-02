/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { type Product } from "../../../types/index";
import { ProductGrid } from "../../../components/common/ProductGrid";
import { useProduct } from "../../../features/product/useProduct";
import { ProductGridSkeleton } from "../../../components/common/ProductGridSkeleton";

const ITEMS_PER_PAGE = 8;

interface ShopPageProps {
  onAddToCart?: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux Store থেকে Real Product Data ও Loading State নিয়ে আসা
  const { products, isLoading, isError, error } = useProduct();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1. প্রোডাক্টগুলোর ডাটা থেকে ডায়নামিক ইউনিক ক্যাটাগরি তৈরি
  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>();

    products.forEach((product) => {
      const prodCat =
        typeof product.category === "string"
          ? product.category
          : (product.category as any)?.name || "";

      if (prodCat.trim() !== "") {
        categorySet.add(prodCat.trim());
      }
    });

    return Array.from(categorySet);
  }, [products]);

  // URL searchParams থেকে Selected Category বের করা
  const selectedCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (categoryName: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryName === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", categoryName);
    }
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  // 2. Filtered Products Calculation (Dynamic Categories matching)
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const prodCat =
          typeof product.category === "string"
            ? product.category
            : (product.category as any)?.name || "";

        const matchesCategory =
          selectedCategory === "all" ||
          prodCat.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prodCat.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPrice = product.price <= maxPrice;
        const matchesStock = inStockOnly
          ? product.stockCount !== undefined
            ? product.stockCount > 0
            : Boolean(product.inStock)
          : true;

        return matchesCategory && matchesSearch && matchesPrice && matchesStock;
      })
      .slice()
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy, maxPrice, inStockOnly]);

  // Page Switch এ স্ক্রোল আপ
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleResetFilters = () => {
    handleCategoryChange("all");
    setMaxPrice(2000);
    setInStockOnly(false);
    setSearchQuery("");
    setSortBy("default");
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50/60 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            আমাদের শপ ক্যাটালগ
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            ক্ষেতের তাজা সবজি, ফলমূল, উন্নত বীজ এবং কৃষি সরঞ্জাম অনলাইনে অর্ডার
            করুন।
          </p>
        </div>

        {/* Search and Top Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="পণ্য বা ক্যাটাগরি দিয়ে খুঁজুন..."
              className="w-full bg-gray-50 border border-gray-200 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-primary-600 transition-colors"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary-600" />
              <span>ফিল্টার</span>
            </button>

            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 py-2.5 pl-3.5 pr-8 rounded-xl focus:outline-none focus:border-primary-600 cursor-pointer"
              >
                <option value="default">ডিফল্ট সাজানো</option>
                <option value="price-low">কম দাম থেকে শুরু</option>
                <option value="price-high">বেশি দাম থেকে শুরু</option>
                <option value="rating">সেরা রেটিং</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white border border-gray-100 p-5 rounded-2xl shadow-xs h-fit">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                ক্যাটাগরি
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`w-full text-left text-xs sm:text-sm font-medium px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-primary-50 text-primary-700 font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  সকল ক্যাটাগরি
                </button>

                {availableCategories.map((catName) => (
                  <button
                    key={catName}
                    onClick={() => handleCategoryChange(catName)}
                    className={`w-full text-left text-xs sm:text-sm font-medium px-3 py-2 rounded-xl transition-colors cursor-pointer capitalize ${
                      selectedCategory.toLowerCase() === catName.toLowerCase()
                        ? "bg-primary-50 text-primary-700 font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {catName}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900">
                  সর্বোচ্চ দাম
                </h3>
                <span className="text-xs font-bold text-primary-700">
                  {maxPrice}৳
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="2000"
                step="10"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-primary-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-1">
                <span>৩০৳</span>
                <span>২,০০০৳</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-gray-700">
                  শুধু স্টকে থাকা পণ্য
                </span>
              </label>
            </div>

            <button
              onClick={handleResetFilters}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              ফিল্টার রিসেট করুন
            </button>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <ProductGridSkeleton count={ITEMS_PER_PAGE} showHeader={false} />
            ) : isError ? (
              <div className="bg-white rounded-2xl border border-red-100 p-12 text-center space-y-3">
                <p className="text-base font-bold text-red-600">
                  ত্রুটি ঘটেছে!
                </p>
                <p className="text-xs text-gray-500">
                  {error || "ডাটা ফেচ করতে ব্যর্থ হয়েছে।"}
                </p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
                <p className="text-base font-bold text-gray-800">
                  কোনো পণ্য পাওয়া যায়নি!
                </p>
                <p className="text-xs text-gray-500">
                  আপনার সার্চ ফিল্টার বা ক্যাটাগরি পরিবর্তন করে আবার চেষ্টা
                  করুন।
                </p>
              </div>
            ) : (
              <>
                <ProductGrid
                  products={paginatedProducts.map((product) => ({
                    ...product,
                    category:
                      typeof product.category === "string"
                        ? product.category
                        : (product.category as any)?.name || "",
                    rating: product.rating ?? 0,
                    reviewsCount: product.reviewsCount ?? 0,
                    inStock:
                      product.inStock ??
                      (product.stockCount ? product.stockCount > 0 : false),
                    isFeatured: Boolean(product.isFeatured),
                  }))}
                  onAddToCart={onAddToCart}
                />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-gray-700 px-3">
                      পৃষ্ঠা {currentPage} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h2 className="text-base font-bold text-gray-900">
                  ফিল্টার করুন
                </h2>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  ক্যাটাগরি
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      handleCategoryChange("all");
                      setIsFilterDrawerOpen(false);
                    }}
                    className={`w-full text-left text-xs font-medium px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-primary-50 text-primary-700 font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    সকল ক্যাটাগরি
                  </button>

                  {availableCategories.map((catName) => (
                    <button
                      key={catName}
                      onClick={() => {
                        handleCategoryChange(catName);
                        setIsFilterDrawerOpen(false);
                      }}
                      className={`w-full text-left text-xs font-medium px-3 py-2 rounded-xl transition-colors cursor-pointer capitalize ${
                        selectedCategory.toLowerCase() === catName.toLowerCase()
                          ? "bg-primary-50 text-primary-700 font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {catName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    সর্বোচ্চ দাম
                  </h3>
                  <span className="text-xs font-bold text-primary-700">
                    {maxPrice}৳
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="2000"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="rounded text-primary-600 w-4 h-4"
                  />
                  <span className="text-xs font-medium text-gray-700">
                    শুধু স্টকে থাকা পণ্য
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full bg-primary-600 text-white text-xs font-bold py-3 rounded-xl mt-6 cursor-pointer"
            >
              ফলাফল দেখুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
