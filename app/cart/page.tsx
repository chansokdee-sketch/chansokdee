'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  Tag,
  Boxes,
  Sparkles
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    totalPrice,
    customerMode,
    setCustomerMode,
    getItemPrice,
    isItemWholesalePrice
  } = useCart();
  const { user, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const { t, formatPrice, isLao } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<{ orderCode: string; totalPrice: number } | null>(null);

  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.address) setShippingAddress(user.address);
    }
  }, [user]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');

    if (!user) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setOrderError('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          customerName,
          customerPhone,
          customerType: customerMode,
          shippingAddress,
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.error || 'Đặt hàng thất bại.');
      } else {
        setOrderSuccess({
          orderCode: data.order.orderCode,
          totalPrice: data.order.totalPrice,
        });
        clearCart();
      }
    } catch {
      setOrderError('Đã xảy ra lỗi kết nối khi đặt hàng.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl space-y-6 w-full animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-zinc-900">{t('cart_success_title')}</h1>
              <p className="text-xs text-zinc-500">
                {t('cart_success_desc')}
              </p>
            </div>

            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">{t('cart_order_code')}</span>
                <strong className="text-blue-600 font-mono text-sm">{orderSuccess.orderCode}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t('cart_total')}</span>
                <strong className="text-zinc-900 font-bold">{formatPrice(orderSuccess.totalPrice)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t('cart_payment_method')}</span>
                <span className="text-zinc-800 font-medium">{t('cart_payment_cod')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/orders"
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition text-center shadow-md shadow-blue-500/20"
              >
                {t('cart_view_history')}
              </Link>
              <Link
                href="/"
                className="flex-1 py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition text-center"
              >
                {t('cart_continue_shopping')}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-12 flex-1 w-full">
        <h1 className="text-xl sm:text-3xl font-black text-zinc-900 mb-6 sm:mb-8">
          {t('cart_title')}
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-10 sm:p-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-zinc-800">{t('cart_empty')}</h2>
            <p className="text-xs text-zinc-400">{t('cart_empty_desc')}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              {t('cart_explore')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Products List Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl border border-zinc-200/80 p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 flex-wrap gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-zinc-900">
                    {t('cart_items_count')} ({cart.length})
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-zinc-500 font-medium">Bảng giá:</span>
                    <div className="flex items-center bg-zinc-100 p-0.5 rounded-full border border-zinc-200 font-bold">
                      <button
                        type="button"
                        onClick={() => setCustomerMode('RETAIL')}
                        className={`px-2.5 sm:px-3 py-1 rounded-full transition flex items-center gap-1 ${
                          customerMode === 'RETAIL'
                            ? 'bg-white text-zinc-900 shadow-2xs'
                            : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                      >
                        <Tag className="w-3 h-3 text-blue-600" />
                        <span>Khách lẻ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomerMode('WHOLESALE')}
                        className={`px-2.5 sm:px-3 py-1 rounded-full transition flex items-center gap-1 ${
                          customerMode === 'WHOLESALE'
                            ? 'bg-amber-400 text-amber-950 font-black shadow-2xs'
                            : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                      >
                        <Boxes className="w-3 h-3 text-amber-900" />
                        <span>Khách sỉ ⚡</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-zinc-100 space-y-4">
                  {cart.map((item) => {
                    const isWholesale = isItemWholesalePrice(item.product, item.quantity);
                    const unitPrice = getItemPrice(item.product, item.quantity);

                    return (
                      <div key={item.product.id} className="pt-4 first:pt-0 flex gap-3 sm:gap-4 items-center">
                        <img
                          src={item.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop'}
                          alt={item.product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl bg-zinc-100 border border-zinc-200/70 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.product.id}`}>
                            <h3 className="text-xs sm:text-sm font-bold text-zinc-900 hover:text-blue-600 transition truncate">
                              {isLao && item.product.nameLao ? item.product.nameLao : item.product.name}
                            </h3>
                          </Link>
                          <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">{t('cart_item_code')} {item.product.sku}</p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className={`text-xs sm:text-sm font-black font-mono ${isWholesale ? 'text-amber-600' : 'text-blue-600'}`}>
                              {formatPrice(unitPrice)}
                            </span>
                            {isWholesale && (
                              <span className="text-[10px] bg-amber-500/15 text-amber-700 px-1.5 py-0.2 rounded font-black border border-amber-500/20">
                                Giá sỉ ⚡
                              </span>
                            )}
                          </div>
                        </div>

                      {/* Stepper & Delete */}
                      <div className="flex flex-col items-end gap-1.5 sm:gap-2">
                        <div className="flex items-center border border-zinc-200 bg-white rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 sm:p-1.5 hover:bg-zinc-100 text-zinc-600 transition"
                          >
                            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <span className="w-7 sm:w-8 text-center text-xs font-bold text-zinc-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 sm:p-1.5 hover:bg-zinc-100 text-zinc-600 disabled:opacity-40 transition"
                          >
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-zinc-400 hover:text-red-500 text-[11px] sm:text-xs flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {t('cart_delete')}
                        </button>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-blue-50/60 rounded-3xl p-4 sm:p-5 border border-blue-100 text-xs text-blue-900 flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>
                  {t('cart_free_ship_guarantee')}
                </span>
              </div>
            </div>

            {/* Checkout Form Column */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 sm:p-8 shadow-xs sticky top-28 space-y-6">
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 pb-2 border-b border-zinc-100">
                  {t('cart_shipping_info')}
                </h2>

                {/* Login prompt if not signed in */}
                {!user && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-2">
                    <p className="font-semibold">{t('cart_login_prompt_title')}</p>
                    <p className="text-[11px] text-amber-700">
                      {t('cart_login_prompt_desc')}
                    </p>
                    <button
                      type="button"
                      onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
                    >
                      {t('cart_login_now')}
                    </button>
                  </div>
                )}

                {orderError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{orderError}</span>
                  </div>
                )}

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      {t('cart_receiver_name')}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Minh Nam"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-base sm:text-xs focus:bg-white focus:outline-none focus:border-blue-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      {t('cart_receiver_phone')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="02055777975 / 0912345678"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-base sm:text-xs focus:bg-white focus:outline-none focus:border-blue-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      {t('cart_receiver_address')}
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Vientiane, Laos / Số nhà, tên đường..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-base sm:text-xs focus:bg-white focus:outline-none focus:border-blue-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      {t('cart_note')}
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Call before delivery..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-base sm:text-xs focus:bg-white focus:outline-none focus:border-blue-600 transition"
                    />
                  </div>

                  {/* Price Summary */}
                  <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs">
                    {(() => {
                      const regularTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
                      const savings = regularTotal - totalPrice;
                      return savings > 0 ? (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Tiết kiệm giá sỉ:</span>
                          </span>
                          <span className="text-amber-700 font-mono font-bold">-{formatPrice(savings)}</span>
                        </div>
                      ) : null;
                    })()}

                    <div className="flex justify-between text-zinc-500">
                      <span>{t('cart_subtotal')} ({cart.reduce((a, b) => a + b.quantity, 0)}):</span>
                      <span className="font-semibold text-zinc-800">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>{t('cart_shipping_fee')}</span>
                      <span className="text-emerald-600 font-semibold">{t('cart_free')}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-zinc-100">
                      <span className="font-bold text-zinc-900 text-sm">{t('cart_total')}</span>
                      <span className="font-black text-xl text-blue-600">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    {submitting ? t('cart_submitting') : t('cart_confirm_checkout')}
                  </button>
                </form>

              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
