import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeConfirm } from '../../features/confirm/confirmSlice';
import { AlertTriangle, Info, X } from 'lucide-react';

export const ConfirmModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, options, resolveCallback } = useAppSelector((state) => state.confirm);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (typeof resolveCallback === 'function') {
      (resolveCallback as (val: boolean) => void)(true);
    }
    dispatch(closeConfirm());
  };

  const handleCancel = () => {
    if (typeof resolveCallback === 'function') {
      (resolveCallback as (val: boolean) => void)(false);
    }
    dispatch(closeConfirm());
  };

  return (
    <div 
      onClick={handleCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${options.type === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
              {options.type === 'danger' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">{options.title}</h3>
            </div>
          </div>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed pl-1">{options.message}</p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {options.cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer ${
              options.type === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {options.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};