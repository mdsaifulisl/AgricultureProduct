import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit?: string;
  image: string;
  quantity: number;
};

// UI টেস্ট করার জন্য ডামি ডেটা
const INITIAL_DEMO_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'অর্গানিক খাঁটি সরিষার তেল',
    price: 320,
    unit: 'লিটার',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300',
    quantity: 2,
  },
  {
    id: '2',
    name: 'সুন্দরবনের প্রাকৃতিক প্রাকৃতিক মধু',
    price: 850,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=300',
    quantity: 1,
  },
  {
    id: '3',
    name: 'প্রিমিয়াম প্রিমিয়াম নাজিরশাইল চাল',
    price: 95,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300',
    quantity: 5,
  },
];

export const CartPage: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>(INITIAL_DEMO_ITEMS);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">আপনার কার্ট খালি রয়েছে</h1>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          আপনার পছন্দমতো পণ্য কার্টে যোগ করতে শপ পেজ ব্রাউজ করুন।
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-primary-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কেনাকাটা শুরু করুন</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">শপিং কার্ট</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            মোট {items.length} টি পণ্য কার্টে আছে
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          সব খালি করুন
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="hidden sm:grid grid-cols-12 text-xs font-bold text-gray-500 uppercase px-4 pb-2 border-b border-gray-200">
            <span className="col-span-6">পণ্য</span>
            <span className="col-span-2 text-center">মূল্য</span>
            <span className="col-span-2 text-center">পরিমাণ</span>
            <span className="col-span-2 text-right">মোট</span>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-xs hover:border-primary-100 transition-all"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 col-span-6 w-full">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-gray-100 bg-gray-50"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.unit ? `প্রতি ${item.unit}` : ''}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="sm:hidden inline-flex items-center gap-1 text-xs text-red-500 font-semibold mt-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছে ফেলুন</span>
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="hidden sm:block col-span-2 text-center text-sm font-bold text-gray-800">
                {item.price}৳
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between sm:justify-center col-span-2 w-full sm:w-auto">
                <span className="sm:hidden text-xs text-gray-500 font-medium">পরিমাণ:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs sm:text-sm font-bold text-gray-800 w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Total Price & Desktop Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-4 col-span-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <span className="sm:hidden text-xs text-gray-500 font-medium">মোট:</span>
                <span className="text-sm font-bold text-primary-700">
                  {item.price * item.quantity}৳
                </span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="hidden sm:block text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>আরও কেনাকাটা করুন</span>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
              অর্ডার সামারি
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>উপ-মোট (Subtotal)</span>
                <span className="font-bold text-gray-900">{subtotal}৳</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ</span>
                <span className="text-xs text-gray-500">চেকআউটে হিসাব করা হবে</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">সর্বমোট</span>
              <span className="text-xl font-black text-primary-700">{subtotal}৳</span>
            </div>

            <Link
              to="/checkout"
              className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 py-3.5 rounded-xl shadow-xs transition-all text-center mt-4"
            >
              <span>অর্ডার সম্পন্ন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;