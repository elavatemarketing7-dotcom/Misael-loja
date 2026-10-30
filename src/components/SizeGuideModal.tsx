import React from 'react';
import { X, ShieldCheck, Ruler } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#121318] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161820]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-display">
                Tabela Oficial de Medidas dos Mantos
              </h3>
              <p className="text-xs text-slate-400">Padrão Brasileiro Oficial (Modelagem Regular & Torcedor)</p>
            </div>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a1c24] text-xs uppercase tracking-wider text-amber-400 font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Tamanho</th>
                  <th className="py-3 px-4">Largura (Peito)</th>
                  <th className="py-3 px-4">Comprimento (Altura)</th>
                  <th className="py-3 px-4">Peso Indicado</th>
                  <th className="py-3 px-4">Altura Indicada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono tabular-nums text-slate-200">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-amber-400">P</td>
                  <td className="py-3 px-4">49 - 51 cm</td>
                  <td className="py-3 px-4">69 - 71 cm</td>
                  <td className="py-3 px-4">50 - 62 kg</td>
                  <td className="py-3 px-4">1,55 - 1,70 m</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors bg-white/[0.02]">
                  <td className="py-3 px-4 font-bold text-amber-400">M</td>
                  <td className="py-3 px-4">51 - 53 cm</td>
                  <td className="py-3 px-4">71 - 73 cm</td>
                  <td className="py-3 px-4">63 - 75 kg</td>
                  <td className="py-3 px-4">1,70 - 1,78 m</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-amber-400">G</td>
                  <td className="py-3 px-4">54 - 56 cm</td>
                  <td className="py-3 px-4">73 - 76 cm</td>
                  <td className="py-3 px-4">76 - 88 kg</td>
                  <td className="py-3 px-4">1,76 - 1,85 m</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors bg-white/[0.02]">
                  <td className="py-3 px-4 font-bold text-amber-400">GG</td>
                  <td className="py-3 px-4">57 - 59 cm</td>
                  <td className="py-3 px-4">77 - 79 cm</td>
                  <td className="py-3 px-4">88 - 98 kg</td>
                  <td className="py-3 px-4">1,82 - 1,92 m</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-amber-400">XGG</td>
                  <td className="py-3 px-4">60 - 63 cm</td>
                  <td className="py-3 px-4">80 - 83 cm</td>
                  <td className="py-3 px-4">98 - 115 kg</td>
                  <td className="py-3 px-4">1,85 - 1,98 m</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Dicas de medição */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-1.5 text-sm">
                <span className="text-amber-400">1.</span> Como Medir seu Manto
              </h4>
              <p className="leading-relaxed text-slate-400">
                Pegue uma camisa de futebol que você já tem e que vista bem. Meça a largura de axila a axila e o comprimento do ombro até a barra inferior.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-1.5 text-sm">
                <span className="text-amber-400">2.</span> Versão Torcedor vs Jogador
              </h4>
              <p className="leading-relaxed text-slate-400">
                A versão <strong>Torcedor</strong> tem modelagem padrão confortável. A versão <strong>Jogador</strong> é justa ao corpo (slim fit); se preferir mais folgada na versão jogador, escolha um tamanho maior.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <ShieldCheck className="w-5 h-5 shrink-0 text-amber-400" />
            <span>
              <strong>Garantia MN Store:</strong> Se o tamanho não servir perfeitamente, você tem até 7 dias corridos após o recebimento para solicitar a primeira troca de tamanho gratuitamente.
            </span>
          </div>

          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider text-sm transition-colors"
          >
            Entendi, Voltar para a Escolha do Manto
          </button>
        </div>
      </div>
    </div>
  );
};
