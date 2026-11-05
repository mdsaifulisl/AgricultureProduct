/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { OrdersDashboardData } from "../../../features/order/orderTypes";

type FilterType = "daily" | "weekly" | "monthly";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const SalesAndOrderTrends: React.FC<{ trends: OrdersDashboardData['trends'] }> = ({ trends }) => {
  const [filter, setFilter] = useState<FilterType>("monthly");

  // Dynamic Chart Data Generator
  const chartData = useMemo(() => {
    if (!trends || trends.length === 0) return [];

    const now = new Date();

    // 1. DAILY FILTER (গত ৩০ দিনের ডাটা দিন অনুযায়ী)
    if (filter === "daily") {
      const daysMap: Record<string, { month: string; sales: number; orders: number }> = {};

      // গত ৩০ দিনের ঘর তৈরি
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateKey = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        daysMap[dateKey] = { month: dateKey, sales: 0, orders: 0 };
      }

      trends.forEach((trend) => {
        if (trend.bucket) {
          const dateKey = new Date(trend.bucket).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          if (daysMap[dateKey]) {
            daysMap[dateKey].orders += trend.orderCount;
            daysMap[dateKey].sales += trend.sales;
          }
        }
      });

      return Object.values(daysMap);
    }

    // 2. WEEKLY FILTER (গত ৮ সপ্তাহের ডাটা সপ্তাহ অনুযায়ী)
    if (filter === "weekly") {
      const weeksMap: Record<string, { month: string; sales: number; orders: number }> = {};

      // গত ৮টি সপ্তাহের লেবেল তৈরি
      for (let i = 7; i >= 0; i--) {
        const weekLabel = i === 0 ? "This Week" : `${i}w ago`;
        weeksMap[weekLabel] = { month: weekLabel, sales: 0, orders: 0 };
      }

      trends.forEach((trend) => {
        if (trend.bucket) {
          const orderDate = new Date(trend.bucket);
          const diffInTime = now.getTime() - orderDate.getTime();
          const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
          const weekIndex = Math.floor(diffInDays / 7);

          if (weekIndex >= 0 && weekIndex <= 7) {
            const weekLabel = weekIndex === 0 ? "This Week" : `${weekIndex}w ago`;
            if (weeksMap[weekLabel]) {
              weeksMap[weekLabel].orders += trend.orderCount;
              weeksMap[weekLabel].sales += trend.sales;
            }
          }
        }
      });

      return Object.values(weeksMap).reverse();
    }

    // 3. MONTHLY FILTER (১২ মাসের মাসভিত্তিক ডাটা)
    const monthlyMap: Record<string, { month: string; sales: number; orders: number }> = {};
    const nowMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    for (let offset = 11; offset >= 0; offset--) {
      const date = new Date(nowMonth.getFullYear(), nowMonth.getMonth() - offset, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyMap[key] = { month: `${MONTH_NAMES[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`, sales: 0, orders: 0 };
    }
    trends.forEach((trend) => {
      const date = new Date(trend.bucket);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthlyMap[key]) {
        monthlyMap[key].orders += trend.orderCount;
        monthlyMap[key].sales += trend.sales;
      }
    });
    return Object.values(monthlyMap);
  }, [trends, filter]);

  return (
    <div className="space-y-2">
      {/* Dynamic Filter Buttons */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <h2 className="text-base font-bold text-gray-800">বিক্রি ও অর্ডার ট্রেন্ড</h2>
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
          {(["daily", "weekly", "monthly"] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                filter === type
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {type === "daily" ? "দৈনিক" : type === "weekly" ? "সাপ্তাহিক" : "মাসিক"}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-6">
            Sales Trend (৳) - {filter.toUpperCase()}
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`৳ ${Number(value ?? 0).toLocaleString("bn-BD")}`, "Sales"]}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="sales" fill="#000000" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Trend Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-6">
            Order Trend (Count) - {filter.toUpperCase()}
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [Number(value ?? 0), "Orders"]}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ fill: "#000000", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAndOrderTrends;

