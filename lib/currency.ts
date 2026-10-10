import { Currency } from './types';

// Tỷ giá mặc định: 1 Baht Thái = 650 Kíp Lào (thị trường Lào)
export const DEFAULT_THB_RATE = 650;

/**
 * Quy đổi từ Tiền Kíp Lào (LAK) sang Tiền Baht Thái (THB)
 */
export function convertLakToThb(lakAmount: number, rate = DEFAULT_THB_RATE): number {
  if (!lakAmount || isNaN(lakAmount)) return 0;
  const validRate = rate && rate > 0 ? rate : DEFAULT_THB_RATE;
  return Math.round(lakAmount / validRate);
}

/**
 * Quy đổi từ Tiền Baht Thái (THB) sang Tiền Kíp Lào (LAK)
 */
export function convertThbToLak(thbAmount: number, rate = DEFAULT_THB_RATE): number {
  if (!thbAmount || isNaN(thbAmount)) return 0;
  const validRate = rate && rate > 0 ? rate : DEFAULT_THB_RATE;
  return Math.round(thbAmount * validRate);
}

/**
 * Định dạng số tiền Kíp Lào (₭)
 */
export function formatLAK(amount: number): string {
  const safe = typeof amount === 'number' && !isNaN(amount) ? Math.round(amount) : 0;
  return new Intl.NumberFormat('de-DE').format(safe) + ' ₭';
}

/**
 * Định dạng số tiền Baht Thái (฿)
 */
export function formatTHB(amount: number): string {
  const safe = typeof amount === 'number' && !isNaN(amount) ? Math.round(amount) : 0;
  return new Intl.NumberFormat('de-DE').format(safe) + ' ฿';
}

/**
 * Định dạng số tiền theo loại tiền tệ ('LAK' hoặc 'THB')
 */
export function formatCurrency(amount: number, currency: Currency = 'LAK'): string {
  if (currency === 'THB') {
    return formatTHB(amount);
  }
  return formatLAK(amount);
}

/**
 * Định dạng giá song song Kíp & Baht quy đổi
 * Ví dụ: 465.000 ₭ (~715 ฿)
 */
export function formatDualPrice(lakAmount: number, rate = DEFAULT_THB_RATE): {
  lak: number;
  thb: number;
  lakFormatted: string;
  thbFormatted: string;
  combined: string;
} {
  const lak = typeof lakAmount === 'number' && !isNaN(lakAmount) ? Math.round(lakAmount) : 0;
  const thb = convertLakToThb(lak, rate);
  const lakFormatted = formatLAK(lak);
  const thbFormatted = formatTHB(thb);
  const combined = `${lakFormatted} (~${thbFormatted})`;

  return {
    lak,
    thb,
    lakFormatted,
    thbFormatted,
    combined,
  };
}
