'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';
import { 
  Sparkles, 
  Palette, 
  Image as ImageIcon, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Gift, 
  PhoneCall, 
  Mail, 
  X, 
  Check, 
  ExternalLink, 
  Sliders, 
  Eye, 
  EyeOff,
  Save,
  RotateCcw
} from 'lucide-react';

interface LiveVisualCustomizerProps {
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
}

const COLOR_THEMES = [
  { id: 'rose', name: 'Hồng Đỏ Mỹ Phẩm', class: 'bg-rose-600', ring: 'ring-rose-400' },
  { id: 'emerald', name: 'Xanh Thảo Dược', class: 'bg-emerald-600', ring: 'ring-emerald-400' },
  { id: 'violet', name: 'Tím Quý Phái', class: 'bg-violet-600', ring: 'ring-violet-400' },
  { id: 'amber', name: 'Vàng Cam Tươi Trẻ', class: 'bg-amber-600', ring: 'ring-amber-400' },
  { id: 'blue', name: 'Xanh Thanh Lịch', class: 'bg-blue-600', ring: 'ring-blue-400' },
  { id: 'indigo', name: 'Chàm Sang Trọng', class: 'bg-indigo-600', ring: 'ring-indigo-400' },
];

export default function LiveVisualCustomizer({
  settings,
  onUpdateSettings,
  isOpen,
  onClose,
  activeSection = 'theme'
}: LiveVisualCustomizerProps) {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [currentTab, setCurrentTab] = useState<string>(activeSection);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync when prop settings change
  React.useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  React.useEffect(() => {
    if (activeSection) {
      setCurrentTab(activeSection);
    }
  }, [activeSection]);

  if (!isOpen) return null;

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateSettings(data.settings || formData);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800 shadow-2xl z-50 flex flex-col text-zinc-100 transition duration-300">
      
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Chỉnh Sửa Giao Diện Trực Quan
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                LIVE
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Thay đổi tức thì giao diện trang web theo ý bạn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/admin/settings"
            title="Mở Studio Toàn Màn Hình"
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition text-xs"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 p-2 bg-zinc-900/80 border-b border-zinc-800 overflow-x-auto scrollbar-none text-xs">
        {[
          { id: 'theme', label: 'Màu & Phong cách', icon: Palette },
          { id: 'hero', label: 'Banner Hero', icon: ImageIcon },
          { id: 'flashsale', label: 'Flash Sale', icon: Zap },
          { id: 'promocards', label: 'Banner Phụ', icon: Layers },
          { id: 'badges', label: 'Cam kết', icon: ShieldCheck },
          { id: 'popup', label: 'Popup Ưu Đãi', icon: Gift },
          { id: 'contact', label: 'Facebook & WhatsApp', icon: PhoneCall },
          { id: 'footer', label: 'Chân trang', icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium whitespace-nowrap transition flex-shrink-0 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Form */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs">

        {/* TAB 1: THEME & COLOR */}
        {currentTab === 'theme' && (
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-400 font-semibold mb-2">Tông Màu Chủ Đạo Website</label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleChange('primaryColor', theme.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition text-left ${
                      formData.primaryColor === theme.id
                        ? 'border-blue-500 bg-blue-500/10 text-white font-bold ring-2 ring-blue-500/30'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full ${theme.class}`} />
                    <span className="truncate text-[11px]">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-2">Kiểu Bo Góc Thẻ Giao Diện</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'rounded-none', label: 'Vuông vức (0px)' },
                  { id: 'rounded-lg', label: 'Bo nhẹ (8px)' },
                  { id: 'rounded-2xl', label: 'Bo tròn hiện đại (16px)' },
                  { id: 'rounded-3xl', label: 'Siêu cong (24px)' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleChange('borderRadius', b.id)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      (formData.borderRadius || 'rounded-2xl') === b.id
                        ? 'border-blue-500 bg-blue-500/10 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-2">Số Cột Lưới Sản Phẩm Trang Chủ</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: 3, label: '3 Cột (Ảnh lớn, nổi bật)' },
                  { val: 4, label: '4 Cột (Gọn gàng, tiêu chuẩn)' },
                ].map((col) => (
                  <button
                    key={col.val}
                    type="button"
                    onClick={() => handleChange('productGridColumns', col.val)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      (formData.productGridColumns || 4) === col.val
                        ? 'border-blue-500 bg-blue-500/10 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Tên Cửa Hàng / Thương Hiệu</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Khẩu Hiệu (Slogan)</label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => handleChange('slogan', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-zinc-300">Thanh Thông Báo Trên Cùng (Top Bar)</span>
                <input
                  type="checkbox"
                  checked={formData.showTopAnnouncement}
                  onChange={(e) => handleChange('showTopAnnouncement', e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
              {formData.showTopAnnouncement && (
                <input
                  type="text"
                  value={formData.topAnnouncement}
                  onChange={(e) => handleChange('topAnnouncement', e.target.value)}
                  placeholder="Nhập thông báo chạy trên cùng..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500"
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HERO BANNER */}
        {currentTab === 'hero' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div>
                <p className="font-semibold text-white">Hiển thị Banner Hero lớn</p>
                <p className="text-[11px] text-zinc-400">Bật/tắt khối banner trên cùng trang chủ</p>
              </div>
              <input
                type="checkbox"
                checked={formData.showHeroBanner}
                onChange={(e) => handleChange('showHeroBanner', e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {formData.showHeroBanner && (
              <>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Huy Hiệu Nổi Bật (Badge)</label>
                  <input
                    type="text"
                    value={formData.heroBadge}
                    onChange={(e) => handleChange('heroBadge', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Tiêu Đề Lớn Banner</label>
                  <input
                    type="text"
                    value={formData.heroTitle}
                    onChange={(e) => handleChange('heroTitle', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Mô Tả Phụ (Subtitle)</label>
                  <textarea
                    rows={3}
                    value={formData.heroSubtitle}
                    onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500 text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">Chữ Nút Chính</label>
                    <input
                      type="text"
                      value={formData.heroButtonPrimaryText}
                      onChange={(e) => handleChange('heroButtonPrimaryText', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">Chữ Nút Phụ</label>
                    <input
                      type="text"
                      value={formData.heroButtonSecondaryText}
                      onChange={(e) => handleChange('heroButtonSecondaryText', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Link Hình Ảnh Banner</label>
                  <input
                    type="text"
                    value={formData.heroImageUrl}
                    onChange={(e) => handleChange('heroImageUrl', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                  {formData.heroImageUrl && (
                    <div className="mt-2 aspect-16/9 rounded-xl overflow-hidden border border-zinc-800 max-h-32">
                      <img src={formData.heroImageUrl} alt="Hero preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <span className="font-semibold text-zinc-300 block">Thẻ Card Ghim Lên Ảnh Banner</span>
                  <input
                    type="text"
                    value={formData.heroCardTitle}
                    onChange={(e) => handleChange('heroCardTitle', e.target.value)}
                    placeholder="Tên sản phẩm trên card"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={formData.heroCardSubtitle}
                    onChange={(e) => handleChange('heroCardSubtitle', e.target.value)}
                    placeholder="Phụ đề tóm tắt"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-300 text-xs outline-none"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: FLASH SALE */}
        {currentTab === 'flashsale' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div>
                <p className="font-semibold text-white">Bật Banner Flash Sale Giờ Vàng</p>
                <p className="text-[11px] text-zinc-400">Hiển thị thanh sự kiện giảm giá đặc biệt</p>
              </div>
              <input
                type="checkbox"
                checked={formData.showFlashSale ?? true}
                onChange={(e) => handleChange('showFlashSale', e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {(formData.showFlashSale ?? true) && (
              <>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Huy hiệu Flash Sale</label>
                  <input
                    type="text"
                    value={formData.flashSaleBadge || '⚡ GIỜ VÀNG GIÁ SỐC'}
                    onChange={(e) => handleChange('flashSaleBadge', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Tiêu đề Flash Sale</label>
                  <input
                    type="text"
                    value={formData.flashSaleTitle || 'Flash Sale Công Nghệ - Giảm Tới 50%'}
                    onChange={(e) => handleChange('flashSaleTitle', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Phụ đề sự kiện</label>
                  <input
                    type="text"
                    value={formData.flashSaleSubtitle || 'Áp dụng cho các sản phẩm công nghệ hot nhất'}
                    onChange={(e) => handleChange('flashSaleSubtitle', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">Mã Giảm Giá Tặng Kèm</label>
                    <input
                      type="text"
                      value={formData.flashSaleDiscountCode || 'FLASH50'}
                      onChange={(e) => handleChange('flashSaleDiscountCode', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-amber-400 font-mono font-bold outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">Giờ kết thúc đếm ngược</label>
                    <input
                      type="text"
                      value={formData.flashSaleEndTime || '23:59:59'}
                      onChange={(e) => handleChange('flashSaleEndTime', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4: PROMO CARDS */}
        {currentTab === 'promocards' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div>
                <p className="font-semibold text-white">Hiển thị 2 Thẻ Quảng Cáo Phụ</p>
                <p className="text-[11px] text-zinc-400">Khối thẻ khuyến mãi nổi bật ở giữa trang</p>
              </div>
              <input
                type="checkbox"
                checked={formData.showPromoCards ?? true}
                onChange={(e) => handleChange('showPromoCards', e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {(formData.showPromoCards ?? true) && (
              <>
                {/* Thẻ 1 */}
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                  <span className="font-bold text-blue-400 text-xs block">Thẻ Quảng Cáo 1</span>
                  <input
                    type="text"
                    value={formData.promoCard1Title || 'Thu Cũ Đổi Mới Lên Đời'}
                    onChange={(e) => handleChange('promoCard1Title', e.target.value)}
                    placeholder="Tiêu đề thẻ 1"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none"
                  />
                  <input
                    type="text"
                    value={formData.promoCard1Subtitle || 'Trợ giá lên đến 3.000.000đ khi nâng cấp máy mới'}
                    onChange={(e) => handleChange('promoCard1Subtitle', e.target.value)}
                    placeholder="Mô tả thẻ 1"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 outline-none"
                  />
                  <input
                    type="text"
                    value={formData.promoCard1ButtonText || 'Định giá ngay'}
                    onChange={(e) => handleChange('promoCard1ButtonText', e.target.value)}
                    placeholder="Chữ nút thẻ 1"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none"
                  />
                  <input
                    type="text"
                    value={formData.promoCard1ImageUrl || ''}
                    onChange={(e) => handleChange('promoCard1ImageUrl', e.target.value)}
                    placeholder="Link hình ảnh thẻ 1 (URL)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-400 text-[11px] font-mono outline-none"
                  />
                </div>

                {/* Thẻ 2 */}
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                  <span className="font-bold text-purple-400 text-xs block">Thẻ Quảng Cáo 2</span>
                  <input
                    type="text"
                    value={formData.promoCard2Title || 'Phụ Kiện Chính Hãng'}
                    onChange={(e) => handleChange('promoCard2Title', e.target.value)}
                    placeholder="Tiêu đề thẻ 2"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none"
                  />
                  <input
                    type="text"
                    value={formData.promoCard2Subtitle || 'Sạc nhanh, tai nghe & bao da giảm thêm 25%'}
                    onChange={(e) => handleChange('promoCard2Subtitle', e.target.value)}
                    placeholder="Mô tả thẻ 2"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 outline-none"
                  />
                  <input
                    type="text"
                    value={formData.promoCard2ButtonText || 'Khám phá ngay'}
                    onChange={(e) => handleChange('promoCard2ButtonText', e.target.value)}
                    placeholder="Chữ nút thẻ 2"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none"
                  />
                  <input
                    type="text"
                    value={formData.promoCard2ImageUrl || ''}
                    onChange={(e) => handleChange('promoCard2ImageUrl', e.target.value)}
                    placeholder="Link hình ảnh thẻ 2 (URL)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-400 text-[11px] font-mono outline-none"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 5: TRUST BADGES */}
        {currentTab === 'badges' && (
          <div className="space-y-3.5">
            <p className="text-zinc-400">Tùy biến 4 khối cam kết chất lượng ở cuối trang:</p>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <span className="font-semibold text-blue-400">Cam Kết 1 (Giao hàng)</span>
              <input
                type="text"
                value={formData.badge1Title}
                onChange={(e) => handleChange('badge1Title', e.target.value)}
                placeholder="Tiêu đề cam kết 1"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white outline-none"
              />
              <input
                type="text"
                value={formData.badge1Desc}
                onChange={(e) => handleChange('badge1Desc', e.target.value)}
                placeholder="Mô tả cam kết 1"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-400 outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <span className="font-semibold text-emerald-400">Cam Kết 2 (Chính hãng)</span>
              <input
                type="text"
                value={formData.badge2Title}
                onChange={(e) => handleChange('badge2Title', e.target.value)}
                placeholder="Tiêu đề cam kết 2"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white outline-none"
              />
              <input
                type="text"
                value={formData.badge2Desc}
                onChange={(e) => handleChange('badge2Desc', e.target.value)}
                placeholder="Mô tả cam kết 2"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-400 outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <span className="font-semibold text-amber-400">Cam Kết 3 (Đổi trả)</span>
              <input
                type="text"
                value={formData.badge3Title}
                onChange={(e) => handleChange('badge3Title', e.target.value)}
                placeholder="Tiêu đề cam kết 3"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white outline-none"
              />
              <input
                type="text"
                value={formData.badge3Desc}
                onChange={(e) => handleChange('badge3Desc', e.target.value)}
                placeholder="Mô tả cam kết 3"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-400 outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <span className="font-semibold text-purple-400">Cam Kết 4 (Hỗ trợ CSKH)</span>
              <input
                type="text"
                value={formData.badge4Title}
                onChange={(e) => handleChange('badge4Title', e.target.value)}
                placeholder="Tiêu đề cam kết 4"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white outline-none"
              />
              <input
                type="text"
                value={formData.badge4Desc}
                onChange={(e) => handleChange('badge4Desc', e.target.value)}
                placeholder="Mô tả cam kết 4"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-400 outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 6: PROMO POPUP */}
        {currentTab === 'popup' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div>
                <p className="font-semibold text-white">Bật Hộp Thoại Ưu Đãi (Popup)</p>
                <p className="text-[11px] text-zinc-400">Tự động hiện khi khách hàng mới vào trang</p>
              </div>
              <input
                type="checkbox"
                checked={formData.showPromoPopup ?? false}
                onChange={(e) => handleChange('showPromoPopup', e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </div>

            {(formData.showPromoPopup ?? false) && (
              <>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Tiêu Đề Popup</label>
                  <input
                    type="text"
                    value={formData.promoPopupTitle || 'Quà Tặng Khách Hàng Mới'}
                    onChange={(e) => handleChange('promoPopupTitle', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Nội Dung Chi Tiết</label>
                  <textarea
                    rows={2}
                    value={formData.promoPopupSubtitle || 'Nhận ngay Voucher 100.000đ cho đơn hàng đầu tiên từ 500k!'}
                    onChange={(e) => handleChange('promoPopupSubtitle', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-rose-500 text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">Mã Voucher Tặng</label>
                    <input
                      type="text"
                      value={formData.promoPopupCode || 'WELCOME100'}
                      onChange={(e) => handleChange('promoPopupCode', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-rose-400 font-mono font-bold outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1.5">Mức Giảm Giá</label>
                    <input
                      type="text"
                      value={formData.promoPopupDiscountText || 'GIẢM 100.000đ'}
                      onChange={(e) => handleChange('promoPopupDiscountText', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 7: FACEBOOK & WHATSAPP */}
        {currentTab === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div>
                <p className="font-semibold text-white">Hiển thị Nút Chat Facebook & WhatsApp</p>
                <p className="text-[11px] text-zinc-400">Các nút tròn cố định ở góc dưới màn hình</p>
              </div>
              <input
                type="checkbox"
                checked={formData.showFloatingContact ?? true}
                onChange={(e) => handleChange('showFloatingContact', e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {(formData.showFloatingContact ?? true) && (
              <>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Link Facebook / Messenger</label>
                  <input
                    type="text"
                    value={formData.facebookUrl || 'https://facebook.com'}
                    onChange={(e) => handleChange('facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/tenpage hoặc https://m.me/tenpage"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500 text-xs"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Khách bấm vào sẽ mở trực tiếp trang Facebook hoặc nhắn tin Messenger.</p>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Số Điện Thoại WhatsApp</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber || '+84988888888'}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    placeholder="+84988888888 hoặc 0988888888"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-emerald-400 outline-none focus:border-emerald-500 font-mono text-xs"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Khách bấm vào sẽ mở ứng dụng WhatsApp trò chuyện ngay: wa.me/số_điện_thoại</p>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1.5">Hotline Bấm Gọi Nhanh</label>
                  <input
                    type="text"
                    value={formData.hotline}
                    onChange={(e) => handleChange('hotline', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 8: FOOTER */}
        {currentTab === 'footer' && (
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Email Hỗ Trợ CSKH</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Địa Chỉ Showroom / Văn Phòng</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Đoạn Giới Thiệu Chân Trang (About)</label>
              <textarea
                rows={3}
                value={formData.footerAbout}
                onChange={(e) => handleChange('footerAbout', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500 text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">Dòng Chữ Bản Quyền (Copyright)</label>
              <input
                type="text"
                value={formData.footerCopyright}
                onChange={(e) => handleChange('footerCopyright', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

      </div>

      {/* Drawer Action Bottom Bar */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-3">
        {savedSuccess ? (
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs animate-in fade-in">
            <Check className="w-4 h-4" />
            Đã lưu & áp dụng ngay!
          </div>
        ) : (
          <button
            onClick={() => setFormData({ ...settings })}
            className="flex items-center gap-1 text-zinc-400 hover:text-white text-xs font-medium px-2 py-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Hủy thay đổi
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <span>Đang lưu...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Lưu & Áp Dụng Ngay
            </>
          )}
        </button>
      </div>

    </div>
  );
}
