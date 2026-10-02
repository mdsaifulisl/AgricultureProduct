/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  Eye,
  Filter,
  CheckCircle2,
  XCircle,
  Star,
  Sparkles,
  Loader2,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import { useProduct } from "../../../features/product/useProduct";
import { confirm } from "../../../features/confirm/confirmSlice";
import { useAppDispatch } from "../../../app/hooks";
import { getCleanUnit } from "../../../utils/formatUnit";
import { showToast } from "../../../features/toast/toastSlice";
import { useAuth } from "../../../features/auth/useAuth";

export const ProductsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    products = [],
    isLoading,
    isError,
    error,
    deleteProduct,
    fetchAllProducts,
  } = useProduct(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isAdminOrModerator = isAdmin || user?.role === "moderator";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ম্যানুয়াল রিফ্রেশ হ্যান্ডলার
  const handleRefresh = async () => {
    if (typeof fetchAllProducts === "function") {
      try {
        setIsRefreshing(true);
        await fetchAllProducts();
        dispatch(showToast("পণ্য তালিকা রিফ্রেশ করা হয়েছে", "success"));
      } catch (err: any) {
        dispatch(showToast("রিফ্রেশ করতে সমস্যা হয়েছে", "error"));
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/seller/edit-product/${id}`);
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await dispatch(
      confirm({
        title: "পণ্য মুছে ফেলার নিশ্চিতকরণ",
        message:
          "আপনি কি নিশ্চিত যে এই পণ্যটি মুছে ফেলতে চান? এই অ্যাকশনটি ফিরিয়ে আনা যাবে না।",
        confirmText: "হ্যাঁ, ডিলিট করুন",
        cancelText: "বাতিল",
        type: "danger",
      }),
    );

    if (!isConfirmed) return;

    try {
      if (typeof deleteProduct === "function") {
        const res = deleteProduct(id);
        await res;
      }

      dispatch(showToast("পণ্য মুছে ফেলা হয়েছে", "success"));
    } catch (err: any) {
      dispatch(showToast(err, "error"));
    }
  };

  // ইউনিক ক্যাটাগরি এক্সট্র্যাক্ট করা
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // ফিল্টারিং লজিক
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku &&
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesStock =
      selectedStockStatus === "all" ||
      (selectedStockStatus === "in_stock" && product.inStock) ||
      (selectedStockStatus === "out_of_stock" && !product.inStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-600">
          পণ্যসমূহ লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (isError && !isRefreshing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-red-50 rounded-2xl p-6 border border-red-100">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <h3 className="text-base font-bold text-gray-800">
          পণ্য লোড করতে সমস্যা হয়েছে
        </h3>
        <p className="text-xs text-red-500">
          {error || "অনুগ্রহ করে আবার চেষ্টা করুন।"}
        </p>
        <button
          onClick={handleRefresh}
          className="mt-2 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          <span>পুনরায় চেষ্টা করুন</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">পণ্যসমূহ</h1>
          <p className="text-xs text-gray-500 mt-1">
            মোট পণ্য:{" "}
            <span className="font-bold text-gray-800">
              {products.length} টি
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 transition-colors shrink-0 shadow-xs disabled:opacity-50 cursor-pointer"
            title="তালিকা রিফ্রেশ করুন"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-primary-600" : ""}`} />
            <span>{isRefreshing ? "রিফ্রেশ হচ্ছে..." : "রিফ্রেশ"}</span>
          </button>

          {isAdminOrModerator && (
            <Link
              to="/seller/add-product"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors shrink-0 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন পণ্য যোগ করুন</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="পণ্যের নাম অথবা SKU দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-xs sm:text-sm transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-xs sm:text-sm bg-white cursor-pointer"
          >
            <option value="all">সকল ক্যাটাগরি</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="w-full md:w-40 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-xs sm:text-sm bg-white cursor-pointer"
          >
            <option value="all">সকল স্টক</option>
            <option value="in_stock">ইন স্টক</option>
            <option value="out_of_stock">স্টক আউট</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">
              কোনো পণ্য পাওয়া যায়নি
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              আপনার সার্চ বা ফিল্টার পরিবর্তন করে চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">পণ্য</th>
                  <th className="py-3.5 px-4">ক্যাটাগরি</th>
                  <th className="py-3.5 px-4">মূল্য</th>
                  <th className="py-3.5 px-4">স্টক</th>
                  <th className="py-3.5 px-4">রেটিং</th>
                  <th className="py-3.5 px-4">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Image & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={
                              product.images && product.images.length > 0
                                ? product.images[0]
                                : "/placeholder.png"
                            }
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100 bg-gray-50"
                          />
                          {product.badge && (
                            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-2xs">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-gray-900 truncate max-w-xs">
                              {product.name}
                            </h4>
                            {product.isFeatured && (
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            )}
                          </div>
                          {product.sku && (
                            <span className="text-[10px] text-gray-400 font-mono">
                              SKU: {product.sku}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-gray-600 font-semibold">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">
                          {product.price}৳ / {product.unit}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {product.originalPrice}৳
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock Count */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold ${product.stockCount === 0 ? "text-red-500" : "text-gray-700"}`}
                      >
                        {product.stockCount} {getCleanUnit(product.unit)}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{product.rating ?? 0}</span>
                        <span className="text-[10px] text-gray-400 font-normal">
                          ({product.reviewsCount ?? 0})
                        </span>
                      </div>
                    </td>

                    {/* Stock Status Badge */}
                    <td className="py-3.5 px-4">
                      {product.inStock ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>স্টকে আছে</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-red-100">
                          <XCircle className="w-3 h-3" />
                          <span>স্টক আউট</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/product/${product.id}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="প্রিভিউ দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {isAdminOrModerator && (
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;