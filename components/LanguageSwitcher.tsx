'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'compact', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
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

  const languages = [
    { code: 'lo' as const, label: 'ພາສາລາວ', flag: '🇱🇦', short: 'LAO' },
    { code: 'vi' as const, label: 'Tiếng Việt', flag: '🇻🇳', short: 'VN' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-bold transition shadow-2xs hover:scale-105 active:scale-95"
        title="Chọn ngôn ngữ / ເລືອກພາສາ"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className={variant === 'compact' ? 'inline' : 'hidden sm:inline'}>
          {variant === 'compact' ? currentLang.short : currentLang.label}
        </span>
        <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white shadow-xl border border-zinc-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 mb-1">
            Ngôn ngữ / ພາສາ
          </div>
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setLanguage(item.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition ${
                language === item.code
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{item.flag}</span>
                <span>{item.label}</span>
              </span>
              {language === item.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
