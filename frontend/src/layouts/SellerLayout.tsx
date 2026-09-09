import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from '../components/seller/Sidebar';
import { ToastContainer } from '../components/helper/ToastContainer';
import { ConfirmModal } from '../components/helper/ConfirmModal';

export const SellerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Separate Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900 p-2 cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-800">অর্গানিক শপ</p>
              <p className="text-[10px] text-gray-500">মেম্বারশিপ: প্রিমিয়াম</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm border border-primary-200">
              OS
            </div>
          </div>
        </header>

        {/* Page View */}
        <main className="p-4 sm:p-8 flex-1">
          <Outlet />
        </main>

        <ToastContainer />
        <ConfirmModal />
      </div>
    </div>
  );
};