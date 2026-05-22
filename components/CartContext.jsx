"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kf-cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("kf-cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.qty * item.price, 0), [cart]);

  function addToCart(product, variant) {
    const existing = cart.find((item) => item.id === product.id && item.variant === variant);
    const totalQty = cart.filter((item) => item.id === product.id).reduce((sum, item) => sum + item.qty, 0);
    
    if (!product.stock) {
      return { success: false, error: `Stok ${product.name} sudah habis.` };
    }

    if (existing) {
      if (totalQty >= product.stock) {
        return { success: false, error: `Stok ${product.name} tidak mencukupi untuk ditambah.` };
      }
      setCart(
        cart.map((item) =>
          item === existing ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
      return { success: true };
    }

    if (totalQty >= product.stock) {
      return { success: false, error: `Stok ${product.name} tidak mencukupi.` };
    }

    setCart([
      ...cart,
      {
        id: product.id,
        name: product.name,
        variant,
        qty: 1,
        price: product.price,
      },
    ]);
    return { success: true };
  }

  function changeQty(index, delta) {
    setCart((current) => {
      const next = current
        .map((item, itemIndex) => (itemIndex === index ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0);
      return next;
    });
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        changeQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
