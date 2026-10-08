'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Order, OrderStatus } from '@/lib/types';
import { Package, Clock, CheckCircle2, Truck, XCircle, ArrowLeft, AlertCircle } from 'lucide-react';

export default function MyOrdersPage() {
  const { user, loading: authLoading, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const { t, formatPrice, isLao } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const STATUS_CONFIG: Record<OrderStatus, { labelKey: any; color: string; icon: any }> = {
    PENDING: { labelKey: 'status_pending', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    CONFIRMED: { labelKey: 'status_confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 },
    PROCESSING: { labelKey: 'status_processing', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Clock },
    SHIPPING: { labelKey: 'status_shipping', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: Truck },
    COMPLETED: { labelKey: 'status_completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    CANCELLED: { labelKey: 'status_cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch('/api/orders/my-orders');
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${d.toLocaleDateString('vi-VN')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 sm:pb-12 flex-1 w-full">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-zinc-900">
              {t('orders_title')}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              {t('orders_subtitle')}
            </p>
          </div>
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3.5 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('pd_back')}
          </Link>
        </div>

        {!user ? (
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-12 text-center max-w-md mx-auto space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-base font-bold text-zinc-900">{t('orders_not_logged_in')}</h2>
            <p className="text-xs text-zinc-500">
              {t('orders_not_logged_in_desc')}
            </p>
            <button
              onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
            >
              {t('auth_login_btn')}
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-zinc-200 animate-pulse h-40" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-16 text-center max-w-md mx-auto space-y-4">
            <Package className="w-12 h-12 text-zinc-300 mx-auto" />
            <h2 className="text-base font-bold text-zinc-800">{t('orders_empty')}</h2>
            <p className="text-xs text-zinc-400">
              {t('orders_empty_desc')}
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {t('cart_explore')}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = statusCfg.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs hover:border-zinc-300 transition"
                >
                  {/* Order Header */}
                  <div className="bg-zinc-50/80 px-4 sm:px-6 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-500">{t('orders_code')}</span>
                        <strong className="text-sm font-mono font-bold text-blue-600">
                          {order.orderCode}
                        </strong>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        {t('orders_date')} {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {t(statusCfg.labelKey)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6 divide-y divide-zinc-100 space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop'}
                            alt={item.productName}
                            className="w-14 h-14 object-cover rounded-xl bg-zinc-100 border border-zinc-200/70 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                              {isLao && item.productNameLao ? item.productNameLao : item.productName}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              x{item.quantity} | {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-zinc-800">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="bg-zinc-50/50 px-4 sm:px-6 py-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-zinc-500 max-w-md">
                      <span>{t('orders_ship_to')} <strong>{order.customerName}</strong> ({order.customerPhone}) - {order.shippingAddress}</span>
                      {order.note && <p className="italic text-zinc-400 mt-0.5">{t('orders_note')} {order.note}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">{t('orders_total')}</span>
                      <strong className="text-base font-black text-blue-600">
                        {formatPrice(order.totalPrice)}
                      </strong>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
