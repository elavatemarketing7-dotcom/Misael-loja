import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  MessageCircle, 
  Zap, 
  MapPin, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getWhatsAppUrl, buildCartWhatsAppMessage } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartItemCount,
    freeShippingQualified,
    freeShippingRemaining,
    calculatedCep,
    shippingOptions,
    selectedShippingOption,
    setSelectedShippingOption,
    shippingDestination,
    shippingAddress,
    originAgency,
    isCalculatingShipping,
    calculateShipping
  } = useShop();

  const [cepInput, setCepInput] = useState(calculatedCep || '');

  if (!isCartOpen) return null;

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/\D/g, '');
    if (clean.length > 8) clean = clean.slice(0, 8);
    if (clean.length > 5) {
      clean = `${clean.slice(0, 5)}-${clean.slice(5)}`;
    }
    setCepInput(clean);
  };

  const handleCalcShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cepInput.trim()) {
      calculateShipping(cepInput);
    }
  };

  const handleWhatsAppCheckout = () => {
    const message = buildCartWhatsAppMessage(cart, cartTotal, selectedShippingOption, calculatedCep);
    window.open(getWhatsAppUrl(message), '_blank');
  };

  const originalTotal = cart.reduce((acc, item) => acc + item.product.originalPrice * item.quantity, 0);
  const promoSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const totalEconomy = originalTotal - promoSubtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:w-auto">
        <div className="w-full sm:w-screen sm:max-w-md bg-[#111216] border-l border-amber-500/30 flex flex-col shadow-2xl h-[100dvh] max-h-[100dvh] overflow-hidden">
          
          {/* 1. Header (Pinned Top) */}
          <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#151720]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wider">
                Sua Sacola de Mantos ({cartItemCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Fechar sacola"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Wholesale Notice (Pinned Top) */}
          <div className="shrink-0 px-4 py-2 bg-emerald-950/40 border-b border-emerald-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-emerald-300">
                Acima de 10 peças chamar no WhatsApp
              </span>
            </div>
            <a
              href={getWhatsAppUrl("Olá MN Store! Gostaria de fazer um pedido acima de 10 peças no atacado.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider transition-colors shrink-0 shadow-sm"
            >
              Chamar
            </a>
          </div>

          {/* 3. Free Shipping Urgency Bar (Pinned Top) */}
          <div className="shrink-0 p-3 sm:p-3.5 bg-[#181a24] border-b border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-[11px] sm:text-xs">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                {freeShippingQualified ? (
                  <span className="text-emerald-400 font-bold">
                    Parabéns! Você ganhou FRETE GRÁTIS!
                  </span>
                ) : (
                  <span>
                    Falta <strong className="text-amber-400">{freeShippingRemaining} camisa</strong> para <strong>FRETE GRÁTIS</strong>
                  </span>
                )}
              </span>
              <span className="text-slate-400 font-mono text-[10px] sm:text-[11px]">
                {cartItemCount}/2 mantos
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  freeShippingQualified ? 'bg-emerald-500' : 'bg-gold-gradient'
                }`}
                style={{ width: `${Math.min(100, (cartItemCount / 2) * 100)}%` }}
              />
            </div>
          </div>

          {/* 4. Scrollable Content Area: Items + Shipping Calculator */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4 overscroll-contain">
            
            {/* Empty State */}
            {cart.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-base font-display uppercase tracking-wider">
                  Sua sacola está vazia
                </h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Aproveite nossa queima de estoque: todos os mantos oficiais de R$ 180 por apenas R$ 130!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-colors mt-2 cursor-pointer"
                >
                  Ver Mantos Disponíveis
                </button>
              </div>
            ) : (
              <>
                {/* Product List */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Mantos Escolhidos ({cartItemCount})</span>
                    <span className="text-[10px] text-amber-400 font-mono">De R$ 180 por R$ 130</span>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#161822] border border-white/10 flex gap-3 relative group hover:border-amber-500/30 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden bg-[#1e202c] shrink-0 border border-white/10 relative">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-xs font-bold text-white font-display"
                            style={{ backgroundColor: `${item.product.fallbackColor}80` }}
                          >
                            {item.product.team.substring(0, 3)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h5 className="font-bold text-xs text-white truncate font-display uppercase">
                          {item.product.name}
                        </h5>

                        <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span>Tam: <strong className="text-amber-400 font-mono">{item.size}</strong></span>
                          <span>·</span>
                          <span className="capitalize">{item.version}</span>
                        </div>

                        {item.customization.enabled && (
                          <div className="text-[9px] sm:text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded inline-block truncate max-w-full">
                            Personalizado: {item.customization.name || 'SEM NOME'} #{item.customization.number || '0'}
                          </div>
                        )}

                        {/* Price and Counter */}
                        <div className="flex items-center justify-between pt-0.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[10px] text-slate-500 line-through">
                              R$ 180,00
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-white font-mono">
                              R$ {item.unitPrice * item.quantity},00
                            </span>
                          </div>

                          <div className="flex items-center border border-white/15 rounded-lg bg-[#111216] overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-2 py-0.5 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-mono text-white font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-2 py-0.5 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1 self-start cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Shipping Calculation Box - Perfectly framed and readable */}
                <div className="rounded-2xl bg-[#161824] border border-amber-500/30 p-3.5 sm:p-4 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs uppercase tracking-wider text-white flex items-center gap-1.5 font-display">
                      <Truck className="w-4 h-4 text-amber-400" />
                      Cálculo de Frete dos Correios
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9px] font-bold uppercase tracking-wider">
                      PAC & SEDEX
                    </span>
                  </div>

                  {/* Origin Agency Information */}
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{originAgency.agencyName}</span>
                    </div>
                    <p className="text-slate-300 text-[10px] leading-tight">
                      {originAgency.fullAddress}
                    </p>
                  </div>

                  {/* Destination Info if available */}
                  {shippingDestination && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-emerald-300 uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          Destino Localizado:
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">
                          CEP {calculatedCep.slice(0, 5)}-{calculatedCep.slice(5)}
                        </span>
                      </div>
                      <p className="text-white text-xs font-semibold">
                        {shippingAddress?.logradouro ? `${shippingAddress.logradouro}, ` : ''}{shippingDestination}
                      </p>
                    </div>
                  )}

                  {/* CEP Form */}
                  <form onSubmit={handleCalcShipping} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={9}
                        placeholder="Digite seu CEP (00000-000)"
                        value={cepInput}
                        onChange={handleCepChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#0f1015] border border-white/15 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isCalculatingShipping}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                    >
                      {isCalculatingShipping ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Calculando</span>
                        </>
                      ) : (
                        'Calcular'
                      )}
                    </button>
                  </form>

                  {/* Correios Options Cards */}
                  {shippingOptions.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-white/10 animate-in fade-in duration-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Selecione a Modalidade dos Correios:
                      </span>

                      <div className="grid grid-cols-1 gap-2">
                        {shippingOptions.map((opt) => {
                          const isSelected = selectedShippingOption?.id === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedShippingOption(opt)}
                              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-500/15 border-amber-400 text-white shadow-md shadow-amber-500/10'
                                  : 'bg-[#10121a] border-white/10 text-slate-300 hover:border-white/30'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-500'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                </div>

                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-xs uppercase font-display text-white">
                                      {opt.id === 'sedex' ? 'SEDEX dos Correios' : 'PAC dos Correios'}
                                    </span>
                                    {opt.id === 'sedex' ? (
                                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold uppercase flex items-center gap-0.5">
                                        <Zap className="w-2.5 h-2.5" /> Expresso
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold uppercase">
                                        Econômico
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">
                                    Prazo estimado: <strong className="text-slate-200">{opt.deadline}</strong>
                                  </span>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                {opt.price === 0 ? (
                                  <div>
                                    {opt.originalPrice && (
                                      <span className="text-[9px] text-slate-500 line-through block font-mono">
                                        R$ {opt.originalPrice.toFixed(2)}
                                      </span>
                                    )}
                                    <span className="text-xs font-black text-emerald-400 uppercase font-mono">
                                      GRÁTIS
                                    </span>
                                  </div>
                                ) : (
                                  <div>
                                    {opt.originalPrice && opt.originalPrice > opt.price && (
                                      <span className="text-[9px] text-slate-500 line-through block font-mono">
                                        R$ {opt.originalPrice.toFixed(2)}
                                      </span>
                                    )}
                                    <span className="text-xs font-bold text-white font-mono">
                                      R$ {opt.price.toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </>
            )}

          </div>

          {/* 5. Sticky Bottom Summary & WhatsApp Order CTA (Pinned Bottom) */}
          {cart.length > 0 && (
            <div className="shrink-0 p-3.5 sm:p-4 border-t border-white/10 bg-[#141620] space-y-2.5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-2xl">
              
              {/* Compact Price Breakdown */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Subtotal ({cartItemCount} mantos):</span>
                  <span className="font-mono text-slate-300">R$ {promoSubtotal.toFixed(2)}</span>
                </div>

                {totalEconomy > 0 && (
                  <div className="flex justify-between text-emerald-400 text-[11px] font-semibold">
                    <span>Economia da Promoção:</span>
                    <span className="font-mono">- R$ {totalEconomy.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[11px] items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Truck className="w-3 h-3 text-amber-400" />
                    Frete {selectedShippingOption ? `(${selectedShippingOption.service})` : 'Correios'}:
                  </span>
                  <span className="font-mono font-bold">
                    {selectedShippingOption ? (
                      selectedShippingOption.price === 0 ? (
                        <span className="text-emerald-400 uppercase">GRÁTIS</span>
                      ) : (
                        <span className="text-white">R$ {selectedShippingOption.price.toFixed(2)}</span>
                      )
                    ) : freeShippingQualified ? (
                      <span className="text-emerald-400 uppercase">GRÁTIS</span>
                    ) : (
                      <span className="text-amber-400/90 text-[10px]">A calcular via CEP acima</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-1.5 border-t border-white/10 text-white font-bold">
                  <div>
                    <span className="text-sm font-display uppercase tracking-wider block">Total do Pedido</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      em até <strong className="text-amber-400">5x de R$ {(cartTotal / 5).toFixed(2)} s/ juros</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xl sm:text-2xl text-gold-gradient font-black block">
                      R$ {cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Encomenda Exclusiva pelo WhatsApp CTA */}
              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-700 shrink-0" />
                <span>Encomendar pelo WhatsApp</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Garantia de Entrega MN Store · Rastreamento Correios</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
