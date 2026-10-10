'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Product, Category } from '@/lib/types';
import { 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Minus, 
  Plus, 
  AlertTriangle,
  Tag,
  Boxes,
  Sparkles,
  Phone,
  ShoppingCart,
  Edit3,
  Palette,
  Maximize2,
  Layers
} from 'lucide-react';
import { PackagingUnit, ProductVariant } from '@/lib/types';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addToCart, setIsCartOpen, customerMode, hasFullPriceAccess } = useCart();
  const { user, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const { t, formatPrice, formatDualPrice, currency, isLao, thbRate } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<PackagingUnit>('PIECE');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (res.ok && data.product) {
          setProduct(data.product);
          setCategory(data.category);
          setSelectedImage(data.product.images[0] || '');
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariantId(data.product.variants[0].id);
            if (data.product.variants[0].image) {
              setSelectedImage(data.product.variants[0].image);
            }
          }
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0]);
          }
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
        } else {
          setError(data.error || 'Không tìm thấy sản phẩm');
        }
      } catch {
        setError('Lỗi khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const selectedVariant = product.variants?.find(v => v.id === selectedVariantId);
    const res = addToCart(product, quantity, {
      unit: selectedUnit,
      unitQuantity: quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantImage: selectedVariant?.image,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    });
    setNotification(res.message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const selectedVariant = product.variants?.find(v => v.id === selectedVariantId);
    addToCart(product, quantity, {
      unit: selectedUnit,
      unitQuantity: quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantImage: selectedVariant?.image,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    });
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 flex-1 flex items-center justify-center">
          <div className="text-zinc-500 font-medium text-sm animate-pulse">Đang tải thông tin sản phẩm...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500" />
          <h2 className="text-xl font-bold text-zinc-900">{error || 'Sản phẩm không khả dụng'}</h2>
          <Link href="/" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">
            Quay về trang chủ
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32 sm:pb-8 flex-1 w-full">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
          <Link href="/" className="hover:text-rose-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('nav_home')}
          </Link>
          <span>/</span>
          {category && (
            <Link href={`/?category=${category.id}`} className="hover:text-rose-600">
              {isLao && category.nameLao ? category.nameLao : category.name}
            </Link>
          )}
          {product.subCategoryName && (
            <>
              <span>/</span>
              <span className="text-zinc-600 font-medium">
                {isLao && product.subCategoryNameLao ? product.subCategoryNameLao : product.subCategoryName}
              </span>
            </>
          )}
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate max-w-xs">
            {isLao && product.nameLao ? product.nameLao : product.name}
          </span>
        </div>

        {/* Product Layout */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-square w-full rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/70 relative">
                <img
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {isOutOfStock ? (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {t('out_of_stock')}
                  </div>
                ) : isLowStock ? (
                  <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {t('in_stock')} {product.stock}
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {t('in_stock')} ({product.stock})
                  </div>
                )}
              </div>

              {/* Multi-image Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition ${
                        selectedImage === img ? 'border-rose-600 scale-95' : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {product.brand && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-900 text-white shadow-xs">
                      {product.brand}
                    </span>
                  )}
                  {category && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                      {isLao && category.nameLao ? category.nameLao : category.name}
                    </span>
                  )}
                  {product.subCategoryName && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                      {isLao && product.subCategoryNameLao ? product.subCategoryNameLao : product.subCategoryName}
                    </span>
                  )}
                  <span className="text-xs text-zinc-400">{t('pd_sku')} {product.sku}</span>
                </div>

                <h1 className="text-xl sm:text-3xl font-black text-zinc-900 leading-snug">
                  {isLao && product.nameLao ? product.nameLao : product.name}
                </h1>

                {/* 2 Bảng Giá: Giá Lẻ & Giá Sỉ */}
                {(() => {
                  const activeVariant = product.variants?.find(v => v.id === selectedVariantId) || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
                  
                  const activeRetailPrice = activeVariant?.price && activeVariant.price > 0 
                    ? activeVariant.price 
                    : product.price;
                  const activeWholesalePrice = activeVariant?.wholesalePrice && activeVariant.wholesalePrice > 0
                    ? activeVariant.wholesalePrice
                    : (product.wholesalePrice !== undefined && product.wholesalePrice > 0 ? product.wholesalePrice : Math.round(activeRetailPrice * 0.8));

                  const activeRetailTHB = activeVariant?.priceTHB && activeVariant.priceTHB > 0
                    ? activeVariant.priceTHB
                    : (product.priceTHB && product.priceTHB > 0 ? product.priceTHB : null);
                  const activeWholesaleTHB = activeVariant?.wholesalePriceTHB && activeVariant.wholesalePriceTHB > 0
                    ? activeVariant.wholesalePriceTHB
                    : (product.wholesalePriceTHB && product.wholesalePriceTHB > 0 ? product.wholesalePriceTHB : null);

                  const isWholesaleActive = customerMode === 'WHOLESALE';

                  if (isWholesaleActive) {
                    const profit = Math.max(0, activeRetailPrice - activeWholesalePrice);
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-2.5 bg-amber-500/15 rounded-xl border border-amber-500/30 text-xs text-amber-950 font-bold">
                          <span className="text-sm">⚡</span>
                          <span>
                            {user?.role === 'ADMIN' ? '👑 Boss Hải (Quản trị): Xem toàn bộ Giá Sỉ & Giá Lẻ' :
                             user?.role === 'MANAGER' ? '💼 Quản Lý Cửa Hàng: Xem toàn bộ Giá Sỉ & Giá Lẻ' :
                             user?.role === 'STAFF' ? '👔 Nhân Viên Bán Hàng: Xem toàn bộ Giá Sỉ & Giá Lẻ' :
                             (isLao ? 'ບັນຊີລູກຄ້າຂາຍສົ່ງ: ທ່ານໄດ້ຮັບສິດເບິ່ງທັງໝົດ ລາຄາສົ່ງ ແລະ ລາຄາຍ່ອຍ' : 'Tài khoản Khách Sỉ: Bạn được xem toàn bộ Giá Sỉ và Giá Bán Lẻ')}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Card 1: Giá Sỉ */}
                          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 ring-2 ring-amber-500/20 space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                              <span className="flex items-center gap-1.5 text-amber-900 font-bold">
                                <Boxes className="w-4 h-4 text-amber-600" />
                                <span>{isLao ? 'ລາຄາຂາຍສົ່ງ (ນຳໃຊ້)' : 'Giá Bán Sỉ (Áp dụng mua)'} ⚡</span>
                              </span>
                              <span className="text-[10px] bg-amber-500 text-amber-950 px-2 py-0.5 rounded-full font-black">
                                {isLao ? 'ລາຄາຂອງທ່ານ' : 'Giá của bạn'}
                              </span>
                            </div>
                            <div className="text-2xl font-black text-amber-600 font-mono">
                              {formatPrice(activeWholesalePrice)}
                            </div>
                            {activeWholesaleTHB ? (
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="bg-amber-500/20 text-amber-950 font-black px-2 py-0.5 rounded-md font-mono">
                                  {new Intl.NumberFormat('de-DE').format(activeWholesaleTHB)} ฿
                                </span>
                                <span className="text-[11px] text-amber-800 font-semibold">(Hỗ trợ thanh toán Baht)</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-zinc-500 italic block">
                                🔒 Chỉ thanh toán bằng Tiền Kíp
                              </span>
                            )}
                            <span className="text-[10px] text-zinc-400 font-medium block">
                              {isLao ? 'ລາຄາພິເສດສຳລັບຍົກໂຫຼ / ຕົວແທນ' : 'Dành cho đơn mua buôn / đại lý'}
                            </span>
                          </div>

                          {/* Card 2: Giá Lẻ */}
                          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                              <span className="flex items-center gap-1.5 text-zinc-700 font-bold">
                                <Tag className="w-4 h-4 text-blue-600" />
                                <span>{isLao ? 'ລາຄາຂາຍຍ່ອຍປົກກະຕິ' : 'Giá Bán Lẻ Niêm Yết'}</span>
                              </span>
                            </div>
                            <div className="text-2xl font-black text-zinc-700 font-mono">
                              {formatPrice(activeRetailPrice)}
                            </div>
                            {activeRetailTHB ? (
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="bg-zinc-200 text-zinc-800 font-bold px-2 py-0.5 rounded-md font-mono">
                                  {new Intl.NumberFormat('de-DE').format(activeRetailTHB)} ฿
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-zinc-400 italic block">
                                🔒 Chỉ thanh toán bằng Tiền Kíp
                              </span>
                            )}
                            {profit > 0 && (
                              <span className="text-[11px] text-emerald-600 font-bold block">
                                {isLao ? `ກຳໄລຂາຍຍ່ອຍ: +${formatPrice(profit)}` : `Lợi nhuận bán lẻ: +${formatPrice(profit)}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Khách lẻ & khách vãng lai: CHỈ XEM GIÁ LẺ (BỊ GIỚI HẠN)
                  return (
                    <div className="space-y-2">
                      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                        <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 mb-1">
                          <span className="flex items-center gap-1.5 text-zinc-700 font-medium">
                            <Tag className="w-4 h-4 text-blue-600" />
                            <span>{t('pd_status')} {isLao ? 'ລາຄາຂາຍ' : 'Giá bán'}</span>
                          </span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">
                          {formatPrice(activeRetailPrice)}
                        </div>
                        {activeRetailTHB ? (
                          <div className="text-xs text-amber-900 font-bold mt-1.5 flex items-center gap-1.5">
                            <span className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded-lg border border-amber-300 font-mono">
                              {new Intl.NumberFormat('de-DE').format(activeRetailTHB)} ฿
                            </span>
                            <span className="text-[11px] text-zinc-500 font-normal">
                              ({isLao ? 'ຮັບຊຳລະເງິນບາດ' : 'Có hỗ trợ thanh toán Baht'})
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-500 font-medium mt-1.5 flex items-center gap-1.5">
                            <span className="bg-zinc-200/80 text-zinc-700 px-2.5 py-0.5 rounded-lg text-[11px]">
                              🔒 Chỉ thanh toán bằng Tiền Kíp Lào (Không hỗ trợ Baht)
                            </span>
                          </div>
                        )}
                      </div>
                      {!hasFullPriceAccess && (
                        <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-center justify-between gap-2 text-xs">
                          <span className="text-[11px] text-amber-900 font-medium">
                            {isLao ? '⚡ ທ່ານຕ້ອງການຊື້ຍົກໂຫຼ ຫຼື ລາຄາສົ່ງ?' : '⚡ Bạn là đại lý hoặc mua buôn số lượng lớn?'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthModalMode('login');
                              setIsAuthModalOpen(true);
                            }}
                            className="text-[11px] font-black text-amber-800 hover:text-amber-950 underline flex-shrink-0"
                          >
                            {isLao ? 'ເຂົ້າສູ່ລະບົບລູກຄ້າຂາຍສົ່ງ ⚡' : 'Đăng nhập Khách Sỉ ⚡'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* NỘI BỘ (Quản Lý & Nhân Viên & Admin): Không có mục mua hàng */}
                {user && (user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'STAFF') ? (
                  <div className="mt-4 p-4 rounded-2xl bg-zinc-900 text-white space-y-3 border border-zinc-800 shadow-lg animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold text-amber-400 text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{user.role === 'ADMIN' ? '👑 Boss Hải (Quản trị)' : user.role === 'MANAGER' ? '💼 Quản Lý Cửa Hàng' : '👔 Nhân Viên Bán Hàng'}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Tài khoản nội bộ không sử dụng chức năng mua hàng. Bạn có thể <strong>sửa thông tin món</strong> hoặc chuyển sang <strong>bàn nhận order</strong>:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <Link
                        href="/admin/products"
                        className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center transition flex items-center justify-center gap-2 shadow-md active:scale-95"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>✏️ Quản Lý / Sửa Món Này</span>
                      </Link>
                      <Link
                        href="/admin/orders"
                        className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center transition flex items-center justify-center gap-2 shadow-md active:scale-95"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>📋 Đến Bàn Nhận Order</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Phân loại biến thể Shopee style */}
                    {product.variants && product.variants.length > 0 ? (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-rose-500" />
                            <span>{isLao ? 'ເລືອກແບບ / ປະເພດ:' : 'Phân loại:'}</span>
                          </span>
                          {(() => {
                            const activeVar = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
                            return activeVar ? (
                              <span className="text-rose-600 font-extrabold text-[11px] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                {activeVar.name}
                              </span>
                            ) : null;
                          })()}
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {product.variants.map((v) => {
                            const isSelected = (selectedVariantId || product.variants![0].id) === v.id;
                            const thumb = v.image || product.images[0];
                            const vPrice = customerMode === 'WHOLESALE' && v.wholesalePrice && v.wholesalePrice > 0
                              ? v.wholesalePrice
                              : (v.price && v.price > 0 ? v.price : product.price);
                            const vPriceTHB = customerMode === 'WHOLESALE' && v.wholesalePriceTHB && v.wholesalePriceTHB > 0
                              ? v.wholesalePriceTHB
                              : (v.priceTHB && v.priceTHB > 0 ? v.priceTHB : null);

                            return (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => {
                                  setSelectedVariantId(v.id);
                                  if (v.image) setSelectedImage(v.image);
                                }}
                                className={`group flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl border text-left transition active:scale-95 ${
                                  isSelected
                                    ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/25 text-rose-950 font-bold shadow-xs'
                                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/80 text-zinc-700'
                                }`}
                              >
                                {thumb ? (
                                  <img
                                    src={thumb}
                                    alt={v.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-zinc-200/80 flex-shrink-0 bg-white"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs flex-shrink-0">
                                    📦
                                  </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-bold truncate max-w-[150px] sm:max-w-[180px]">
                                    {v.name}
                                  </span>
                                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                                    <span className={isSelected ? 'text-rose-600 font-black' : 'text-zinc-600 font-semibold'}>
                                      {formatPrice(vPrice)}
                                    </span>
                                    {vPriceTHB ? (
                                      <span className="text-amber-600 font-bold">
                                        ({vPriceTHB}฿)
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] flex-shrink-0 ml-1">
                                    ✓
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Fallback cho sản phẩm cũ không có biến thể: Màu sắc & Size */}
                        {product.colors && product.colors.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                              <span className="flex items-center gap-1.5">
                                <Palette className="w-4 h-4 text-rose-500" />
                                <span>{isLao ? 'ເລືອກສີສັນ:' : 'Chọn màu sắc:'}</span>
                              </span>
                              {selectedColor && (
                                <span className="text-rose-600 font-extrabold text-[11px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                  {selectedColor}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {product.colors.map(color => {
                                const isSelected = selectedColor === color;
                                return (
                                  <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                                      isSelected
                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs ring-2 ring-zinc-400'
                                        : 'bg-white text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                                    }`}
                                  >
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                                    <span>{color}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {product.sizes && product.sizes.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                              <span className="flex items-center gap-1.5">
                                <Maximize2 className="w-4 h-4 text-blue-500" />
                                <span>{isLao ? 'ເລືອກຂະໜາດ / ປະລິມານ:' : 'Chọn kích cỡ / dung tích:'}</span>
                              </span>
                              {selectedSize && (
                                <span className="text-blue-600 font-extrabold text-[11px] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                  {selectedSize}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {product.sizes.map(size => {
                                const isSelected = selectedSize === size;
                                return (
                                  <button
                                    key={size}
                                    type="button"
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                                      isSelected
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-300 font-extrabold'
                                        : 'bg-white text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Mục Chọn Quy Cách Đóng Gói (Cái / Lốc / Hộp / Thùng) - CHỈ HIỆN CÁC Ô ĐÃ ĐƯỢC TICK CHỌN */}
                    {(() => {
                      const hasPack = product.hasPack === true;
                      const hasBox = product.hasBox === true;
                      const hasCarton = product.hasCarton === true;

                      // Nếu không tick bất kỳ quy cách nào (chỉ bán cái) thì không hiển thị bảng chọn quy cách
                      if (!hasPack && !hasBox && !hasCarton) {
                        return null;
                      }

                      const packQty = product.packQty || 6;
                      const boxQty = product.boxQty || 10;
                      const cartonQty = product.cartonQty || 50;

                      const activeVar = product.variants?.find(v => v.id === selectedVariantId) || (product.variants && product.variants[0]);
                      const baseRetail = (activeVar && activeVar.price && activeVar.price > 0) ? activeVar.price : product.price;
                      const baseWholesale = (activeVar && activeVar.wholesalePrice && activeVar.wholesalePrice > 0)
                        ? activeVar.wholesalePrice
                        : (product.wholesalePrice !== undefined && product.wholesalePrice > 0 ? product.wholesalePrice : Math.round(baseRetail * 0.8));
                      const baseUnitPrice = customerMode === 'WHOLESALE' ? baseWholesale : baseRetail;
                      const baseUnitPriceTHB = customerMode === 'WHOLESALE'
                        ? (activeVar?.wholesalePriceTHB || product.wholesalePriceTHB || null)
                        : (activeVar?.priceTHB || product.priceTHB || null);

                      const packPrice = product.packPrice && product.packPrice > 0 ? product.packPrice : baseUnitPrice * packQty;
                      const boxPrice = product.boxPrice && product.boxPrice > 0 ? product.boxPrice : baseUnitPrice * boxQty;
                      const cartonPrice = product.cartonPrice && product.cartonPrice > 0 ? product.cartonPrice : baseUnitPrice * cartonQty;

                      return (
                        <div className="space-y-2 pt-3">
                          <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Boxes className="w-4 h-4 text-amber-600" />
                              <span>{isLao ? 'ຮູບແບບການຊື້:' : 'Quy cách đóng gói:'}</span>
                            </span>
                            <span className="text-[11px] text-zinc-400 font-normal">
                              {isLao ? 'ເລືອກງ່າຍຂຶ້ນ' : 'Dễ chọn mua theo lô/thùng'}
                            </span>
                          </label>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {/* Cái - Luôn có */}
                            <button
                              type="button"
                              onClick={() => { setSelectedUnit('PIECE'); setQuantity(1); }}
                              className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                                selectedUnit === 'PIECE'
                                  ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 text-blue-950 font-bold shadow-xs'
                                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-black">{isLao ? 'ອັນ (Cái)' : 'Cái'}</span>
                                <span className="text-[10px] text-zinc-400">x1</span>
                              </div>
                              <p className="text-[11px] font-mono font-bold text-blue-600 mt-1">
                                {formatPrice(baseUnitPrice)}
                              </p>
                              <span className="text-[9px] text-zinc-500 font-medium">
                                {baseUnitPriceTHB ? `${baseUnitPriceTHB} ฿` : 'Chỉ nhận Kíp'}
                              </span>
                            </button>

                            {/* Lốc - Chỉ hiện nếu có tick hasPack */}
                            {hasPack && (
                              <button
                                type="button"
                                onClick={() => { setSelectedUnit('PACK'); setQuantity(1); }}
                                className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                                  selectedUnit === 'PACK'
                                    ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950 font-bold shadow-xs'
                                    : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-black">{isLao ? 'ແພັກ (Lốc)' : 'Lốc'}</span>
                                  <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.2 rounded font-bold">x{packQty}</span>
                                </div>
                                <p className="text-[11px] font-mono font-bold text-emerald-700 mt-1">
                                  {formatPrice(packPrice)}
                                </p>
                                <span className="text-[9px] text-emerald-800 font-medium">
                                  {product.packPriceTHB && product.packPriceTHB > 0 ? `${product.packPriceTHB} ฿` : 'Chỉ nhận Kíp'}
                                </span>
                              </button>
                            )}

                            {/* Hộp - Chỉ hiện nếu có tick hasBox */}
                            {hasBox && (
                              <button
                                type="button"
                                onClick={() => { setSelectedUnit('BOX'); setQuantity(1); }}
                                className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                                  selectedUnit === 'BOX'
                                    ? 'bg-purple-50/80 border-purple-600 ring-2 ring-purple-500/20 text-purple-950 font-bold shadow-xs'
                                    : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-black">{isLao ? 'ກ່ອງ (Hộp)' : 'Hộp'}</span>
                                  <span className="text-[9px] bg-purple-100 text-purple-700 px-1 py-0.2 rounded font-bold">x{boxQty}</span>
                                </div>
                                <p className="text-[11px] font-mono font-bold text-purple-700 mt-1">
                                  {formatPrice(boxPrice)}
                                </p>
                                <span className="text-[9px] text-purple-800 font-medium">
                                  {product.boxPriceTHB && product.boxPriceTHB > 0 ? `${product.boxPriceTHB} ฿` : 'Chỉ nhận Kíp'}
                                </span>
                              </button>
                            )}

                            {/* Thùng - Chỉ hiện nếu có tick hasCarton */}
                            {hasCarton && (
                              <button
                                type="button"
                                onClick={() => { setSelectedUnit('CARTON'); setQuantity(1); }}
                                className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                                  selectedUnit === 'CARTON'
                                    ? 'bg-amber-500/20 border-amber-600 ring-2 ring-amber-500/30 text-amber-950 font-black shadow-xs'
                                    : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-black">{isLao ? 'ລັງ (Thùng)' : 'Thùng ⚡'}</span>
                                  <span className="text-[9px] bg-amber-400 text-amber-950 px-1 py-0.2 rounded font-black">x{cartonQty}</span>
                                </div>
                                <p className="text-[11px] font-mono font-black text-amber-700 mt-1">
                                  {formatPrice(cartonPrice)}
                                </p>
                                <span className="text-[9px] text-amber-800 font-bold">
                                  {product.cartonPriceTHB && product.cartonPriceTHB > 0 ? `${product.cartonPriceTHB} ฿` : 'Chỉ nhận Kíp'}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Quantity & Subtotal Stepper Shopee Style */}
                    {!isOutOfStock && (() => {
                      const packQty = product.packQty || 6;
                      const boxQty = product.boxQty || 10;
                      const cartonQty = product.cartonQty || 50;
                      const multiplier = selectedUnit === 'CARTON' ? cartonQty : selectedUnit === 'BOX' ? boxQty : selectedUnit === 'PACK' ? packQty : 1;
                      const maxUnitAllowed = Math.max(1, Math.floor(product.stock / multiplier));

                      const activeVar = product.variants?.find(v => v.id === selectedVariantId) || (product.variants && product.variants[0]);
                      const baseRetail = (activeVar && activeVar.price && activeVar.price > 0) ? activeVar.price : product.price;
                      const baseWholesale = (activeVar && activeVar.wholesalePrice && activeVar.wholesalePrice > 0)
                        ? activeVar.wholesalePrice
                        : (product.wholesalePrice !== undefined && product.wholesalePrice > 0 ? product.wholesalePrice : Math.round(baseRetail * 0.8));
                      const baseUnitPrice = customerMode === 'WHOLESALE' ? baseWholesale : baseRetail;
                      const baseUnitPriceTHB = customerMode === 'WHOLESALE'
                        ? (activeVar?.wholesalePriceTHB || product.wholesalePriceTHB || null)
                        : (activeVar?.priceTHB || product.priceTHB || null);

                      let currentPricePerUnit = baseUnitPrice;
                      let currentPriceTHBPerUnit: number | null = baseUnitPriceTHB;

                      if (selectedUnit === 'PACK') {
                        currentPricePerUnit = product.packPrice && product.packPrice > 0 ? product.packPrice : baseUnitPrice * packQty;
                        currentPriceTHBPerUnit = product.packPriceTHB && product.packPriceTHB > 0 ? product.packPriceTHB : null;
                      } else if (selectedUnit === 'BOX') {
                        currentPricePerUnit = product.boxPrice && product.boxPrice > 0 ? product.boxPrice : baseUnitPrice * boxQty;
                        currentPriceTHBPerUnit = product.boxPriceTHB && product.boxPriceTHB > 0 ? product.boxPriceTHB : null;
                      } else if (selectedUnit === 'CARTON') {
                        currentPricePerUnit = product.cartonPrice && product.cartonPrice > 0 ? product.cartonPrice : baseUnitPrice * cartonQty;
                        currentPriceTHBPerUnit = product.cartonPriceTHB && product.cartonPriceTHB > 0 ? product.cartonPriceTHB : null;
                      }

                      const subtotal = currentPricePerUnit * quantity;
                      const subtotalTHB = currentPriceTHBPerUnit ? currentPriceTHBPerUnit * quantity : null;

                      const currentUnitLabel = selectedUnit === 'CARTON' ? (isLao ? 'ລັງ' : 'Thùng')
                        : selectedUnit === 'BOX' ? (isLao ? 'ກ່ອງ' : 'Hộp')
                        : selectedUnit === 'PACK' ? (isLao ? 'ແພັກ' : 'Lốc')
                        : (isLao ? 'ອັນ' : 'Cái');

                      return (
                        <div className="space-y-3 pt-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-zinc-700 block">
                              {isLao ? 'ຈຳນວນ:' : 'Số lượng:'} ({currentUnitLabel})
                            </label>
                            <span className="text-xs text-zinc-500 font-semibold">
                              {isLao ? `ທັງໝົດ ${quantity * multiplier} ອັນ` : `Tương đương ${quantity * multiplier} cái`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-3">
                              {/* Stepper [-] [ 1 ] [+] */}
                              <div className="flex items-center border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                  className="p-2 sm:p-2.5 hover:bg-zinc-100 text-zinc-600 transition"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 sm:w-12 text-center text-sm font-black text-zinc-900">{quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => setQuantity(Math.min(maxUnitAllowed, quantity + 1))}
                                  disabled={quantity >= maxUnitAllowed}
                                  className="p-2 sm:p-2.5 hover:bg-zinc-100 text-zinc-600 disabled:opacity-40 transition"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Còn Hàng Badge (Shopee style) */}
                              <div className="text-xs text-zinc-500">
                                <span className="font-semibold text-zinc-700">Còn {product.stock} sản phẩm</span>
                                <span className="text-[10px] text-emerald-700 font-black ml-1.5 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                  CÒN HÀNG
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right ml-auto">
                              <span className="text-[10px] text-zinc-400 block font-medium">{isLao ? 'ລວມມູນຄ່າ:' : 'Tạm tính:'}</span>
                              <span className="text-base sm:text-lg font-black text-blue-700 font-mono block">
                                {formatPrice(subtotal)}
                              </span>
                              {subtotalTHB && (
                                <span className="text-[11px] font-bold text-amber-700 font-mono block">
                                  ≈ {new Intl.NumberFormat('de-DE').format(subtotalTHB)} ฿
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="flex-1 py-3.5 px-6 rounded-2xl bg-zinc-100 hover:bg-blue-50 hover:text-blue-600 text-zinc-800 font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {t('add_to_cart')}
                      </button>
                      <button
                        onClick={handleBuyNow}
                        disabled={isOutOfStock}
                        className="flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {t('buy_now')}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Guarantees Box */}
              <div className="pt-6 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t('pd_guarantee_1')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>{t('pd_guarantee_2')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>{t('pd_guarantee_3')}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Description Section */}
          <div className="mt-12 pt-8 border-t border-zinc-100">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">{t('pd_description')}</h3>
            <div className="prose prose-zinc max-w-none text-zinc-700 text-sm leading-relaxed whitespace-pre-line bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
              {isLao && product.descriptionLao ? product.descriptionLao : product.description}
            </div>
          </div>

        </div>
      </main>

      {/* Mobile Sticky Bottom Action Bar (Fixed above bottom nav) */}
      {(() => {
        const activeVar = product.variants?.find(v => v.id === selectedVariantId) || (product.variants && product.variants[0]);
        const baseRetail = (activeVar && activeVar.price && activeVar.price > 0) ? activeVar.price : product.price;
        const baseWholesale = (activeVar && activeVar.wholesalePrice && activeVar.wholesalePrice > 0)
          ? activeVar.wholesalePrice
          : (product.wholesalePrice !== undefined && product.wholesalePrice > 0 ? product.wholesalePrice : Math.round(baseRetail * 0.8));
        const baseUnitPrice = customerMode === 'WHOLESALE' ? baseWholesale : baseRetail;
        const baseUnitPriceTHB = customerMode === 'WHOLESALE'
          ? (activeVar?.wholesalePriceTHB || product.wholesalePriceTHB || null)
          : (activeVar?.priceTHB || product.priceTHB || null);

        let activePrice = baseUnitPrice;
        let activePriceTHB: number | null = baseUnitPriceTHB;

        if (selectedUnit === 'PACK') {
          activePrice = product.packPrice && product.packPrice > 0 ? product.packPrice : baseUnitPrice * (product.packQty || 6);
          activePriceTHB = product.packPriceTHB && product.packPriceTHB > 0 ? product.packPriceTHB : null;
        } else if (selectedUnit === 'BOX') {
          activePrice = product.boxPrice && product.boxPrice > 0 ? product.boxPrice : baseUnitPrice * (product.boxQty || 10);
          activePriceTHB = product.boxPriceTHB && product.boxPriceTHB > 0 ? product.boxPriceTHB : null;
        } else if (selectedUnit === 'CARTON') {
          activePrice = product.cartonPrice && product.cartonPrice > 0 ? product.cartonPrice : baseUnitPrice * (product.cartonQty || 50);
          activePriceTHB = product.cartonPriceTHB && product.cartonPriceTHB > 0 ? product.cartonPriceTHB : null;
        }

        const currentUnitLabel = selectedUnit === 'CARTON' ? (isLao ? 'ລັງ' : 'Thùng')
          : selectedUnit === 'BOX' ? (isLao ? 'ກ່ອງ' : 'Hộp')
          : selectedUnit === 'PACK' ? (isLao ? 'ແພັກ' : 'Lốc')
          : (isLao ? 'ອັນ' : 'Cái');

        return (
          <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 px-3.5 py-2.5 flex items-center justify-between gap-2.5 shadow-xl">
            {/* Quick Hotline Call */}
            <a
              href="tel:02055777975"
              className="p-2.5 rounded-xl bg-emerald-50 active:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center active:scale-95 transition flex-shrink-0"
              title="Gọi tư vấn trực tiếp"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
            </a>

            {/* Active Price */}
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-base font-black font-mono leading-tight truncate ${
                  customerMode === 'WHOLESALE' ? 'text-amber-600' : 'text-blue-600'
                }`}>
                  {formatPrice(activePrice)}
                </span>
                {activePriceTHB ? (
                  <span className="text-[11px] font-bold text-amber-700 font-mono">
                    ({new Intl.NumberFormat('de-DE').format(activePriceTHB)}฿)
                  </span>
                ) : null}
                {customerMode === 'WHOLESALE' && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                    Sỉ ⚡
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400">
                /{currentUnitLabel} • {customerMode === 'WHOLESALE' ? 'Giá khách sỉ' : 'Giá khách lẻ'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="p-2.5 rounded-xl bg-zinc-100 active:bg-zinc-200 text-zinc-800 font-bold text-xs flex items-center justify-center active:scale-95 disabled:opacity-50 transition"
                title={t('add_to_cart')}
              >
                <ShoppingBag className="w-5 h-5 text-zinc-700" />
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-2.5 px-4.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 active:from-blue-700 active:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition active:scale-95 disabled:opacity-50 whitespace-nowrap"
              >
                {t('buy_now')}
              </button>
            </div>
          </div>
        );
      })()}

      <Footer />
    </div>
  );
}
