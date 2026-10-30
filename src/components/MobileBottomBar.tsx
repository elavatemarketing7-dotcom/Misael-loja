import React from 'react';
import { ShoppingBag, MessageCircle, Flame, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const MobileBottomBar: React.FC = () => {
  const { cartItemCount, setIsCartOpen, openProductEditor } = useShop();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo-de-mantos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d0e14]/95 backdrop-blur-lg border-t border-white/10 px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl">
      <div className="grid grid-cols-3 gap-2 items-center">
        {/* 1. Ver Catálogo */}
        <button
          type="button"
          onClick={scrollToCatalog}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-white/5 active:bg-white/10 text-slate-300 hover:text-white transition-all"
        >
          <Flame className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
            Mantos
          </span>
        </button>

        {/* 2. WhatsApp Atacado / Dúvidas */}
        <a
          href="https://wa.me/5511999999999?text=Ol%C3%A1%20MN%20Store!%20Gostaria%20de%20fazer%20um%20pedido%20acima%20de%2010%20pe%C3%A7as%20no%20atacado%20ou%20tirar%20d%C3%BAvidas."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 active:bg-emerald-500/25 transition-all text-center"
        >
          <MessageCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
          <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5 line-clamp-1 leading-tight">
            WhatsApp 10+
          </span>
        </a>

        {/* 3. Sacola com Badge */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-gold-gradient text-black font-extrabold shadow-md shadow-amber-500/20 active:scale-95 transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 fill-black" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-black text-amber-300 font-mono text-[9px] font-black px-1 rounded-full border border-amber-400">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">
            Sacola
          </span>
        </button>
      </div>
    </div>
  );
};
