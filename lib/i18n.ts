export type Language = 'vi' | 'lo';

export interface TranslationDictionary {
  // Common / Header
  nav_hotline: string;
  nav_guarantee: string;
  nav_admin_settings: string;
  nav_admin_portal: string;
  nav_search_placeholder: string;
  nav_cart: string;
  nav_login: string;
  nav_register: string;
  nav_my_orders: string;
  nav_logout: string;
  nav_admin_badge: string;
  nav_customer_badge: string;
  nav_home: string;
  nav_categories: string;
  nav_account: string;

  // Mobile Bottom Nav
  mb_home: string;
  mb_categories: string;
  mb_cart: string;
  mb_orders: string;
  mb_account: string;
  mb_admin: string;

  // Homepage Hero & Sections
  hero_default_badge: string;
  hero_default_title: string;
  hero_default_desc: string;
  hero_btn_buy: string;
  hero_btn_explore: string;
  flash_sale_badge: string;
  flash_sale_title: string;
  flash_sale_subtitle: string;
  flash_sale_code: string;
  flash_sale_end: string;
  badge1_title: string;
  badge1_desc: string;
  badge2_title: string;
  badge2_desc: string;
  badge3_title: string;
  badge3_desc: string;
  badge4_title: string;
  badge4_desc: string;
  catalog_title: string;
  catalog_subtitle: string;
  all_categories: string;
  subcategories_title: string;
  all_subcategories: string;
  brand_label: string;
  sort_by: string;
  sort_newest: string;
  sort_price_asc: string;
  sort_price_desc: string;
  sort_name_asc: string;
  in_stock: string;
  out_of_stock: string;
  add_to_cart: string;
  buy_now: string;
  added_to_cart: string;
  view_details: string;

  // Floating Contact & Promo Popup
  contact_messenger: string;
  contact_whatsapp: string;
  contact_hotline: string;
  promo_gift_title: string;
  promo_discount: string;
  promo_use_code: string;
  promo_code_copied: string;
  promo_copy_code: string;
  promo_shop_now: string;

  // Product Detail
  pd_sku: string;
  pd_category: string;
  pd_status: string;
  pd_remaining: string;
  pd_quantity: string;
  pd_description: string;
  pd_guarantee_1: string;
  pd_guarantee_2: string;
  pd_guarantee_3: string;
  pd_back: string;
  unit_piece: string;
  unit_pack: string;
  unit_box: string;
  unit_carton: string;
  unit_select_title: string;
  unit_piece_desc: string;
  unit_pack_desc: string;
  unit_box_desc: string;
  unit_carton_desc: string;
  product_color: string;
  product_size: string;

  // Cart & Checkout
  cart_title: string;
  cart_empty: string;
  cart_empty_desc: string;
  cart_explore: string;
  cart_items_count: string;
  cart_item_code: string;
  cart_delete: string;
  cart_free_ship_guarantee: string;
  cart_shipping_info: string;
  cart_login_prompt_title: string;
  cart_login_prompt_desc: string;
  cart_login_now: string;
  cart_receiver_name: string;
  cart_receiver_phone: string;
  cart_receiver_address: string;
  cart_note: string;
  cart_subtotal: string;
  cart_shipping_fee: string;
  cart_free: string;
  cart_total: string;
  cart_confirm_checkout: string;
  cart_submitting: string;
  cart_success_title: string;
  cart_success_desc: string;
  cart_order_code: string;
  cart_payment_method: string;
  cart_payment_cod: string;
  cart_view_history: string;
  cart_continue_shopping: string;

  // Cart Drawer
  drawer_title: string;
  drawer_empty: string;
  drawer_empty_desc: string;
  drawer_proceed_checkout: string;
  drawer_continue_shopping: string;

