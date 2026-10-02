/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  RotateCcw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useProduct } from "../../../features/product/useProduct";
import { useCart } from '../../../features/cartSlice/useCart';
import { parseProductUnit } from '../../../utils/unitParser'; 

export const ProductDetails: React.FC = () => { 
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { products, isLoading, isError, error, fetchAllProducts } = useProduct();
  const { addToCart } = useCart();

  // ১. পেজ রিলোড হলে যদি products খালি থাকে, তবে প্রোডাক্ট ফেচ করুন
  useEffect(() => {
    if (products.length === 0) {
      fetchAllProducts();
    }
  }, [fetchAllProducts, products.length]);

  const product = products.find((item) => String(item.id) === String(id));

  const imagesList: string[] = product?.images
    ? (Array.isArray(product.images) ? product.images : [product.images])
    : [''];

  const [selectedImage, setSelectedImage] = useState<string>('');

  const currentImage = imagesList.includes(selectedImage)
    ? selectedImage
    : imagesList[0] || '';

  const { initialQuantity, baseAmount, unitLabel } = parseProductUnit(product?.unit);

  const STEP_SIZE = initialQuantity || 1;
  const MIN_QUANTITY = initialQuantity || 1;

  const [quantityState, setQuantityState] = useState({
    productId: id,
    value: MIN_QUANTITY,
  });

  // প্রোডাক্ট লোড হলে Quantity Sync করা
  useEffect(() => {
    if (product) {
      setQuantityState({
        productId: id,
        value: initialQuantity || 1,
      });
    }
  }, [product, initialQuantity, id]);

  const quantity = quantityState.productId === id
    ? quantityState.value
    : MIN_QUANTITY;

  const setQuantity = (value: number | ((previous: number) => number)) => {
    setQuantityState(() => ({
      productId: id,
      value: typeof value === 'function' ? value(quantity) : value,
    }));
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    
    if (isNaN(val) || val < MIN_QUANTITY) {
      setQuantity(MIN_QUANTITY);
      return;
    }

    setQuantity(Number(val.toFixed(2)));
  };

  const calculatedTotalPrice = Math.round((product?.price || 0) / (baseAmount || 1) * quantity);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: currentImage,
        sku: product.sku,
        unit: unitLabel || product.unit,
        baseAmount: baseAmount || 1,
      },
      quantity
    );
  };

  // ২. সঠিক লোডিং স্টেট চেক: ডাটা ফেচিং চলায় অথবা products খালি থাকলে Loader দেখাবে
  if (isLoading || (products.length === 0 && !isError)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 text-primary-600">
        <Loader2 className="w-10 h-10 animate-spin mb-3" />
        <p className="text-sm font-medium text-gray-600">প্রোডাক্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  // ৩. এরর স্টেট হ্যান্ডলিং
  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-1">সমস্যা দেখা দিয়েছে!</h2>
        <p className="text-gray-600 text-sm mb-4">{error || 'ডাটা ফেচ করতে সমস্যা হচ্ছে।'}</p>
        <button
          onClick={() => fetchAllProducts()}
          className="bg-primary-600 text-white font-bold px-5 py-2 rounded-xl text-sm cursor-pointer"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  // ৪. প্রোডাক্ট সত্যি না থাকলে (ডাটা ফেচিং শেষ হওয়ার পর)
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 text-center">
        <Helmet>
          <title>প্রোডাক্ট পাওয়া যায়নি</title>
        </Helmet>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">প্রোডাক্টটি পাওয়া যায়নি!</h2>
        <p className="text-gray-600 mb-6 text-sm">আপনি যে প্রোডাক্টটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ইউআরএল ভুল।</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm cursor-pointer"
        >
          ফিরে যান
        </button>
      </div>
    );
  }

  const metaDescription = product.metaDescription 
    || product.shortDescription 
    || `${product.name} সেরা দামে কিনুন। ${product.description?.slice(0, 150) || ''}...`;

  return (
    <div className="bg-gray-50/50 py-8 lg:py-12">
      <Helmet>
        <title>{product.name}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={currentImage} />
        <meta property="og:type" content="product" />
      </Helmet>

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
                  src={currentImage}
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
                        currentImage === img 
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

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 leading-tight mb-3">
                  {product.name}
                </h1>

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

                <div className="flex flex-wrap items-baseline gap-3 p-4 bg-gray-50/80 rounded-2xl mb-6">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">
                    {product.price}৳
                  </span>
                  
                  {product.originalPrice && (
                    <span className="text-base text-gray-400 line-through font-normal">
                      {product.originalPrice}৳
                    </span>
                  )}

                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    / {product.unit}
                  </span>

                  <div className="ml-auto bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold">
                    মোট: {calculatedTotalPrice}৳
                  </div>
                </div>

                {(product.shortDescription || product.description) && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {product.shortDescription || product.description}
                  </p>
                )}

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
                          className="w-14 text-center font-bold text-sm text-gray-900 bg-transparent outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs font-medium text-gray-500 pr-2">
                          {unitLabel || product.unit}
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