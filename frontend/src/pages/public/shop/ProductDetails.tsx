import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Check, 
  XCircle, 
  Star, 
  Plus, 
  Minus, 
  ChevronRight, 
  Truck, 
  ShieldCheck, 
  RotateCcw 
} from 'lucide-react';

import PRODUCTS_DATA from "../../../data/products.json";
import { type Product } from "../../../components/common/ProductCard";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // আইডি দিয়ে নির্দিষ্ট প্রোডাক্ট খোঁজা
  const product = PRODUCTS_DATA.find((item) => item.id === id) as Product | undefined;

  const imagesList = product?.images && product.images.length > 0 
    ? product.images 
    : [product?.image || ''];

  const [selectedImage, setSelectedImage] = useState<string>('');

  // ইউনিট অনুযায়ী ডায়নামিক Step ও Min Quantity নির্ধারণ
  const isPieceUnit = ['টি', 'প্যাকেট', 'জোড়া', 'বক্স', 'পিস'].includes(
    product?.unit?.trim() || ''
  );

  const STEP_SIZE = isPieceUnit ? 1 : 0.5;
  const MIN_QUANTITY = isPieceUnit ? 1 : 0.5;

  const [quantity, setQuantity] = useState<number>(MIN_QUANTITY);

  // প্রোডাক্ট লোড হলে ডিফল্ট ইমেজ ও ইনিশিয়াল কোয়ান্টিটি সেট করা
  useEffect(() => {
    if (imagesList.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedImage(imagesList[0]);
    }
    setQuantity(MIN_QUANTITY);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">প্রোডাক্টটি পাওয়া যায়নি!</h2>
        <p className="text-gray-600 mb-6 text-sm">আপনি যে প্রোডাক্টটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ইউআরএল ভুল।</p>
        <Link
          to="/"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  // + এবং - বাটনের জন্য হ্যান্ডলার
  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (type === 'dec') {
      setQuantity((prev) => {
        const nextVal = prev - STEP_SIZE;
        return nextVal >= MIN_QUANTITY ? Number(nextVal.toFixed(2)) : MIN_QUANTITY;
      });
    } else if (type === 'inc') {
      setQuantity((prev) => Number((prev + STEP_SIZE).toFixed(2)));
    }
  };

  // ম্যানুয়াল ইনপুটের জন্য হ্যান্ডলার
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    
    if (isNaN(val) || val < MIN_QUANTITY) {
      setQuantity(MIN_QUANTITY);
      return;
    }

    if (isPieceUnit) {
      setQuantity(Math.floor(val));
    } else {
      setQuantity(Number(val.toFixed(2)));
    }
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', { 
      product, 
      quantity, 
      totalPrice: Number((product.price * quantity).toFixed(2)) 
    });
  };

  return (
    <div className="bg-gray-50/50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6 lg:mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-primary-600 transition-colors">হোম</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* Main Product Details */}
        <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Gallery Section */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                <img
                  src={selectedImage || imagesList[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {imagesList.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {imagesList.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        (selectedImage || imagesList[0]) === img 
                          ? 'border-primary-600 ring-2 ring-primary-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category & Stock Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-md">
                    {product.category}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {product.inStock !== false ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                        <Check className="w-3.5 h-3.5" /> স্টকে আছে
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                        <XCircle className="w-3.5 h-3.5" /> স্টক আউট
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="ml-1 text-sm font-bold text-gray-900">{product.rating}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      ({product.reviewsCount || 0} টি রিভিউ)
                    </span>
                  </div>
                )}

                {/* Price Display */}
                <div className="flex items-baseline gap-3 p-4 bg-gray-50/80 rounded-2xl mb-6">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">
                    {(product.price * quantity).toFixed(0)}৳
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-gray-400 line-through font-normal">
                      {(product.originalPrice * quantity).toFixed(0)}৳
                    </span>
                  )}
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    ({quantity} {product.unit})
                  </span>
                </div>

                {/* Description */}
                {(product.shortDescription || product.description) && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {product.shortDescription || product.description}
                  </p>
                )}

                {/* Dynamic Quantity Controls */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-700">পরিমাণ:</span>
                    <div className="inline-flex items-center border border-gray-200 rounded-xl bg-gray-50">
                      <button
                        onClick={() => handleQuantityChange('dec')}
                        disabled={quantity <= MIN_QUANTITY}
                        className="p-2.5 text-gray-600 hover:text-gray-900 disabled:opacity-40 transition-colors cursor-pointer"
                        aria-label="পরিমাণ কমান"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="flex items-center px-1">
                        <input
                          type="number"
                          step={STEP_SIZE}
                          min={MIN_QUANTITY}
                          value={quantity}
                          onChange={handleInputChange}
                          className="w-12 text-center font-bold text-sm text-gray-900 bg-transparent outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs font-medium text-gray-500 pr-2">
                          {product.unit}
                        </span>
                      </div>

                      <button
                        onClick={() => handleQuantityChange('inc')}
                        className="p-2.5 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                        aria-label="পরিমাণ বাড়ান"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.inStock === false}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-98 text-white font-bold py-3.5 px-6 rounded-xl shadow-xs disabled:bg-gray-300 disabled:cursor-not-allowed transition-all cursor-pointer text-sm sm:text-base"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>কার্টে যোগ করুন</span>
                    </button>

                    <button
                      className="p-3.5 rounded-xl border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                      aria-label="Wishlist-এ যোগ করুন"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Features */}
              <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-gray-100 text-center">
                <div className="p-2 rounded-xl bg-gray-50 flex flex-col items-center">
                  <Truck className="w-5 h-5 text-primary-600 mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">দ্রুত ডেলিভারি</span>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-primary-600 mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">১০০% খাঁটি</span>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 flex flex-col items-center">
                  <RotateCcw className="w-5 h-5 text-primary-600 mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">সহজ রিটার্ন</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-gray-900 mb-4">বিস্তারিত তথ্য</h3>
          
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {Array.isArray(product.specifications) && product.specifications.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-gray-900 mb-3">বৈশিষ্ট্যসমূহ:</h4>
              <div className="max-w-md border border-gray-100 rounded-xl overflow-hidden text-xs sm:text-sm">
                {product.specifications.map((spec, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between p-3 ${index % 2 === 0 ? 'bg-gray-50/60' : 'bg-white'}`}
                  >
                    <span className="font-semibold text-gray-600">{spec.key}</span>
                    <span className="font-medium text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};