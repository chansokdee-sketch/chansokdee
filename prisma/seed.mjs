import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding ---');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const adminPasswordHash = await bcrypt.hash('AdminPassword@123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@novastore.vn',
      phone: '0988888888',
      name: 'Hệ Thống NovaStore Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Sample Customer
  const customerPasswordHash = await bcrypt.hash('CustomerPassword@123', 10);
  const customer = await prisma.user.create({
    data: {
      phone: '0912345678',
      email: 'khachhang@gmail.com',
      name: 'Nguyễn Văn An',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Sample Customer created:', customer.phone);

  // Sample Products
  const sampleProducts = [
    {
      name: 'iPhone 16 Pro Max 256GB Titan Tự Nhiên',
      description: 'Thiết kế Titan cấp hàng không vũ trụ siêu bền nhẹ, màn hình Super Retina XDR 6.9 inch viền mỏng nhất từ trước đến nay. Trang bị chip Apple A18 Pro mạnh mẽ đỉnh cao và nút Điều Khiển Camera hoàn toàn mới.',
      price: 34990000,
      stockQuantity: 25,
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
      category: 'Điện thoại',
    },
    {
      name: 'Samsung Galaxy S24 Ultra 5G 512GB Xám Titan',
      description: 'Kỷ nguyên quyền năng Galaxy AI vượt trội: Khoanh tròn để tìm kiếm, Trợ lý chat thông minh, Phiên dịch trực tiếp cuộc gọi. Khung viền Titan sang trọng cùng camera 200MP bắt trọn chi tiết sắc nét.',
      price: 29990000,
      stockQuantity: 18,
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop',
      category: 'Điện thoại',
    },
    {
      name: 'MacBook Pro 14 inch M3 Pro (18GB / 512GB SSD) Đen Không Gian',
      description: 'Hiệu năng đồ họa đột phá với chip Apple M3 Pro cấu trúc GPU thế hệ mới. Thời lượng pin cực khủng lên tới 18 giờ liên tục, màn hình Liquid Retina XDR độ sáng tối đa 1600 nits đỉnh cao.',
      price: 49990000,
      stockQuantity: 12,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
      category: 'Laptop',
    },
    {
      name: 'Dell XPS 13 Plus 9320 Core i7 / 16GB / 512GB OLED',
      description: 'Thiết kế tương lai với touchpad tàng hình bằng kính liền mạch và dải phím cảm ứng điện dung. Màn hình OLED 3.5K sắc nét rực rỡ, trọng lượng siêu nhẹ chỉ 1.2kg tiện lợi di chuyển.',
      price: 38500000,
      stockQuantity: 15,
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop',
      category: 'Laptop',
    },
    {
      name: 'iPad Pro M4 11 inch Wi-Fi 256GB Đen Không Gian',
      description: 'Độ mỏng kỷ lục 5.3mm kết hợp cùng màn hình Ultra Retina XDR Tandem OLED đột phá. Vi xử lý Apple M4 mang đến sức mạnh đồ họa đỉnh cao cho mọi tác vụ sáng tạo chuyên nghiệp.',
      price: 24990000,
      stockQuantity: 20,
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
      category: 'Tablet',
    },
    {
      name: 'Tai nghe Chống ồn Không dây Sony WH-1000XM5 Black',
      description: 'Đỉnh cao chống ồn thế giới với bộ xử lý kép V1 và QN1 kết hợp 8 micro. Chất lượng âm thanh Hi-Res Audio chân thực, thời lượng pin 30 giờ và công nghệ đàm thoại AI lọc tạp âm cực đỉnh.',
      price: 7990000,
      stockQuantity: 30,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      category: 'Âm thanh',
    },
    {
      name: 'Tai nghe Apple AirPods Pro 2 USB-C Hộp sạc MagSafe',
      description: 'Chip Apple H2 nâng tầm khả năng Chống Ồn Chủ Động gấp 2 lần, Chế độ Xuyên Âm Thích Ứng thông minh và Âm Thanh Không Gian Cá Nhân Hóa giúp bạn đắm chìm trong từng giai điệu.',
      price: 5490000,
      stockQuantity: 40,
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop',
      category: 'Âm thanh',
    },
    {
      name: 'Apple Watch Series 9 GPS 45mm Viền Nhôm Dây Thể Thao',
      description: 'Thao tác Chạm Hai Lần (Double Tap) kỳ diệu điều khiển đồng hồ mà không cần chạm màn hình. Độ sáng 2000 nits gấp đôi thế hệ trước cùng cảm biến đo nhịp tim, SpO2 và giấc ngủ chuẩn xác.',
      price: 9990000,
      stockQuantity: 22,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      category: 'Đồng hồ',
    },
    {
      name: 'Củ sạc nhanh Anker GaNPrime 120W 3 cổng A2148',
      description: 'Công nghệ GaN III sạc nhanh đồng thời 3 thiết bị Laptop, iPad và Smartphone với công suất tối đa 120W. Thiết kế nhỏ gọn hơn 40% so với củ sạc thông thường, kiểm soát nhiệt độ ActiveShield 2.0.',
      price: 1850000,
      stockQuantity: 50,
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
      category: 'Phụ kiện',
    },
    {
      name: 'Chuột Công Thái Học Không Dây Logitech MX Master 3S',
      description: 'Cảm biến 8.000 DPI lướt mượt trên mọi bề mặt kính, nút bấm Quiet Clicks giảm 90% tiếng ồn. Con cuộn MagSpeed siêu tốc 1.000 dòng/giây cùng pin dùng 70 ngày sau một lần sạc.',
      price: 2450000,
      stockQuantity: 35,
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop',
      category: 'Phụ kiện',
    },
  ];

  for (const item of sampleProducts) {
    await prisma.product.create({
      data: item,
    });
  }
  console.log(`✅ Seeded ${sampleProducts.length} sample products successfully!`);

  // Create an initial sample order for the customer
  const firstProd = await prisma.product.findFirst();
  if (firstProd) {
    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        totalAmount: firstProd.price,
        status: 'CONFIRMED',
        shippingAddress: '123 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội',
        orderItems: {
          create: {
            productId: firstProd.id,
            quantity: 1,
            price: firstProd.price,
          },
        },
      },
    });
    console.log('✅ Created sample order:', order.id);
  }

  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
