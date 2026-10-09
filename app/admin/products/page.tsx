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
  Image as ImageIcon,
  RefreshCw,
  Sparkles,
  Tag,
  DollarSign
} from 'lucide-react';

// Kho ảnh mẫu mỹ phẩm cao cấp có sẵn (1 chạm để thêm ảnh)
const PRESET_BEAUTY_IMAGES = [
  { 
    name: 'Serum Estée Lauder', 
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    name: 'Kem chống nắng La Roche-Posay', 
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    name: 'Son đỏ Dior Velvet', 
    url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    name: 'Nước hoa Chanel Coco', 
    url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    name: 'Phấn nước Cushion YSL', 
    url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    name: 'Nước hoa Dior Sauvage', 
    url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    name: 'Kem dưỡng phục hồi B5', 
    url: 'https://images.unsplash.com/photo-1608248597359-543598739d48?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    name: 'Son kem lì Black Rouge', 
    url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    name: 'Tinh dầu tóc Moroccanoil', 
    url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    name: 'Nước tẩy trang Bioderma', 
    url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    name: 'Mặt nạ ngủ môi Laneige', 
    url: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=1000&auto=format&fit=crop' 
  },
  { 
    name: 'Sữa tắm Tesori Ý', 
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop' 
  },
];

// Gợi ý nhanh các thương hiệu mỹ phẩm phổ biến
const POPULAR_BRANDS = [
  'Dior', 'Chanel', 'Estée Lauder', 'YSL', 'MAC', 
  'La Roche-Posay', 'Kiehl\'s', 'Black Rouge', 'Anessa', 'Bioderma', 'Laneige'
];

