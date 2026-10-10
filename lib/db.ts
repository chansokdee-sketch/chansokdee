import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Category, SubCategory, Product, Order, OrderItem, OrderStatus, ProductStatus, SiteSettings } from './types';

interface DatabaseSchema {
  users: User[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  siteSettings?: SiteSettings;
}

const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // Fallback if permission issue
    }
  }
}

function getInitialData(): DatabaseSchema {
  const adminPasswordHash = bcrypt.hashSync('AdminPassword@123', 10);
  const userPasswordHash = bcrypt.hashSync('UserPassword@123', 10);
  const now = new Date().toISOString();

  const categories: Category[] = [
    { id: 'cat-1', name: 'Chăm Sóc Da Mặt', slug: 'cham-soc-da-mat', createdAt: now },
    { id: 'cat-2', name: 'Trang Điểm (Makeup)', slug: 'trang-diem', createdAt: now },
    { id: 'cat-3', name: 'Son Môi Cao Cấp', slug: 'son-moi', createdAt: now },
    { id: 'cat-4', name: 'Nước Hoa Chính Hãng', slug: 'nuoc-hoa', createdAt: now },
    { id: 'cat-5', name: 'Chăm Sóc Tóc & Body', slug: 'cham-soc-toc-body', createdAt: now },
  ];

  const users: User[] = [
    {
      id: 'usr-admin-1',
      phone: '0988888888',
      passwordHash: adminPasswordHash,
      name: 'Boss Hải',
      role: 'ADMIN',
      address: 'Văn phòng NovaBeauty, Hà Nội',
      createdAt: now,
    },
    {
      id: 'usr-manager-1',
      phone: '0966666666',
      passwordHash: '$2b$10$AiXYzOpYJY20DsVhy45FY.5cCpNVUks6VyP2b.DLb6qsdJwk/tpmq',
      name: 'Quản Lý Cửa Hàng',
      role: 'MANAGER',
      address: 'Văn phòng Điều phối, Vientiane',
      createdAt: now,
    },
    {
      id: 'usr-staff-1',
      phone: '0977777777',
      passwordHash: '$2b$10$6ADPzCohP/2CS4nozEZ0Pen7tNFvNm9XBqf70H71yQWMpHHBbTyku',
      name: 'Nhân Viên Bán Hàng',
      role: 'STAFF',
      address: 'Showroom NovaBeauty, Vientiane',
      createdAt: now,
    },
    {
      id: 'usr-customer-1',
      phone: '0912345678',
      passwordHash: userPasswordHash,
      name: 'Nguyễn Thu Trang',
      role: 'USER',
      address: 'Số 123 Đường Kim Mã, Ba Đình, Hà Nội',
      createdAt: now,
      customerType: 'RETAIL',
    },
    {
      id: 'usr-wholesale-1',
      phone: '0911223344',
      passwordHash: '$2b$10$sFMj1fS2gJGNLCGokFRTYuSS2WzMg7Y7aH8ugNwxvdH2Yb8EhPF/e',
      name: 'Đại Lý Sỉ Vientiane',
      role: 'USER',
      address: 'Chợ Sáng Talat Sao, Vientiane',
      createdAt: now,
      customerType: 'WHOLESALE',
    },
  ];

  const products: Product[] = [
    {
      id: 'prod-1',
      sku: 'ESTEE-ANR-50ML',
      name: 'Serum Phục Hồi & Trẻ Hóa Da Estée Lauder Advanced Night Repair 50ml',
      slug: 'serum-estee-lauder-advanced-night-repair-50ml',
      description: 'Tinh chất phục hồi số 1 thế giới với công nghệ Chronolux Power Signal độc quyền. Giúp da chống lại các tác nhân gây lão hóa từ môi trường, cấp ẩm sâu 72 giờ, thu nhỏ lỗ chân lông và làm mờ nếp nhăn rõ rệt chỉ sau 3 tuần sử dụng.',
      price: 2750000,
      stock: 25,
      categoryId: 'cat-1',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608248597359-543598739d48?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-2',
      sku: 'LRP-ANTHELIOS-50ML',
      name: 'Kem Chống Nắng Kiểm Soát Dầu La Roche-Posay Anthelios Oil Control 50ml',
      slug: 'kem-chong-nang-la-roche-posay-anthelios-50ml',
      description: 'Kem chống nắng kiểm soát dầu hàng đầu từ Pháp dành riêng cho da dầu mụn nhạy cảm. Màng lọc Mexoryl 400 độc quyền ngăn chặn tia UVA siêu dài, kiềm dầu khô thoáng suốt 12 giờ, không bết dính và không vệt trắng.',
      price: 465000,
      stock: 58,
      categoryId: 'cat-1',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-3',
      sku: 'DIOR-999-VELVET',
      name: 'Son Thỏi Dior Rouge Dior Forever Matte 999 Velvet Red',
      slug: 'son-dior-rouge-dior-999-velvet',
      description: 'Huyền thoại đỏ thuần kiêu kỳ của thương hiệu Dior Pháp. Công thức chuyển giao không lem bền màu suốt 16 giờ, chiết xuất hoa mẫu đơn đỏ dưỡng ẩm môi căng mịn tự nhiên suốt cả ngày dài.',
      price: 1150000,
      stock: 18,
      categoryId: 'cat-3',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-4',
      sku: 'CHANEL-COCO-100ML',
      name: 'Nước Hoa Nữ Chanel Coco Mademoiselle Eau De Parfum 100ml',
      slug: 'nuoc-hoa-chanel-coco-mademoiselle-100ml',
      description: 'Hương thơm biểu tượng thanh lịch, quý phái và đầy mê hoặc từ Paris. Nốt hương cam tươi mát bùng nổ, hòa quyện cùng cánh hoa hồng Thổ Nhĩ Kỳ và hoắc hương phương Đông vương vấn khó quên.',
      price: 4250000,
      stock: 12,
      categoryId: 'cat-4',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-5',
      sku: 'YSL-CUSHION-B20',
      name: 'Phấn Nước Cao Cấp YSL Le Cushion Encre De Peau SPF50 / PA+++ 14g',
      slug: 'phan-nuoc-ysl-le-cushion-encre-de-peau-14g',
      description: 'Thiết kế vỏ da chevron sang chảnh bậc nhất thế giới. Kết cấu hạt phấn nano siêu nhẹ tiệp vào da, che phủ khuyết điểm hoàn hảo, kiềm dầu giữ lớp nền mịn màng bền màu suốt 24 giờ.',
      price: 1650000,
      stock: 22,
      categoryId: 'cat-2',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-6',
      sku: 'DIOR-SAUVAGE-100ML',
      name: 'Nước Hoa Nam Dior Sauvage Eau De Parfum 100ml',
      slug: 'nuoc-hoa-nam-dior-sauvage-edp-100ml',
      description: 'Mùi hương nam tính quyến rũ vượt thời gian. Sự giao thoa của cam Bergamot Calabria cay nồng, hổ phách phương Đông ấm áp và vani Papua New Guinea mang lại phong độ lịch lãm cho phái mạnh.',
      price: 3690000,
      stock: 4,
      categoryId: 'cat-4',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-7',
      sku: 'LRP-B5-BAUME-100ML',
      name: 'Kem Dưỡng Phục Hồi Làm Dịu Da La Roche-Posay Cicaplast Baume B5+ 100ml',
      slug: 'kem-duong-la-roche-posay-b5-100ml',
      description: 'Kem dưỡng phục hồi da quốc dân số 1 từ Pháp. Chứa 5% Panthenol B5 kết hợp Madecassoside rau má và phức hợp vi sinh Tribioma, làm dịu tức thì kích ứng, mẩn đỏ sau nặn mụn hoặc treatment.',
      price: 385000,
      stock: 65,
      categoryId: 'cat-1',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1608248597359-543598739d48?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-8',
      sku: 'BLACK-ROUGE-A12',
      name: 'Son Kem Lì Mịn Như Nhung Black Rouge Air Fit Velvet Tint A12 Nâu Đỏ',
      slug: 'son-kem-black-rouge-a12',
      description: 'Tone màu đỏ nâu gạch huyền thoại làm mưa làm gió toàn châu Á. Chất son xốp mềm mỏng mịn, lên màu chuẩn chỉ với một lần quẹt, dưỡng ẩm sâu giúp môi mềm mịn không lộ rãnh.',
      price: 215000,
      stock: 80,
      categoryId: 'cat-3',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-9',
      sku: 'MOROCCAN-OIL-100ML',
      name: 'Tinh Dầu Dưỡng Tóc Moroccanoil Treatment Original 100ml',
      slug: 'tinh-dau-duong-toc-moroccanoil-100ml',
      description: 'Tinh dầu Argan tự nhiên quý giá nuôi dưỡng mái tóc suôn mượt óng ả chuẩn salon. Giúp giảm gãy rụng, phục hồi tóc hư tổn do uốn nhuộm và tạo lớp màng chống nhiệt, chống tia UV hiệu quả.',
      price: 850000,
      stock: 32,
      categoryId: 'cat-5',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608248597359-543598739d48?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-10',
      sku: 'BIODERMA-HONG-500ML',
      name: 'Nước Tẩy Trang Cho Da Nhạy Cảm Bioderma Sensibio H2O Nắp Hồng 500ml',
      slug: 'nuoc-tay-trang-bioderma-hong-500ml',
      description: 'Nước tẩy trang lành tính hàng đầu thế giới với công nghệ hạt micelle thông minh. Cuốn bay sạch bụi bẩn và lớp trang điểm mà vẫn giữ màng ẩm tự nhiên, cực kỳ êm dịu cho da mắt và môi.',
      price: 395000,
      stock: 45,
      categoryId: 'cat-1',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-11',
      sku: 'LANEIGE-LIP-BERRY',
      name: 'Mặt Nạ Ngủ Dưỡng Môi Laneige Lip Sleeping Mask Berry 20g',
      slug: 'mat-na-ngu-moi-laneige-berry-20g',
      description: 'Chăm sóc đôi môi căng mọng quyến rũ khi bạn ngủ. Chiết xuất phức hợp quả mọng giàu Vitamin C và chất chống oxy hóa, làm tan tế bào da chết cho đôi môi mềm mượt, ửng hồng tự nhiên.',
      price: 310000,
      stock: 3,
      categoryId: 'cat-3',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-12',
      sku: 'TESORI-LOTUS-500ML',
      name: 'Sữa Tắm Dưỡng Thể Nước Hoa Ý Tesori d\'Oriente Hoa Sen 500ml',
      slug: 'sua-tam-tesori-doriente-hoa-sen-500ml',
      description: 'Hương thơm hoa sen quý phái từ nước Ý lan tỏa ngát hương. Bọt kem giàu dưỡng chất bơ hạt mỡ dưỡng da ẩm mượt, mịn màng như nhung và lưu giữ hương thơm quyến rũ trên da suốt 8 giờ.',
      price: 230000,
      stock: 50,
      categoryId: 'cat-5',
      status: 'ACTIVE',
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop'
      ],
      createdAt: now,
      updatedAt: now,
    }
  ];

  const orders: Order[] = [
    {
      id: 'ord-seed-1',
      orderCode: 'ORD-20261008-001',
      userId: 'usr-customer-1',
      customerName: 'Nguyễn Thu Trang',
      customerPhone: '0912345678',
      shippingAddress: 'Số 123 Đường Kim Mã, Ba Đình, Hà Nội',
      note: 'Giao hàng trước 17h chiều giúp mình',
      totalPrice: 3215000,
      status: 'SHIPPING',
      items: [
        {
          id: 'item-1',
          orderId: 'ord-seed-1',
          productId: 'prod-1',
          productName: 'Serum Phục Hồi & Trẻ Hóa Da Estée Lauder Advanced Night Repair 50ml',
          productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop',
          quantity: 1,
          price: 2750000,
        },
        {
          id: 'item-2',
          orderId: 'ord-seed-1',
          productId: 'prod-2',
          productName: 'Kem Chống Nắng Kiểm Soát Dầu La Roche-Posay Anthelios Oil Control 50ml',
          productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop',
          quantity: 1,
          price: 465000,
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'ord-seed-2',
      orderCode: 'ORD-20261008-002',
      userId: 'usr-customer-1',
      customerName: 'Nguyễn Thu Trang',
      customerPhone: '0912345678',
      shippingAddress: 'Số 123 Đường Kim Mã, Ba Đình, Hà Nội',
      note: 'Đóng gói cẩn thận có bọc chống sốc',
      totalPrice: 1150000,
      status: 'CONFIRMED',
      items: [
        {
          id: 'item-3',
          orderId: 'ord-seed-2',
          productId: 'prod-3',
          productName: 'Son Thỏi Dior Rouge Dior Forever Matte 999 Velvet Red',
          productImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop',
          quantity: 1,
          price: 1150000,
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const siteSettings: SiteSettings = {
    storeName: 'NovaBeauty',
    slogan: 'Mỹ phẩm & Chăm sóc sắc đẹp chính hãng',
    primaryColor: 'rose',
    hotline: '1900 8888',
    email: 'cskh@novabeauty.vn',
    address: 'Số 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội',
    topAnnouncement: 'Miễn phí giao hàng đơn từ 300k | Cam kết 100% mỹ phẩm chính hãng có hóa đơn',
    showTopAnnouncement: true,
    showHeroBanner: true,
    heroBadge: 'BST Mỹ Phẩm Cao Cấp 2026 - Giảm tới 40%',
    heroTitle: 'Tỏa Sáng Rạng Ngời Cùng Mỹ Phẩm Chính Hãng Cao Cấp',
    heroSubtitle: 'Hệ thống phân phối mỹ phẩm, chăm sóc da và nước hoa hàng đầu từ Pháp, Hàn Quốc, Nhật Bản & Mỹ. Cam kết 100% nguồn gốc rõ ràng, hoàn tiền 200% nếu phát hiện hàng giả.',
    heroButtonPrimaryText: 'Khám phá sản phẩm hot',
    heroButtonSecondaryText: 'Mở giỏ hàng của bạn',
    heroImageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    heroCardTitle: 'Serum Estée Lauder Advanced Night Repair',
    heroCardSubtitle: 'Bí quyết trẻ hóa và căng bóng da tự nhiên',
    heroCardBadge: 'BÁN CHẠY NHẤT',
    badge1Title: 'Miễn phí giao hàng',
    badge1Desc: 'Cho đơn mỹ phẩm từ 300.000đ',
    badge2Title: '100% Chính hãng',
    badge2Desc: 'Tem phụ nhập khẩu & Hoàn tiền 200%',
    badge3Title: 'Đổi trả an tâm 14 ngày',
    badge3Desc: 'Bảo hành kích ứng da & lỗi bao bì',
    badge4Title: 'Tư vấn chuyên da 24/7',
    badge4Desc: 'Dược sĩ & chuyên viên hỗ trợ tận tình',
    catalogTitle: 'Mỹ Phẩm & Sản Phẩm Làm Đẹp Mới Nhất',
    catalogSubtitle: 'Mỹ phẩm chính hãng sẵn sàng giao ngay trong 2 giờ',
    borderRadius: 'rounded-3xl',
    productGridColumns: 4,
    topBarBgColor: 'zinc',
    logoUrl: '',

    showFlashSale: true,
    flashSaleBadge: '⚡ GIỜ VÀNG SẮC ĐẸP',
    flashSaleTitle: 'Flash Sale Mỹ Phẩm - Giảm Sốc Tới 50%',
    flashSaleSubtitle: 'Cơ hội săn deal mỹ phẩm và nước hoa chính hãng với giá tốt nhất hôm nay',
    flashSaleEndTime: '23:59:59',
    flashSaleDiscountCode: 'BEAUTY50',

    showPromoCards: true,
    promoCard1Badge: 'ƯU ĐÃI ĐẶC BIỆT',
    promoCard1Title: 'Combo Skincare Trắng Sáng',
    promoCard1Subtitle: 'Tặng ngay set minisize cao cấp cho đơn hàng từ 800.000đ',
    promoCard1ButtonText: 'Xem chi tiết',
    promoCard1ImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',

    promoCard2Badge: 'XU HƯỚNG 2026',
    promoCard2Title: 'BST Son Môi Mịn Lì',
    promoCard2Subtitle: 'Màu sắc thời thượng từ Dior, MAC, Black Rouge giảm thêm 25%',
    promoCard2ButtonText: 'Khám phá ngay',
    promoCard2ImageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',

    showPromoPopup: false,
    promoPopupTitle: 'Quà Tặng Khách Hàng Mới',
    promoPopupSubtitle: 'Nhận ngay Voucher 100.000đ cho đơn hàng mỹ phẩm đầu tiên từ 500k!',
    promoPopupCode: 'BEAUTY100',
    promoPopupDiscountText: 'GIẢM 100.000đ',

    showFloatingContact: true,
    facebookUrl: 'https://facebook.com',
    whatsappNumber: '+84988888888',
    zaloNumber: '0988888888',

    showNewsletter: true,
    newsletterTitle: 'Đăng Ký Nhận Bản Tin Làm Đẹp',
    newsletterSubtitle: 'Nhận sớm nhất thông báo giảm giá và voucher mỹ phẩm độc quyền từ NovaBeauty',

    footerAbout: 'Hệ thống phân phối mỹ phẩm chính hãng, chăm sóc da mặt, trang điểm và nước hoa cao cấp từ các thương hiệu uy tín toàn cầu.',
    footerCopyright: '© 2026 NovaBeauty Cosmetics. Bản quyền thuộc về NovaBeauty.',
  };

  return { users, categories, products, orders, siteSettings };
}

function readData(): DatabaseSchema {
  ensureDataDirectory();
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    writeData(initial);
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed: DatabaseSchema = JSON.parse(raw);
    const defaultSettings = getInitialData().siteSettings!;
    parsed.siteSettings = {
      ...defaultSettings,
      ...(parsed.siteSettings || {}),
    };
    parsed.products = (parsed.products || []).map(p => ({
      ...p,
      wholesalePrice: p.wholesalePrice !== undefined ? p.wholesalePrice : Math.round(p.price * 0.8),
      minWholesaleQty: p.minWholesaleQty || 3,
    }));
    parsed.users = (parsed.users || []).map(u => ({
      ...u,
      customerType: u.customerType || 'RETAIL',
    }));
    return parsed;
  } catch (error) {
    console.error('Error reading db file, regenerating:', error);
    const initial = getInitialData();
    writeData(initial);
    return initial;
  }
}

function writeData(data: DatabaseSchema): void {
  ensureDataDirectory();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  // USER OPERATIONS
  users: {
    findMany: (): User[] => {
      const data = readData();
      return data.users.map(({ passwordHash, ...u }) => ({ ...u, passwordHash: '' }));
    },
    findByPhone: (phone: string): User | undefined => {
      const data = readData();
      return data.users.find(u => u.phone === phone);
    },
    findById: (id: string): User | undefined => {
      const data = readData();
      return data.users.find(u => u.id === id);
    },
    create: (user: Omit<User, 'id' | 'createdAt'>): User => {
      const data = readData();
      const newUser: User = {
        ...user,
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
      };
      data.users.push(newUser);
      writeData(data);
      return newUser;
    },
    update: (id: string, updates: Partial<User>): User | null => {
      const data = readData();
      const index = data.users.findIndex(u => u.id === id);
      if (index === -1) return null;
      data.users[index] = {
        ...data.users[index],
        ...updates,
      };
      writeData(data);
      const { passwordHash: _discard, ...safeUser } = data.users[index];
      return safeUser as User;
    },
    delete: (id: string): boolean => {
      const data = readData();
      const initialLength = data.users.length;
      data.users = data.users.filter(u => u.id !== id);
      if (data.users.length !== initialLength) {
        writeData(data);
        return true;
      }
      return false;
    },
  },

  // CATEGORY OPERATIONS
  categories: {
    findMany: (): Category[] => {
      const data = readData();
      return data.categories;
    },
    findById: (id: string): Category | undefined => {
      const data = readData();
      return data.categories.find(c => c.id === id);
    },
    create: (category: { name: string; slug: string; nameLao?: string; icon?: string; subCategories?: SubCategory[] }): Category => {
      const data = readData();
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: category.name,
        nameLao: category.nameLao || '',
        slug: category.slug,
        icon: category.icon || 'Sparkles',
        subCategories: category.subCategories || [],
        createdAt: new Date().toISOString(),
      };
      data.categories.push(newCat);
      writeData(data);
      return newCat;
    },
    update: (id: string, updates: Partial<Category>): Category | null => {
      const data = readData();
      const index = data.categories.findIndex(c => c.id === id);
      if (index === -1) return null;
      data.categories[index] = {
        ...data.categories[index],
        ...updates,
      };
      writeData(data);
      return data.categories[index];
    },
    delete: (id: string): boolean => {
      const data = readData();
      const initialLength = data.categories.length;
      data.categories = data.categories.filter(c => c.id !== id);
      if (data.categories.length !== initialLength) {
        writeData(data);
        return true;
      }
      return false;
    },
  },

  // PRODUCT OPERATIONS
  products: {
    findMany: (options?: { categoryId?: string; subCategoryId?: string; search?: string; status?: ProductStatus; sort?: string }): Product[] => {
      const data = readData();
      let result = [...data.products];

      if (options?.status) {
        result = result.filter(p => p.status === options.status);
      }

      if (options?.categoryId && options.categoryId !== 'all') {
        result = result.filter(p => p.categoryId === options.categoryId);
      }

      if (options?.subCategoryId && options.subCategoryId !== 'all') {
        result = result.filter(p => p.subCategoryId === options.subCategoryId);
      }

      if (options?.search) {
        const query = options.search.toLowerCase().trim();
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }

      if (options?.sort === 'price_asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (options?.sort === 'price_desc') {
        result.sort((a, b) => b.price - a.price);
      } else {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      return result;
    },
    findById: (id: string): Product | undefined => {
      const data = readData();
      return data.products.find(p => p.id === id);
    },
    create: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
      const data = readData();
      const now = new Date().toISOString();
      const newProd: Product = {
        ...product,
        id: `prod-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      data.products.push(newProd);
      writeData(data);
      return newProd;
    },
    update: (id: string, updates: Partial<Product>): Product | null => {
      const data = readData();
      const index = data.products.findIndex(p => p.id === id);
      if (index === -1) return null;

      data.products[index] = {
        ...data.products[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      writeData(data);
      return data.products[index];
    },
    delete: (id: string): boolean => {
      const data = readData();
      const initialLength = data.products.length;
      data.products = data.products.filter(p => p.id !== id);
      if (data.products.length !== initialLength) {
        writeData(data);
        return true;
      }
      return false;
    },
  },

  // ORDER OPERATIONS
  orders: {
    findMany: (options?: { userId?: string; status?: OrderStatus; search?: string }): Order[] => {
      const data = readData();
      let result = [...data.orders];

      if (options?.userId) {
        result = result.filter(o => o.userId === options.userId);
      }

      if (options?.status) {
        result = result.filter(o => o.status === options.status);
      }

      if (options?.search) {
        const query = options.search.toLowerCase().trim();
        result = result.filter(o =>
          o.orderCode.toLowerCase().includes(query) ||
          o.customerPhone.includes(query) ||
          o.customerName.toLowerCase().includes(query)
        );
      }

      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return result;
    },
    findById: (id: string): Order | undefined => {
      const data = readData();
      return data.orders.find(o => o.id === id || o.orderCode === id);
    },
    create: (orderInput: {
      userId: string;
      customerName: string;
      customerPhone: string;
      customerType?: 'RETAIL' | 'WHOLESALE';
      shippingAddress: string;
      note?: string;
      items: { productId: string; quantity: number }[];
    }): { order: Order | null; error?: string } => {
      const data = readData();

      // 1. Validate items and stock
      if (!orderInput.items || orderInput.items.length === 0) {
        return { order: null, error: 'Giỏ hàng trống.' };
      }

      const orderItems: OrderItem[] = [];
      let calculatedTotalPrice = 0;

      // Lock/check inventory
      for (const item of orderInput.items) {
        const product = data.products.find(p => p.id === item.productId);
        if (!product) {
          return { order: null, error: `Sản phẩm có mã ${item.productId} không tồn tại.` };
        }
        if (product.status !== 'ACTIVE') {
          return { order: null, error: `Sản phẩm "${product.name}" hiện đang ngừng kinh doanh.` };
        }
        if (item.quantity <= 0) {
          return { order: null, error: `Số lượng đặt mua phải lớn hơn 0.` };
        }
        if (product.stock < item.quantity) {
          return {
            order: null,
            error: `Sản phẩm "${product.name}" chỉ còn ${product.stock} chiếc trong kho (bạn đặt ${item.quantity}).`,
          };
        }

        const isWholesale = orderInput.customerType === 'WHOLESALE';
        const itemPrice = isWholesale
          ? (product.wholesalePrice !== undefined && product.wholesalePrice > 0 ? product.wholesalePrice : Math.round(product.price * 0.8))
          : product.price;

        const itemSubtotal = itemPrice * item.quantity;
        calculatedTotalPrice += itemSubtotal;

        orderItems.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          orderId: '',
          productId: product.id,
          productName: product.name,
          productNameLao: product.nameLao,
          productImage: product.images[0] || '',
          quantity: item.quantity,
          price: itemPrice,
          isWholesale,
        });
      }

      // 2. Atomically deduct inventory
      for (const item of orderInput.items) {
        const prod = data.products.find(p => p.id === item.productId);
        if (prod) {
          prod.stock -= item.quantity;
          prod.updatedAt = new Date().toISOString();
        }
      }

      // 3. Create order
      const now = new Date();
      const codeSuffix = Math.floor(1000 + Math.random() * 9000);
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const orderCode = `ORD-${dateStr}-${codeSuffix}`;
      const orderId = `ord-${Date.now()}`;

      orderItems.forEach(item => {
        item.orderId = orderId;
      });

      const newOrder: Order = {
        id: orderId,
        orderCode,
        userId: orderInput.userId,
        customerName: orderInput.customerName,
        customerPhone: orderInput.customerPhone,
        customerType: orderInput.customerType || 'RETAIL',
        shippingAddress: orderInput.shippingAddress,
        note: orderInput.note || '',
        totalPrice: calculatedTotalPrice,
        status: 'PENDING',
        items: orderItems,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      data.orders.push(newOrder);
      writeData(data);

      return { order: newOrder };
    },
    update: (orderId: string, updates: Partial<Order>): Order | null => {
      const data = readData();
      const order = data.orders.find(o => o.id === orderId);
      if (!order) return null;

      const oldStatus = order.status;
      if (updates.status && updates.status !== oldStatus) {
        order.status = updates.status;
        // If cancelled from an active status, restore stock
        if (updates.status === 'CANCELLED' && oldStatus !== 'CANCELLED') {
          for (const item of order.items) {
            const prod = data.products.find(p => p.id === item.productId);
            if (prod) {
              prod.stock += item.quantity;
              prod.updatedAt = new Date().toISOString();
            }
          }
        }
      }

      if (updates.assignedStaffId !== undefined) order.assignedStaffId = updates.assignedStaffId;
      if (updates.assignedStaffName !== undefined) order.assignedStaffName = updates.assignedStaffName;
      if (updates.assignedStaffPhone !== undefined) order.assignedStaffPhone = updates.assignedStaffPhone;
      if (updates.assignedAt !== undefined) order.assignedAt = updates.assignedAt;
      if (updates.assignedBy !== undefined) order.assignedBy = updates.assignedBy;
      if (updates.note !== undefined) order.note = updates.note;

      order.updatedAt = new Date().toISOString();
      writeData(data);
      return order;
    },
    updateStatus: (orderId: string, status: OrderStatus): Order | null => {
      const data = readData();
      const order = data.orders.find(o => o.id === orderId);
      if (!order) return null;

      const oldStatus = order.status;
      order.status = status;
      order.updatedAt = new Date().toISOString();

      // If cancelled from an active status, restore stock
      if (status === 'CANCELLED' && oldStatus !== 'CANCELLED') {
        for (const item of order.items) {
          const prod = data.products.find(p => p.id === item.productId);
          if (prod) {
            prod.stock += item.quantity;
            prod.updatedAt = new Date().toISOString();
          }
        }
      }

      writeData(data);
      return order;
    },
  },

  // DASHBOARD METRICS
  dashboard: {
    getStats: () => {
      const data = readData();
      const totalRevenue = data.orders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + o.totalPrice, 0);

      const totalOrders = data.orders.length;
      const totalProducts = data.products.length;
      const totalUsers = data.users.filter(u => u.role === 'USER').length;
      const lowStockProducts = data.products.filter(p => p.stock <= 5);
      const pendingOrdersCount = data.orders.filter(o => o.status === 'PENDING').length;

      return {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        pendingOrdersCount,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders: data.orders.slice(0, 5),
      };
    },
  },

  // SITE SETTINGS
  settings: {
    get: (): SiteSettings => {
      const data = readData();
      return data.siteSettings || getInitialData().siteSettings!;
    },
    update: (updates: Partial<SiteSettings>): SiteSettings => {
      const data = readData();
      const current = data.siteSettings || getInitialData().siteSettings!;
      data.siteSettings = {
        ...current,
        ...updates,
      };
      writeData(data);
      return data.siteSettings;
    },
  },
};
