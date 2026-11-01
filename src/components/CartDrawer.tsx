import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Check, 
  MessageCircle,
  Sparkles,
  Zap,
  MapPin,
  Loader2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

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
    shippingCost,
    calculatedCep,
    shippingOptions,
    selectedShippingOption,
    setSelectedShippingOption,
    shippingDestination,
    isCalculatingShipping,
    calculateShipping,
    setIsCheckoutOpen
  } = useShop();

  const [cepInput, setCepInput] = useState(calculatedCep || '');

  if (!isCartOpen) return null;

  const handleCalcShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cepInput.trim()) {
      calculateShipping(cepInput);
    }
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    const itemsText = cart
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product.name} (Tam: ${item.size}, Mod: ${item.version}) ${
            item.customization.enabled
              ? `[Personalizado: ${item.customization.name || 'SEM NOME'} #${item.customization.number || '0'}]`
              : ''
          } - R$ ${item.unitPrice * item.quantity},00`
      )
      .join('\n');

    const shippingLine = selectedShippingOption
      ? `*Frete Correios:* ${selectedShippingOption.service} (${selectedShippingOption.deadline}) - ${
          selectedShippingOption.price === 0 ? 'GRÁTIS' : `R$ ${selectedShippingOption.price.toFixed(2)}`
        }`
      : `*Frete:* A calcular via Correios`;

    const message = encodeURIComponent(
      `🦁 *NOVO PEDIDO - MN STORE*\n\n` +
      `Olá MN Store! Gostaria de fechar meu pedido das camisas de time na promoção (De R$ 180 por R$ 130):\n\n` +
      `${itemsText}\n\n` +
      `${shippingLine}\n` +
      `*Total a pagar:* R$ ${cartTotal.toFixed(2)}\n` +
      `*Forma de pagamento:* PIX / Cartão\n\n` +
      `Por favor, confirmem a disponibilidade dos meus mantos e o envio do código de rastreamento!`
    );

    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  const originalTotal = cart.reduce((acc, item) => acc + item.product.originalPrice * item.quantity, 0);
  const promoSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const totalEconomy = originalTotal - promoSubtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:w-auto">
        <div className="w-full sm:w-screen sm:max-w-md bg-[#111216] border-l border-amber-500/30 flex flex-col shadow-2xl h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#151720]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wider">
                Sua Sacola de Mantos ({cartItemCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wholesale 10+ peças notice no começo da sacola */}
          <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-emerald-300">
                Acima de 10 peças chamar no WhatsApp
              </span>
            </div>
            <a
              href="https://wa.me/5511999999999?text=Ol%C3%A1%20MN%20Store!%20Gostaria%20de%20fazer%20um%20pedido%20acima%20de%2010%20pe%C3%A7as%20no%20atacado."
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider transition-colors shrink-0 shadow-sm"
            >
              Chamar
            </a>
          </div>

          {/* Free Shipping Urgency Bar */}
          <div className="p-4 bg-[#181a24] border-b border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400" />
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
              <span className="text-slate-400 font-mono text-[11px]">
                {cartItemCount}/2 mantos
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  freeShippingQualified ? 'bg-emerald-500' : 'bg-gold-gradient'
                }`}
                style={{ width: `${Math.min(100, (cartItemCount / 2) * 100)}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-base font-display uppercase tracking-wider">
                  Sua sacola está vazia
                </h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Aproveite nossa queima de estoque: todos os mantos oficiais de R$ 180 por apenas R$ 130!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-colors mt-2"
                >
                  Ver Mantos Disponíveis
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#161822] border border-white/10 flex gap-3.5 relative group hover:border-amber-500/30 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#1e202c] shrink-0 border border-white/10 relative">
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

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>Tam: <strong className="text-amber-400 font-mono">{item.size}</strong></span>
                      <span>·</span>
                      <span className="capitalize">{item.version}</span>
                    </div>

                    {item.customization.enabled && (
                      <div className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded inline-block">
                        {item.customization.name || 'SEM NOME'} #{item.customization.number || '0'}
                      </div>
                    )}

                    {/* Price and Counter */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] text-slate-500 line-through">
                          R$ 180,00
                        </span>
                        <span className="text-sm font-bold text-white font-mono">
                          R$ {item.unitPrice * item.quantity},00
                        </span>
                      </div>

                      <div className="flex items-center border border-white/15 rounded-lg bg-[#111216]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-slate-400 hover:text-white text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-slate-400 hover:text-white text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1 self-start"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-white/10 bg-[#151720] space-y-3">
              {/* CEP Correios Shipping Calculator */}
              <div className="space-y-2.5 p-3 rounded-xl bg-[#181a24] border border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                    <Truck className="w-4 h-4 text-amber-400" />
                    Frete Correios (PAC e SEDEX)
                  </span>
                  {shippingDestination && (
                    <span className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold truncate max-w-[160px]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {shippingDestination}
                    </span>
                  )}
                </div>

                {/* Origin Agency Information */}
                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] space-y-0.5">
                  <div className="flex items-center gap-1 text-amber-400 font-semibold text-[10px] uppercase tracking-wider">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Origem do Envio: Agência Correios São Vicente</span>
                  </div>
                  <p className="text-slate-300 text-[10px] leading-tight">
                    Av. Capitão Luiz Hourneaux, 748 - Jardim Paraíso, São Vicente - SP (CEP 11370-971)
                  </p>
                </div>

                <form onSubmit={handleCalcShipping} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="Seu CEP (00000-000)"
                    value={cepInput}
                    onChange={(e) => setCepInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#111216] border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={isCalculatingShipping}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    {isCalculatingShipping ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Calculando...</span>
                      </>
                    ) : (
                      'Calcular'
                    )}
                  </button>
                </form>

                {/* Correios Options List */}
                {shippingOptions.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="uppercase font-bold tracking-wider">
                        Modalidades dos Correios:
                      </span>
                      {shippingDestination && (
                        <span className="text-emerald-400 font-medium">
                          Destino: {shippingDestination}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {shippingOptions.map((opt) => {
                        const isSelected = selectedShippingOption?.id === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedShippingOption(opt)}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                                : 'bg-[#12131a] border-white/10 text-slate-300 hover:border-white/30'
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
                                  Prazo: {opt.deadline} (Saída: São Vicente/SP)
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              {opt.price === 0 ? (
                                <div>
                                  {opt.originalPrice && (
                                    <span className="text-[10px] text-slate-500 line-through block">
                                      R$ {opt.originalPrice.toFixed(2)}
                                    </span>
                                  )}
                                  <span className="text-xs font-bold text-emerald-400 uppercase font-mono">
                                    GRÁTIS
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  {opt.originalPrice && opt.originalPrice > opt.price && (
                                    <span className="text-[10px] text-slate-500 line-through block">
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

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({cartItemCount} mantos)</span>
                  <span className="font-mono">R$ {promoSubtotal.toFixed(2)}</span>
                </div>

                {totalEconomy > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Economia da Promoção</span>
                    <span className="font-mono">- R$ {totalEconomy.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>
                    Frete {selectedShippingOption ? `(${selectedShippingOption.service})` : 'Correios'}
                  </span>
                  <span className="font-mono">
                    {selectedShippingOption ? (
                      selectedShippingOption.price === 0 ? (
                        <span className="text-emerald-400 font-bold uppercase">GRÁTIS</span>
                      ) : (
                        `R$ ${selectedShippingOption.price.toFixed(2)}`
                      )
                    ) : freeShippingQualified ? (
                      <span className="text-emerald-400 font-bold uppercase">GRÁTIS</span>
                    ) : (
                      <span className="text-slate-500 italic">Calcule pelo CEP</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
                  <span>Total</span>
                  <div className="text-right">
                    <span className="font-mono text-xl text-gold-gradient block">
                      R$ {cartTotal.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-amber-400 font-semibold block">
                      PIX com aprovação imediata
                    </span>
                    <span className="text-[10px] text-slate-300 block">
                      ou em até <strong className="text-amber-400">5x de R$ {(cartTotal / 5).toFixed(2)} sem juros</strong>
                    </span>
                    <span className="text-[9px] text-slate-500 block">
                      (a partir de 5x com juros da maquininha)
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleGoToCheckout}
                  className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all"
                >
                  Finalizar Compra Segura
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  Fechar Pedido pelo WhatsApp
                </button>
              </div>

              {/* Security Seal */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Compra 100% Segura · Garantia de Entrega MN Store</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
