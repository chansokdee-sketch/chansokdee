'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Lock, Phone, User as UserIcon, Shield, Sparkles, AlertCircle, Boxes } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, login, register } = useAuth();
  const { t, isLao } = useLanguage();
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loginCategory, setLoginCategory] = useState<'RETAIL' | 'WHOLESALE'>('RETAIL');
  const [regCustomerType, setRegCustomerType] = useState<'RETAIL' | 'WHOLESALE'>('RETAIL');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (authModalMode === 'login') {
      const res = await login(phone, password);
      if (!res.success) {
        setError(res.error || 'Đăng nhập không thành công');
      }
    } else {
      const res = await register(phone, password, name, address, regCustomerType);
      if (!res.success) {
        setError(res.error || 'Đăng ký không thành công');
      }
    }
    setSubmitting(false);
  };

  const handleQuickAdmin = async () => {
    setAuthModalMode('login');
    setPhone('0988888888');
    setPassword('AdminPassword@123');
    setError('');
    setSubmitting(true);
    const res = await login('0988888888', 'AdminPassword@123');
    if (!res.success) {
      setError(res.error || 'Đăng nhập không thành công');
    }
    setSubmitting(false);
  };

  const handleQuickManager = async () => {
    setAuthModalMode('login');
    setPhone('0966666666');
    setPassword('ManagerPassword@123');
    setError('');
    setSubmitting(true);
    const res = await login('0966666666', 'ManagerPassword@123');
    if (!res.success) {
      setError(res.error || 'Đăng nhập không thành công');
    }
    setSubmitting(false);
  };

  const handleQuickStaff = async () => {
    setAuthModalMode('login');
    setPhone('0977777777');
    setPassword('StaffPassword@123');
    setError('');
    setSubmitting(true);
    const res = await login('0977777777', 'StaffPassword@123');
    if (!res.success) {
      setError(res.error || 'Đăng nhập không thành công');
    }
    setSubmitting(false);
  };

  const handleQuickUser = async () => {
    setAuthModalMode('login');
    setPhone('0912345678');
    setPassword('UserPassword@123');
    setError('');
    setSubmitting(true);
    const res = await login('0912345678', 'UserPassword@123');
    if (!res.success) {
      setError(res.error || 'Đăng nhập không thành công');
    }
    setSubmitting(false);
  };

  const handleQuickWholesale = async () => {
    setAuthModalMode('login');
    setPhone('0911223344');
    setPassword('WholesalePassword@123');
    setError('');
    setSubmitting(true);
    const res = await login('0911223344', 'WholesalePassword@123');
    if (!res.success) {
      setError(res.error || 'Đăng nhập không thành công');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="relative bg-white rounded-3xl max-w-md w-full p-5 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute right-4 sm:right-5 top-4 sm:top-5 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-200 mb-6">
          <button
            type="button"
            onClick={() => { setAuthModalMode('login'); setError(''); }}
            className={`flex-1 pb-3 text-center text-sm font-bold transition border-b-2 -mb-[2px] ${
              authModalMode === 'login'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            {t('auth_login_tab')}
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalMode('register'); setError(''); }}
            className={`flex-1 pb-3 text-center text-sm font-bold transition border-b-2 -mb-[2px] ${
              authModalMode === 'register'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            {t('auth_register_tab')}
          </button>
        </div>

        {/* Quick Demo Test Fill */}
        <div className="mb-5 p-3.5 bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-amber-50/50 rounded-2xl border border-blue-100/90 text-xs">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>{isLao ? 'ບັນຊີຕົວຢ່າງທົດສອບ (ກົດເພື່ອເຂົ້າສູ່ລະບົບໄວ):' : 'Tài khoản mẫu thử nghiệm (Bấm để đăng nhập nhanh):'}</span>
            </div>
          </div>

          {/* Nhóm 1: Quản trị & Nội bộ (Toàn quyền, không giới hạn giá) */}
          <div className="mb-2.5">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1.5 px-0.5">
              <span>{isLao ? 'ພາຍໃນ & ຜູ້ຈັດການ (ບໍ່ຈຳກັດລາຄາ)' : 'Nội bộ & Quản lý (Xem toàn bộ giá)'}</span>
              <span className="text-emerald-600 font-bold lowercase bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">full access</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={handleQuickAdmin}
                className="py-2 px-1.5 bg-white hover:bg-blue-600 text-blue-800 hover:text-white font-bold rounded-xl border border-blue-200/80 transition shadow-2xs text-center flex flex-col items-center justify-center gap-0.5 active:scale-95"
                title="Boss Hải (Quản trị viên - 0988888888)"
              >
                <div className="flex items-center gap-1 text-[11px] whitespace-nowrap">
                  <span>👑</span>
                  <span className="font-extrabold">Boss Hải</span>
                </div>
                <span className="text-[9px] opacity-75 whitespace-nowrap">{isLao ? 'ຜູ້ບໍລິຫານ' : 'Admin'}</span>
              </button>

              <button
                type="button"
                onClick={handleQuickManager}
                className="py-2 px-1.5 bg-white hover:bg-purple-600 text-purple-800 hover:text-white font-bold rounded-xl border border-purple-200/80 transition shadow-2xs text-center flex flex-col items-center justify-center gap-0.5 active:scale-95 ring-1 ring-purple-200"
                title="Quản Lý Cửa Hàng (0966666666)"
              >
                <div className="flex items-center gap-1 text-[11px] whitespace-nowrap">
                  <span>💼</span>
                  <span className="font-extrabold">{isLao ? 'ຜູ້ຈັດການ' : 'Quản Lý'}</span>
                </div>
                <span className="text-[9px] opacity-75 whitespace-nowrap">{isLao ? 'ຈັດການ' : 'Manager'}</span>
              </button>

              <button
                type="button"
                onClick={handleQuickStaff}
                className="py-2 px-1.5 bg-white hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold rounded-xl border border-emerald-200/80 transition shadow-2xs text-center flex flex-col items-center justify-center gap-0.5 active:scale-95"
                title="Nhân Viên Tiếp Nhận Đơn (0977777777)"
              >
                <div className="flex items-center gap-1 text-[11px] whitespace-nowrap">
                  <span>👔</span>
                  <span className="font-extrabold">{isLao ? 'ພະນັກງານ' : 'Nhân Viên'}</span>
                </div>
                <span className="text-[9px] opacity-75 whitespace-nowrap">{isLao ? 'ຮັບອໍເດີ' : 'Nhận đơn'}</span>
              </button>
            </div>
          </div>

          {/* Nhóm 2: Khách hàng (Khách sỉ xem full giá vs Khách lẻ bị giới hạn) */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1.5 px-0.5">
              <span>{isLao ? 'ລູກຄ້າ (ແບ່ງສິດລາຄາ)' : 'Khách hàng (Phân cấp xem giá)'}</span>
              <span className="text-amber-700 font-semibold">{isLao ? 'ລາຄາສົ່ງ vs ລາຄາຍ່ອຍ' : 'Sỉ vs Lẻ'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* Khách sỉ - Toàn quyền xem giá sỉ & lẻ */}
              <button
                type="button"
                onClick={handleQuickWholesale}
                className="p-2 sm:p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black rounded-xl border border-amber-400 transition shadow-xs text-left active:scale-95"
                title="Khách Sỉ / Đại Lý: Xem toàn bộ Giá Sỉ & Lẻ (0911223344)"
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span>⚡</span>
                    <span className="whitespace-nowrap">{isLao ? 'ລູກຄ້າຂາຍສົ່ງ' : 'Khách Sỉ / Đại Lý'}</span>
                  </div>
                  <span className="text-[9px] bg-white/25 px-1 py-0.2 rounded font-black text-white whitespace-nowrap">
                    Full giá
                  </span>
                </div>
                <p className="text-[10px] text-amber-100 font-medium mt-0.5 leading-tight">
                  {isLao ? 'ເບິ່ງທັງໝົດ ລາຄາສົ່ງ & ຍ່ອຍ' : 'Xem cả Giá Sỉ & Giá Lẻ'}
                </p>
              </button>

              {/* Khách lẻ - Giới hạn chỉ xem giá lẻ */}
              <button
                type="button"
                onClick={handleQuickUser}
                className="p-2 sm:p-2.5 bg-white hover:bg-zinc-800 text-zinc-800 hover:text-white font-bold rounded-xl border border-zinc-200 transition shadow-2xs text-left active:scale-95 group"
                title="Khách Mua Lẻ: Chỉ xem Giá Lẻ (0912345678)"
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span>👤</span>
                    <span className="whitespace-nowrap">{isLao ? 'ລູກຄ້າຂາຍຍ່ອຍ' : 'Khách Mua Lẻ'}</span>
                  </div>
                  <span className="text-[9px] bg-zinc-100 group-hover:bg-zinc-700 group-hover:text-zinc-200 text-zinc-600 px-1 py-0.2 rounded font-semibold whitespace-nowrap">
                    {isLao ? 'ຈຳກັດ' : 'Giới hạn'}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 group-hover:text-zinc-300 mt-0.5 leading-tight">
                  {isLao ? 'ເບິ່ງສະເພາະ ລາຄາຂາຍຍ່ອຍ' : 'Chỉ xem duy nhất Giá Lẻ'}
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Lựa chọn loại tài khoản khi ĐĂNG KÝ */}
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                {isLao ? 'ປະເພດບັນຊີລົງທະບຽນ *' : 'Loại tài khoản đăng ký *'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegCustomerType('RETAIL')}
                  className={`p-2.5 rounded-2xl border text-left transition ${
                    regCustomerType === 'RETAIL'
                      ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 text-blue-900 font-bold'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isLao ? 'ລູກຄ້າຂາຍຍ່ອຍ' : 'Khách Mua Lẻ'}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {isLao ? 'ເບິ່ງ & ຊື້ຕາມລາຄາຍ່ອຍ' : 'Xem & mua giá bán lẻ'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegCustomerType('WHOLESALE')}
                  className={`p-2.5 rounded-2xl border text-left transition ${
                    regCustomerType === 'WHOLESALE'
                      ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/30 text-amber-950 font-black'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                    <Boxes className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isLao ? 'ລູກຄ້າຂາຍສົ່ງ ⚡' : 'Khách Sỉ / Đại Lý ⚡'}</span>
                  </div>
                  <p className="text-[10px] text-amber-800/80 mt-0.5">
                    {isLao ? 'ເບິ່ງທັງໝົດ ລາຄາສົ່ງ & ຍ່ອຍ' : 'Xem toàn bộ Giá sỉ & lẻ'}
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Lựa chọn loại tài khoản khi ĐĂNG NHẬP */}
          {authModalMode === 'login' && (
            <div className="flex items-center bg-zinc-100 p-1 rounded-2xl text-xs font-bold border border-zinc-200/80">
              <button
                type="button"
                onClick={() => {
                  setLoginCategory('RETAIL');
                  if (phone === '0911223344') {
                    setPhone('');
                    setPassword('');
                  }
                }}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  loginCategory === 'RETAIL'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>{isLao ? 'ລູກຄ້າຂາຍຍ່ອຍ' : 'Khách Mua Lẻ'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginCategory('WHOLESALE');
                  setPhone('0911223344');
                  setPassword('WholesalePassword@123');
                }}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  loginCategory === 'WHOLESALE'
                    ? 'bg-amber-400 text-amber-950 font-black shadow-xs ring-1 ring-amber-300'
                    : 'text-zinc-500 hover:text-amber-800'
                }`}
              >
                <Boxes className="w-3.5 h-3.5 text-amber-900" />
                <span>{isLao ? 'ລູກຄ້າຂາຍສົ່ງ / ຕົວແທນ ⚡' : 'Khách Sỉ / Đại Lý ⚡'}</span>
              </button>
            </div>
          )}

          {authModalMode === 'login' && loginCategory === 'WHOLESALE' && (
            <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                {isLao 
                  ? 'ເຂົ້າສູ່ລະບົບລູກຄ້າຂາຍສົ່ງ ເພື່ອເບິ່ງທັງໝົດ ລາຄາສົ່ງ & ລາຄາຍ່ອຍ.' 
                  : 'Đăng nhập tài khoản Khách Sỉ để xem Bảng Giá Sỉ và toàn bộ Giá Lẻ.'}
              </span>
            </div>
          )}

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                {t('auth_name')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Minh Nam / Đại Lý Sơn Trà"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 pl-10 text-base sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
                <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              {t('auth_phone')}
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678 / 02055777975"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 pl-10 text-base sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              {t('auth_password')}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 pl-10 text-base sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {authModalMode === 'register' && (
              <p className="text-[11px] text-zinc-400 mt-1">{t('auth_password_hint')}</p>
            )}
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                {t('auth_address')}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Vientiane / Hà Nội..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 text-white rounded-xl font-bold text-sm shadow-md transition mt-2 ${
              loginCategory === 'WHOLESALE' && authModalMode === 'login'
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {submitting 
              ? t('auth_processing') 
              : authModalMode === 'login' 
                ? (loginCategory === 'WHOLESALE' ? '⚡ Đăng Nhập Khách Sỉ' : t('auth_login_btn'))
                : (regCustomerType === 'WHOLESALE' ? '⚡ Đăng Ký Tài Khoản Khách Sỉ' : t('auth_register_btn'))
            }
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400 flex items-center justify-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          {t('auth_secure_notice')}
        </div>
      </div>
    </div>
  );
}
