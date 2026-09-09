import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { CartDrawer } from "../components/common/CartDrawer";
import { Footer } from "../components/common/Footer";
import { useCart } from "../features/cartSlice/useCart";
import { ToastContainer } from '../components/helper/ToastContainer';
import { ConfirmModal } from '../components/helper/ConfirmModal';

export const MainLayout: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // useCart হুক থেকে মোট কার্ট কাউন্ট আনয়ন
  const { cartItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* items প্রপস ছাড়াই CartDrawer কাল করা */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <ToastContainer />
      <ConfirmModal />
      
      <Footer />
    </div>
  );
};

