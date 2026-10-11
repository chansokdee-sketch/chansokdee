'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Category, ProductVariant, ProductTier1Option, ProductTier2Option } from '@/lib/types';
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
  Palette,
  CheckSquare,
  Square,
  Layers,
  Scale,
  Zap,
  Copy
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

// Interface cho từng món phân loại chuẩn Shopee (Mỗi ảnh = Một món riêng có giá riêng)
export interface ShopeeItemVariant {
  id: string;
  name: string;
  image: string;
  price: string | number;
  priceTHB: string | number;
  wholesalePrice: string | number;
  wholesalePriceTHB?: string | number;
  stock: string | number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State (Hỗ trợ 2 bảng giá: Giá lẻ & Giá sỉ bằng Kíp Lào ₭ và Baht Thái ฿, cùng ô tick quy cách)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',              // Giá bán lẻ Kíp (Khách lẻ)
    priceTHB: '',           // Giá bán lẻ Baht (nếu có thì hỗ trợ thanh toán Baht)
    wholesalePrice: '',     // Giá bán sỉ Kíp (Khách sỉ)
    wholesalePriceTHB: '',  // Giá bán sỉ Baht
    minWholesaleQty: '3',   // Số lượng tối thiểu tính giá sỉ
    
    // Đơn vị tính cơ sở (Cái, Gói, Tuýp, Chai, Hũ, Miếng, Lon...)
    baseUnitName: 'Cái',

    // Quy cách đóng gói (Ô tick)
    hasPack: false,
    packQty: '6',           // Số cái / Lốc (mặc định 6)
    packPrice: '',          // Giá bán Lốc (Kíp)
    packPriceTHB: '',       // Giá bán Lốc (Baht)
    
    hasBox: false,
    boxQty: '10',           // Số cái / Hộp (mặc định 10)
    boxPrice: '',           // Giá bán Hộp (Kíp)
    boxPriceTHB: '',        // Giá bán Hộp (Baht)
    
    hasCarton: false,
    cartonBoxQty: '',       // Số Hộp / Thùng (ví dụ: 24 hộp/thùng)
    cartonQty: '50',        // Tổng số cái / Thùng (mặc định 50 hoặc tự tính = cartonBoxQty * boxQty)
    cartonPrice: '',        // Giá bán Thùng (Kíp)
    cartonPriceTHB: '',     // Giá bán Thùng (Baht)
    
