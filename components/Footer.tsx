'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Headphones, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, isLao } = useLanguage();
  const [footerInfo, setFooterInfo] = useState({
    storeName: 'NovaBeauty',
    hotline: '020 55 777 975',
    about: 'ລະບົບຈຳໜ່າຍເຄື່ອງສຳອາງແທ້, ບຳລຸງຜິວໜ້າ, ແຕ່ງໜ້າ ແລະ ນ້ຳຫອມລະດັບສູງຈາກແບຣນດັງທົ່ວໂລກ.',
    copyright: '© 2026 NovaBeauty Cosmetics. ສະຫງວນລິຂະສິດ.',
    badge1Title: 'ຈັດສົ່ງຟຣີທົ່ວປະເທດ',
    badge1Desc: 'ສຳລັບຍອດສັ່ງຊື້ແຕ່ 300.000₭',
    badge2Title: 'ຂອງແທ້ 100%',
    badge2Desc: 'ນຳເຂົ້າແທ້ 100% & ຄືນເງິນ 200%',
    badge3Title: 'ປ່ຽນຄືນພາຍໃນ 14 ມື້',
    badge3Desc: 'ຮັບປະກັນຖ້າມີອາການແພ້ ຫຼື ບັນຫາ',
    badge4Title: 'ປຶກສາຜິວພັນ 24/7',
    badge4Desc: 'ປຶກສາຜ່ານ Facebook & WhatsApp',
    facebookUrl: 'https://facebook.com',
    whatsappNumber: '02055777975',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setFooterInfo(prev => ({
            ...prev,
            storeName: data.settings.storeName || prev.storeName,
            hotline: data.settings.hotline || prev.hotline,
            about: data.settings.footerAbout || prev.about,
            copyright: data.settings.footerCopyright || prev.copyright,
            badge1Title: data.settings.badge1Title || prev.badge1Title,
            badge1Desc: data.settings.badge1Desc || prev.badge1Desc,
            badge2Title: data.settings.badge2Title || prev.badge2Title,
            badge2Desc: data.settings.badge2Desc || prev.badge2Desc,
            badge3Title: data.settings.badge3Title || prev.badge3Title,
            badge3Desc: data.settings.badge3Desc || prev.badge3Desc,
            badge4Title: data.settings.badge4Title || prev.badge4Title,
            badge4Desc: data.settings.badge4Desc || prev.badge4Desc,
            facebookUrl: data.settings.facebookUrl || prev.facebookUrl,
            whatsappNumber: data.settings.whatsappNumber || prev.whatsappNumber,
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-zinc-950 text-zinc-300 mt-20 border-t border-zinc-800">
      {/* Trust Badges */}
      <div className="border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{isLao && footerInfo.badge1Title === 'Giao hàng miễn phí' ? t('badge1_title') : footerInfo.badge1Title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{isLao && footerInfo.badge1Desc === 'Cho đơn hàng từ 500.000đ' ? t('badge1_desc') : footerInfo.badge1Desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{isLao && footerInfo.badge2Title === '100% Chính hãng' ? t('badge2_title') : footerInfo.badge2Title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{isLao && footerInfo.badge2Desc === 'Bảo hành chính hãng 12-24 tháng' ? t('badge2_desc') : footerInfo.badge2Desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{isLao && footerInfo.badge3Title === 'Đổi trả 1-1 trong 30 ngày' ? t('badge3_title') : footerInfo.badge3Title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{isLao && footerInfo.badge3Desc === 'Nếu phát sinh lỗi từ nhà sản xuất' ? t('badge3_desc') : footerInfo.badge3Desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{isLao && footerInfo.badge4Title === 'Hỗ trợ 24/7' ? t('badge4_title') : footerInfo.badge4Title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{isLao && footerInfo.badge4Desc === 'Tư vấn tận tâm, chu đáo' ? t('badge4_desc') : footerInfo.badge4Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {footerInfo.storeName}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isLao && footerInfo.about === 'Hệ thống bán lẻ thiết bị công nghệ, điện thoại, máy tính bảng và phụ kiện chính hãng uy tín hàng đầu.' ? 'ລະບົບຂາຍຍ່ອຍອຸປະກອນເທັກໂນໂລຢີ, ໂທລະສັບ, ແທັບເລັດ ແລະ ອຸປະກອນເສີມແທ້ຊັ້ນນຳ.' : footerInfo.about}
            </p>
            <p className="text-xs text-zinc-400">
              {isLao ? 'ສາຍດ່ວນລູກຄ້າ:' : 'Hotline CSKH:'} <strong className="text-white">{footerInfo.hotline}</strong> (8:00 - 21:30)
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={footerInfo.facebookUrl || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2] text-[#1877F2] hover:text-white transition flex items-center justify-center border border-[#1877F2]/25"
                title="Facebook Fanpage"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={`https://wa.me/${(footerInfo.whatsappNumber || '+84988888888').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white transition flex items-center justify-center border border-[#25D366]/25"
                title="WhatsApp CSKH"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-white mb-3">{isLao ? 'ກ່ຽວກັບ NovaStore' : 'Về NovaStore'}</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/" className="hover:text-white transition">{isLao ? 'ແນະນຳຮ້ານຄ້າ' : 'Giới thiệu cửa hàng'}</Link></li>
              <li><Link href="/" className="hover:text-white transition">{isLao ? 'ລະບົບສາຂາ' : 'Hệ thống showroom'}</Link></li>
              <li><Link href="/" className="hover:text-white transition">{isLao ? 'ຮັບສະໝັກພະນັກງານ' : 'Tuyển dụng'}</Link></li>
              <li><Link href="/" className="hover:text-white transition">{isLao ? 'ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ' : 'Chính sách bảo mật'}</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-white mb-3">{isLao ? 'ຊ່ວຍເຫຼືອລູກຄ້າ' : 'Hỗ trợ khách hàng'}</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/orders" className="hover:text-white transition">{isLao ? 'ກວດສອບລາຍການສັ່ງຊື້' : 'Tra cứu đơn hàng'}</Link></li>
              <li><Link href="/" className="hover:text-white transition">{isLao ? 'ນະໂຍບາຍການຮັບປະກັນ' : 'Chính sách bảo hành'}</Link></li>
              <li><Link href="/" className="hover:text-white transition">{isLao ? 'ນະໂຍບາຍປ່ຽນຄືນ' : 'Chính sách đổi trả'}</Link></li>
              <li><Link href="/" className="hover:text-white transition">{isLao ? 'ວິທີການສັ່ງຊື້' : 'Hướng dẫn mua hàng'}</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-white mb-3">{isLao ? 'ລະບົບ ແລະ ຈັດການ' : 'Hệ sinh thái & Quản trị'}</h5>
            <p className="text-xs text-zinc-400 mb-3">
              {isLao ? 'ລະບົບຈັດການພາຍໃນສຳລັບພະນັກງານ ແລະ ແອັດມິນ.' : 'Cổng thông tin quản trị nội bộ dành cho nhân viên vận hành hệ thống.'}
            </p>
            <Link 
              href="/admin" 
              className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isLao ? 'ເຂົ້າສູ່ລະບົບແອັດມິນ' : 'Đăng nhập Quản trị viên'}
            </Link>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 text-center text-xs text-zinc-500">
          {footerInfo.copyright}
        </div>
      </div>
    </footer>
  );
}
