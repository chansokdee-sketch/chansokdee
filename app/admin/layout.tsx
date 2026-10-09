'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  Boxes, 
  ShoppingBag, 
  ShieldCheck, 
  LogOut, 
  AlertOctagon,
  Menu,
  X
} from 'lucide-react';
import AdminMobileBottomNav from '@/components/AdminMobileBottomNav';

const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Tổng quan (Dashboard)', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Sản phẩm & Món ăn', icon: Package },
  { href: '/admin/categories', label: 'Danh mục (Categories)', icon: FolderTree },
  { href: '/admin/orders', label: 'Đơn hàng (Orders)', icon: ShoppingCart },
  { href: '/admin/users', label: 'Nhân viên & Khách hàng', icon: Users },
  { href: '/admin/inventory', label: 'Quản lý kho (Inventory)', icon: Boxes },
  { href: '/admin/settings', label: 'Chỉnh sửa web (Settings)', icon: ShieldCheck },
];

const MANAGER_NAV_ITEMS = [
  { href: '/admin/orders', label: 'Điều phối & Nhận order', icon: ShoppingCart },
  { href: '/admin/products', label: 'Thêm sản phẩm mới (Món ăn)', icon: Package },
  { href: '/admin/categories', label: 'Danh mục (Categories)', icon: FolderTree },
  { href: '/admin/users', label: 'Nhân viên & Khách hàng', icon: Users },
  { href: '/admin/inventory', label: 'Quản lý kho (Inventory)', icon: Boxes },
  { href: '/admin', label: 'Tổng quan (Dashboard)', icon: LayoutDashboard },
];

const STAFF_NAV_ITEMS = [
  { href: '/admin/orders', label: 'Nhận & Hoàn thành order', icon: ShoppingCart },
  { href: '/admin/products', label: 'Thêm sản phẩm mới (Món ăn)', icon: Package },
  { href: '/admin/inventory', label: 'Kiểm tra tồn kho', icon: Boxes },
  { href: '/admin', label: 'Tổng quan (Dashboard)', icon: LayoutDashboard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="text-sm font-semibold animate-pulse">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  // Strict RBAC: User must have ADMIN, MANAGER, or STAFF role
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER' && user.role !== 'STAFF')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Truy Cập Bị Từ Chối</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Khu vực quản lý chỉ dành cho <strong>Boss Hải (Quản trị viên)</strong>, <strong>Quản lý</strong> và <strong>Nhân viên</strong> của hệ thống.
            </p>
          </div>

          <div className="p-4 bg-zinc-800/60 rounded-2xl border border-zinc-700/60 text-xs text-zinc-300 text-left space-y-2">
            <div>
              <p className="font-semibold text-white">👑 Tài khoản Boss Hải (Quản trị viên):</p>
              <p>Số điện thoại: <strong className="text-blue-400">0988888888</strong> | Pass: <strong className="text-blue-400">AdminPassword@123</strong></p>
            </div>
            <div className="pt-1 border-t border-zinc-700/50">
              <p className="font-semibold text-amber-400">💼 Tài khoản Quản Lý (Điều phối đơn, giao việc NV):</p>
              <p>Số điện thoại: <strong className="text-amber-400">0966666666</strong> | Pass: <strong className="text-amber-400">ManagerPassword@123</strong></p>
            </div>
            <div className="pt-1 border-t border-zinc-700/50">
              <p className="font-semibold text-emerald-400">👔 Tài khoản Nhân Viên (Thêm món, nhận order):</p>
              <p>Số điện thoại: <strong className="text-emerald-400">0977777777</strong> | Pass: <strong className="text-emerald-400">StaffPassword@123</strong></p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md"
            >
              Đăng nhập bằng tài khoản Admin
            </button>
            <Link
              href="/"
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs transition"
            >
              Quay lại cửa hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      
      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-white text-sm tracking-tight">Nova Admin</h2>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block -mt-0.5">Control Panel</span>
          </div>
        </div>

        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-xl bg-zinc-800 text-zinc-200 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Backdrop for Mobile Sidebar */}
      {mobileNavOpen && (
        <div 
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40 animate-in fade-in"
        />
      )}

      {/* Sidebar (Desktop fixed, Mobile sliding drawer) */}
      <aside className={`w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:translate-x-0 ${
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-white text-base tracking-tight">Nova Admin</h2>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                Control Panel
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {(user?.role === 'ADMIN' ? ADMIN_NAV_ITEMS : user?.role === 'MANAGER' ? MANAGER_NAV_ITEMS : STAFF_NAV_ITEMS).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-zinc-800 space-y-3 bg-zinc-900/50">
          <div className="flex items-center gap-3 px-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
              user?.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-300' : user?.role === 'MANAGER' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {user?.role === 'ADMIN' ? '👑' : user?.role === 'MANAGER' ? '💼' : '👔'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Tài khoản'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                  user?.role === 'ADMIN' ? 'bg-amber-400/20 text-amber-300' : user?.role === 'MANAGER' ? 'bg-purple-400/20 text-purple-300' : 'bg-emerald-400/20 text-emerald-300'
                }`}>
                  {user?.role === 'ADMIN' ? 'Boss Hải' : user?.role === 'MANAGER' ? 'Quản Lý' : 'Nhân Viên'}
                </span>
                <span className="text-[10px] text-zinc-400 truncate">{user?.phone}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium transition"
              title="Về trang bán hàng"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Cửa hàng
            </Link>
            <button
              onClick={() => logout()}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-medium transition"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
              Thoát
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen pt-14 md:pt-0 pb-20 md:pb-0">
        <main className="p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation for Admin / Staff */}
      <AdminMobileBottomNav />

    </div>
  );
}
