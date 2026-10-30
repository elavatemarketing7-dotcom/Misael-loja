import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleClick = () => {
    const text = encodeURIComponent(
      'Olá MN Store! Gostaria de tirar dúvidas sobre as camisas de time na promoção (De R$ 180 por R$ 120).'
    );
    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {showTooltip && (
        <div className="mb-2 mr-1 p-3 rounded-2xl bg-[#14161f] border border-amber-500/40 text-xs text-white shadow-2xl max-w-xs animate-in fade-in duration-200 flex items-start gap-2">
          <div>
            <span className="font-bold text-amber-400 block font-display uppercase tracking-wider">
              Atendimento MN Store
            </span>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Dúvidas sobre tamanhos ou personalização? Chame agora no WhatsApp!
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-500 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all relative group"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-black animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-black" />
      </button>
    </div>
  );
};
