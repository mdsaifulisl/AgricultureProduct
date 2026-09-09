import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import type { Product } from "../../../types/index";
import { ProductGrid } from "../../common/ProductGrid";
import { useProduct } from "../../../features/product/useProduct";
import { ProductGridSkeleton } from "../../common/ProductGridSkeleton";

interface FeaturedProductsProps {
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onAddToCart,
  onAddToWishlist,
}) => {
  // useProduct হুক থেকে ডাইনামিক ডেটা লোড করা হচ্ছে
  const { products = [], isLoading, isError, error } = useProduct(true);

  // লোডিং স্টেট হ্যান্ডলিং
if (isLoading) {
    return (
      <div className="space-y-10 lg:space-y-16 bg-gray-50/60 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ProductGridSkeleton count={4} showHeader={true} />
          <ProductGridSkeleton count={4} showHeader={true} />
        </div>
      </div>
    );
  }

  // এরর স্টেট হ্যান্ডলিং
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50/60 px-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
        <p className="text-base font-bold text-gray-800">পণ্য লোড করতে সমস্যা হয়েছে</p>
        <p className="text-xs text-gray-500 max-w-sm mt-1">
          {error || "কিছু ভুল হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।"}
        </p>
      </div>
    );
  }

  // API থেকে পাওয়া প্রোডাক্টগুলোর ইউনিক ক্যাটাগরি ফিল্টার করা
  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  );

  return (
    <div className="space-y-10 lg:space-y-16 bg-gray-50/60 py-10 lg:py-16">
      {categories.map((category) => {
        // প্রতিটি ক্যাটাগরির প্রথম ৪টি প্রোডাক্ট ফিল্টার করা
        const categoryProducts = products
          .filter((product) => product.category === category)
          .slice(0, 4);

        if (categoryProducts.length === 0) return null;

        return (
          <section key={category}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 lg:mb-8 gap-4 border-b border-gray-200/80 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary-100/80 text-primary-800 border border-primary-200/60 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                    <span>ক্যাটাগরি</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {category}
                  </h2>
                </div>

                <Link
                  to={`/shop?category=${encodeURIComponent(category)}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-700 hover:text-primary-800 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-xs transition-all self-start md:self-auto cursor-pointer hover:bg-gray-50"
                >
                  <span>{category}-এর সব পণ্য</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Reusable Product Grid (Showing 4 items) */}
              <ProductGrid
                products={categoryProducts}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
};