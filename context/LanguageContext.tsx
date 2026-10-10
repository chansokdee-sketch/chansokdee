'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDictionary, translations } from '@/lib/i18n';
import { Currency } from '@/lib/types';
import { DEFAULT_THB_RATE, convertLakToThb, convertThbToLak, formatLAK, formatTHB } from '@/lib/currency';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  toggleCurrency: () => void;
  thbRate: number;
  t: (key: keyof TranslationDictionary, params?: Record<string, string | number>) => string;
  formatPrice: (price: number, options?: { currency?: Currency; showDual?: boolean; isRawThb?: boolean }) => string;
  formatDualPrice: (priceInLak: number) => { lak: number; thb: number; lakFormatted: string; thbFormatted: string; combined: string };
  isLao: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('lo');
  const [currency, setCurrencyState] = useState<Currency>('LAK');
  const [thbRate, setThbRate] = useState<number>(DEFAULT_THB_RATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('novastore_lang') as Language;
      if (savedLang === 'vi' || savedLang === 'lo') {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      } else {
        setLanguageState('lo');
        document.documentElement.lang = 'lo';
        localStorage.setItem('novastore_lang', 'lo');
      }

      const savedCurr = localStorage.getItem('novastore_currency') as Currency;
      if (savedCurr === 'LAK' || savedCurr === 'THB') {
        setCurrencyState(savedCurr);
      }
    } catch {
      // LocalStorage unavailable
    }

    // Tải cấu hình tỷ giá từ hệ thống
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.thbRate && data.settings.thbRate > 0) {
          setThbRate(data.settings.thbRate);
        }
      })
      .catch(() => {});

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

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem('novastore_currency', curr);
    } catch {}
  };

  const toggleCurrency = () => {
    const nextCurr: Currency = currency === 'LAK' ? 'THB' : 'LAK';
    setCurrency(nextCurr);
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

  // Định dạng hiển thị giá theo Kíp / Baht hoặc song song
  const formatPrice = (
    price: number,
    options?: { currency?: Currency; showDual?: boolean; isRawThb?: boolean }
  ): string => {
    const safePrice = typeof price === 'number' && !isNaN(price) ? Math.round(price) : 0;
    const targetCurrency = options?.currency || currency;

    if (options?.showDual) {
      const lakFormatted = formatLAK(safePrice);
      const thbAmount = convertLakToThb(safePrice, thbRate);
      const thbFormatted = formatTHB(thbAmount);
      return `${lakFormatted} (${thbFormatted})`;
    }

    if (targetCurrency === 'THB') {
      const thbVal = options?.isRawThb ? safePrice : convertLakToThb(safePrice, thbRate);
      return formatTHB(thbVal);
    }

    return formatLAK(safePrice);
  };

  const formatDualPriceHelper = (priceInLak: number) => {
    const safePrice = typeof priceInLak === 'number' && !isNaN(priceInLak) ? Math.round(priceInLak) : 0;
    const thbVal = convertLakToThb(safePrice, thbRate);
    const lakFormatted = formatLAK(safePrice);
    const thbFormatted = formatTHB(thbVal);
    return {
      lak: safePrice,
      thb: thbVal,
      lakFormatted,
      thbFormatted,
      combined: `${lakFormatted} (~${thbFormatted})`,
    };
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        currency,
        setCurrency,
        toggleCurrency,
        thbRate,
        t,
        formatPrice,
        formatDualPrice: formatDualPriceHelper,
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
