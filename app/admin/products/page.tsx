'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Check, 
  AlertCircle,
  Camera,
  Smartphone,
  Star,
  Loader2,
  RefreshCw,
  Sparkles,
  DollarSign,
  Tag,
  Boxes,
  FolderTree,
  Palette
} from 'lucide-react';

// Kho ảnh mẫu mỹ phẩm cao cấp có sẵn (1 chạm để thêm ảnh nhanh)
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State (Hỗ trợ 2 bảng giá: Giá lẻ & Giá sỉ bằng Kíp Lào ₭)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',              // Giá bán lẻ (Khách lẻ)
    wholesalePrice: '',     // Giá bán sỉ (Khách sỉ)
    minWholesaleQty: '3',   // Số lượng tối thiểu tính giá sỉ
    packQty: '6',           // Số cái / Lốc (mặc định 6)
    boxQty: '10',           // Số cái / Hộp (mặc định 10)
    cartonQty: '50',        // Số cái / Thùng (mặc định 50)
    packPrice: '',          // Giá bán Lốc (tùy chọn)
    boxPrice: '',           // Giá bán Hộp (tùy chọn)
    cartonPrice: '',        // Giá bán Thùng (tùy chọn)
    colors: '',             // Chuỗi màu sắc phân cách bằng dấu phẩy
    sizes: '',              // Chuỗi kích cỡ phân cách bằng dấu phẩy
    stock: '20',
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

  // Quick inline category creator
  const [showInlineCatModal, setShowInlineCatModal] = useState(false);
  const [inlineCatName, setInlineCatName] = useState('');
  const [inlineCatNameLao, setInlineCatNameLao] = useState('');
  const [inlineCatSubStr, setInlineCatSubStr] = useState('');
  const [inlineCatLoading, setInlineCatLoading] = useState(false);
  const [inlineCatError, setInlineCatError] = useState('');

  const handleCreateInlineCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineCatName.trim()) return;
    setInlineCatLoading(true);
    setInlineCatError('');
    try {
      const subs = inlineCatSubStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map((subName, idx) => ({
          id: `sub-${Date.now()}-${idx}`,
          name: subName,
          slug: subName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
          categoryId: '',
        }));

      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inlineCatName.trim(),
          nameLao: inlineCatNameLao.trim(),
          icon: '🌸',
          subCategories: subs,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInlineCatError(data.error || 'Lỗi khi tạo danh mục');
      } else {
        setCategories(prev => [...prev, data.category]);
        setFormData(prev => ({
          ...prev,
          categoryId: data.category.id,
          subCategoryId: data.category.subCategories?.[0]?.id || '',
        }));
        setInlineCatName('');
        setInlineCatNameLao('');
        setInlineCatSubStr('');
        setShowInlineCatModal(false);
      }
    } catch {
      setInlineCatError('Lỗi kết nối máy chủ');
    } finally {
      setInlineCatLoading(false);
    }
  };

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
      sku: generateRandomSku(),
      description: '',
      price: '',
      wholesalePrice: '',
      minWholesaleQty: '3',
      packQty: '6',
      boxQty: '10',
      cartonQty: '50',
      packPrice: '',
      boxPrice: '',
      cartonPrice: '',
      colors: '',
      sizes: '',
      stock: '20',
      categoryId: defaultCatId,
      subCategoryId: defaultSubId,
      brand: '',
      status: 'ACTIVE',
    });
    setProductImages([]);
    setUploadError('');
    setManualUrl('');
    setModalError('');
    setShowPresets(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    const retail = p.price;
    const wholesale = p.wholesalePrice !== undefined && p.wholesalePrice > 0 
      ? p.wholesalePrice 
      : Math.round(retail * 0.8);
    const minQty = p.minWholesaleQty || 3;

    setFormData({
      name: p.nameLao || p.name,
      sku: p.sku,
      description: p.descriptionLao || p.description,
      price: retail.toString(),
      wholesalePrice: wholesale.toString(),
      minWholesaleQty: minQty.toString(),
      packQty: (p.packQty || 6).toString(),
      boxQty: (p.boxQty || 10).toString(),
      cartonQty: (p.cartonQty || 50).toString(),
      packPrice: p.packPrice ? p.packPrice.toString() : '',
      boxPrice: p.boxPrice ? p.boxPrice.toString() : '',
      cartonPrice: p.cartonPrice ? p.cartonPrice.toString() : '',
      colors: p.colors ? p.colors.join(', ') : '',
      sizes: p.sizes ? p.sizes.join(', ') : '',
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
    setShowPresets(false);
    setIsModalOpen(true);
  };

  // Upload handler (Camera điện thoại & File picker)
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
          setUploadError(json.error || 'Lỗi khi tải ảnh lên.');
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

  // Tự động tính giá sỉ gợi ý (giảm 20%) khi nhập giá lẻ
  const handleApplySuggestedWholesale = () => {
    const retail = Number(formData.price);
    if (retail > 0) {
      const suggested = Math.round(retail * 0.8 / 1000) * 1000;
      setFormData(prev => ({ ...prev, wholesalePrice: suggested.toString() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!formData.name.trim()) {
      setModalError('Vui lòng nhập tên món / sản phẩm (ກະລຸນາໃສ່ຊື່ສິນຄ້າ)');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setModalError('Vui lòng nhập giá bán lẻ hợp lệ (ກະລຸນາໃສ່ລາຄາຂາຍຍ່ອຍ)');
      return;
    }

    const retailPrice = Number(formData.price);
    const wholesalePrice = formData.wholesalePrice && Number(formData.wholesalePrice) > 0
      ? Number(formData.wholesalePrice)
      : Math.round(retailPrice * 0.8);
    const minWholesaleQty = Math.max(1, Number(formData.minWholesaleQty) || 3);

    const parsedColors = formData.colors
      ? formData.colors.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;
    const parsedSizes = formData.sizes
      ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    setSubmitting(true);

    const images = productImages.length > 0
      ? productImages
      : ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop'];

    const selectedCat = categories.find(c => c.id === formData.categoryId);
    const selectedSub = selectedCat?.subCategories?.find(s => s.id === formData.subCategoryId);

    const payload = {
      name: formData.name.trim(),
      nameLao: formData.name.trim(),
      sku: formData.sku.trim() || generateRandomSku(),
      description: formData.description.trim(),
      descriptionLao: formData.description.trim(),
      price: retailPrice,
      wholesalePrice,
      minWholesaleQty,
      packQty: Number(formData.packQty) || 6,
      boxQty: Number(formData.boxQty) || 10,
      cartonQty: Number(formData.cartonQty) || 50,
      packPrice: formData.packPrice && Number(formData.packPrice) > 0 ? Number(formData.packPrice) : undefined,
      boxPrice: formData.boxPrice && Number(formData.boxPrice) > 0 ? Number(formData.boxPrice) : undefined,
      cartonPrice: formData.cartonPrice && Number(formData.cartonPrice) > 0 ? Number(formData.cartonPrice) : undefined,
      colors: parsedColors && parsedColors.length > 0 ? parsedColors : undefined,
      sizes: parsedSizes && parsedSizes.length > 0 ? parsedSizes : undefined,
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
            <h1 className="text-2xl font-black text-white">Quản Lý Sản Phẩm & 2 Bảng Giá (Sỉ / Lẻ)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              {products.length} món
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Bán hàng tại Lào: Quản lý <strong>Giá bán lẻ (ລາຄາຂາຍຍ່ອຍ)</strong> và <strong>Giá bán sỉ (ລາຄາຂາຍສົ່ງ)</strong>, chụp ảnh camera và quản lý tồn kho.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/categories"
            className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 border border-zinc-700 active:scale-95 shadow-sm"
          >
            <FolderTree className="w-4 h-4 text-blue-400" />
            <span>Danh mục ({categories.length})</span>
          </Link>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Thêm món mới (ເພີ່ມສິນຄ້າ)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, mã SKU, thương hiệu..."
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

      {/* Floating Action Button for Mobile: Quick Add Product */}
      <button
        onClick={openCreateModal}
        className="md:hidden fixed bottom-18 right-4 z-40 p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl shadow-blue-600/50 flex items-center gap-2 font-bold text-xs active:scale-95 transition"
        title="Thêm sản phẩm mới"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
        <span className="pr-1">Thêm món</span>
      </button>

      {/* 1. Mobile Cards View for Products (md:hidden) */}
      <div className="md:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-3xl text-zinc-400 text-xs">
            Không tìm thấy sản phẩm nào
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isHidden = p.status === 'HIDDEN';
            const isLow = p.stock <= 5;
            const wholesalePrice = p.wholesalePrice !== undefined && p.wholesalePrice > 0 
              ? p.wholesalePrice 
              : Math.round(p.price * 0.8);

            return (
              <div 
                key={p.id}
                className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 shadow-md"
              >
                {/* Header: Ảnh + Tên + Danh mục */}
                <div className="flex gap-3">
                  <img
                    src={p.images[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=150&auto=format&fit=crop'}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded-xl bg-zinc-800 border border-zinc-700/60 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-xs line-clamp-2 leading-snug">{p.name}</h4>
                    {p.nameLao && p.nameLao !== p.name && (
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{p.nameLao}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[9px] font-mono bg-zinc-800 text-blue-400 px-1.5 py-0.5 rounded border border-zinc-700">
                        {p.sku}
                      </span>
                      {p.brand && (
                        <span className="text-[9px] bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded font-semibold border border-zinc-700">
                          {p.brand}
                        </span>
                      )}
                      <span className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                        {categories.find(c => c.id === p.categoryId)?.name || 'Mỹ phẩm'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2 Bảng Giá: Giá Lẻ & Giá Sỉ */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-zinc-950/70 rounded-xl border border-zinc-800/80">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-400" />
                      <span>Giá lẻ (ຍ່ອຍ)</span>
                    </span>
                    <div className="font-bold text-emerald-400 text-xs font-mono">
                      {formatPriceLAK(p.price)}
                    </div>
                  </div>

                  <div className="space-y-0.5 border-l border-zinc-800 pl-2">
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                      <Boxes className="w-3 h-3 text-amber-400" />
                      <span>Giá sỉ ⚡ (ສົ່ງ)</span>
                    </span>
                    <div className="font-bold text-amber-400 text-xs font-mono">
                      {formatPriceLAK(wholesalePrice)}
                    </div>
                  </div>
                </div>

                {/* Footer: Tồn kho + Trạng thái ẩn/hiện + Thao tác */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/70">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isLow ? 'text-amber-400' : 'text-zinc-300'}`}>
                      Kho: {p.stock}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                        isHidden
                          ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {isHidden ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                      <span>{isHidden ? 'Ẩn' : 'Hiện'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1 active:scale-95"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition active:scale-95"
                      title="Xóa món"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Desktop Table Danh Sách Sản Phẩm Với 2 Bảng Giá (hidden md:block) */}
      <div className="hidden md:block bg-zinc-900 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/50">
                <th className="py-4 px-6 font-semibold">Sản phẩm (ສິນຄ້າ)</th>
                <th className="py-4 px-4 font-semibold">Mã SKU</th>
                <th className="py-4 px-4 font-semibold text-emerald-400">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Giá bán lẻ (ຍ່ອຍ)</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-semibold text-amber-400">
                  <div className="flex items-center gap-1">
                    <Boxes className="w-3 h-3" />
                    <span>Giá bán sỉ (ສົ່ງ)</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-semibold">Tồn kho</th>
                <th className="py-4 px-4 font-semibold">Trạng thái</th>
                <th className="py-4 px-6 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProducts.map((p) => {
                const isHidden = p.status === 'HIDDEN';
                const isLow = p.stock <= 5;
                const wholesalePrice = p.wholesalePrice !== undefined && p.wholesalePrice > 0 
                  ? p.wholesalePrice 
                  : Math.round(p.price * 0.8);
                const minQty = p.minWholesaleQty || 3;

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
                          {p.nameLao && p.nameLao !== p.name && (
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

                    {/* Cột Giá Bán Lẻ */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-emerald-400 text-sm font-mono">{formatPriceLAK(p.price)}</div>
                      <span className="text-[10px] text-zinc-500">Khách lẻ / 1 cái</span>
                    </td>

                    {/* Cột Giá Bán Sỉ */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-amber-400 text-sm font-mono">{formatPriceLAK(wholesalePrice)}</div>
                      <span className="text-[10px] text-amber-300/80 bg-amber-500/10 px-1.5 py-0.2 rounded font-medium border border-amber-500/20 inline-block">
                        Khách sỉ ⚡
                      </span>
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
                          title="Sửa thông tin món và 2 bảng giá"
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

      {/* MODAL THÊM / SỬA SẢN PHẨM CÓ 2 BẢNG GIÁ (SỈ & LẺ) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800 flex-shrink-0">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span>{editingProduct ? 'Chỉnh Sửa Món & 2 Bảng Giá (Sỉ / Lẻ)' : 'Thêm Món Mới (Thiết Lập 2 Bảng Giá)'}</span>
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Bán hàng tại Lào: Nhập <strong>Giá bán lẻ</strong>, <strong>Giá bán sỉ (buôn)</strong> và chụp ảnh trực tiếp từ điện thoại.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {modalError && (
              <div className="mt-3 p-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-xs flex items-center gap-2 flex-shrink-0">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* FORM 1 TRANG DUY NHẤT */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 py-4 space-y-4 pr-1 text-xs">
              
              {/* Tên món */}
              <div>
                <label className="block text-zinc-200 font-bold mb-1">
                  Tên món / Sản phẩm (ຊື່ສິນຄ້າ) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Dior Rouge Forever, Serum Estée Lauder, Kem B5..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 2 BẢNG GIÁ: GIÁ LẺ & GIÁ SỈ */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Thiết lập 2 Bảng Giá Tiền Kíp Lào (₭ LAK)</span>
                  </label>
                  {formData.price && (
                    <button
                      type="button"
                      onClick={handleApplySuggestedWholesale}
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Tính tự động giá sỉ (-20%)</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Bảng giá 1: Giá bán lẻ */}
                  <div>
                    <label className="block text-emerald-400 font-bold mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span>1. Giá bán lẻ (ລາຄາຂາຍຍ່ອຍ) *</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 font-normal">Khách lẻ mua 1-2 cái</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Ví dụ: 150000"
                        className="w-full bg-zinc-900 border border-emerald-500/40 rounded-xl px-3.5 py-2.5 text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">
                        ₭ LAK
                      </span>
                    </div>
                  </div>

                  {/* Bảng giá 2: Giá bán sỉ */}
                  <div>
                    <label className="block text-amber-400 font-bold mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Boxes className="w-3.5 h-3.5" />
                        <span>2. Giá bán sỉ (ລາຄາຂາຍສົ່ງ) *</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 font-normal">Đại lý / Mua buôn</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={formData.wholesalePrice}
                        onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                        placeholder={formData.price ? `Gợi ý: ${Math.round(Number(formData.price) * 0.8)}` : 'Ví dụ: 120000'}
                        className="w-full bg-zinc-900 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-amber-400 font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">
                        ₭ LAK
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ghi chú phân loại bảng giá */}
                <div className="pt-2 border-t border-zinc-900 text-zinc-400 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Khách lẻ: Mua theo <strong>Giá bán lẻ</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Khách sỉ ⚡: Mua theo <strong>Giá bán sỉ</strong></span>
                  </span>
                </div>
              </div>

              {/* Mã SKU, Tồn kho & Trạng thái bán */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-400 font-semibold">Mã SKU</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sku: generateRandomSku() })}
                      className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Sinh mã</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-blue-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Số lượng tồn kho (cái)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="20"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Trạng thái bán</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="ACTIVE">Hiển thị bán</option>
                    <option value="HIDDEN">Ẩn tạm thời</option>
                  </select>
                </div>
              </div>

              {/* Danh mục & Thương hiệu */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-400 font-semibold">Danh mục sản phẩm *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setInlineCatName('');
                        setInlineCatNameLao('');
                        setInlineCatSubStr('');
                        setInlineCatError('');
                        setShowInlineCatModal(true);
                      }}
                      className="text-[10px] text-blue-400 hover:text-blue-300 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Tạo mới</span>
                    </button>
                  </div>
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Phân loại nhỏ</label>
                  <select
                    value={formData.subCategoryId}
                    onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Không chọn --</option>
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
                    placeholder="Ví dụ: Dior, Chanel..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Gợi ý thương hiệu */}
              <div className="flex items-center gap-1.5 flex-wrap">
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

              {/* QUY CÁCH ĐÓNG GÓI: LỐC, HỘP, THÙNG */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-amber-500" />
                    <span>Quy Cách Mua Hàng: Lốc, Hộp, Thùng (ຮູບແບບການຊື້)</span>
                  </label>
                  <span className="text-[10px] text-zinc-500">Để trống giá thì hệ thống tự tính</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Lốc (PACK) */}
                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">📦 1. Mua theo Lốc (ແພັກ)</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-0.5">Số cái / 1 Lốc</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.packQty}
                        onChange={(e) => setFormData({ ...formData, packQty: e.target.value })}
                        placeholder="Mặc định 6"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-0.5">Giá bán 1 Lốc (₭ LAK)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.packPrice}
                        onChange={(e) => setFormData({ ...formData, packPrice: e.target.value })}
                        placeholder="Tự tính nếu trống"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Hộp (BOX) */}
                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-purple-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400">📦 2. Mua theo Hộp (ກ່ອງ)</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-0.5">Số cái / 1 Hộp</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.boxQty}
                        onChange={(e) => setFormData({ ...formData, boxQty: e.target.value })}
                        placeholder="Mặc định 10"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-0.5">Giá bán 1 Hộp (₭ LAK)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.boxPrice}
                        onChange={(e) => setFormData({ ...formData, boxPrice: e.target.value })}
                        placeholder="Tự tính nếu trống"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-purple-400 font-mono text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Thùng (CARTON) */}
                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">📦 3. Mua theo Thùng (ລັງ)</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-0.5">Số cái / 1 Thùng</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.cartonQty}
                        onChange={(e) => setFormData({ ...formData, cartonQty: e.target.value })}
                        placeholder="Mặc định 50"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-0.5">Giá bán 1 Thùng (₭ LAK)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.cartonPrice}
                        onChange={(e) => setFormData({ ...formData, cartonPrice: e.target.value })}
                        placeholder="Tự tính nếu trống"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-amber-400 font-mono text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PHÂN LOẠI BIẾN THỂ: MÀU SẮC & KÍCH CỠ */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-rose-500" />
                  <span>Phân Loại Sản Phẩm: Màu Sắc & Kích Cỡ (ສີສັນ & ຂະໜາດ)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">
                      Màu sắc (phân cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="Ví dụ: Đỏ Ruby, Cam Đất, Hồng Đào, Nâu Đất"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-[10px] text-zinc-500 mt-0.5 block">Khách hàng sẽ bấm chọn màu trực tiếp khi mua</span>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">
                      Kích cỡ / Dung tích (phân cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="Ví dụ: 30ml, 50ml, 100ml hoặc S, M, L, XL"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-zinc-500 mt-0.5 block">Dung tích chai, kích thước đóng gói</span>
                  </div>
                </div>
              </div>

              {/* Chụp ảnh Camera & Chọn ảnh */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Hình ảnh sản phẩm (ຮູບພາບສິນຄ້າ) - {productImages.length} ảnh đã chọn</span>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                      className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/30 transition active:scale-98 text-center"
                    >
                      <Camera className="w-4 h-4" />
                      <span>📸 Chụp ảnh Camera ngay</span>
                    </label>
                  </div>

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
                      className="w-full py-3 px-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 text-center"
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

                {/* Kho ảnh mẫu */}
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

                {/* Danh sách ảnh đã chọn */}
                {productImages.length > 0 ? (
                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    <p className="text-[11px] text-zinc-400 font-semibold">
                      Ảnh của sản phẩm (ảnh có viền xanh là ảnh bìa đại diện):
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1 bg-zinc-900/50 rounded-2xl border border-zinc-800">
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
                  <div className="p-3 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 text-[11px]">
                    Chưa có ảnh. Bạn bấm nút chụp ảnh hoặc chọn ảnh mẫu ở trên nhé!
                  </div>
                )}

                {/* Dán link phụ */}
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

              {/* Mô tả chi tiết */}
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">
                  Mô tả sản phẩm (ລາຍລະອຽດສິນຄ້າ)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả công dụng, cách dùng, nguồn gốc xuất xứ..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Modal Actions Footer */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-800 flex-shrink-0">
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
                      <span>{editingProduct ? 'Lưu thay đổi 2 bảng giá' : 'Thêm sản phẩm & 2 bảng giá'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TẠO NHANH DANH MỤC TRỰC TIẾP */}
      {showInlineCatModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-xs" onClick={() => setShowInlineCatModal(false)} />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl z-10 animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowInlineCatModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-400" />
              <span>Tạo Nhanh Danh Mục Mới</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mb-4">
              Danh mục tạo xong sẽ tự động chọn cho sản phẩm hiện tại
            </p>

            {inlineCatError && (
              <div className="mb-3 p-2.5 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{inlineCatError}</span>
              </div>
            )}

            <form onSubmit={handleCreateInlineCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Tên danh mục (Tiếng Việt) *</label>
                <input
                  type="text"
                  required
                  value={inlineCatName}
                  onChange={(e) => setInlineCatName(e.target.value)}
                  placeholder="Ví dụ: Chăm Sóc Tóc, Nước Hoa..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Tên tiếng Lào (ຊື່ໝວດໝູ່)</label>
                <input
                  type="text"
                  value={inlineCatNameLao}
                  onChange={(e) => setInlineCatNameLao(e.target.value)}
                  placeholder="Ví dụ: ບຳລຸງເສັ້ນຜົມ..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Mục con (cách nhau bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={inlineCatSubStr}
                  onChange={(e) => setInlineCatSubStr(e.target.value)}
                  placeholder="Ví dụ: Dầu gội, Dầu xả, Dưỡng tóc"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowInlineCatModal(false)}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={inlineCatLoading || !inlineCatName.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-500/25 transition active:scale-95 disabled:opacity-50"
                >
                  {inlineCatLoading ? 'Đang tạo...' : 'Tạo & Chọn Luôn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