    colors: '',             // tương thích cũ
    sizes: '',              // tương thích cũ
    stock: '20',
    categoryId: '',
    subCategoryId: '',
    brand: '',
    status: 'ACTIVE' as 'ACTIVE' | 'HIDDEN',
  });

  // Quản lý biến thể phân loại chuẩn Shopee: Mỗi ảnh = Một món riêng có giá riêng
  const [shopeeItems, setShopeeItems] = useState<ShopeeItemVariant[]>([]);
  const [bulkPriceLAK, setBulkPriceLAK] = useState('');
  const [bulkPriceTHB, setBulkPriceTHB] = useState('');
  const [bulkWholesaleLAK, setBulkWholesaleLAK] = useState('');
  const [bulkStock, setBulkStock] = useState('20');
  const [itemUploadingIndex, setItemUploadingIndex] = useState<number | null>(null);

  // Thêm 1 dòng món mới
  const handleAddShopeeItem = (initial?: Partial<ShopeeItemVariant>) => {
    const newItem: ShopeeItemVariant = {
      id: `it-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: initial?.name || '',
      image: initial?.image || '',
      price: initial?.price ?? (bulkPriceLAK || formData.price || ''),
      priceTHB: initial?.priceTHB ?? (bulkPriceTHB || formData.priceTHB || ''),
      wholesalePrice: initial?.wholesalePrice ?? (bulkWholesaleLAK || formData.wholesalePrice || ''),
      wholesalePriceTHB: initial?.wholesalePriceTHB ?? '',
      stock: initial?.stock ?? (bulkStock || '20'),
    };
    setShopeeItems(prev => [...prev, newItem]);
  };

  // Cập nhật 1 món
  const handleUpdateShopeeItem = (id: string, updates: Partial<ShopeeItemVariant>) => {
    setShopeeItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  // Xóa 1 món
  const handleRemoveShopeeItem = (id: string) => {
    setShopeeItems(prev => prev.filter(item => item.id !== id));
  };

  // Nhân bản 1 món (Copy row)
  const handleDuplicateShopeeItem = (item: ShopeeItemVariant) => {
    const cloned: ShopeeItemVariant = {
      ...item,
      id: `it-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: item.name ? `${item.name} (Copy)` : '',
    };
    setShopeeItems(prev => [...prev, cloned]);
  };

  // Áp dụng giá nhanh cho toàn bộ danh sách món
  const handleApplyBulkPrices = () => {
    if (!bulkPriceLAK && !bulkPriceTHB && !bulkWholesaleLAK && !bulkStock) return;
    setShopeeItems(prev => prev.map(item => ({
      ...item,
      price: bulkPriceLAK || item.price,
      priceTHB: bulkPriceTHB || item.priceTHB,
      wholesalePrice: bulkWholesaleLAK || item.wholesalePrice,
      stock: bulkStock || item.stock,
    })));
    setQuickPriceToast('⚡ Đã áp dụng giá và tồn kho cho toàn bộ danh sách món!');
    setTimeout(() => setQuickPriceToast(null), 3000);
  };

  // Tải nhiều ảnh cùng lúc: Tải bao nhiêu ảnh tự động sinh bấy nhiêu món (Chuẩn Shopee)
  const handleMultiUploadShopeeItems = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    setUploadError('');
    try {
      const newItems: ShopeeItemVariant[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: data });
        const json = await res.json();
        if (res.ok && json.url) {
          newItems.push({
            id: `it-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
            name: '',
            image: json.url,
            price: bulkPriceLAK || formData.price || '',
            priceTHB: bulkPriceTHB || formData.priceTHB || '',
            wholesalePrice: bulkWholesaleLAK || formData.wholesalePrice || '',
            wholesalePriceTHB: '',
            stock: bulkStock || '20',
          });
        }
      }
      if (newItems.length > 0) {
        setShopeeItems(prev => {
          const isDefaultEmpty = prev.length === 1 && !prev[0].image && !prev[0].name && !prev[0].price;
          return isDefaultEmpty ? newItems : [...prev, ...newItems];
        });
        setQuickPriceToast(`📸 Đã tạo ${newItems.length} món từ ${newItems.length} ảnh vừa tải!`);
        setTimeout(() => setQuickPriceToast(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setUploadError('Lỗi kết nối khi tải ảnh.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Tải ảnh riêng cho từng món
  const handleSingleItemImageUpload = async (index: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setItemUploadingIndex(index);
    setUploadError('');
    try {
      const file = files[0];
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (res.ok && json.url) {
        setShopeeItems(prev => prev.map((item, i) => i === index ? { ...item, image: json.url } : item));
      } else {
        setUploadError(json.error || 'Lỗi khi tải ảnh món.');
      }
    } catch (err) {
      console.error(err);
      setUploadError('Lỗi kết nối khi tải ảnh.');
    } finally {
      setItemUploadingIndex(null);
    }
  };

  const [productImages, setProductImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Quick Inline Price Editing
  const [editingPrice, setEditingPrice] = useState<{
    productId: string;
    field: 'price' | 'wholesalePrice';
    priceLAK: string;
    priceTHB: string;
  } | null>(null);
  const [quickSavingId, setQuickSavingId] = useState<string | null>(null);
  const [quickPriceToast, setQuickPriceToast] = useState<string | null>(null);

  // Quick Modal Sửa 2 Bảng Giá
  const [quickModalProduct, setQuickModalProduct] = useState<Product | null>(null);
  const [quickModalForm, setQuickModalForm] = useState({
    price: '',
    priceTHB: '',
    wholesalePrice: '',
    wholesalePriceTHB: '',
  });
  const [quickModalSaving, setQuickModalSaving] = useState(false);

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
      priceTHB: '',
      wholesalePrice: '',
      wholesalePriceTHB: '',
      minWholesaleQty: '3',
      baseUnitName: 'Cái',
      hasPack: false,
      packQty: '6',
      packPrice: '',
      packPriceTHB: '',
      hasBox: false,
      boxQty: '10',
      boxPrice: '',
      boxPriceTHB: '',
      hasCarton: false,
      cartonBoxQty: '',
      cartonQty: '50',
      cartonPrice: '',
      cartonPriceTHB: '',
      colors: '',
      sizes: '',
      stock: '20',
      categoryId: defaultCatId,
      subCategoryId: defaultSubId,
      brand: '',
      status: 'ACTIVE',
    });
    setShopeeItems([
      {
        id: `it-${Date.now()}-1`,
        name: '',
        image: '',
        price: '',
        priceTHB: '',
        wholesalePrice: '',
        wholesalePriceTHB: '',
        stock: '20',
      }
    ]);
    setBulkPriceLAK('');
    setBulkPriceTHB('');
    setBulkWholesaleLAK('');
    setBulkStock('20');
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
      priceTHB: p.priceTHB ? p.priceTHB.toString() : '',
      wholesalePrice: wholesale.toString(),
      wholesalePriceTHB: p.wholesalePriceTHB ? p.wholesalePriceTHB.toString() : '',
      minWholesaleQty: minQty.toString(),
      baseUnitName: p.baseUnitName || 'Cái',
      hasPack: Boolean(p.hasPack || (p.packPrice && p.packPrice > 0)),
      packQty: (p.packQty || 6).toString(),
      packPrice: p.packPrice ? p.packPrice.toString() : '',
      packPriceTHB: p.packPriceTHB ? p.packPriceTHB.toString() : '',
      hasBox: Boolean(p.hasBox || (p.boxPrice && p.boxPrice > 0)),
      boxQty: (p.boxQty || 10).toString(),
      boxPrice: p.boxPrice ? p.boxPrice.toString() : '',
      boxPriceTHB: p.boxPriceTHB ? p.boxPriceTHB.toString() : '',
      hasCarton: Boolean(p.hasCarton || (p.cartonPrice && p.cartonPrice > 0)),
      cartonBoxQty: p.cartonBoxQty ? p.cartonBoxQty.toString() : (p.hasBox && p.boxQty && p.cartonQty ? Math.round(p.cartonQty / p.boxQty).toString() : ''),
      cartonQty: (p.cartonQty || 50).toString(),
      cartonPrice: p.cartonPrice ? p.cartonPrice.toString() : '',
      cartonPriceTHB: p.cartonPriceTHB ? p.cartonPriceTHB.toString() : '',
      colors: p.colors ? p.colors.join(', ') : '',
      sizes: p.sizes ? p.sizes.join(', ') : '',
      stock: p.stock.toString(),
      categoryId: p.categoryId,
      subCategoryId: p.subCategoryId || '',
      brand: p.brand || '',
      status: p.status,
    });

    const initialShopeeItems: ShopeeItemVariant[] = (p.variants && p.variants.length > 0)
      ? p.variants.map(v => ({
          id: v.id,
          name: v.name,
          image: v.image || '',
          price: (v.price !== undefined && v.price > 0 ? v.price : p.price).toString(),
          priceTHB: (v.priceTHB !== undefined && v.priceTHB > 0 ? v.priceTHB : (p.priceTHB || '')).toString(),
          wholesalePrice: (v.wholesalePrice !== undefined && v.wholesalePrice > 0 ? v.wholesalePrice : (p.wholesalePrice || '')).toString(),
          wholesalePriceTHB: (v.wholesalePriceTHB !== undefined && v.wholesalePriceTHB > 0 ? v.wholesalePriceTHB : (p.wholesalePriceTHB || '')).toString(),
          stock: (v.stock !== undefined ? v.stock : p.stock).toString(),
        }))
      : (p.tier1Options && p.tier1Options.length > 0)
      ? p.tier1Options.map(t => ({
          id: t.id,
          name: t.name,
          image: t.image || '',
          price: (t.price !== undefined && t.price > 0 ? t.price : p.price).toString(),
          priceTHB: (t.priceTHB !== undefined && t.priceTHB > 0 ? t.priceTHB : (p.priceTHB || '')).toString(),
          wholesalePrice: (p.wholesalePrice || '').toString(),
          wholesalePriceTHB: (p.wholesalePriceTHB || '').toString(),
          stock: p.stock.toString(),
        }))
      : [
          {
            id: `it-${Date.now()}-1`,
            name: 'Tiêu chuẩn',
            image: p.images && p.images.length > 0 ? p.images[0] : '',
            price: p.price.toString(),
            priceTHB: p.priceTHB ? p.priceTHB.toString() : '',
            wholesalePrice: p.wholesalePrice ? p.wholesalePrice.toString() : '',
            wholesalePriceTHB: p.wholesalePriceTHB ? p.wholesalePriceTHB.toString() : '',
            stock: p.stock.toString(),
          }
        ];

    setShopeeItems(initialShopeeItems);
    setBulkPriceLAK(retail.toString());
    setBulkPriceTHB(p.priceTHB ? p.priceTHB.toString() : '');
    setBulkWholesaleLAK(wholesale.toString());
    setBulkStock(p.stock.toString());
    setProductImages(p.images && p.images.length > 0 ? [...p.images] : []);
    setUploadError('');
    setManualUrl('');
    setModalError('');
    setShowPresets(false);
    setIsModalOpen(true);
  };

  // Tính năng Nhân bản sản phẩm (Clone/Duplicate): Giúp tạo nhanh hàng loạt món cùng hãng, cùng phân loại
  const openDuplicateModal = (p: Product) => {
    setEditingProduct(null); // Tạo mới món mới
    const retail = p.price;
    const wholesale = p.wholesalePrice !== undefined && p.wholesalePrice > 0 
      ? p.wholesalePrice 
      : Math.round(retail * 0.8);
    const minQty = p.minWholesaleQty || 3;

    setFormData({
      name: `${p.name} (Bản mới)`,
      sku: generateRandomSku(),
      description: p.descriptionLao || p.description,
      price: retail.toString(),
      priceTHB: p.priceTHB ? p.priceTHB.toString() : '',
      wholesalePrice: wholesale.toString(),
      wholesalePriceTHB: p.wholesalePriceTHB ? p.wholesalePriceTHB.toString() : '',
      minWholesaleQty: minQty.toString(),
      baseUnitName: p.baseUnitName || 'Cái',
      hasPack: Boolean(p.hasPack || (p.packPrice && p.packPrice > 0)),
      packQty: (p.packQty || 6).toString(),
      packPrice: p.packPrice ? p.packPrice.toString() : '',
      packPriceTHB: p.packPriceTHB ? p.packPriceTHB.toString() : '',
      hasBox: Boolean(p.hasBox || (p.boxPrice && p.boxPrice > 0)),
      boxQty: (p.boxQty || 10).toString(),
      boxPrice: p.boxPrice ? p.boxPrice.toString() : '',
      boxPriceTHB: p.boxPriceTHB ? p.boxPriceTHB.toString() : '',
      hasCarton: Boolean(p.hasCarton || (p.cartonPrice && p.cartonPrice > 0)),
      cartonBoxQty: p.cartonBoxQty ? p.cartonBoxQty.toString() : (p.hasBox && p.boxQty && p.cartonQty ? Math.round(p.cartonQty / p.boxQty).toString() : ''),
      cartonQty: (p.cartonQty || 50).toString(),
      cartonPrice: p.cartonPrice ? p.cartonPrice.toString() : '',
      cartonPriceTHB: p.cartonPriceTHB ? p.cartonPriceTHB.toString() : '',
      colors: p.colors ? p.colors.join(', ') : '',
      sizes: p.sizes ? p.sizes.join(', ') : '',
      stock: p.stock.toString(),
      categoryId: p.categoryId,
      subCategoryId: p.subCategoryId || '',
      brand: p.brand || '',
      status: 'ACTIVE',
    });

    const clonedItems: ShopeeItemVariant[] = (p.variants && p.variants.length > 0)
      ? p.variants.map((v, idx) => ({
          id: `it-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          name: v.name,
          image: v.image || '',
          price: (v.price !== undefined && v.price > 0 ? v.price : p.price).toString(),
          priceTHB: (v.priceTHB !== undefined && v.priceTHB > 0 ? v.priceTHB : (p.priceTHB || '')).toString(),
          wholesalePrice: (v.wholesalePrice !== undefined && v.wholesalePrice > 0 ? v.wholesalePrice : (p.wholesalePrice || '')).toString(),
          wholesalePriceTHB: (v.wholesalePriceTHB !== undefined && v.wholesalePriceTHB > 0 ? v.wholesalePriceTHB : (p.wholesalePriceTHB || '')).toString(),
          stock: (v.stock !== undefined ? v.stock : p.stock).toString(),
        }))
      : (p.tier1Options && p.tier1Options.length > 0)
      ? p.tier1Options.map((t, idx) => ({
          id: `it-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          name: t.name,
          image: t.image || '',
          price: (t.price !== undefined && t.price > 0 ? t.price : p.price).toString(),
          priceTHB: (t.priceTHB !== undefined && t.priceTHB > 0 ? t.priceTHB : (p.priceTHB || '')).toString(),
          wholesalePrice: (p.wholesalePrice || '').toString(),
          wholesalePriceTHB: (p.wholesalePriceTHB || '').toString(),
          stock: p.stock.toString(),
        }))
      : [
          {
            id: `it-${Date.now()}-1`,
            name: 'Tiêu chuẩn',
            image: p.images && p.images.length > 0 ? p.images[0] : '',
            price: p.price.toString(),
            priceTHB: p.priceTHB ? p.priceTHB.toString() : '',
            wholesalePrice: p.wholesalePrice ? p.wholesalePrice.toString() : '',
            wholesalePriceTHB: p.wholesalePriceTHB ? p.wholesalePriceTHB.toString() : '',
            stock: p.stock.toString(),
          }
        ];

    setShopeeItems(clonedItems);
    setBulkPriceLAK(retail.toString());
    setBulkPriceTHB(p.priceTHB ? p.priceTHB.toString() : '');
    setBulkWholesaleLAK(wholesale.toString());
    setBulkStock(p.stock.toString());
    setProductImages(p.images && p.images.length > 0 ? [...p.images] : []);
    setUploadError('');
    setManualUrl('');
    setModalError('');
    setShowPresets(false);
    setIsModalOpen(true);
    setQuickPriceToast(`📋 Đã nhân bản cấu hình "${p.name}". Bạn có thể đổi màu/tên và lưu thành món mới!`);
    setTimeout(() => setQuickPriceToast(null), 4000);
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

    // Lọc danh sách món hợp lệ
    const validItems = shopeeItems.filter(it => 
      String(it.name || '').trim() || 
      String(it.image || '').trim() || 
      String(it.price || '').trim()
    );
    if (validItems.length === 0) {
      setModalError('Vui lòng thêm ít nhất 1 món / phân loại có giá bán!');
      return;
    }

    // Giá lẻ chính (lấy từ món đầu tiên hoặc formData.price)
    const firstPriceNum = Number(validItems[0].price);
    const retailPrice = firstPriceNum > 0 ? firstPriceNum : (Number(formData.price) || 0);
    if (retailPrice <= 0) {
      setModalError('Vui lòng nhập giá bán lẻ tiền Kíp (₭) cho món đầu tiên!');
      return;
    }

    const firstPriceTHBNum = Number(validItems[0].priceTHB);
    const priceTHB = firstPriceTHBNum > 0 ? firstPriceTHBNum : (formData.priceTHB && Number(formData.priceTHB) > 0 ? Number(formData.priceTHB) : undefined);

    const firstWholesaleNum = Number(validItems[0].wholesalePrice);
    const wholesalePrice = firstWholesaleNum > 0 ? firstWholesaleNum : (formData.wholesalePrice && Number(formData.wholesalePrice) > 0 ? Number(formData.wholesalePrice) : Math.round(retailPrice * 0.8));

    const firstWholesaleTHBNum = Number(validItems[0].wholesalePriceTHB);
    const wholesalePriceTHB = firstWholesaleTHBNum > 0 ? firstWholesaleTHBNum : (formData.wholesalePriceTHB && Number(formData.wholesalePriceTHB) > 0 ? Number(formData.wholesalePriceTHB) : undefined);

    const minWholesaleQty = Math.max(1, Number(formData.minWholesaleQty) || 3);

    setSubmitting(true);

    const syncedVariants: ProductVariant[] = validItems.map((it, idx) => ({
      id: it.id,
      name: String(it.name || '').trim() || `Phân loại ${idx + 1}`,
      image: String(it.image || '').trim() || undefined,
      price: it.price && Number(it.price) > 0 ? Number(it.price) : retailPrice,
      priceTHB: it.priceTHB && Number(it.priceTHB) > 0 ? Number(it.priceTHB) : priceTHB,
      wholesalePrice: it.wholesalePrice && Number(it.wholesalePrice) > 0 ? Number(it.wholesalePrice) : wholesalePrice,
      wholesalePriceTHB: it.wholesalePriceTHB && Number(it.wholesalePriceTHB) > 0 ? Number(it.wholesalePriceTHB) : wholesalePriceTHB,
      stock: Number(it.stock) || 0,
    }));

    const validTier1: ProductTier1Option[] = validItems.map((it, idx) => ({
      id: it.id,
      name: String(it.name || '').trim() || `Phân loại ${idx + 1}`,
      image: String(it.image || '').trim() || undefined,
      price: it.price && Number(it.price) > 0 ? Number(it.price) : retailPrice,
      priceTHB: it.priceTHB && Number(it.priceTHB) > 0 ? Number(it.priceTHB) : priceTHB,
    }));

    const itemImages = validItems.map(it => String(it.image || '').trim()).filter(Boolean);
    const images = itemImages.length > 0
      ? Array.from(new Set(itemImages))
      : (productImages.length > 0 ? productImages : ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop']);

    const totalStock = validItems.reduce((acc, it) => acc + (Number(it.stock) || 0), 0) || Number(formData.stock) || 0;

    const selectedCat = categories.find(c => c.id === formData.categoryId);
    const selectedSub = selectedCat?.subCategories?.find(s => s.id === formData.subCategoryId);

    const cartonBoxQtyNum = formData.cartonBoxQty && Number(formData.cartonBoxQty) > 0 ? Number(formData.cartonBoxQty) : undefined;
    const boxQtyNum = Number(formData.boxQty) || 10;
    const calculatedCartonQty = (formData.hasBox && cartonBoxQtyNum && cartonBoxQtyNum > 0)
      ? (cartonBoxQtyNum * boxQtyNum)
      : (Number(formData.cartonQty) || 50);

    const payload = {
      name: formData.name.trim(),
      nameLao: formData.name.trim(),
      sku: formData.sku.trim() || generateRandomSku(),
      description: formData.description.trim(),
      descriptionLao: formData.description.trim(),
      price: retailPrice,
      priceTHB,
      wholesalePrice,
      wholesalePriceTHB,
      minWholesaleQty,
      baseUnitName: formData.baseUnitName?.trim() || 'Cái',
      hasPack: formData.hasPack,
      packQty: Number(formData.packQty) || 6,
      packPrice: formData.hasPack && formData.packPrice && Number(formData.packPrice) > 0 ? Number(formData.packPrice) : undefined,
      packPriceTHB: formData.hasPack && formData.packPriceTHB && Number(formData.packPriceTHB) > 0 ? Number(formData.packPriceTHB) : undefined,
      hasBox: formData.hasBox,
      boxQty: boxQtyNum,
      boxPrice: formData.hasBox && formData.boxPrice && Number(formData.boxPrice) > 0 ? Number(formData.boxPrice) : undefined,
      boxPriceTHB: formData.hasBox && formData.boxPriceTHB && Number(formData.boxPriceTHB) > 0 ? Number(formData.boxPriceTHB) : undefined,
      hasCarton: formData.hasCarton,
      cartonBoxQty: cartonBoxQtyNum,
      cartonQty: calculatedCartonQty,
      cartonPrice: formData.hasCarton && formData.cartonPrice && Number(formData.cartonPrice) > 0 ? Number(formData.cartonPrice) : undefined,
      cartonPriceTHB: formData.hasCarton && formData.cartonPriceTHB && Number(formData.cartonPriceTHB) > 0 ? Number(formData.cartonPriceTHB) : undefined,
      tier1Name: validTier1.length > 1 ? 'Phân Loại' : undefined,
      tier1Options: validTier1.length > 0 ? validTier1 : undefined,
      variants: syncedVariants.length > 0 ? syncedVariants : undefined,
      stock: totalStock,
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

  const formatPriceTHB = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price) + ' ฿';
  };

  const startInlineEdit = (p: Product, field: 'price' | 'wholesalePrice') => {
    if (field === 'price') {
      setEditingPrice({
        productId: p.id,
        field: 'price',
        priceLAK: p.price.toString(),
        priceTHB: p.priceTHB ? p.priceTHB.toString() : '',
      });
    } else {
      const wholesale = p.wholesalePrice !== undefined && p.wholesalePrice > 0 
        ? p.wholesalePrice 
        : Math.round(p.price * 0.8);
      setEditingPrice({
        productId: p.id,
        field: 'wholesalePrice',
        priceLAK: wholesale.toString(),
        priceTHB: p.wholesalePriceTHB ? p.wholesalePriceTHB.toString() : '',
      });
    }
  };

  const cancelInlineEdit = () => {
    setEditingPrice(null);
  };

  const handleSaveInline = async (productId: string) => {
    if (!editingPrice || editingPrice.productId !== productId) return;

    const { field, priceLAK, priceTHB } = editingPrice;
    const numLAK = Number(priceLAK);
    if (isNaN(numLAK) || numLAK < 0) {
      alert('Vui lòng nhập giá hợp lệ');
      return;
    }

    setQuickSavingId(productId);
    try {
      const payload: Record<string, any> = {};
      if (field === 'price') {
        payload.price = numLAK;
        if (priceTHB.trim() !== '') {
          payload.priceTHB = Number(priceTHB) > 0 ? Number(priceTHB) : null;
        }
      } else {
        payload.wholesalePrice = numLAK;
        if (priceTHB.trim() !== '') {
          payload.wholesalePriceTHB = Number(priceTHB) > 0 ? Number(priceTHB) : null;
        }
      }

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Cập nhật giá thất bại');
      } else {
        setProducts(prev => prev.map(p => p.id === productId ? data.product : p));
        setEditingPrice(null);
        setQuickPriceToast(`Đã lưu ${field === 'price' ? 'Giá Bán Lẻ' : 'Giá Bán Sỉ'} mới thành công!`);
        setTimeout(() => setQuickPriceToast(null), 3000);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối khi cập nhật giá');
    } finally {
      setQuickSavingId(null);
    }
  };

  const openQuickModal = (p: Product) => {
    const wholesale = p.wholesalePrice !== undefined && p.wholesalePrice > 0 
      ? p.wholesalePrice 
      : Math.round(p.price * 0.8);
    setQuickModalProduct(p);
    setQuickModalForm({
      price: p.price.toString(),
      priceTHB: p.priceTHB ? p.priceTHB.toString() : '',
      wholesalePrice: wholesale.toString(),
      wholesalePriceTHB: p.wholesalePriceTHB ? p.wholesalePriceTHB.toString() : '',
    });
  };

  const handleSaveQuickModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickModalProduct) return;

    const retailLAK = Number(quickModalForm.price);
    const wholesaleLAK = Number(quickModalForm.wholesalePrice);

    if (isNaN(retailLAK) || retailLAK <= 0) {
      alert('Vui lòng nhập giá bán lẻ hợp lệ');
      return;
    }

    setQuickModalSaving(true);
    try {
      const payload: Record<string, any> = {
        price: retailLAK,
        wholesalePrice: !isNaN(wholesaleLAK) && wholesaleLAK > 0 ? wholesaleLAK : Math.round(retailLAK * 0.8),
        priceTHB: quickModalForm.priceTHB && Number(quickModalForm.priceTHB) > 0 ? Number(quickModalForm.priceTHB) : null,
        wholesalePriceTHB: quickModalForm.wholesalePriceTHB && Number(quickModalForm.wholesalePriceTHB) > 0 ? Number(quickModalForm.wholesalePriceTHB) : null,
      };

      const res = await fetch(`/api/admin/products/${quickModalProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Cập nhật giá thất bại');
      } else {
        setProducts(prev => prev.map(p => p.id === quickModalProduct.id ? data.product : p));
        setQuickModalProduct(null);
        setQuickPriceToast(`Đã cập nhật bảng giá cho "${quickModalProduct.name}"!`);
        setTimeout(() => setQuickPriceToast(null), 3000);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối khi cập nhật giá');
    } finally {
      setQuickModalSaving(false);
    }
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
      {/* Toast thông báo sửa giá thành công */}
      {quickPriceToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top duration-200">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{quickPriceToast}</span>
        </div>
      )}

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

                {/* 2 Bảng Giá: Giá Lẻ & Giá Sỉ (Bấm để sửa nhanh) */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-zinc-950/70 rounded-xl border border-zinc-800/80">
                  <div 
                    onClick={() => openQuickModal(p)}
                    className="space-y-0.5 cursor-pointer hover:bg-zinc-900/80 p-1 -m-1 rounded-lg transition active:scale-98"
                    title="Bấm để sửa nhanh Giá Lẻ"
                  >
                    <span className="text-[10px] text-zinc-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-emerald-400" />
                        <span>Giá lẻ (ຍ່ອຍ)</span>
                      </span>
                      <Edit3 className="w-2.5 h-2.5 text-emerald-400" />
                    </span>
                    <div className="font-bold text-emerald-400 text-xs font-mono">
                      {formatPriceLAK(p.price)}
                    </div>
                    {p.priceTHB && p.priceTHB > 0 && (
                      <div className="text-[10px] font-mono text-amber-300 font-bold">
                        {formatPriceTHB(p.priceTHB)}
                      </div>
                    )}
                  </div>

                  <div 
                    onClick={() => openQuickModal(p)}
                    className="space-y-0.5 border-l border-zinc-800 pl-2 cursor-pointer hover:bg-zinc-900/80 p-1 -m-1 rounded-lg transition active:scale-98"
                    title="Bấm để sửa nhanh Giá Sỉ"
                  >
                    <span className="text-[10px] text-amber-400 font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Boxes className="w-3 h-3 text-amber-400" />
                        <span>Giá sỉ ⚡ (ສົ່ງ)</span>
                      </span>
                      <Edit3 className="w-2.5 h-2.5 text-amber-400" />
                    </span>
                    <div className="font-bold text-amber-400 text-xs font-mono">
                      {formatPriceLAK(wholesalePrice)}
                    </div>
                    {p.wholesalePriceTHB && p.wholesalePriceTHB > 0 && (
                      <div className="text-[10px] font-mono text-amber-300 font-bold">
                        {formatPriceTHB(p.wholesalePriceTHB)}
                      </div>
                    )}
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
                      onClick={() => openDuplicateModal(p)}
                      className="px-2 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95 border border-purple-500/30"
                      title="Nhân bản món này (sao chép nhanh để tạo món cùng hãng khác màu)"
                    >
                      <Copy className="w-3 h-3 text-purple-400" />
                      <span>Nhân bản</span>
                    </button>
                    <button
                      onClick={() => openQuickModal(p)}
                      className="px-2 py-1.5 bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95 border border-amber-500/30"
                      title="Sửa nhanh 2 bảng giá"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Sửa giá</span>
                    </button>
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
                    <span className="text-[9px] text-emerald-500/70 font-normal lowercase ml-0.5 hidden xl:inline">(click để sửa)</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-semibold text-amber-400">
                  <div className="flex items-center gap-1">
                    <Boxes className="w-3 h-3" />
                    <span>Giá bán sỉ (ສົ່ງ)</span>
                    <span className="text-[9px] text-amber-500/70 font-normal lowercase ml-0.5 hidden xl:inline">(click để sửa)</span>
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
                      {editingPrice?.productId === p.id && editingPrice?.field === 'price' ? (
                        <div className="p-2.5 bg-zinc-950 rounded-xl border border-emerald-500 shadow-xl space-y-2 min-w-[175px] z-20 animate-in zoom-in-95">
                          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                            <span>Sửa Giá Lẻ</span>
                            <span className="text-zinc-500 text-[9px]">Enter để lưu</span>
                          </div>
                          <div>
                            <label className="text-[9px] text-zinc-400 block mb-0.5">Tiền Kíp (₭) *</label>
                            <div className="relative">
                              <input
                                type="number"
                                autoFocus
                                min="0"
                                value={editingPrice.priceLAK}
                                onChange={(e) => setEditingPrice({ ...editingPrice, priceLAK: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveInline(p.id);
                                  if (e.key === 'Escape') cancelInlineEdit();
                                }}
                                placeholder="Giá Kíp"
                                className="w-full bg-zinc-900 border border-emerald-500/60 rounded-lg pl-2 pr-5 py-1 text-emerald-300 font-mono text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-400"
                              />
                              <span className="absolute right-1.5 top-1 text-emerald-500 text-xs font-bold">₭</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-[9px] text-zinc-400 block mb-0.5">Tiền Baht (฿)</label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                value={editingPrice.priceTHB}
                                onChange={(e) => setEditingPrice({ ...editingPrice, priceTHB: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveInline(p.id);
                                  if (e.key === 'Escape') cancelInlineEdit();
                                }}
                                placeholder="Baht (nếu có)"
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-2 pr-5 py-1 text-amber-300 font-mono text-[11px] outline-none focus:border-amber-500"
                              />
                              <span className="absolute right-1.5 top-1 text-amber-500 text-xs font-bold">฿</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveInline(p.id)}
                              disabled={quickSavingId === p.id}
                              className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition active:scale-95"
                            >
                              {quickSavingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 stroke-[3]" />}
                              <span>Lưu</span>
                            </button>
                            <button
                              type="button"
                              onClick={cancelInlineEdit}
                              className="py-1 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[10px] font-semibold transition"
                              title="Hủy (Esc)"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => startInlineEdit(p, 'price')}
                          className="cursor-pointer group/price p-2 -m-2 rounded-xl hover:bg-zinc-800/80 hover:ring-1 hover:ring-emerald-500/50 transition relative"
                          title="Bấm để sửa nhanh Giá Bán Lẻ"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-emerald-400 text-sm font-mono group-hover/price:underline decoration-emerald-500/50 underline-offset-2">
                              {formatPriceLAK(p.price)}
                            </span>
                            <span className="text-[10px] text-emerald-400/80 opacity-0 group-hover/price:opacity-100 transition flex items-center gap-0.5 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20">
                              <Edit3 className="w-2.5 h-2.5" />
                              <span>Sửa</span>
                            </span>
                          </div>
                          {p.priceTHB && p.priceTHB > 0 && (
                            <div className="text-[11px] font-mono text-amber-300 font-bold">
                              {formatPriceTHB(p.priceTHB)}
                            </div>
                          )}
                          <span className="text-[10px] text-zinc-500 block">Khách lẻ / 1 cái</span>
                        </div>
                      )}
                    </td>

                    {/* Cột Giá Bán Sỉ */}
                    <td className="py-4 px-4">
                      {editingPrice?.productId === p.id && editingPrice?.field === 'wholesalePrice' ? (
                        <div className="p-2.5 bg-zinc-950 rounded-xl border border-amber-500 shadow-xl space-y-2 min-w-[175px] z-20 animate-in zoom-in-95">
                          <div className="flex items-center justify-between text-[10px] font-bold text-amber-400">
                            <span>Sửa Giá Sỉ</span>
                            <button
                              type="button"
                              onClick={() => {
                                const retail = p.price;
                                if (retail > 0) {
                                  const sug = Math.round(retail * 0.8 / 1000) * 1000;
                                  setEditingPrice({ ...editingPrice, priceLAK: sug.toString() });
                                }
                              }}
                              className="text-[9px] text-amber-300 hover:underline flex items-center gap-0.5"
                              title="Tự động tính 80% giá lẻ"
                            >
                              ⚡ Gợi ý -20%
                            </button>
                          </div>
                          <div>
                            <label className="text-[9px] text-zinc-400 block mb-0.5">Tiền Kíp Sỉ (₭)</label>
                            <div className="relative">
                              <input
                                type="number"
                                autoFocus
                                min="0"
                                value={editingPrice.priceLAK}
                                onChange={(e) => setEditingPrice({ ...editingPrice, priceLAK: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveInline(p.id);
                                  if (e.key === 'Escape') cancelInlineEdit();
                                }}
                                placeholder="Giá Sỉ Kíp"
                                className="w-full bg-zinc-900 border border-amber-500/60 rounded-lg pl-2 pr-5 py-1 text-amber-300 font-mono text-xs font-bold outline-none focus:ring-1 focus:ring-amber-400"
                              />
                              <span className="absolute right-1.5 top-1 text-amber-500 text-xs font-bold">₭</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-[9px] text-zinc-400 block mb-0.5">Tiền Baht Sỉ (฿)</label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                value={editingPrice.priceTHB}
                                onChange={(e) => setEditingPrice({ ...editingPrice, priceTHB: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveInline(p.id);
                                  if (e.key === 'Escape') cancelInlineEdit();
                                }}
                                placeholder="Baht sỉ (nếu có)"
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-2 pr-5 py-1 text-amber-300 font-mono text-[11px] outline-none focus:border-amber-500"
                              />
                              <span className="absolute right-1.5 top-1 text-amber-500 text-xs font-bold">฿</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveInline(p.id)}
                              disabled={quickSavingId === p.id}
                              className="flex-1 py-1 px-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition active:scale-95"
                            >
                              {quickSavingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 stroke-[3]" />}
                              <span>Lưu</span>
                            </button>
                            <button
                              type="button"
                              onClick={cancelInlineEdit}
                              className="py-1 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[10px] font-semibold transition"
                              title="Hủy (Esc)"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => startInlineEdit(p, 'wholesalePrice')}
                          className="cursor-pointer group/price p-2 -m-2 rounded-xl hover:bg-zinc-800/80 hover:ring-1 hover:ring-amber-500/50 transition relative"
                          title="Bấm để sửa nhanh Giá Bán Sỉ"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-amber-400 text-sm font-mono group-hover/price:underline decoration-amber-500/50 underline-offset-2">
                              {formatPriceLAK(wholesalePrice)}
                            </span>
                            <span className="text-[10px] text-amber-400/80 opacity-0 group-hover/price:opacity-100 transition flex items-center gap-0.5 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/20">
                              <Edit3 className="w-2.5 h-2.5" />
                              <span>Sửa</span>
                            </span>
                          </div>
                          {p.wholesalePriceTHB && p.wholesalePriceTHB > 0 && (
                            <div className="text-[11px] font-mono text-amber-300 font-bold">
                              {formatPriceTHB(p.wholesalePriceTHB)}
                            </div>
                          )}
                          <span className="text-[10px] text-amber-300/80 bg-amber-500/10 px-1.5 py-0.2 rounded font-medium border border-amber-500/20 inline-block mt-0.5">
                            Khách sỉ ⚡
                          </span>
                        </div>
                      )}
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openQuickModal(p)}
                          className="px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-white border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95"
                          title="Sửa nhanh 2 bảng giá (Sỉ / Lẻ / Baht)"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>Sửa giá</span>
                        </button>
                        <button
                          onClick={() => openDuplicateModal(p)}
                          className="p-2 text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition"
                          title="Nhân bản món này (sao chép nhanh để tạo món cùng hãng khác màu)"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-xl transition"
                          title="Sửa thông tin chi tiết món"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-xl transition"
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

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800 flex-shrink-0 gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span>{editingProduct ? 'Chỉnh Sửa Món & Bảng Giá' : 'Thêm Món Mới (Bảng Giá & Phân Loại)'}</span>
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Bán hàng tại Lào: Nhập <strong>Giá bán lẻ</strong>, <strong>Giá bán sỉ (buôn)</strong> và quy cách đóng gói (Gói/Hộp/Thùng).
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => openDuplicateModal(editingProduct)}
                    className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-xl text-xs font-bold border border-purple-500/40 transition flex items-center gap-1.5 active:scale-95 shadow-xs"
                    title="Sao chép toàn bộ thông tin sản phẩm này để tạo món mới cùng hãng khác màu"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">📋 Nhân bản món này</span>
                    <span className="sm:hidden">Nhân bản</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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

              {/* Thông tin cơ bản: SKU & Trạng thái bán */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-400 font-semibold">Mã SKU sản phẩm</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sku: generateRandomSku() })}
                      className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Sinh mã ngẫu nhiên</span>
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
                  <label className="block text-zinc-400 font-semibold mb-1">Trạng thái bán hàng</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="ACTIVE">Hiển thị bán trên web (ເປີດຂາຍ)</option>
                    <option value="HIDDEN">Ẩn tạm thời (ເຊື່ອງ)</option>
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

              {/* QUY CÁCH ĐÓNG GÓI: LỐC, HỘP, THÙNG (DÙNG Ô TICK, TỰ CHỈNH GIÁ, KHÔNG TỰ ĐỘNG TÍNH) */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-amber-500" />
                    <span>Quy Cách Bán Hàng: Lốc, Hộp, Thùng (ຮູບແບບການຊື້)</span>
                  </label>
                  <span className="text-[10px] text-zinc-400">
                    Tick chọn nếu sản phẩm có bán theo lốc, hộp hoặc thùng
                  </span>
                </div>

                {/* Chọn đơn vị tính cơ sở (Gói, Cái, Tuýp, Chai, Hũ...) */}
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-zinc-300">
                      Đơn vị tính cơ sở (Đơn vị nhỏ nhất để bán lẻ):
                    </label>
                    <span className="text-[10px] text-amber-400 font-medium">
                      Hiện tại: <strong>{formData.baseUnitName || 'Cái'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['Gói', 'Cái', 'Tuýp', 'Chai', 'Hũ', 'Miếng', 'Thỏi', 'Túi', 'Bịch', 'Lon'].map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, baseUnitName: unit }))}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition active:scale-95 ${
                          (formData.baseUnitName || 'Cái').toLowerCase() === unit.toLowerCase()
                            ? 'bg-amber-500 text-black border-amber-400 shadow-sm'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-700/80 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                    <input
                      type="text"
                      value={formData.baseUnitName}
                      onChange={(e) => setFormData(prev => ({ ...prev, baseUnitName: e.target.value }))}
                      placeholder="Hoặc tự gõ đơn vị..."
                      className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white w-32 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Lốc (PACK) */}
                  <div className={`p-3.5 rounded-xl border transition space-y-2.5 ${
                    formData.hasPack 
                      ? 'bg-zinc-900 border-emerald-500/50 ring-1 ring-emerald-500/30' 
                      : 'bg-zinc-900/40 border-zinc-800'
                  }`}>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.hasPack}
                        onChange={(e) => setFormData({ ...formData, hasPack: e.target.checked })}
                        className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-emerald-400">
                        📦 Bán theo Lốc (ແພັກ)
                      </span>
                    </label>

                    {formData.hasPack ? (
                      <div className="space-y-2 pt-1 border-t border-zinc-800 animate-in fade-in">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-0.5">Số {formData.baseUnitName || 'cái'} / 1 Lốc</label>
                          <input
                            type="number"
                            min="1"
                            value={formData.packQty}
                            onChange={(e) => setFormData({ ...formData, packQty: e.target.value })}
                            placeholder="Ví dụ: 6"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-emerald-400 block mb-0.5 font-bold">Giá 1 Lốc Tiền Kíp (₭)</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.packPrice}
                            onChange={(e) => setFormData({ ...formData, packPrice: e.target.value })}
                            placeholder="Ví dụ: 320000"
                            className="w-full bg-zinc-950 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-amber-400 block mb-0.5 font-bold">Giá 1 Lốc Tiền Baht (฿)</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.packPriceTHB}
                            onChange={(e) => setFormData({ ...formData, packPriceTHB: e.target.value })}
                            placeholder="Ví dụ: 490 (nếu có)"
                            className="w-full bg-zinc-950 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500 italic">Không bán theo Lốc</p>
                    )}
                  </div>

                  {/* Hộp (BOX) */}
                  <div className={`p-3.5 rounded-xl border transition space-y-2.5 ${
                    formData.hasBox 
                      ? 'bg-zinc-900 border-purple-500/50 ring-1 ring-purple-500/30' 
                      : 'bg-zinc-900/40 border-zinc-800'
                  }`}>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.hasBox}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData(prev => {
                            const bQty = Number(prev.boxQty) || 6;
                            const autoCarton = (prev.hasCarton && prev.cartonBoxQty) ? (Number(prev.cartonBoxQty) * bQty).toString() : prev.cartonQty;
                            return {
                              ...prev,
                              hasBox: checked,
                              cartonQty: autoCarton,
                            };
                          });
                        }}
                        className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-purple-400">
                        📦 Bán theo Hộp (ກ່ອງ)
                      </span>
                    </label>

                    {formData.hasBox ? (
                      <div className="space-y-2 pt-1 border-t border-zinc-800 animate-in fade-in">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-0.5">Số {formData.baseUnitName || 'cái'} / 1 Hộp</label>
                          <input
                            type="number"
                            min="1"
                            value={formData.boxQty}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData(prev => {
                                const bQty = Number(val) || 1;
                                const autoCarton = prev.cartonBoxQty ? (Number(prev.cartonBoxQty) * bQty).toString() : prev.cartonQty;
                                return {
                                  ...prev,
                                  boxQty: val,
                                  ...(prev.cartonBoxQty ? { cartonQty: autoCarton } : {}),
                                };
                              });
                            }}
                            placeholder="Ví dụ: 6"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-purple-400 block mb-0.5 font-bold">Giá 1 Hộp Tiền Kíp (₭)</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.boxPrice}
                            onChange={(e) => setFormData({ ...formData, boxPrice: e.target.value })}
                            placeholder="Ví dụ: 85000"
                            className="w-full bg-zinc-950 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-500 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-amber-400 block mb-0.5 font-bold">Giá 1 Hộp Tiền Baht (฿)</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.boxPriceTHB}
                            onChange={(e) => setFormData({ ...formData, boxPriceTHB: e.target.value })}
                            placeholder="Ví dụ: 125 (nếu có)"
                            className="w-full bg-zinc-950 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500 italic">Không bán theo Hộp</p>
                    )}
                  </div>

                  {/* Thùng (CARTON) */}
                  <div className={`p-3.5 rounded-xl border transition space-y-2.5 ${
                    formData.hasCarton 
                      ? 'bg-zinc-900 border-amber-500/50 ring-1 ring-amber-500/30' 
                      : 'bg-zinc-900/40 border-zinc-800'
                  }`}>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.hasCarton}
                        onChange={(e) => setFormData({ ...formData, hasCarton: e.target.checked })}
                        className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-amber-400">
                        📦 Bán theo Thùng (ລັງ)
                      </span>
                    </label>

                    {formData.hasCarton ? (
                      <div className="space-y-2 pt-1 border-t border-zinc-800 animate-in fade-in">
                        {/* Hỗ trợ nhập số Hộp trong 1 Thùng (cho bài toán: 1 thùng = 24 hộp) */}
                        {formData.hasBox && (
                          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
                            <label className="text-[10px] text-amber-300 block mb-0.5 font-bold">
                              ⚡ Số Hộp / 1 Thùng (tự động nhân số {formData.baseUnitName || 'gói'})
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={formData.cartonBoxQty}
                              onChange={(e) => {
                                const val = e.target.value;
                                const bQty = Number(formData.boxQty) || 6;
                                const autoCartonQty = val ? (Number(val) * bQty).toString() : '';
                                setFormData(prev => ({
                                  ...prev,
                                  cartonBoxQty: val,
                                  ...(autoCartonQty ? { cartonQty: autoCartonQty } : {}),
                                }));
                              }}
                              placeholder="Ví dụ: 24 (24 hộp/thùng)"
                              className="w-full bg-zinc-950 border border-amber-500/50 rounded-lg px-2.5 py-1.5 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400 font-bold"
                            />
                            {formData.cartonBoxQty && formData.boxQty && (
                              <div className="text-[9px] text-amber-200/90 font-mono font-medium mt-1">
                                💡 Quy đổi: {formData.cartonBoxQty} hộp × {formData.boxQty} {formData.baseUnitName || 'gói'} = <strong className="text-amber-300 font-black">{(Number(formData.cartonBoxQty) || 0) * (Number(formData.boxQty) || 0)}</strong> {formData.baseUnitName || 'gói'}
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="text-[10px] text-zinc-400">
                              Tổng số {formData.baseUnitName || 'cái'} / 1 Thùng
                            </label>
                            {formData.cartonBoxQty && formData.hasBox && (
                              <span className="text-[9px] text-zinc-500 font-mono">
                                (tự tính)
                              </span>
                            )}
                          </div>
                          <input
                            type="number"
                            min="1"
                            value={formData.cartonQty}
                            onChange={(e) => setFormData({ ...formData, cartonQty: e.target.value })}
                            placeholder="Ví dụ: 144"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-amber-400 block mb-0.5 font-bold">Giá 1 Thùng Tiền Kíp (₭)</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.cartonPrice}
                            onChange={(e) => setFormData({ ...formData, cartonPrice: e.target.value })}
                            placeholder="Ví dụ: 1950000"
                            className="w-full bg-zinc-950 border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-amber-400 block mb-0.5 font-bold">Giá 1 Thùng Tiền Baht (฿)</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.cartonPriceTHB}
                            onChange={(e) => setFormData({ ...formData, cartonPriceTHB: e.target.value })}
                            placeholder="Ví dụ: 2850 (nếu có)"
                            className="w-full bg-zinc-950 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-zinc-500 italic">Không bán theo Thùng</p>
                    )}
                  </div>
                </div>
              </div>

              {/* BẢNG PHÂN LOẠI HÀNG CHUẨN SHOPEE (MỖI ẢNH = MỘT MÓN RIÊNG CÓ GIÁ RIÊNG) */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-orange-500/40 shadow-lg space-y-4">
                {/* Header khối Shopee */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                  <div>
                    <label className="text-xs font-black text-white flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-orange-500/20 text-orange-400">
                        <Palette className="w-4 h-4" />
                      </span>
                      <span className="text-sm text-orange-400">
                        Phân Loại Hàng (Chuẩn Shopee - Mỗi ảnh = Một món riêng, có giá riêng)
                      </span>
                    </label>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      📸 <strong>Mỗi ảnh là một món/màu riêng</strong> có giá riêng. Khách bấm vào ảnh nào sẽ hiển thị đúng giá món đó!
                    </p>
                  </div>

                  {/* 3 Nút thao tác nhanh trên đầu */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Nút Tải nhiều ảnh cùng lúc */}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        id="shopee-multi-image-upload"
                        className="hidden"
                        onChange={(e) => handleMultiUploadShopeeItems(e.target.files)}
                      />
                      <label
                        htmlFor="shopee-multi-image-upload"
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-900/30 transition active:scale-95"
                        title="Chọn nhiều ảnh từ máy, tải bao nhiêu ảnh sẽ tự động tạo bấy nhiêu món!"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>📸 Tải ảnh (Tải bao nhiêu ảnh tự sinh bấy nhiêu món)</span>
                      </label>
                    </div>

                    {/* Nút Thêm món mới thủ công */}
                    <button
                      type="button"
                      onClick={() => handleAddShopeeItem()}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs flex items-center gap-1 transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-orange-400" />
                      <span>+ Thêm món mới</span>
                    </button>

                    {/* Nút mở Kho ảnh mẫu */}
                    <button
                      type="button"
                      onClick={() => setShowPresets(!showPresets)}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1 transition"
                    >
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>{showPresets ? 'Đóng kho ảnh' : 'Kho ảnh mẫu'}</span>
                    </button>
                  </div>
                </div>

                {uploadingImage && (
                  <div className="p-3 bg-blue-950/40 border border-blue-800/80 rounded-xl text-xs text-blue-300 flex items-center gap-2 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Đang xử lý tải ảnh lên hệ thống...</span>
                  </div>
                )}

                {/* Kho ảnh mẫu mỹ phẩm (1 chạm thêm vào món) */}
                {showPresets && (
                  <div className="p-3 bg-zinc-900 border border-purple-500/40 rounded-2xl space-y-2 animate-in fade-in">
                    <p className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Bấm 1 chạm vào ảnh mẫu dưới đây để thêm ngay 1 món mới với ảnh đó:</span>
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1">
                      {PRESET_BEAUTY_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            handleAddShopeeItem({ image: preset.url, name: preset.name });
                            setShowPresets(false);
                          }}
                          className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-700 hover:border-orange-400 transition"
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-1 text-[9px] text-white font-semibold">
                            + {preset.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thanh công cụ: ⚡ ÁP DỤNG GIÁ NHANH CHO TẤT CẢ CÁC MÓN */}
                <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-orange-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-orange-400" />
                      <span>⚡ Áp dụng nhanh giá & tồn kho cho toàn bộ danh sách món:</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Nhập 1 lần và bấm nút áp dụng, sau đó chỉ cần sửa tên/món khác giá
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={bulkPriceLAK}
                        onChange={(e) => setBulkPriceLAK(e.target.value)}
                        placeholder="Giá lẻ Kíp (₭)"
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 font-mono font-bold outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={bulkPriceTHB}
                        onChange={(e) => setBulkPriceTHB(e.target.value)}
                        placeholder="Giá lẻ Baht (฿)"
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={bulkWholesaleLAK}
                        onChange={(e) => setBulkWholesaleLAK(e.target.value)}
                        placeholder="Giá sỉ Kíp (₭)"
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-mono outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={bulkStock}
                        onChange={(e) => setBulkStock(e.target.value)}
                        placeholder="Tồn kho (cái)"
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <button
                        type="button"
                        onClick={handleApplyBulkPrices}
                        className="w-full py-1.5 px-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg text-xs font-bold transition shadow-sm active:scale-95 flex items-center justify-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Áp dụng tất cả</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gợi ý nhanh tên màu / dòng (1 chạm để điền hoặc thêm món) */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-amber-400 font-semibold">Gợi ý dòng Garnier:</span>
                    {[
                      'Vàng Chanh (Light Complete)',
                      'Vàng Cam (Anti-Acne)',
                      'Hồng (Sakura Glow)',
                      'Đỏ (Ageless Booster)',
                      'Xanh (Super UV)'
                    ].map((colorName) => (
                      <button
                        key={colorName}
                        type="button"
                        onClick={() => {
                          const emptyIdx = shopeeItems.findIndex(it => !it.name.trim());
                          if (emptyIdx !== -1) {
                            handleUpdateShopeeItem(shopeeItems[emptyIdx].id, { name: colorName });
                          } else {
                            handleAddShopeeItem({ name: colorName });
                          }
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition font-medium"
                      >
                        +{colorName}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-zinc-400">Tone màu khác:</span>
                    {['Xám Nhung', 'Đen Nhung', 'Đỏ Ruby', 'Cam Cháy', 'Hồng Đào', 'Trắng Sữa', 'Tone 21 (Sáng)', 'Tone 23 (Tự Nhiên)'].map((colorName) => (
                      <button
                        key={colorName}
                        type="button"
                        onClick={() => {
                          const emptyIdx = shopeeItems.findIndex(it => !it.name.trim());
                          if (emptyIdx !== -1) {
                            handleUpdateShopeeItem(shopeeItems[emptyIdx].id, { name: colorName });
                          } else {
                            handleAddShopeeItem({ name: colorName });
                          }
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition"
                      >
                        +{colorName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DANH SÁCH CÁC MÓN PHÂN LOẠI (MỖI DÒNG = 1 MÓN CÓ ẢNH & GIÁ RIÊNG) */}
                {shopeeItems.length === 0 ? (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-zinc-800 text-center space-y-2 bg-zinc-950/40">
                    <p className="text-zinc-400 text-xs font-semibold">
                      Chưa có món nào trong danh sách.
                    </p>
                    <p className="text-zinc-500 text-[11px]">
                      Bấm nút <strong>📸 Tải ảnh</strong> ở trên để tự động tạo món theo từng ảnh, hoặc bấm <strong>+ Thêm món mới</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-900/60">
                            <th className="py-2.5 px-3 text-center w-10">STT</th>
                            <th className="py-2.5 px-3 w-28">Ảnh đại diện</th>
                            <th className="py-2.5 px-3">Tên món / màu / loại *</th>
                            <th className="py-2.5 px-3 text-emerald-400 w-36">Giá lẻ Kíp (₭) *</th>
                            <th className="py-2.5 px-3 text-amber-400 w-28">Giá lẻ Baht (฿)</th>
                            <th className="py-2.5 px-3 text-amber-400 w-32">Giá sỉ Kíp (₭)</th>
                            <th className="py-2.5 px-3 w-20">Kho</th>
                            <th className="py-2.5 px-3 text-center w-20">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                          {shopeeItems.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-zinc-900/40 transition">
                              {/* STT */}
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-zinc-500">
                                {idx + 1}
                              </td>

                              {/* Ảnh đại diện riêng của món */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="relative w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden flex-shrink-0 group">
                                    {item.image ? (
                                      <>
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 p-0.5">
                                          <label
                                            htmlFor={`item-img-upload-${item.id}`}
                                            className="p-1 rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-500"
                                            title="Đổi ảnh này"
                                          >
                                            <Camera className="w-3 h-3" />
                                          </label>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateShopeeItem(item.id, { image: '' })}
                                            className="p-1 rounded-md bg-red-600 text-white hover:bg-red-500"
                                            title="Xóa ảnh này"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </>
                                    ) : (
                                      <label
                                        htmlFor={`item-img-upload-${item.id}`}
                                        className="w-full h-full flex flex-col items-center justify-center text-zinc-500 hover:text-orange-400 hover:border-orange-500 cursor-pointer transition text-center p-1"
                                        title="Bấm để tải ảnh cho món này"
                                      >
                                        <Camera className="w-4 h-4 mb-0.5" />
                                        <span className="text-[8px] font-bold">+ Ảnh</span>
                                      </label>
                                    )}
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`item-img-upload-${item.id}`}
                                    className="hidden"
                                    onChange={(e) => handleSingleItemImageUpload(idx, e.target.files)}
                                  />
                                </div>
                              </td>

                              {/* Tên món / màu / loại */}
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => handleUpdateShopeeItem(item.id, { name: e.target.value })}
                                  placeholder="Ví dụ: Vàng chanh 7ml, Đỏ Ruby..."
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500 rounded-lg px-2.5 py-1.5 text-white font-medium text-xs outline-none"
                                />
                              </td>

                              {/* Giá lẻ Kíp */}
                              <td className="py-2.5 px-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.price}
                                  onChange={(e) => handleUpdateShopeeItem(item.id, { price: e.target.value })}
                                  placeholder="Giá Kíp (₭)"
                                  className="w-full bg-zinc-900 border border-emerald-500/40 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-emerald-300 font-mono font-bold text-xs outline-none"
                                />
                              </td>

                              {/* Giá lẻ Baht */}
                              <td className="py-2.5 px-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.priceTHB}
                                  onChange={(e) => handleUpdateShopeeItem(item.id, { priceTHB: e.target.value })}
                                  placeholder="Baht ฿"
                                  className="w-full bg-zinc-900 border border-amber-500/30 focus:border-amber-500 rounded-lg px-2 py-1.5 text-amber-300 font-mono text-xs outline-none"
                                />
                              </td>

                              {/* Giá sỉ Kíp */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    value={item.wholesalePrice}
                                    onChange={(e) => handleUpdateShopeeItem(item.id, { wholesalePrice: e.target.value })}
                                    placeholder="Giá sỉ ₭"
                                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500 rounded-lg px-2 py-1.5 text-amber-400 font-mono text-xs outline-none"
                                  />
                                  {item.price && Number(item.price) > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const r = Number(item.price);
                                        const sug = Math.round(r * 0.8 / 1000) * 1000;
                                        handleUpdateShopeeItem(item.id, { wholesalePrice: sug.toString() });
                                      }}
                                      className="p-1 text-[9px] text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30 flex-shrink-0"
                                      title="Tính giá sỉ = 80% giá lẻ"
                                    >
                                      -20%
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* Tồn kho */}
                              <td className="py-2.5 px-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.stock}
                                  onChange={(e) => handleUpdateShopeeItem(item.id, { stock: e.target.value })}
                                  placeholder="Kho"
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-blue-500 rounded-lg px-2 py-1.5 text-zinc-200 font-mono text-xs outline-none text-center"
                                />
                              </td>

                              {/* Thao tác */}
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDuplicateShopeeItem(item)}
                                    className="p-1.5 text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition"
                                    title="Nhân bản món này để sửa nhanh"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveShopeeItem(item.id)}
                                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                    title="Xóa món này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="sm:hidden space-y-3">
                      {shopeeItems.map((item, idx) => (
                        <div key={item.id} className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-orange-400"># Món {idx + 1}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDuplicateShopeeItem(item)}
                                className="text-purple-400 p-1 hover:bg-purple-500/10 rounded"
                                title="Nhân bản"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveShopeeItem(item.id)}
                                className="text-red-400 p-1 hover:bg-red-500/10 rounded"
                                title="Xóa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="relative w-14 h-14 rounded-xl bg-zinc-950 border border-zinc-700 overflow-hidden flex-shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <label
                                  htmlFor={`mobile-item-img-${item.id}`}
                                  className="w-full h-full flex flex-col items-center justify-center text-zinc-500 cursor-pointer text-center p-1"
                                >
                                  <Camera className="w-4 h-4 mb-0.5" />
                                  <span className="text-[8px] font-bold">+ Ảnh</span>
                                </label>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              id={`mobile-item-img-${item.id}`}
                              className="hidden"
                              onChange={(e) => handleSingleItemImageUpload(idx, e.target.files)}
                            />

                            <div className="flex-1 min-w-0">
                              <label className="text-[10px] text-zinc-400 block mb-0.5">Tên món / màu *</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleUpdateShopeeItem(item.id, { name: e.target.value })}
                                placeholder="Ví dụ: Vàng chanh 7ml..."
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-orange-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-emerald-400 block mb-0.5 font-bold">Giá lẻ Kíp (₭) *</label>
                              <input
                                type="number"
                                min="0"
                                value={item.price}
                                onChange={(e) => handleUpdateShopeeItem(item.id, { price: e.target.value })}
                                placeholder="₭ Kíp"
                                className="w-full bg-zinc-950 border border-emerald-500/40 rounded-lg px-2 py-1 text-emerald-300 font-mono text-xs outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-amber-400 block mb-0.5 font-bold">Giá lẻ Baht (฿)</label>
                              <input
                                type="number"
                                min="0"
                                value={item.priceTHB}
                                onChange={(e) => handleUpdateShopeeItem(item.id, { priceTHB: e.target.value })}
                                placeholder="฿ Baht"
                                className="w-full bg-zinc-950 border border-amber-500/30 rounded-lg px-2 py-1 text-amber-300 font-mono text-xs outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-amber-400 block mb-0.5">Giá sỉ Kíp (₭)</label>
                              <input
                                type="number"
                                min="0"
                                value={item.wholesalePrice}
                                onChange={(e) => handleUpdateShopeeItem(item.id, { wholesalePrice: e.target.value })}
                                placeholder="Giá sỉ ₭"
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-amber-400 font-mono text-xs outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-zinc-400 block mb-0.5">Tồn kho</label>
                              <input
                                type="number"
                                min="0"
                                value={item.stock}
                                onChange={(e) => handleUpdateShopeeItem(item.id, { stock: e.target.value })}
                                placeholder="20"
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-white font-mono text-xs outline-none text-center"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

      {/* MODAL SỬA NHANH 2 BẢNG GIÁ (POPUP SIÊU TỐC) */}
      {quickModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setQuickModalProduct(null)} />
          
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">Sửa Nhanh Bảng Giá</h3>
                  <p className="text-[11px] text-zinc-400 truncate max-w-[220px] sm:max-w-xs">{quickModalProduct.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickModalProduct(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickModal} className="py-4 space-y-4 text-xs">
              {/* Nhóm Giá Bán Lẻ */}
              <div className="p-3.5 bg-zinc-950 rounded-2xl border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Giá Bán Lẻ (Khách lẻ)</span>
                  </label>
                  <span className="text-[10px] text-zinc-500">Bắt buộc</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Tiền Kíp (₭) *</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="0"
                        autoFocus
                        value={quickModalForm.price}
                        onChange={(e) => setQuickModalForm({ ...quickModalForm, price: e.target.value })}
                        placeholder="Ví dụ: 59000"
                        className="w-full bg-zinc-900 border border-zinc-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white font-mono font-bold outline-none"
                      />
                      <span className="absolute right-2.5 top-2 text-emerald-400 font-bold">₭</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Tiền Baht (฿) (Tùy chọn)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={quickModalForm.priceTHB}
                        onChange={(e) => setQuickModalForm({ ...quickModalForm, priceTHB: e.target.value })}
                        placeholder="Ví dụ: 95"
                        className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500 rounded-xl px-3 py-2 text-white font-mono outline-none"
                      />
                      <span className="absolute right-2.5 top-2 text-amber-400 font-bold">฿</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nhóm Giá Bán Sỉ */}
              <div className="p-3.5 bg-zinc-950 rounded-2xl border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5" />
                    <span>Giá Bán Sỉ (Khách sỉ ⚡)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const retail = Number(quickModalForm.price);
                      if (retail > 0) {
                        const sug = Math.round(retail * 0.8 / 1000) * 1000;
                        setQuickModalForm(prev => ({ ...prev, wholesalePrice: sug.toString() }));
                      }
                    }}
                    className="text-[10px] text-amber-300 font-bold hover:underline"
                  >
                    ⚡ Gợi ý sỉ -20%
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Tiền Kíp Sỉ (₭)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={quickModalForm.wholesalePrice}
                        onChange={(e) => setQuickModalForm({ ...quickModalForm, wholesalePrice: e.target.value })}
                        placeholder="Ví dụ: 52000"
                        className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500 rounded-xl px-3 py-2 text-white font-mono font-bold outline-none"
                      />
                      <span className="absolute right-2.5 top-2 text-amber-400 font-bold">₭</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Tiền Baht Sỉ (฿)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={quickModalForm.wholesalePriceTHB}
                        onChange={(e) => setQuickModalForm({ ...quickModalForm, wholesalePriceTHB: e.target.value })}
                        placeholder="Ví dụ: 80"
                        className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500 rounded-xl px-3 py-2 text-white font-mono outline-none"
                      />
                      <span className="absolute right-2.5 top-2 text-amber-400 font-bold">฿</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setQuickModalProduct(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={quickModalSaving}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {quickModalSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Lưu Bảng Giá Ngay</span>
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
