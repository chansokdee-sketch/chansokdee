'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
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
  Sparkles
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addToCart, setIsCartOpen, customerMode } = useCart();
  const { t, formatPrice, isLao } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
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
    const res = addToCart(product, quantity);
    setNotification(res.message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
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
                  const wholesalePrice = product.wholesalePrice !== undefined && product.wholesalePrice > 0
                    ? product.wholesalePrice
                    : Math.round(product.price * 0.8);
                  const minQty = product.minWholesaleQty || 3;
                  const isWholesaleActive = customerMode === 'WHOLESALE' || quantity >= minQty;

                  return (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Bảng giá lẻ */}
                        <div className={`p-3.5 rounded-2xl border transition ${
                          !isWholesaleActive 
                            ? 'bg-blue-50/60 border-blue-200 ring-2 ring-blue-500/20' 
                            : 'bg-zinc-50 border-zinc-200/80 opacity-80'
                        }`}>
                          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 mb-1">
                            <span className="flex items-center gap-1 text-zinc-700">
                              <Tag className="w-3.5 h-3.5 text-blue-600" />
                              <span>Giá bán lẻ (ຍ່ອຍ)</span>
                            </span>
                            {!isWholesaleActive && (
                              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                                Đang chọn
                              </span>
                            )}
                          </div>
                          <div className="text-xl sm:text-2xl font-black text-blue-700 font-mono">
                            {formatPrice(product.price)}
                          </div>
                          <span className="text-[10px] text-zinc-400">Đơn giá khi mua 1-{minQty - 1} cái</span>
                        </div>

                        {/* Bảng giá sỉ */}
                        <div className={`p-3.5 rounded-2xl border transition ${
                          isWholesaleActive 
                            ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/30' 
                            : 'bg-zinc-50 border-zinc-200/80'
                        }`}>
                          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 mb-1">
                            <span className="flex items-center gap-1 text-amber-900 font-bold">
                              <Boxes className="w-3.5 h-3.5 text-amber-600" />
                              <span>Giá bán sỉ (ສົ່ງ) ⚡</span>
                            </span>
                            {isWholesaleActive && (
                              <span className="text-[10px] bg-amber-500 text-amber-950 px-2 py-0.5 rounded-full font-black">
                                Áp dụng giá sỉ!
                              </span>
                            )}
                          </div>
                          <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
                            {formatPrice(wholesalePrice)}
                          </div>
                          <span className="text-[10px] text-amber-700/80 font-medium">
                            Áp dụng khi mua từ ≥ {minQty} cái hoặc khách sỉ
                          </span>
                        </div>
                      </div>

                      {/* Thông báo ưu đãi sỉ khi tăng số lượng */}
                      {quantity >= minQty && (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-semibold">
                          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>
                            🎉 Đang mua {quantity} cái: Tự động tính theo <strong>Giá bán sỉ ({formatPrice(wholesalePrice)}/cái)</strong>!
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Quantity selector */}
                {!isOutOfStock && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-zinc-700 block">{t('pd_quantity')}</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-zinc-200 rounded-xl bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2.5 hover:bg-zinc-100 text-zinc-600 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-sm font-bold text-zinc-900">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          disabled={quantity >= product.stock}
                          className="p-2.5 hover:bg-zinc-100 text-zinc-600 disabled:opacity-40 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs text-zinc-500">
                        ({t('pd_remaining', { stock: product.stock })})
                      </span>
                    </div>
                  </div>
                )}

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
      <div className="sm:hidden fixed bottom-12 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 px-4 py-2 flex items-center justify-between gap-3 shadow-xl">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-zinc-500 font-medium">NovaStore</span>
          <span className="text-sm font-black text-blue-600 truncate">{formatPrice(product.price)}</span>
        </div>
        <div className="flex items-center gap-2">
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
            className="py-2.5 px-5 rounded-xl bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-md transition active:scale-95 disabled:opacity-50"
          >
            {t('buy_now')}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
