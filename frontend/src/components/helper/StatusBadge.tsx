import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'approved' | string;
  onStatusChange?: (newStatus: string) => void;
  activeLabel?: string;
  inactiveLabel?: string;
  interactive?: boolean; // ক্লিক করে চেঞ্জ করার অপশন সক্রিয় রাখতে true রাখুন
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status: initialStatus,
  onStatusChange,
  activeLabel = 'এক্টিভ',
  inactiveLabel = 'ইন-এক্টিভ',
  interactive = true,
}) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [toast, setToast] = useState('');

  const handleToggle = () => {
    if (!interactive) return;

    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setCurrentStatus(nextStatus);

    // parent component এ নতুন স্ট্যাটাস পাঠানোর জন্য
    if (onStatusChange) {
      onStatusChange(nextStatus);
    }

    // টোস্ট নোটিফিকেশন দেখানো
    setToast('স্ট্যাটাস আপডেট করা হয়েছে');
    setTimeout(() => setToast(''), 2000);
  };

  const isStatusActive = currentStatus === 'active' || currentStatus === 'approved';

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Badge Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={!interactive}
        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
          interactive ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
        } ${
          isStatusActive
            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
            : 'bg-rose-50 text-rose-600 border-rose-200'
        }`}
      >
        {isStatusActive ? activeLabel : inactiveLabel}
      </button>
    </>
  );
};

export default StatusBadge;


