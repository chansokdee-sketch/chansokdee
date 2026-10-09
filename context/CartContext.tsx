'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/lib/types';

export type CustomerPriceMode = 'RETAIL' | 'WHOLESALE';

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
  customerMode: CustomerPriceMode;
  setCustomerMode: (mode: CustomerPriceMode) => void;
  getItemPrice: (product: Product, quantity?: number) => number;
  isItemWholesalePrice: (product: Product, quantity?: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [customerMode, setCustomerModeState] = useState<CustomerPriceMode>('RETAIL');

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('novastore_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedMode = localStorage.getItem('novastore_customer_mode') as CustomerPriceMode;
      if (savedMode === 'RETAIL' || savedMode === 'WHOLESALE') {
        setCustomerModeState(savedMode);
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

  const setCustomerMode = (mode: CustomerPriceMode) => {
    setCustomerModeState(mode);
    try {
      localStorage.setItem('novastore_customer_mode', mode);
    } catch {
      // ignore
    }
  };

  const getItemPrice = (product: Product, quantity = 1): number => {
    const wholesale = product.wholesalePrice !== undefined && product.wholesalePrice > 0
      ? product.wholesalePrice
      : Math.round(product.price * 0.8);
    const minQty = product.minWholesaleQty || 3;

    // Nếu đang ở chế độ Khách sỉ hoặc số lượng đạt mốc mua sỉ tối thiểu
    if (customerMode === 'WHOLESALE' || quantity >= minQty) {
      return wholesale;
    }
    return product.price;
  };

  const isItemWholesalePrice = (product: Product, quantity = 1): boolean => {
    const minQty = product.minWholesaleQty || 3;
    return customerMode === 'WHOLESALE' || quantity >= minQty;
  };

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
  
  // Tính tổng tiền dựa trên giá sỉ hoặc giá lẻ theo từng món và chế độ khách hàng
  const totalPrice = cart.reduce((sum, item) => {
    const unitPrice = getItemPrice(item.product, item.quantity);
    return sum + unitPrice * item.quantity;
  }, 0);

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
        customerMode,
        setCustomerMode,
        getItemPrice,
        isItemWholesalePrice,
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
