'use client';

import React, { useState, useEffect } from 'react';
import { Category, SubCategory } from '@/lib/types';
import { FolderTree, Plus, Trash2, Edit3, X, Check, AlertCircle, Sparkles, Tag } from 'lucide-react';

const EMOJI_PRESETS = ['🌸', '💄', '🧴', '✨', '🌿', '💎', '💅', '🧖‍♀️', '🎁', '☀️', '🧼', '👁️'];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    nameLao: '',
    icon: '🌸',
    subCategoriesStr: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      nameLao: '',
      icon: '🌸',
      subCategoriesStr: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    const subStr = cat.subCategories ? cat.subCategories.map(s => s.name).join(', ') : '';
    setFormData({
      name: cat.name,
      nameLao: cat.nameLao || '',
      icon: cat.icon || '🌸',
      subCategoriesStr: subStr,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên danh mục');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      // Parse subcategories from comma-separated string
      const subs = formData.subCategoriesStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map((subName, idx) => ({
          id: `sub-${Date.now()}-${idx}`,
          name: subName,
          slug: subName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
          categoryId: editingCategory ? editingCategory.id : '',
        }));

      if (editingCategory) {
        // UPDATE
        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            nameLao: formData.nameLao.trim(),
            icon: formData.icon,
            subCategories: subs,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Cập nhật thất bại');
        } else {
          setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...data.category } : c));
          setSuccessMsg('Đã cập nhật danh mục thành công!');
          setTimeout(() => setSuccessMsg(''), 3000);
          setIsModalOpen(false);
        }
      } else {
        // CREATE
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            nameLao: formData.nameLao.trim(),
            icon: formData.icon,
            subCategories: subs,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Tạo danh mục thất bại');
        } else {
          setCategories(prev => [...prev, data.category]);
          setSuccessMsg('Đã tạo danh mục mới thành công!');
          setTimeout(() => setSuccessMsg(''), 3000);
          setIsModalOpen(false);
        }
      }
    } catch {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xác nhận xóa danh mục "${name}"? Các món trong danh mục này có thể cần chuyển danh mục khác.`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        setSuccessMsg(`Đã xóa danh mục "${name}"`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert('Không thể xóa danh mục này.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <FolderTree className="w-7 h-7 text-blue-500" />
            <span>Quản Lý & Thêm Danh Mục</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Tạo các nhóm sản phẩm (Ví dụ: Chăm sóc da, Trang điểm, Nước hoa...) để khách dễ tìm kiếm
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm Danh Mục Mới</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl hover:border-zinc-700 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-2xl flex items-center justify-center flex-shrink-0 border border-zinc-700 shadow-inner">
                    {c.icon && c.icon.length <= 4 ? c.icon : '🌸'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{c.name}</h3>
                    {c.nameLao && <p className="text-xs text-rose-300 font-medium">{c.nameLao}</p>}
                    <span className="text-[10px] text-zinc-500 font-mono">slug: {c.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-lg transition"
                    title="Chỉnh sửa danh mục"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition"
                    title="Xóa danh mục"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {c.subCategories && c.subCategories.length > 0 && (
                <div className="mt-4 pt-3 border-t border-zinc-800 space-y-1.5">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Mục phân loại nhỏ ({c.subCategories.length}):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.subCategories.map((s) => (
                      <span
                        key={s.id}
                        className="text-[11px] bg-zinc-800/90 text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-700/60 font-medium"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
              <span>ID: {c.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-blue-500" />
              <span>{editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</span>
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Điền tên danh mục tiếng Việt, tiếng Lào và các mục con
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2 border border-red-500/30">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Tên danh mục */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Tên danh mục (Tiếng Việt) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Chăm Sóc Da Mặt, Son Môi..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Tên tiếng Lào */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Tên danh mục bằng Tiếng Lào (ຊື່ໝວດໝູ່)
                </label>
                <input
                  type="text"
                  value={formData.nameLao}
                  onChange={(e) => setFormData({ ...formData, nameLao: e.target.value })}
                  placeholder="Ví dụ: ບຳລຸງຜິວໜ້າ, ລິບສະຕິກ..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Icon / Emoji */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Biểu tượng Icon / Emoji
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xl flex-shrink-0">
                    {formData.icon || '🌸'}
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🌸"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500 text-sm font-medium"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  {EMOJI_PRESETS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center hover:bg-zinc-800 transition ${
                        formData.icon === emoji ? 'bg-blue-600/30 ring-1 ring-blue-500' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phân loại nhỏ (Subcategories) */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Mục con / Phân loại nhỏ (Cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formData.subCategoriesStr}
                  onChange={(e) => setFormData({ ...formData, subCategoriesStr: e.target.value })}
                  placeholder="Ví dụ: Serum, Kem chống nắng, Sữa rửa mặt"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Nhập các nhánh nhỏ ngăn cách nhau bằng dấu phẩy. Khách hàng có thể lọc theo từng mục nhỏ này.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition active:scale-95"
                >
                  {submitting ? 'Đang lưu...' : editingCategory ? 'Lưu Thay Đổi' : 'Tạo Danh Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
