import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock, CreditCard, QrCode } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActiveCategory, setIsSizeGuideOpen, openProductEditor } = useShop();

  return (
    <footer className="bg-[#08090b] border-t border-white/10 text-slate-400 text-xs w-full max-w-full overflow-x-hidden">
      {/* 1. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500/40 p-0.5 bg-black/60">
              <img
                src="/assets/aistudio/Emblema_Dourado_MN_Store_com_Leao_Encoroado_2ec60587.png"
                alt="MN Store Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-display font-black text-2xl text-white tracking-wider block">
                MN <span className="text-gold-gradient">STORE</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                Mantos Oficiais de Futebol
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Sua loja exclusiva para mantos e camisas de time de futebol. Nacionais, europeus, seleções e retrô históricas com padrão premium e acabamento de jogo.
          </p>

          <div className="pt-1 flex flex-col gap-2">
            <a
              href="https://wa.me/message/LC7PW3CRA6G5P1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>WhatsApp Oficial MN Store: Encomende seu manto</span>
            </a>
            <button
              onClick={() => openProductEditor()}
              className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 text-left"
            >
              Painel do Lojista: Editar Fotos & Produtos
            </button>
          </div>
        </div>

        {/* Categories Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
            Navegue por Ligas & Categorias
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => setActiveCategory('brasileirao')}
                className="hover:text-amber-400 transition-colors"
              >
                Camisas do Brasileirão Série A
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveCategory('europeus')}
                className="hover:text-amber-400 transition-colors"
              >
                Clubes Europeus & Champions League
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveCategory('selecoes')}
                className="hover:text-amber-400 transition-colors"
              >
                Seleções Mundiais (Brasil, Argentina, etc.)
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveCategory('retro')}
                className="hover:text-amber-400 transition-colors"
              >
                Camisas Retrô & Históricas
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveCategory('especiais')}
                className="hover:text-amber-400 transition-colors"
              >
                Edições Especiais Black & Gold
              </button>
            </li>
          </ul>
        </div>

        {/* Help & Policies */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
            Ajuda & Informações
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="hover:text-amber-400 transition-colors"
              >
                Tabela Oficial de Medidas
              </button>
            </li>
            <li>
              <span className="text-slate-400">Personalização Oficial com Nome e Número</span>
            </li>
            <li>
              <span className="text-slate-400">Prazos de Envio & Rastreamento Correios</span>
            </li>
            <li>
              <span className="text-slate-400">Garantia e Política de Troca (7 Dias)</span>
            </li>
          </ul>
        </div>

        {/* Payment & Security */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
            Pagamento & Segurança
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>PIX Instantâneo com Envio Prioritário</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Cartão em até 5x sem juros (a partir de 5x com juros da maquininha)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Envio Seguro via Correios (Sedex / PAC)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Encomendas Diretas & Seguras pelo WhatsApp Oficial</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-footer with Copyright */}
      <div className="border-t border-white/5 py-6 px-4 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MN Store. Todos os direitos reservados. Especialistas em camisas de time de futebol.</p>
          <p className="text-amber-400/80 font-mono">Oferta Relâmpago: De R$ 180 por R$ 130</p>
        </div>
      </div>
    </footer>
  );
};