  // Orders Page
  orders_title: string;
  orders_subtitle: string;
  orders_not_logged_in: string;
  orders_not_logged_in_desc: string;
  orders_empty: string;
  orders_empty_desc: string;
  orders_code: string;
  orders_date: string;
  orders_ship_to: string;
  orders_note: string;
  orders_total: string;
  status_pending: string;
  status_confirmed: string;
  status_processing: string;
  status_shipping: string;
  status_completed: string;
  status_cancelled: string;

  // Auth Modal
  auth_login_tab: string;
  auth_register_tab: string;
  auth_demo_title: string;
  auth_demo_admin: string;
  auth_demo_manager: string;
  auth_demo_staff: string;
  auth_demo_user: string;
  auth_demo_wholesale: string;
  auth_demo_wholesale_btn: string;
  auth_name: string;
  auth_phone: string;
  auth_password: string;
  auth_password_hint: string;
  auth_address: string;
  auth_login_btn: string;
  auth_register_btn: string;
  auth_processing: string;
  auth_secure_notice: string;

  // Language & Currency
  lang_name: string;
  lang_flag: string;
  currency_unit: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  vi: {
    // Common / Header
    nav_hotline: 'Hotline:',
    nav_guarantee: 'Cam kết 100% hàng chính hãng',
    nav_admin_settings: '⚙️ Cài đặt giao diện',
    nav_admin_portal: 'Vào Trang Quản Trị',
    nav_search_placeholder: 'Tìm kiếm son môi, serum, kem chống nắng, nước hoa...',
    nav_cart: 'Giỏ hàng',
    nav_login: 'Đăng nhập',
    nav_register: 'Đăng ký',
    nav_my_orders: 'Đơn hàng của tôi',
    nav_logout: 'Đăng xuất',
    nav_admin_badge: '👑 Quản trị viên',
    nav_customer_badge: 'Khách hàng',
    nav_home: 'Trang chủ',
    nav_categories: 'Danh mục',
    nav_account: 'Tài khoản',

    // Mobile Bottom Nav
    mb_home: 'Trang chủ',
    mb_categories: 'Danh mục',
    mb_cart: 'Giỏ hàng',
    mb_orders: 'Đơn hàng',
    mb_account: 'Tài khoản',
    mb_admin: 'Quản trị',

    // Homepage Hero & Sections
    hero_default_badge: 'Mỹ Phẩm Cao Cấp 2026',
    hero_default_title: 'Tỏa Sáng Rạng Ngời Cùng Mỹ Phẩm Chính Hãng',
    hero_default_desc: 'Khám phá thế giới mỹ phẩm, dưỡng da, son môi và nước hoa cao cấp với ưu đãi hấp dẫn.',
    hero_btn_buy: 'Mua Ngay Hôm Nay',
    hero_btn_explore: 'Khám Phá Danh Mục',
    flash_sale_badge: '⚡ FLASH SALE SẮC ĐẸP',
    flash_sale_title: 'Giảm Giá Mỹ Phẩm Cực Sốc Hôm Nay',
    flash_sale_subtitle: 'Cơ hội sở hữu mỹ phẩm và nước hoa chính hãng với giá tốt nhất trong tuần.',
    flash_sale_code: 'Mã giảm:',
    flash_sale_end: 'Kết thúc sau:',
    badge1_title: 'Miễn Phí Vận Chuyển',
    badge1_desc: 'Cho đơn mỹ phẩm từ 300.000đ',
    badge2_title: 'Chính Hãng 100%',
    badge2_desc: 'Tem phụ nhập khẩu & Hoàn tiền 200%',
    badge3_title: 'Đổi Trả An Tâm 14 Ngày',
    badge3_desc: 'Bảo hành dị ứng & lỗi bao bì',
    badge4_title: 'Tư Vấn Chuyên Da 24/7',
    badge4_desc: 'Tư vấn nhanh qua Facebook & WhatsApp',
    catalog_title: 'Mỹ Phẩm & Sản Phẩm Làm Đẹp Mới Nhất',
    catalog_subtitle: 'Mỹ phẩm chính hãng sẵn sàng giao ngay trong 2 giờ',
    all_categories: 'Tất cả mỹ phẩm',
    subcategories_title: 'Mục phân loại:',
    all_subcategories: 'Tất cả mục nhỏ',
    brand_label: 'Thương hiệu',
    sort_by: 'Sắp xếp:',
    sort_newest: 'Mới nhất',
    sort_price_asc: 'Giá: Thấp đến Cao',
    sort_price_desc: 'Giá: Cao đến Thấp',
    sort_name_asc: 'Tên: A - Z',
    in_stock: 'Còn hàng:',
    out_of_stock: 'Hết hàng',
    add_to_cart: 'Thêm vào giỏ',
    buy_now: 'Mua ngay',
    added_to_cart: 'Đã thêm vào giỏ hàng!',
    view_details: 'Xem chi tiết',

    // Floating Contact & Promo Popup
    contact_messenger: 'Facebook Messenger',
    contact_whatsapp: 'WhatsApp',
    contact_hotline: 'Hotline',
    promo_gift_title: 'Quà Tặng Khách Hàng Mới',
    promo_discount: 'GIẢM 100.000đ',
    promo_use_code: 'Nhập mã giảm giá khi thanh toán:',
    promo_code_copied: 'Đã sao chép mã ưu đãi!',
    promo_copy_code: 'Sao chép mã',
    promo_shop_now: 'Khám phá sản phẩm ngay',

    // Product Detail
    pd_sku: 'Mã sản phẩm:',
    pd_category: 'Danh mục:',
    pd_status: 'Tình trạng:',
    pd_remaining: 'Còn lại {stock} sản phẩm trong kho',
    pd_quantity: 'Số lượng:',
    pd_description: 'Mô tả chi tiết sản phẩm',
    pd_guarantee_1: 'Cam kết 100% hàng chính hãng',
    pd_guarantee_2: 'Miễn phí giao hàng toàn quốc, kiểm tra trước khi nhận',
    pd_guarantee_3: 'Đổi mới trong 7 ngày nếu lỗi từ nhà sản xuất',
    pd_back: 'Quay lại cửa hàng',
    unit_piece: 'Cái',
    unit_pack: 'Lốc',
    unit_box: 'Hộp',
    unit_carton: 'Thùng',
    unit_select_title: 'Quy cách đóng gói:',
    unit_piece_desc: 'Mua lẻ 1 cái',
    unit_pack_desc: 'Lốc ({qty} cái)',
    unit_box_desc: 'Hộp ({qty} cái)',
    unit_carton_desc: 'Thùng ({qty} cái)',
    product_color: 'Màu sắc:',
    product_size: 'Kích cỡ / Dung tích:',

    // Cart & Checkout
    cart_title: 'Giỏ hàng & Thanh toán',
    cart_empty: 'Giỏ hàng của bạn đang trống',
    cart_empty_desc: 'Chưa có sản phẩm nào được chọn. Hãy ghé thăm gian hàng của chúng tôi!',
    cart_explore: 'Xem danh sách sản phẩm',
    cart_items_count: 'Sản phẩm trong giỏ',
    cart_item_code: 'Mã:',
    cart_delete: 'Xóa',
    cart_free_ship_guarantee: 'Đơn hàng được miễn phí giao nhanh toàn quốc. Kiểm tra hàng trước khi thanh toán.',
    cart_shipping_info: 'Thông tin giao hàng',
    cart_login_prompt_title: 'Bạn chưa đăng nhập tài khoản',
    cart_login_prompt_desc: 'Hãy đăng nhập bằng số điện thoại để lưu trữ đơn hàng và theo dõi hành trình giao nhận.',
    cart_login_now: 'Đăng nhập / Đăng ký ngay',
    cart_receiver_name: 'Họ và tên người nhận *',
    cart_receiver_phone: 'Số điện thoại nhận hàng *',
    cart_receiver_address: 'Địa chỉ nhận hàng chi tiết *',
    cart_note: 'Ghi chú đơn hàng (Tùy chọn)',
    cart_subtotal: 'Tạm tính:',
    cart_shipping_fee: 'Phí giao hàng:',
    cart_free: 'Miễn phí',
    cart_total: 'Tổng thanh toán:',
    cart_confirm_checkout: 'Xác nhận đặt hàng ngay',
    cart_submitting: 'Đang tạo đơn hàng...',
    cart_success_title: 'Đặt hàng thành công!',
    cart_success_desc: 'Cảm ơn bạn đã tin tưởng mua sắm tại NovaStore. Đơn hàng của bạn đã được ghi nhận vào hệ thống.',
    cart_order_code: 'Mã đơn hàng:',
    cart_payment_method: 'Phương thức thanh toán:',
    cart_payment_cod: 'Thanh toán khi nhận hàng (COD)',
    cart_view_history: 'Xem lịch sử đơn hàng',
    cart_continue_shopping: 'Tiếp tục mua hàng',

    // Cart Drawer
    drawer_title: 'Giỏ hàng của bạn',
    drawer_empty: 'Giỏ hàng của bạn đang trống',
    drawer_empty_desc: 'Hãy dạo xem các sản phẩm công nghệ hot nhất và chọn món đồ bạn yêu thích nhé!',
    drawer_proceed_checkout: 'Tiến hành thanh toán',
    drawer_continue_shopping: 'Tiếp tục chọn thêm sản phẩm',

    // Orders Page
    orders_title: 'Đơn hàng của tôi',
    orders_subtitle: 'Theo dõi tình trạng vận chuyển và lịch sử mua sắm của bạn',
    orders_not_logged_in: 'Bạn chưa đăng nhập',
    orders_not_logged_in_desc: 'Vui lòng đăng nhập bằng số điện thoại để tra cứu và quản lý các đơn hàng của bạn.',
    orders_empty: 'Bạn chưa có đơn hàng nào',
    orders_empty_desc: 'Hãy khám phá các sản phẩm công nghệ tuyệt vời và đặt đơn hàng đầu tiên nhé!',
    orders_code: 'Mã đơn:',
    orders_date: 'Đặt ngày:',
    orders_ship_to: 'Giao tới:',
    orders_note: 'Ghi chú:',
    orders_total: 'Tổng thanh toán:',
    status_pending: 'Chờ xác nhận',
    status_confirmed: 'Đã xác nhận',
    status_processing: 'Đang xử lý',
    status_shipping: 'Đang giao hàng',
    status_completed: 'Hoàn thành',
    status_cancelled: 'Đã hủy',

    // Auth Modal
    auth_login_tab: 'Đăng nhập',
    auth_register_tab: 'Đăng ký tài khoản',
    auth_demo_title: 'Tài khoản mẫu để test nhanh:',
    auth_demo_admin: '👑 Boss Hải',
    auth_demo_manager: '💼 Quản Lý',
    auth_demo_staff: '👔 Nhân Viên',
    auth_demo_user: '👤 Khách Lẻ',
    auth_demo_wholesale: '⚡ Khách Sỉ (Giá sỉ)',
    auth_demo_wholesale_btn: 'Thử nghiệm giá sỉ:',
    auth_name: 'Họ và tên của bạn',
    auth_phone: 'Số điện thoại',
    auth_password: 'Mật khẩu',
    auth_password_hint: 'Tối thiểu 6 ký tự bảo mật',
    auth_address: 'Địa chỉ giao hàng mặc định (Tùy chọn)',
    auth_login_btn: 'Đăng nhập ngay',
    auth_register_btn: 'Tạo tài khoản',
    auth_processing: 'Đang xử lý...',
    auth_secure_notice: 'Mật khẩu được mã hóa an toàn theo tiêu chuẩn bảo mật.',

    // Language & Currency
    lang_name: 'Tiếng Việt',
    lang_flag: '🇻🇳',
    currency_unit: '₫',
  },

