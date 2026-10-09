'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Home, 
  Layers, 
  ShoppingBag, 
  Package, 
  User as UserIcon, 
  ShieldCheck,
  ShoppingCart,
  Plus,
  Boxes
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { t } = useLanguage();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isHome = pathname === '/';
  const isOrders = pathname === '/orders';
  const isCart = pathname === '/cart';

  // Dành riêng cho Quản Lý & Nhân Viên & Admin: KHÔNG CÓ MỤC MUA HÀNG
  if (user && (user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'STAFF')) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 shadow-2xl px-2 py-1.5 safe-area-pb">
        <div className="grid grid-cols-5 items-center justify-around text-center">
          {/* 1. Xem Web Cửa hàng */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 transition active:scale-95 ${
              isHome ? 'text-blue-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5">Cửa hàng</span>
          </Link>

          {/* 2. Nhận Order & Điều phối */}
          <Link
            href="/admin/orders"
            className="flex flex-col items-center justify-center py-1 text-cyan-400 hover:text-cyan-300 font-bold transition active:scale-95"
          >
            <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] mt-0.5">Nhận Order</span>
          </Link>

          {/* 3. Thêm Món Mới */}
          <Link
            href="/admin/products"
            className="flex flex-col items-center justify-center py-1 text-emerald-400 hover:text-emerald-300 font-bold transition active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] mt-0.5">Thêm Món</span>
          </Link>

          {/* 4. Kiểm tra kho */}
          <Link
            href="/admin/inventory"
            className="flex flex-col items-center justify-center py-1 text-amber-400 hover:text-amber-300 font-bold transition active:scale-95"
          >
            <Boxes className="w-5 h-5 stroke-2" />
            <span className="text-[10px] mt-0.5">Kho hàng</span>
          </Link>

          {/* 5. Bàn Quản Trị Tổng */}
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center py-1 font-bold transition active:scale-95 ${
              user.role === 'ADMIN'
                ? 'text-emerald-400'
                : user.role === 'MANAGER'
                ? 'text-purple-400'
                : 'text-blue-400'
            }`}
          >
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] mt-0.5">
              {user.role === 'ADMIN' ? 'Boss Hải' : user.role === 'MANAGER' ? 'Quản Lý' : 'Nhân Viên'}
            </span>
          </Link>
        </div>
      </nav>
    );
  }

  // Dành cho Khách Hàng (Người mua hàng)
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-xl px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around text-center">
        
        {/* 1. Trang chủ */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition active:scale-95 ${
            isHome ? 'text-blue-600 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">{t('mb_home')}</span>
        </Link>

        {/* 2. Danh mục sản phẩm */}
        <a
          href="/#product-catalog"
          className="flex flex-col items-center justify-center py-1 text-zinc-500 hover:text-zinc-800 transition active:scale-95"
        >
          <Layers className="w-5 h-5 stroke-2" />
          <span className="text-[10px] mt-0.5">{t('mb_categories')}</span>
        </a>

        {/* 3. Giỏ hàng */}
        <button
          onClick={() => setIsCartOpen(true)}
          className={`flex flex-col items-center justify-center py-1 relative transition active:scale-95 ${
            isCart ? 'text-blue-600 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${isCart ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-blue-600 text-white text-[9px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow-xs animate-in zoom-in">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">{t('mb_cart')}</span>
        </button>

        {/* 4. Đơn hàng */}
        <Link
          href="/orders"
          className={`flex flex-col items-center justify-center py-1 transition active:scale-95 ${
            isOrders ? 'text-blue-600 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Package className={`w-5 h-5 ${isOrders ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">{t('mb_orders')}</span>
        </Link>

        {/* 5. Tài khoản Khách */}
        {user ? (
          <Link
            href="/orders"
            className="flex flex-col items-center justify-center py-1 text-zinc-600 hover:text-blue-600 transition active:scale-95"
          >
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black flex items-center justify-center">
              {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
            </div>
            <span className="text-[10px] mt-0.5 truncate max-w-[50px]">{user.name?.split(' ').pop() || 'Tôi'}</span>
          </Link>
        ) : (
          <button
            onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
            className="flex flex-col items-center justify-center py-1 text-zinc-500 hover:text-blue-600 transition active:scale-95"
          >
            <UserIcon className="w-5 h-5 stroke-2" />
            <span className="text-[10px] mt-0.5">{t('mb_account')}</span>
          </button>
        )}

      </div>
    </nav>
  );
}
