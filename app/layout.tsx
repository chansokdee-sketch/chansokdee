import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  title: 'NovaBeauty - ຮ້ານຂາຍເຄື່ອງສຳອາງ & ຄວາມງາມແທ້ 100% | Mỹ Phẩm Chính Hãng',
  description: 'ລະບົບຈຳໜ່າຍເຄື່ອງສຳອາງ, ບຳລຸງຜິວ, ລິບສະຕິກ ແລະ ນ້ຳຫອມແທ້ຊັ້ນນຳ.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lo" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 antialiased font-sans" suppressHydrationWarning>
        <Providers>
          {children}
          <CartDrawer />
          <AuthModal />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
