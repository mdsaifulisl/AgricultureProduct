import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { CartDrawer } from "../components/common/CartDrawer";
import { Footer } from "../components/common/Footer";
import { useCart } from "../features/cartSlice/useCart";
import { ToastContainer } from '../components/helper/ToastContainer';
import { ConfirmModal } from '../components/helper/ConfirmModal';
import { useAuth } from '../features/auth/useAuth';

export const MainLayout: React.FC = () => {
  const { user, isLoading } = useAuth(); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // লোডিং শেষ হওয়ার পর যদি ইউজার লগইন থাকে এবং বর্তমান পাথ /login হয়
    if (!isLoading && user && location.pathname === '/login') {
      navigate('/seller', { replace: true });
    }
  }, [user, isLoading, location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        <Outlet />
      </main>

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


