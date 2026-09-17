import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { removeToast } from '../../features/toast/toastSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 sm:top-10 right-2 sm:right-5 z-50 flex flex-col gap-2.5 max-w-xs sm:max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start justify-between p-3.5 rounded-xl shadow-lg border transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-950 border-emerald-800 text-emerald-100'
              : toast.type === 'error'
              ? 'bg-red-950 border-red-800 text-red-100'
              : 'bg-primary-950 border-primary-800 text-primary-100'
          }`}
        >
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />}
            
            {/* 🟢 truncate মুছে পরিচ্ছন্ন মাল্টিলাইন সাপোর্ট যোগ করা হয়েছে */}
            <span className="text-xs sm:text-sm font-semibold break-words whitespace-normal leading-relaxed">
              {toast.message}
            </span>
          </div>

          <button
            onClick={() => dispatch(removeToast(toast.id))}
            className="p-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer ml-2 shrink-0 -mr-1 -mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};