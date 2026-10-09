'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, X, ChevronRight, Headphones } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FloatingContactWidget() {
  const pathname = usePathname();
  const { isLao } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    hotline: '020 55 777 975',
    whatsappNumber: '020 55 777 975',
    facebookUrl: 'https://www.facebook.com/minhnam.ho.125',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setStoreInfo({
            hotline: data.settings.hotline || '020 55 777 975',
            whatsappNumber: data.settings.whatsappNumber || '020 55 777 975',
            facebookUrl: data.settings.facebookUrl || 'https://www.facebook.com/minhnam.ho.125',
          });
        }
      })
      .catch(() => {});
  }, []);

  // Hide on admin routes and cart page to keep checkout clear
  if (pathname.startsWith('/admin') || pathname === '/cart') {
    return null;
  }

  const cleanWhatsapp = (storeInfo.whatsappNumber || '02055777975').replace(/\D/g, '');
  const cleanPhone = (storeInfo.hotline || '02055777975').replace(/\s/g, '');

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-16 right-3.5 sm:bottom-6 sm:right-6 z-30">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-3 sm:p-3.5 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-full shadow-xl shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center border-2 border-white/80"
          aria-label="Liên hệ hỗ trợ tư vấn"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          ) : (
            <>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </>
          )}
        </button>
      </div>

      {/* Contact Popup Modal / Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl z-10 border border-zinc-100 animate-in slide-in-from-bottom-5 duration-200 space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-sm">
                    {isLao ? 'ຕິດຕໍ່ & ປຶກສາທັນທີ' : 'Tư Vấn & Đặt Hàng Nhanh'}
                  </h3>
                  <p className="text-[10px] text-zinc-500">
                    {isLao ? 'ບໍລິການ 24/7 ຕອບກັບໄວພາຍໃນ 5 ນາທີ' : 'Hỗ trợ 24/7, phản hồi trong 5 phút'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contact Actions List */}
            <div className="space-y-2.5">
              
              {/* 1. WhatsApp Button */}
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 transition active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-zinc-900 text-xs group-hover:text-emerald-700 transition">
                      WhatsApp Chat
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      {storeInfo.whatsappNumber}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 transition" />
              </a>

              {/* 2. Direct Phone Call Button */}
              <a
                href={`tel:${cleanPhone}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 transition active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Phone className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-zinc-900 text-xs group-hover:text-blue-700 transition">
                      {isLao ? 'ໂທສາຍດ່ວນ Hotline' : 'Gọi Hotline Trực Tiếp'}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      {storeInfo.hotline}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 transition" />
              </a>

              {/* 3. Facebook Messenger */}
              {storeInfo.facebookUrl && (
                <a
                  href={storeInfo.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-zinc-900 text-xs">
                        Facebook Fanpage
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {isLao ? 'ສົ່ງຂໍ້ຄວາມທາງ Facebook' : 'Nhắn tin qua Fanpage'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 transition" />
                </a>
              )}

            </div>

            <div className="pt-1 text-center">
              <span className="text-[10px] text-zinc-400">
                {isLao ? 'ຮ້ານເຄື່ອງສຳອາງ & ຄວາມງາມ NovaBeauty ວຽງຈັນ' : 'NovaBeauty - Đồng hành cùng vẻ đẹp của bạn'}
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
