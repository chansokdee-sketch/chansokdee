'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDictionary, translations } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof TranslationDictionary, params?: Record<string, string | number>) => string;
  formatPrice: (priceInVND: number, options?: { showDual?: boolean }) => string;
  isLao: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Tỷ giá quy đổi ước tính mặc định: 1 VND = ~0.87 LAK (Kíp Lào)
// Hoặc có thể hiển thị song song hoặc theo Kíp
const VND_TO_LAK_RATE = 0.87;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('lo');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('novastore_lang') as Language;
      if (saved === 'vi' || saved === 'lo') {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      } else {
        setLanguageState('lo');
        document.documentElement.lang = 'lo';
        localStorage.setItem('novastore_lang', 'lo');
      }
    } catch {
      // LocalStorage unavailable
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('novastore_lang', lang);
      document.documentElement.lang = lang;
    } catch {}
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'vi' ? 'lo' : 'vi';
    setLanguage(nextLang);
  };

  const t = (key: keyof TranslationDictionary, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.vi;
    let text = dict[key] || translations.vi[key] || (key as string);
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }
    return text;
  };

  const formatPrice = (priceInVND: number, options?: { showDual?: boolean }): string => {
    if (language === 'lo') {
      const kipPrice = Math.round(priceInVND * VND_TO_LAK_RATE);
      const formattedKip = new Intl.NumberFormat('de-DE').format(kipPrice) + ' ₭';
      if (options?.showDual) {
        const formattedVnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceInVND);
        return `${formattedKip} (${formattedVnd})`;
      }
      return formattedKip;
    }

    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceInVND);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        formatPrice,
        isLao: language === 'lo',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
