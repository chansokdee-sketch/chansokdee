const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

console.log('--- BẮT ĐẦU NHẬP DỮ LIỆU SABUYSOFT ---');

const excelPath = path.join(__dirname, '..', 'extracted_sabuy', 'SabuySoft_Data_Hang.xlsx');
if (!fs.existsSync(excelPath)) {
  console.error('Không tìm thấy file Excel tại:', excelPath);
  process.exit(1);
}

const wb = xlsx.readFile(excelPath);
const spSheet = wb.Sheets['Danh Sach San Pham'];
const spRows = xlsx.utils.sheet_to_json(spSheet);

const nhomSheet = wb.Sheets['Nhom Hang'];
const nhomRows = xlsx.utils.sheet_to_json(nhomSheet);

console.log(`Đã đọc ${spRows.length} dòng sản phẩm và ${nhomRows.length} nhóm hàng.`);

// 1. Ánh xạ 29 nhóm hàng SabuySoft
const categoryMeta = {
  1: { name: 'Phấn rôm & Phấn bột', slug: 'phan-rom-bot', icon: 'Sparkles' },
  2: { name: 'Dưỡng da mặt, body & gót chân', slug: 'duong-da-body', icon: 'Heart' },
  3: { name: 'Dầu gội, dầu xả & kem ủ tóc', slug: 'dau-goi-xa-u', icon: 'Smile' },
  4: { name: 'Sữa tắm, xà bông & tẩy da chết', slug: 'sua-tam-xa-bong', icon: 'Droplets' },
  5: { name: 'Dung dịch vệ sinh', slug: 'dung-dich-ve-sinh', icon: 'ShieldCheck' },
  6: { name: 'Dầu dưỡng & nhuộm tóc', slug: 'duong-nhuom-toc', icon: 'Scissors' },
  7: { name: 'Sản phẩm cho mẹ & bé', slug: 'san-pham-cho-be', icon: 'Baby' },
  8: { name: 'Lăn khử mùi (Roll-on)', slug: 'lan-khu-mui', icon: 'Zap' },
  9: { name: 'Sữa rửa mặt', slug: 'sua-rua-mat', icon: 'Droplet' },
  10: { name: 'Chăm sóc răng miệng', slug: 'cham-soc-rang-mieng', icon: 'Smile' },
  11: { name: 'Wax & Gel vuốt tóc', slug: 'wax-vuot-toc', icon: 'Wind' },
  12: { name: 'Chống muỗi & côn trùng', slug: 'chong-muoi-con-trung', icon: 'Shield' },
  13: { name: 'Dầu cù là & dầu gió', slug: 'dau-cu-la-dau-gio', icon: 'Activity' },
  14: { name: 'Trà & Cà phê', slug: 'tra-ca-phe', icon: 'Coffee' },
  15: { name: 'Dao cạo râu & phụ kiện', slug: 'dao-cao-rau', icon: 'Scissors' },
  16: { name: 'Nước lau sàn & tẩy rửa', slug: 'nuoc-tay-rua-lau-san', icon: 'Trash2' },
  17: { name: 'Sáp thơm & xịt phòng', slug: 'xit-phong-sap-thom', icon: 'Wind' },
  18: { name: 'Khăn giấy & giấy vệ sinh', slug: 'khan-giay-ve-sinh', icon: 'Layers' },
  19: { name: 'Dụng cụ & phụ kiện trang điểm', slug: 'dung-cu-trang-diem', icon: 'PenTool' },
  20: { name: 'Mỹ phẩm trang điểm', slug: 'my-pham-trang-diem', icon: 'Palette' },
  21: { name: 'Bình sữa & núm ti', slug: 'binh-sua-num-ti', icon: 'HeartHandshake' },
  22: { name: 'Nước hoa & tinh dầu', slug: 'nuoc-hoa', icon: 'Feather' },
  23: { name: 'Phấn nén & phấn phủ', slug: 'phan-nen-phan-phu', icon: 'Sun' },
  24: { name: 'Băng vệ sinh & tã bỉm', slug: 'bang-ve-sinh-ta-bim', icon: 'Package' },
  25: { name: 'Bột giặt & nước xả vải', slug: 'bot-giat-nuoc-xa-vai', icon: 'ShoppingBag' },
  26: { name: 'Dụng cụ học tập', slug: 'dung-cu-hoc-tap', icon: 'BookOpen' },
  27: { name: 'Thuốc lá', slug: 'thuoc-la', icon: 'Flame' },
  28: { name: 'Tất vớ & găng tay', slug: 'tat-vo-gang-tay', icon: 'Compass' },
  29: { name: 'Hàng tiêu dùng khác', slug: 'hang-tieu-dung-khac', icon: 'Grid' },
};

const now = new Date().toISOString();
const categories = [];
const nhomNameToIdMap = new Map();

nhomRows.forEach(row => {
  const idNum = Number(row.ID_Nhom);
  const laoName = String(row.Ten_Nhom || '').trim();
  const catId = `cat-${idNum}`;
  const meta = categoryMeta[idNum] || { name: laoName, slug: `danh-muc-${idNum}`, icon: 'Sparkles' };

  nhomNameToIdMap.set(laoName, catId);

  categories.push({
    id: catId,
    name: meta.name,
    nameLao: laoName,
    slug: meta.slug,
    icon: meta.icon,
    subCategories: [],
    createdAt: now,
  });
});

