import React from 'react';
import { ShoppingBag, MessageCircle, Flame, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const MobileBottomBar: React.FC = () => {
  const { cartItemCount, setIsCartOpen, openProductEditor } = useShop();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo-de-mantos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d0e14]/95 backdrop-blur-lg border-t border-white/10 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl">
      <div className="grid grid-cols-4 gap-1.5 items-center">
        {/* 1. Ver Catálogo */}
        <button
          type="button"
          onClick={scrollToCatalog}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-white/5 active:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <Flame className="w-4.5 h-4.5 text-amber-400" />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
            Mantos
          </span>
        </button>

        {/* 2. Painel mnstore Editor */}
        <button
          type="button"
          onClick={() => openProductEditor()}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-amber-500/10 border border-amber-500/30 active:bg-amber-500/20 text-amber-300 transition-all cursor-pointer"
        >
          <Lock className="w-4.5 h-4.5 text-amber-400" />
          <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5">
            Painel
          </span>
        </button>

        {/* 3. WhatsApp Encomendas / Atacado */}
        <a
          href={getWhatsAppUrl("Olá MN Store! Gostaria de encomendar camisas de time ou tirar dúvidas.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 active:bg-emerald-500/25 transition-all text-center cursor-pointer"
        >
          <MessageCircle className="w-4.5 h-4.5 text-emerald-400 fill-emerald-400/20" />
          <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5 line-clamp-1 leading-tight">
            WhatsApp
          </span>
        </a>

        {/* 4. Sacola com Badge */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-gold-gradient text-black font-extrabold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4.5 h-4.5 fill-black" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-black text-amber-300 font-mono text-[9px] font-black px-1 rounded-full border border-amber-400">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">
            Sacola
          </span>
        </button>
      </div>
    </div>
  );
};
