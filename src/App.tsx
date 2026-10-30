/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CatalogSection } from './components/CatalogSection';
import { StoreGuaranteesSection } from './components/StoreGuaranteesSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductEditorModal } from './components/ProductEditorModal';
import { LojistaLoginModal } from './components/LojistaLoginModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Check } from 'lucide-react';

const ToastNotification: React.FC = () => {
  const { toastMessage } = useShop();
  if (!toastMessage) return null;

  return (
    <div className="fixed top-22 right-4 z-50 animate-in slide-in-from-top-3 duration-200">
      <div className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 border border-amber-300">
        <Check className="w-4 h-4" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0b0c0e] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Toast Alert */}
      <ToastNotification />

      {/* Main Header */}
      <Header />

      {/* 1. Em Cima: Qualidade Tailandesa 1:1 Banner */}
      <HeroBanner />

      {/* 2. Em Baixo: Já o Catálogo de Mantos */}
      <main className="flex-1">
        <CatalogSection />
      </main>

      {/* 3. O Restante Lá Em Baixo: Benefícios, Garantias, Qualidade Tailandesa e Envio */}
      <StoreGuaranteesSection />

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
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
