'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const { t, formatPrice, isLao } = useLanguage();

  if (!isCartOpen) return null;

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
          <div className="p-4 sm:p-6 border-b border-zinc-100 flex items-center justify-between">
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

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
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
              cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-3 sm:gap-4 p-3 bg-zinc-50/70 hover:bg-zinc-50 rounded-2xl border border-zinc-100 transition"
                >
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop'}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-white border border-zinc-200/60 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug">
                        {isLao && item.product.nameLao ? item.product.nameLao : item.product.name}
                      </h4>
                      <p className="text-xs font-bold text-blue-600 mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/60">
                      {/* Stepper */}
                      <div className="flex items-center border border-zinc-200 bg-white rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 transition"
                          title="Giảm"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-zinc-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 disabled:opacity-40 transition"
                          title="Tăng"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-zinc-400 hover:text-red-500 p-1 transition"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-zinc-100 bg-zinc-50/50 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">{t('cart_subtotal')}</span>
                <span className="font-bold text-lg text-zinc-900">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-[11px] text-zinc-400 text-center">
                {t('cart_free_ship_guarantee')}
              </p>
              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition"
                >
                  {t('drawer_proceed_checkout')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition"
                >
                  {t('drawer_continue_shopping')}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
