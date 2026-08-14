import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { CartDrawer } from "../components/common/CartDrawer";
import { Footer } from "../components/common/Footer";

export const MainLayout: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = 3;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        cartCount={cartCount}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={[]}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />

      {/* Auth Modal স্টেটটি কাজে লাগাতে পারেন */}
      {isAuthModalOpen && (
        <div className="hidden">
          {/* আপনার AuthModal কম্পোনেন্ট এখানে থাকবে */}
        </div>
      )}

      <Footer />
    </div>
  );
};
