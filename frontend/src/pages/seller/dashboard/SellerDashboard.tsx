import React from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const stats = [
    { title: 'মোট বিক্রি', value: '৪৫,২০০৳', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'মোট অর্ডার', value: '১২৮ টি', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { title: 'মোট পণ্য', value: '২৪ টি', icon: Package, color: 'bg-purple-50 text-purple-600' },
    { title: 'পেন্ডিং অর্ডার', value: '৫ টি', icon: Clock, color: 'bg-amber-50 text-amber-600' },
  ];

  const recentOrders = [
    { id: '#ORD-9821', customer: 'মোঃ করিম', amount: '১২৫০৳', status: 'প্রসেসিং', date: '১৭ আগস্ট, ২০২৬' },
    { id: '#ORD-9820', customer: 'রাহেলা বেগম', amount: '৬৫০৳', status: 'ডেলিভার্ড', date: '১৬ আগস্ট, ২০২৬' },
    { id: '#ORD-9819', customer: 'হাসান মাহমুদ', amount: '২১০০৳', status: 'পেন্ডিং', date: '১৬ আগস্ট, ২০২৬' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ড্যাশবোর্ড ওভারভিউ</h1>
        <p className="text-xs text-gray-500 mt-1">আপনার স্টোরের বর্তমান অবস্থা একনজরে দেখুন</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500">{stat.title}</p>
                <h3 className="text-xl font-black text-gray-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">সাম্প্রতিক অর্ডারসমূহ</h2>
          <button className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer">
            <span>সব দেখুন</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase font-bold">
                <th className="pb-3">অর্ডার আইডি</th>
                <th className="pb-3">গ্রাহক</th>
                <th className="pb-3">মূল্য</th>
                <th className="pb-3">স্ট্যাটাস</th>
                <th className="pb-3 text-right">তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 font-bold text-gray-900">{order.id}</td>
                  <td className="py-3.5 text-gray-700">{order.customer}</td>
                  <td className="py-3.5 font-bold text-gray-800">{order.amount}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      order.status === 'ডেলিভার্ড' ? 'bg-green-50 text-green-600' :
                      order.status === 'প্রসেসিং' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};