'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Eye, 
  X,
  Phone,
  UserCheck 
} from 'lucide-react';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  SHIPPING: { label: 'Đang giao hàng', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      } else {
        alert(data.error || 'Cập nhật trạng thái thất bại');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">Quản Lý Đơn Hàng</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Theo dõi và cập nhật trạng thái đơn hàng của khách hàng
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn hoặc số điện thoại..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 pl-10 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Trạng thái:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xác nhận</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="SHIPPING">Đang giao</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Container: Mobile Cards (md:hidden) and Desktop Table (hidden md:block) */}
      
      {/* 1. Mobile Cards View */}
      <div className="md:hidden space-y-3.5">
        {orders.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-3xl text-zinc-400 text-xs">
            Không tìm thấy đơn hàng nào
          </div>
        ) : (
          orders.map((o) => (
            <div 
              key={o.id}
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 shadow-md"
            >
              {/* Header: Mã đơn + Thời gian + Trạng thái */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-zinc-800">
                <div>
                  <span className="font-mono font-bold text-blue-400 text-sm">
                    {o.orderCode}
                  </span>
                  <span className="block text-[10px] text-zinc-500">
                    {formatDate(o.createdAt)}
                  </span>
                </div>
                
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                  STATUS_CONFIG[o.status]?.color || 'bg-zinc-800 text-zinc-300'
                }`}>
                  {STATUS_CONFIG[o.status]?.label || o.status}
                </span>
              </div>

              {/* Thông tin khách hàng & Nút gọi điện 1 chạm */}
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-xs truncate">{o.customerName}</h4>
                    {o.customerType === 'WHOLESALE' ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                        🏢 Sỉ ⚡
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-zinc-800 text-zinc-400 whitespace-nowrap">
                        👤 Lẻ
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{o.shippingAddress}</p>
                </div>

                {/* Nút gọi trực tiếp từ điện thoại */}
                <a
                  href={`tel:${o.customerPhone}`}
                  className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 flex-shrink-0"
                  title="Bấm để gọi điện cho khách"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi {o.customerPhone}</span>
                </a>
              </div>

              {/* Tóm tắt món hàng */}
              <div className="p-2.5 bg-zinc-950/60 rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-center text-[11px] text-zinc-400">
                  <span>{o.items.length} món trong giỏ:</span>
                  <span className="font-bold text-white">Tổng: {formatPrice(o.totalPrice)}</span>
                </div>
                <p className="text-[11px] text-zinc-300 line-clamp-2">
                  {o.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                </p>
              </div>

              {/* Thanh thao tác nhanh */}
              <div className="flex items-center gap-2 pt-1">
                <select
                  value={o.status}
                  onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                  className={`flex-1 text-xs font-bold rounded-xl px-3 py-2 border outline-none bg-zinc-950 transition ${
                    STATUS_CONFIG[o.status]?.color || ''
                  }`}
                >
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="PROCESSING">Đang xử lý</option>
                  <option value="SHIPPING">Đang giao</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>

                {o.status === 'PENDING' && (
                  <button
                    onClick={() => handleUpdateStatus(o.id, 'CONFIRMED')}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition active:scale-95 flex items-center gap-1 whitespace-nowrap shadow-md shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Duyệt</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedOrder(o)}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition flex items-center gap-1 active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Desktop Table View */}
      <div className="hidden md:block bg-zinc-900 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/50">
                <th className="py-4 px-6 font-semibold">Mã đơn</th>
                <th className="py-4 px-4 font-semibold">Khách hàng</th>
                <th className="py-4 px-4 font-semibold">SĐT</th>
                <th className="py-4 px-4 font-semibold">Sản phẩm</th>
                <th className="py-4 px-4 font-semibold">Tổng tiền</th>
                <th className="py-4 px-4 font-semibold">Trạng thái</th>
                <th className="py-4 px-6 font-semibold text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-4 px-6 font-mono font-bold text-blue-400">
                    {o.orderCode}
                    <span className="block text-[10px] text-zinc-500 font-sans mt-0.5">
                      {formatDate(o.createdAt)}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-medium text-white">
                    <div>{o.customerName}</div>
                    {o.customerType === 'WHOLESALE' ? (
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        🏢 Khách sỉ ⚡
                      </span>
                    ) : (
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-semibold bg-zinc-800 text-zinc-400">
                        👤 Khách lẻ
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 font-mono text-zinc-400">
                    <a href={`tel:${o.customerPhone}`} className="hover:text-emerald-400 transition underline">
                      {o.customerPhone}
                    </a>
                  </td>

                  <td className="py-4 px-4 text-zinc-300">
                    <span className="font-semibold text-white">{o.items.length} món</span>
                    <span className="block text-[11px] text-zinc-500 truncate max-w-[180px]">
                      {o.items.map(i => i.productName).join(', ')}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-bold text-emerald-400">
                    {formatPrice(o.totalPrice)}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-bold rounded-xl px-2.5 py-1.5 border outline-none bg-zinc-950 transition cursor-pointer ${
                          STATUS_CONFIG[o.status]?.color || ''
                        }`}
                      >
                        <option value="PENDING">Chờ xác nhận</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="PROCESSING">Đang xử lý</option>
                        <option value="SHIPPING">Đang giao</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>

                      {o.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'CONFIRMED')}
                          className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-[10px] font-bold shadow-md transition active:scale-95 flex items-center gap-1 whitespace-nowrap animate-pulse"
                          title="Nhận order từ khách ngay"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Nhận đơn</span>
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                      title="Xem chi tiết đơn hàng"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-5 top-5 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">
              Chi Tiết Đơn Hàng: <span className="font-mono text-blue-400">{selectedOrder.orderCode}</span>
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              Thời gian đặt: {formatDate(selectedOrder.createdAt)}
            </p>

            {/* Customer Details */}
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-zinc-500">Khách hàng:</span>
                <strong className="text-white">{selectedOrder.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Số điện thoại:</span>
                <strong className="text-blue-400 font-mono">{selectedOrder.customerPhone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Địa chỉ giao:</span>
                <span className="text-zinc-300 text-right max-w-xs">{selectedOrder.shippingAddress}</span>
              </div>
              {selectedOrder.note && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Ghi chú:</span>
                  <span className="text-amber-400 italic">{selectedOrder.note}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase">Danh sách sản phẩm</h4>
              <div className="divide-y divide-zinc-800 border-t border-b border-zinc-800 max-h-48 overflow-y-auto">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=100&auto=format&fit=crop'}
                        alt={item.productName}
                        className="w-10 h-10 object-cover rounded-lg bg-zinc-800"
                      />
                      <div>
                        <p className="font-medium text-white">{item.productName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-zinc-400 font-mono">x{item.quantity} | {formatPrice(item.price)}</span>
                          {item.isWholesale && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-black border border-amber-500/30">
                              Giá sỉ ⚡
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Status change */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs text-zinc-500">Tổng thanh toán:</span>
                <p className="text-xl font-black text-emerald-400">{formatPrice(selectedOrder.totalPrice)}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Trạng thái:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-blue-500 outline-none"
                >
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="PROCESSING">Đang xử lý</option>
                  <option value="SHIPPING">Đang giao</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>

            {/* Quick Staff Action Buttons */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <span className="text-xs font-semibold text-zinc-400">Thao tác xử lý đơn:</span>
              <div className="flex flex-wrap gap-2">
                {selectedOrder.status === 'PENDING' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'CONFIRMED')}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>⚡ Nhận Order & Xác Nhận Đơn</span>
                  </button>
                )}
                {selectedOrder.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'PROCESSING')}
                    className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <span>📦 Bắt đầu chuẩn bị & đóng gói món</span>
                  </button>
                )}
                {selectedOrder.status === 'PROCESSING' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPING')}
                    className="flex-1 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <Truck className="w-4 h-4" />
                    <span>🚚 Giao cho bên vận chuyển</span>
                  </button>
                )}
                {selectedOrder.status === 'SHIPPING' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'COMPLETED')}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✅ Đã giao thành công (Hoàn thành)</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
