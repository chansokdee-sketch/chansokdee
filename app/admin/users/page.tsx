'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  ShieldCheck, 
  UserCheck, 
  Trash2, 
  X, 
  AlertCircle, 
  Check, 
  Smartphone, 
  Lock, 
  User as UserIcon,
  ShoppingBag,
  Boxes,
  Tag,
  Edit3,
  KeyRound,
  MapPin,
  RefreshCw,
  Phone
} from 'lucide-react';

interface UserItem {
  id: string;
  phone: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'USER';
  customerType?: 'RETAIL' | 'WHOLESALE';
  address?: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'WHOLESALE' | 'RETAIL' | 'MANAGER' | 'STAFF'>('ALL');

  // Modal Thêm Mới Tài Khoản (Khách sỉ, Khách lẻ, Quản lý, Nhân viên)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    password: 'Password@123',
    address: '',
    role: 'USER' as 'USER' | 'STAFF' | 'MANAGER',
    customerType: 'WHOLESALE' as 'WHOLESALE' | 'RETAIL',
  });

  // Modal Sửa Tài Khoản
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    address: '',
    customerType: 'RETAIL' as 'WHOLESALE' | 'RETAIL',
    role: 'USER' as 'USER' | 'STAFF' | 'MANAGER' | 'ADMIN',
    newPassword: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatPriceLAK = (price: number) => {
    return new Intl.NumberFormat('lo-LA').format(price) + ' ₭';
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN');
  };

  // Tạo tài khoản mới bởi Admin
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || 'Không thể tạo tài khoản');
      } else {
        setIsAddModalOpen(false);
        setNewUser({
          name: '',
          phone: '',
          password: 'Password@123',
          address: '',
          role: 'USER',
          customerType: 'WHOLESALE',
        });
        fetchUsers();
      }
    } catch {
      setModalError('Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  // Mở modal sửa thông tin
  const openEditModal = (u: UserItem) => {
    setEditingUser(u);
    setEditForm({
      name: u.name || '',
      address: u.address || '',
      customerType: u.customerType || 'RETAIL',
      role: u.role,
      newPassword: '',
    });
    setModalError('');
    setIsEditModalOpen(true);
  };

  // Lưu sửa thông tin
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setModalError('');
    setSubmitting(true);

    try {
      const payload: any = {
        id: editingUser.id,
        name: editForm.name.trim(),
        address: editForm.address.trim(),
        customerType: editForm.customerType,
      };

      if (editingUser.role !== 'ADMIN') {
        payload.role = editForm.role;
      }

      if (editForm.newPassword.trim()) {
        payload.password = editForm.newPassword.trim();
      }

      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || 'Cập nhật tài khoản thất bại');
      } else {
        setIsEditModalOpen(false);
        fetchUsers();
      }
    } catch {
      setModalError('Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  // Nút 1 chạm: Đổi nhanh Khách sỉ <-> Khách lẻ
  const handleQuickToggleCustomerType = async (u: UserItem) => {
    if (u.role === 'ADMIN') return;
    const nextType = u.customerType === 'WHOLESALE' ? 'RETAIL' : 'WHOLESALE';
    const label = nextType === 'WHOLESALE' ? 'KHÁCH SỈ ⚡ (Mua theo Giá sỉ)' : 'KHÁCH LẺ (Mua theo Giá lẻ)';

    if (!confirm(`Bạn có chắc muốn chuyển tài khoản "${u.name || u.phone}" thành ${label}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: u.id, customerType: nextType }),
      });

      if (res.ok) {
        setUsers(prev => prev.map(item => item.id === u.id ? { ...item, customerType: nextType } : item));
      } else {
        const data = await res.json();
        alert(data.error || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (u: UserItem) => {
    if (u.role === 'ADMIN') return;
    if (!confirm(`Bạn có chắc muốn xóa tài khoản "${u.name || u.phone}" khỏi hệ thống?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${u.id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(item => item.id !== u.id));
      } else {
        const data = await res.json();
        alert(data.error || 'Không thể xóa tài khoản');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const wholesaleCount = users.filter(u => u.role === 'USER' && u.customerType === 'WHOLESALE').length;
  const retailCount = users.filter(u => u.role === 'USER' && u.customerType !== 'WHOLESALE').length;
  const managerCount = users.filter(u => u.role === 'MANAGER').length;
  const staffCount = users.filter(u => u.role === 'STAFF').length;

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.phone.includes(search) || (u.name && u.name.toLowerCase().includes(search.toLowerCase()));
    if (!matchesSearch) return false;

    if (activeTab === 'WHOLESALE') return u.role === 'USER' && u.customerType === 'WHOLESALE';
    if (activeTab === 'RETAIL') return u.role === 'USER' && u.customerType !== 'WHOLESALE';
    if (activeTab === 'MANAGER') return u.role === 'MANAGER';
    if (activeTab === 'STAFF') return u.role === 'STAFF' || u.role === 'ADMIN';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span>Quản Lý Khách Hàng (Sỉ / Lẻ) & Nhân Viên</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Boss Hải có quyền <strong>tạo tài khoản khách hàng mới</strong>, phân loại <strong>Khách sỉ ⚡ (Giá sỉ)</strong> và <strong>Khách lẻ (Giá lẻ)</strong>.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError('');
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Tạo Tài Khoản Khách Hàng / Nhân Viên</span>
        </button>
      </div>

      {/* Phân loại Khách hàng & Giá bán */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-3">
        <div className="flex items-center gap-2 text-white font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Chính sách giá theo từng loại tài khoản:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-zinc-300 text-[11px]">
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-amber-500/30">
            <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
              <Boxes className="w-3.5 h-3.5" />
              <span>🏢 Khách Sỉ ⚡ (Đại lý buôn):</span>
            </div>
            <span>Tài khoản khách sỉ đăng nhập vào web sẽ <strong>tự động mua theo Bảng Giá Sỉ</strong> cho mọi sản phẩm, không phụ thuộc số lượng!</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/70 border border-blue-500/30">
            <div className="font-bold text-blue-400 flex items-center gap-1.5 mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>👤 Khách Lẻ (Người tiêu dùng):</span>
            </div>
            <span>Tài khoản khách lẻ mua theo <strong>Bảng Giá Lẻ</strong> niêm yết chuẩn của cửa hàng.</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/70 border border-emerald-500/30">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>👔 Nhân Viên (Staff):</span>
            </div>
            <span>Tài khoản nhân viên được cấp quyền thêm món mới, cập nhật giá, chụp ảnh điện thoại và quản lý đơn hàng.</span>
          </div>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Tất cả</span>
            <span className="text-[10px] bg-zinc-950 px-1.5 py-0.2 rounded-full text-zinc-300">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('WHOLESALE')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'WHOLESALE'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-xs'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>🏢 Khách Sỉ ⚡</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'WHOLESALE' ? 'bg-amber-600 text-white' : 'bg-zinc-950 text-amber-400'
            }`}>
              {wholesaleCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('RETAIL')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'RETAIL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>👤 Khách Lẻ</span>
            <span className="text-[10px] bg-zinc-950 px-1.5 py-0.2 rounded-full text-zinc-300">
              {retailCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('MANAGER')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'MANAGER'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>💼 Quản Lý</span>
            <span className="text-[10px] bg-zinc-950 px-1.5 py-0.2 rounded-full text-zinc-300">
              {managerCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('STAFF')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'STAFF'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>👔 Nhân Viên</span>
            <span className="text-[10px] bg-zinc-950 px-1.5 py-0.2 rounded-full text-zinc-300">
              {staffCount}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc số điện thoại..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 pl-10 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Users Container: Mobile Cards (md:hidden) and Desktop Table (hidden md:block) */}
      
      {/* 1. Mobile Cards View */}
      <div className="md:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-3xl text-zinc-400 text-xs">
            Không tìm thấy tài khoản nào
          </div>
        ) : (
          filteredUsers.map((u) => {
            const isAdmin = u.role === 'ADMIN';
            const isManager = u.role === 'MANAGER';
            const isStaff = u.role === 'STAFF';
            const isWholesale = u.role === 'USER' && u.customerType === 'WHOLESALE';
            const isRetail = u.role === 'USER' && u.customerType !== 'WHOLESALE';

            return (
              <div 
                key={u.id}
                className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 shadow-md"
              >
                {/* Header: Avatar + Tên + Phân loại */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isAdmin 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                        : isManager
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : isStaff 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isWholesale
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}>
                      {isAdmin ? '👑' : isManager ? '💼' : isStaff ? '👔' : isWholesale ? '🏢' : '👤'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{u.name || 'Chưa đặt tên'}</h4>
                      <span className="text-[10px] text-zinc-500">Tạo: {formatDate(u.createdAt)}</span>
                    </div>
                  </div>

                  <div>
                    {isAdmin ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        👑 Admin
                      </span>
                    ) : isManager ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        💼 Quản Lý
                      </span>
                    ) : isStaff ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        👔 Staff
                      </span>
                    ) : isWholesale ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        🏢 Sỉ ⚡
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                        👤 Lẻ
                      </span>
                    )}
                  </div>
                </div>

                {/* Số điện thoại + Nút gọi 1 chạm */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-blue-400 text-xs">{u.phone}</span>
                  <a
                    href={`tel:${u.phone}`}
                    className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1 active:scale-95"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Gọi điện</span>
                  </a>
                </div>

                {/* Địa chỉ & Thống kê chi tiêu */}
                <div className="p-2.5 bg-zinc-950/60 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400">Đơn hàng: <strong className="text-white">{u.orderCount}</strong></span>
                    <span className="text-zinc-400">Đã chi: <strong className="text-emerald-400 font-mono">{formatPriceLAK(u.totalSpent)}</strong></span>
                  </div>
                  {u.address && (
                    <p className="text-[11px] text-zinc-400 truncate pt-0.5 border-t border-zinc-900">
                      📍 {u.address}
                    </p>
                  )}
                </div>

                {/* Chuyển đổi 1 chạm (Khách sỉ / lẻ) & Thao tác */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  {!isAdmin && !isStaff ? (
                    <button
                      type="button"
                      onClick={() => handleQuickToggleCustomerType(u)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
                        isWholesale
                          ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-zinc-950'
                      }`}
                    >
                      <Boxes className="w-3 h-3" />
                      <span>{isWholesale ? 'Chuyển Khách Lẻ' : '⚡ Lên Khách Sỉ'}</span>
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(u)}
                      className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition flex items-center gap-1 active:scale-95"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa/Đổi pass</span>
                    </button>
                    {!isAdmin && (
                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition active:scale-95"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Desktop Table (hidden md:block) */}
      <div className="hidden md:block bg-zinc-900 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/50">
                <th className="py-4 px-6 font-semibold">Tên & Tài Khoản</th>
                <th className="py-4 px-4 font-semibold">Số điện thoại</th>
                <th className="py-4 px-4 font-semibold">Phân loại & Giá áp dụng</th>
                <th className="py-4 px-4 font-semibold">Địa chỉ giao</th>
                <th className="py-4 px-4 font-semibold">Đơn hàng</th>
                <th className="py-4 px-6 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredUsers.map((u) => {
                const isAdmin = u.role === 'ADMIN';
                const isManager = u.role === 'MANAGER';
                const isStaff = u.role === 'STAFF';
                const isWholesale = u.role === 'USER' && u.customerType === 'WHOLESALE';
                const isRetail = u.role === 'USER' && u.customerType !== 'WHOLESALE';

                return (
                  <tr key={u.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isAdmin 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                            : isManager
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : isStaff 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : isWholesale
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {isAdmin ? '👑' : isManager ? '💼' : isStaff ? '👔' : isWholesale ? '🏢' : '👤'}
                        </div>
                        <div>
                          <p className="font-bold text-white">{u.name || 'Chưa đặt tên'}</p>
                          <span className="text-[10px] text-zinc-500">Tạo: {formatDate(u.createdAt)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-blue-400">
                      <a href={`tel:${u.phone}`} className="hover:underline">
                        {u.phone}
                      </a>
                    </td>

                    {/* Cột Phân loại & Giá áp dụng */}
                    <td className="py-4 px-4">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          👑 Boss Hải (Quản trị)
                        </span>
                      ) : isManager ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          💼 Quản Lý (Điều phối)
                        </span>
                      ) : isStaff ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          👔 Nhân viên
                        </span>
                      ) : isWholesale ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <Boxes className="w-3 h-3" />
                            <span>Khách Sỉ ⚡ (Bảng Giá Sỉ)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickToggleCustomerType(u)}
                            className="block text-[10px] text-zinc-400 hover:text-white underline transition"
                            title="Bấm để chuyển về Khách lẻ"
                          >
                            Đổi thành Khách lẻ
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            <Tag className="w-3 h-3" />
                            <span>Khách Lẻ (Bảng Giá Lẻ)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickToggleCustomerType(u)}
                            className="block text-[10px] text-amber-400 hover:text-amber-300 font-bold underline transition"
                            title="Bấm để nâng cấp lên Khách sỉ"
                          >
                            ⚡ Nâng cấp thành Khách Sỉ
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-zinc-400 max-w-[200px] truncate" title={u.address}>
                      {u.address || <span className="text-zinc-600 italic">Chưa có</span>}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{u.orderCount} đơn</div>
                      <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                        {formatPriceLAK(u.totalSpent)}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-lg transition"
                          title="Sửa thông tin hoặc đổi mật khẩu"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {!isAdmin && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: TẠO TÀI KHOẢN MỚI CHO ADMIN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                <span>Tạo Tài Khoản Mới (Khách / Nhân Viên)</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-3 p-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5 mt-4 text-xs">
              
              {/* Chọn loại tài khoản */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1.5">Loại tài khoản muốn tạo *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewUser({ ...newUser, role: 'USER', customerType: 'WHOLESALE' })}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      newUser.role === 'USER' && newUser.customerType === 'WHOLESALE'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Boxes className="w-4 h-4" />
                    <span className="text-[11px]">Khách Sỉ ⚡</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewUser({ ...newUser, role: 'USER', customerType: 'RETAIL' })}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      newUser.role === 'USER' && newUser.customerType === 'RETAIL'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span className="text-[11px]">Khách Lẻ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewUser({ ...newUser, role: 'MANAGER', customerType: 'RETAIL' })}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      newUser.role === 'MANAGER'
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[11px]">Quản Lý 💼</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewUser({ ...newUser, role: 'STAFF', customerType: 'RETAIL' })}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      newUser.role === 'STAFF'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span className="text-[11px]">Nhân Viên 👔</span>
                  </button>
                </div>
              </div>

              {/* Tên */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  {newUser.customerType === 'WHOLESALE' ? 'Tên Đại lý / Tên Khách sỉ *' : 'Họ và tên *'}
                </label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder={newUser.customerType === 'WHOLESALE' ? 'Ví dụ: Shop Mỹ Phẩm Vientiane' : 'Ví dụ: Somchai, Nguyễn Văn A...'}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Số điện thoại (Dùng để đăng nhập) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="Ví dụ: 02055777975 hoặc 0912345678"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <Smartphone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Mật khẩu đăng nhập *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">Mặc định gợi ý Password@123 để khách dễ đăng nhập.</span>
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Địa chỉ giao hàng (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  placeholder="Ví dụ: Vientiane, Pakse, Luang Prabang..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Nút bấm */}
              <div className="pt-3 flex justify-end gap-2.5 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{submitting ? 'Đang tạo...' : 'Tạo tài khoản'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SỬA TÀI KHOẢN & ĐỔI PHÂN LOẠI / MẬT KHẨU */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)} />

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-500" />
                <span>Chỉnh Sửa Tài Khoản ({editingUser.phone})</span>
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-3 p-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-3.5 mt-4 text-xs">
              
              {/* Phân loại khách hàng / Quản lý / Nhân viên */}
              {editingUser.role !== 'ADMIN' && (
                <div>
                  <label className="block text-zinc-300 font-bold mb-1.5">Phân loại tài khoản *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, role: 'USER', customerType: 'WHOLESALE' })}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        editForm.role === 'USER' && editForm.customerType === 'WHOLESALE'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Boxes className="w-4 h-4" />
                      <span className="text-[11px]">Khách Sỉ ⚡</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, role: 'USER', customerType: 'RETAIL' })}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        editForm.role === 'USER' && editForm.customerType === 'RETAIL'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Tag className="w-4 h-4" />
                      <span className="text-[11px]">Khách Lẻ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, role: 'MANAGER', customerType: 'RETAIL' })}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        editForm.role === 'MANAGER'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[11px]">Quản Lý 💼</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, role: 'STAFF', customerType: 'RETAIL' })}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                        editForm.role === 'STAFF'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span className="text-[11px]">Nhân Viên 👔</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tên */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Tên khách / Tên nhân viên</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Đổi mật khẩu mới nếu cần */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Đổi mật khẩu mới (Để trống nếu không đổi)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Địa chỉ nhận hàng</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Nút bấm */}
              <div className="pt-3 flex justify-end gap-2.5 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{submitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
