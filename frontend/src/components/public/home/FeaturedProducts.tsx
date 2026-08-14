import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "../../common/ProductCard";
import { ProductGrid } from "../../common/ProductGrid";
import ProductData from "../../../data/products.json";


const FEATURED_PRODUCTS: Product[] = ProductData as Product[];

interface FeaturedProductsProps {
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onAddToCart,
  onAddToWishlist,
}) => {
  return (
    <section className="py-10 lg:py-16 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 lg:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-100/80 text-primary-800 border border-primary-200/60 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent-500" />
              <span>জনপ্রিয় পণ্যসমূহ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              ফিচার্ড প্রোডাক্টস
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-normal mt-1 max-w-xl">
              সেরা মান ও সাশ্রয়ী মূল্যে আমাদের গ্রাহকদের সবচেয়ে পছন্দের
              কৃষিপণ্য বেছে নিন।
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-700 hover:text-primary-800 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-xs transition-all self-start md:self-auto cursor-pointer"
          >
            <span>সব পণ্য দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Reusable Product Grid */}
        <ProductGrid
          products={FEATURED_PRODUCTS.slice(0, 8)}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
        />
      </div>
    </section>
  );
};
