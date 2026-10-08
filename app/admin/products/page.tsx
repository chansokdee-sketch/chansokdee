'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category } from '@/lib/types';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  X, 
  Upload, 
  Check, 
  AlertCircle,
  Camera,
  Smartphone,
  Star,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    subCategoryId: '',
    brand: '',
    status: 'ACTIVE' as 'ACTIVE' | 'HIDDEN',
  });
  const [productImages, setProductImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories')
      ]);
      const [prodData, catData] = await Promise.all([prodRes.json(), catRes.json()]);

      if (prodData.products) setProducts(prodData.products);
      if (catData.categories) {
        setCategories(catData.categories);
        if (catData.categories.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: catData.categories[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    const defaultCatId = categories[0]?.id || 'cat-skincare';
    const defaultCat = categories.find(c => c.id === defaultCatId);
    const defaultSubId = defaultCat?.subCategories?.[0]?.id || '';
    setFormData({
      name: '',
      sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
      description: '',
      price: '',
      stock: '10',
      categoryId: defaultCatId,
      subCategoryId: defaultSubId,
      brand: '',
      status: 'ACTIVE',
    });
    setProductImages([]);
    setUploadError('');
    setManualUrl('');
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      description: p.description,
      price: p.price.toString(),
      stock: p.stock.toString(),
      categoryId: p.categoryId,
      subCategoryId: p.subCategoryId || '',
      brand: p.brand || '',
      status: p.status,
    });
    setProductImages(p.images && p.images.length > 0 ? [...p.images] : []);
    setUploadError('');
    setManualUrl('');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleMobileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setUploadError('');

    try {
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });

        const json = await res.json();
        if (res.ok && json.url) {
          newUrls.push(json.url);
        } else {
          setUploadError(json.error || 'Lỗi khi tải ảnh từ máy lên.');
        }
      }

      if (newUrls.length > 0) {
        setProductImages(prev => [...prev, ...newUrls]);
      }
    } catch (err) {
      console.error(err);
      setUploadError('Lỗi kết nối khi tải ảnh.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    setProductImages(prev => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim() || !manualUrl.trim().startsWith('http')) {
      setUploadError('Vui lòng nhập đường dẫn URL ảnh hợp lệ (bắt đầu bằng http/https).');
      return;
    }
    setProductImages(prev => [...prev, manualUrl.trim()]);
    setManualUrl('');
    setUploadError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    const images = productImages.length > 0
      ? productImages
      : ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop'];

    const selectedCat = categories.find(c => c.id === formData.categoryId);
    const selectedSub = selectedCat?.subCategories?.find(s => s.id === formData.subCategoryId);

    const payload = {
      name: formData.name,
      sku: formData.sku,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId: formData.categoryId,
      subCategoryId: formData.subCategoryId || undefined,
      subCategoryName: selectedSub?.name || undefined,
      subCategoryNameLao: selectedSub?.nameLao || undefined,
      brand: formData.brand.trim() || undefined,
      status: formData.status,
      images,
    };

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || 'Thao tác không thành công');
      } else {
        setIsModalOpen(false);
        fetchData();
      }
    } catch {
      setModalError('Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Không thể xóa sản phẩm này');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (p: Product) => {
    const nextStatus = p.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, status: nextStatus } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Quản Lý Sản Phẩm</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Thêm mới, sửa đổi, cập nhật giá và kiểm soát tồn kho sản phẩm
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc mã SKU..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 pl-10 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-zinc-400">Danh mục:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/50">
                <th className="py-4 px-6 font-semibold">Sản phẩm</th>
                <th className="py-4 px-4 font-semibold">Mã SKU</th>
                <th className="py-4 px-4 font-semibold">Giá bán</th>
                <th className="py-4 px-4 font-semibold">Tồn kho</th>
                <th className="py-4 px-4 font-semibold">Trạng thái</th>
                <th className="py-4 px-6 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProducts.map((p) => {
                const isHidden = p.status === 'HIDDEN';
                const isLow = p.stock <= 5;

                return (
                  <tr key={p.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=100&auto=format&fit=crop'}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-xl bg-zinc-800 border border-zinc-700/60 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-white truncate max-w-xs">{p.name}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            {p.brand && (
                              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-semibold">
                                {p.brand}
                              </span>
                            )}
                            <span className="text-[11px] text-zinc-400">
                              {categories.find(c => c.id === p.categoryId)?.name || 'Khác'}
                            </span>
                            {p.subCategoryName && (
                              <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-medium border border-rose-500/20">
                                {p.subCategoryName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-medium text-blue-400">{p.sku}</td>

                    <td className="py-4 px-4 font-bold text-emerald-400">{formatPrice(p.price)}</td>

                    <td className="py-4 px-4">
                      <span className={`font-bold ${isLow ? 'text-amber-400' : 'text-zinc-200'}`}>
                        {p.stock} chiếc
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                          isHidden
                            ? 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                        title="Bấm để ẩn hoặc hiện sản phẩm trên trang chủ"
                      >
                        {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {isHidden ? 'Đang ẩn' : 'Hiển thị'}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-lg transition"
                          title="Sửa thông tin"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-6">
              {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h2>

            {modalError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: iPhone 16 Pro Max 256GB"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Mã sản phẩm (SKU) *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="IPHONE-16-PRO"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Giá bán (VND) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="34490000"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Số lượng tồn kho *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="15"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Danh mục chính *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => {
                      const newCatId = e.target.value;
                      const catObj = categories.find(c => c.id === newCatId);
                      setFormData({ 
                        ...formData, 
                        categoryId: newCatId, 
                        subCategoryId: catObj?.subCategories?.[0]?.id || '' 
                      });
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Mục phân loại nhỏ (Subcategory)</label>
                  <select
                    value={formData.subCategoryId}
                    onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Không chọn mục nhỏ --</option>
                    {(categories.find(c => c.id === formData.categoryId)?.subCategories || []).map((s) => (
                      <option key={s.id} value={s.id}>{s.name} {s.nameLao ? `(${s.nameLao})` : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Thương hiệu (Brand)</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ví dụ: Estée Lauder, Dior, Chanel, L'Oréal..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* MOBILE PHOTO UPLOAD SECTION */}
              <div className="space-y-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Hình ảnh sản phẩm (Chụp từ điện thoại / Tải từ máy) *</span>
                  </label>
                  <span className="text-[11px] text-zinc-400 font-semibold">
                    {productImages.length} ảnh đã chọn
                  </span>
                </div>

                {/* Mobile Camera & File Picker Input */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="mobile-phone-upload"
                    className="hidden"
                    onChange={handleMobileUpload}
                  />
                  <label
                    htmlFor="mobile-phone-upload"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-emerald-900/30 transition active:scale-98"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Đang tải ảnh từ điện thoại lên hệ thống...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 text-white" />
                        <Smartphone className="w-4 h-4 text-emerald-200" />
                        <span>📸 Chụp ảnh Camera / Chọn ảnh từ máy điện thoại</span>
                      </>
                    )}
                  </label>
                  <p className="text-[10px] text-zinc-500 mt-1 text-center">
                    Bấm để chụp ảnh sản phẩm trực tiếp từ điện thoại hoặc chọn ảnh trong thư viện (hỗ trợ nhiều ảnh).
                  </p>
                </div>

                {/* Error notice */}
                {uploadError && (
                  <div className="text-xs text-red-400 bg-red-950/40 border border-red-800 p-2.5 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Image Thumbnails Preview Grid */}
                {productImages.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] text-zinc-400 font-medium">
                      Danh sách ảnh (ảnh đầu tiên có viền xanh là ảnh bìa đại diện):
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1 border border-zinc-800/80 rounded-xl bg-zinc-900/50">
                      {productImages.map((imgUrl, idx) => (
                        <div 
                          key={idx} 
                          className={`relative aspect-square rounded-xl overflow-hidden border bg-zinc-900 group ${
                            idx === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-zinc-800'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <div className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                              Ảnh bìa
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-1">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                title="Đặt làm ảnh bìa"
                                className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-xs"
                              >
                                <Star className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              title="Xóa ảnh"
                              className="p-1 rounded-lg bg-red-600 text-white hover:bg-red-500 transition shadow-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional web URL link input */}
                <details className="text-xs text-zinc-400 pt-1">
                  <summary className="cursor-pointer hover:text-zinc-300 select-none">
                    + Hoặc dán đường link ảnh web nếu có (Tùy chọn)
                  </summary>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualUrl}
                      className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl text-xs transition"
                    >
                      Thêm link
                    </button>
                  </div>
                </details>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Mô tả chi tiết sản phẩm</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả cấu hình, tính năng nổi bật..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="text-zinc-400 font-semibold">Trạng thái kinh doanh:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ACTIVE">Hiển thị bán trên trang chủ</option>
                  <option value="HIDDEN">Ẩn tạm thời (ngừng bán)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-md shadow-blue-500/20"
                >
                  {submitting ? 'Đang lưu...' : editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
