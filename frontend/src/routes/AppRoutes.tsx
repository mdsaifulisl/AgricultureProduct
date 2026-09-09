import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { SellerLayout } from '../layouts/SellerLayout';

// Sub-routes
import { publicRoutes } from './publicRoutes';
import { sellerRoutes } from './sellerRoutes';

export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        {publicRoutes}
      </Route>

      {/* Seller Panel Pages */}
      <Route path="/seller" element={<SellerLayout />}>
        {sellerRoutes}
      </Route>

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
            <h1 className="text-6xl font-black text-emerald-600 mb-2">404</h1>
            <p className="text-xl font-semibold text-gray-800 mb-4">
              পৃষ্ঠাটি পাওয়া যায়নি!
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-700 transition-colors"
            >
              পূর্ববর্তী পৃষ্ঠায় ফিরে যান
            </button>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;