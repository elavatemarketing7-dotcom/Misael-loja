import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  ArrowDown, 
  CheckCircle2,
  Zap,
  CreditCard,
  MessageCircle
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  // Scarcity countdown timer (simulating remaining offer time)
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo-de-mantos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#10121a] via-[#0d0e14] to-[#0b0c0e] border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
          
          {/* Left / Center Branding: QUALIDADE TAILANDESA 1:1 */}
          <div className="flex items-center gap-3 sm:gap-6 text-left w-full lg:w-auto">
            {/* Logo Leão Encoroado MN Store */}
            <div className="relative shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-amber-500/40 p-0.5 bg-black/70 shadow-2xl shadow-amber-500/20">
              <img
                src="/assets/aistudio/Emblema_Dourado_MN_Store_com_Leao_Encoroado_2ec60587.png"
                alt="MN Store - Leão Encoroado"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-amber-400/30 rounded-xl sm:rounded-2xl pointer-events-none" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>Padrão Oficial</span>
                </div>

                <a
                  href="https://wa.me/5511999999999?text=Ol%C3%A1%20MN%20Store!%20Gostaria%20de%20fazer%20um%20pedido%20acima%20de%2010%20pe%C3%A7as%20no%20atacado."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 hover:text-emerald-200 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-400 fill-emerald-400/30" />
                  <span>Atacado 10+ WhatsApp</span>
                </a>
              </div>

              {/* Main title as requested by user */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-display leading-tight">
                QUALIDADE <span className="text-gold-gradient">TAILANDESA 1:1</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
                Mantos de futebol com acabamento impecável, tecido dry-fit tecnológico e personalização oficial.
              </p>
            </div>
          </div>

          {/* Right Scarcity Card: DE R$ 180 POR R$ 130 + Timer */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#151722]/90 border border-amber-500/40 shadow-xl backdrop-blur-md flex items-center justify-between sm:justify-start gap-3 sm:gap-6">
              <div>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                  Mega Liquidação:
                </span>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-xs text-slate-400 line-through font-mono">
                    R$ 180
                  </span>
                  <span className="text-xl sm:text-3xl font-black text-white font-display tracking-tight text-gold-gradient">
                    R$ 130,00
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
                    -28% OFF
                  </span>
                </div>
                <div className="space-y-0.5 mt-0.5 text-[10px] sm:text-xs">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-amber-400" />
                    PIX ou Cartão até 5x sem juros
                  </span>
                </div>
              </div>

              {/* Timer */}
              <div className="border-l border-white/10 pl-3 sm:pl-4 text-right shrink-0">
                <span className="text-[9px] sm:text-[10px] text-amber-400 uppercase tracking-widest font-bold block mb-1 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  Termina em:
                </span>
                <div className="flex items-center gap-0.5 sm:gap-1 font-mono font-bold text-[11px] sm:text-xs">
                  <span className="px-1.5 py-0.5 sm:py-1 rounded bg-black/60 border border-white/10 text-white">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </span>
                  <span className="text-amber-400">:</span>
                  <span className="px-1.5 py-0.5 sm:py-1 rounded bg-black/60 border border-white/10 text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </span>
                  <span className="text-amber-400">:</span>
                  <span className="px-1.5 py-0.5 sm:py-1 rounded bg-black/60 border border-white/10 text-amber-400">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>
            </div>

            {/* Direct button to explore catalog */}
            <button
              type="button"
              onClick={scrollToCatalog}
              className="py-3 sm:py-3.5 px-4 sm:px-5 rounded-xl bg-gold-gradient text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all shrink-0 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Ver Catálogo de Mantos</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Quick Micro-Badges Bar right above catalog */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Preço promocional único em todos os mantos</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1 text-slate-300">
              <CreditCard className="w-3 h-3 text-amber-400 shrink-0" />
              Até <strong>5x Sem Juros</strong>
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              Personalização Oficial
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
              Garantia 7 Dias
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
