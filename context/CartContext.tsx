'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/lib/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('novastore_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('novastore_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, quantity = 1): { success: boolean; message: string } => {
    if (product.stock <= 0) {
      return { success: false, message: 'Sản phẩm này hiện đã hết hàng.' };
    }

    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    let newCart = [...cart];

    if (existingIndex > -1) {
      const currentQty = newCart[existingIndex].quantity;
      const targetQty = currentQty + quantity;

      if (targetQty > product.stock) {
        newCart[existingIndex].quantity = product.stock;
        setCart(newCart);
        return {
          success: false,
          message: `Chỉ còn ${product.stock} sản phẩm trong kho. Đã cập nhật giỏ hàng theo số lượng tối đa.`,
        };
      } else {
        newCart[existingIndex].quantity = targetQty;
        setCart(newCart);
        return { success: true, message: `Đã cập nhật giỏ hàng (${targetQty} sản phẩm).` };
      }
    } else {
      const targetQty = Math.min(quantity, product.stock);
      newCart.push({ product, quantity: targetQty });
      setCart(newCart);
      return { success: true, message: 'Đã thêm sản phẩm vào giỏ hàng!' };
    }
  };

  const updateQuantity = (productId: string, quantity: number): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const existingIndex = cart.findIndex(item => item.product.id === productId);
    if (existingIndex === -1) return { success: false };

    const product = cart[existingIndex].product;
    if (quantity > product.stock) {
      const newCart = [...cart];
      newCart[existingIndex].quantity = product.stock;
      setCart(newCart);
      return {
        success: false,
        message: `Số lượng tối đa có thể mua là ${product.stock} chiếc.`,
      };
    }

    const newCart = [...cart];
    newCart[existingIndex].quantity = quantity;
    setCart(newCart);
    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
