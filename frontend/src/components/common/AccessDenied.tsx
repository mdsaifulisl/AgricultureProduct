import React from "react";
import { ShieldAlert } from "lucide-react";

export const AccessDenied: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-xl mx-auto text-center my-10">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        অনুমতি নেই (Access Denied)
      </h3>
      <p className="text-sm text-gray-500">
        এই পেজ বা ফিচারটি ব্যবহার করার অনুমতি আপনার নেই।
      </p>
    </div>
  );
};