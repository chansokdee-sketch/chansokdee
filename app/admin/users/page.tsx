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
  ShoppingBag
} from 'lucide-react';

interface UserItem {
  id: string;
  phone: string;
  name: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
  address?: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'STAFF' | 'USER'>('STAFF');

  // Modal State for adding new staff
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    phone: '',
    password: '',
    address: '',
    role: 'STAFF' as 'STAFF' | 'USER'
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN');
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || 'Không thể tạo tài khoản nhân viên');
      } else {
        setIsAddModalOpen(false);
        setNewStaff({ name: '', phone: '', password: '', address: '', role: 'STAFF' });
        fetchUsers();
      }
    } catch {
      setModalError('Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleRole = async (u: UserItem) => {
    if (u.role === 'ADMIN') return;
    const targetRole = u.role === 'STAFF' ? 'USER' : 'STAFF';
    const actionLabel = targetRole === 'STAFF' ? 'cấp quyền Nhân Viên' : 'chuyển thành Khách Hàng';

    if (!confirm(`Bạn có chắc muốn ${actionLabel} cho tài khoản "${u.name || u.phone}"?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: u.id, role: targetRole }),
      });

      if (res.ok) {
        setUsers(prev => prev.map(item => item.id === u.id ? { ...item, role: targetRole } : item));
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

  const staffCount = users.filter(u => u.role === 'STAFF').length;
  const customerCount = users.filter(u => u.role === 'USER').length;

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.phone.includes(search) || (u.name && u.name.toLowerCase().includes(search.toLowerCase()));
    if (!matchesSearch) return false;

    if (activeTab === 'STAFF') return u.role === 'STAFF' || u.role === 'ADMIN';
    if (activeTab === 'USER') return u.role === 'USER';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span>Mục Quản Lý Nhân Viên & Khách Hàng</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Quản lý danh sách nhân viên phục vụ, phân quyền thêm món, nhận order và thông tin khách mua hàng.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError('');
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm Nhân Viên Mới</span>
        </button>
      </div>

      {/* Staff Capabilities Highlight Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-zinc-900 to-emerald-950/30 border border-zinc-800 text-xs space-y-2">
        <div className="flex items-center gap-2 text-white font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Phân quyền tài khoản trong hệ thống NovaBeauty:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-zinc-300 text-[11px]">
          <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
            <span className="font-bold text-amber-400">👑 Boss Hải (Quản trị viên):</span> Toàn quyền cao nhất. Cấu hình website, xem doanh thu tổng, chỉnh sửa danh mục, quản lý và cấp quyền nhân viên.
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
            <span className="font-bold text-emerald-400">👔 Nhân Viên (Staff):</span> Thêm món mới, cập nhật giá/tồn kho, tải ảnh sản phẩm trực tiếp từ điện thoại, nhận và xử lý đơn order từ khách.
          </div>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs">
          <button
            onClick={() => setActiveTab('STAFF')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'STAFF'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>👔 Nhân Viên</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'STAFF' ? 'bg-emerald-700 text-white' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {staffCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('USER')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeTab === 'USER'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>👤 Khách Hàng</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'USER' ? 'bg-blue-700 text-white' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {customerCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-2 rounded-xl font-bold transition ${
              activeTab === 'ALL'
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tất cả ({users.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo số điện thoại hoặc tên..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Users & Staff Table */}
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/50">
                <th className="py-4 px-6 font-semibold">Tên & Thông tin</th>
                <th className="py-4 px-4 font-semibold">Số điện thoại đăng nhập</th>
                <th className="py-4 px-4 font-semibold">Vai trò hệ thống</th>
                <th className="py-4 px-4 font-semibold">Chức năng cho phép</th>
                <th className="py-4 px-4 font-semibold">Đơn mua</th>
                <th className="py-4 px-6 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-zinc-500">
                    Không tìm thấy tài khoản nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isBoss = u.role === 'ADMIN';
                  const isStaff = u.role === 'STAFF';

                  return (
                    <tr key={u.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs ${
                            isBoss
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : isStaff
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {isBoss ? '👑' : isStaff ? '👔' : (u.name ? u.name.slice(0, 1).toUpperCase() : 'U')}
                          </div>
                          <div>
                            <p className="font-bold text-white flex items-center gap-1.5">
                              <span>{u.name || 'Người dùng'}</span>
                              {isBoss && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                                  Chủ quán
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-zinc-500 truncate max-w-xs">{u.address || 'Chưa cập nhật chi nhánh/địa chỉ'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-blue-400">{u.phone}</td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          isBoss
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : isStaff
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}>
                          {isBoss ? '👑 Boss Hải' : isStaff ? '👔 Nhân Viên' : '👤 Khách Hàng'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-zinc-300">
                        {isBoss ? (
                          <span className="text-amber-400 font-semibold text-[11px]">Toàn quyền hệ thống</span>
                        ) : isStaff ? (
                          <span className="text-emerald-400 font-medium text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            Thêm món, Nhận order khách
                          </span>
                        ) : (
                          <span className="text-zinc-500 text-[11px]">Mua hàng & theo dõi đơn</span>
                        )}
                      </td>

                      <td className="py-4 px-4 font-semibold text-zinc-300">
                        {u.orderCount} đơn ({formatPrice(u.totalSpent)})
                      </td>

                      <td className="py-4 px-6 text-right">
                        {isBoss ? (
                          <span className="text-[11px] text-zinc-500 italic">Mặc định</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* Role Toggle Button */}
                            <button
                              onClick={() => handleToggleRole(u)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                                isStaff
                                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                                  : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                              }`}
                              title={isStaff ? 'Hạ quyền xuống khách hàng' : 'Cấp quyền nhân viên'}
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>{isStaff ? 'Về Khách Hàng' : '⚡ Lên Nhân Viên'}</span>
                            </button>

                            {/* Delete User Button */}
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition"
                              title="Xóa tài khoản này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Thêm Nhân Viên Mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                👔
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Thêm Tài Khoản Nhân Viên</h2>
                <p className="text-xs text-zinc-400">Nhân viên có quyền thêm món và nhận đơn order</p>
              </div>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">
                  Họ và tên nhân viên *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Văn Hải"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 pl-9 text-white focus:outline-none focus:border-emerald-500"
                  />
                  <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">
                  Số điện thoại đăng nhập *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    placeholder="Ví dụ: 0978123456"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 pl-9 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <Smartphone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">
                  Mật khẩu đăng nhập (tối thiểu 6 ký tự) *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 pl-9 text-white focus:outline-none focus:border-emerald-500"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">
                  Địa chỉ / Chi nhánh làm việc (tùy chọn)
                </label>
                <input
                  type="text"
                  value={newStaff.address}
                  onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                  placeholder="Ví dụ: Showroom Vientiane hoặc Quầy thu ngân"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-400">
                ✅ Quyền hạn cấp tự động: <strong>Thêm món ăn/mỹ phẩm</strong>, <strong>tải ảnh từ camera điện thoại</strong>, <strong>nhận order từ khách</strong>.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-md shadow-emerald-600/30 disabled:opacity-50"
                >
                  {submitting ? 'Đang tạo...' : 'Tạo Tài Khoản Nhân Viên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
