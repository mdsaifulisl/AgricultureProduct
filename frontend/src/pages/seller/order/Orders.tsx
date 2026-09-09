import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  PackageCheck, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  X,
  Edit3
} from 'lucide-react';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'COD' | 'bKash' | 'Nagad' | 'Card';
  paymentStatus: 'Paid' | 'Unpaid';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-1092',
    customerName: 'আরিফুল ইসলাম',
    phone: '01712345678',
    address: 'মিরপুর ১২, ঢাকা',
    items: [
      { id: '1', name: 'তাজা প্রিমিয়াম লাল টমেটো', price: 60, quantity: 2, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150' },
      { id: '2', name: 'দেশি শসা', price: 40, quantity: 1, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=150' }
    ],
    totalAmount: 220,
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    orderStatus: 'Pending',
    createdAt: '2026-08-17T10:30:00'
  },
  {
    id: 'ORD-1091',
    customerName: 'সুমাইয়া আক্তার',
    phone: '01887654321',
    address: 'ধানমন্ডি ২৭, ঢাকা',
    items: [
      { id: '3', name: 'জৈব কম্পোস্ট সার', price: 350, quantity: 2, image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=150' }
    ],
    totalAmount: 760,
    paymentMethod: 'bKash',
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    createdAt: '2026-08-16T14:15:00'
  },
  {
    id: 'ORD-1090',
    customerName: 'মেহেদী হাসান',
    phone: '01911223344',
    address: 'জিইসি মোড়, চট্টগ্রাম',
    items: [
      { id: '4', name: 'প্রিমিয়াম আম রূপালি', price: 120, quantity: 5, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=150' }
    ],
    totalAmount: 720,
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    orderStatus: 'Shipped',
    createdAt: '2026-08-15T09:00:00'
  },
  {
    id: 'ORD-1089',
    customerName: 'নাসরিন সুলতানা',
    phone: '01555667788',
    address: 'উপশহর, সিলেট',
    items: [
      { id: '1', name: 'তাজা প্রিমিয়াম লাল টমেটো', price: 60, quantity: 3, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150' }
    ],
    totalAmount: 300,
    paymentMethod: 'Nagad',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    createdAt: '2026-08-14T11:45:00'
  }
];

export const SellerOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status Change Handler Function
  const handleStatusChange = (orderId: string, newStatus: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedPaymentStatus = newStatus === 'Delivered' ? 'Paid' : order.paymentStatus;
          return { ...order, orderStatus: newStatus, paymentStatus: updatedPaymentStatus };
        }
        return order;
      })
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              orderStatus: newStatus,
              paymentStatus: newStatus === 'Delivered' ? 'Paid' : prev.paymentStatus
            }
          : null
      );
    }
  };

  // Filtered Orders Logic (Order ID, Name, and Phone)
  const filteredOrders = useMemo(() => {
    const cleanSearchQuery = searchTerm.trim().toLowerCase().replace(/^#/, '');

    return orders.filter((order) => {
      const cleanOrderId = order.id.toLowerCase().replace(/^#/, '');
      
      const matchesSearch =
        cleanOrderId.includes(cleanSearchQuery) ||
        order.customerName.toLowerCase().includes(cleanSearchQuery) ||
        order.phone.includes(cleanSearchQuery);

      const matchesStatus = selectedStatus === 'All' || order.orderStatus === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  // Badge Status Helper
  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> পেন্ডিং (Pending)
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <PackageCheck className="w-3.5 h-3.5" /> প্রসেসিং (Processing)
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" /> শিপড (Shipped)
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> ডেলিভার্ড (Delivered)
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" /> বাতিল (Cancelled)
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">অর্ডার ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500 mt-0.5">গ্রাহকদের অর্ডারের বিবরণ দেখুন এবং স্ট্যাটাস পরিবর্তন করুন</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input supporting Order ID, Name, Phone */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="অর্ডার আইডি (যেমন: ORD-1092), নাম বা ফোন নম্বর..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs sm:text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === status
                  ? 'bg-primary-600 text-white font-bold'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'All' ? 'সব অর্ডার' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 font-bold border-b border-gray-100">
              <tr>
                <th className="px-5 py-3.5">অর্ডার আইডি</th>
                <th className="px-5 py-3.5">গ্রাহক</th>
                <th className="px-5 py-3.5">তারিখ</th>
                <th className="px-5 py-3.5">পেমেন্ট</th>
                <th className="px-5 py-3.5">মোট মূল্য</th>
                <th className="px-5 py-3.5">স্ট্যাটাস</th>
                <th className="px-5 py-3.5 text-center">স্ট্যাটাস পরিবর্তন</th>
                <th className="px-5 py-3.5 text-center">বিস্তারিত</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-800">{order.customerName}</div>
                      <div className="text-[11px] text-gray-400">{order.phone}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-700">{order.paymentMethod}</span>
                      <span
                        className={`block text-[10px] font-bold ${
                          order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {order.paymentStatus === 'Paid' ? 'পরিশোধিত' : 'অপরিশোধিত'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">৳{order.totalAmount}</td>
                    <td className="px-5 py-4">{getStatusBadge(order.orderStatus)}</td>
                    
                    {/* Status Dropdown */}
                    <td className="px-5 py-4 text-center">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as Order['orderStatus'])
                        }
                        className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-2.5 py-1.5 outline-none focus:border-primary-500 cursor-pointer shadow-xs"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors cursor-pointer"
                        title="বিস্তারিত দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    কোনো সঠিক অর্ডার পাওয়া যায়নি!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Quick Edit Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-base text-gray-900">অর্ডার বিবরণী - #{selectedOrder.id}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  তারিখ: {new Date(selectedOrder.createdAt).toLocaleString('bn-BD')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Order Status Update Control inside Modal */}
              <div className="bg-primary-50/60 border border-primary-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-primary-600" />
                  <span className="text-xs font-bold text-gray-800">অর্ডার স্ট্যাটাস আপডেট করুন:</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.id, e.target.value as Order['orderStatus'])
                    }
                    className="bg-white border border-primary-200 text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-gray-400 block font-medium">গ্রাহকের নাম:</span>
                  <span className="font-bold text-gray-800 text-sm">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">ফোন নম্বর:</span>
                  <span className="font-bold text-gray-800 text-sm">{selectedOrder.phone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-400 block font-medium">ডেলিভারি ঠিকানা:</span>
                  <span className="font-semibold text-gray-800">{selectedOrder.address}</span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 mb-3">পণ্যের তালিকা:</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-bold text-xs text-gray-800">{item.name}</div>
                          <div className="text-[11px] text-gray-400">
                            ৳{item.price} x {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-xs text-gray-900">
                        ৳{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border-t border-gray-100 pt-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>পেমেন্ট মেথড:</span>
                  <span className="font-bold text-gray-800">
                    {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                  </span>
                </div>
                <div className="flex justify-between text-gray-900 text-sm font-bold pt-2 border-t border-gray-100">
                  <span>সর্বমোট মূল্য:</span>
                  <span className="text-primary-600">৳{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;