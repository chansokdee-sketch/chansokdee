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
    heroBadge: '✨ ຄໍເລັກຊັນເຄື່ອງສຳອາງພຣີມຽມ 2026 - ຫຼຸດສູງສຸດ 40%',
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
    showFlashSale: true,
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
        <div className="bg-gradient-to-r from-rose-700 via-pink-700 to-purple-800 text-white py-2 px-4 text-xs shadow-md z-30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              {isLao 
                ? `ສະບາຍດີ ${user.name || 'Boss Hải'} - ໂໝດຜູ້ດູແລລະບົບ: ທ່ານມີສິດປັບແຕ່ງໜ້າເວັບທັງໝົດ.`
                : `Xin chào ${user.name || 'Boss Hải'} (Admin): Bạn có toàn quyền tùy biến và chỉnh sửa giao diện.`}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisualEditMode(!visualEditMode)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1.5 shadow-sm ${
                  visualEditMode 
                    ? 'bg-amber-400 text-zinc-950 ring-2 ring-amber-300' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                <Edit className="w-3.5 h-3.5" />
                {visualEditMode ? 'Đang Bật Viền Sửa' : 'Bật Viền Sửa Nhanh'}
              </button>
              <button
                onClick={() => openCustomizer('theme')}
                className="px-3 py-1 bg-white text-rose-900 hover:bg-rose-50 font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <Palette className="w-3.5 h-3.5 text-rose-600" />
                Sửa Giao Diện Trực Quan
              </button>
              <Link
                href="/admin/settings"
                className="px-3 py-1 bg-purple-900/60 hover:bg-purple-900 text-purple-200 font-bold rounded-lg transition flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                Studio Đầy Đủ
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

      {/* STORE SHOWCASE & ESSENTIAL INFORMATION SECTION */}
      {!initialSearch && (
        <section className={`relative bg-gradient-to-b from-rose-50/50 via-white to-zinc-50 border-b border-zinc-200/80 py-8 sm:py-12 ${
          visualEditMode ? 'ring-4 ring-rose-500/50' : ''
        }`}>
          {/* Quick Edit Overlay for Admin */}
          {user?.role === 'ADMIN' && (
            <div className="absolute top-4 right-4 z-20">
              <Link
                href="/admin/settings"
                className="px-3 py-1.5 rounded-full bg-zinc-900/85 hover:bg-zinc-900 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md border border-zinc-700 backdrop-blur-xs"
              >
                <Edit className="w-3.5 h-3.5 text-amber-300" />
                <span>{isLao ? 'ແກ້ໄຂຂໍ້ມູນຮ້ານ' : 'Sửa Thông Tin Quán'}</span>
              </Link>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Essential Store Identity & Useful Info Cards */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Store Badge & Header */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-bold shadow-2xs">
                    <Store className="w-3.5 h-3.5 text-rose-600" />
                    <span>{isLao ? 'NovaBeauty Cosmetics • ນະຄອນຫຼວງວຽງຈັນ' : 'NovaBeauty Cosmetics • Showroom Viêng Chăn'}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight leading-snug">
                    {isLao 
                      ? 'ຮ້ານເຄື່ອງສຳອາງ & ຄວາມງາມແທ້ 100%' 
                      : 'Hệ Thống Mỹ Phẩm & Làm Đẹp Chính Hãng 100%'}
                  </h1>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-2xl font-light">
                    {isLao
                      ? 'ຍິນດີຕ້ອນຮັບສູ່ NovaBeauty - ສູນລວມເຄື່ອງສຳອາງ, ສະກິນແຄ ແລະ ນ້ຳຫອມແທ້ຊັ້ນນຳຈາກແບຣນດັງທົ່ວໂລກ. ຮັບປະກັນແທ້ 100%, ພ້ອມໃຫ້ຄຳປຶກສາສະພາບຜິວ ຟຣີ 1-1 ແລະ ຈັດສົ່ງດ່ວນເຖິງມືທ່ານ.'
                      : 'Chào mừng bạn đến với NovaBeauty - Trung tâm mỹ phẩm, dưỡng da và nước hoa cao cấp chính hãng nhập khẩu. Cam kết 100% nguồn gốc rõ ràng, tư vấn da 1-1 tận tâm và giao hàng hỏa tốc.'}
                  </p>
                </div>

                {/* 4 Essential Store Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {/* Card 1: Location & Hours */}
                  <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs space-y-1 hover:border-rose-300 transition">
                    <div className="flex items-center gap-2 text-rose-600">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-rose-600" />
                      </div>
                      <span className="text-xs font-bold text-zinc-900">
                        {isLao ? 'ທີ່ຕັ້ງ & ເວລາເປີດ' : 'Địa chỉ & Giờ mở cửa'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 font-medium pl-9">
                      {settings.address || (isLao ? 'ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ' : 'Thủ đô Viêng Chăn, Lào')}
                    </p>
                    <div className="flex items-center gap-1.5 pl-9 text-[11px] text-emerald-600 font-semibold">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{isLao ? 'ເປີດ 08:30 - 21:00 (ທຸກມື້)' : 'Mở cửa 08:30 - 21:00 (Mỗi ngày)'}</span>
                    </div>
                  </div>

                  {/* Card 2: Fast Delivery */}
                  <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs space-y-1 hover:border-rose-300 transition">
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-xs font-bold text-zinc-900">
                        {isLao ? 'ການຈັດສົ່ງສິນຄ້າ' : 'Giao Hàng Siêu Tốc'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 font-medium pl-9">
                      {isLao ? 'ຈັດສົ່ງດ່ວນ 2 ຊົ່ວໂມງ ໃນວຽງຈັນ' : 'Giao hỏa tốc 2 giờ tại Viêng Chăn'}
                    </p>
                    <p className="text-[11px] text-zinc-500 pl-9">
                      {isLao ? 'ຟຣີຄ່າສົ່ງ ສຳລັບບິນແຕ່ 300.000₭' : 'Miễn phí vận chuyển từ 300.000₭'}
                    </p>
                  </div>

                  {/* Card 3: 100% Authentic Guarantee */}
                  <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs space-y-1 hover:border-rose-300 transition">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-xs font-bold text-zinc-900">
                        {isLao ? 'ຮັບປະກັນແທ້ 100%' : 'Cam Kết Chính Hãng'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 font-medium pl-9">
                      {isLao ? 'ນຳເຂົ້າແທ້ 100% • ຄືນເງິນ 200%' : 'Chính hãng 100% • Đền bù 200%'}
                    </p>
                    <p className="text-[11px] text-zinc-500 pl-9">
                      {isLao ? 'ປ່ຽນຄືນໃນ 14 ມື້ ຖ້າແພ້ຜິວ' : 'Đổi trả an tâm trong 14 ngày'}
                    </p>
                  </div>

                  {/* Card 4: 1-on-1 Consultation */}
                  <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs space-y-1 hover:border-rose-300 transition">
                    <div className="flex items-center gap-2 text-purple-600">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-xs font-bold text-zinc-900">
                        {isLao ? 'ສາຍດ່ວນ & ປຶກສາ 24/7' : 'Hotline & Tư Vấn Da'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-800 font-bold pl-9">
                      Hotline: {settings.hotline || '020 55 777 975'}
                    </p>
                    <p className="text-[11px] text-zinc-500 pl-9">
                      {isLao ? 'ປຶກສາສະພາບຜິວ ຟຣີ 1-1' : 'Tư vấn chu trình da 1-1 miễn phí'}
                    </p>
                  </div>

                </div>

                {/* Quick Action Contact Bar */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <a
                    href={`https://wa.me/${(settings.whatsappNumber || '02055777975').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp: {settings.whatsappNumber || '020 55 777 975'}</span>
                  </a>

                  <a
                    href={settings.facebookUrl || 'https://www.facebook.com/minhnam.ho.125'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs active:scale-95"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook Messenger</span>
                  </a>

                  <a
                    href="#product-catalog"
                    className="px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{isLao ? 'ເບິ່ງສິນຄ້າທັງໝົດ' : 'Xem Sản Phẩm'}</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

              {/* Right Column: Clean Showroom Showcase Card */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-lg border border-zinc-200/90 bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop"
                    alt="NovaBeauty Showroom Vientiane"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent flex flex-col justify-end p-5 text-white pointer-events-none">
                    <span className="text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                      Showroom Vientiane • Laos
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      NovaBeauty Boutique
                    </h3>
                    <p className="text-xs text-zinc-200 mt-1">
                      {isLao 
                        ? 'ພ້ອມຕ້ອນຮັບລູກຄ້າທຸກທ່ານທີ່ມັກຄວາມງາມ ດ້ວຍສິນຄ້າແທ້ 100%' 
                        : 'Không gian trải nghiệm mỹ phẩm & dịch vụ tư vấn soi da chuyên nghiệp.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* SLIM MINIMALIST FLASH SALE TICKER BAR */}
      {!initialSearch && (settings.showFlashSale ?? true) && (
        <section className={`bg-zinc-950 text-white border-y border-zinc-800/80 py-2.5 px-4 relative ${
          visualEditMode ? 'ring-4 ring-amber-400' : ''
        }`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-xs">
            <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/30">
                <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                {isLao && settings.flashSaleBadge === '⚡ GIỜ VÀNG GIÁ SỐC' ? t('flash_sale_badge') : (settings.flashSaleBadge || t('flash_sale_badge'))}
              </span>
              <span className="font-medium text-zinc-300 text-xs">
                {isLao && settings.flashSaleTitle === 'Flash Sale Công Nghệ - Giảm Tới 50%' ? t('flash_sale_title') : (settings.flashSaleTitle || t('flash_sale_title'))}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CountdownTimer label={t('flash_sale_end')} />

              {/* Coupon Pill */}
              {settings.flashSaleDiscountCode && (
                <button
                  onClick={() => copyVoucherCode(settings.flashSaleDiscountCode || 'BEAUTY50')}
                  className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-medium transition flex items-center gap-1.5 border border-zinc-700 active:scale-95"
                >
                  <Tag className="w-3 h-3 text-rose-400" />
                  <span>{settings.flashSaleDiscountCode}</span>
                  {copiedVoucher ? (
                    <span className="text-[10px] text-emerald-400 font-bold">{isLao ? '✓' : '✓'}</span>
                  ) : (
                    <Copy className="w-3 h-3 text-zinc-400" />
                  )}
                </button>
              )}

              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => openCustomizer('flashsale')}
                  className="text-zinc-400 hover:text-amber-300 transition p-1"
                  title="Sửa Flash Sale"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PROMO CARDS (SECONDARY PROMO BANNERS) */}
      {!initialSearch && (settings.showPromoCards ?? true) && (
        <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 w-full relative ${
          visualEditMode ? 'ring-4 ring-indigo-400 rounded-3xl' : ''
        }`}>
          {user?.role === 'ADMIN' && (
            <div className="flex justify-end mb-2">
              <button
                onClick={() => openCustomizer('promocards')}
                className="px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                <Edit className="w-3 h-3 text-blue-400" />
                Sửa 2 Banner Phụ
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1 */}
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-zinc-900 text-white p-6 sm:p-8 flex items-center justify-between shadow-xl min-h-[180px] group`}>
              <div className="space-y-2 z-10 max-w-[65%]">
                <span className="px-2.5 py-1 rounded-full bg-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-400/20">
                  {settings.promoCard1Badge || 'ƯU ĐÃI ĐẶC BIỆT'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {settings.promoCard1Title || 'Thu Cũ Đổi Mới Lên Đời'}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {settings.promoCard1Subtitle || 'Trợ giá lên đến 3.000.000đ khi nâng cấp máy mới'}
                </p>
                <div className="pt-2">
                  <a
                    href="#product-catalog"
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full transition shadow-md"
                  >
                    {settings.promoCard1ButtonText || 'Định giá ngay'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="absolute right-0 top-0 bottom-0 w-[40%] overflow-hidden opacity-80 group-hover:opacity-100 transition duration-500">
                <img
                  src={settings.promoCard1ImageUrl || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop'}
                  alt="Promo 1"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-transparent"></div>
              </div>
            </div>

            {/* Card 2 */}
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 flex items-center justify-between shadow-xl min-h-[180px] group`}>
              <div className="space-y-2 z-10 max-w-[65%]">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-400/20">
                  {settings.promoCard2Badge || 'COMBO TIẾT KIỆM'}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {settings.promoCard2Title || 'Phụ Kiện Chính Hãng'}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {settings.promoCard2Subtitle || 'Sạc nhanh, tai nghe & bao da giảm thêm 25%'}
                </p>
                <div className="pt-2">
                  <a
                    href="#product-catalog"
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-full transition shadow-md"
                  >
                    {settings.promoCard2ButtonText || 'Khám phá ngay'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="absolute right-0 top-0 bottom-0 w-[40%] overflow-hidden opacity-80 group-hover:opacity-100 transition duration-500">
                <img
                  src={settings.promoCard2ImageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop'}
                  alt="Promo 2"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-transparent"></div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* MAIN CATALOG SECTION */}
      <main id="product-catalog" className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-28 sm:pb-12 flex-1 w-full relative ${
        visualEditMode ? 'ring-4 ring-emerald-400 rounded-3xl' : ''
      }`}>
        
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
                            <span className="text-[10px] text-zinc-500 block font-medium">
                              Sỉ: <strong className="text-amber-600 font-bold">{formatPrice(wholesalePrice)}</strong> (≥{minQty} cái)
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isOutOfStock}
                      className={`h-8 sm:h-9 px-3 rounded-full bg-zinc-900 hover:bg-rose-600 text-white text-xs font-medium transition flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none active:scale-95 shadow-2xs`}
                      title={t('add_to_cart')}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">{t('add_to_cart')}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* FLOATING ACTION DOCK FOR ADMIN VISUAL EDITOR */}
      {user?.role === 'ADMIN' && (
        <div className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-40 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 text-white rounded-2xl shadow-2xl p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-2 max-w-[calc(100vw-5rem)]">
          <button
            onClick={() => openCustomizer('theme')}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Sửa Giao Diện Trực Quan</span>
            <span className="sm:hidden">Sửa Giao Diện</span>
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
            <span className="hidden sm:inline">{visualEditMode ? 'Tắt Viền Sửa' : 'Bật Viền Sửa'}</span>
            <span className="sm:hidden">{visualEditMode ? 'Tắt Viền' : 'Viền'}</span>
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

      {/* FLOATING QUICK CONTACT (FACEBOOK + WHATSAPP + HOTLINE) */}
      {(settings.showFloatingContact ?? true) && (
        <div className="fixed bottom-20 sm:bottom-6 right-3.5 sm:right-6 z-40 flex flex-col items-end gap-2.5">
          {/* Expanded contact options: on desktop always visible OR on mobile toggleable */}
          <div className={`${mobileContactOpen ? 'flex' : 'hidden sm:flex'} flex-col items-end gap-2.5 animate-in slide-in-from-bottom-2 duration-200`}>
            {/* Facebook / Messenger Button */}
            <a
              href={settings.facebookUrl || 'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
              title="Chat tư vấn qua Facebook"
            >
              <span className="bg-zinc-900/90 text-white text-[11px] font-semibold px-2 py-1 rounded-lg border border-zinc-800 shadow-md hidden sm:block opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                Facebook Messenger
              </span>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-xl flex items-center justify-center transition hover:scale-110 active:scale-95">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            </a>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${(settings.whatsappNumber || '+84988888888').replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
              title="Chat tư vấn qua WhatsApp"
            >
              <span className="bg-zinc-900/90 text-white text-[11px] font-semibold px-2 py-1 rounded-lg border border-zinc-800 shadow-md hidden sm:block opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                WhatsApp: {settings.whatsappNumber || '+84988888888'}
              </span>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl flex items-center justify-center transition hover:scale-110 active:scale-95">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
            </a>

            {/* Hotline Call Button */}
            <a
              href={`tel:${settings.hotline}`}
              className="flex items-center gap-2 group"
              title="Gọi ngay Hotline"
            >
              <span className="bg-zinc-900/90 text-white text-[11px] font-semibold px-2 py-1 rounded-lg border border-zinc-800 shadow-md hidden sm:block opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                Hotline: {settings.hotline}
              </span>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl flex items-center justify-center transition hover:scale-110 active:scale-95">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </div>
            </a>
          </div>

          {/* Mobile Speed Dial Main Toggle Button (Hidden on tablet/desktop) */}
          <button
            onClick={() => setMobileContactOpen(!mobileContactOpen)}
            className="sm:hidden w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-2xl flex items-center justify-center active:scale-90 transition border-2 border-white/20"
            aria-label="Liên hệ hỗ trợ"
          >
            {mobileContactOpen ? (
              <X className="w-6 h-6 animate-in spin-in-90 duration-150" />
            ) : (
              <MessageCircle className="w-6 h-6 animate-in zoom-in-75 duration-150" />
            )}
          </button>
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
