'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Boxes, 
  Store 
} from 'lucide-react';

export default function AdminMobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Only render on admin routes
  if (!pathname.startsWith('/admin')) {
    return null;
  }

  // Only show if user is admin or staff
  if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    return null;
  }

  const isDashboard = pathname === '/admin';
  const isProducts = pathname.startsWith('/admin/products');
  const isOrders = pathname.startsWith('/admin/orders');
  const isUsers = pathname.startsWith('/admin/users');
  const isInventory = pathname.startsWith('/admin/inventory');

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800 shadow-2xl px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around text-center">
        
        {/* 1. Tổng quan */}
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center py-1 transition active:scale-95 ${
            isDashboard ? 'text-blue-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${isDashboard ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Tổng quan</span>
        </Link>

        {/* 2. Sản phẩm */}
        <Link
          href="/admin/products"
          className={`flex flex-col items-center justify-center py-1 transition active:scale-95 ${
            isProducts ? 'text-blue-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Package className={`w-5 h-5 ${isProducts ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Sản phẩm</span>
        </Link>

        {/* 3. Đơn hàng */}
        <Link
          href="/admin/orders"
          className={`flex flex-col items-center justify-center py-1 transition active:scale-95 ${
            isOrders ? 'text-blue-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShoppingCart className={`w-5 h-5 ${isOrders ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Đơn hàng</span>
        </Link>

        {/* 4. Khách hàng (cho Admin) hoặc Kho (cho Staff) */}
        {user.role === 'ADMIN' ? (
          <Link
            href="/admin/users"
            className={`flex flex-col items-center justify-center py-1 transition active:scale-95 ${
              isUsers ? 'text-blue-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className={`w-5 h-5 ${isUsers ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Khách sỉ/lẻ</span>
          </Link>
        ) : (
          <Link
            href="/admin/inventory"
            className={`flex flex-col items-center justify-center py-1 transition active:scale-95 ${
              isInventory ? 'text-blue-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Boxes className={`w-5 h-5 ${isInventory ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Kho hàng</span>
          </Link>
        )}

        {/* 5. Về Cửa hàng */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center py-1 text-emerald-400 hover:text-emerald-300 transition active:scale-95"
          title="Xem trang web cửa hàng"
        >
          <Store className="w-5 h-5 stroke-2 text-emerald-400" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Cửa hàng</span>
        </Link>

      </div>
    </nav>
  );
}
