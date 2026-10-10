'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
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
  UserCheck,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Copy,
  Printer,
  RefreshCw,
  Sparkles,
  MapPin,
  Check,
  Boxes,
  FileText,
  UserPlus,
  CheckCheck,
  ShieldCheck,
  Zap
} from 'lucide-react';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; badgeBg: string }> = {
  PENDING: { 
    label: 'Chờ xác nhận ⚡', 
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    badgeBg: 'bg-amber-500 text-amber-950 font-black'
  },
  CONFIRMED: { 
    label: 'Đã xác nhận', 
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    badgeBg: 'bg-blue-600 text-white font-bold'
  },
  PROCESSING: { 
    label: 'Đang chuẩn bị', 
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    badgeBg: 'bg-purple-600 text-white font-bold'
  },
  SHIPPING: { 
    label: 'Đang giao hàng', 
    color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    badgeBg: 'bg-cyan-600 text-white font-bold'
  },
  COMPLETED: { 
    label: 'Hoàn thành', 
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    badgeBg: 'bg-emerald-600 text-white font-bold'
  },
  CANCELLED: { 
    label: 'Đã hủy', 
    color: 'bg-red-500/20 text-red-300 border-red-500/40',
    badgeBg: 'bg-zinc-800 text-zinc-400 font-normal'
  },
};

interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<'all' | 'LAK' | 'THB'>('all');
  const [thbRate, setThbRate] = useState<number>(650);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch exchange rate from site settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.thbRate) setThbRate(data.settings.thbRate);
      })
      .catch(() => {});
  }, []);

  // Manager & Staff Assignment State
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [assignModalOrder, setAssignModalOrder] = useState<Order | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignToast, setAssignToast] = useState<string | null>(null);

  // Ref tracking seen order IDs to trigger audio & banner on new orders
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);

  // Fetch staff list for assignment
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.users) {
          const staffOnly = data.users.filter((u: any) => u.role === 'STAFF' || u.role === 'MANAGER');
          setStaffList(staffOnly);
        }
      } catch (err) {
        console.error('Fetch staff error:', err);
      }
    };
    fetchStaff();
  }, []);

  // Load sound setting from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('novastore_order_sound');
      if (saved !== null) {
        setSoundEnabled(saved === 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem('novastore_order_sound', String(next));
    } catch {}
    if (next) {
      playOrderChime();
    }
  };

  // Play pleasant 2-tone "Ding-Dong" bell chime using Web Audio API
  const playOrderChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Tone 1: 587.33 Hz (D5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.35);

      // Tone 2: 880 Hz (A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.18);
      gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.18);
      osc2.stop(ctx.currentTime + 0.65);
    } catch (err) {
      console.error('Audio chime error:', err);
    }
  };

  const fetchOrders = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (data.orders) {
        const fetchedOrders: Order[] = data.orders;

        // Detect newly arrived PENDING orders
        if (!isFirstLoadRef.current) {
          const freshPending = fetchedOrders.find(
            o => o.status === 'PENDING' && !knownOrderIdsRef.current.has(o.id)
          );

          if (freshPending) {
            setNewOrderAlert(freshPending);
            if (soundEnabled) {
              playOrderChime();
            }
          }
        }

        // Update known IDs
        fetchedOrders.forEach(o => knownOrderIdsRef.current.add(o.id));
        isFirstLoadRef.current = false;

        setOrders(fetchedOrders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial fetch and auto-polling every 4 seconds for live reception
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders(true);
    }, 4000);

    return () => clearInterval(interval);
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
        if (newOrderAlert?.id === orderId) {
          setNewOrderAlert(null);
        }
      } else {
        alert(data.error || 'Cập nhật trạng thái thất bại');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quản lý giao đơn cho nhân viên
  const handleAssignOrder = async (orderId: string, staff: StaffMember | null) => {
    setIsAssigning(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedStaffId: staff ? staff.id : '',
          assignedStaffName: staff ? staff.name : '',
          assignedStaffPhone: staff ? staff.phone : '',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
        setAssignModalOrder(null);
        setAssignToast(staff ? `Đã giao đơn thành công cho nhân viên ${staff.name}!` : 'Đã hủy phân công nhân viên');
        setTimeout(() => setAssignToast(null), 3000);
      } else {
        alert(data.error || 'Giao việc cho nhân viên thất bại');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAssigning(false);
    }
  };

  // Quản lý tự hoàn thành đơn
  const handleManagerSelfComplete = async (orderId: string) => {
    const ok = window.confirm('Quản lý xác nhận: Bạn muốn tự mình hoàn tất đơn hàng này ngay bây giờ?');
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          assignedStaffId: user?.id,
          assignedStaffName: user?.name || 'Quản Lý Cửa Hàng',
          assignedStaffPhone: user?.phone || '',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
        if (newOrderAlert?.id === orderId) {
          setNewOrderAlert(null);
        }
        setAssignToast(`🎉 Quản lý đã tự nhận và hoàn tất đơn #${data.order.orderCode}!`);
        setTimeout(() => setAssignToast(null), 3500);
      } else {
        alert(data.error || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatPriceLAK = (price: number) => {
    return new Intl.NumberFormat('de-DE').format(Math.round(price || 0)) + ' ₭';
  };

  const formatPriceTHB = (price: number) => {
    return new Intl.NumberFormat('de-DE').format(Math.round(price || 0)) + ' ฿';
  };

  const formatOrderPrice = (o: Order) => {
    if (o.currency === 'THB') {
      return formatPriceTHB(o.totalPrice);
    }
    return formatPriceLAK(o.totalPrice);
  };

  const formatPrice = (price: number) => {
    return formatPriceLAK(price);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleCopyShipperInfo = (o: Order) => {
    const isThb = o.currency === 'THB';
    const mainPriceStr = isThb ? formatPriceTHB(o.totalPrice) : formatPriceLAK(o.totalPrice);
    const altPriceStr = isThb 
      ? formatPriceLAK(o.totalPriceLAK || o.totalPrice * (o.exchangeRate || thbRate))
      : formatPriceTHB(o.totalPriceTHB || Math.round(o.totalPrice / (o.exchangeRate || thbRate)));

    const text = `📦 ĐƠN HÀNG: ${o.orderCode}
👤 Khách hàng: ${o.customerName}
📞 Số điện thoại: ${o.customerPhone}
📍 Địa chỉ giao: ${o.shippingAddress}
${o.note ? `📝 Ghi chú: ${o.note}\n` : ''}🛍️ Sản phẩm:
${o.items.map(i => `- ${i.productName}${i.unitName ? ` (${i.unitName} x${i.unitQuantity || i.quantity})` : ` (x${i.quantity})`} = ${formatPriceLAK(i.price * (i.unitQuantity !== undefined ? i.unitQuantity : i.quantity))}`).join('\n')}
💰 TỔNG TIỀN THU (COD): ${mainPriceStr} [${isThb ? 'TIỀN BAHT THÁI (THB)' : 'TIỀN KÍP LÀO (LAK)'}]
🔄 Quy đổi tương đương: ${altPriceStr}`;

    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // Doanh thu tách riêng 2 nhánh tiền tệ
  const activeOrders = orders.filter(o => o.status !== 'CANCELLED');
  const totalRevenueLAK = activeOrders
    .filter(o => o.currency !== 'THB')
    .reduce((sum, o) => sum + (o.totalPriceLAK || o.totalPrice), 0);
  const totalRevenueTHB = activeOrders
    .filter(o => o.currency === 'THB')
    .reduce((sum, o) => sum + (o.totalPriceTHB || o.totalPrice), 0);
  const lakOrdersCount = activeOrders.filter(o => o.currency !== 'THB').length;
  const thbOrdersCount = activeOrders.filter(o => o.currency === 'THB').length;

  // Order Counts for Quick Tabs
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const processingCount = orders.filter(o => o.status === 'PROCESSING' || o.status === 'CONFIRMED').length;
  const shippingCount = orders.filter(o => o.status === 'SHIPPING').length;
  const completedCount = orders.filter(o => o.status === 'COMPLETED').length;
  const myAssignedCount = orders.filter(o => o.assignedStaffId === user?.id && o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
  const unassignedCount = orders.filter(o => !o.assignedStaffId && o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;

  const displayedOrders = orders.filter(o => {
    // 1. Tìm kiếm (mã đơn, tên khách, số điện thoại)
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCode = o.orderCode?.toLowerCase().includes(q);
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchPhone = o.customerPhone?.toLowerCase().includes(q);
      if (!matchCode && !matchName && !matchPhone) return false;
    }

    // 2. Lọc theo nhánh tiền tệ
    if (currencyFilter === 'LAK' && o.currency === 'THB') return false;
    if (currencyFilter === 'THB' && o.currency !== 'THB') return false;

    // 3. Lọc theo trạng thái
    if (statusFilter === 'my_assigned') {
      return o.assignedStaffId === user?.id;
    }
    if (statusFilter === 'unassigned') {
      return !o.assignedStaffId && o.status !== 'COMPLETED' && o.status !== 'CANCELLED';
    }
    if (statusFilter === 'PENDING') return o.status === 'PENDING';
    if (statusFilter === 'PROCESSING') return o.status === 'PROCESSING' || o.status === 'CONFIRMED';
    if (statusFilter === 'SHIPPING') return o.status === 'SHIPPING';
    if (statusFilter === 'COMPLETED') return o.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-5 pb-12">
      
      {/* 🔔 LIVE NEW ORDER NOTIFICATION BANNER */}
      {newOrderAlert && (
        <div className="p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in zoom-in-95 border-2 border-white/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0 animate-bounce">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase tracking-wide">
                  ⚡ Có Đơn Hàng Mới Từ Khách!
                </span>
                <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  {newOrderAlert.orderCode}
                </span>
              </div>
              <p className="text-xs text-white/90 mt-0.5">
                Khách: <strong>{newOrderAlert.customerName}</strong> ({newOrderAlert.customerPhone}) • Tổng: <strong>{formatOrderPrice(newOrderAlert)}</strong> <span className="text-[11px] font-mono opacity-90">[{newOrderAlert.currency === 'THB' ? 'Tiền Baht Thái' : 'Tiền Kíp Lào'}]</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                handleUpdateStatus(newOrderAlert.id, 'CONFIRMED');
                setNewOrderAlert(null);
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-950 font-black rounded-xl text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tiếp Nhận Đơn Ngay</span>
            </button>
            <button
              onClick={() => setSelectedOrder(newOrderAlert)}
              className="px-3 py-2 bg-black/30 hover:bg-black/40 text-white rounded-xl text-xs font-semibold transition"
            >
              Xem chi tiết
            </button>
            <button
              onClick={() => setNewOrderAlert(null)}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-black/20"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header & Role Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-500" />
              <span>Bàn Làm Việc Tiếp Nhận Order</span>
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Trực tiếp (Live)</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 mt-1">
            {user?.role === 'MANAGER' ? (
              <span className="text-purple-300 font-semibold">
                💼 Tài khoản Quản Lý: Có quyền <strong>giao đơn order cho nhân viên</strong> hoặc <strong>tự mình hoàn thành order</strong>.
              </span>
            ) : user?.role === 'STAFF' ? (
              <span className="text-emerald-400 font-medium">
                👔 Tài khoản Nhân Viên: Nhận các đơn order được giao, chuẩn bị món và giao cho khách.
              </span>
            ) : (
              <span>👑 Boss Hải (Quản trị viên): Theo dõi trực tiếp, điều phối nhân sự và xử lý đơn hàng.</span>
            )}
          </p>
        </div>

        {/* Audio Toggle & Refresh Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              soundEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Bật/Tắt chuông ting-ting khi có khách đặt đơn mới"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Chuông: BẬT</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-zinc-500" />
                <span>Chuông: TẮT</span>
              </>
            )}
          </button>

          <button
            onClick={() => fetchOrders()}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            title="Làm mới danh sách đơn"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2 NHÁNH TIỀN TỆ: THỐNG KÊ DOANH THU KÍP (LAK) & BAHT (THB) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Nhánh 1: Doanh thu Tiền Kíp */}
        <div className="p-4 rounded-3xl bg-zinc-900 border border-blue-500/30 flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Doanh Thu Tiền Kíp (LAK)</span>
            </span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {formatPriceLAK(totalRevenueLAK)}
            </div>
            <p className="text-[10px] text-zinc-400">
              Tổng <strong>{lakOrdersCount}</strong> đơn thanh toán bằng Kíp Lào
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-2xl font-mono border border-blue-500/20">
            ₭
          </div>
        </div>

        {/* Nhánh 2: Doanh thu Tiền Baht */}
        <div className="p-4 rounded-3xl bg-zinc-900 border border-amber-500/30 flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Doanh Thu Tiền Baht (THB)</span>
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
              {formatPriceTHB(totalRevenueTHB)}
            </div>
            <p className="text-[10px] text-zinc-400">
              Tổng <strong>{thbOrdersCount}</strong> đơn thanh toán bằng Baht Thái
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-2xl font-mono border border-amber-500/20">
            ฿
          </div>
        </div>

        {/* Tỷ giá quy đổi thị trường */}
        <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-between shadow-lg sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span>
              <span>Tỷ Giá Quy Đổi</span>
            </span>
            <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">
              1 THB = {new Intl.NumberFormat('de-DE').format(thbRate)} LAK
            </div>
            <p className="text-[10px] text-zinc-500">
              Tự động quy đổi cho khách khi đặt đơn
            </p>
          </div>
          {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
            <Link
              href="/admin/settings"
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1"
            >
              <span>Sửa tỷ giá</span>
            </Link>
          )}
        </div>
      </div>

      {/* FILTER NHÁNH TIỀN TỆ (LAK / THB / TẤT CẢ) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
        <span className="text-xs font-bold text-zinc-400 mr-1 flex items-center gap-1">
          <span>💰 Lọc tiền tệ:</span>
        </span>
        <button
          onClick={() => setCurrencyFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            currencyFilter === 'all'
              ? 'bg-zinc-200 text-zinc-950 font-black shadow-xs'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <span>Tất cả đơn</span>
          <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded-full">{orders.length}</span>
        </button>
        <button
          onClick={() => setCurrencyFilter('LAK')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            currencyFilter === 'LAK'
              ? 'bg-blue-600 text-white font-black shadow-md'
              : 'bg-zinc-900 text-blue-400 hover:text-blue-300 border border-blue-500/30'
          }`}
        >
          <span>₭ Đơn Tiền Kíp</span>
          <span className="text-[10px] bg-blue-950 px-1.5 py-0.2 rounded-full font-mono">{lakOrdersCount}</span>
        </button>
        <button
          onClick={() => setCurrencyFilter('THB')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            currencyFilter === 'THB'
              ? 'bg-amber-500 text-amber-950 font-black shadow-md'
              : 'bg-zinc-900 text-amber-400 hover:text-amber-300 border border-amber-500/30'
          }`}
        >
          <span>฿ Đơn Tiền Baht</span>
          <span className="text-[10px] bg-amber-950 text-amber-200 px-1.5 py-0.2 rounded-full font-mono">{thbOrdersCount}</span>
        </button>
      </div>

      {/* QUICK STATUS TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            statusFilter === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <span>Tất cả</span>
          <span className="text-[10px] bg-zinc-950/70 px-1.5 py-0.2 rounded-full">
            {orders.length}
          </span>
        </button>

        {/* Tab dành cho Quản lý & Admin: Chưa giao NV */}
        {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
          <button
            onClick={() => setStatusFilter('unassigned')}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'unassigned'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-zinc-900 text-purple-300 hover:text-white border border-purple-500/30'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>👔 Chưa giao NV</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              unassignedCount > 0 ? 'bg-purple-500 text-white font-black' : 'bg-zinc-950/70 text-zinc-400'
            }`}>
              {unassignedCount}
            </span>
          </button>
        )}

        {/* Tab dành riêng cho Nhân viên: Đơn giao cho tôi */}
        {user?.role === 'STAFF' && (
          <button
            onClick={() => setStatusFilter('my_assigned')}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'my_assigned'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-zinc-900 text-emerald-300 hover:text-white border border-emerald-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>⭐ Đơn của tôi</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              myAssignedCount > 0 ? 'bg-emerald-500 text-white font-black' : 'bg-zinc-950/70 text-zinc-400'
            }`}>
              {myAssignedCount}
            </span>
          </button>
        )}

        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            statusFilter === 'PENDING'
              ? 'bg-amber-500 text-amber-950 font-black shadow-md'
              : 'bg-zinc-900 text-amber-400 hover:text-amber-300 border border-amber-500/30'
          }`}
        >
          <span>⚡ Chờ nhận đơn</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
            pendingCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-950/70 text-zinc-300'
          }`}>
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('PROCESSING')}
          className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            statusFilter === 'PROCESSING' || statusFilter === 'CONFIRMED'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-zinc-900 text-purple-300 hover:text-white border border-zinc-800'
          }`}
        >
          <span>👨‍🍳 Đang chuẩn bị</span>
          <span className="text-[10px] bg-zinc-950/70 px-1.5 py-0.2 rounded-full">
            {processingCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('SHIPPING')}
          className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            statusFilter === 'SHIPPING'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-zinc-900 text-cyan-300 hover:text-white border border-zinc-800'
          }`}
        >
          <span>🛵 Đang giao</span>
          <span className="text-[10px] bg-zinc-950/70 px-1.5 py-0.2 rounded-full">
            {shippingCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            statusFilter === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-zinc-900 text-emerald-400 hover:text-white border border-zinc-800'
          }`}
        >
          <span>🎉 Hoàn thành</span>
          <span className="text-[10px] bg-zinc-950/70 px-1.5 py-0.2 rounded-full">
            {completedCount}
          </span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo mã đơn (#ORD-...), tên khách hoặc số điện thoại..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-blue-500 shadow-sm"
        />
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* 1. Mobile Cards View (Tối ưu tuyệt đối cho nhân viên thao tác trên điện thoại) */}
      <div className="md:hidden space-y-3.5">
        {loading ? (
          <div className="p-8 text-center text-zinc-400 text-xs animate-pulse">
            Đang tải danh sách đơn hàng...
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-3xl text-zinc-400 text-xs">
            Không có đơn hàng nào trong mục này
          </div>
        ) : (
          displayedOrders.map((o) => {
            const isPending = o.status === 'PENDING';
            const isConfirmed = o.status === 'CONFIRMED';
            const isProcessing = o.status === 'PROCESSING';
            const isShipping = o.status === 'SHIPPING';

            return (
              <div 
                key={o.id}
                className={`p-4 rounded-3xl space-y-3 shadow-lg border transition ${
                  isPending 
                    ? 'bg-zinc-900 border-amber-500/50 ring-2 ring-amber-500/20' 
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                {/* Header: Mã đơn + Thời gian + Badge Nhánh Tiền + Badge Trạng thái */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div>
                      <span className="font-mono font-black text-blue-400 text-sm">
                        {o.orderCode}
                      </span>
                      <span className="block text-[10px] text-zinc-500 font-sans mt-0.5">
                        {formatDate(o.createdAt)}
                      </span>
                    </div>

                    {/* Badge Nhánh Tiền Kíp vs Baht */}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                      o.currency === 'THB'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}>
                      <span className="font-mono text-xs">{o.currency === 'THB' ? '฿' : '₭'}</span>
                      <span>{o.currency === 'THB' ? 'BAHT THÁI' : 'KÍP LÀO'}</span>
                    </span>
                  </div>
                  
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                    STATUS_CONFIG[o.status]?.color || 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {STATUS_CONFIG[o.status]?.label || o.status}
                  </span>
                </div>

                {/* Khách hàng & Nút gọi điện 1 chạm */}
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
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5" title={o.shippingAddress}>
                      📍 {o.shippingAddress}
                    </p>
                  </div>

                  {/* Nút Gọi Khách Hàng Siêu Tốc */}
                  <a
                    href={`tel:${o.customerPhone}`}
                    className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 flex-shrink-0"
                    title="Gọi ngay cho khách"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi {o.customerPhone}</span>
                  </a>
                </div>

                {/* Danh sách món & Ghi chú */}
                <div className="p-2.5 bg-zinc-950/70 rounded-2xl text-xs space-y-1.5 border border-zinc-800/80">
                  <div className="flex justify-between items-baseline text-[11px] text-zinc-400">
                    <span>{o.items.length} món trong đơn:</span>
                    <div className="text-right">
                      <span className={`font-black text-sm font-mono block ${o.currency === 'THB' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {formatOrderPrice(o)}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono block">
                        ≈ {o.currency === 'THB'
                          ? formatPriceLAK(o.totalPriceLAK || o.totalPrice * (o.exchangeRate || thbRate))
                          : formatPriceTHB(o.totalPriceTHB || Math.round(o.totalPrice / (o.exchangeRate || thbRate)))}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-300 line-clamp-2">
                    {o.items.map(i => `${i.productName}${i.selectedColor ? ` [${i.selectedColor}]` : ''}${i.selectedSize ? ` [${i.selectedSize}]` : ''} (${i.unitName || 'Cái'} x${i.unitQuantity || i.quantity})`).join(', ')}
                  </p>

                  {o.note && (
                    <div className="text-[11px] text-amber-300/90 pt-1 border-t border-zinc-900 italic">
                      💬 Ghi chú: &ldquo;{o.note}&rdquo;
                    </div>
                  )}
                </div>

                {/* 👔 Nhân viên phụ trách / Phân công đơn */}
                <div className="p-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      o.assignedStaffName ? 'bg-purple-500/20 text-purple-300' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {o.assignedStaffName ? '👔' : '⚪'}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Phụ trách:</span>
                      <span className="font-bold text-xs text-white truncate block">
                        {o.assignedStaffName ? `${o.assignedStaffName} (${o.assignedStaffPhone})` : 'Chưa giao nhân viên'}
                      </span>
                    </div>
                  </div>

                  {/* Nút Giao NV cho Quản lý & Admin */}
                  {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                    <button
                      onClick={() => {
                        setAssignModalOrder(o);
                        setSelectedStaffId(o.assignedStaffId || '');
                      }}
                      className="px-2.5 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 rounded-xl text-[11px] font-bold transition flex items-center gap-1 flex-shrink-0 active:scale-95"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{o.assignedStaffName ? 'Đổi NV' : 'Giao NV'}</span>
                    </button>
                  )}
                </div>

                {/* Banner khi đơn được giao cho Nhân viên đang đăng nhập */}
                {user?.role === 'STAFF' && o.assignedStaffId === user?.id && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-xl text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>Quản lý đã chỉ định bạn phụ trách đơn hàng này!</span>
                  </div>
                )}

                {/* Thao tác nhận đơn / chuyển trạng thái của Nhân viên & Quản lý */}
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  {/* Nút hoàn thành tự động cho Quản lý, Nhân viên & Admin */}
                  {(user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'STAFF') && o.status !== 'COMPLETED' && o.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleManagerSelfComplete(o.id)}
                      className="py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-black shadow-md transition active:scale-95 flex items-center justify-center gap-1"
                      title="Hoàn thành đơn này ngay"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>⚡ Hoàn Thành Đơn</span>
                    </button>
                  )}

                  {isPending ? (
                    <button
                      onClick={() => handleUpdateStatus(o.id, 'CONFIRMED')}
                      className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 transition active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>⚡ Nhận Order Ngay</span>
                    </button>
                  ) : isConfirmed ? (
                    <button
                      onClick={() => handleUpdateStatus(o.id, 'PROCESSING')}
                      className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Boxes className="w-4 h-4" />
                      <span>👨‍🍳 Bắt đầu chuẩn bị</span>
                    </button>
                  ) : isProcessing ? (
                    <button
                      onClick={() => handleUpdateStatus(o.id, 'SHIPPING')}
                      className="flex-1 py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-4 h-4" />
                      <span>🛵 Giao cho Shipper</span>
                    </button>
                  ) : isShipping ? (
                    <button
                      onClick={() => handleUpdateStatus(o.id, 'COMPLETED')}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>🎉 Đã giao thành công</span>
                    </button>
                  ) : null}

                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition flex items-center gap-1 active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem</span>
                  </button>

                  <button
                    onClick={() => handleCopyShipperInfo(o)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition active:scale-95"
                    title="Sao chép gửi Shipper"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
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
                <th className="py-4 px-4 font-semibold">SĐT (Gọi)</th>
                <th className="py-4 px-4 font-semibold">Sản phẩm</th>
                <th className="py-4 px-4 font-semibold">Tổng tiền</th>
                <th className="py-4 px-4 font-semibold">Phụ trách</th>
                <th className="py-4 px-4 font-semibold">Trạng thái</th>
                <th className="py-4 px-6 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {displayedOrders.map((o) => (
                <tr key={o.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-4 px-6 font-mono font-bold text-blue-400">
                    <div className="flex items-center gap-1.5">
                      <span>{o.orderCode}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${
                        o.currency === 'THB'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}>
                        {o.currency === 'THB' ? '฿ THB' : '₭ LAK'}
                      </span>
                    </div>
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
                    <a 
                      href={`tel:${o.customerPhone}`} 
                      className="px-2.5 py-1 bg-emerald-600/15 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition inline-flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{o.customerPhone}</span>
                    </a>
                  </td>

                  <td className="py-4 px-4 text-zinc-300">
                    <span className="font-semibold text-white">{o.items.length} món</span>
                    <span className="block text-[11px] text-zinc-500 truncate max-w-[180px]">
                      {o.items.map(i => i.productName).join(', ')}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono">
                    <span className={`font-black text-sm block ${o.currency === 'THB' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {formatOrderPrice(o)}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium block">
                      ≈ {o.currency === 'THB'
                        ? formatPriceLAK(o.totalPriceLAK || o.totalPrice * (o.exchangeRate || thbRate))
                        : formatPriceTHB(o.totalPriceTHB || Math.round(o.totalPrice / (o.exchangeRate || thbRate)))}
                    </span>
                  </td>

                  {/* Cột Phụ trách / Điều phối */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="min-w-0">
                        {o.assignedStaffName ? (
                          <div>
                            <span className="font-bold text-white block truncate max-w-[120px]">
                              {o.assignedStaffName}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono block">
                              {o.assignedStaffPhone}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-zinc-500 italic">Chưa giao NV</span>
                        )}
                      </div>

                      {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                        <button
                          onClick={() => {
                            setAssignModalOrder(o);
                            setSelectedStaffId(o.assignedStaffId || '');
                          }}
                          className="px-2 py-1 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 rounded-lg text-[10px] font-bold transition flex items-center gap-1 whitespace-nowrap active:scale-95"
                          title="Giao đơn cho nhân viên"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>{o.assignedStaffName ? 'Đổi' : 'Giao NV'}</span>
                        </button>
                      )}
                    </div>
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
                        <option value="PROCESSING">Đang chuẩn bị</option>
                        <option value="SHIPPING">Đang giao</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>

                      {o.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'CONFIRMED')}
                          className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-[10px] font-bold shadow-md transition active:scale-95 flex items-center gap-1 whitespace-nowrap animate-pulse"
                          title="Nhận order ngay"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Nhận đơn</span>
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {(user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'STAFF') && o.status !== 'COMPLETED' && o.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleManagerSelfComplete(o.id)}
                          className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-[10px] font-black shadow-xs transition active:scale-95 flex items-center gap-1 whitespace-nowrap"
                          title="Hoàn tất đơn này ngay"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Hoàn tất đơn</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleCopyShipperInfo(o)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                        title="Sao chép gửi Shipper"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                        title="Xem chi tiết đơn hàng"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Copy Toast */}
      {copiedToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4" />
          <span>Đã sao chép thông tin đơn gửi cho Shipper!</span>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pb-3 border-b border-zinc-800 flex-shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Đơn Hàng: <span className="font-mono text-blue-400">{selectedOrder.orderCode}</span>
                </h2>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                  selectedOrder.currency === 'THB'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                }`}>
                  <span className="font-mono">{selectedOrder.currency === 'THB' ? '฿' : '₭'}</span>
                  <span>{selectedOrder.currency === 'THB' ? 'TIỀN BAHT THÁI (THB)' : 'TIỀN KÍP LÀO (LAK)'}</span>
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  STATUS_CONFIG[selectedOrder.status]?.color
                }`}>
                  {STATUS_CONFIG[selectedOrder.status]?.label}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Thời gian đặt: {formatDate(selectedOrder.createdAt)}
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
              {/* Customer Box */}
              <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Khách hàng:</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-white">{selectedOrder.customerName}</strong>
                    {selectedOrder.customerType === 'WHOLESALE' ? (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-black border border-amber-500/30">
                        Khách sỉ ⚡
                      </span>
                    ) : (
                      <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded">
                        Khách lẻ
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Số điện thoại:</span>
                  <a
                    href={`tel:${selectedOrder.customerPhone}`}
                    className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedOrder.customerPhone} (Bấm gọi)</span>
                  </a>
                </div>

                <div className="flex justify-between items-start gap-3">
                  <span className="text-zinc-500 flex-shrink-0">Địa chỉ giao:</span>
                  <span className="text-zinc-200 text-right font-medium">{selectedOrder.shippingAddress}</span>
                </div>

                {selectedOrder.note && (
                  <div className="flex justify-between items-start gap-3 pt-1 border-t border-zinc-900">
                    <span className="text-zinc-500 flex-shrink-0">Ghi chú của khách:</span>
                    <span className="text-amber-300 font-semibold italic text-right">&ldquo;{selectedOrder.note}&rdquo;</span>
                  </div>
                )}
              </div>

              {/* Nhân viên phụ trách / Điều phối */}
              <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-white">Nhân viên phụ trách đơn:</span>
                  </div>
                  {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                    <button
                      onClick={() => {
                        setAssignModalOrder(selectedOrder);
                        setSelectedStaffId(selectedOrder.assignedStaffId || '');
                      }}
                      className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 rounded-lg text-[10px] font-bold transition flex items-center gap-1 active:scale-95"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>{selectedOrder.assignedStaffName ? 'Đổi nhân viên' : 'Giao việc cho nhân viên'}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-zinc-300 pt-1 border-t border-zinc-900">
                  <span className="text-zinc-500">Tên nhân viên:</span>
                  <span className="font-semibold text-white">
                    {selectedOrder.assignedStaffName ? (
                      <span className="text-purple-300 font-bold">👔 {selectedOrder.assignedStaffName} ({selectedOrder.assignedStaffPhone})</span>
                    ) : (
                      <span className="text-zinc-500 italic">Chưa giao nhân viên nào</span>
                    )}
                  </span>
                </div>

                {selectedOrder.assignedBy && (
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>Người phân công:</span>
                    <span>{selectedOrder.assignedBy}</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Món hàng trong đơn ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-2xl bg-zinc-950/50 overflow-hidden">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.productImage || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=100&auto=format&fit=crop'}
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded-xl bg-zinc-800 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{item.productName}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-[11px] text-zinc-300 font-bold bg-zinc-800 px-1.5 py-0.5 rounded">
                              📦 {item.unitName || 'Cái'} x{item.unitQuantity !== undefined ? item.unitQuantity : item.quantity}
                            </span>
                            {item.selectedColor && (
                              <span className="text-[10px] text-rose-300 bg-rose-950/60 border border-rose-800 px-1.5 py-0.5 rounded">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="text-[10px] text-blue-300 bg-blue-950/60 border border-blue-800 px-1.5 py-0.5 rounded">
                                {item.selectedSize}
                              </span>
                            )}
                            <span className="text-[11px] text-zinc-400 font-mono">
                              (tổng {item.quantity} cái) • {formatPrice(item.price)}
                            </span>
                            {item.isWholesale && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-black">
                                Giá sỉ ⚡
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="font-bold text-emerald-400 font-mono flex-shrink-0">
                        {formatPrice(item.price * (item.unitQuantity !== undefined ? item.unitQuantity : item.quantity))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-300 font-bold block">Tổng tiền thu từ khách:</span>
                    <span className="text-[11px] text-zinc-500">
                      {selectedOrder.currency === 'THB' ? 'Khách chọn thanh toán bằng Tiền Baht Thái' : 'Khách chọn thanh toán bằng Tiền Kíp Lào'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-black font-mono block ${selectedOrder.currency === 'THB' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {formatOrderPrice(selectedOrder)}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium font-mono block">
                      ≈ {selectedOrder.currency === 'THB'
                        ? formatPriceLAK(selectedOrder.totalPriceLAK || selectedOrder.totalPrice * (selectedOrder.exchangeRate || thbRate))
                        : formatPriceTHB(selectedOrder.totalPriceTHB || Math.round(selectedOrder.totalPrice / (selectedOrder.exchangeRate || thbRate)))}
                    </span>
                  </div>
                </div>
                {selectedOrder.currency === 'THB' && (
                  <div className="text-[10px] text-zinc-500 pt-1.5 border-t border-zinc-900 flex justify-between">
                    <span>Tỷ giá quy đổi đơn hàng:</span>
                    <span className="font-mono text-zinc-400">1 THB = {selectedOrder.exchangeRate || thbRate} LAK</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-zinc-800 space-y-2.5 flex-shrink-0">
              {/* Nút hoàn thành đơn ngay */}
              {(user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'STAFF') && selectedOrder.status !== 'COMPLETED' && selectedOrder.status !== 'CANCELLED' && (
                <button
                  onClick={() => handleManagerSelfComplete(selectedOrder.id)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>⚡ Hoàn Thành Đơn Ngay</span>
                </button>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {selectedOrder.status === 'PENDING' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'CONFIRMED')}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>⚡ Tiếp Nhận & Xác Nhận Đơn Ngay</span>
                  </button>
                )}
                {selectedOrder.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'PROCESSING')}
                    className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Boxes className="w-4 h-4" />
                    <span>👨‍🍳 Chuyển Sang Chuẩn Bị Món</span>
                  </button>
                )}
                {selectedOrder.status === 'PROCESSING' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPING')}
                    className="flex-1 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Truck className="w-4 h-4" />
                    <span>🛵 Bắt Đầu Giao Hàng</span>
                  </button>
                )}
                {selectedOrder.status === 'SHIPPING' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'COMPLETED')}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>🎉 Đã Giao Thành Công</span>
                  </button>
                )}
              </div>

              {/* Utility Buttons: Copy for shipper & Print */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyShipperInfo(selectedOrder)}
                  className="flex-1 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép gửi Shipper</span>
                </button>
                <button
                  onClick={handlePrintReceipt}
                  className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 active:scale-95"
                  title="In phiếu đơn hàng"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In phiếu</span>
                </button>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs font-bold text-white outline-none"
                >
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="PROCESSING">Đang chuẩn bị</option>
                  <option value="SHIPPING">Đang giao</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="CANCELLED">Hủy đơn</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ASSIGN STAFF MODAL (Dành cho Quản lý & Admin) */}
      {assignModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={() => setAssignModalOrder(null)} />
          
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">Giao Đơn Cho Nhân Viên</h3>
                  <p className="text-[11px] text-zinc-400 font-mono">Đơn #{assignModalOrder.orderCode}</p>
                </div>
              </div>
              <button
                onClick={() => setAssignModalOrder(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-zinc-300">
                Chọn nhân viên tiếp nhận và xử lý đơn hàng này:
              </p>

              {staffList.length === 0 ? (
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-center text-xs text-zinc-400">
                  Chưa có nhân viên nào trong hệ thống. Hãy vào mục <strong className="text-white">Người dùng</strong> để tạo tài khoản nhân viên.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {staffList.map((st) => {
                    const isSelected = selectedStaffId === st.id;
                    const activeOrderCount = orders.filter(
                      o => o.assignedStaffId === st.id && o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
                    ).length;

                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStaffId(st.id)}
                        className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500/30'
                            : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs">
                            {st.role === 'MANAGER' ? '💼' : '👔'}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-white">{st.name}</p>
                            <p className="text-[11px] text-zinc-400 font-mono">{st.phone} • {st.role === 'MANAGER' ? 'Quản lý' : 'Nhân viên'}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold">
                            {activeOrderCount} đơn đang làm
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
              {assignModalOrder.assignedStaffId && (
                <button
                  type="button"
                  onClick={() => handleAssignOrder(assignModalOrder.id, null)}
                  disabled={isAssigning}
                  className="py-2.5 px-3 bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-xl text-xs font-semibold transition"
                >
                  Hủy phân công
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const chosen = staffList.find(s => s.id === selectedStaffId);
                  if (chosen) {
                    handleAssignOrder(assignModalOrder.id, chosen);
                  }
                }}
                disabled={!selectedStaffId || isAssigning}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isAssigning ? 'Đang giao...' : 'Xác Nhận Giao Đơn'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Toast Notification */}
      {assignToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 border border-white/20">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{assignToast}</span>
        </div>
      )}

    </div>
  );
}
