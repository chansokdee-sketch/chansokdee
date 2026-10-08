'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Boxes 
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrdersCount: number;
  lowStockCount: number;
  lowStockProducts: any[];
  recentOrders: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error('Fetch dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-zinc-900 border border-zinc-800 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Tổng Quan Quản Trị</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Số liệu thống kê thời gian thực của hệ thống NovaStore
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/settings"
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
          >
            <Boxes className="w-4 h-4" />
            Chỉnh sửa toàn bộ website
          </Link>
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            + Thêm sản phẩm mới
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Doanh thu tích lũy</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">
              {formatPrice(stats?.totalRevenue || 0)}
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">Đơn hàng đã xác nhận & thành công</p>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Tổng số đơn hàng</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">{stats?.totalOrders || 0}</h3>
            <p className="text-[11px] text-amber-400 font-medium mt-1">
              {stats?.pendingOrdersCount || 0} đơn đang chờ xử lý
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Tổng sản phẩm</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">{stats?.totalProducts || 0}</h3>
            <p className="text-[11px] text-zinc-400 font-medium mt-1">Đang hoạt động trong kho</p>
          </div>
        </div>

        {/* Users */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Khách hàng đăng ký</span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">{stats?.totalUsers || 0}</h3>
            <p className="text-[11px] text-cyan-400 font-medium mt-1">Đăng ký bằng số điện thoại</p>
          </div>
        </div>

      </div>

      {/* Low Stock Warning Section */}
      {stats && stats.lowStockProducts.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-sm font-bold">Cảnh báo: Sản phẩm sắp hết hàng (Tồn kho ≤ 5)</h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Nhập kho ngay
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-zinc-200 truncate">{p.name}</h4>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{p.sku}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 font-black text-xs">
                  Còn {p.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Đơn hàng mới nhất</h2>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Xem tất cả đơn hàng
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Mã đơn hàng</th>
                <th className="pb-3 font-semibold">Khách hàng</th>
                <th className="pb-3 font-semibold">SĐT</th>
                <th className="pb-3 font-semibold">Tổng tiền</th>
                <th className="pb-3 font-semibold">Thời gian</th>
                <th className="pb-3 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {stats?.recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-zinc-800/30 transition">
                  <td className="py-3.5 font-mono font-bold text-blue-400">{o.orderCode}</td>
                  <td className="py-3.5 font-medium text-white">{o.customerName}</td>
                  <td className="py-3.5 text-zinc-400 font-mono">{o.customerPhone}</td>
                  <td className="py-3.5 font-bold text-emerald-400">{formatPrice(o.totalPrice)}</td>
                  <td className="py-3.5 text-zinc-400">{formatDate(o.createdAt)}</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