console.log(`Đã khởi tạo ${categories.length} danh mục theo đúng SabuySoft.`);

// 2. Chuyển đổi sản phẩm
const products = [];
let activeCount = 0;
let hiddenCount = 0;

spRows.forEach((r, idx) => {
  const isDiscontinued = String(r.Trang_Thai || '').includes('xÃ³a') || String(r.Trang_Thai || '').includes('Ngá»«ng');
  const priceLAK = Number(r.Gia_Ban_1) || 0;
  
  // Trạng thái hiển thị
  let status = 'ACTIVE';
  if (isDiscontinued || priceLAK <= 0) {
    status = 'HIDDEN';
    hiddenCount++;
  } else {
    activeCount++;
  }

  // Giá Baht
  const priceTHB = Number(r.Gia_Ban_4) > 0 ? Number(r.Gia_Ban_4) : undefined;

  // Giá sỉ LAK
  let wholesaleLAK = Number(r.Gia_Ban_2) > 0 
    ? Number(r.Gia_Ban_2) 
    : (Number(r.Gia_Ban_3) > 0 ? Number(r.Gia_Ban_3) : Math.round(priceLAK * 0.85));

  // Giá sỉ THB
  let wholesaleTHB = Number(r.Gia_Ban_5) > 0 
    ? Number(r.Gia_Ban_5) 
    : (priceTHB ? Math.round(priceTHB * 0.85) : undefined);

  // Nhóm hàng
  const nhomHangStr = String(r.Nhom_Hang || '').trim();
  const categoryId = nhomNameToIdMap.get(nhomHangStr) || 'cat-29';

  // Barcode & SKU
  const barcode = String(r.Ma_Vach || '').trim();
  const rawSku = String(r.Ma_San_Pham || barcode || `SP-${r.ID || idx + 1}`).trim();

  // Tên sản phẩm
  const name = String(r.Ten_San_Pham || '').trim();
  const baseUnit = String(r.Don_Vi_Tinh || 'ອັນ').trim();

  // Tồn kho: Nếu > 0 thì giữ nguyên, nếu <= 0 thì gán mặc định 50 để khách có thể đặt hàng ngay
  const posStock = Number(r.Tong_Ton_Kho);
  const stock = posStock > 0 ? posStock : 50;

  // Ngày tạo/cập nhật
  let createdAt = now;
  try {
    if (r.Ngay_Tao) createdAt = new Date(r.Ngay_Tao).toISOString();
  } catch (e) {}

  let updatedAt = now;
  try {
    if (r.Ngay_Cap_Nhat) updatedAt = new Date(r.Ngay_Cap_Nhat).toISOString();
  } catch (e) {}

  const product = {
    id: `prod-${r.ID || idx + 1}`,
    sku: rawSku,
    barcode: barcode || undefined,
    name: name,
    nameLao: name,
    slug: `sp-${r.ID || idx + 1}`,
    description: name,
    descriptionLao: name,
    price: priceLAK,
    priceTHB: priceTHB,
    wholesalePrice: wholesaleLAK,
    wholesalePriceTHB: wholesaleTHB,
    minWholesaleQty: 3,
    baseUnitName: baseUnit,
    baseUnitNameLao: baseUnit,
    stock: stock,
    categoryId: categoryId,
    status: status,
    images: [], // Chưa có ảnh, hiển thị placeholder và cho phép tải ảnh sau
    createdAt: createdAt,
    updatedAt: updatedAt,
  };

  products.push(product);
});

console.log(`Đã xử lý xong: ${products.length} sản phẩm (${activeCount} Đang kinh doanh, ${hiddenCount} Ngừng kinh doanh/Đã xóa/Giá 0).`);

// 3. Đọc dữ liệu cũ để bảo toàn users, orders, siteSettings
const storeFilePath = path.join(__dirname, '..', 'data', 'store.json');
let existingData = {
  users: [],
  orders: [],
  siteSettings: {}
};

if (fs.existsSync(storeFilePath)) {
  try {
    const raw = fs.readFileSync(storeFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed.users) existingData.users = parsed.users;
    if (parsed.orders) existingData.orders = parsed.orders;
    if (parsed.siteSettings) existingData.siteSettings = parsed.siteSettings;
    console.log(`Bảo toàn: ${existingData.users.length} người dùng, ${existingData.orders.length} đơn hàng.`);
  } catch (e) {
    console.warn('Lỗi đọc store.json cũ, sẽ ghi đè:', e.message);
  }
}

// 4. Ghi dữ liệu vào store.json
const updatedData = {
  users: existingData.users,
  categories: categories,
  products: products,
  orders: existingData.orders,
  siteSettings: existingData.siteSettings,
};

fs.writeFileSync(storeFilePath, JSON.stringify(updatedData, null, 2), 'utf8');
const finalSizeMB = (fs.statSync(storeFilePath).size / (1024 * 1024)).toFixed(2);
console.log(`>>> THÀNH CÔNG! Đã lưu dữ liệu vào data/store.json (${finalSizeMB} MB)`);
