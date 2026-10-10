'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { X, Lock, Phone, User as UserIcon, Shield, Sparkles, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, login, register } = useAuth();
  const { t } = useLanguage();
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      const res = await register(phone, password, name, address);
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
        <div className="mb-6 p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-800 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            {t('auth_demo_title')}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="py-2 px-2 bg-white text-blue-700 font-bold rounded-xl border border-blue-200 hover:bg-blue-600 hover:text-white transition shadow-2xs text-center text-[11px] flex items-center justify-center gap-1"
              title="Boss Hải (Quản trị viên - 0988888888)"
            >
              <span>👑</span>
              <span className="truncate">Boss Hải</span>
            </button>
            <button
              type="button"
              onClick={handleQuickManager}
              className="py-2 px-2 bg-white text-purple-700 font-bold rounded-xl border border-purple-200 hover:bg-purple-600 hover:text-white transition shadow-2xs text-center text-[11px] flex items-center justify-center gap-1 ring-1 ring-purple-300"
              title="Quản Lý (Giao việc NV, tự hoàn thành - 0966666666)"
            >
              <span>💼</span>
              <span className="truncate">Quản Lý</span>
            </button>
            <button
              type="button"
              onClick={handleQuickStaff}
              className="py-2 px-2 bg-white text-emerald-700 font-bold rounded-xl border border-emerald-200 hover:bg-emerald-600 hover:text-white transition shadow-2xs text-center text-[11px] flex items-center justify-center gap-1"
              title="Nhân Viên (Nhận đơn, làm món - 0977777777)"
            >
              <span>👔</span>
              <span className="truncate">Nhân Viên</span>
            </button>
            <button
              type="button"
              onClick={handleQuickUser}
              className="py-2 px-2 bg-white text-zinc-700 font-bold rounded-xl border border-zinc-200 hover:bg-zinc-800 hover:text-white transition shadow-2xs text-center text-[11px] flex items-center justify-center gap-1"
              title="Khách Hàng (Giá lẻ - 0912345678)"
            >
              <span>👤</span>
              <span className="truncate">Khách Hàng</span>
            </button>
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
                  placeholder="Minh Nam"
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
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition mt-2"
          >
            {submitting ? t('auth_processing') : authModalMode === 'login' ? t('auth_login_btn') : t('auth_register_btn')}
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
