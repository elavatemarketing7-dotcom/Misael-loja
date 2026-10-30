import React from 'react';
import { 
  Flame, 
  Truck, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Package, 
  Award, 
  Lock, 
  CreditCard, 
  QrCode,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const StoreGuaranteesSection: React.FC = () => {
  const { setIsSizeGuideOpen } = useShop();

  return (
    <section className="bg-[#0e0f14] border-t border-white/10 py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* 1. The 4 Main Benefit Cards */}
        <div>
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Vantagens Exclusivas MN Store
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-display">
              Por que comprar seu manto na <span className="text-gold-gradient">MN Store</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Preço & Escassez */}
            <div className="p-6 rounded-2xl bg-[#14151e] border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 fill-amber-400/20" />
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider mb-2 inline-block">
                Economize R$ 60
              </span>
              <h3 className="text-lg font-bold text-white uppercase font-display">
                De R$ 180 por R$ 120
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Preço promocional direto de lote. O melhor custo-benefício em mantos com qualidade tailandesa 1:1 do Brasil.
              </p>
            </div>

            {/* Card 2: Frete Grátis */}
            <div className="p-6 rounded-2xl bg-[#14151e] border border-white/10 hover:border-amber-500/40 transition-all shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                Todo o Brasil
              </span>
              <h3 className="text-lg font-bold text-white uppercase font-display">
                Frete Grátis no Combo
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Adicione 2 ou mais mantos ao seu carrinho e o frete fica 100% gratuito pelos Correios com código de rastreio.
              </p>
            </div>

            {/* Card 3: Personalização */}
            <div className="p-6 rounded-2xl bg-[#14151e] border border-white/10 hover:border-amber-500/40 transition-all shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                Fontes e Patchs Oficiais
              </span>
              <h3 className="text-lg font-bold text-white uppercase font-display">
                Personalização Oficial
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Coloque seu nome e número favoritos na fonte e tipografia oficial do clube ou seleção.
              </p>
            </div>

            {/* Card 4: Garantia */}
            <div className="p-6 rounded-2xl bg-[#14151e] border border-white/10 hover:border-amber-500/40 transition-all shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                Compra Segura
              </span>
              <h3 className="text-lg font-bold text-white uppercase font-display">
                Garantia de 7 Dias
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Não serviu ou não gostou? Trocamos seu produto ou devolvemos seu dinheiro em até 7 dias após o recebimento.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Detailed "O que é Qualidade Tailandesa 1:1?" Section */}
        <div className="rounded-3xl bg-gradient-to-br from-[#151722] via-[#10121a] to-[#0c0d12] border border-amber-500/30 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-amber-500/50 p-1 bg-black/80 shadow-2xl shadow-amber-500/20 mb-4">
                <img
                  src="/assets/aistudio/Emblema_Dourado_MN_Store_com_Leao_Encoroado_2ec60587.png"
                  alt="MN Store Selo Oficial"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-black text-xl text-white uppercase">
                MN <span className="text-gold-gradient">STORE</span>
              </span>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Padrão Ouro de Qualidade
              </span>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  Autenticidade & Detalhes
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-display">
                  Entenda a <span className="text-gold-gradient">Qualidade Tailandesa 1:1</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  As camisas tailandesas 1:1 são confeccionadas exatamente na mesma malha, modelagem e especificações das peças comercializadas por mais de R$ 400 nas lojas oficiais. Cada mínimo detalhe é preservado:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Bordados & Escudos de Alta Resolução</h4>
                    <p className="text-[11px] text-slate-400">Escudos fiéis com costura precisa ou termotransferência padrão jogador.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Tecido Dry-Fit Tecnológico</h4>
                    <p className="text-[11px] text-slate-400">100% poliéster respirável com microperfurações para evaporação rápida do suor.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Etiquetas, Tags e Selos Oficiais</h4>
                    <p className="text-[11px] text-slate-400">Acompanha todos os selos holográficos de autenticidade e sacola selada da marca.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Fonte & Numeração Exata</h4>
                    <p className="text-[11px] text-slate-400">Tipografia idêntica à usada pelos atletas na temporada 2024/2025.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Ver Tabela de Medidas (P ao 2XL)
                </button>
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Envio em 24 a 48h úteis com rastreamento
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Shipping & Payment Security Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase font-display">Envio com Rastreio</h4>
              <p className="text-xs text-slate-400 mt-0.5">Correios com atualização direta no seu WhatsApp e E-mail.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase font-display">PIX Instantâneo</h4>
              <p className="text-xs text-slate-400 mt-0.5">Aprovação imediata e separação prioritária do seu manto.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase font-display">Até 5x Sem Juros</h4>
              <p className="text-xs text-slate-400 mt-0.5">No cartão em até 5x sem juros (a partir de 5x com juros da maquininha).</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
