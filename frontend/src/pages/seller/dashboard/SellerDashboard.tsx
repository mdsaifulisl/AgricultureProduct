import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  DollarSign,
  Package,
  Clock,
} from "lucide-react";
import { SalesAndOrderTrends } from "../../../components/seller/dashboard/SalesAndOrderTrends";
import { useProduct } from "../../../features/product/useProduct";
import { getOrderDashboardApi } from "../../../features/order/orderApi";
import type { OrdersDashboardData } from "../../../features/order/orderTypes";
import { StatCard } from "../../../components/seller/dashboard/StatCard";
import { RecentOrdersTable } from "../../../components/seller/dashboard/RecentOrdersTable";

export const SellerDashboard: React.FC = () => {
  const { products } = useProduct(true);
  const [dashboard, setDashboard] = useState<OrdersDashboardData | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => getOrderDashboardApi().then((response) => { if (active) setDashboard(response.data); }).catch(() => {});
    void load();
    const timer = setInterval(() => { void load(); }, 60_000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  const orders = dashboard?.recentOrders || [];
  const pendingOrdersCount = dashboard?.stats.pendingOrders || 0;
  const totalOrdersCount = dashboard?.stats.totalOrders || 0;
  const totalProductsCount = products.length;

  const totalSalesAmount = dashboard?.stats.deliveredSales || 0;

  const stats = [
    {
      title: "মোট বিক্রি",
      value: `${totalSalesAmount.toLocaleString("bn-BD")} ৳`,
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "মোট অর্ডার",
      value: `${totalOrdersCount.toLocaleString("bn-BD")} টি`,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "মোট পণ্য",
      value: `${totalProductsCount.toLocaleString("bn-BD")} টি`,
      icon: Package,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "পেন্ডিং অর্ডার",
      value: `${pendingOrdersCount.toLocaleString("bn-BD")} টি`,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ড্যাশবোর্ড ওভারভিউ</h1>
        <p className="text-xs text-gray-500 mt-1">
          আপনার স্টোরের বর্তমান অবস্থা একনজরে দেখুন
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Sales and Order Trends */}
      <SalesAndOrderTrends trends={dashboard?.trends || []} />

      {/* Recent Orders Table */}
      <RecentOrdersTable orders={orders} statusCounts={dashboard?.stats.statusCounts || {}} />
    </div>
  );
};
