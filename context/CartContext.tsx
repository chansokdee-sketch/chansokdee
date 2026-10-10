'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, PackagingUnit } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export type CustomerPriceMode = 'RETAIL' | 'WHOLESALE';

export interface AddToCartExtraOptions {
  unit?: PackagingUnit;
  unitQuantity?: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product, 
    quantity?: number, 
    options?: AddToCartExtraOptions
  ) => { success: boolean; message: string };
  updateQuantity: (cartItemIdOrProductId: string, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (cartItemIdOrProductId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  customerMode: CustomerPriceMode;
  setCustomerMode: (mode: CustomerPriceMode) => void;
  getItemPrice: (product: Product, unitOrQuantity?: PackagingUnit | number) => number;
  isItemWholesalePrice: (product: Product, quantity?: number) => boolean;
  hasFullPriceAccess: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Không giới hạn đối với các chức vụ khác: Admin, Quản Lý, Nhân Viên và Khách Sỉ (WHOLESALE)
  // Chỉ giới hạn duy nhất đối với Khách Mua Lẻ (RETAIL) và người chưa đăng nhập
  const hasFullPriceAccess = Boolean(
    user && (
      user.role === 'ADMIN' ||
      user.role === 'MANAGER' ||
      user.role === 'STAFF' ||
      user.customerType === 'WHOLESALE'
    )
  );

  const [wholesaleToggle, setWholesaleToggle] = useState<CustomerPriceMode>('WHOLESALE');

  // Người có quyền xem toàn bộ giá mặc định hiển thị cả Giá Sỉ và Giá Lẻ
  // Khách lẻ và người chưa đăng nhập bị khóa cứng ở chế độ RETAIL (chỉ xem Giá Lẻ)
  const customerMode: CustomerPriceMode = hasFullPriceAccess ? wholesaleToggle : 'RETAIL';

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('novastore_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
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
    // Các chức vụ không bị giới hạn (Admin, Quản Lý, Nhân Viên, Khách Sỉ) được tự do chuyển chế độ xem
    if (hasFullPriceAccess) {
      setWholesaleToggle(mode);
    }
  };

  const getItemPrice = (product: Product, unitOrQuantity?: PackagingUnit | number): number => {
    const unit: PackagingUnit = typeof unitOrQuantity === 'string' ? unitOrQuantity : 'PIECE';
    const wholesale = product.wholesalePrice !== undefined && product.wholesalePrice > 0
      ? product.wholesalePrice
      : Math.round(product.price * 0.8);

    const basePrice = customerMode === 'WHOLESALE' ? wholesale : product.price;

    if (unit === 'PACK') {
      const packQty = product.packQty || 6;
      return product.packPrice && product.packPrice > 0 ? product.packPrice : basePrice * packQty;
    }

    if (unit === 'BOX') {
      const boxQty = product.boxQty || 10;
      return product.boxPrice && product.boxPrice > 0 ? product.boxPrice : basePrice * boxQty;
    }

    if (unit === 'CARTON') {
      const cartonQty = product.cartonQty || 50;
      return product.cartonPrice && product.cartonPrice > 0 ? product.cartonPrice : basePrice * cartonQty;
    }

    return basePrice;
  };

  const isItemWholesalePrice = (_product: Product, _quantity?: number): boolean => {
    return customerMode === 'WHOLESALE';
  };

  const addToCart = (
    product: Product, 
    quantity = 1,
    options?: AddToCartExtraOptions
  ): { success: boolean; message: string } => {
    if (product.stock <= 0) {
      return { success: false, message: 'Sản phẩm này hiện đã hết hàng.' };
    }

    const unit: PackagingUnit = options?.unit || 'PIECE';
    const packQty = product.packQty || 6;
    const boxQty = product.boxQty || 10;
    const cartonQty = product.cartonQty || 50;
    const multiplier = unit === 'CARTON' ? cartonQty : unit === 'BOX' ? boxQty : unit === 'PACK' ? packQty : 1;
    const unitQuantity = options?.unitQuantity !== undefined ? options.unitQuantity : quantity;
    const targetPieceQty = unitQuantity * multiplier;

    const unitNameVi = unit === 'CARTON' ? 'thùng' : unit === 'BOX' ? 'hộp' : unit === 'PACK' ? 'lốc' : 'cái';

    if (targetPieceQty > product.stock) {
      return {
        success: false,
        message: `Kho hiện chỉ còn ${product.stock} sản phẩm (không đủ ${unitQuantity} ${unitNameVi}).`,
      };
    }

    const selectedColor = options?.selectedColor;
    const selectedSize = options?.selectedSize;
    const itemId = `${product.id}_${unit}_${selectedColor || 'def'}_${selectedSize || 'def'}`;

    const existingIndex = cart.findIndex(
      item => item.id === itemId || 
      (item.product.id === product.id && 
       (item.unit || 'PIECE') === unit && 
       (item.selectedColor || '') === (selectedColor || '') && 
       (item.selectedSize || '') === (selectedSize || ''))
    );

    let newCart = [...cart];

    if (existingIndex > -1) {
      const currentUnitQty = newCart[existingIndex].unitQuantity || Math.floor(newCart[existingIndex].quantity / multiplier) || 1;
      const nextUnitQty = currentUnitQty + unitQuantity;
      const nextPieceQty = nextUnitQty * multiplier;

      if (nextPieceQty > product.stock) {
        return {
          success: false,
          message: `Kho chỉ còn ${product.stock} sản phẩm trong kho.`,
        };
      }

      newCart[existingIndex] = {
        ...newCart[existingIndex],
        id: itemId,
        unit,
        unitQuantity: nextUnitQty,
        quantity: nextPieceQty,
        selectedColor,
        selectedSize,
      };
      setCart(newCart);
      return { 
        success: true, 
        message: `Đã cập nhật giỏ hàng: ${nextUnitQty} ${unitNameVi}.` 
      };
    } else {
      newCart.push({
        id: itemId,
        product,
        unit,
        unitQuantity,
        quantity: targetPieceQty,
        selectedColor,
        selectedSize,
      });
      setCart(newCart);
      return { 
        success: true, 
        message: `Đã thêm ${unitQuantity} ${unitNameVi} vào giỏ hàng!` 
      };
    }
  };

  const updateQuantity = (cartItemIdOrProductId: string, newUnitQuantity: number): { success: boolean; message?: string } => {
    if (newUnitQuantity <= 0) {
      removeFromCart(cartItemIdOrProductId);
      return { success: true };
    }

    const existingIndex = cart.findIndex(
      item => item.id === cartItemIdOrProductId || item.product.id === cartItemIdOrProductId
    );
    if (existingIndex === -1) return { success: false };

    const item = cart[existingIndex];
    const unit = item.unit || 'PIECE';
    const packQty = item.product.packQty || 6;
    const boxQty = item.product.boxQty || 10;
    const cartonQty = item.product.cartonQty || 50;
    const multiplier = unit === 'CARTON' ? cartonQty : unit === 'BOX' ? boxQty : unit === 'PACK' ? packQty : 1;
    const totalPieceQty = newUnitQuantity * multiplier;

    if (totalPieceQty > item.product.stock) {
      return {
        success: false,
        message: `Số lượng tối đa còn trong kho là ${item.product.stock} chiếc.`,
      };
    }

    const newCart = [...cart];
    newCart[existingIndex] = {
      ...item,
      unitQuantity: newUnitQuantity,
      quantity: totalPieceQty,
    };
    setCart(newCart);
    return { success: true };
  };

  const removeFromCart = (cartItemIdOrProductId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemIdOrProductId && item.product.id !== cartItemIdOrProductId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Tổng số đơn vị (cái, hộp, thùng)
  const totalItems = cart.reduce((sum, item) => sum + (item.unitQuantity !== undefined ? item.unitQuantity : item.quantity), 0);
  
  // Tính tổng tiền dựa trên đơn vị đã chọn của từng món
  const totalPrice = cart.reduce((sum, item) => {
    const unit = item.unit || 'PIECE';
    const unitPrice = getItemPrice(item.product, unit);
    const unitQty = item.unitQuantity !== undefined ? item.unitQuantity : item.quantity;
    return sum + unitPrice * unitQty;
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
        hasFullPriceAccess,
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
