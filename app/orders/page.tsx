'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Order, OrderStatus } from '@/lib/types';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  ArrowLeft, 
  AlertCircle,
  AlertTriangle,
  Loader2,
  X,
  UserCheck,
  Check
} from 'lucide-react';

export default function MyOrdersPage() {
  const { user, loading: authLoading, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const { t, formatPrice, isLao } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Cancellation State
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [cancelToast, setCancelToast] = useState<string | null>(null);

  const STATUS_CONFIG: Record<OrderStatus, { labelKey: any; color: string; icon: any }> = {
    PENDING: { labelKey: 'status_pending', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    CONFIRMED: { labelKey: 'status_confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 },
    PROCESSING: { labelKey: 'status_processing', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Clock },
    SHIPPING: { labelKey: 'status_shipping', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: Truck },
    COMPLETED: { labelKey: 'status_completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    CANCELLED: { labelKey: 'status_cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  };

  const fetchOrders = async (silent = false) => {
    if (!user) return;
    try {
      if (!silent) setLoading(true);
      const res = await fetch('/api/orders/my-orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
      // Tự động kiểm tra cập nhật mỗi 5 giây
      const interval = setInterval(() => fetchOrders(true), 5000);
      return () => clearInterval(interval);
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${d.toLocaleDateString('vi-VN')}`;
  };

  // Xác nhận hủy đơn hàng
  const handleConfirmCancel = async () => {
    if (!cancellingOrder) return;

    setIsSubmittingCancel(true);
    try {
      const finalReason = selectedReason === 'other' ? (customReason.trim() || t('orders_cancel_reason_other')) : selectedReason;

      const res = await fetch(`/api/orders/${cancellingOrder.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: finalReason }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        // Cập nhật ngay trong danh sách đơn hàng
        setOrders(prev => prev.map(o => o.id === cancellingOrder.id ? data.order : o));
        setCancellingOrder(null);
        setSelectedReason('');
        setCustomReason('');
        setCancelToast(t('orders_cancel_success'));
        setTimeout(() => setCancelToast(null), 3500);
      } else {
        alert(data.error || 'Hủy đơn hàng thất bại. Vui lòng thử lại!');
      }
    } catch (err) {
      console.error('Cancel order error:', err);
      alert('Lỗi kết nối khi gửi yêu cầu hủy đơn.');
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      {/* Toast thông báo hủy thành công */}
      {cancelToast && (
        <div className="fixed top-20 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top duration-200">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{cancelToast}</span>
        </div>
      )}

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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
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

              // Điều kiện khách được phép tự hủy đơn: Trạng thái PENDING và NHÂN VIÊN CHƯA TIẾP NHẬN
              const isStaffAssigned = Boolean(order.assignedStaffId && order.assignedStaffId.trim() !== '');
              const isCancellable = order.status === 'PENDING' && !isStaffAssigned;

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

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${
                        order.currency === 'THB'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-blue-100 text-blue-800 border-blue-300'
                      }`}>
                        {order.currency === 'THB' ? '฿ Tiền Baht (THB)' : '₭ Tiền Kíp (LAK)'}
                      </span>

                      {/* Trạng thái đơn hàng */}
                      {isCancellable ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-800 border-amber-300">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          <span>{t('orders_status_waiting_staff')}</span>
                        </span>
                      ) : isStaffAssigned && order.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-purple-50 text-purple-800 border-purple-200">
                          <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span>{t('orders_status_staff_assigned')}: {order.assignedStaffName || 'Nhân viên'}</span>
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {t(statusCfg.labelKey)}
                        </span>
                      )}

                      {/* NÚT HỦY ĐƠN HÀNG (Chỉ hiển thị khi nhân viên chưa tiếp nhận) */}
                      {isCancellable && (
                        <button
                          onClick={() => {
                            setCancellingOrder(order);
                            setSelectedReason('');
                            setCustomReason('');
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition active:scale-95 shadow-xs"
                          title="Hủy đơn hàng này khi nhân viên chưa tiếp nhận"
                        >
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                          <span>{t('orders_cancel_btn')}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Thông báo nếu đã hủy đơn */}
                  {order.status === 'CANCELLED' && (
                    <div className="bg-red-50/60 border-b border-red-100 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-red-700">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>Đơn hàng đã được hủy. Số lượng sản phẩm đã được tự động hoàn lại kho.</span>
                      </div>
                      {order.note && order.note.includes('[Khách hàng hủy') && (
                        <span className="text-[11px] bg-red-100 text-red-800 px-2 py-0.5 rounded-md font-medium">
                          {order.note.match(/\[Khách hàng hủy[^\]]*\]/)?.[0] || 'Khách đã hủy'}
                        </span>
                      )}
                    </div>
                  )}

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
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded">
                                📦 {item.unitName || 'Cái'} x{item.unitQuantity !== undefined ? item.unitQuantity : item.quantity}
                              </span>
                              {item.variantName && (
                                <span className="text-[10px] font-bold bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded border border-pink-200">
                                  🏷️ {item.variantName}
                                </span>
                              )}
                              {item.tier1Value && !item.variantName?.includes(item.tier1Value) && (
                                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                                  🎨 {item.tier1Value}
                                </span>
                              )}
                              {item.tier2Value && !item.variantName?.includes(item.tier2Value) && (
                                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">
                                  ⚖️ {item.tier2Value}
                                </span>
                              )}
                              <span className="text-xs text-zinc-400">
                                • {formatPrice(item.price)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-zinc-800">
                            {formatPrice(item.price * (item.unitQuantity !== undefined ? item.unitQuantity : item.quantity))}
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

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-zinc-500 text-[11px] block">{t('orders_total')}</span>
                        <strong className="text-base font-black text-blue-600 font-mono block">
                          {order.currency === 'THB'
                            ? `${new Intl.NumberFormat('de-DE').format(order.totalPrice)} ฿`
                            : `${new Intl.NumberFormat('de-DE').format(order.totalPrice)} ₭`}
                        </strong>
                        <span className="text-[10px] text-zinc-400 font-medium font-mono block">
                          ≈ {order.currency === 'THB'
                            ? `${new Intl.NumberFormat('de-DE').format(order.totalPriceLAK || order.totalPrice * (order.exchangeRate || 650))} ₭`
                            : `${new Intl.NumberFormat('de-DE').format(order.totalPriceTHB || Math.round(order.totalPrice / (order.exchangeRate || 650)))} ฿`}
                        </span>
                      </div>

                      {/* Nút hủy phụ ở chân đơn hàng */}
                      {isCancellable && (
                        <button
                          onClick={() => {
                            setCancellingOrder(order);
                            setSelectedReason('');
                            setCustomReason('');
                          }}
                          className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition active:scale-95 flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{t('orders_cancel_btn')}</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* MODAL XÁC NHẬN HỦY ĐƠN HÀNG */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-zinc-100 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900">
                    {t('orders_cancel_modal_title')}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">
                    Mã đơn: <strong className="text-blue-600 font-bold">#{cancellingOrder.orderCode}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCancellingOrder(null)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cảnh báo */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 leading-relaxed">
              {t('orders_cancel_modal_desc')}
            </div>

            {/* Chọn lý do hủy đơn */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-zinc-700 block">
                {t('orders_cancel_reason_label')}
              </label>

              <div className="space-y-2">
                {[
                  { id: 'address', text: t('orders_cancel_reason_1') },
                  { id: 'change_item', text: t('orders_cancel_reason_2') },
                  { id: 'mind_change', text: t('orders_cancel_reason_3') },
                  { id: 'duplicate', text: t('orders_cancel_reason_4') },
                  { id: 'other', text: t('orders_cancel_reason_other') },
                ].map((reason) => (
                  <label
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id === 'other' ? 'other' : reason.text)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition select-none ${
                      (selectedReason === reason.text || (reason.id === 'other' && selectedReason === 'other'))
                        ? 'bg-blue-50/70 border-blue-400 text-blue-900 font-semibold'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100/70'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      checked={selectedReason === reason.text || (reason.id === 'other' && selectedReason === 'other')}
                      onChange={() => setSelectedReason(reason.id === 'other' ? 'other' : reason.text)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span>{reason.text}</span>
                  </label>
                ))}
              </div>

              {selectedReason === 'other' && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Nhập lý do chi tiết của bạn..."
                  className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition mt-2"
                  rows={2}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                disabled={isSubmittingCancel}
                className="flex-1 py-3 px-4 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 text-xs font-bold transition text-center"
              >
                {t('orders_cancel_keep_btn')}
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isSubmittingCancel}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 active:scale-95 disabled:opacity-50"
              >
                {isSubmittingCancel ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang hủy đơn...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>{t('orders_cancel_confirm_btn')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
