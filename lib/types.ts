export type Role = 'ADMIN' | 'STAFF' | 'USER';

export type ProductStatus = 'ACTIVE' | 'HIDDEN';

export type OrderStatus =
  | 'PENDING'     // Chờ xác nhận
  | 'CONFIRMED'   // Đã xác nhận
  | 'PROCESSING'  // Đang xử lý
  | 'SHIPPING'    // Đang giao
  | 'COMPLETED'   // Hoàn thành
  | 'CANCELLED';  // Đã hủy

export interface User {
  id: string;
  phone: string;
  passwordHash: string;
  name?: string;
  role: Role;
  address?: string;
  createdAt: string;
}

export interface SubCategory {
  id: string;
  name: string;
  nameLao?: string;
  slug: string;
  categoryId: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  nameLao?: string;
  slug: string;
  icon?: string;
  subCategories?: SubCategory[];
  createdAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameLao?: string;
  slug: string;
  description: string;
  descriptionLao?: string;
  price: number;              // Giá bán lẻ (Retail Price)
  wholesalePrice?: number;    // Giá bán sỉ (Wholesale Price)
  minWholesaleQty?: number;   // Số lượng tối thiểu để tính giá sỉ (mặc định 3 hoặc 5)
  stock: number;
  categoryId: string;
  subCategoryId?: string;
  subCategoryName?: string;
  subCategoryNameLao?: string;
  brand?: string;
  status: ProductStatus;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productNameLao?: string;
  productImage: string;
  quantity: number;
  price: number;
  isWholesale?: boolean;
}

export interface Order {
  id: string;
  orderCode: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerType?: 'RETAIL' | 'WHOLESALE';
  shippingAddress: string;
  note?: string;
  totalPrice: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SiteSettings {
  // Thương hiệu & Màu sắc
  storeName: string;
  adminName?: string;
  slogan: string;
  primaryColor: string; // 'blue' | 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber'
  borderRadius?: string; // 'rounded-none' | 'rounded-lg' | 'rounded-2xl' | 'rounded-3xl'
  productGridColumns?: number; // 3 | 4
  logoUrl?: string;
  
  // Liên hệ & Thông báo
  hotline: string;
  email: string;
  address: string;
  topAnnouncement: string;
  showTopAnnouncement: boolean;
  topBarBgColor?: string; // 'zinc' | 'blue' | 'indigo' | 'rose' | 'emerald'

  // Banner chính (Hero Section)
  showHeroBanner: boolean;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonPrimaryText: string;
  heroButtonSecondaryText: string;
  heroImageUrl: string;
  heroCardTitle: string;
  heroCardSubtitle: string;
  heroCardBadge: string;

  // Banner Khuyến mãi / Flash Sale
  showFlashSale?: boolean;
  flashSaleBadge?: string;
  flashSaleTitle?: string;
  flashSaleSubtitle?: string;
  flashSaleEndTime?: string;
  flashSaleDiscountCode?: string;

  // Bộ đôi thẻ quảng cáo (Promo Cards)
  showPromoCards?: boolean;
  promoCard1Badge?: string;
  promoCard1Title?: string;
  promoCard1Subtitle?: string;
  promoCard1ButtonText?: string;
  promoCard1ImageUrl?: string;

  promoCard2Badge?: string;
  promoCard2Title?: string;
  promoCard2Subtitle?: string;
  promoCard2ButtonText?: string;
  promoCard2ImageUrl?: string;

  // Khối cam kết (4 Trust Badges)
  badge1Title: string;
  badge1Desc: string;
  badge2Title: string;
  badge2Desc: string;
  badge3Title: string;
  badge3Desc: string;
  badge4Title: string;
  badge4Desc: string;

  // Khối danh mục & sản phẩm
  catalogTitle: string;
  catalogSubtitle: string;

  // Popup Ưu đãi Chào mừng
  showPromoPopup?: boolean;
  promoPopupTitle?: string;
  promoPopupSubtitle?: string;
  promoPopupCode?: string;
  promoPopupDiscountText?: string;

  // Nút liên hệ nhanh (Facebook, WhatsApp, Hotline)
  showFloatingContact?: boolean;
  facebookUrl?: string;
  whatsappNumber?: string;
  zaloNumber?: string;

  // Đăng ký nhận tin (Newsletter)
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterSubtitle?: string;

  // Chân trang
  footerAbout: string;
  footerCopyright: string;
}