  lo: {
    // Common / Header
    nav_hotline: 'ສາຍດ່ວນ:',
    nav_guarantee: 'ຮັບປະກັນສິນຄ້າແທ້ 100%',
    nav_admin_settings: '⚙️ ຕັ້ງຄ່າໜ້າເວັບ',
    nav_admin_portal: 'ໜ້າຈັດການລະບົບ',
    nav_search_placeholder: 'ຄົ້ນຫາລິບສະຕິກ, ເຊຣັ່ມ, ຄີມກັນແດດ, ນ້ຳຫອມ...',
    nav_cart: 'ກະຕ່າ',
    nav_login: 'ເຂົ້າສູ່ລະບົບ',
    nav_register: 'ລົງທະບຽນ',
    nav_my_orders: 'ລາຍການສັ່ງຊື້ຂອງຂ້ອຍ',
    nav_logout: 'ອອກຈາກລະບົບ',
    nav_admin_badge: '👑 ຜູ້ເບິ່ງແຍງລະບົບ',
    nav_customer_badge: 'ລູກຄ້າ',
    nav_home: 'ໜ້າຫຼັກ',
    nav_categories: 'ໝວດໝູ່',
    nav_account: 'ບັນຊີ',

    // Mobile Bottom Nav
    mb_home: 'ໜ້າຫຼັກ',
    mb_categories: 'ໝວດໝູ່',
    mb_cart: 'ກະຕ່າ',
    mb_orders: 'ສັ່ງຊື້',
    mb_account: 'ບັນຊີ',
    mb_admin: 'ແອັດມິນ',

    // Homepage Hero & Sections
    hero_default_badge: 'ເຄື່ອງສຳອາງພຣີມຽມ 2026',
    hero_default_title: 'ສ່ອງແສງຄວາມງາມດ້ວຍເຄື່ອງສຳອາງແທ້ 100%',
    hero_default_desc: 'ຄົ້ນພົບໂລກເຄື່ອງສຳອາງ, ບຳລຸງຜິວ, ລິບສະຕິກ ແລະ ນ້ຳຫອມແທ້ ພ້ອມໂປຣໂມຊັ່ນສຸດພິເສດ.',
    hero_btn_buy: 'ຊື້ເລີຍດຽວນີ້',
    hero_btn_explore: 'ເບິ່ງໝວດໝູ່',
    flash_sale_badge: '⚡ FLASH SALE ຄວາມງາມ',
    flash_sale_title: 'ຫຼຸດລາຄາເຄື່ອງສຳອາງພິເສດມື້ນີ້',
    flash_sale_subtitle: 'ໂອກາດເປັນເຈົ້າຂອງເຄື່ອງສຳອາງ ແລະ ນ້ຳຫອມແທ້ໃນລາຄາທີ່ດີທີ່ສຸດ.',
    flash_sale_code: 'ລະຫັດຫຼຸດ:',
    flash_sale_end: 'ສິ້ນສຸດໃນ:',
    badge1_title: 'ຈັດສົ່ງຟຣີທົ່ວປະເທດ',
    badge1_desc: 'ສຳລັບລາຍການສັ່ງຊື້ແຕ່ 300.000₭ ຂຶ້ນໄປ',
    badge2_title: 'ຂອງແທ້ 100%',
    badge2_desc: 'ນຳເຂົ້າແທ້ 100% ຄືນເງິນ 200% ຖ້າພົບຂອງປອມ',
    badge3_title: 'ປ່ຽນຄືນພາຍໃນ 14 ມື້',
    badge3_desc: 'ຮັບປະກັນຖ້າມີອາການແພ້ ຫຼື ບັນຫາຈາກໂຮງງານ',
    badge4_title: 'ປຶກສາຜິວພັນຕະຫຼອດ 24/7',
    badge4_desc: 'ປຶກສາຜິວພັນຜ່ານ Facebook & WhatsApp',
    catalog_title: 'ເຄື່ອງສຳອາງ & ຄວາມງາມທັງໝົດ',
    catalog_subtitle: 'ເຄື່ອງສຳອາງແທ້ພ້ອມຈັດສົ່ງດ່ວນພາຍໃນ 2 ຊົ່ວໂມງ',
    all_categories: 'ເຄື່ອງສຳອາງທັງໝົດ',
    subcategories_title: 'ໝວດໝູ່ຍ່ອຍ:',
    all_subcategories: 'ທຸກໝວດຍ່ອຍ',
    brand_label: 'ຍີ່ຫໍ້',
    sort_by: 'ຮຽງຕາມ:',
    sort_newest: 'ໃໝ່ລ່າສຸດ',
    sort_price_asc: 'ລາຄາ: ຕ່ຳຫາສູງ',
    sort_price_desc: 'ລາຄາ: ສູງຫາຕ່ຳ',
    sort_name_asc: 'ຊື່: A - Z',
    in_stock: 'ຍັງເຫຼືອ:',
    out_of_stock: 'ສິນຄ້າໝົດ',
    add_to_cart: 'ເພີ່ມໃສ່ກະຕ່າ',
    buy_now: 'ຊື້ເລີຍ',
    added_to_cart: 'ເພີ່ມໃສ່ກະຕ່າແລ້ວ!',
    view_details: 'ເບິ່ງລາຍລະອຽດ',

    // Floating Contact & Promo Popup
    contact_messenger: 'Facebook Messenger',
    contact_whatsapp: 'WhatsApp',
    contact_hotline: 'ສາຍດ່ວນ',
    promo_gift_title: 'ຂອງຂວັນຕ້ອນຮັບລູກຄ້າໃໝ່',
    promo_discount: 'ຫຼຸດທັນທີ 100.000₭',
    promo_use_code: 'ປ້ອນລະຫັດເມື່ອຊຳລະເງິນ:',
    promo_code_copied: 'ຄັດລອກລະຫັດແລ້ວ!',
    promo_copy_code: 'ຄັດລອກລະຫັດ',
    promo_shop_now: 'ຊື້ເຄື່ອງດຽວນີ້',

    // Product Detail
    pd_sku: 'ລະຫັດສິນຄ້າ:',
    pd_category: 'ໝວດໝູ່:',
    pd_status: 'ສະຖານະ:',
    pd_remaining: 'ຍັງເຫຼືອ {stock} ຊິ້ນໃນສາງ',
    pd_quantity: 'ຈຳນວນ:',
    pd_description: 'ລາຍລະອຽດສິນຄ້າ',
    pd_guarantee_1: 'ຮັບປະກັນສິນຄ້າແທ້ 100% ຈາກສູນ',
    pd_guarantee_2: 'ຈັດສົ່ງຟຣີທົ່ວປະເທດ, ກວດກາກ່ອນຊຳລະເງິນ',
    pd_guarantee_3: 'ປ່ຽນໃໝ່ພາຍໃນ 7 ມື້ ຖ້າມີຂໍ້ບົກຜ່ອງ',
    pd_back: 'ກັບຄືນໜ້າຮ້ານ',
    unit_piece: 'ອັນ',
    unit_pack: 'ແພັກ',
    unit_box: 'ກ່ອງ',
    unit_carton: 'ລັງ',
    unit_select_title: 'ເລືອກຮູບແບບການຊື້:',
    unit_piece_desc: 'ຊື້ຍ່ອຍ 1 ອັນ',
    unit_pack_desc: 'ແພັກ ({qty} ອັນ)',
    unit_box_desc: 'ກ່ອງ ({qty} ອັນ)',
    unit_carton_desc: 'ລັງ ({qty} ອັນ)',
    product_color: 'ສີສັນ:',
    product_size: 'ຂະໜາດ / ປະລິມານ:',

    // Cart & Checkout
    cart_title: 'ກະຕ່າສິນຄ້າ & ຊຳລະເງິນ',
    cart_empty: 'ກະຕ່າຂອງທ່ານຍັງວ່າງເປົ່າ',
    cart_empty_desc: 'ຍັງບໍ່ມີສິນຄ້າໃດໆ. ຂໍເຊີນທ່ານເລືອກເບິ່ງສິນຄ້າຂອງພວກເຮົາ!',
    cart_explore: 'ເບິ່ງລາຍການສິນຄ້າ',
    cart_items_count: 'ສິນຄ້າໃນກະຕ່າ',
    cart_item_code: 'ລະຫັດ:',
    cart_delete: 'ລຶບ',
    cart_free_ship_guarantee: 'ລາຍການສັ່ງຊື້ໄດ້ຮັບການຈັດສົ່ງຟຣີທົ່ວປະເທດ. ກວດກາສິນຄ້າກ່ອນຊຳລະເງິນ.',
    cart_shipping_info: 'ຂໍ້ມູນການຈັດສົ່ງ',
    cart_login_prompt_title: 'ທ່ານຍັງບໍ່ໄດ້ເຂົ້າສູ່ລະບົບ',
    cart_login_prompt_desc: 'ກະລຸນາເຂົ້າສູ່ລະບົບດ້ວຍເບີໂທລະສັບເພື່ອບັນທຶກ ແລະ ຕິດຕາມລາຍການສັ່ງຊື້ຂອງທ່ານ.',
    cart_login_now: 'ເຂົ້າສູ່ລະບົບ / ລົງທະບຽນເລີຍ',
    cart_receiver_name: 'ຊື່ ແລະ ນາມສະກຸນຜູ້ຮັບ *',
    cart_receiver_phone: 'ເບີໂທລະສັບຮັບສິນຄ້າ *',
    cart_receiver_address: 'ທີ່ຢູ່ຈັດສົ່ງລະອຽດ *',
    cart_note: 'ໝາຍເຫດ (ເລືອກໄດ້)',
    cart_subtotal: 'ຍອດລວມສິນຄ້າ:',
    cart_shipping_fee: 'ຄ່າຈັດສົ່ງ:',
    cart_free: 'ຟຣີ',
    cart_total: 'ຍອດຊຳລະທັງໝົດ:',
    cart_confirm_checkout: 'ຢືນຢັນການສັ່ງຊື້ດຽວນີ້',
    cart_submitting: 'ກຳລັງສ້າງລາຍການສັ່ງຊື້...',
    cart_success_title: 'ສັ່ງຊື້ສຳເລັດແລ້ວ!',
    cart_success_desc: 'ຂອບໃຈທີ່ໄວ້ວາງໃຈເລືອກຊື້ກັບ NovaStore. ລາຍການສັ່ງຊື້ຂອງທ່ານໄດ້ຖືກບັນທຶກເຂົ້າສູ່ລະບົບແລ້ວ.',
    cart_order_code: 'ລະຫັດສັ່ງຊື້:',
    cart_payment_method: 'ວິທີຊຳລະເງິນ:',
    cart_payment_cod: 'ຊຳລະເງິນສົດເມື່ອຮັບສິນຄ້າ (COD)',
    cart_view_history: 'ເບິ່ງປະຫວັດການສັ່ງຊື້',
    cart_continue_shopping: 'ສືບຕໍ່ຊື້ສິນຄ້າ',

    // Cart Drawer
    drawer_title: 'ກະຕ່າສິນຄ້າຂອງທ່ານ',
    drawer_empty: 'ກະຕ່າຂອງທ່ານຍັງວ່າງເປົ່າ',
    drawer_empty_desc: 'ເລືອກສິນຄ້າເທັກໂນໂລຢີທີ່ທ່ານມັກ ແລະ ເພີ່ມໃສ່ກະຕ່າໄດ້ເລີຍ!',
    drawer_proceed_checkout: 'ດຳເນີນການຊຳລະເງິນ',
    drawer_continue_shopping: 'ເລືອກຊື້ສິນຄ້າຕໍ່',

    // Orders Page
    orders_title: 'ລາຍການສັ່ງຊື້ຂອງຂ້ອຍ',
    orders_subtitle: 'ຕິດຕາມສະຖານະການຈັດສົ່ງ ແລະ ປະຫວັດການສັ່ງຊື້ຂອງທ່ານ',
    orders_not_logged_in: 'ທ່ານຍັງບໍ່ໄດ້ເຂົ້າສູ່ລະບົບ',
    orders_not_logged_in_desc: 'ກະລຸນາເຂົ້າສູ່ລະບົບດ້ວຍເບີໂທລະສັບເພື່ອຕິດຕາມ ແລະ ຈັດການລາຍການສັ່ງຊື້ຂອງທ່ານ.',
    orders_empty: 'ທ່ານຍັງບໍ່ມີລາຍການສັ່ງຊື້ເທື່ອ',
    orders_empty_desc: 'ຄົ້ນພົບອຸປະກອນເທັກໂນໂລຢີທີ່ໜ້າສົນໃຈ ແລະ ເລີ່ມສັ່ງຊື້ລາຍການທຳອິດໄດ້ເລີຍ!',
    orders_code: 'ລະຫັດສັ່ງຊື້:',
    orders_date: 'ວັນທີສັ່ງ:',
    orders_ship_to: 'ຈັດສົ່ງຫາ:',
    orders_note: 'ໝາຍເຫດ:',
    orders_total: 'ຍອດຊຳລະທັງໝົດ:',
    status_pending: 'ລໍຖ້າການຢືນຢັນ',
    status_confirmed: 'ຢືນຢັນແລ້ວ',
    status_processing: 'ກຳລັງດຳເນີນການ',
    status_shipping: 'ກຳລັງຈັດສົ່ງ',
    status_completed: 'ສຳເລັດແລ້ວ',
    status_cancelled: 'ຍົກເລີກແລ້ວ',

    // Auth Modal
    auth_login_tab: 'ເຂົ້າສູ່ລະບົບ',
    auth_register_tab: 'ລົງທະບຽນບັນຊີ',
    auth_demo_title: 'ບັນຊີຕົວຢ່າງສຳລັບທົດສອບ:',
    auth_demo_admin: '👑 Boss Hải',
    auth_demo_manager: '💼 Quản Lý',
    auth_demo_staff: '👔 Nhân Viên',
    auth_demo_user: '👤 Khách Hàng',
    auth_demo_wholesale: '⚡ Khách Sỉ (ລາຄາສົ່ງ)',
    auth_demo_wholesale_btn: 'ທົດສອບລາຄາສົ່ງ:',
    auth_name: 'ຊື່ ແລະ ນາມສະກຸນ',
    auth_phone: 'ເບີໂທລະສັບ',
    auth_password: 'ລະຫັດຜ່ານ',
    auth_password_hint: 'ຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ',
    auth_address: 'ທີ່ຢູ່ຈັດສົ່ງເລີ່ມຕົ້ນ (ເລືອກໄດ້)',
    auth_login_btn: 'ເຂົ້າສູ່ລະບົບດຽວນີ້',
    auth_register_btn: 'ສ້າງບັນຊີ',
    auth_processing: 'ກຳລັງດຳເນີນການ...',
    auth_secure_notice: 'ລະຫັດຜ່ານຖືກປົກປ້ອງຕາມມາດຕະຖານຄວາມປອດໄພສູງ.',

    // Language & Currency
    lang_name: 'ພາສາລາວ',
    lang_flag: '🇱🇦',
    currency_unit: '₭',
  },
};
