'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Boxes, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const { user } = useAuth();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    totalPrice, 
    totalItems,
    customerMode,
    setCustomerMode,
    getItemPrice,
    isItemWholesalePrice
  } = useCart();
  const { t, formatPrice, isLao } = useLanguage();

  // Nội bộ (Quản lý & Nhân viên & Admin) không sử dụng giỏ hàng
  if (!isCartOpen || (user && (user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'STAFF'))) {
    return null;
  }

  // Tính tổng giá nếu mua theo giá lẻ để hiển thị số tiền tiết kiệm được
  const regularTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const wholesaleSavings = regularTotal - totalPrice;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-zinc-900">{t('drawer_title')} ({totalItems})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chỉ hiển thị huy hiệu Khách Sỉ nếu tài khoản là WHOLESALE */}
          {customerMode === 'WHOLESALE' && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-200/60 flex items-center justify-between text-xs">
              <span className="text-amber-800 font-semibold flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-amber-600" />
                <span>Tài khoản Khách Sỉ</span>
              </span>
              <span className="text-[10px] bg-amber-500 text-amber-950 font-black px-2 py-0.5 rounded-full">
                Áp dụng Bảng Giá Sỉ ⚡
              </span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 space-y-3 py-16">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-zinc-600 font-medium">{t('drawer_empty')}</p>
                <p className="text-xs text-zinc-400 max-w-xs">{t('drawer_empty_desc')}</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 text-xs font-semibold px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition"
                >
                  {t('drawer_continue_shopping')}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemKey = item.id || item.product.id;
                const unit = item.unit || 'PIECE';
                const unitQty = item.unitQuantity !== undefined ? item.unitQuantity : item.quantity;
                const isWholesale = isItemWholesalePrice(item.product, item.quantity);
                const unitPrice = getItemPrice(item.product, unit);
                const packQty = item.product.packQty || 6;
                const boxQty = item.product.boxQty || 10;
                const cartonQty = item.product.cartonQty || 50;
                const unitLabel = unit === 'CARTON' ? (isLao ? `ລັງ (${cartonQty} ອັນ)` : `Thùng (${cartonQty} cái)`)
                  : unit === 'BOX' ? (isLao ? `ກ່ອງ (${boxQty} ອັນ)` : `Hộp (${boxQty} cái)`)
                  : unit === 'PACK' ? (isLao ? `ແພັກ (${packQty} ອັນ)` : `Lốc (${packQty} cái)`)
                  : (isLao ? 'ອັນ' : 'Cái');

                return (
                  <div 
                    key={itemKey}
                    className="flex gap-3 sm:gap-4 p-3 bg-zinc-50/70 hover:bg-zinc-50 rounded-2xl border border-zinc-100 transition"
                  >
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=150&auto=format&fit=crop'}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-white border border-zinc-200/60 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug">
                          {isLao && item.product.nameLao ? item.product.nameLao : item.product.name}
                        </h4>

                        {/* Variants Badges (Unit, Color, Size) */}
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            unit === 'CARTON' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            unit === 'BOX' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            unit === 'PACK' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            'bg-zinc-100 text-zinc-700'
                          }`}>
                            📦 {unitLabel}
                          </span>
                          {item.selectedColor && (
                            <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
                              {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md border border-blue-200">
                              {item.selectedSize}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className={`text-xs font-bold font-mono ${isWholesale ? 'text-amber-600' : 'text-blue-600'}`}>
                            {formatPrice(unitPrice)}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            /{unit === 'CARTON' ? (isLao ? 'ລັງ' : 'thùng') : unit === 'BOX' ? (isLao ? 'ກ່ອງ' : 'hộp') : unit === 'PACK' ? (isLao ? 'ແພັກ' : 'lốc') : (isLao ? 'ອັນ' : 'cái')}
                          </span>
                          {isWholesale && (
                            <span className="text-[9px] bg-amber-500/15 text-amber-700 px-1.5 py-0.2 rounded font-black border border-amber-500/20">
                              Giá sỉ ⚡
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/60">
                        {/* Stepper */}
                        <div className="flex items-center border border-zinc-200 bg-white rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(itemKey, unitQty - 1)}
                            className="p-1 hover:bg-zinc-100 text-zinc-600 transition"
                            title="Giảm"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-zinc-800">
                            {unitQty}
                          </span>
                          <button
                            onClick={() => updateQuantity(itemKey, unitQty + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 hover:bg-zinc-100 text-zinc-600 disabled:opacity-40 transition"
                            title="Tăng"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(itemKey)}
                          className="text-zinc-400 hover:text-red-500 p-1 transition"
                          title="Xóa khỏi giỏ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-100 bg-zinc-50/50 space-y-3">
              {wholesaleSavings > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tiết kiệm giá sỉ:</span>
                  </span>
                  <span className="text-amber-700 font-mono">-{formatPrice(wholesaleSavings)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">{t('cart_subtotal')}</span>
                <span className="font-extrabold text-lg text-zinc-900 font-mono">{formatPrice(totalPrice)}</span>
              </div>

              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-4 bg-zinc-900 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 transition active:scale-98"
              >
                <span>{t('drawer_proceed_checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
