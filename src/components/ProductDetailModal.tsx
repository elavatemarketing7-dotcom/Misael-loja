import React, { useState } from 'react';
import { 
  X, 
  Ruler, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Eye, 
  Sparkles, 
  Camera, 
  Heart, 
  Share2, 
  Check, 
  ShoppingBag,
  Zap,
  CreditCard,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { JerseySize, JerseyVersion, CustomizationOption } from '../types';
import { calculateInstallments } from '../utils/installments';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    addToCart,
    setIsSizeGuideOpen,
    openProductEditor,
    wishlist,
    toggleWishlist,
    setIsCartOpen,
    setIsCheckoutOpen
  } = useShop();

  const product = selectedProductDetail;

  const [selectedSize, setSelectedSize] = useState<JerseySize>('M');
  const [selectedVersion, setSelectedVersion] = useState<JerseyVersion>('torcedor');
  const [customizationEnabled, setCustomizationEnabled] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const [patch, setPatch] = useState<CustomizationOption['patch']>('nenhum');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInstallmentsTable, setShowInstallmentsTable] = useState(false);

  if (!product) return null;

  const isFavorited = wishlist.includes(product.id);

  const handleAddToCart = (openCheckout = false) => {
    const custom: CustomizationOption = {
      enabled: customizationEnabled,
      name: customizationEnabled ? customName.toUpperCase().trim() : '',
      number: customizationEnabled ? customNumber.trim() : '',
      patch
    };

    addToCart(product, selectedSize, selectedVersion, custom, quantity);
    setSelectedProductDetail(null);

    if (openCheckout) {
      setIsCheckoutOpen(true);
    } else {
      setIsCartOpen(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#121318] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-[#161820]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              {product.league}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">{product.season}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openProductEditor(product)}
              className="text-xs text-amber-400 hover:text-amber-300 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
              title="Trocar a foto deste manto"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trocar Foto</span>
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title="Copiar link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${
                isFavorited ? 'text-rose-500' : 'text-slate-400 hover:text-white'
              }`}
              title="Favoritar"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedProductDetail(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
          {/* Left Column: Image & Back Customization Preview */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-[#181a22] border border-white/10 flex items-center justify-center group shadow-xl">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, #181a22 0%, ${product.fallbackColor}25 100%)`
                  }}
                >
                  <div 
                    className="w-20 h-20 rounded-full border-2 border-amber-400/40 flex items-center justify-center mb-3 shadow-lg"
                    style={{ backgroundColor: `${product.fallbackColor}40` }}
                  >
                    <span className="font-display font-black text-2xl text-amber-300">
                      {product.team.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base">{product.team}</h4>
                  <p className="text-xs text-amber-400/80 mt-1">Manto Oficial {product.season}</p>
                  <button
                    onClick={() => openProductEditor(product)}
                    className="mt-4 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Adicionar Foto do Manto
                  </button>
                </div>
              )}

              {/* Scarcity Tag Overlay */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.originalPrice > product.promoPrice && (
                  <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-md">
                    {Math.round(((product.originalPrice - product.promoPrice) / product.originalPrice) * 100)}% OFF · LIQUIDAÇÃO
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-amber-400 font-semibold text-[11px] border border-amber-500/30">
                  DE R$ {product.originalPrice} POR R$ {product.promoPrice}
                </span>
              </div>
            </div>

            {/* Customization live simulation (Back of jersey) */}
            {customizationEnabled && (
              <div className="p-3.5 rounded-xl bg-[#161822] border border-amber-500/30 text-center space-y-2">
                <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider block">
                  Prévia da Personalização (Costas):
                </span>
                <div className="h-28 rounded-lg bg-[#0e0f14] border border-white/10 flex flex-col items-center justify-center p-2 relative overflow-hidden">
                  <span className="font-display font-black text-lg text-white tracking-widest uppercase">
                    {customName || 'SEU NOME'}
                  </span>
                  <span className="font-display font-black text-5xl text-amber-400 leading-none mt-1">
                    {customNumber || '10'}
                  </span>
                  {patch !== 'nenhum' && (
                    <span className="absolute bottom-1 right-2 text-[9px] uppercase tracking-wider text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                      Patch: {patch}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Live Viewers & Scarcity urgency */}
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>14 torcedores estão olhando este manto agora</span>
              </div>
              <div className="flex items-center gap-2 text-rose-400 font-medium">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>Restam apenas {product.stockCount} unidades no lote promocional!</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Sizes, Version, Customization & Buy CTA */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-wide uppercase">
                {product.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Box with De / Por & Installments */}
            <div className="p-4 rounded-xl bg-[#161822] border border-white/10 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-sm text-slate-400 line-through">
                  De R$ {product.originalPrice},00
                </span>
                <span className="text-3xl font-black text-white font-display tracking-wide text-gold-gradient">
                  R$ {product.promoPrice},00
                </span>
                {product.originalPrice > product.promoPrice && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                    Economize R$ {(product.originalPrice - product.promoPrice)},00
                  </span>
                )}
              </div>

              <div className="space-y-1.5 pt-1 border-t border-white/5 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>
                    Pagamento via PIX (R$ {product.promoPrice},00) com aprovação imediata
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      ou em até <strong className="text-white">5x de R$ {(product.promoPrice / 5).toFixed(2)} sem juros</strong>
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowInstallmentsTable(!showInstallmentsTable)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showInstallmentsTable ? 'Ocultar parcelas' : 'Ver parcelas'}</span>
                    {showInstallmentsTable ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Installments Table Breakdown */}
              {showInstallmentsTable && (
                <div className="pt-2 border-t border-white/10 animate-in fade-in duration-150 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase">
                    <span>Opções no Cartão</span>
                    <span className="text-amber-400">Até 5x sem juros</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {calculateInstallments(product.promoPrice).map((inst) => (
                      <div
                        key={inst.number}
                        className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between text-[11px] ${
                          !inst.hasInterest
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                            : 'bg-white/[0.02] border-white/5 text-slate-300'
                        }`}
                      >
                        <span className="font-mono font-bold">
                          {inst.number}x de R$ {inst.installmentValue.toFixed(2)}
                        </span>
                        {!inst.hasInterest ? (
                          <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                            Sem Juros
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase font-medium text-slate-400">
                            com juros maquininha
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    * A partir de 5x incidem os juros da maquininha de cartão.
                  </p>
                </div>
              )}
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Tamanho: <span className="text-amber-400 font-mono">{selectedSize}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold underline underline-offset-2 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Tabela de Medidas
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {(['P', 'M', 'G', 'GG', 'XGG'] as JerseySize[]).map((size) => {
                  const available = product.availableSizes.includes(size);
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!available}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 rounded-xl font-display font-bold text-sm transition-all border ${
                        isSelected
                          ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 scale-102'
                          : available
                          ? 'bg-[#181a24] text-white border-white/10 hover:border-amber-400/50'
                          : 'bg-white/5 text-slate-600 border-transparent cursor-not-allowed line-through'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Version Selector (Torcedor vs Jogador) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Modelo da Camisa:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedVersion('torcedor')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedVersion === 'torcedor'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-[#181a24] border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-xs uppercase text-white font-display">
                    Versão Torcedor
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Modelagem regular confortável para o dia a dia
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedVersion('jogador')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedVersion === 'jogador'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-[#181a24] border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-xs uppercase text-white font-display flex items-center justify-between">
                    <span>Versão Jogador</span>
                    <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-bold">
                      SLIM FIT
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Tecnologia idêntica à usada pelos atletas em campo
                  </div>
                </button>
              </div>
            </div>

            {/* Customization Toggle & Fields */}
            <div className="p-4 rounded-xl bg-[#161822] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Personalização Oficial (Nome & Número)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Insira seu nome e número com a tipografia oficial do manto
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="custom-toggle"
                  checked={customizationEnabled}
                  onChange={(e) => setCustomizationEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
              </div>

              {customizationEnabled && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Nome nas Costas:
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      placeholder="Ex: VINICIUS JR"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#1a1c26] border border-white/15 text-white text-xs font-mono uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Número (1 a 99):
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="Ex: 7"
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#1a1c26] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Patches */}
              <div className="pt-2 border-t border-white/10">
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  Patch da Manga Oficial:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'nenhum', label: 'Sem Patch' },
                    { id: 'champions', label: 'Champions League' },
                    { id: 'libertadores', label: 'Libertadores' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPatch(p.id as CustomizationOption['patch'])}
                      className={`px-2 py-1.5 rounded-lg text-center text-[11px] transition-colors ${
                        patch === p.id
                          ? 'bg-amber-500 text-black font-bold'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-white/15 rounded-xl bg-[#161820] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-2.5 font-mono text-sm text-white font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    className="px-3.5 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Adicionar à Sacola
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleAddToCart(true)}
                className="w-full py-3.5 px-6 rounded-xl bg-gold-gradient text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all"
              >
                <Zap className="w-4 h-4 fill-black" />
                Comprar Agora com Desconto (R$ {product.promoPrice},00)
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Frete Grátis acima de 2 camisas</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>7 dias de garantia ou troca grátis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
