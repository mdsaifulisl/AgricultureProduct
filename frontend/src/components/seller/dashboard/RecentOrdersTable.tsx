import React, { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface Order {
  id: string;
  fullName?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
  statusCounts?: Record<string, number>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "পেন্ডিং", color: "#f59e0b" },
  processing: { label: "প্রসেসিং", color: "#3b82f6" },
  shipped: { label: "শিপড", color: "#6366f1" },
  delivered: { label: "ডেলিভার্ড", color: "#10b981" },
  cancelled: { label: "বাতিল", color: "#ef4444" },
};

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders, statusCounts }) => {
  const navigate = useNavigate();

  // স্ট্যাটাস অনুযায়ী হিসাব ও পার্সেন্টেজ ক্যালকুলেশন
  const statusStats = useMemo(() => {
    const total = statusCounts ? Object.values(statusCounts).reduce((sum, count) => sum + count, 0) : orders?.length || 0;
    const counts: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    if (statusCounts) {
      for (const [status, count] of Object.entries(statusCounts)) {
        const key = status.toLowerCase();
        if (key in counts) counts[key] += count;
      }
    } else {
      orders?.forEach((order) => {
        const statusKey = String(order.status || "").toLowerCase();
        if (statusKey in counts) counts[statusKey] += 1;
      });
    }

    const breakdown = Object.keys(counts).map((key) => {
      const count = counts[key];
      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
      return {
        key,
        name: STATUS_CONFIG[key]?.label || key,
        count,
        percentage: Number(percentage),
        color: STATUS_CONFIG[key]?.color || "#9ca3af",
      };
    });

    return { total, breakdown };
  }, [orders, statusCounts]);

  const getStatusBadgeClass = (status: string | undefined) => {
    const normalizedStatus = String(status ?? "").toLowerCase();

    switch (normalizedStatus) {
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "processing":
      case "processed":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "shipped":
      case "shipping":
        return "bg-indigo-50 text-indigo-600 border border-indigo-200";
      case "pending":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "cancelled":
        return "bg-rose-50 text-rose-600 border border-rose-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  const getDisplayStatus = (status: string | undefined) => {
    const normalizedStatus = String(status ?? "").toLowerCase();

    switch (normalizedStatus) {
      case "delivered":
        return "ডেলিভার্ড";
      case "processing":
      case "processed":
        return "প্রসেসিং";
      case "shipped":
      case "shipping":
        return "শিপড";
      case "pending":
        return "পেন্ডিং";
      case "cancelled":
        return "বাতিল";
      default:
        return String(status ?? "অজানা");
    }
  };

  const recentOrders = orders.slice(0, 5).map((order) => ({
    id: order.id,
    customer: order.fullName || "অজানা গ্রাহক",
    amount: order.totalAmount,
    displayStatus: getDisplayStatus(order.status),
    statusClass: getStatusBadgeClass(order.status),
    date: order.createdAt,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* বাম পাশ: স্ট্যাটাস পার্সেন্টেজ ও চার্ট */}
      <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">অর্ডার স্ট্যাটাস</h2>
            <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
              মোট: {statusStats.total}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">অর্ডারের শতকরা অনুপাত</p>

          {/* Pie Chart */}
          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusStats.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {statusStats.breakdown.map((item) => (
                    <Cell key={item.key} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, item) => {
                    // Recharts render/transition-এর কিছু পর্যায়ে payload অনুপস্থিত থাকতে পারে।
                    // ঐ অবস্থায়ও tooltip যেন dashboard render ভেঙে না দেয়।
                    const row = item?.payload as
                      | { percentage?: number; name?: string }
                      | undefined;
                    const count = Number(value ?? 0);
                    const percentage = Number(row?.percentage ?? 0);
                    return [
                      `${count} টি (${percentage}%)`,
                      row?.name ?? String(name ?? "অর্ডার"),
                    ];
                  }}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Bars & Percentages */}
          <div className="space-y-3">
            {statusStats.breakdown.map((item) => (
              <div key={item.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-gray-900 font-bold">{item.percentage}% ({item.count})</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ডান পাশ: আপনার টেবিল */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">
            সাম্প্রতিক অর্ডারসমূহ
          </h2>
          <button
            onClick={() => navigate("/seller/orders")}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
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
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    কোনো অর্ডার পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 font-bold text-gray-900">
                      #{String(order.id).slice(0, 8)}
                    </td>
                    <td className="py-3.5 text-gray-700">{order.customer}</td>
                    <td className="py-3.5 font-bold text-gray-800">
                      {Number(order.amount || 0).toLocaleString("bn-BD")} ৳
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${order.statusClass}`}
                      >
                        {order.displayStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-gray-500">
                      {new Date(order.date).toLocaleDateString("bn-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
