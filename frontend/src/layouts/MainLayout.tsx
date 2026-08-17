import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { CartDrawer, type CartItem } from "../components/common/CartDrawer";
import { Footer } from "../components/common/Footer";

// --- MOCK CART DATA ---
const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: "1",
    name: "অর্গানিক ভার্মিকম্পোস্ট সার",
    price: 450,
    unit: "কেজি",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=300",
    quantity: 2,
  },
  {
    id: "2",
    name: "হাইব্রিড টমেটো বীজ (এফ১)",
    price: 120,
    unit: "প্যাকেট",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=300",
    quantity: 1,
  },
  {
    id: "3",
    name: "ম্যানুয়াল গার্ডেন স্প্রেয়ার (৫ লিটার)",
    price: 850,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=300",
    quantity: 1,
  },
]; 

export const MainLayout: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);

  // কার্ট কোয়ান্টিটি বাড়ানো/কমানোর হ্যান্ডলার
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // কার্ট থেকে আইটেম সরানোর হ্যান্ডলার
  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // মোট পণ্যের সংখ্যা (ডায়নামিক)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      <Footer />
    </div>
  );
};
