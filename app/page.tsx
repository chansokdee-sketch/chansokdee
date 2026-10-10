'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveVisualCustomizer from '@/components/LiveVisualCustomizer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Product, Category, SiteSettings } from '@/lib/types';
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Check, 
  AlertTriangle,
  SlidersHorizontal,
  ChevronRight,
  Edit,
  Edit3,
  ShieldCheck,
  Zap,
  Tag,
  Clock,
  Copy,
  Phone,
  MessageCircle,
  Gift,
  X,
  Palette,
  Sliders,
  Layers,
  ArrowUpRight,
  MapPin,
  Truck,
  Store,
  ArrowDown
} from 'lucide-react';

const CountdownTimer = React.memo(function CountdownTimer({ label }: { label: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1 font-mono text-xs text-zinc-300 select-none" translate="no">
      <span className="text-[11px] text-zinc-400 mr-1 hidden sm:inline">{label}</span>
      <span className="w-7 text-center px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300 font-bold inline-block">
        {String(timeLeft.hours).padStart(2, '0')}
      </span>
      <span className="text-zinc-500">:</span>
      <span className="w-7 text-center px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300 font-bold inline-block">
        {String(timeLeft.minutes).padStart(2, '0')}
      </span>
      <span className="text-zinc-500">:</span>
      <span className="w-7 text-center px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300 font-bold inline-block">
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
});

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { addToCart, setIsCartOpen, customerMode } = useCart();
  const { user } = useAuth();
  const { t, formatPrice, isLao } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [loading, setLoading] = useState(true);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Live Customizer Drawer & Visual Edit State
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerSection, setCustomizerSection] = useState<string>('theme');
  const [visualEditMode, setVisualEditMode] = useState(false);
  const [mobileContactOpen, setMobileContactOpen] = useState(false);

  // Promo Popup state
  const [isPromoPopupOpen, setIsPromoPopupOpen] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  const [settings, setSettings] = useState<SiteSettings>({
    storeName: 'NovaBeauty',
    slogan: 'ຮ້ານຂາຍເຄື່ອງສຳອາງ & ຄວາມງາມແທ້ 100%',
    primaryColor: 'rose',
    hotline: '020 55 777 975',
    email: 'cskh@novabeauty.com',
    address: 'ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ',
    topAnnouncement: 'ຈັດສົ່ງຟຣີທົ່ວປະເທດສຳລັບບິນແຕ່ 300.000₭ | ສິນຄ້າແທ້ 100% ມີໃບບິນ',
    showTopAnnouncement: true,
    showHeroBanner: true,
    heroBadge: '✨ ຄໍເລັກຊັນເຄື່ອງສຳອາງພຣີມຽມ 2026',
    heroTitle: 'ສ່ອງແສງຄວາມງາມດ້ວຍເຄື່ອງສຳອາງແທ້ 100% ລະດັບສາກົນ',
    heroSubtitle: 'ລະບົບຈຳໜ່າຍເຄື່ອງສຳອາງ, ບຳລຸງຜິວ, ລິບສະຕິກ ແລະ ນ້ຳຫອມແທ້ຊັ້ນນຳຈາກ ຝຣັ່ງ, ເກົາຫຼີ, ຍີ່ປຸ່ນ & ອາເມລິກາ. ຮັບປະກັນແທ້ 100%, ຄືນເງິນ 200% ຖ້າພົບຂອງປອມ.',
    heroButtonPrimaryText: 'ຄົ້ນຫາສິນຄ້າຂາຍດີ',
    heroButtonSecondaryText: 'ເປີດກະຕ່າສິນຄ້າ',
    heroImageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    heroCardTitle: 'ເຊຣັ່ມ Estée Lauder Advanced Night Repair',
    heroCardSubtitle: 'ເຄັດລັບຜິວອ່ອນເຍົາ ແລະ ສົດໃສຢ່າງເປັນທຳມະຊາດ',
    heroCardBadge: 'ຂາຍດີທີ່ສຸດ',

    borderRadius: 'rounded-3xl',
    productGridColumns: 4,
    showFlashSale: false,
    flashSaleBadge: '⚡ FLASH SALE ຄວາມງາມ',
    flashSaleTitle: 'Flash Sale ເຄື່ອງສຳອາງ - ຫຼຸດລາຄາສູງສຸດ 50%',
    flashSaleSubtitle: 'ໂອກາດເປັນເຈົ້າຂອງເຄື່ອງສຳອາງ ແລະ ນ້ຳຫອມແທ້ໃນລາຄາທີ່ດີທີ່ສຸດມື້ນີ້',
    flashSaleEndTime: '23:59:59',
    flashSaleDiscountCode: 'BEAUTY50',

    showPromoCards: false,
    promoCard1Badge: 'ໂປຣໂມຊັ່ນພິເສດ',
    promoCard1Title: 'Combo Skincare ຜິວຂາວໃສ',
    promoCard1Subtitle: 'ແຖມຟຣີ set minisize ພຣີມຽມ ສຳລັບບິນແຕ່ 800.000₭',
    promoCard1ButtonText: 'ເບິ່ງລາຍລະອຽດ',
    promoCard1ImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',

    promoCard2Badge: 'ຍອດນິຍົມ 2026',
    promoCard2Title: 'ຄໍເລັກຊັນລິບສະຕິກແມັດ',
    promoCard2Subtitle: 'ໂທນສີທັນສະໄໝຈາກ Dior, MAC, Black Rouge ຫຼຸດຕື່ມ 25%',
    promoCard2ButtonText: 'ຄົ້ນຫາດຽວນີ້',
    promoCard2ImageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',

    showPromoPopup: false,
    promoPopupTitle: 'ຂອງຂວັນຕ້ອນຮັບລູກຄ້າໃໝ່',
    promoPopupSubtitle: 'ຮັບທັນທີ Voucher 100.000₭ ສຳລັບບິນທຳອິດແຕ່ 500.000₭!',
    promoPopupCode: 'BEAUTY100',
    promoPopupDiscountText: 'ຫຼຸດທັນທີ 100.000₭',

    showFloatingContact: true,
    facebookUrl: 'https://facebook.com',
    whatsappNumber: '02055777975',
    zaloNumber: '0988888888',

    showNewsletter: true,
    newsletterTitle: 'ລົງທະບຽນຮັບຂ່າວສານຄວາມງາມ',
    newsletterSubtitle: 'ຮັບການແຈ້ງເຕືອນໂປຣໂມຊັ່ນ ແລະ ໂຄດຫຼຸດລາຄາພິເສດກ່ອນໃຜ',

    badge1Title: 'ຈັດສົ່ງຟຣີທົ່ວປະເທດ',
    badge1Desc: 'ສຳລັບຍອດສັ່ງຊື້ແຕ່ 300.000₭',
    badge2Title: 'ຂອງແທ້ 100%',
    badge2Desc: 'ນຳເຂົ້າແທ້ 100% & ຄືນເງິນ 200%',
    badge3Title: 'ປ່ຽນຄືນພາຍໃນ 14 ມື້',
    badge3Desc: 'ຮັບປະກັນຖ້າມີອາການແພ້ ຫຼື ບັນຫາ',
    badge4Title: 'ປຶກສາຜິວພັນ 24/7',
    badge4Desc: 'ປຶກສາຜ່ານ Facebook & WhatsApp',
    catalogTitle: 'ເຄື່ອງສຳອາງ & ຄວາມງາມລ່າສຸດ',
    catalogSubtitle: 'ເຄື່ອງສຳອາງແທ້ພ້ອມຈັດສົ່ງດ່ວນພາຍໃນ 2 ຊົ່ວໂມງ',
    footerAbout: 'ລະບົບຈຳໜ່າຍເຄື່ອງສຳອາງແທ້, ບຳລຸງຜິວໜ້າ, ແຕ່ງໜ້າ ແລະ ນ້ຳຫອມລະດັບສູງຈາກແບຣນດັງທົ່ວໂລກ.',
    footerCopyright: '© 2026 NovaBeauty Cosmetics. ສະຫງວນລິຂະສິດ.',
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (initialSearch) params.set('search', initialSearch);
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedSubCategory !== 'all') params.set('subCategory', selectedSubCategory);
      if (sortBy) params.set('sort', sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubCategory('all');
  };

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [initialSearch, selectedCategory, selectedSubCategory, sortBy]);

  // Promo popup trigger
  useEffect(() => {
    if (settings.showPromoPopup) {
      const shown = sessionStorage.getItem('novastore_promo_shown');
      if (!shown) {
        const timeout = setTimeout(() => {
          setIsPromoPopupOpen(true);
          sessionStorage.setItem('novastore_promo_shown', 'true');
        }, 1200);
        return () => clearTimeout(timeout);
      }
    }
  }, [settings.showPromoPopup]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = addToCart(product, 1);
    setAddedNotice(isLao ? t('added_to_cart') : res.message);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  const handleBuyNow = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    router.push('/cart');
  };

  const openCustomizer = (section: string) => {
    setCustomizerSection(section);
    setIsCustomizerOpen(true);
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  const cardRadiusClass = settings.borderRadius || 'rounded-3xl';
  const gridColsClass = (settings.productGridColumns || 4) === 3 
    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3' 
    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  const theme = {
    rose: {
      selection: 'selection:bg-rose-600',
      heroGradient: 'from-rose-950 via-pink-950 to-zinc-950',
      heroRadial: 'from-rose-500/20',
      heroBadge: 'bg-rose-500/20 text-rose-300 border-rose-400/20',
      btnPrimary: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30',
      accentText: 'text-rose-600',
      catActive: 'bg-rose-600 text-white shadow-md shadow-rose-600/20',
      borderHover: 'hover:border-rose-400 hover:shadow-rose-500/10',
      buyNow: 'bg-rose-600 hover:bg-rose-700 shadow-xs shadow-rose-600/20',
      cartHover: 'hover:bg-rose-50 hover:text-rose-600',
    },
    emerald: {
      selection: 'selection:bg-emerald-600',
      heroGradient: 'from-emerald-950 via-teal-950 to-zinc-950',
      heroRadial: 'from-emerald-500/20',
      heroBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/20',
      btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30',
      accentText: 'text-emerald-600',
      catActive: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20',
      borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
      buyNow: 'bg-emerald-600 hover:bg-emerald-700 shadow-xs shadow-emerald-600/20',
      cartHover: 'hover:bg-emerald-50 hover:text-emerald-600',
    },
    violet: {
      selection: 'selection:bg-violet-600',
      heroGradient: 'from-violet-950 via-purple-950 to-zinc-950',
      heroRadial: 'from-violet-500/20',
      heroBadge: 'bg-violet-500/20 text-violet-300 border-violet-400/20',
      btnPrimary: 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/30',
      accentText: 'text-violet-600',
      catActive: 'bg-violet-600 text-white shadow-md shadow-violet-600/20',
      borderHover: 'hover:border-violet-400 hover:shadow-violet-500/10',
      buyNow: 'bg-violet-600 hover:bg-violet-700 shadow-xs shadow-violet-600/20',
      cartHover: 'hover:bg-violet-50 hover:text-violet-600',
    },
    amber: {
      selection: 'selection:bg-amber-600',
      heroGradient: 'from-amber-950 via-orange-950 to-zinc-950',
      heroRadial: 'from-amber-500/20',
      heroBadge: 'bg-amber-500/20 text-amber-300 border-amber-400/20',
      btnPrimary: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30',
      accentText: 'text-amber-600',
      catActive: 'bg-amber-600 text-white shadow-md shadow-amber-600/20',
      borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
      buyNow: 'bg-amber-600 hover:bg-amber-700 shadow-xs shadow-amber-600/20',
      cartHover: 'hover:bg-amber-50 hover:text-amber-600',
    },
    blue: {
      selection: 'selection:bg-blue-600',
      heroGradient: 'from-blue-950 via-indigo-950 to-zinc-950',
      heroRadial: 'from-blue-500/20',
      heroBadge: 'bg-blue-500/20 text-blue-300 border-blue-400/20',
      btnPrimary: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30',
      accentText: 'text-blue-600',
      catActive: 'bg-blue-600 text-white shadow-md shadow-blue-600/20',
      borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
      buyNow: 'bg-blue-600 hover:bg-blue-700 shadow-xs shadow-blue-600/20',
      cartHover: 'hover:bg-blue-50 hover:text-blue-600',
    },
  }[settings.primaryColor || 'rose'] || {
    selection: 'selection:bg-rose-600',
    heroGradient: 'from-rose-950 via-pink-950 to-zinc-950',
    heroRadial: 'from-rose-500/20',
    heroBadge: 'bg-rose-500/20 text-rose-300 border-rose-400/20',
    btnPrimary: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30',
    accentText: 'text-rose-600',
    catActive: 'bg-rose-600 text-white shadow-md shadow-rose-600/20',
    borderHover: 'hover:border-rose-400 hover:shadow-rose-500/10',
    buyNow: 'bg-rose-600 hover:bg-rose-700 shadow-xs shadow-rose-600/20',
    cartHover: 'hover:bg-rose-50 hover:text-rose-600',
  };

  // Active Category & Subcategories for hierarchical filtering (minimalist: only reveal subcategories when a category is selected)
  const activeCategory = categories.find(c => c.id === selectedCategory);
  const availableSubCategories = activeCategory
    ? (activeCategory.subCategories || [])
    : [];

  const getCategoryEmoji = (iconOrSlug?: string) => {
    switch (iconOrSlug) {
      case 'Sparkles':
      case 'cham-soc-da-mat':
      case 'cat-skincare':
        return '✨';
      case 'Heart':
      case 'son-moi':
      case 'cat-lipstick':
        return '💄';
      case 'Palette':
      case 'trang-diem':
      case 'cat-makeup':
        return '🎨';
      case 'Flame':
      case 'nuoc-hoa':
      case 'cat-perfume':
        return '🌸';
      case 'Droplets':
      case 'cham-soc-toc-body':
      case 'cat-body-hair':
        return '💧';
      default:
        return '✨';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-zinc-50 relative ${theme.selection} selection:text-white`}>
      <Navbar />

      {/* Admin Top Notification & Quick Bar */}
      {user?.role === 'ADMIN' && (
        <div className="bg-gradient-to-r from-rose-700 via-pink-700 to-purple-800 text-white py-1.5 px-3 sm:px-4 text-xs shadow-md z-30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
            <span className="font-semibold flex items-center gap-1.5 text-[11px] sm:text-xs truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
              <span>
                {isLao 
                  ? `Boss Hải (Admin): ໂໝດປັບແຕ່ງ`
                  : `Boss Hải (Admin): Chế độ sửa giao diện`}
              </span>
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                onClick={() => setVisualEditMode(!visualEditMode)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 shadow-sm ${
                  visualEditMode 
                    ? 'bg-amber-400 text-zinc-950 ring-2 ring-amber-300' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                <Edit className="w-3 h-3" />
                <span>{visualEditMode ? 'Tắt Viền' : 'Viền Sửa'}</span>
              </button>
              <button
                onClick={() => openCustomizer('theme')}
                className="px-2.5 py-1 bg-white text-rose-900 hover:bg-rose-50 font-bold rounded-lg shadow-sm transition flex items-center gap-1 text-[11px]"
              >
                <Palette className="w-3 h-3 text-rose-600" />
                <span>Sửa Giao Diện</span>
              </button>
              <Link
                href="/admin/settings"
                className="hidden sm:flex px-2.5 py-1 bg-purple-900/60 hover:bg-purple-900 text-purple-200 font-bold rounded-lg transition items-center gap-1 text-[11px]"
              >
                <Sliders className="w-3 h-3" />
                <span>Studio</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notice Toast */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{addedNotice}</span>
        </div>
      )}



      {/* MAIN CATALOG SECTION */}
      <main id="product-catalog" className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-28 sm:pb-12 flex-1 w-full relative ${
        visualEditMode ? 'ring-4 ring-emerald-400 rounded-3xl' : ''
      }`}>
        {/* Banner thông báo chế độ Quản Lý & Nhân Viên */}
        {user && (user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'STAFF') && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border border-zinc-700/60 animate-in fade-in">
            <div className="flex items-center gap-3 text-xs w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center flex-shrink-0 text-base border border-blue-400/30">
                {user.role === 'ADMIN' ? '👑' : user.role === 'MANAGER' ? '💼' : '👔'}
              </div>
              <div>
                <p className="font-bold text-sm text-white">
                  {user.role === 'ADMIN' ? '👑 Boss Hải (Quản trị viên)' : user.role === 'MANAGER' ? '💼 Quản Lý Cửa Hàng' : '👔 Nhân Viên Bán Hàng'}
                </p>
                <p className="text-[11px] text-zinc-300">
                  Tài khoản nội bộ không có mục mua hàng. Vai trò của bạn là <strong>nhận order</strong>, <strong>hoàn thành order</strong> và <strong>thêm sản phẩm mới</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
              <Link
                href="/admin/orders"
                className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-md text-center flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>📋 Nhận & Hoàn Thành Order</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md text-center flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>➕ Thêm Món Mới</span>
              </Link>
            </div>
          </div>
        )}

        {/* Title and Category Filter Bar */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                  {initialSearch ? `${isLao ? 'ຜົນການຄົ້ນຫາສຳລັບ:' : 'Kết quả tìm kiếm cho:'} "${initialSearch}"` : (isLao && settings.catalogTitle === 'Danh Mục Sản Phẩm Mới Nhất' ? t('catalog_title') : (settings.catalogTitle || t('catalog_title')))}
                </h2>
                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => openCustomizer('theme')}
                    title="Chỉnh sửa tiêu đề & kiểu lưới sản phẩm"
                    className="p-1 rounded-lg text-zinc-400 hover:text-blue-600 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {isLao && settings.catalogSubtitle === 'Sản phẩm chính hãng sẵn sàng giao ngay trong 2 giờ' ? t('catalog_subtitle') : (settings.catalogSubtitle || (isLao ? 'ສິນຄ້າແທ້ພ້ອມຈັດສົ່ງ' : 'Hiển thị'))} ({products.length} {isLao ? 'ສິນຄ້າພ້ອມສົ່ງ' : 'sản phẩm sẵn sàng giao ngay'})
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {t('sort_by')}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 outline-none focus:border-blue-500 shadow-2xs"
              >
                <option value="newest">{t('sort_newest')}</option>
                <option value="price_asc">{t('sort_price_asc')}</option>
                <option value="price_desc">{t('sort_price_desc')}</option>
              </select>
            </div>
          </div>

          {/* Main Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleSelectCategory('all')}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex-shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? theme.catActive
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 shadow-2xs'
              }`}
            >
              <span>🌸</span>
              <span>{t('all_categories')}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex-shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? theme.catActive
                    : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 shadow-2xs'
                }`}
              >
                <span>{getCategoryEmoji(cat.icon || cat.slug || cat.id)}</span>
                <span>{isLao && cat.nameLao ? cat.nameLao : cat.name}</span>
                {cat.subCategories && cat.subCategories.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {cat.subCategories.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Subcategory Pills Bar (Mục phân loại nhỏ) */}
          {availableSubCategories.length > 0 && (
            <div className="bg-zinc-50/90 border border-zinc-200/80 rounded-2xl p-2.5 sm:p-3 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-500"></span>
                  {t('subcategories_title')}
                  {activeCategory && (
                    <span className="text-zinc-900 font-extrabold normal-case">
                      {isLao && activeCategory.nameLao ? activeCategory.nameLao : activeCategory.name}
                    </span>
                  )}
                </span>
                {selectedSubCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedSubCategory('all')}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-bold underline transition"
                  >
                    {isLao ? 'ລ້າງການເລືອກ' : 'Xem tất cả mục nhỏ'}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedSubCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                    selectedSubCategory === 'all'
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                  }`}
                >
                  {t('all_subcategories')}
                </button>

                {availableSubCategories.map((sub) => {
                  const isSubActive = selectedSubCategory === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        if (isSubActive) {
                          setSelectedSubCategory('all');
                        } else {
                          setSelectedSubCategory(sub.id);
                          if (selectedCategory === 'all' && sub.categoryId) {
                            setSelectedCategory(sub.categoryId);
                          }
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 flex items-center gap-1.5 ${
                        isSubActive
                          ? 'bg-rose-600 text-white shadow-xs shadow-rose-500/25 ring-2 ring-rose-600/30 font-extrabold'
                          : 'bg-white text-zinc-700 hover:bg-rose-50 hover:text-rose-600 border border-zinc-200'
                      }`}
                    >
                      <span>{isLao && sub.nameLao ? sub.nameLao : sub.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className={`grid ${gridColsClass} gap-4 sm:gap-6 py-12`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`bg-white ${cardRadiusClass} p-4 border border-zinc-100 animate-pulse space-y-3`}>
                <div className="w-full aspect-square bg-zinc-200 rounded-2xl"></div>
                <div className="h-4 bg-zinc-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-zinc-200 rounded-md w-1/2"></div>
                <div className="h-9 bg-zinc-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className={`bg-white ${cardRadiusClass} border border-zinc-100 p-12 text-center my-8`}>
            <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-800">{isLao ? 'ບໍ່ພົບສິນຄ້າໃດໆ' : 'Không tìm thấy sản phẩm nào'}</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              {isLao ? 'ລອງຄົ້ນຫາດ້ວຍຄຳສັບອື່ນ ຫຼື ປ່ຽນໝວດໝູ່ເພື່ອເບິ່ງສິນຄ້າເພີ່ມເຕີມ.' : 'Thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục khác để xem thêm sản phẩm nhé.'}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); router.push('/'); }}
              className={`mt-4 px-4 py-2 ${theme.btnPrimary} text-white text-xs font-bold rounded-xl`}
            >
              {t('all_categories')}
            </button>
          </div>
        ) : (
          <div className={`grid ${gridColsClass} gap-4 sm:gap-6`}>
            {products.map((product) => {
              const isLowStock = product.stock > 0 && product.stock <= 5;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  className={`group bg-white ${cardRadiusClass} p-3 sm:p-4 border border-zinc-200/60 ${theme.borderHover} transition duration-300 flex flex-col justify-between hover:shadow-md`}
                >
                  <div>
                    {/* Image Box */}
                    <Link href={`/products/${product.id}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 mb-3">
                      <img
                        src={product.images[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=500&auto=format&fit=crop'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      {/* Minimalist Stock Badge: Only show if Out of stock or Low stock */}
                      {isOutOfStock ? (
                        <div className="absolute top-2.5 left-2.5 bg-zinc-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {t('out_of_stock')}
                        </div>
                      ) : isLowStock ? (
                        <div className="absolute top-2.5 left-2.5 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {isLao ? `ເຫຼືອ ${product.stock}` : `Còn ${product.stock}`}
                        </div>
                      ) : null}
                    </Link>

                    {/* Brand / Subcategory Line */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                        <span className="truncate">{product.brand || 'NovaBeauty'}</span>
                        {product.subCategoryName && (
                          <span className="text-zinc-500 truncate max-w-[110px] font-normal normal-case">
                            {isLao && product.subCategoryNameLao ? product.subCategoryNameLao : product.subCategoryName}
                          </span>
                        )}
                      </div>

                      {/* Product Name */}
                      <Link href={`/products/${product.id}`} className="block">
                        <h3 className={`text-xs sm:text-sm font-semibold text-zinc-900 group-hover:${theme.accentText} transition line-clamp-2 leading-snug min-h-[2.5rem]`}>
                          {isLao && product.nameLao ? product.nameLao : product.name}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <div>
                      {(() => {
                        const wholesalePrice = product.wholesalePrice !== undefined && product.wholesalePrice > 0
                          ? product.wholesalePrice
                          : Math.round(product.price * 0.8);
                        const minQty = product.minWholesaleQty || 3;

                        if (customerMode === 'WHOLESALE') {
                          return (
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm sm:text-base font-extrabold text-amber-600 font-mono">
                                  {formatPrice(wholesalePrice)}
                                </span>
                                <span className="text-[9px] bg-amber-500/15 text-amber-700 px-1.5 py-0.5 rounded font-black border border-amber-500/20">
                                  Sỉ ⚡
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-400 line-through block font-mono">
                                Lẻ: {formatPrice(product.price)}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div>
                            <span className={`text-sm sm:text-base font-extrabold ${theme.accentText} font-mono`}>
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {user && (user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'STAFF') ? (
                      <Link
                        href="/admin/products"
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 sm:h-9 px-3 rounded-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-blue-200 active:scale-95 shadow-2xs"
                        title="Quản lý & Chỉnh sửa món này"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Sửa món</span>
                      </Link>
                    ) : (
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={isOutOfStock}
                        className={`h-8 sm:h-9 px-3 rounded-full bg-zinc-900 hover:bg-rose-600 text-white text-xs font-medium transition flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-2xs`}
                        title={t('add_to_cart')}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">{t('add_to_cart')}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* FLOATING ACTION DOCK FOR ADMIN VISUAL EDITOR (Desktop only) */}
      {user?.role === 'ADMIN' && (
        <div className="hidden md:flex fixed bottom-6 left-6 z-40 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 text-white rounded-2xl shadow-2xl p-2 sm:p-2.5 items-center gap-1.5 sm:gap-2 max-w-[calc(100vw-5rem)]">
          <button
            onClick={() => openCustomizer('theme')}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Sửa Giao Diện Trực Quan</span>
          </button>
          <button
            onClick={() => setVisualEditMode(!visualEditMode)}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition flex items-center gap-1.5 ${
              visualEditMode
                ? 'bg-amber-400 text-zinc-950 font-bold'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>{visualEditMode ? 'Tắt Viền Sửa' : 'Bật Viền Sửa'}</span>
          </button>
          <Link
            href="/admin/settings"
            className="p-1.5 sm:p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
            title="Mở Studio Toàn Màn Hình (/admin/settings)"
          >
            <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      )}

      {/* WELCOME PROMO POPUP MODAL */}
      {isPromoPopupOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 text-white max-w-sm w-full rounded-3xl p-6 text-center space-y-4 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setIsPromoPopupOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
              <Gift className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black border border-rose-500/30 uppercase tracking-wider">
                {isLao && settings.promoPopupDiscountText === 'GIẢM 100.000đ' ? t('promo_discount') : (settings.promoPopupDiscountText || t('promo_discount'))}
              </span>
              <h3 className="text-lg font-black text-white">
                {isLao && settings.promoPopupTitle === 'Quà Tặng Khách Hàng Mới' ? t('promo_gift_title') : (settings.promoPopupTitle || t('promo_gift_title'))}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {isLao && settings.promoPopupSubtitle === 'Nhận ngay Voucher 100.000đ cho đơn hàng đầu tiên từ 500k!' ? 'ຮັບທັນທີ Voucher 100.000₭ ສຳລັບລາຍການສັ່ງຊື້ທຳອິດ!' : (settings.promoPopupSubtitle || 'Nhận ngay Voucher 100.000đ cho đơn hàng đầu tiên từ 500k!')}
              </p>
            </div>

            {settings.promoPopupCode && (
              <div className="p-3 bg-zinc-900 border border-dashed border-zinc-700 rounded-2xl flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400 text-sm tracking-wider">
                  {settings.promoPopupCode}
                </span>
                <button
                  onClick={() => copyVoucherCode(settings.promoPopupCode || 'WELCOME100')}
                  className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedVoucher ? (isLao ? 'ຄັດລອກແລ້ວ' : 'Đã sao chép') : (isLao ? 'ຄັດລອກ' : 'Sao chép')}
                </button>
              </div>
            )}

            <button
              onClick={() => setIsPromoPopupOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs shadow-md transition"
            >
              {isLao ? 'ເລີ່ມຊື້ເຄື່ອງດຽວນີ້' : 'Khám Phá Cửa Hàng Ngay'}
            </button>
          </div>
        </div>
      )}

      {/* IN-PAGE LIVE CUSTOMIZER DRAWER */}
      <LiveVisualCustomizer
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        activeSection={customizerSection}
      />

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-500">Đang tải NovaStore...</div>}>
      <HomeContent />
    </Suspense>
  );
}
