/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Edit3,
  Loader2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import type { Order } from "../../../features/order/orderTypes";
import { useOrder } from "../../../features/order/useOrder";
import { useAppDispatch } from "../../../app/hooks";
import { formatDisplayUnit } from "../../../utils/unitConverter";
import { confirm } from "../../../features/confirm/confirmSlice";
import { useAuth } from "../../../features/auth/useAuth";
import { showToast } from "../../../features/toast/toastSlice";

export const SellerOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    orders = [],
    loading: isLoading,
    updateStatus,
    getAllOrders,
    markAsSeen,
    removeOrder,
  } = useOrder();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ম্যানুয়াল ও অটো রিফ্রেশ ফাংশন
  const handleRefresh = useCallback(async () => {
    if (typeof getAllOrders !== "function") return;

    try {
      setIsRefreshing(true);
      await getAllOrders();
      dispatch(showToast("অর্ডার সফলভাবে রিফ্রেশ হয়েছে", "success"));
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "অর্ডার রিফ্রেশ করতে ব্যর্থ হয়েছে";
      dispatch(showToast(message, "error"));
    } finally {
      setIsRefreshing(false);
    }
  }, [getAllOrders, dispatch]);

  // ইনিশিয়াল ডেটা লোড এবং ৩০ সেকেন্ড পরপর অটো রিফ্রেশ সেটআপ
  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        if (typeof getAllOrders === "function") {
          await getAllOrders();
        }
      } catch (error: any) {
        if (isMounted) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "অর্ডার লোড করতে ব্যর্থ হয়েছে";
          dispatch(showToast(message, "error"));
        }
      }
    };

    fetchOrders();

    // প্রতি ৩০ সেকেন্ড পর পর স্বয়ংক্রিয়ভাবে রিফ্রেশ হবে
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [getAllOrders, dispatch]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    try {
      setUpdatingOrderId(orderId);
      if (updateStatus) {
        await updateStatus(orderId, newStatus);
      }

      if (
        selectedOrder &&
        (selectedOrder.id === orderId || (selectedOrder as any)._id === orderId)
      ) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "অর্ডার আপডেট করতে ব্যর্থ হয়েছে";
      dispatch(showToast(message, "error"));
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleOpenDetails = async (order: Order) => {
    const orderId = String(order.id || (order as any)._id || "");

    const adminName = user?.name || "অপরিচিত";

    const existingSeenName = (order as any).seenName;
    const isAlreadySeen = Boolean(
      existingSeenName &&
      existingSeenName.trim() !== "" &&
      existingSeenName.toLowerCase() !== "unseen",
    );

    if (!isAlreadySeen) {
      const updatedOrder = {
        ...order,
        seenName: adminName,
        seenAt: new Date().toISOString(),
      };

      setSelectedOrder(updatedOrder);

      if (markAsSeen) {
        try {
          await markAsSeen(orderId, adminName);
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "অর্ডার মার্ক করতে ব্যর্থ হয়েছে";
          dispatch(showToast(message, "error"));
        }
      }
    } else {
      setSelectedOrder(order);
    }
  };

 const handleDeleteOrder = async (orderId: string) => {
  const isConfirmed = await dispatch(
    confirm({
      title: "অর্ডার মুছে ফেলার নিশ্চিতকরণ",
      message:
        "আপনি কি নিশ্চিত যে এই অর্ডারটি মুছে ফেলতে চান? এই অ্যাকশনটি ফিরিয়ে আনা যাবে না।",
      confirmText: "হ্যাঁ, ডিলিট করুন",
      cancelText: "বাতিল",
      type: "danger",
    }),
  );

  if (!isConfirmed) return;

  try {
    setDeletingOrderId(orderId);

    if (removeOrder) {
      await removeOrder(orderId);
    }

    if (
      selectedOrder &&
      (selectedOrder.id === orderId || (selectedOrder as any)._id === orderId)
    ) {
      setSelectedOrder(null);
    }

    dispatch(showToast("অর্ডার সফলভাবে মুছে ফেলা হয়েছে", "success"));

  } catch (error: any) {
    const errorMessage = error; 
    dispatch(showToast(errorMessage, "error"));
  } finally {
    setDeletingOrderId(null);
  }
};

  const filteredOrders = useMemo(() => {
    const cleanQuery = searchTerm.trim().toLowerCase().replace(/^#/, "");

    return (orders || []).filter((order: Order) => {
      const orderId = String(order.id || (order as any)._id || "");
      const trackingId = String(order.trackingId || "");
      const fullName = String(order.fullName || "");
      const phone = String(order.phone || "");
      const ipAddress = String(order.ipAddress || "");

      const matchesSearch =
        orderId.toLowerCase().includes(cleanQuery) ||
        trackingId.toLowerCase().includes(cleanQuery) ||
        fullName.toLowerCase().includes(cleanQuery) ||
        phone.includes(cleanQuery) ||
        ipAddress.includes(cleanQuery);

      const matchesStatus =
        selectedStatus === "ALL" || order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> পেন্ডিং
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <PackageCheck className="w-3.5 h-3.5" /> প্রসেসিং
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" /> শিপড
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> ডেলিভার্ড
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" /> বাতিল
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            অর্ডার ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            গ্রাহকদের অর্ডারের বিবরণ দেখুন এবং স্ট্যাটাস পরিবর্তন করুন
          </p>
        </div>

        {/* রিফ্রেশ বাটন */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin text-primary-600" : ""}`}
          />
          {isRefreshing ? "রিফ্রেশ হচ্ছে..." : "রিফ্রেশ করুন"}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="আইডি, ট্র্যাকিং নম্বর, নাম বা ফোন নম্বর..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-8 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-xs sm:text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            "ALL",
            "PENDING",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === status
                  ? "bg-primary-600 text-white font-bold"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status === "ALL" ? "সব অর্ডার" : status}
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
                <th className="px-5 py-3.5">অর্ডার / ট্র্যাকিং নম্বর</th>
                <th className="px-5 py-3.5">গ্রাহক</th>
                <th className="px-5 py-3.5">সিন করেছেন</th>
                <th className="px-5 py-3.5">তারিখ</th>
                <th className="px-5 py-3.5">পেমেন্ট মেথড</th>
                <th className="px-5 py-3.5">মোট মূল্য</th>
                <th className="px-5 py-3.5">স্ট্যাটাস</th>
                <th className="px-5 py-3.5 text-center">স্ট্যাটাস পরিবর্তন</th>
                <th className="px-5 py-3.5 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order: Order) => {
                  const currentId = String(
                    order.id || (order as any)._id || "",
                  );
                  const isUpdating = updatingOrderId === currentId;
                  const isDeleting = deletingOrderId === currentId;

                  return (
                    <tr
                      key={currentId || Math.random()}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-gray-900">
                        #{order.trackingId || currentId.slice(-6)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-gray-800">
                          {order.fullName || "—"}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {order.phone || "—"}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          ip: {order.ipAddress || "—"}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-700">
                        {order.seenName && order.seenName !== "unSeen" ? (
                          <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap">
                            {order.seenName}
                          </span>
                        ) : (
                          <span className="bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                            unSeen
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "bn-BD",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-700">
                        {order.paymentMethod || "COD"}
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900">
                        ৳{Math.round(order.totalAmount || 0)}
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <select
                          disabled={isUpdating || isDeleting}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              currentId,
                              e.target.value as Order["status"],
                            )
                          }
                          className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-2.5 py-1.5 outline-none focus:border-primary-500 cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenDetails(order)}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors cursor-pointer"
                            title="বিস্তারিত দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button
                              disabled={isDeleting}
                              onClick={() => handleDeleteOrder(currentId)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                              title="অর্ডার মুছুন"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    কোনো সঠিক অর্ডার পাওয়া যায়নি!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  অর্ডার বিবরণী - #
                  {selectedOrder.trackingId ||
                    selectedOrder.id ||
                    (selectedOrder as any)._id}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  তারিখ:{" "}
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString("bn-BD")
                    : "—"}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-primary-50/60 border border-primary-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-primary-600" />
                  <span className="text-xs font-bold text-gray-800">
                    অর্ডার স্ট্যাটাস আপডেট করুন:
                  </span>
                </div>
                <select
                  disabled={
                    updatingOrderId ===
                    (selectedOrder.id || (selectedOrder as any)._id)
                  }
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder.id || (selectedOrder as any)._id,
                      e.target.value as Order["status"],
                    )
                  }
                  className="bg-white border border-primary-200 text-xs font-bold rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer disabled:opacity-50"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-gray-400 block font-medium">
                    গ্রাহকের নাম:
                  </span>
                  <span className="font-bold text-gray-800 text-sm">
                    {selectedOrder.fullName || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">
                    ফোন নম্বর:
                  </span>
                  <span className="font-bold text-gray-800 text-sm">
                    {selectedOrder.phone || "—"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-400 block font-medium">
                    ডেলিভারি ঠিকানা:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.address || "—"}
                  </span>
                </div>
                {selectedOrder.note && (
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 block font-medium">
                      নোট:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedOrder.note}
                    </span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 mb-3">
                  পণ্যের তালিকা:
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item: any) => {
                      const base = item.baseAmount || 1;
                      const itemTotalPrice =
                        (item.price / base) * item.quantity;
                      const formatted = formatDisplayUnit(
                        item.quantity,
                        item.unit || "",
                      );

                      return (
                        <div
                          key={item.id || item._id || Math.random()}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-lg bg-gray-50 border border-gray-100"
                            />
                            <div>
                              <div className="font-bold text-xs text-gray-800">
                                {item.name}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                                {item.sku && (
                                  <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono text-[10px]">
                                    {item.sku}
                                  </span>
                                )}
                                <span>
                                  ৳{item.price} / {item.unit || "পিস"}
                                </span>
                                <span className="text-gray-400">|</span>
                                <span className="font-semibold text-gray-700">
                                  পরিমাণ: {formatted.quantity} {formatted.unit}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="font-bold text-xs text-gray-900">
                            ৳{Math.round(itemTotalPrice)}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      কোনো পণ্য পাওয়া যায়নি
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border-t border-gray-100 pt-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>পেমেন্ট মেথড:</span>
                  <span className="font-bold text-gray-800">
                    {selectedOrder.paymentMethod || "COD"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>ডেলিভারি ফি:</span>
                  <span className="font-bold text-gray-800">
                    ৳{selectedOrder.deliveryFee || 0}
                  </span>
                </div>
                <div className="flex justify-between text-gray-900 text-sm font-bold pt-2 border-t border-gray-100">
                  <span>সর্বমোট মূল্য:</span>
                  <span className="text-primary-600">
                    ৳{Math.round(selectedOrder.totalAmount || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              {isAdmin && (
                <button
                  onClick={() =>
                    handleDeleteOrder(
                      String(selectedOrder.id || (selectedOrder as any)._id),
                    )
                  }
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> মুছে ফেলুন
                </button>
              )}


              {/* <button
                  onClick={() =>
                    handleDeleteOrder(
                      String(selectedOrder.id || (selectedOrder as any)._id),
                    )
                  }
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> মুছে ফেলুন
                </button> */}

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
