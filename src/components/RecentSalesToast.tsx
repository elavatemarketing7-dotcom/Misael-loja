import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

const RECENT_SALES = [
  { name: 'Lucas M.', city: 'São Paulo - SP', item: 'Camisa Real Madrid I 24/25', time: 'há 3 minutos' },
  { name: 'Guilherme S.', city: 'Rio de Janeiro - RJ', item: 'Camisa Flamengo Rubro-Negra 24/25', time: 'há 6 minutos' },
  { name: 'Rodrigo B.', city: 'Belo Horizonte - MG', item: 'Camisa Seleção Brasileira 2024', time: 'há 8 minutos' },
  { name: 'Felipe A.', city: 'Curitiba - PR', item: 'Camisa Barcelona I 24/25 Blaugrana', time: 'há 11 minutos' },
  { name: 'Bruno P.', city: 'Porto Alegre - RS', item: 'Camisa Palmeiras I 24/25', time: 'há 14 minutos' },
  { name: 'Thiago N.', city: 'Salvador - BA', item: 'Camisa Corinthians I 24/25', time: 'há 17 minutos' }
];

export const RecentSalesToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show toast periodically
    const showInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RECENT_SALES.length);
      setVisible(true);

      const hideTimeout = setTimeout(() => {
        setVisible(false);
      }, 5500);

      return () => clearTimeout(hideTimeout);
    }, 18000);

    // Initial trigger after 4s
    const firstTimer = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 5500);
    }, 4000);

    return () => {
      clearInterval(showInterval);
      clearTimeout(firstTimer);
    };
  }, []);

  if (!visible) return null;

  const current = RECENT_SALES[currentIndex];

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="p-3 rounded-2xl bg-[#121319]/95 border border-amber-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <span className="font-bold text-white">{current.name}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{current.city}</span>
          </div>
          <p className="text-xs font-semibold text-amber-400 truncate">
            Comprou {current.item}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="font-mono text-emerald-400 font-bold">R$ 130,00</span>
            <span>·</span>
            <span>{current.time}</span>
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-slate-500 hover:text-white p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
