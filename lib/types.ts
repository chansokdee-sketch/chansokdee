export type Role = 'ADMIN' | 'MANAGER' | 'STAFF' | 'USER';

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
  customerType?: 'RETAIL' | 'WHOLESALE';
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

export type PackagingUnit = 'PIECE' | 'PACK' | 'BOX' | 'CARTON'; // 'PIECE' = Cái (ອັນ), 'PACK' = Lốc (ແພັກ), 'BOX' = Hộp (ກ່ອງ), 'CARTON' = Thùng (ລັງ)

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameLao?: string;
  slug: string;
  description: string;
  descriptionLao?: string;
  price: number;              // Giá bán lẻ theo cái (Retail Price)
  wholesalePrice?: number;    // Giá bán sỉ theo cái (Wholesale Price)
  minWholesaleQty?: number;   // Số lượng tối thiểu để tính giá sỉ (mặc định 3 hoặc 5)
  packQty?: number;           // Số lượng cái trong 1 Lốc (mặc định 6)
  boxQty?: number;            // Số lượng cái trong 1 Hộp (mặc định 10)
  cartonQty?: number;         // Số lượng cái trong 1 Thùng (mặc định 50)
  packPrice?: number;         // Giá bán theo Lốc (tùy chọn)
  boxPrice?: number;          // Giá bán theo Hộp (tùy chọn)
  cartonPrice?: number;       // Giá bán theo Thùng (tùy chọn)
  colors?: string[];          // Danh sách màu sắc (ví dụ: ['Đỏ Ruby', 'Cam Cháy', 'Hồng Đào'])
  sizes?: string[];           // Danh sách kích cỡ / dung tích (ví dụ: ['30ml', '50ml', '100ml'] hoặc ['S', 'M', 'L'])
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
  unit?: PackagingUnit;
  unitName?: string;
  unitQuantity?: number;
  selectedColor?: string;
  selectedSize?: string;
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
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffPhone?: string;
  assignedAt?: string;
  assignedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id?: string;                // Khóa duy nhất trong giỏ hàng (hỗ trợ phân loại màu, size, cái/hộp/thùng)
  product: Product;
  quantity: number;           // Tổng số lượng cái thực tế
  unit?: PackagingUnit;       // Đơn vị đóng gói: PIECE (Cái), BOX (Hộp), CARTON (Thùng)
  unitQuantity?: number;      // Số lượng theo đơn vị (ví dụ: 2 Hộp, 1 Thùng, 3 Cái)
  selectedColor?: string;     // Màu sắc đã chọn
  selectedSize?: string;      // Kích cỡ/dung tích đã chọn
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
