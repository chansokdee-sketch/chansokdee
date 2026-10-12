import { Currency } from './types';

// Tỷ giá mặc định: 1 Baht Thái = 650 Kíp Lào (thị trường Lào)
export const DEFAULT_THB_RATE = 650;

/**
 * Quy đổi từ Tiền Kíp Lào (LAK) sang Tiền Baht Thái (THB)
 */
export function convertLakToThb(lakAmount: number, rate = DEFAULT_THB_RATE): number {
  if (!lakAmount || isNaN(lakAmount)) return 0;
  const validRate = rate && rate > 0 ? rate : DEFAULT_THB_RATE;
  return Math.round((lakAmount / validRate) * 100) / 100;
}

/**
 * Quy đổi từ Tiền Baht Thái (THB) sang Tiền Kíp Lào (LAK)
 */
export function convertThbToLak(thbAmount: number, rate = DEFAULT_THB_RATE): number {
  if (!thbAmount || isNaN(thbAmount)) return 0;
  const validRate = rate && rate > 0 ? rate : DEFAULT_THB_RATE;
  return Math.round((thbAmount * validRate) * 100) / 100;
}

/**
 * Định dạng số tiền Kíp Lào (₭) - Hỗ trợ số thập phân nếu có
 */
export function formatLAK(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0 ₭';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' ₭';
}

/**
 * Định dạng số tiền Baht Thái (฿) - Hỗ trợ số thập phân nếu có (Ví dụ: 12.5 ฿, 99.75 ฿)
 */
export function formatTHB(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0 ฿';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' ฿';
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

/**
 * Định dạng thanh toán đơn hàng (hỗ trợ cả Kíp, Baht và Hỗn hợp Baht + Kíp)
 */
export function formatOrderPaymentDisplay(order: {
  currency?: Currency;
  totalPrice?: number;
  totalPriceTHB?: number;
  totalPriceLAK?: number;
  paidTHB?: number;
  paidLAK?: number;
  exchangeRate?: number;
}): {
  main: string;
  sub: string;
  isMixed: boolean;
  thbPart: string;
  lakPart: string;
  label: string;
} {
  const rate = order.exchangeRate && order.exchangeRate > 0 ? order.exchangeRate : DEFAULT_THB_RATE;
  const isMixed = order.currency === 'MIXED' || (Boolean(order.paidTHB && order.paidTHB > 0) && Boolean(order.paidLAK && order.paidLAK > 0));

  if (isMixed) {
    const thb = Math.round(order.paidTHB || order.totalPriceTHB || 0);
    const lak = Math.round(order.paidLAK || order.totalPriceLAK || 0);
    const approxTotalLAK = Math.round(thb * rate + lak);
    return {
      main: `${formatTHB(thb)} + ${formatLAK(lak)}`,
      sub: `≈ ${formatLAK(approxTotalLAK)}`,
      isMixed: true,
      thbPart: formatTHB(thb),
      lakPart: formatLAK(lak),
      label: 'Hỗn hợp Baht & Kíp',
    };
  }

  if (order.currency === 'THB') {
    const thb = Math.round(order.paidTHB !== undefined && order.paidTHB > 0 ? order.paidTHB : (order.totalPriceTHB || order.totalPrice || 0));
    const approxLAK = order.totalPriceLAK || Math.round(thb * rate);
    return {
      main: formatTHB(thb),
      sub: `≈ ${formatLAK(approxLAK)}`,
      isMixed: false,
      thbPart: formatTHB(thb),
      lakPart: '0 ₭',
      label: 'Tiền Baht Thái (THB)',
    };
  }

  const lak = Math.round(order.paidLAK !== undefined && order.paidLAK > 0 ? order.paidLAK : (order.totalPriceLAK || order.totalPrice || 0));
  const approxTHB = order.totalPriceTHB || Math.round(lak / rate);
  return {
    main: formatLAK(lak),
    sub: `≈ ${formatTHB(approxTHB)}`,
    isMixed: false,
    thbPart: '0 ฿',
    lakPart: formatLAK(lak),
    label: 'Tiền Kíp Lào (LAK)',
  };
}
