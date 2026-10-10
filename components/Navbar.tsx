'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  ShieldCheck, 
  Package, 
  LogOut, 
  Menu, 
  X,
  PhoneCall,
  Boxes,
  Tag,
  ShoppingCart,
  Plus
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const { totalItems, setIsCartOpen, customerMode, setCustomerMode, hasFullPriceAccess } = useCart();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'NovaBeauty',
    slogan: 'ຮ້ານຂາຍເຄື່ອງສຳອາງ & ຄວາມງາມແທ້ 100%',
    hotline: '020 55 777 975',
    topAnnouncement: 'ຈັດສົ່ງຟຣີທົ່ວປະເທດສຳລັບບິນແຕ່ 300.000₭ | ສິນຄ້າແທ້ 100% ມີໃບບິນ',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setStoreInfo({
            storeName: data.settings.storeName,
            slogan: data.settings.slogan,
            hotline: data.settings.hotline,
            topAnnouncement: data.settings.topAnnouncement,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      {/* Top Banner */}
      <div className="bg-zinc-900 text-zinc-300 text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 truncate">
            <a 
              href={`tel:${storeInfo.hotline.replace(/\s/g, '')}`} 
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition whitespace-nowrap"
            >
              <PhoneCall className="w-3 h-3 text-rose-400 flex-shrink-0" />
              <span className="hidden sm:inline">{t('nav_hotline')}</span>
              <strong className="text-white font-mono">{storeInfo.hotline}</strong>
            </a>
            <span className="hidden md:inline text-zinc-400">| {storeInfo.topAnnouncement}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {user?.role === 'ADMIN' ? (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link 
                  href="/admin/settings" 
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium whitespace-nowrap"
                >
                  {t('nav_admin_settings')}
                </Link>
                <Link 
                  href="/admin" 
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium whitespace-nowrap"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t('nav_admin_portal')}
                </Link>
              </div>
            ) : user?.role === 'MANAGER' ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  href="/admin" 
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium whitespace-nowrap"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>💼 Quản Lý NovaStore</span>
                </Link>
              </div>
            ) : user?.role === 'STAFF' ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  href="/admin" 
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium whitespace-nowrap"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('nav_admin_portal') || 'Bàn làm việc Nhân viên'}</span>
                </Link>
              </div>
            ) : (
              <span className="hidden md:inline text-zinc-400">{t('nav_guarantee')}</span>
            )}
            <LanguageSwitcher variant="compact" />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/25 group-hover:scale-105 transition flex-shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-zinc-900 block truncate">
                {storeInfo.storeName}
              </span>
              <span className="hidden sm:block text-[10px] text-zinc-500 -mt-1 font-medium tracking-wider uppercase truncate">
                {storeInfo.slogan}
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav_search_placeholder')}
              className="w-full bg-zinc-100 hover:bg-zinc-100/80 focus:bg-white text-zinc-900 pl-11 pr-4 py-2.5 rounded-full border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => { setSearchQuery(''); router.push('/'); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            )}
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            
            {/* Chế độ Giá: Khách Lẻ vs Khách Sỉ (gọn gàng trên mobile) */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-full border border-zinc-200 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setCustomerMode('RETAIL')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition flex items-center gap-1 ${
                  customerMode === 'RETAIL'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
                title="Chế độ giá bán lẻ (ລາຄາຂາຍຍ່ອຍ)"
              >
                <Tag className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <span className="hidden sm:inline text-[11px] font-bold">Khách lẻ</span>
                <span className="sm:hidden text-[10px] font-bold">Lẻ</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (hasFullPriceAccess) {
                    setCustomerMode('WHOLESALE');
                  } else {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }
                }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition flex items-center gap-1 ${
                  customerMode === 'WHOLESALE'
                    ? 'bg-amber-400 text-amber-950 font-black shadow-xs ring-2 ring-amber-300'
                    : 'text-zinc-600 hover:text-amber-800 hover:bg-amber-50'
                }`}
                title={hasFullPriceAccess ? "Chế độ xem toàn bộ giá (Giá Sỉ & Giá Lẻ)" : "Đăng nhập Khách Sỉ để xem Bảng Giá Buôn"}
              >
                <Boxes className="w-3 h-3 text-amber-900 flex-shrink-0" />
                <span className="hidden sm:inline text-[11px] font-black">Khách sỉ ⚡</span>
                <span className="sm:hidden text-[10px] font-black">Sỉ ⚡</span>
              </button>
            </div>

            {/* Action Buttons: Nội bộ (Nhận Order & Thêm Món) vs Khách hàng (Giỏ hàng) */}
            {user && (user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'STAFF') ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/admin/orders"
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  title="Nhận Order & Điều phối"
                >
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">Nhận Order</span>
                </Link>
                <Link
                  href="/admin/products"
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  title="Thêm Món / Quản lý sản phẩm"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Thêm Món</span>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center gap-2 transition"
                title={t('nav_cart')}
              >
                <ShoppingBag className="w-5 h-5 text-zinc-700" />
                <span className="hidden sm:inline text-xs font-semibold">{t('nav_cart')}</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 sm:static bg-blue-600 text-white text-[11px] font-bold rounded-full w-5 h-5 sm:w-auto sm:px-2 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {/* User Account */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:pr-3 rounded-full hover:bg-zinc-100 border border-zinc-200 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left text-xs leading-tight">
                    <p className="font-semibold text-zinc-900 truncate max-w-[100px]">{user.name || user.phone}</p>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      {user.role === 'ADMIN' ? '👑 Boss Hải' : user.role === 'MANAGER' ? '💼 Quản Lý' : user.role === 'STAFF' ? '👔 Nhân Viên' : t('nav_customer_badge')}
                    </p>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="text-xs font-bold text-zinc-900">{user.name || t('nav_account')}</p>
                      <p className="text-xs text-zinc-500">{user.phone}</p>
                    </div>

                    {(user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'STAFF') ? (
                      <>
                        <Link
                          href="/admin/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>📋 Nhận & Hoàn Thành Order</span>
                        </Link>
                        <Link
                          href="/admin/products"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition"
                        >
                          <Plus className="w-4 h-4" />
                          <span>➕ Thêm Sản Phẩm Mới</span>
                        </Link>
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-purple-600 hover:bg-purple-50 transition"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>💼 Bàn Làm Việc Tổng</span>
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-700 hover:bg-zinc-50 transition"
                      >
                        <Package className="w-4 h-4 text-zinc-500" />
                        {t('nav_my_orders')}
                      </Link>
                    )}

                    <button
                      onClick={() => { setIsUserMenuOpen(false); logout(); }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav_logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                  className="px-3 sm:px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:text-blue-600 transition"
                >
                  {t('nav_login')}
                </button>
                <button
                  onClick={() => { setAuthModalMode('register'); setIsAuthModalOpen(true); }}
                  className="px-3 sm:px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-sm"
                >
                  {t('nav_register')}
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-700 hover:bg-zinc-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav_search_placeholder')}
              className="w-full bg-zinc-100 text-zinc-900 pl-10 pr-9 py-2 rounded-xl text-base sm:text-sm outline-none border border-transparent focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); router.push('/'); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 p-1"
              >
                ✕
              </button>
            )}
          </form>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-100 space-y-3 animate-in slide-in-from-top-2">
            {/* Language switcher inside mobile menu */}
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
              <span className="text-xs font-bold text-zinc-700">Ngôn ngữ / ພາສາ:</span>
              <LanguageSwitcher variant="full" />
            </div>

            {user ? (
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">{user.name || t('nav_account')}</p>
                    <p className="text-[11px] text-zinc-500">{user.phone} ({user.role === 'ADMIN' ? '👑 Boss Hải' : user.role === 'MANAGER' ? '💼 Quản Lý' : user.role === 'STAFF' ? '👔 Nhân Viên' : t('nav_customer_badge')})</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200/60 space-y-1 text-xs">
                  {(user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'STAFF') ? (
                    <>
                      <Link
                        href="/admin/orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 px-3 text-blue-600 font-bold hover:bg-blue-50 rounded-xl"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>📋 Nhận & Hoàn Thành Order</span>
                      </Link>
                      <Link
                        href="/admin/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 px-3 text-emerald-600 font-bold hover:bg-emerald-50 rounded-xl"
                      >
                        <Plus className="w-4 h-4" />
                        <span>➕ Thêm Món / Quản lý sản phẩm</span>
                      </Link>
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 px-3 text-purple-600 font-bold hover:bg-purple-50 rounded-xl"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>💼 Bàn Quản Trị Tổng</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 px-3 text-zinc-700 font-medium hover:bg-zinc-100 rounded-xl"
                    >
                      <Package className="w-4 h-4" />
                      {t('nav_my_orders')}
                    </Link>
                  )}
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                    className="w-full flex items-center gap-2 py-2 px-3 text-red-600 font-medium hover:bg-red-50 rounded-xl text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav_logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                  className="py-2.5 px-4 bg-zinc-100 text-zinc-800 font-bold rounded-xl text-xs text-center"
                >
                  {t('nav_login')}
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setAuthModalMode('register'); setIsAuthModalOpen(true); }}
                  className="py-2.5 px-4 bg-blue-600 text-white font-bold rounded-xl text-xs text-center shadow-sm"
                >
                  {t('nav_register')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
