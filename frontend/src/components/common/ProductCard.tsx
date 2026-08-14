import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug?: string;
  price: number;
  originalPrice?: number;
  unit: string;
  rating?: number;
  reviewsCount?: number;
  image?: string;
  images?: string[];
  badge?: string;
  inStock?: boolean;
  description?: string;
  shortDescription?: string;
  specifications?: ProductSpecification[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart
}) => {
  const primaryImage = product.images?.[0] || product.image;
  const secondaryImage = product.images?.[1];

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-2.5 sm:p-4 shadow-xs hover:shadow-xl hover:border-primary-200 transition-all duration-300 flex flex-col justify-between relative">
      <div>
        {/* Product Image & Badges */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2.5">
          <img
            src={primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              secondaryImage 
                ? 'group-hover:opacity-0 group-hover:scale-105' 
                : 'group-hover:scale-105'
            }`}
            loading="lazy"
          />

          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} - alternate view`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
          )}

          {product.badge && (
            <span className="absolute top-2 left-2 z-10 bg-accent-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Category & Title */}
        <div className="text-[10px] sm:text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
          {product.category}
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug min-h-[30px] sm:min-h-[40px]">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
      </div>

      {/* Price & Add to Cart Button */}
      <div className="pt-2 border-t border-gray-100 mt-2">
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-sm sm:text-base font-black text-gray-900">
            {product.price}৳
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through font-normal">
              {product.originalPrice}৳
            </span>
          )}
          <span className="text-[10px] text-gray-500 font-normal">/ {product.unit}</span>
        </div>

        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          className="w-full flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold text-xs py-2 sm:py-2.5 px-3 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>কার্টে যোগ করুন</span>
        </button>
      </div>
    </div>
  );
};