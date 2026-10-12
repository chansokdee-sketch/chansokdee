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
  Sparkles,
  ShoppingCart,
  Package
} from 'lucide-react';
import { formatTHB, formatLAK } from '@/lib/currency';

export default function CartPage() {
  const router = useRouter();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    totalPrice,
    totalPriceTHB,
    totalPriceLAKForNonTHB,
    hasTHBItems,
    hasNonTHBItems,
    canPayWithTHB,
    isMixedPayment,
    totalItems,
    customerMode,
    setCustomerMode,
    getItemPrice,
    getItemPriceTHB,
    isItemWholesalePrice,
    hasFullPriceAccess
  } = useCart();
  const { user, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const { t, formatPrice, formatDualPrice, currency, isLao, thbRate } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentCurrency, setPaymentCurrency] = useState<'LAK' | 'THB'>(currency === 'THB' ? 'THB' : 'LAK');

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<{
    orderCode: string;
    totalPrice: number;
    currency: 'LAK' | 'THB' | 'MIXED';
    totalPriceLAK?: number;
    totalPriceTHB?: number;
    paidTHB?: number;
    paidLAK?: number;
    exchangeRate?: number;
  } | null>(null);

  // Cập nhật nhánh tiền theo lựa chọn ở navbar nếu khách chưa bấm đổi
  useEffect(() => {
    if (currency) {
      if (currency === 'THB' && !canPayWithTHB) {
        setPaymentCurrency('LAK');
      } else if (currency === 'THB') {
        setPaymentCurrency('THB');
      } else {
        setPaymentCurrency('LAK');
      }
    }
  }, [currency, canPayWithTHB]);

  // Nếu giỏ hàng không có bất kỳ món nào có giá Baht, chuyển về Tiền Kíp
  useEffect(() => {
    if (!canPayWithTHB && paymentCurrency === 'THB') {
      setPaymentCurrency('LAK');
    }
  }, [canPayWithTHB, paymentCurrency]);

  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.address) setShippingAddress(user.address);
    }
  }, [user]);

  // Quản lý & Nhân viên không có mục mua hàng
  if (user && (user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'STAFF')) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-32 pb-24 text-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto text-2xl border border-blue-500/30">
              {user.role === 'ADMIN' ? '👑' : user.role === 'MANAGER' ? '💼' : '👔'}
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {user.role === 'ADMIN' ? '👑 Quyền Boss Hải' : user.role === 'MANAGER' ? '💼 Tài Khoản Quản Lý' : '👔 Tài Khoản Nhân Viên'}
              </h2>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Tài khoản nội bộ <strong>không sử dụng chức năng mua hàng</strong>.
                <br />
                Vai trò của bạn là <strong>nhận order từ khách</strong>, <strong>hoàn thành order</strong> và <strong>thêm sản phẩm mới</strong> giống với Admin.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-3">
              <Link
                href="/admin/orders"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>📋 Đến Bàn Nhận & Hoàn Thành Order</span>
              </Link>
              <Link
                href="/admin/products"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>➕ Thêm Sản Phẩm Mới</span>
              </Link>
              <Link
                href="/"
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-2xl text-xs transition"
              >
                Quay lại trang chủ cửa hàng
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            unit: item.unit || 'PIECE',
            unitQuantity: item.unitQuantity !== undefined ? item.unitQuantity : item.quantity,
            variantId: item.variantId,
            variantName: item.variantName,
            variantImage: item.variantImage,
            tier1Value: item.tier1Value,
            tier2Value: item.tier2Value,
            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
          })),
          customerName,
          customerPhone,
          customerType: customerMode,
          shippingAddress,
          note,
          currency: paymentCurrency,
          exchangeRate: thbRate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.error || 'Đặt hàng thất bại.');
      } else {
        setOrderSuccess({
          orderCode: data.order.orderCode,
          totalPrice: data.order.totalPrice,
          currency: data.order.currency || paymentCurrency,
          totalPriceLAK: data.order.totalPriceLAK,
          totalPriceTHB: data.order.totalPriceTHB,
          paidTHB: data.order.paidTHB,
          paidLAK: data.order.paidLAK,
          exchangeRate: data.order.exchangeRate || thbRate,
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
    const isMixedSuccess = orderSuccess.currency === 'MIXED' || (Boolean(orderSuccess.paidTHB && orderSuccess.paidTHB > 0) && Boolean(orderSuccess.paidLAK && orderSuccess.paidLAK > 0));

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

            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">{t('cart_order_code')}</span>
                <strong className="text-blue-600 font-mono text-sm">{orderSuccess.orderCode}</strong>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500">{isLao ? 'ສະກຸນເງິນຊຳລະ:' : 'Nhánh tiền thanh toán:'}</span>
                <span className={`px-2 py-0.5 rounded-lg font-black text-[11px] flex items-center gap-1 ${
                  isMixedSuccess
                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                    : orderSuccess.currency === 'THB'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}>
                  <span>{isMixedSuccess ? '฿ + ₭' : orderSuccess.currency === 'THB' ? '฿' : '₭'}</span>
                  <span>
                    {isMixedSuccess
                      ? (isLao ? 'ເງິນບາດ & ເງິນກີບ (ປະສົມ)' : 'Baht Thái & Kíp Lào (Hỗn hợp)')
                      : orderSuccess.currency === 'THB' 
                      ? (isLao ? 'ເງິນບາດໄທ (THB)' : 'Tiền Baht Thái (THB)') 
                      : (isLao ? 'ເງິນກີບລາວ (LAK)' : 'Tiền Kíp Lào (LAK)')}
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500">{t('cart_total')}</span>
                <div className="text-right">
                  <strong className="text-zinc-900 font-black text-base font-mono block">
                    {isMixedSuccess
                      ? `${formatTHB(orderSuccess.paidTHB || 0)} ฿ + ${formatLAK(orderSuccess.paidLAK || 0)} ₭`
                      : orderSuccess.currency === 'THB'
                      ? `${formatTHB(orderSuccess.totalPrice)} ฿`
                      : `${formatLAK(orderSuccess.totalPrice)} ₭`}
                  </strong>
                  <span className="text-[11px] text-zinc-500 font-semibold font-mono block">
                    ≈ {isMixedSuccess
                      ? `${formatLAK(Math.round((orderSuccess.paidTHB || 0) * (orderSuccess.exchangeRate || 650) + (orderSuccess.paidLAK || 0)))} ₭`
                      : orderSuccess.currency === 'THB'
                      ? `${formatLAK(orderSuccess.totalPriceLAK || orderSuccess.totalPrice * (orderSuccess.exchangeRate || 650))} ₭`
                      : `${formatTHB(orderSuccess.totalPriceTHB || Math.round(orderSuccess.totalPrice / (orderSuccess.exchangeRate || 650)))} ฿`}
                  </span>
                </div>
              </div>

              {isMixedSuccess && (
                <div className="bg-purple-50/70 border border-purple-200/60 rounded-xl p-2.5 text-[11px] text-purple-900 space-y-1">
                  <div className="flex justify-between font-mono">
                    <span>• Tiền Baht (cho các món có giá Baht):</span>
                    <strong className="font-bold">{formatTHB(orderSuccess.paidTHB || 0)} ฿</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>• Tiền Kíp tính thêm (cho món nhận Kíp):</span>
                    <strong className="font-bold">{formatLAK(orderSuccess.paidLAK || 0)} ₭</strong>
                  </div>
                </div>
              )}

              {(orderSuccess.currency === 'THB' || isMixedSuccess) && (
                <div className="flex justify-between text-[11px] text-zinc-400 border-t border-zinc-200/60 pt-1.5">
                  <span>{isLao ? 'ອັດຕາແລກປ່ຽນນຳໃຊ້:' : 'Tỷ giá áp dụng:'}</span>
                  <span className="font-mono font-medium">1 Baht = {orderSuccess.exchangeRate || 650} Kíp</span>
                </div>
              )}

              <div className="flex justify-between pt-1 border-t border-zinc-200/60">
                <span className="text-zinc-500">{t('cart_payment_method')}</span>
                <span className="text-zinc-800 font-medium">{t('cart_payment_cod')}</span>
              </div>
            </div>

            {/* Thông báo quyền hủy đơn khi nhân viên chưa tiếp nhận */}
            <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>{isLao ? 'ອໍເດີກຳລັງລໍຖ້າພະນັກງານຮັບ' : 'Đơn hàng đang chờ nhân viên tiếp nhận'}</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                {isLao 
                  ? 'ທ່ານສາມາດຍົກເລີກການສັ່ງຊື້ໄດ້ທຸກເວລາໃນໜ້າ "ລາຍການສັ່ງຊື້ຂອງຂ້ອຍ" ກ່ອນທີ່ພະນັກງານຈະຮັບອໍເດີ.'
                  : 'Bạn có thể tự hủy đơn hàng trong mục "Đơn hàng của tôi" bất cứ lúc nào trước khi nhân viên tiếp nhận.'}
              </p>
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
                  {customerMode === 'WHOLESALE' && (
                    <div className="flex items-center gap-1.5 text-xs bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                      <Boxes className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-amber-900 font-bold">Khách sỉ: Áp dụng bảng giá buôn ⚡</span>
                    </div>
                  )}
                </div>

                <div className="divide-y divide-zinc-100 space-y-4">
                  {cart.map((item) => {
                    const itemKey = item.id || item.product.id;
                    const unit = item.unit || 'PIECE';
                    const unitQty = item.unitQuantity !== undefined ? item.unitQuantity : item.quantity;
                    const isWholesale = isItemWholesalePrice(item.product, item.quantity);
                    const unitPrice = getItemPrice(item.product, unit, item.variantId, item.tier1Value, item.tier2Value);
                    const packQty = item.product.packQty || 6;
                    const boxQty = item.product.boxQty || 10;
                    const cartonQty = item.product.cartonQty || 50;
                    const unitLabel = unit === 'CARTON' ? (isLao ? `ລັງ (${cartonQty} ອັນ)` : `Thùng (${cartonQty} cái)`)
                      : unit === 'BOX' ? (isLao ? `ກ່ອງ (${boxQty} ອັນ)` : `Hộp (${boxQty} cái)`)
                      : unit === 'PACK' ? (isLao ? `ແພັກ (${packQty} ອັນ)` : `Lốc (${packQty} cái)`)
                      : (isLao ? 'ອັນ' : 'Cái');

                    return (
                      <div key={itemKey} className="pt-4 first:pt-0 flex gap-3 sm:gap-4 items-center">
                        <img
                          src={item.variantImage || item.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop'}
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

                          {/* Variants Badges (Unit, Variant Name, Color, Size) */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              unit === 'CARTON' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              unit === 'BOX' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                              unit === 'PACK' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              'bg-zinc-100 text-zinc-700'
                            }`}>
                              📦 {unitLabel}
                            </span>
                            {item.variantName && (
                              <span className="text-[10px] font-bold bg-pink-50 text-pink-700 px-2 py-0.5 rounded-md border border-pink-200">
                                🏷️ {item.variantName}
                              </span>
                            )}
                            {item.tier1Value && !item.variantName?.includes(item.tier1Value) && (
                              <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
                                🎨 {item.tier1Value}
                              </span>
                            )}
                            {item.tier2Value && !item.variantName?.includes(item.tier2Value) && (
                              <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-200">
                                ⚖️ {item.tier2Value}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                                {item.selectedSize}
                              </span>
                            )}
                          </div>

                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              <span className={`text-xs sm:text-sm font-black font-mono ${isWholesale ? 'text-amber-600' : 'text-blue-600'}`}>
                                {formatPrice(unitPrice)}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                /{unit === 'CARTON' ? (isLao ? 'ລັງ' : 'thùng') : unit === 'BOX' ? (isLao ? 'ກ່ອງ' : 'hộp') : unit === 'PACK' ? (isLao ? 'ແພັກ' : 'lốc') : (isLao ? (item.product.baseUnitNameLao || 'ອັນ') : (item.product.baseUnitName?.toLowerCase() || 'cái'))}
                              </span>

                              {/* Huy hiệu hiển thị giá Baht (chỉ cho khách sỉ có giá Baht) */}
                              {(() => {
                                if (!isWholesale) return null;
                                const itemTHB = getItemPriceTHB(item.product, unit, item.variantId, item.tier1Value, item.tier2Value);
                                if (itemTHB && itemTHB > 0) {
                                  return (
                                    <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded font-mono font-bold border border-amber-200">
                                      ฿ {formatTHB(itemTHB)}
                                    </span>
                                  );
                                }
                                return null;
                              })()}

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
                              onClick={() => updateQuantity(itemKey, unitQty - 1)}
                              className="p-1 sm:p-1.5 hover:bg-zinc-100 text-zinc-600 transition"
                            >
                              <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                            <span className="w-7 sm:w-8 text-center text-xs font-bold text-zinc-900">
                              {unitQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(itemKey, unitQty + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="p-1 sm:p-1.5 hover:bg-zinc-100 text-zinc-600 disabled:opacity-40 transition"
                            >
                              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(itemKey)}
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

                  {/* CHỌN NHÁNH TIỀN TỆ THANH TOÁN (KÍP LÀO HOẶC BAHT THÁI / HỖN HỢP) */}
                  <div className="pt-3 pb-1 border-t border-zinc-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <span>💰</span>
                        <span>{isLao ? 'ເລືອກສະກຸນເງິນຊຳລະ:' : 'Chọn nhánh tiền thanh toán:'}</span>
                      </label>
                      <span className="text-[10px] text-zinc-400 font-normal">
                        1 Baht = {thbRate} Kíp
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Nhánh 1: 100% Tiền Kíp Lào */}
                      <button
                        type="button"
                        onClick={() => setPaymentCurrency('LAK')}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                          paymentCurrency === 'LAK'
                            ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 text-blue-950 font-bold shadow-xs'
                            : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200 text-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold flex items-center gap-1.5">
                            <span className="text-sm text-blue-600 font-mono">₭</span>
                            <span>{isLao ? 'ເງິນກີບ (LAK)' : 'Tiền Kíp Lào'}</span>
                          </span>
                          {paymentCurrency === 'LAK' && (
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          )}
                        </div>
                        <p className="text-sm font-mono font-black text-blue-600 mt-1.5">
                          {formatDualPrice(totalPrice).lakFormatted}
                        </p>
                        <span className="text-[10px] text-zinc-500 mt-0.5">
                          {isLao ? 'ຊຳລະທັງໝົດດ້ວຍເງິນກີບ' : '100% thanh toán bằng Kíp'}
                        </span>
                      </button>

                      {/* Nhánh 2: Tiền Baht Thái (hoặc Hỗn hợp Baht + Kíp nếu có món không có giá Baht) */}
                      <button
                        type="button"
                        disabled={!canPayWithTHB}
                        onClick={() => {
                          if (canPayWithTHB) setPaymentCurrency('THB');
                        }}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                          !canPayWithTHB
                            ? 'opacity-50 cursor-not-allowed bg-zinc-100 border-zinc-200 text-zinc-400'
                            : paymentCurrency === 'THB'
                            ? isMixedPayment 
                              ? 'bg-purple-500/15 border-purple-500 ring-2 ring-purple-500/30 text-purple-950 font-bold shadow-xs'
                              : 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 text-amber-950 font-bold shadow-xs'
                            : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200 text-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold flex items-center gap-1.5">
                            <span className="text-sm text-amber-600 font-mono">{isMixedPayment ? '฿+₭' : '฿'}</span>
                            <span>
                              {isMixedPayment 
                                ? (isLao ? 'ເງິນບາດ + ເງິນກີບ' : 'Baht + Kíp (Hỗn hợp)') 
                                : (isLao ? 'ເງິນບາດ (THB)' : 'Tiền Baht Thái')}
                            </span>
                          </span>
                          {paymentCurrency === 'THB' && canPayWithTHB && (
                            <span className={`w-2 h-2 rounded-full ${isMixedPayment ? 'bg-purple-600' : 'bg-amber-600'}`}></span>
                          )}
                        </div>

                        {/* Số tiền hiển thị */}
                        {isMixedPayment ? (
                          <div className="mt-1.5">
                            <p className="text-xs font-mono font-black text-purple-900 leading-tight">
                              {formatTHB(totalPriceTHB)} ฿ + {formatLAK(totalPriceLAKForNonTHB)} ₭
                            </p>
                          </div>
                        ) : (
                          <p className={`text-sm font-mono font-black mt-1.5 ${canPayWithTHB ? 'text-amber-700' : 'text-zinc-400'}`}>
                            {canPayWithTHB ? `${formatTHB(totalPriceTHB)} ฿` : (customerMode === 'RETAIL' || !hasFullPriceAccess ? 'Chỉ dành cho Khách Sỉ' : 'Chỉ nhận Kíp')}
                          </p>
                        )}

                        <span className={`text-[10px] mt-0.5 ${canPayWithTHB ? (isMixedPayment ? 'text-purple-700 font-medium' : 'text-amber-800/80') : 'text-red-500 font-medium'}`}>
                          {!canPayWithTHB 
                            ? (customerMode === 'RETAIL' || !hasFullPriceAccess
                                ? (isLao ? 'ສະເພາະລູກຄ້າຂາຍສົ່ງ ⚡' : 'Chỉ áp dụng cho Khách Sỉ ⚡')
                                : (isLao ? 'ທຸກສິນຄ້າຮັບສະເພາະກີບ' : 'Giỏ chỉ nhận Tiền Kíp'))
                            : isMixedPayment
                            ? (isLao ? 'ຈ່າຍບາດ ແລະ ຄິດໄລ່ກີບຕື່ມ' : 'Món thiếu Baht tính thêm Kíp')
                            : (isLao ? 'ຊຳລະດ້ວຍເງິນບາດໄທ' : 'Thanh toán 100% bằng Baht')}
                        </span>
                      </button>
                    </div>

                    {/* Giải thích chi tiết khi chọn Hỗn hợp Baht + Kíp */}
                    {paymentCurrency === 'THB' && isMixedPayment && (
                      <div className="text-[11px] text-purple-900 bg-purple-50/80 border border-purple-200/90 rounded-2xl p-3 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-purple-950">
                          <span>💡</span>
                          <span>{isLao ? 'ຊຳລະແບບປະສົມ ເງິນບາດ & ເງິນກີບ:' : 'Thanh toán kết hợp Baht & Kíp:'}</span>
                        </div>
                        <p className="leading-relaxed text-purple-800">
                          {isLao
                            ? `ສິນຄ້າທີ່ມີລາຄາບາດຈ່າຍເປັນເງິນບາດ (${formatTHB(totalPriceTHB)} ฿), ສ່ວນສິນຄ້າທີ່ບໍ່ມີລາຄາບາດແມ່ນຄິດໄລ່ເພີ່ມເປັນເງິນກີບ (${formatLAK(totalPriceLAKForNonTHB)} ₭).`
                            : `Các món có giá Baht sẽ thanh toán bằng tiền Baht (${formatTHB(totalPriceTHB)} ฿), các món chưa có giá Baht sẽ tính thêm bằng tiền Kíp (${formatLAK(totalPriceLAKForNonTHB)} ₭).`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs">
                    {(() => {
                      const regularTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
                      const savings = regularTotal - totalPrice;
                      return savings > 0 ? (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Tiết kiệm giá sỉ:</span>
                          </span>
                          <span className="text-amber-700 font-mono font-bold">
                            -{paymentCurrency === 'THB' ? `${formatTHB(Math.round(savings / thbRate * 100) / 100)} ฿` : formatDualPrice(savings).lakFormatted}
                          </span>
                        </div>
                      ) : null;
                    })()}

                    <div className="flex justify-between text-zinc-500">
                      <span>{t('cart_subtotal')} ({cart.reduce((a, b) => a + b.quantity, 0)}):</span>
                      <span className="font-semibold text-zinc-800 font-mono">
                        {paymentCurrency === 'THB'
                          ? (isMixedPayment 
                              ? `${formatTHB(totalPriceTHB)} ฿ + ${formatLAK(totalPriceLAKForNonTHB)} ₭`
                              : `${formatTHB(totalPriceTHB)} ฿`)
                          : formatDualPrice(totalPrice).lakFormatted}
                      </span>
                    </div>

                    {/* Dòng phân tách chi tiết cho Hỗn hợp */}
                    {paymentCurrency === 'THB' && isMixedPayment && (
                      <div className="space-y-1 bg-zinc-50 p-2 rounded-xl border border-zinc-200/60 text-[11px] font-mono">
                        <div className="flex justify-between text-amber-900">
                          <span>• Phần thanh toán tiền Baht:</span>
                          <strong>{formatTHB(totalPriceTHB)} ฿</strong>
                        </div>
                        <div className="flex justify-between text-blue-900">
                          <span>• Phần thanh toán tính thêm Kíp:</span>
                          <strong>{formatLAK(totalPriceLAKForNonTHB)} ₭</strong>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between text-zinc-500">
                      <span>{t('cart_shipping_fee')}</span>
                      <span className="text-emerald-600 font-semibold">{t('cart_free')}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-zinc-100">
                      <div>
                        <span className="font-bold text-zinc-900 text-sm block">{t('cart_total')}</span>
                        <span className="text-[10px] text-zinc-400">
                          {paymentCurrency === 'THB'
                            ? (isMixedPayment
                                ? '(Trả phần Baht + phần Kíp)'
                                : '(Thanh toán 100% tiền Baht)')
                            : '(Trả bằng Tiền Kíp Lào)'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-xl text-blue-600 font-mono block">
                          {paymentCurrency === 'THB'
                            ? (isMixedPayment
                                ? `${formatTHB(totalPriceTHB)} ฿ + ${formatLAK(totalPriceLAKForNonTHB)} ₭`
                                : `${formatTHB(totalPriceTHB)} ฿`)
                            : formatDualPrice(totalPrice).lakFormatted}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-medium font-mono block">
                          ≈ {paymentCurrency === 'THB'
                            ? (isMixedPayment
                                ? `${formatLAK(Math.round(totalPriceTHB * thbRate + totalPriceLAKForNonTHB))} ₭`
                                : `${formatLAK(Math.round(totalPriceTHB * thbRate))} ₭`)
                            : formatDualPrice(totalPrice).thbFormatted}
                        </span>
                      </div>
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
