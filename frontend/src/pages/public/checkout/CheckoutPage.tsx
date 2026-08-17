/* eslint-disable react-hooks/purity */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag, 
  FileText 
} from 'lucide-react';

export type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  unit?: string;
  image: string;
  quantity: number;
};

// UI টেস্ট করার জন্য ডামি ডেটা
const DEMO_CHECKOUT_ITEMS: CheckoutItem[] = [
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
    name: 'সুন্দরবনের প্রাকৃতিক মধু',
    price: 850,
    unit: 'কেজি',
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=300',
    quantity: 1,
  },
];

type LocationZone = 'dhaka' | 'outside';

export const CheckoutPage: React.FC = () => {
  const [items] = useState<CheckoutItem[]>(DEMO_CHECKOUT_ITEMS);
  const [shippingZone, setShippingZone] = useState<LocationZone>('dhaka');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
  });

  const deliveryFee = shippingZone === 'dhaka' ? 60 : 120;
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const grandTotal = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে!
        </h1>
        <p className="text-sm text-gray-600 max-w-md mb-6">
          ধন্যবাদ <span className="font-bold text-gray-900">{formData.fullName}</span>। আমাদের প্রতিনিধি খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
        </p>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 max-w-sm w-full text-left mb-6 space-y-2 text-sm">
          <p className="flex justify-between text-gray-600">
            <span>অর্ডার ট্র্যাকিং আইডি:</span>
            // eslint-disable-next-line react-hooks/purity
            <span className="font-bold text-gray-900">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
          </p>
          <p className="flex justify-between text-gray-600">
            <span>মোট টাকা:</span>
            <span className="font-bold text-primary-700">{grandTotal}৳</span>
          </p> 
          <p className="flex justify-between text-gray-600">
            <span>পেমেন্ট মেথড:</span>
            <span className="font-medium text-gray-800">ক্যাশ অন ডেলিভারি</span>
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-primary-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>আরও কেনাকাটা করুন</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কার্টে ফিরে যান</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">চেকআউট</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          অর্ডারটি সম্পন্ন করতে আপনার ডেলিভারি তথ্য প্রদান করুন
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shipping & Customer Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
              <User className="w-5 h-5 text-primary-600" />
              <span>ডেলিভারি তথ্য</span>
            </h2>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                আপনার নাম <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="যেমন: মোঃ রহিম হোসেন"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                মোবাইল নম্বর <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Delivery Area Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                ডেলিভারি এরিয়া সিলেক্ট করুন <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  onClick={() => setShippingZone('dhaka')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingZone === 'dhaka'
                      ? 'border-primary-600 bg-primary-50/30'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingZone"
                      checked={shippingZone === 'dhaka'}
                      onChange={() => setShippingZone('dhaka')}
                      className="accent-primary-600"
                    />
                    <span className="text-xs sm:text-sm font-bold text-gray-800">ঢাকার ভেতরে</span>
                  </div>
                  <span className="text-xs font-bold text-primary-700">৬০৳</span>
                </label>

                <label
                  onClick={() => setShippingZone('outside')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingZone === 'outside'
                      ? 'border-primary-600 bg-primary-50/30'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shippingZone"
                      checked={shippingZone === 'outside'}
                      onChange={() => setShippingZone('outside')}
                      className="accent-primary-600"
                    />
                    <span className="text-xs sm:text-sm font-bold text-gray-800">ঢাকার বাইরে</span>
                  </div>
                  <span className="text-xs font-bold text-primary-700">১২০৳</span>
                </label>
              </div>
            </div>

            {/* Full Address Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="হাউজ নম্বর, রোড নম্বর, এলাকা, থানা, জেলা"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Note / Special Request */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                অর্ডার নোট (ঐচ্ছিক)
              </label>
              <div className="relative">
                <textarea
                  name="note"
                  rows={2}
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="বিশেষ কোনো নির্দেশনা থাকলে লিখতে পারেন..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                />
                <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-600" />
              <span>পেমেন্ট পদ্ধতি</span>
            </h2>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">ক্যাশ অন ডেলিভারি (COD)</p>
                  <p className="text-xs text-gray-500">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
                </div>
              </div>
              <Truck className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-5 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
              <span>অর্ডার বিবরণী</span>
              <span className="text-xs font-semibold text-gray-500">({items.length} টি পণ্য)</span>
            </h2>

            {/* Selected Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      {item.price}৳ × {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-900 shrink-0">
                    {item.price * item.quantity}৳
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>উপ-মোট (Subtotal)</span>
                <span className="font-bold text-gray-900">{subtotal}৳</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-bold text-gray-900">{deliveryFee}৳</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">সর্বমোট</span>
              <span className="text-xl font-black text-primary-700">{grandTotal}৳</span>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 py-4 rounded-xl shadow-xs transition-all cursor-pointer mt-4"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>অর্ডার কনফার্ম করুন ({grandTotal}৳)</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;