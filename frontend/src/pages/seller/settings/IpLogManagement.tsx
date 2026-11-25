/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react";
import { useIpLog } from "../../../features/ipLog/useIpLog";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  RefreshCw,
  User,
  Phone,
  Globe,
} from "lucide-react";

import { showToast } from "../../../features/toast/toastSlice";
import { useAppDispatch } from "../../../app/hooks";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../features/auth/useAuth";
import { AccessDenied } from "../../../components/common/AccessDenied";

interface DeviceEntry {
  id: string;
  fingerprint: string;
  orderCount: number;
  lastOrderAt: string | null;
  reason?: string | null;
  isBlocked: boolean;
}

export const IpLogManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { ipLogs, isLoading, isUpdating, getAllIps, handleToggleBlockIp } =
    useIpLog();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "blocked" | "active">(
    "all",
  );
  const [actionIp, setActionIp] = useState<string | null>(null);
  const [deviceBlocks, setDeviceBlocks] = useState<DeviceEntry[]>([]);
  const [deviceSearch, setDeviceSearch] = useState("");
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isAdminorMOderator = isAdmin || user?.role === "moderator";

  const loadDevices = () => {
    setIsLoadingDevices(true);
    return axiosInstance
      .get("/iplog/devices")
      .then(({ data }) => setDeviceBlocks(data.data))
      .catch(() =>
        dispatch(showToast("ডিভাইস ফিঙ্গারপ্রিন্ট লোড করা যায়নি।", "error")),
      )
      .finally(() => setIsLoadingDevices(false));
  };

  useEffect(() => {
    getAllIps().catch(() => {});
    void loadDevices();
  }, [getAllIps]);

  const toggleDevice = async (fingerprint: string, isBlocked: boolean) => {
    const response = await axiosInstance.patch("/iplog/devices/toggle-block", {
      fingerprint,
      isBlocked: !isBlocked,
    });
    setDeviceBlocks((current) => {
      const updated = response.data.data as DeviceEntry;
      const exists = current.some(
        (item) => item.fingerprint === updated.fingerprint,
      );
      return exists
        ? current.map((item) =>
            item.fingerprint === updated.fingerprint ? updated : item,
          )
        : [updated, ...current];
    });
    dispatch(
      showToast(
        isBlocked ? "ডিভাইসটি আনব্লক হয়েছে।" : "ডিভাইসটি ব্লক হয়েছে।",
        "success",
      ),
    );
  };

  const filteredDevices = useMemo(
    () =>
      deviceBlocks.filter((device) =>
        device.fingerprint
          .toLowerCase()
          .includes(deviceSearch.trim().toLowerCase()),
      ),
    [deviceBlocks, deviceSearch],
  );

  // IP বা নাম/ফোন দিয়ে সার্চ ও ফিল্টার
  const filteredIps = useMemo(() => {
    return ipLogs.filter(
      (item: {
        ip: string;
        fullName: string;
        phone: string | string[];
        isBlocked: any;
      }) => {
        const matchesSearch =
          item.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.fullName &&
            item.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.phone && item.phone.includes(searchQuery));

        if (filterTab === "blocked") return matchesSearch && item.isBlocked;
        if (filterTab === "active") return matchesSearch && !item.isBlocked;
        return matchesSearch;
      },
    );
  }, [ipLogs, searchQuery, filterTab]);

  const onToggleBlock = async (ip: string, currentStatus: boolean) => {
    try {
      setActionIp(ip);
      await handleToggleBlockIp({
        ip,
        isBlocked: !currentStatus,
      });
      dispatch(
        showToast(
          "IP ব্লকিং সংশ্লিষ্ট IP এর স্ট্যাটাস আপডেট করা হয়েছে",
          "success",
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionIp(null);
    }
  };

  if (!isAdminorMOderator) {
    return <AccessDenied />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-primary-600" />
            IP ব্লকিং ও লগ ম্যানেজমেন্ট
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            IP লগ দেখুন; IP ব্লক পুরোনো তথ্য হিসেবে রাখা হয়েছে। নির্দিষ্ট
            গ্রাহক থামাতে নিচে ডিভাইস ফিঙ্গারপ্রিন্ট ব্লক করুন।
          </p>
        </div>

        <button
          onClick={() => {
            void getAllIps();
            void loadDevices();
          }}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>রিফ্রেশ করুন</span>
        </button>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-bold text-gray-900">
              ডিভাইস ফিঙ্গারপ্রিন্ট ও অর্ডার
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              একই fingerprint-এর অর্ডার সংখ্যা দেখুন; এই তালিকা থেকে ডিভাইস ব্লক
              বা আনব্লক করুন।
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={deviceSearch}
              onChange={(event) => setDeviceSearch(event.target.value)}
              placeholder="Fingerprint দিয়ে ফিল্টার করুন"
              className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        {isLoadingDevices ? (
          <p className="p-5 text-sm text-gray-500">ডিভাইস তালিকা লোড হচ্ছে…</p>
        ) : filteredDevices.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">
            {deviceSearch
              ? "এই fingerprint-এর কোনো মিল পাওয়া যায়নি।"
              : "এখনো কোনো অর্ডারে device fingerprint নেই।"}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-5 py-3">SHA-256 ডিভাইস হ্যাশ</th>
                  <th className="px-5 py-3">অর্ডার সংখ্যা</th>
                  <th className="px-5 py-3">সর্বশেষ অর্ডার</th>
                  <th className="px-5 py-3">অবস্থা</th>
                  <th className="px-5 py-3">করণীয়</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="border-t">
                    <td className="px-5 py-3 font-mono text-xs break-all">
                      {device.fingerprint}
                    </td>
                    <td className="px-5 py-3 font-bold">{device.orderCount}</td>
                    <td className="px-5 py-3 text-xs">
                      {device.lastOrderAt
                        ? new Date(device.lastOrderAt).toLocaleString("bn-BD")
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      {device.isBlocked ? "ব্লকড" : "সক্রিয়"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() =>
                          toggleDevice(
                            device.fingerprint,
                            device.isBlocked,
                          ).catch(() =>
                            dispatch(
                              showToast(
                                "ডিভাইসের অবস্থা পরিবর্তন করা যায়নি।",
                                "error",
                              ),
                            ),
                          )
                        }
                        className={`font-bold ${device.isBlocked ? "text-emerald-700" : "text-red-700"}`}
                      >
                        {device.isBlocked ? "আনব্লক" : "ব্লক"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Field */}
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="IP, নাম অথবা ফোন নম্বর দিয়ে সার্চ করুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setFilterTab("all")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterTab === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            সব IP ({ipLogs.length})
          </button>
          <button
            onClick={() => setFilterTab("active")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterTab === "active"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            সক্রিয় (
            {ipLogs.filter((i: { isBlocked: any }) => !i.isBlocked).length})
          </button>
          <button
            onClick={() => setFilterTab("blocked")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterTab === "blocked"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            ব্লকড (
            {ipLogs.filter((i: { isBlocked: any }) => i.isBlocked).length})
          </button>
        </div>
      </div>

      {/* IP Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading && ipLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mb-2" />
            <p className="text-sm font-medium">IP লগের ডাটা লোড হচ্ছে...</p>
          </div>
        ) : filteredIps.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-base font-bold">কোনো IP ডাটা পাওয়া যায়নি</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchQuery
                ? "আপনার সার্চ কিওয়ার্ডের সাথে মেলে এমন কিছু পাওয়া যায়নি।"
                : "এখনো কোনো IP রেকর্ড ডাটাবেজে নেই।"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">IP অ্যাড্রেস</th>
                  <th className="px-6 py-4">গ্রাহকের নাম</th>
                  <th className="px-6 py-4">ফোন নম্বর</th>
                  <th className="px-6 py-4">স্ট্যাটাস</th>
                  <th className="px-6 py-4">সর্বশেষ অ্যাক্টিভিটি</th>
                  <th className="px-6 py-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredIps.map(
                  (item: {
                    ip: string;
                    id: React.Key | null | undefined;
                    fullName: any;
                    phone: any;
                    isBlocked: boolean;
                    updatedAt: string | number | Date;
                  }) => {
                    const isCurrentUpdating =
                      isUpdating && actionIp === item.ip;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        {/* IP */}
                        <td className="px-6 py-4 font-mono font-bold text-gray-800">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span>{item.ip}</span>
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{item.fullName || "N/A"}</span>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4 text-gray-700 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{item.phone || "N/A"}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {item.isBlocked ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                              ব্লকড (Blocked)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              সক্রিয় (Active)
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(item.updatedAt).toLocaleString("bn-BD", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>

                        {/* Action Button */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              onToggleBlock(item.ip, item.isBlocked)
                            }
                            disabled={isCurrentUpdating}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              item.isBlocked
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                                : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            }`}
                          >
                            {isCurrentUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : item.isBlocked ? (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldAlert className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {item.isBlocked ? "আনব্লক করুন" : "ব্লক করুন"}
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IpLogManagement;
