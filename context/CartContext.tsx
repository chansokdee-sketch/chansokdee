'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, PackagingUnit } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export type CustomerPriceMode = 'RETAIL' | 'WHOLESALE';

export interface AddToCartExtraOptions {
  unit?: PackagingUnit;
  unitQuantity?: number;
  variantId?: string;
  variantName?: string;
  variantImage?: string;
  tier1Value?: string;
  tier2Value?: string;
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
  totalPriceTHB: number;
  canPayWithTHB: boolean;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  customerMode: CustomerPriceMode;
  setCustomerMode: (mode: CustomerPriceMode) => void;
  getItemPrice: (
    product: Product, 
    unitOrQuantity?: PackagingUnit | number, 
    variantId?: string,
    tier1Value?: string,
    tier2Value?: string
  ) => number;
  getItemPriceTHB: (
    product: Product, 
    unit?: PackagingUnit, 
    variantId?: string,
    tier1Value?: string,
    tier2Value?: string
  ) => number | null;
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

  const getItemPrice = (
    product: Product, 
    unitOrQuantity?: PackagingUnit | number,
    variantId?: string,
    tier1Value?: string,
    tier2Value?: string
  ): number => {
    const unit: PackagingUnit = typeof unitOrQuantity === 'string' ? unitOrQuantity : 'PIECE';
    const variant = variantId && product.variants ? product.variants.find(v => v.id === variantId) : undefined;
    const tier1Opt = tier1Value && product.tier1Options ? product.tier1Options.find(o => o.name === tier1Value || o.id === tier1Value) : undefined;
    const tier2Opt = tier2Value && product.tier2Options ? product.tier2Options.find(o => o.name === tier2Value || o.id === tier2Value) : undefined;

    // Giá lẻ và sỉ cơ sở: Ưu tiên giá riêng của phân loại Tier 1 nếu có
    let baseRetail = product.price;
    if (tier1Opt?.price && tier1Opt.price > 0) {
      baseRetail = tier1Opt.price;
    } else if (variant && variant.price !== undefined && variant.price > 0) {
      baseRetail = variant.price;
    }
    if (tier2Opt?.priceBonus && tier2Opt.priceBonus > 0) {
      baseRetail += tier2Opt.priceBonus;
    }

    let baseWholesale = (product.wholesalePrice !== undefined && product.wholesalePrice > 0)
      ? product.wholesalePrice
      : Math.round(baseRetail * 0.8);
    if (variant && variant.wholesalePrice !== undefined && variant.wholesalePrice > 0) {
      baseWholesale = variant.wholesalePrice;
    }
    if (tier2Opt?.priceBonus && tier2Opt.priceBonus > 0) {
      baseWholesale += tier2Opt.priceBonus;
    }

    const basePrice = customerMode === 'WHOLESALE' ? baseWholesale : baseRetail;

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

  const getItemPriceTHB = (
    product: Product,
    unit?: PackagingUnit,
    variantId?: string,
    tier1Value?: string,
    tier2Value?: string
  ): number | null => {
    const targetUnit = unit || 'PIECE';
    const variant = variantId && product.variants ? product.variants.find(v => v.id === variantId) : undefined;
    const tier1Opt = tier1Value && product.tier1Options ? product.tier1Options.find(o => o.name === tier1Value || o.id === tier1Value) : undefined;
    const tier2Opt = tier2Value && product.tier2Options ? product.tier2Options.find(o => o.name === tier2Value || o.id === tier2Value) : undefined;

    if (targetUnit === 'PACK') {
      if (product.packPriceTHB && product.packPriceTHB > 0) return product.packPriceTHB;
    } else if (targetUnit === 'BOX') {
      if (product.boxPriceTHB && product.boxPriceTHB > 0) return product.boxPriceTHB;
    } else if (targetUnit === 'CARTON') {
      if (product.cartonPriceTHB && product.cartonPriceTHB > 0) return product.cartonPriceTHB;
    } else {
      // PIECE
      let baseTHB: number | null = null;
      if (tier1Opt?.priceTHB && tier1Opt.priceTHB > 0) {
        baseTHB = tier1Opt.priceTHB;
      } else if (customerMode === 'WHOLESALE' && variant && variant.wholesalePriceTHB && variant.wholesalePriceTHB > 0) {
        baseTHB = variant.wholesalePriceTHB;
      } else if (variant && variant.priceTHB && variant.priceTHB > 0) {
        baseTHB = variant.priceTHB;
      } else if (customerMode === 'WHOLESALE' && product.wholesalePriceTHB && product.wholesalePriceTHB > 0) {
        baseTHB = product.wholesalePriceTHB;
      } else if (product.priceTHB && product.priceTHB > 0) {
        baseTHB = product.priceTHB;
      }
      if (baseTHB !== null && tier2Opt?.priceBonusTHB && tier2Opt.priceBonusTHB > 0) {
        baseTHB += tier2Opt.priceBonusTHB;
      }
      return baseTHB;
    }
    return null;
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
    const variantId = options?.variantId;
    const variantName = options?.variantName;
    const variantImage = options?.variantImage;
    const tier1Value = options?.tier1Value;
    const tier2Value = options?.tier2Value;
    const itemId = `${product.id}_${unit}_${variantId || 'def'}_${tier1Value || 'def'}_${tier2Value || 'def'}_${selectedColor || 'def'}_${selectedSize || 'def'}`;

    const existingIndex = cart.findIndex(
      item => item.id === itemId || 
      (item.product.id === product.id && 
       (item.unit || 'PIECE') === unit && 
       (item.variantId || '') === (variantId || '') &&
       (item.tier1Value || '') === (tier1Value || '') &&
       (item.tier2Value || '') === (tier2Value || '') &&
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
        variantId,
        variantName,
        variantImage,
        tier1Value,
        tier2Value,
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
        variantId,
        variantName,
        variantImage,
        tier1Value,
        tier2Value,
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

  // Tổng số đơn vị (cái, lốc, hộp, thùng)
  const totalItems = cart.reduce((sum, item) => sum + (item.unitQuantity !== undefined ? item.unitQuantity : item.quantity), 0);
  
  // Tính tổng tiền Kíp dựa trên đơn vị và phân loại của từng món
  const totalPrice = cart.reduce((sum, item) => {
    const unit = item.unit || 'PIECE';
    const unitPrice = getItemPrice(item.product, unit, item.variantId, item.tier1Value, item.tier2Value);
    const unitQty = item.unitQuantity !== undefined ? item.unitQuantity : item.quantity;
    return sum + unitPrice * unitQty;
  }, 0);

  // Kiểm tra giỏ hàng có đủ điều kiện thanh toán bằng Tiền Baht không:
  // "nếu có thì bỏ, còn không thì sẽ không được thanh toán bằng bat"
  const canPayWithTHB = cart.length > 0 && cart.every(item => {
    const thb = getItemPriceTHB(item.product, item.unit, item.variantId, item.tier1Value, item.tier2Value);
    return thb !== null && thb > 0;
  });

  // Tổng tiền Baht thực tế theo giá cài sẵn của từng món
  const totalPriceTHB = cart.reduce((sum, item) => {
    const thb = getItemPriceTHB(item.product, item.unit, item.variantId, item.tier1Value, item.tier2Value) || 0;
    const unitQty = item.unitQuantity !== undefined ? item.unitQuantity : item.quantity;
    return sum + thb * unitQty;
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
        totalPriceTHB,
        canPayWithTHB,
        totalItems,
        isCartOpen,
        setIsCartOpen,
        customerMode,
        setCustomerMode,
        getItemPrice,
        getItemPriceTHB,
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
