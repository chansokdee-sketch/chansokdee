'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronDown, Check, Coins } from 'lucide-react';
import { Currency } from '@/lib/types';

interface CurrencySwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function CurrencySwitcher({ variant = 'compact', className = '' }: CurrencySwitcherProps) {
  const { currency, setCurrency, thbRate, isLao } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currencies: { code: Currency; symbol: string; label: string; short: string; flag: string }[] = [
    { code: 'LAK', symbol: '₭', label: isLao ? 'ກີບລາວ (LAK)' : 'Kíp Lào (LAK)', short: '₭ Kíp', flag: '🇱🇦' },
    { code: 'THB', symbol: '฿', label: isLao ? 'ບາດໄທ (THB)' : 'Baht Thái (THB)', short: '฿ Baht', flag: '🇹🇭' },
  ];

  const current = currencies.find(c => c.code === currency) || currencies[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 text-xs font-bold transition shadow-2xs hover:scale-105 active:scale-95"
        title="Chọn loại tiền tệ / ເລືອກສະກຸນເງິນ"
      >
        <span className="text-amber-600 font-extrabold font-mono text-sm leading-none">{current.symbol}</span>
        <span className={variant === 'compact' ? 'inline' : 'hidden sm:inline font-bold'}>
          {variant === 'compact' ? current.short : current.label}
        </span>
        <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-zinc-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 mb-1 flex items-center justify-between">
            <span>Tiền tệ / ສະກຸນເງິນ</span>
            <span className="text-[9px] text-zinc-400 font-normal">1฿ = {thbRate}₭</span>
          </div>

          {currencies.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setCurrency(item.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition ${
                currency === item.code
                  ? 'bg-amber-50 text-amber-700 font-bold'
                  : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-xs text-amber-600 font-mono">
                  {item.symbol}
                </span>
                <span>{item.label}</span>
              </div>
              {currency === item.code && <Check className="w-3.5 h-3.5 text-amber-600" />}
            </button>
          ))}

          <div className="mt-1 pt-1 border-t border-zinc-100 px-3 py-1 text-[10px] text-zinc-400 text-center">
            {isLao ? `ອັດຕາແລກປ່ຽນ: 1 ບາດ = ${thbRate} ກີບ` : `Tỷ giá niêm yết: 1 Baht = ${thbRate} Kíp`}
          </div>
        </div>
      )}
    </div>
  );
}
