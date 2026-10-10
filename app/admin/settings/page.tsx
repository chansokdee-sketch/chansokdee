'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';
import { 
  Sliders, 
  Store, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Image as ImageIcon, 
  Check, 
  ExternalLink, 
  AlertCircle,
  Save,
  Palette,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ShoppingBag,
  Layers,
  Eye,
  Zap,
  Tag,
  Gift,
  PhoneCall,
  Clock,
  ArrowRight
} from 'lucide-react';

const COLOR_OPTIONS = [
  { id: 'rose', name: 'Hồng Đỏ Mỹ Phẩm (Rose)', bg: 'bg-rose-600', ring: 'ring-rose-400' },
  { id: 'emerald', name: 'Xanh Thảo Dược (Emerald)', bg: 'bg-emerald-600', ring: 'ring-emerald-400' },
  { id: 'violet', name: 'Tím Quý Phái (Violet)', bg: 'bg-violet-600', ring: 'ring-violet-400' },
  { id: 'amber', name: 'Vàng Cam Tươi Trẻ (Amber)', bg: 'bg-amber-600', ring: 'ring-amber-400' },
  { id: 'blue', name: 'Xanh Thanh Lịch (Blue)', bg: 'bg-blue-600', ring: 'ring-blue-400' },
  { id: 'indigo', name: 'Chàm Sang Trọng (Indigo)', bg: 'bg-indigo-600', ring: 'ring-indigo-400' },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'banner' | 'flashsale' | 'promocards' | 'brand' | 'badges' | 'popup' | 'contact' | 'footer'>('banner');
  const [settings, setSettings] = useState<SiteSettings>({
    storeName: 'NovaBeauty',
    slogan: 'Mỹ phẩm & Chăm sóc sắc đẹp chính hãng',
    thbRate: 650,
    primaryColor: 'rose',
    hotline: '1900 8888',
    email: 'cskh@novabeauty.vn',
    address: 'Số 123 Đường Cầu Giấy, Hà Nội',
    topAnnouncement: 'Miễn phí giao hàng đơn từ 300k | Cam kết 100% mỹ phẩm chính hãng có hóa đơn',
    showTopAnnouncement: true,
    showHeroBanner: true,
    heroBadge: 'BST Mỹ Phẩm Cao Cấp 2026 - Giảm tới 40%',
    heroTitle: 'Tỏa Sáng Rạng Ngời Cùng Mỹ Phẩm Chính Hãng Cao Cấp',
    heroSubtitle: 'Hệ thống phân phối mỹ phẩm, chăm sóc da và nước hoa hàng đầu từ Pháp, Hàn Quốc, Nhật Bản & Mỹ. Cam kết 100% nguồn gốc rõ ràng, hoàn tiền 200% nếu phát hiện hàng giả.',
    heroButtonPrimaryText: 'Khám phá sản phẩm hot',
    heroButtonSecondaryText: 'Mở giỏ hàng của bạn',
    heroImageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    heroCardTitle: 'Serum Estée Lauder Advanced Night Repair',
    heroCardSubtitle: 'Bí quyết trẻ hóa và căng bóng da tự nhiên',
    heroCardBadge: 'BÁN CHẠY NHẤT',

    borderRadius: 'rounded-3xl',
    productGridColumns: 4,
    showFlashSale: true,
    flashSaleBadge: '⚡ GIỜ VÀNG SẮC ĐẸP',
    flashSaleTitle: 'Flash Sale Mỹ Phẩm - Giảm Sốc Tới 50%',
    flashSaleSubtitle: 'Cơ hội săn deal mỹ phẩm và nước hoa chính hãng với giá tốt nhất hôm nay',
    flashSaleEndTime: '23:59:59',
    flashSaleDiscountCode: 'BEAUTY50',

    showPromoCards: true,
    promoCard1Badge: 'ƯU ĐÃI ĐẶC BIỆT',
    promoCard1Title: 'Combo Skincare Trắng Sáng',
    promoCard1Subtitle: 'Tặng ngay set minisize cao cấp cho đơn hàng từ 800.000đ',
    promoCard1ButtonText: 'Xem chi tiết',
    promoCard1ImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',

    promoCard2Badge: 'XU HƯỚNG 2026',
    promoCard2Title: 'BST Son Môi Mịn Lì',
    promoCard2Subtitle: 'Màu sắc thời thượng từ Dior, MAC, Black Rouge giảm thêm 25%',
    promoCard2ButtonText: 'Khám phá ngay',
    promoCard2ImageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',

    showPromoPopup: false,
    promoPopupTitle: 'Quà Tặng Khách Hàng Mới',
    promoPopupSubtitle: 'Nhận ngay Voucher 100.000đ cho đơn hàng mỹ phẩm đầu tiên từ 500k!',
    promoPopupCode: 'BEAUTY100',
    promoPopupDiscountText: 'GIẢM 100.000đ',

    showFloatingContact: true,
    zaloNumber: '0988888888',
    facebookUrl: 'https://facebook.com',

    showNewsletter: true,
    newsletterTitle: 'Đăng Ký Nhận Bản Tin Làm Đẹp',
    newsletterSubtitle: 'Nhận sớm nhất thông báo giảm giá và voucher mỹ phẩm độc quyền từ NovaBeauty',

    badge1Title: 'Giao hàng miễn phí',
    badge1Desc: 'Cho đơn hàng mỹ phẩm từ 300.000đ',
    badge2Title: '100% Chính hãng',
    badge2Desc: 'Tem phụ nhập khẩu & hoàn tiền 200%',
    badge3Title: 'Đổi trả an tâm 14 ngày',
    badge3Desc: 'Bảo hành kích ứng da & lỗi bao bì',
    badge4Title: 'Tư vấn chuyên da 24/7',
    badge4Desc: 'Dược sĩ & chuyên viên hỗ trợ tận tình',
    catalogTitle: 'Mỹ Phẩm & Sản Phẩm Làm Đẹp Mới Nhất',
    catalogSubtitle: 'Mỹ phẩm chính hãng sẵn sàng giao ngay trong 2 giờ',
    footerAbout: 'Hệ thống phân phối mỹ phẩm chính hãng, chăm sóc da mặt, trang điểm và nước hoa cao cấp từ các thương hiệu uy tín toàn cầu.',
    footerCopyright: '© 2026 NovaBeauty Cosmetics. Bản quyền thuộc về NovaBeauty.',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.settings) {
          setSettings(prev => ({
            ...prev,
            ...data.settings,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Có lỗi xảy ra khi lưu cài đặt');
      } else {
        setSuccessMsg(data.message || 'Đã lưu cấu hình website thành công!');
        if (data.settings) setSettings(data.settings);
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối tới máy chủ khi lưu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-8 w-64 bg-zinc-800 rounded-xl"></div>
        <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white">Studio Tùy Biến Giao Diện Website</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Toàn quyền quản trị nội dung, phối màu, banner, popup và thông tin hiển thị trên toàn bộ trang web
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            Xem trang chủ
          </Link>
          <button
            onClick={() => handleSubmit()}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-2xl text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 text-red-400 rounded-2xl text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800 scrollbar-none text-xs">
        {[
          { id: 'banner', label: 'Banner Hero', icon: Sparkles },
          { id: 'flashsale', label: 'Flash Sale', icon: Zap },
          { id: 'promocards', label: 'Banner Phụ', icon: Layers },
          { id: 'brand', label: 'Thương Hiệu & Kiểu Dáng', icon: Palette },
          { id: 'badges', label: '4 Cam Kết', icon: ShieldCheck },
          { id: 'popup', label: 'Popup Ưu Đãi', icon: Gift },
          { id: 'contact', label: 'Facebook & WhatsApp Nổi', icon: PhoneCall },
          { id: 'footer', label: 'Chân Trang', icon: Store },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition flex-shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="space-y-6">

        {/* TAB 1: BANNER HERO */}
        {activeTab === 'banner' && (
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold">Chỉnh Sửa Banner Chính Trang Chủ (Hero Banner)</h2>
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showHeroBanner}
                  onChange={(e) => setSettings({ ...settings, showHeroBanner: e.target.checked })}
                  className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                />
                Hiển thị Banner này trên trang chủ
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Huy hiệu khuyến mãi (Badge)</label>
                  <input
                    type="text"
                    value={settings.heroBadge}
                    onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Tiêu đề lớn (Headline chính)</label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Mô tả phụ</label>
                  <textarea
                    rows={4}
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 outline-none focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">Chữ nút chính (CTA 1)</label>
                    <input
                      type="text"
                      value={settings.heroButtonPrimaryText}
                      onChange={(e) => setSettings({ ...settings, heroButtonPrimaryText: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">Chữ nút phụ (CTA 2)</label>
                    <input
                      type="text"
                      value={settings.heroButtonSecondaryText}
                      onChange={(e) => setSettings({ ...settings, heroButtonSecondaryText: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Image & Showcase Card */}
              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Đường dẫn hình ảnh Banner (Image URL)</label>
                  <input
                    type="text"
                    value={settings.heroImageUrl}
                    onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 font-mono text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                  <span className="font-bold text-zinc-200 block">Thẻ Card Ghim Lên Ảnh Banner</span>
                  <div>
                    <label className="block text-zinc-500 text-[11px] mb-1">Nhãn badge (ví dụ: MỚI RA MẮT)</label>
                    <input
                      type="text"
                      value={settings.heroCardBadge}
                      onChange={(e) => setSettings({ ...settings, heroCardBadge: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-[11px] mb-1">Tên sản phẩm trên card</label>
                    <input
                      type="text"
                      value={settings.heroCardTitle}
                      onChange={(e) => setSettings({ ...settings, heroCardTitle: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-[11px] mb-1">Mô tả ngắn gọn</label>
                    <input
                      type="text"
                      value={settings.heroCardSubtitle}
                      onChange={(e) => setSettings({ ...settings, heroCardSubtitle: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400 outline-none"
                    />
                  </div>
                </div>

                {settings.heroImageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-zinc-800 aspect-16/9 relative">
                    <img src={settings.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">{settings.heroCardBadge}</span>
                      <p className="text-xs font-bold text-white">{settings.heroCardTitle}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLASH SALE */}
        {activeTab === 'flashsale' && (
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold">Banner Flash Sale Giờ Vàng Đếm Ngược</h2>
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showFlashSale ?? true}
                  onChange={(e) => setSettings({ ...settings, showFlashSale: e.target.checked })}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
                Bật Flash Sale trên trang chủ
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Huy hiệu sự kiện</label>
                  <input
                    type="text"
                    value={settings.flashSaleBadge || '⚡ GIỜ VÀNG GIÁ SỐC'}
                    onChange={(e) => setSettings({ ...settings, flashSaleBadge: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Tiêu đề Flash Sale</label>
                  <input
                    type="text"
                    value={settings.flashSaleTitle || 'Flash Sale Công Nghệ - Giảm Tới 50%'}
                    onChange={(e) => setSettings({ ...settings, flashSaleTitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Phụ đề mô tả ưu đãi</label>
                  <input
                    type="text"
                    value={settings.flashSaleSubtitle || 'Áp dụng cho các sản phẩm công nghệ hot nhất'}
                    onChange={(e) => setSettings({ ...settings, flashSaleSubtitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Mã Giảm Giá Tặng Kèm (Coupon Code)</label>
                  <input
                    type="text"
                    value={settings.flashSaleDiscountCode || 'FLASH50'}
                    onChange={(e) => setSettings({ ...settings, flashSaleDiscountCode: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-amber-400 font-mono font-bold uppercase outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Giờ kết thúc đếm ngược (End Time)</label>
                  <input
                    type="text"
                    value={settings.flashSaleEndTime || '23:59:59'}
                    onChange={(e) => setSettings({ ...settings, flashSaleEndTime: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>

                {/* Preview Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white space-y-2 shadow-lg">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-full">
                    {settings.flashSaleBadge || '⚡ GIỜ VÀNG GIÁ SỐC'}
                  </span>
                  <p className="font-black text-sm">{settings.flashSaleTitle || 'Flash Sale Công Nghệ'}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-full bg-white text-orange-700 font-bold text-[10px]">
                      Mã: {settings.flashSaleDiscountCode || 'FLASH50'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROMO CARDS */}
        {activeTab === 'promocards' && (
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 text-white">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold">2 Thẻ Quảng Cáo Khuyến Mãi Phụ (Promo Cards)</h2>
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showPromoCards ?? true}
                  onChange={(e) => setSettings({ ...settings, showPromoCards: e.target.checked })}
                  className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                />
                Hiển thị trên trang chủ
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Promo Card 1 */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <span className="font-bold text-blue-400 block text-sm">Thẻ Quảng Cáo 1 (Trái)</span>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1">Huy hiệu</label>
                  <input
                    type="text"
                    value={settings.promoCard1Badge || 'ƯU ĐÃI ĐẶC BIỆT'}
                    onChange={(e) => setSettings({ ...settings, promoCard1Badge: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1">Tiêu đề thẻ</label>
                  <input
                    type="text"
                    value={settings.promoCard1Title || 'Thu Cũ Đổi Mới Lên Đời'}
                    onChange={(e) => setSettings({ ...settings, promoCard1Title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1">Mô tả tóm tắt</label>
                  <input
                    type="text"
                    value={settings.promoCard1Subtitle || 'Trợ giá lên đến 3.000.000đ khi nâng cấp máy mới'}
                    onChange={(e) => setSettings({ ...settings, promoCard1Subtitle: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1">Chữ nút bấm</label>
                  <input
                    type="text"
                    value={settings.promoCard1ButtonText || 'Định giá ngay'}
                    onChange={(e) => setSettings({ ...settings, promoCard1ButtonText: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1">Link ảnh nền thẻ</label>
                  <input
                    type="text"
                    value={settings.promoCard1ImageUrl || ''}
                    onChange={(e) => setSettings({ ...settings, promoCard1ImageUrl: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400 font-mono text-[11px] outline-none"
                  />
                </div>
              </div>

              {/* Promo Card 2 */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <span className="font-bold text-purple-400 block text-sm">Thẻ Quảng Cáo 2 (Phải)</span>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1">Huy hiệu</label>
                  <input
                    type="text"
                    value={settings.promoCard2Badge || 'COMBO TIẾT KIỆM'}
                    onChange={(e) => setSettings({ ...settings, promoCard2Badge: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1">Tiêu đề thẻ</label>
                  <input
                    type="text"
                    value={settings.promoCard2Title || 'Phụ Kiện Chính Hãng'}
                    onChange={(e) => setSettings({ ...settings, promoCard2Title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1">Mô tả tóm tắt</label>
                  <input
                    type="text"
                    value={settings.promoCard2Subtitle || 'Sạc nhanh, tai nghe & bao da giảm thêm 25%'}
                    onChange={(e) => setSettings({ ...settings, promoCard2Subtitle: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1">Chữ nút bấm</label>
                  <input
                    type="text"
                    value={settings.promoCard2ButtonText || 'Khám phá ngay'}
                    onChange={(e) => setSettings({ ...settings, promoCard2ButtonText: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[11px] mb-1">Link ảnh nền thẻ</label>
                  <input
                    type="text"
                    value={settings.promoCard2ImageUrl || ''}
                    onChange={(e) => setSettings({ ...settings, promoCard2ImageUrl: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400 font-mono text-[11px] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BRAND, COLOR, RADIUS, GRID */}
        {activeTab === 'brand' && (
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in text-xs">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-400" />
                Màu Sắc, Bo Góc & Bố Cục Toàn Website
              </h2>
            </div>

            {/* Color Palette */}
            <div>
              <label className="block text-zinc-300 font-bold mb-3">Tông Màu Nhận Diện Chính</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, primaryColor: c.id })}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition text-left ${
                      settings.primaryColor === c.id
                        ? 'border-blue-500 bg-blue-500/10 text-white font-bold ring-2 ring-blue-500/40'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full ${c.bg} shadow-md`} />
                    <span className="font-medium truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-zinc-300 font-bold mb-3">Kiểu Bo Góc Thẻ Giao Diện</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'rounded-none', label: 'Vuông vức (0px)' },
                  { id: 'rounded-lg', label: 'Bo nhẹ (8px)' },
                  { id: 'rounded-2xl', label: 'Bo tròn hiện đại (16px)' },
                  { id: 'rounded-3xl', label: 'Siêu cong (24px)' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, borderRadius: b.id })}
                    className={`p-3 rounded-2xl border text-center transition ${
                      (settings.borderRadius || 'rounded-2xl') === b.id
                        ? 'border-blue-500 bg-blue-500/10 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Columns */}
            <div>
              <label className="block text-zinc-300 font-bold mb-3">Số Cột Lưới Sản Phẩm</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 3, label: '3 Cột (Hình ảnh lớn hơn, phù hợp shop ít hàng)' },
                  { val: 4, label: '4 Cột (Gọn gàng tiêu chuẩn, hiển thị nhiều sản phẩm)' },
                ].map((col) => (
                  <button
                    key={col.val}
                    type="button"
                    onClick={() => setSettings({ ...settings, productGridColumns: col.val })}
                    className={`p-3 rounded-2xl border text-center transition ${
                      (settings.productGridColumns || 4) === col.val
                        ? 'border-blue-500 bg-blue-500/10 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1.5">Tên Cửa Hàng / Thương Hiệu</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-semibold mb-1.5">Khẩu Hiệu (Slogan)</label>
                <input
                  type="text"
                  value={settings.slogan}
                  onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Top Announcement */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Thanh Thông Báo Trên Cùng (Top Announcement)</span>
                <input
                  type="checkbox"
                  checked={settings.showTopAnnouncement}
                  onChange={(e) => setSettings({ ...settings, showTopAnnouncement: e.target.checked })}
                  className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={settings.topAnnouncement}
                onChange={(e) => setSettings({ ...settings, topAnnouncement: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-200 outline-none"
              />
            </div>

            {/* Currency & Exchange Rate Settings */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-zinc-950 to-zinc-900 border border-amber-800/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 font-black text-base flex items-center justify-center border border-amber-500/30 shrink-0">
                    ฿
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Cài Đặt Tỷ Giá Tiền Tệ (Kíp Lào ⇄ Baht Thái)</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Website hỗ trợ 2 nhánh thanh toán độc lập: ₭ LAK và ฿ THB</p>
                  </div>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-black text-xs">
                  1 ฿ = {Number(settings.thbRate || 650).toLocaleString('de-DE')} ₭
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">
                    Tỷ giá Baht Thái (1 THB = bao nhiêu Kíp LAK?)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={settings.thbRate ?? 650}
                      onChange={(e) => setSettings({ ...settings, thbRate: Number(e.target.value) || 650 })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-amber-400 font-black text-sm outline-none focus:border-amber-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                      LAK / THB
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1.5">
                    Mặc định: <code className="text-amber-300 font-mono">650</code> (tức 1 THB = 650 Kíp). Tùy chỉnh bất kỳ lúc nào theo tỷ giá chợ hoặc ngân hàng.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-2">
                  <span className="font-bold text-zinc-300 block text-[11px]">💡 Xem trước quy đổi theo tỷ giá hiện tại:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 block">Ví dụ đơn hàng:</span>
                      <span className="font-black text-emerald-400 text-xs">100.000 ₭</span>
                    </div>
                    <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 block">Khách trả bằng Baht:</span>
                      <span className="font-black text-amber-300 text-xs">
                        {Math.round(100000 / (settings.thbRate || 650)).toLocaleString('de-DE')} ฿
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    * Giá gốc sản phẩm luôn lưu chuẩn theo Tiền Kíp (LAK). Tỷ giá này áp dụng khi khách xem giá THB và khi khách chọn thanh toán bằng Tiền Baht.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BADGES */}
        {activeTab === 'badges' && (
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in text-xs">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                4 Khối Cam Kết & Uy Tín (Trust Badges)
              </h2>
              <p className="text-zinc-400 text-xs mt-1">Các cam kết hiển thị ngay trên phần Chân trang</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="font-bold text-blue-400">Cam Kết 1: Giao Hàng</span>
                <input
                  type="text"
                  value={settings.badge1Title}
                  onChange={(e) => setSettings({ ...settings, badge1Title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none"
                />
                <input
                  type="text"
                  value={settings.badge1Desc}
                  onChange={(e) => setSettings({ ...settings, badge1Desc: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400 outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="font-bold text-emerald-400">Cam Kết 2: Chính Hãng</span>
                <input
                  type="text"
                  value={settings.badge2Title}
                  onChange={(e) => setSettings({ ...settings, badge2Title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none"
                />
                <input
                  type="text"
                  value={settings.badge2Desc}
                  onChange={(e) => setSettings({ ...settings, badge2Desc: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400 outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="font-bold text-amber-400">Cam Kết 3: Đổi Trả</span>
                <input
                  type="text"
                  value={settings.badge3Title}
                  onChange={(e) => setSettings({ ...settings, badge3Title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none"
                />
                <input
                  type="text"
                  value={settings.badge3Desc}
                  onChange={(e) => setSettings({ ...settings, badge3Desc: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400 outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="font-bold text-purple-400">Cam Kết 4: Hỗ Trợ 24/7</span>
                <input
                  type="text"
                  value={settings.badge4Title}
                  onChange={(e) => setSettings({ ...settings, badge4Title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none"
                />
                <input
                  type="text"
                  value={settings.badge4Desc}
                  onChange={(e) => setSettings({ ...settings, badge4Desc: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: WELCOME PROMO POPUP */}
        {activeTab === 'popup' && (
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 text-white">
                <Gift className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold">Hộp Thoại Quà Tặng Khách Hàng Mới (Popup Ưu Đãi)</h2>
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showPromoPopup ?? false}
                  onChange={(e) => setSettings({ ...settings, showPromoPopup: e.target.checked })}
                  className="rounded accent-rose-500 w-4 h-4 cursor-pointer"
                />
                Bật Popup khi khách vào web
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Tiêu đề Popup</label>
                  <input
                    type="text"
                    value={settings.promoPopupTitle || 'Quà Tặng Khách Hàng Mới'}
                    onChange={(e) => setSettings({ ...settings, promoPopupTitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Nội dung chi tiết</label>
                  <textarea
                    rows={3}
                    value={settings.promoPopupSubtitle || 'Nhận ngay Voucher 100.000đ cho đơn hàng đầu tiên từ 500k!'}
                    onChange={(e) => setSettings({ ...settings, promoPopupSubtitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 outline-none focus:border-rose-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">Mã Coupon</label>
                    <input
                      type="text"
                      value={settings.promoPopupCode || 'WELCOME100'}
                      onChange={(e) => setSettings({ ...settings, promoPopupCode: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-rose-400 font-mono font-bold uppercase outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">Mức giảm</label>
                    <input
                      type="text"
                      value={settings.promoPopupDiscountText || 'GIẢM 100.000đ'}
                      onChange={(e) => setSettings({ ...settings, promoPopupDiscountText: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Popup Live Preview */}
              <div className="flex items-center justify-center p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div className="w-full max-w-xs bg-zinc-900 border border-zinc-700/80 rounded-3xl p-5 text-center space-y-3 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <Gift className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm">{settings.promoPopupTitle || 'Quà Tặng Khách Hàng Mới'}</h4>
                  <p className="text-[11px] text-zinc-400">{settings.promoPopupSubtitle || 'Nhận ngay voucher...'}</p>
                  <div className="p-2.5 rounded-xl bg-zinc-950 font-mono font-bold text-amber-400 text-xs border border-dashed border-zinc-700">
                    {settings.promoPopupCode || 'WELCOME100'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: FACEBOOK & WHATSAPP */}
        {activeTab === 'contact' && (
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 text-white">
                <PhoneCall className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold">Nút Chat Facebook & WhatsApp Nổi (Floating Widgets)</h2>
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showFloatingContact ?? true}
                  onChange={(e) => setSettings({ ...settings, showFloatingContact: e.target.checked })}
                  className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                />
                Bật nút nổi ở góc màn hình
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Link Trang Facebook / Messenger</label>
                  <input
                    type="text"
                    value={settings.facebookUrl || 'https://facebook.com'}
                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/tenpage hoặc https://m.me/tenpage"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">Khách bấm vào sẽ mở trang Facebook hoặc mở ứng dụng Messenger để nhắn tin.</p>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Số Điện Thoại WhatsApp</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber || '+84988888888'}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    placeholder="+84988888888 hoặc 0988888888"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-emerald-400 font-mono outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">Khách bấm vào sẽ mở ứng dụng WhatsApp trò chuyện trực tiếp (wa.me/số_điện_thoại).</p>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Hotline Bấm Gọi Ngay</label>
                  <input
                    type="text"
                    value={settings.hotline}
                    onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
                <p className="text-zinc-400 text-xs">Mô phỏng 3 nút nổi ở góc phải màn hình:</p>
                <div className="flex flex-col gap-3">
                  {/* Facebook Button Preview */}
                  <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  {/* WhatsApp Button Preview */}
                  <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  {/* Hotline Button Preview */}
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                    <Phone className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: FOOTER & BRAND INFO */}
        {activeTab === 'footer' && (
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in text-xs">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-400" />
                Thông Tin Liên Hệ & Chân Trang (Footer)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Email CSKH</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Địa chỉ văn phòng</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Dòng chữ bản quyền (Copyright)</label>
                  <input
                    type="text"
                    value={settings.footerCopyright}
                    onChange={(e) => setSettings({ ...settings, footerCopyright: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1.5">Đoạn giới thiệu về cửa hàng</label>
                <textarea
                  rows={8}
                  value={settings.footerAbout}
                  onChange={(e) => setSettings({ ...settings, footerAbout: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 outline-none focus:border-blue-500 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
