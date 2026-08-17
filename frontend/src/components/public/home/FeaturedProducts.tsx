import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "../../common/ProductCard";
import { ProductGrid } from "../../common/ProductGrid";
import ProductData from "../../../data/products.json";

const ALL_PRODUCTS: Product[] = ProductData as Product[];

interface FeaturedProductsProps {
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onAddToCart,
  onAddToWishlist,
}) => {
  // ইউনিক ক্যাটাগরিগুলোর একটি লিস্ট বের করা
  const categories = Array.from(
    new Set(ALL_PRODUCTS.map((product) => product.category).filter(Boolean))
  );

  return (
    <div className="space-y-10 lg:space-y-16 bg-gray-50/60 py-10 lg:py-16">
      {categories.map((category) => {
        // প্রতিটি ক্যাটাগরির প্রথম ৪টি প্রোডাক্ট নেওয়া হচ্ছে
        const categoryProducts = ALL_PRODUCTS.filter(
          (product) => product.category === category
        ).slice(0, 4);

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