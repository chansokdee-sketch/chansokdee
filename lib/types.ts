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

export interface ProductVariant {
  id: string;
  name: string;             // Tên phân loại (ví dụ: "Tươi mát (Mới) 900g")
  nameLao?: string;
  image?: string;           // Ảnh riêng của phân loại
  price?: number;           // Giá lẻ tiền Kíp (nếu có, để trống = dùng giá chung)
  priceTHB?: number;        // Giá lẻ tiền Baht (nếu có)
  wholesalePrice?: number;  // Giá sỉ tiền Kíp
  wholesalePriceTHB?: number; // Giá sỉ tiền Baht
  stock?: number;           // Số lượng tồn kho riêng
}

export interface ProductTier1Option {
  id: string;
  name: string;             // Tên lựa chọn nhóm 1 (Ví dụ: "[2-1-1] Xám Nhung", "Đỏ", "Hương Hoa")
  image?: string;           // Ảnh thumbnail gắn với lựa chọn
  price?: number;           // Giá tiền Kíp riêng (nếu có)
  priceTHB?: number;        // Giá tiền Baht riêng (nếu có)
}

export interface ProductTier2Option {
  id: string;
  name: string;             // Tên lựa chọn nhóm 2 (Ví dụ: "100ml", "500g", "15 Pro Max", "Dòng Trắng Da")
  priceBonus?: number;      // Giá cộng thêm tiền Kíp (nếu có)
  priceBonusTHB?: number;   // Giá cộng thêm tiền Baht (nếu có)
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
  price: number;              // Giá bán lẻ theo cái tiền Kíp (Retail Price LAK)
  priceTHB?: number;          // Giá bán lẻ tiền Baht (Retail Price THB) - nếu có thì được thanh toán bằng Baht
  wholesalePrice?: number;    // Giá bán sỉ theo cái tiền Kíp (Wholesale Price LAK)
  wholesalePriceTHB?: number; // Giá bán sỉ tiền Baht (Wholesale Price THB)
  minWholesaleQty?: number;   // Số lượng tối thiểu để tính giá sỉ (mặc định 3 hoặc 5)
  
  // Tùy chọn bật/tắt (ô tick) quy cách đóng gói:
  baseUnitName?: string;      // Tên đơn vị cơ sở (mặc định "Cái", có thể là "Gói", "Tuýp", "Chai", "Hũ", "Miếng"...)
  baseUnitNameLao?: string;   // Tên đơn vị cơ sở tiếng Lào (ອັນ, ຊອງ, ຫຼອດ, ແກ້ວ...)
  hasPack?: boolean;          // Có bán theo Lốc không?
  packQty?: number;           // Số lượng cái/gói trong 1 Lốc
  packPrice?: number;         // Giá bán 1 Lốc (₭ LAK)
  packPriceTHB?: number;      // Giá bán 1 Lốc (฿ THB)
  packWholesalePrice?: number;

  hasBox?: boolean;           // Có bán theo Hộp không?
  boxQty?: number;            // Số lượng cái/gói trong 1 Hộp
  boxPrice?: number;          // Giá bán 1 Hộp (₭ LAK)
  boxPriceTHB?: number;       // Giá bán 1 Hộp (฿ THB)
  boxWholesalePrice?: number;

  hasCarton?: boolean;        // Có bán theo Thùng không?
  cartonQty?: number;         // Tổng số lượng cái/gói trong 1 Thùng
  cartonBoxQty?: number;      // Số Hộp trong 1 Thùng (ví dụ: 24 hộp/thùng => cartonQty = 24 × boxQty)
  cartonPrice?: number;       // Giá bán 1 Thùng (₭ LAK)
  cartonPriceTHB?: number;    // Giá bán 1 Thùng (฿ THB)
  cartonWholesalePrice?: number;

  // Phân loại đa cấp (Shopee 2-tier Style):
  tier1Name?: string;         // Tên Nhóm 1 (Ví dụ: "Màu Sắc", "Mẫu Mã")
  tier1Options?: ProductTier1Option[]; // Danh sách lựa chọn nhóm 1 (kèm ảnh)
  tier2Name?: string;         // Tên Nhóm 2 (Ví dụ: "Trọng Lượng (ml, g)", "Dòng Sản Phẩm", "Dung Tích")
  tier2Options?: ProductTier2Option[]; // Danh sách lựa chọn nhóm 2

  variants?: ProductVariant[];// Phân loại biến thể phẳng tương thích
  colors?: string[];          // Danh sách màu sắc tương thích cũ
  sizes?: string[];           // Danh sách kích cỡ tương thích cũ
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
  priceTHB?: number;
  isWholesale?: boolean;
  unit?: PackagingUnit;
  unitName?: string;
  unitQuantity?: number;
  variantId?: string;
  variantName?: string;
  variantImage?: string;
  tier1Value?: string;
  tier2Value?: string;
  selectedColor?: string;
  selectedSize?: string;
}

export type Currency = 'LAK' | 'THB'; // 'LAK' = Tiền Kíp Lào (₭), 'THB' = Tiền Baht Thái (฿)

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
  currency?: Currency;        // Loại tiền khách chọn thanh toán ('LAK' hoặc 'THB')
  totalPriceLAK?: number;    // Số tiền quy đổi sang Tiền Kíp (₭)
  totalPriceTHB?: number;    // Số tiền quy đổi sang Tiền Baht (฿)
  exchangeRate?: number;     // Tỷ giá quy đổi tại thời điểm đặt đơn (1 THB = ... LAK)
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
  id?: string;                // Khóa duy nhất trong giỏ hàng (hỗ trợ phân loại mẫu mã, cái/lốc/hộp/thùng)
  product: Product;
  quantity: number;           // Tổng số lượng cái thực tế
  unit?: PackagingUnit;       // Đơn vị đóng gói: PIECE (Cái), PACK (Lốc), BOX (Hộp), CARTON (Thùng)
  unitQuantity?: number;      // Số lượng theo đơn vị (ví dụ: 2 Hộp, 1 Thùng, 3 Cái)
  variantId?: string;         // Mã phân loại đã chọn (Shopee style)
  variantName?: string;       // Tên phân loại đã chọn
  variantImage?: string;      // Ảnh riêng của phân loại đã chọn
  tier1Value?: string;        // Giá trị nhóm 1 đã chọn (Ví dụ: "Xám Nhung")
  tier2Value?: string;        // Giá trị nhóm 2 đã chọn (Ví dụ: "100ml", "500g", "15 Pro Max")
  selectedColor?: string;     // Màu sắc đã chọn
  selectedSize?: string;      // Kích cỡ/dung tích đã chọn
}

export interface SiteSettings {
  // Tiền tệ & Tỷ giá quy đổi
  thbRate?: number;           // Tỷ giá quy đổi: 1 THB = ... LAK (mặc định 650)

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
