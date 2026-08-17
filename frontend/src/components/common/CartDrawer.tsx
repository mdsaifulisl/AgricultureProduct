import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit?: string;
  image: string;
  quantity: number;
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}
 export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-primary-950 text-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-accent-400" />
              <h2 className="text-lg font-bold">আপনার শপিং কার্ট</h2>
              <span className="bg-primary-800 text-primary-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {items.length} টি পণ্য
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-primary-200 hover:text-white rounded-xl hover:bg-primary-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-gray-800">কার্ট খালি রয়েছে</p>
                <p className="text-xs text-gray-500 max-w-xs">
                  আপনার পছন্দমতো কৃষিপণ্য কার্টে যোগ করতে শপ পেজ ব্রাউজ করুন।
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 bg-primary-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors cursor-pointer"
                >
                  পণ্য কেনাকাটা শুরু করুন
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-3.5 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-primary-100 hover:shadow-xs transition-all"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100 bg-white"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                    <div className="text-xs font-semibold text-primary-700 mt-0.5">
                      {item.price}৳ <span className="text-[10px] text-gray-500 font-normal">/ {item.unit}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-800 w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between self-stretch">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-gray-900">
                      {item.price * item.quantity}৳
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/80 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">সর্বমোট মূল্য</span>
                <span className="text-lg font-black text-primary-700">{subtotal}৳</span>
              </div>
              <p className="text-[10px] text-gray-500">
                ডেলিভারি চার্জ চেকআউট পেজে হিসাব করা হবে।
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex items-center justify-center text-xs font-bold text-gray-700 bg-white border border-gray-200 py-3 rounded-xl hover:bg-gray-100 transition-all text-center"
                >
                  কার্ট দেখুন
                </Link>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 py-3 rounded-xl shadow-xs transition-all text-center"
                >
                  <span>অর্ডার করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

