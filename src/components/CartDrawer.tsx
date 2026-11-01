import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Gift,
  AlertTriangle,
  Lock,
  Home
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getWhatsAppUrl, buildCartWhatsAppMessage } from '../utils/whatsapp';
import { ShippingAddressInfo } from '../types';

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
  const [streetNumber, setStreetNumber] = useState('');
  const [streetComplement, setStreetComplement] = useState('');
  const [streetName, setStreetName] = useState('');
  const [bairroName, setBairroName] = useState('');
  const [cityName, setCityName] = useState('');
  const [ufName, setUfName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Sync address fields when ViaCEP returns address information
  useEffect(() => {
    if (shippingAddress) {
      if (shippingAddress.logradouro) setStreetName(shippingAddress.logradouro);
      if (shippingAddress.bairro) setBairroName(shippingAddress.bairro);
      if (shippingAddress.localidade) setCityName(shippingAddress.localidade);
      if (shippingAddress.uf) setUfName(shippingAddress.uf);
    }
  }, [shippingAddress]);

  if (!isCartOpen) return null;

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/\D/g, '');
    if (clean.length > 8) clean = clean.slice(0, 8);
    if (clean.length > 5) {
      clean = `${clean.slice(0, 5)}-${clean.slice(5)}`;
    }
    setCepInput(clean);
    setFormError(null);
  };

  const handleCalcShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cepInput.trim()) {
      setFormError(null);
      calculateShipping(cepInput);
    } else {
      setFormError('Por favor, digite seu CEP para calcular o frete.');
    }
  };

  // Validation checks: house number is strictly mandatory in all cases
  const hasValidHouseNumber = Boolean(streetNumber.trim());
  const hasValidCep = Boolean(calculatedCep || (cepInput.replace(/\D/g, '').length === 8));
  const hasCalculatedShipping = Boolean(calculatedCep && selectedShippingOption);

  // Ready ONLY when house number is filled AND shipping/CEP conditions are met
  const isShippingReady = freeShippingQualified
    ? (hasValidCep && hasValidHouseNumber)
    : (hasCalculatedShipping && hasValidHouseNumber);

  let lockedButtonText = 'Calcule o Frete para Encomendar';
  if (freeShippingQualified) {
    if (!hasValidCep) {
      lockedButtonText = 'Digite seu CEP para Entrega';
    } else if (!hasValidHouseNumber) {
      lockedButtonText = 'Digite o Nº da Casa para Liberar';
    }
  } else {
    if (!hasCalculatedShipping) {
      lockedButtonText = 'Calcule o Frete para Encomendar';
    } else if (!hasValidHouseNumber) {
      lockedButtonText = 'Digite o Nº da Casa para Liberar';
    }
  }

  const handleWhatsAppCheckout = () => {
    // 1. Validation for orders with less than 3 shirts: must calculate shipping first
    if (!freeShippingQualified) {
      if (!calculatedCep || !selectedShippingOption) {
        setFormError('⚠️ Por favor, digite seu CEP e calcule o frete dos Correios antes de chamar no WhatsApp.');
        const el = document.getElementById('cart-cep-input');
        if (el) el.focus();
        return;
      }
    }

    // 2. Validation for orders with 3+ shirts: must inform CEP for shipping label
    if (freeShippingQualified) {
      const cleanCep = (calculatedCep || cepInput).replace(/\D/g, '');
      if (cleanCep.length !== 8) {
        setFormError('⚠️ Por favor, informe seu CEP para que possamos enviar com Frete Grátis.');
        const el = document.getElementById('cart-cep-input');
        if (el) el.focus();
        return;
      }
    }

    // 3. MANDATORY: House number is required in both cases to release WhatsApp
    if (!hasValidHouseNumber) {
      setFormError('⚠️ Por favor, informe o número da sua casa / residência para liberar o pedido pelo WhatsApp.');
      const elNum = document.getElementById('cart-street-number-input') || document.getElementById('cart-street-number-input-lt3');
      if (elNum) elNum.focus();
      return;
    }

    setFormError(null);

    const completeAddress: ShippingAddressInfo = {
      cep: calculatedCep || cepInput,
      logradouro: streetName || shippingAddress?.logradouro,
      numero: streetNumber.trim(),
      complemento: streetComplement.trim(),
      bairro: bairroName || shippingAddress?.bairro,
      localidade: cityName || shippingAddress?.localidade,
      uf: ufName || shippingAddress?.uf
    };

    const message = buildCartWhatsAppMessage(
      cart,
      cartTotal,
      selectedShippingOption,
      calculatedCep || cepInput,
      shippingDestination,
      completeAddress
    );

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

          {/* 2. Free Shipping Progress Bar (Pinned Top) */}
          <div className="shrink-0 p-3 sm:p-3.5 bg-[#181a24] border-b border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-[11px] sm:text-xs">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                {freeShippingQualified ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-emerald-400" />
                    Parabéns! Você ganhou FRETE GRÁTIS!
                  </span>
                ) : (
                  <span>
                    Falta <strong className="text-amber-400">{freeShippingRemaining} {freeShippingRemaining === 1 ? 'camisa' : 'camisas'}</strong> para <strong>FRETE GRÁTIS</strong>
                  </span>
                )}
              </span>
              <span className="text-slate-400 font-mono text-[10px] sm:text-[11px]">
                {cartItemCount}/3 mantos
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  freeShippingQualified ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-gold-gradient'
                }`}
                style={{ width: `${Math.min(100, (cartItemCount / 3) * 100)}%` }}
              />
            </div>
          </div>

          {/* 3. Scrollable Content Area: Items + (Address Form OR Shipping Calculator) */}
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

                {/* Validation Error Banner */}
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* CONDITIONAL SYSTEM REQUESTED BY USER:
                    1. If cartItemCount >= 3: Shipping calculation vanishes from screen and ONLY Address form is shown.
                    2. If cartItemCount < 3: Shows Shipping Calculator and mandates calculation before WhatsApp checkout.
                */}
                {freeShippingQualified ? (
                  /* ========================================================
                     SCENARIO 1: A PARTIR DE 3 PEÇAS - FRETE SOME E APARECE ENDEREÇO
                     ======================================================== */
                  <div className="rounded-2xl bg-gradient-to-b from-[#14231b] via-[#121820] to-[#12141c] border border-emerald-500/40 p-4 space-y-3.5 shadow-xl">
                    {/* Free shipping celebration badge */}
                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0 font-bold">
                        <Gift className="w-5 h-5 fill-black" />
                      </div>
                      <div>
                        <span className="font-black text-xs uppercase tracking-wider text-emerald-300 block font-display">
                          🎉 FRETE 100% GRÁTIS ATIVADO!
                        </span>
                        <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                          Você escolheu <strong>{cartItemCount} mantos</strong>. O frete dos Correios é gratuito! Preencha apenas seu endereço para envio:
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-display">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        Endereço de Recebimento
                      </span>

                      {/* CEP Lookup */}
                      <form onSubmit={handleCalcShipping} className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            id="cart-cep-input"
                            type="text"
                            inputMode="numeric"
                            maxLength={9}
                            placeholder="Seu CEP (00000-000)"
                            value={cepInput}
                            onChange={handleCepChange}
                            className="w-full px-3 py-2.5 rounded-xl bg-[#0f1015] border border-emerald-500/30 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isCalculatingShipping}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-emerald-950/30 cursor-pointer"
                        >
                          {isCalculatingShipping ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Buscando...</span>
                            </>
                          ) : (
                            'Buscar Endereço'
                          )}
                        </button>
                      </form>

                      {/* Address Fields: Street, Number, Complement, Neighborhood, City */}
                      <div className="space-y-2 pt-1 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                            Rua / Logradouro:
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Av. Brasil ou Nome da Rua"
                            value={streetName}
                            onChange={(e) => setStreetName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#0f1015] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-300 uppercase font-bold block mb-1 flex items-center justify-between">
                              <span>Número <span className="text-amber-400">*</span>:</span>
                              <span className="text-amber-400 font-bold text-[9px]">Obrigatório</span>
                            </label>
                            <input
                              id="cart-street-number-input"
                              type="text"
                              placeholder="Nº da Casa / Apto"
                              value={streetNumber}
                              onChange={(e) => {
                                setStreetNumber(e.target.value);
                                setFormError(null);
                              }}
                              className={`w-full px-3 py-2 rounded-xl bg-[#0f1015] border text-white text-xs font-bold focus:outline-none transition-colors ${
                                !streetNumber.trim() ? 'border-amber-500/80 ring-1 ring-amber-500/30' : 'border-emerald-500/50'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                              Complemento:
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Bloco B, Apto 42"
                              value={streetComplement}
                              onChange={(e) => setStreetComplement(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#0f1015] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                              Bairro:
                            </label>
                            <input
                              type="text"
                              placeholder="Bairro"
                              value={bairroName}
                              onChange={(e) => setBairroName(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#0f1015] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                              Cidade / UF:
                            </label>
                            <input
                              type="text"
                              placeholder="Cidade - UF"
                              value={cityName && ufName ? `${cityName} - ${ufName}` : cityName || ufName}
                              onChange={(e) => setCityName(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#0f1015] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Envio com código de rastreamento oficial dos Correios</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ========================================================
                     SCENARIO 2: MENOS DE 3 PEÇAS - CALCULAR FRETE OBRIGATÓRIO
                     ======================================================== */
                  <div className="rounded-2xl bg-[#161824] border border-amber-500/40 p-4 space-y-3.5 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs uppercase tracking-wider text-white flex items-center gap-1.5 font-display">
                        <Truck className="w-4 h-4 text-amber-400" />
                        Calcule o Frete para seu Endereço
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9px] font-bold uppercase tracking-wider">
                        Obrigatório
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-tight">
                      💡 <strong>Dica MN Store:</strong> Adicione mais {freeShippingRemaining} {freeShippingRemaining === 1 ? 'manto' : 'mantos'} à sacola e o frete fica <strong>100% GRÁTIS</strong>!
                    </div>

                    {/* Agency Origin */}
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Origem do Envio: {originAgency.agencyName}</span>
                      </div>
                      <p className="text-slate-300 text-[10px] leading-tight">
                        {originAgency.fullAddress}
                      </p>
                    </div>

                    {/* CEP Form */}
                    <form onSubmit={handleCalcShipping} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          id="cart-cep-input"
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
                            <span>Calculando...</span>
                          </>
                        ) : (
                          'Calcular Frete'
                        )}
                      </button>
                    </form>

                    {/* Options list if calculated */}
                    {shippingOptions.length > 0 && (
                      <div className="space-y-3 pt-2 border-t border-white/10 animate-in fade-in duration-200">
                        {/* Located Address */}
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs space-y-1.5">
                          <div className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>Destino Encontrado: {shippingDestination}</span>
                          </div>
                          
                          {/* Street & Number inputs */}
                          <div className="space-y-1 pt-1">
                            <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-2">
                                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                                  Rua / Logradouro:
                                </label>
                                <input
                                  type="text"
                                  placeholder="Rua / Avenida"
                                  value={streetName}
                                  onChange={(e) => setStreetName(e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0d0e14] border border-white/10 text-white text-[11px] focus:outline-none focus:border-amber-400"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-300 uppercase font-bold block mb-0.5 flex items-center justify-between">
                                  <span>Nº:</span>
                                  <span className="text-amber-400 font-black text-[9px]">* Obrigatório</span>
                                </label>
                                <input
                                  id="cart-street-number-input-lt3"
                                  type="text"
                                  placeholder="Nº da Casa *"
                                  value={streetNumber}
                                  onChange={(e) => {
                                    setStreetNumber(e.target.value);
                                    setFormError(null);
                                  }}
                                  className={`w-full px-2.5 py-1.5 rounded-lg bg-[#0d0e14] border text-white text-[11px] font-bold focus:outline-none transition-colors ${
                                    !streetNumber.trim() ? 'border-amber-500/80 ring-1 ring-amber-500/40' : 'border-emerald-500/50'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* PAC and SEDEX selection buttons */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                            Escolha a Modalidade dos Correios:
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
                                    <span className="text-xs font-bold text-white font-mono">
                                      R$ {opt.price.toFixed(2)}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

          </div>

          {/* 4. Sticky Bottom Summary & WhatsApp Order CTA (Pinned Bottom) */}
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
                    Frete dos Correios:
                  </span>
                  <span className="font-mono font-bold">
                    {freeShippingQualified ? (
                      <span className="text-emerald-400 font-black uppercase flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        100% GRÁTIS
                      </span>
                    ) : selectedShippingOption ? (
                      <span className="text-white">
                        {selectedShippingOption.service}: R$ {selectedShippingOption.price.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-amber-400/90 text-[10px] font-bold">
                        ⚠️ Calcule acima para liberar
                      </span>
                    )}
                  </span>
                </div>

                {/* Status do Número da Casa */}
                <div className="flex justify-between text-[11px] items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Home className="w-3 h-3 text-amber-400" />
                    Número da Residência:
                  </span>
                  <span className="font-mono text-[10px]">
                    {hasValidHouseNumber ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Nº {streetNumber}
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold bg-amber-500/15 px-1.5 py-0.5 rounded">
                        * Falta preencher
                      </span>
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
              {isShippingReady ? (
                /* BUTTON ACTIVE: When shipping + house number are ready */
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-700 shrink-0" />
                  <span>Encomendar pelo WhatsApp</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              ) : (
                /* BUTTON LOCKED: Forces user to calculate shipping and enter house number */
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-105 text-black font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-950/40 active:scale-98 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-black shrink-0" />
                  <span>{lockedButtonText}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              )}

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
