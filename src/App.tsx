/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { VideoShowcaseSection } from './components/VideoShowcaseSection';
import { CatalogSection } from './components/CatalogSection';
import { StoreGuaranteesSection } from './components/StoreGuaranteesSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ProductEditorModal } from './components/ProductEditorModal';
import { LojistaLoginModal } from './components/LojistaLoginModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MobileBottomBar } from './components/MobileBottomBar';
import { Check } from 'lucide-react';

const ToastNotification: React.FC = () => {
  const { toastMessage } = useShop();
  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 sm:top-22 right-3 sm:right-4 z-50 animate-in slide-in-from-top-3 duration-200 max-w-[calc(100vw-1.5rem)]">
      <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 border border-amber-300">
        <Check className="w-4 h-4 shrink-0" />
        <span className="truncate">{toastMessage}</span>
      </div>
    </div>
  );
};

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0b0c0e] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black overflow-x-hidden w-full max-w-full pb-16 sm:pb-0">
      {/* Toast Alert */}
      <ToastNotification />

      {/* Main Header */}
      <Header />

      {/* 1. Em Cima: Qualidade Tailandesa 1:1 Banner */}
      <HeroBanner />

      {/* 2. Em Destaque: Vídeo na Moldura mostrando o Material Real */}
      <VideoShowcaseSection />

      {/* 3. Catálogo de Mantos */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <CatalogSection />
      </main>

      {/* 3. O Restante Lá Em Baixo: Benefícios, Garantias, Qualidade Tailandesa e Envio */}
      <StoreGuaranteesSection />

      {/* Footer */}
      <Footer />

      {/* Mobile Quick Bottom Navigation */}
      <MobileBottomBar />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <LojistaLoginModal />
      <ProductEditorModal />
      <SizeGuideModal />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
