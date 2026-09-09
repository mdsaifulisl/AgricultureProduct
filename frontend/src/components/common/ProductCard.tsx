import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, XCircle } from 'lucide-react';
import type { Product } from '../../types/index';
import { useCart } from '../../features/cartSlice/useCart';
import { parseProductUnit } from '../../utils/unitParser';
import { useAppDispatch } from '../../app/hooks';
import { showToast } from '../../features/toast/toastSlice';

export interface ProductSpecification {
  key: string;
  value: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
}) => {
  const dispatch = useAppDispatch();
  const { addToCart } = useCart();

  const primaryImage = product.images?.[0] || '';
  const secondaryImage = product.images?.[1];

  const handleAddToCart = async () => {
    // ইউনিট থেকে কোয়ান্টিটি, বেস অ্যামাউন্ট এবং লেবেল পার্স করা
    const { initialQuantity, baseAmount, unitLabel } = parseProductUnit(product.unit);

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: primaryImage,
        sku: product.sku,
        unit: unitLabel || product.unit,
        baseAmount: baseAmount || initialQuantity || 1, 
      },
      initialQuantity // ২০০, ০.৫ বা ১
    );

    // parent handler থাকলে তা চালানো
    if (onAddToCart) {
      await onAddToCart(product);
    } 

    // সব সময়ই টোস্ট ডিসপ্যাচ হবে
    dispatch(showToast('কার্টে যোগ করা হয়েছে!', 'success'));
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
      dispatch(showToast('উইশলিস্টে যোগ করা হয়েছে!', 'info'));
    }
  };

  const isOutOfStock = product.inStock === false;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-2.5 sm:p-4 shadow-xs hover:shadow-xl hover:border-primary-200 transition-all duration-300 flex flex-col justify-between relative">
      <div>
        {/* Product Image, Badges & Wishlist */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2.5">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
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
          </Link>

          {product.badge && (
            <span className="absolute top-2 left-2 z-10 bg-accent-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              {product.badge}
            </span>
          )}

          {onAddToWishlist && (
            <button
              onClick={handleAddToWishlist}
              className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-colors shadow-xs cursor-pointer"
              title="উইশলিস্টে যোগ করুন"
            >
              <Heart className="w-3.5 h-3.5" />
            </button>
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
          {product.unit && (
            <span className="text-[10px] text-gray-500 font-normal">
              / {product.unit}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-1.5 font-bold text-xs py-2 sm:py-2.5 px-3 rounded-xl shadow-xs transition-all ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none'
              : 'bg-primary-600 hover:bg-primary-700 active:scale-95 text-white cursor-pointer'
          }`}
        >
          {isOutOfStock ? (
            <>
              <XCircle className="w-3.5 h-3.5 text-gray-400" />
              <span>স্টক আউট</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>কার্টে যোগ করুন</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};