// Tỷ giá ước lượng quy đổi: 1 LAK ~ 1.15 VND (hoặc 1 VND ~ 0.87 LAK)
const RATE_LAK_TO_VND = 1.15;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'details'>('basic');

  // Form State
  const [currencyMode, setCurrencyMode] = useState<'LAK' | 'VND'>('LAK');
  const [formData, setFormData] = useState({
    name: '',
    nameLao: '',
    sku: '',
    description: '',
    descriptionLao: '',
    price: '',
    stock: '10',
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
  const [showPresets, setShowPresets] = useState(false);

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

  const generateRandomSku = () => {
    const prefix = 'NOVA';
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${rand}`;
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    const defaultCatId = categories[0]?.id || 'cat-1';
    const defaultCat = categories.find(c => c.id === defaultCatId);
    const defaultSubId = defaultCat?.subCategories?.[0]?.id || '';
    
    setFormData({
      name: '',
      nameLao: '',
      sku: generateRandomSku(),
      description: '',
      descriptionLao: '',
      price: '',
      stock: '20',
      categoryId: defaultCatId,
      subCategoryId: defaultSubId,
      brand: '',
      status: 'ACTIVE',
    });
    setCurrencyMode('LAK');
    setProductImages([]);
    setUploadError('');
    setManualUrl('');
    setModalError('');
    setActiveTab('basic');
    setShowPresets(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      nameLao: p.nameLao || '',
      sku: p.sku,
      description: p.description,
      descriptionLao: p.descriptionLao || '',
      price: p.price.toString(),
      stock: p.stock.toString(),
      categoryId: p.categoryId,
      subCategoryId: p.subCategoryId || '',
      brand: p.brand || '',
      status: p.status,
    });
    setCurrencyMode('LAK');
    setProductImages(p.images && p.images.length > 0 ? [...p.images] : []);
    setUploadError('');
    setManualUrl('');
    setModalError('');
    setActiveTab('basic');
    setShowPresets(false);
    setIsModalOpen(true);
  };

  // Upload handler (cả camera lẫn file picker)
  const handleFileUpload = async (files: FileList | null) => {
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

  const handleAddPresetImage = (url: string) => {
    if (!productImages.includes(url)) {
      setProductImages(prev => [...prev, url]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!formData.name.trim()) {
      setModalError('Vui lòng nhập tên sản phẩm.');
      setActiveTab('basic');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setModalError('Vui lòng nhập giá bán hợp lệ lớn hơn 0.');
      setActiveTab('basic');
      return;
    }

    setSubmitting(true);

    const images = productImages.length > 0
      ? productImages
      : ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop'];

    const selectedCat = categories.find(c => c.id === formData.categoryId);
    const selectedSub = selectedCat?.subCategories?.find(s => s.id === formData.subCategoryId);

    // Tính toán giá lưu vào DB (nếu nhập bằng LAK thì lưu số tiền, nếu cần có thể quy đổi)
    const rawPrice = Number(formData.price);
    const finalPrice = rawPrice;

    const payload = {
      name: formData.name.trim(),
      nameLao: formData.nameLao.trim() || undefined,
      sku: formData.sku.trim() || generateRandomSku(),
      description: formData.description.trim(),
      descriptionLao: formData.descriptionLao.trim() || undefined,
      price: finalPrice,
      stock: Number(formData.stock) || 0,
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

  const formatPriceLAK = (price: number) => {
    return new Intl.NumberFormat('lo-LA').format(price) + ' ₭';
  };

  const formatPriceVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = 
      p.name.toLowerCase().includes(q) || 
      (p.nameLao && p.nameLao.toLowerCase().includes(q)) || 
      p.sku.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q));
    const matchCat = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-white">Quản Lý Sản Phẩm & Thêm Món</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              {products.length} món
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Dành cho <strong>Boss Hải</strong> & <strong>Nhân viên</strong>: Thêm món mới, chụp ảnh từ điện thoại, đặt giá Kíp Lào / VND và quản lý tồn kho.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Thêm sản phẩm mới (Thêm món)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên (Lào/Việt), mã SKU, thương hiệu..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-zinc-400 whitespace-nowrap">Danh mục:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none focus:border-blue-500"
          >
            <option value="all">Tất cả danh mục ({products.length})</option>
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
                <th className="py-4 px-4 font-semibold">Giá bán (Kíp / VND)</th>
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
                          src={p.images[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=100&auto=format&fit=crop'}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-xl bg-zinc-800 border border-zinc-700/60 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-white truncate max-w-xs">{p.name}</h4>
                          {p.nameLao && (
                            <p className="text-[11px] text-zinc-400 truncate max-w-xs">{p.nameLao}</p>
                          )}
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {p.brand && (
                              <span className="text-[10px] bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded font-semibold border border-zinc-700">
                                {p.brand}
                              </span>
                            )}
                            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                              {categories.find(c => c.id === p.categoryId)?.name || 'Mỹ phẩm'}
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

                    <td className="py-4 px-4">
                      <div className="font-bold text-emerald-400">{formatPriceLAK(p.price)}</div>
                      <div className="text-[10px] text-zinc-500">{formatPriceVND(p.price)}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`font-bold ${isLow ? 'text-amber-400' : 'text-zinc-200'}`}>
                        {p.stock} cái
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
                          title="Sửa thông tin món"
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

      {/* ADD / EDIT PRODUCT MODAL (TỐI ƯU HOÀN TOÀN CHO ĐIỆN THOẠI & MÁY TÍNH) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 flex-shrink-0">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span>{editingProduct ? 'Chỉnh Sửa Món / Sản Phẩm' : 'Thêm Món Mới (Thêm Sản Phẩm)'}</span>
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Điền tên (Lào & Việt), giá tiền Kíp Lào và chụp ảnh trực tiếp từ điện thoại.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 pt-3 pb-2 flex-shrink-0 border-b border-zinc-800/60 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'basic' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                }`}
              >
                <span>1. Thông tin & Giá bán</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('images')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'images' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>2. Chụp ảnh điện thoại ({productImages.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'details' 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                }`}
              >
                <span>3. Mô tả song ngữ & Phân loại</span>
              </button>
            </div>

            {/* Modal Error */}
            {modalError && (
              <div className="my-2 p-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-xs flex items-center gap-2 flex-shrink-0">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Modal Body Form (Cuộn mượt mà trên điện thoại) */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 py-3 space-y-4 pr-1 text-xs">
              
              {/* TAB 1: THÔNG TIN CƠ BẢN & GIÁ BÁN */}
              {activeTab === 'basic' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-zinc-300 font-bold mb-1">
                        Tên sản phẩm (Tiếng Việt) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ví dụ: Son Thỏi Dior Rouge Forever"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-amber-300 font-bold mb-1">
                        Tên sản phẩm tiếng Lào (ຊື່ສິນຄ້າພາສາລາວ)
                      </label>
                      <input
                        type="text"
                        value={formData.nameLao}
                        onChange={(e) => setFormData({ ...formData, nameLao: e.target.value })}
                        placeholder="ຕົວຢ່າງ: ລິບສະຕິກ Dior Rouge Forever"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Giá bán & Tiền tệ */}
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-zinc-200 font-bold flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span>Giá bán sản phẩm *</span>
                      </label>
                      <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setCurrencyMode('LAK')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition ${
                            currencyMode === 'LAK' 
                              ? 'bg-emerald-600 text-white' 
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          🇱🇦 Kíp Lào (₭)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrencyMode('VND')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition ${
                            currencyMode === 'VND' 
                              ? 'bg-blue-600 text-white' 
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          🇻🇳 VND (₫)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder={currencyMode === 'LAK' ? 'Ví dụ: 250000' : 'Ví dụ: 300000'}
                          className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">
                          {currencyMode === 'LAK' ? '₭ LAK' : '₫ VND'}
                        </span>
                      </div>

                      {formData.price && Number(formData.price) > 0 && (
                        <div className="text-[11px] text-zinc-400 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800 leading-relaxed">
                          <p>
                            Quy đổi tham khảo: <strong className="text-white">
                              {currencyMode === 'LAK' 
                                ? formatPriceVND(Number(formData.price))
                                : formatPriceLAK(Number(formData.price))
                              }
                            </strong>
                          </p>
                          <span className="text-[10px] text-zinc-500">(Khách hàng tại Lào sẽ thấy giá theo đơn vị Kíp ₭)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-zinc-400 font-semibold">Mã sản phẩm (SKU)</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, sku: generateRandomSku() })}
                          className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>Sinh mã mới</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-blue-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Số lượng tồn kho</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="20"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Trạng thái bán</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-semibold"
                      >
                        <option value="ACTIVE">Hiển thị bán</option>
                        <option value="HIDDEN">Ẩn tạm thời</option>
                      </select>
                    </div>
                  </div>

                  {/* Nút gợi ý chuyển tab */}
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[11px] text-zinc-500">Bước tiếp theo: Tải ảnh hoặc chụp từ camera</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('images')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Sang bước chọn ảnh ➔</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: CHỤP ẢNH TỪ ĐIỆN THOẠI & KHO ẢNH MẪU */}
              {activeTab === 'images' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-2">
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <span>Tải ảnh lên hệ thống ({productImages.length} ảnh đã chọn)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPresets(!showPresets)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{showPresets ? 'Đóng kho ảnh mẫu' : 'Kho ảnh mẫu có sẵn'}</span>
                      </button>
                    </div>

                    {/* NÚT CHỤP ẢNH CAMERA & CHỌN TỪ THƯ VIỆN ĐIỆN THOẠI */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* 1. Camera trực tiếp (Điện thoại tự bật camera sau) */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          id="mobile-camera-capture"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files)}
                        />
                        <label
                          htmlFor="mobile-camera-capture"
                          className="w-full py-3.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/30 transition active:scale-98 text-center"
                        >
                          <Camera className="w-4 h-4" />
                          <span>📸 Chụp ảnh Camera ngay</span>
                        </label>
                      </div>

                      {/* 2. Chọn từ thư viện ảnh máy / điện thoại */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          id="mobile-gallery-upload"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files)}
                        />
                        <label
                          htmlFor="mobile-gallery-upload"
                          className="w-full py-3.5 px-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 text-center"
                        >
                          <Smartphone className="w-4 h-4 text-blue-400" />
                          <span>📁 Chọn ảnh từ bộ nhớ máy</span>
                        </label>
                      </div>
                    </div>

                    {uploadingImage && (
                      <div className="p-3 bg-blue-950/40 border border-blue-800/80 rounded-xl text-xs text-blue-300 flex items-center gap-2 animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        <span>Đang xử lý tải ảnh từ điện thoại lên hệ thống...</span>
                      </div>
                    )}

                    {uploadError && (
                      <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-xs text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}

                    {/* KHO ẢNH MẪU CÓ SẴN (PRESETS) */}
                    {showPresets && (
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
                        <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Bấm 1 chạm vào ảnh mẫu dưới đây để thêm ngay vào món:</span>
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                          {PRESET_BEAUTY_IMAGES.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAddPresetImage(preset.url)}
                              className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-700 hover:border-amber-400 transition"
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-1 text-[9px] text-white font-semibold">
                                + Thêm ảnh
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DANH SÁCH ẢNH ĐÃ CHỌN CHO SẢN PHẨM */}
                    {productImages.length > 0 ? (
                      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                        <p className="text-[11px] text-zinc-400 font-semibold">
                          Ảnh của sản phẩm (ảnh có viền xanh là ảnh bìa chính):
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto p-1 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                          {productImages.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className={`relative aspect-square rounded-xl overflow-hidden border bg-zinc-900 group ${
                                idx === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/40' : 'border-zinc-800'
                              }`}
                            >
                              <img src={imgUrl} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
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
                                    title="Đặt làm ảnh bìa chính"
                                    className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition"
                                  >
                                    <Star className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  title="Xóa ảnh này"
                                  className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 text-[11px]">
                        Chưa có ảnh nào. Bạn hãy bấm nút chụp ảnh hoặc chọn ảnh mẫu ở trên nhé!
                      </div>
                    )}

                    {/* Dán link URL phụ */}
                    <div className="pt-1">
                      <details className="text-xs text-zinc-500">
                        <summary className="cursor-pointer hover:text-zinc-400 select-none">
                          + Hoặc dán đường link ảnh web nếu có (Tùy chọn)
                        </summary>
                        <div className="mt-2 flex gap-2">
                          <input
                            type="url"
                            placeholder="https://..."
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
                  </div>
                </div>
              )}

              {/* TAB 3: MÔ TẢ SONG NGỮ & PHÂN LOẠI */}
              {activeTab === 'details' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Mục phân loại nhỏ</label>
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
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Thương hiệu (Brand)</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Ví dụ: Dior, Chanel, Estée Lauder..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] text-zinc-500">Gợi ý nhanh:</span>
                      {POPULAR_BRANDS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormData({ ...formData, brand: b })}
                          className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-lg border border-zinc-700 transition"
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Mô tả sản phẩm (Tiếng Việt)</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Mô tả công dụng, thành phần, cách dùng..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-300 font-semibold mb-1">Mô tả chi tiết tiếng Lào (ລາຍລະອຽດພາສາລາວ)</label>
                    <textarea
                      rows={2}
                      value={formData.descriptionLao}
                      onChange={(e) => setFormData({ ...formData, descriptionLao: e.target.value })}
                      placeholder="ລາຍລະອຽດສິນຄ້າ, ວິທີໃຊ້, ຄຸນປະໂຫຍດ..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions Footer */}
              <div className="pt-4 flex items-center justify-between border-t border-zinc-800 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-lg shadow-blue-600/30 active:scale-95 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{editingProduct ? 'Lưu thay đổi' : 'Lưu sản phẩm mới'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
