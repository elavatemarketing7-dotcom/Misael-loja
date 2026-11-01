import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Copy, 
  Check, 
  ShieldCheck, 
  MessageCircle, 
  Truck, 
  Lock,
  Sparkles,
  ArrowRight,
  Zap,
  Loader2,
  MapPin
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { calculateInstallments } from '../utils/installments';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    clearCart,
    showToast,
    calculatedCep,
    shippingOptions,
    selectedShippingOption,
    setSelectedShippingOption,
    shippingDestination,
    shippingAddress,
    isCalculatingShipping,
    calculateShipping
  } = useShop();

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Customer fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState(calculatedCep || '');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');

  // Sync address if already resolved in context
  useEffect(() => {
    if (calculatedCep && !cep) {
      setCep(calculatedCep);
    }
  }, [calculatedCep, cep]);

  useEffect(() => {
    if (shippingAddress) {
      if (shippingAddress.logradouro) setStreet(shippingAddress.logradouro);
      if (shippingAddress.bairro) setNeighborhood(shippingAddress.bairro);
      if (shippingAddress.localidade) setCity(shippingAddress.localidade);
      if (shippingAddress.uf) setState(shippingAddress.uf);
    }
  }, [shippingAddress]);

  const handleCepChange = (val: string) => {
    setCep(val);
    const clean = val.replace(/\D/g, '');
    if (clean.length === 8) {
      calculateShipping(clean);
    }
  };

  // Credit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  if (!isCheckoutOpen) return null;

  // PIX calculation: sem desconto (valor normal)
  const pixTotal = cartTotal;
  const installmentOptions = calculateInstallments(cartTotal);
  const currentInstallment = installmentOptions.find((o) => String(o.number) === installments) || installmentOptions[0];
  const finalCardTotal = currentInstallment.totalValue;
  const finalOrderTotal = paymentMethod === 'pix' ? pixTotal : finalCardTotal;

  const pixKeyString = `00020126580014br.gov.bcb.pix0136mnstore-pagamentos-oficiais@pix.com.br520400005303986540${pixTotal.toFixed(2)}5802BR5916MN STORE OFICIAL6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKeyString);
    setCopiedPix(true);
    showToast('Código PIX Copia e Cola copiado para a área de transferência!');
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !cep || !street || !number) {
      showToast('Por favor, preencha todos os campos obrigatórios de entrega.');
      return;
    }

    setOrderPlaced(true);
    showToast('Pedido registrado com sucesso na MN Store!');
  };

  const handleSendToWhatsApp = () => {
    const itemsText = cart
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product.name} (Tamanho: ${item.size}, Versão: ${item.version}) ${
            item.customization.enabled
              ? `[Nome: ${item.customization.name || 'SEM NOME'} #${item.customization.number || '0'}]`
              : ''
          } - R$ ${item.unitPrice * item.quantity},00`
      )
      .join('\n');

    const paymentDetail = paymentMethod === 'pix'
      ? `PIX Instantâneo (R$ ${pixTotal.toFixed(2)})`
      : currentInstallment.hasInterest
        ? `Cartão de Crédito (${currentInstallment.number}x de R$ ${currentInstallment.installmentValue.toFixed(2)} - com juros da maquininha, Total: R$ ${finalCardTotal.toFixed(2)})`
        : `Cartão de Crédito (${currentInstallment.number}x de R$ ${currentInstallment.installmentValue.toFixed(2)} sem juros)`;

    const shippingDetail = selectedShippingOption
      ? `${selectedShippingOption.service} (${selectedShippingOption.deadline}) - ${
          selectedShippingOption.price === 0 ? 'GRÁTIS' : `R$ ${selectedShippingOption.price.toFixed(2)}`
        }`
      : 'Frete Correios a calcular';

    const orderMsg = encodeURIComponent(
      `🦁 *NOVO PEDIDO CONFIRMADO - MN STORE*\n\n` +
      `*Cliente:* ${fullName}\n` +
      `*WhatsApp:* ${phone}\n` +
      `*Origem do Envio:* Agência Correios São Vicente - SP (CEP 11370-971)\n` +
      `*Endereço de Entrega:* ${street}, nº ${number} ${complement ? `(${complement})` : ''} - ${neighborhood}, ${city}/${state} - CEP: ${cep}\n` +
      `*Modalidade de Envio:* ${shippingDetail}\n\n` +
      `*Mantos Escolhidos (Promoção R$ 130):*\n${itemsText}\n\n` +
      `*Forma de Pagamento:* ${paymentDetail}\n` +
      `*Total do Pedido:* R$ ${finalOrderTotal.toFixed(2)}\n\n` +
      `Por favor, confirmem o envio do código de rastreamento dos Correios!`
    );

    window.open(`https://wa.me/5511999999999?text=${orderMsg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#121318] border border-amber-500/30 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-[#161820]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1 sm:p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wider">
                Checkout Seguro · MN Store
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">Ambiente criptografado SSL 256 bits</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (orderPlaced) clearCart();
              setIsCheckoutOpen(false);
            }}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          {orderPlaced ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Check className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  Pedido #MN-{Math.floor(100000 + Math.random() * 900000)} Gerado com Sucesso!
                </span>
                <h2 className="text-2xl font-black text-white font-display uppercase">
                  Obrigado pela preferência, {fullName || 'Torcedor'}!
                </h2>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Seus mantos oficiais estão sendo separados com todo carinho pela equipe MN Store.
                </p>
              </div>

              {/* PIX Payment Instructions if chosen */}
              {paymentMethod === 'pix' && (
                <div className="p-5 rounded-xl bg-[#161822] border border-amber-500/30 max-w-md mx-auto space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase">
                      Pague com PIX para liberar o envio imediato:
                    </span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">
                      R$ {pixTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-center p-3 bg-white rounded-xl">
                    {/* Simulated visual QR Code matrix */}
                    <div className="w-36 h-36 bg-[#121318] p-2 rounded-lg flex flex-col items-center justify-center text-center">
                      <QrCode className="w-28 h-28 text-white" />
                      <span className="text-[9px] text-amber-400 font-mono font-bold mt-1">PIX MN STORE</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 block font-semibold">
                      Chave PIX Copia e Cola:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixKeyString}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#0e0f14] border border-white/10 text-slate-400 text-[10px] font-mono truncate"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        Copiar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar Comprovante / Falar no WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setIsCheckoutOpen(false);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors"
                >
                  Concluir e Voltar à Loja
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleFinishOrder} className="space-y-6">
              {/* Aviso em destaque no começo do checkout */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/70 border-2 border-emerald-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 fill-emerald-500/20" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-black">
                        Atenção
                      </span>
                      <h4 className="font-display font-black text-white text-sm sm:text-base tracking-wide">
                        Acima de 10 peças chamar no WhatsApp
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Para pedidos no atacado ou acima de 10 unidades, fale diretamente conosco no WhatsApp para condições e descontos especiais!
                    </p>
                  </div>
                </div>
                <a
                  href="https://wa.me/5511999999999?text=Ol%C3%A1%20MN%20Store!%20Gostaria%20de%20fazer%20um%20pedido%20acima%20de%2010%20pe%C3%A7as%20no%20atacado."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chamar no WhatsApp</span>
                </a>
              </div>

              {/* Order summary pill */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-200">
                    Garantindo <strong className="text-white">{cart.length} manto(s)</strong> na promoção <strong>R$ 130 cada</strong>!
                    {selectedShippingOption && (
                      <span className="ml-1 text-slate-400">
                        · Frete: <strong className="text-amber-300">{selectedShippingOption.service} ({selectedShippingOption.price === 0 ? 'GRÁTIS' : `R$ ${selectedShippingOption.price.toFixed(2)}`})</strong>
                      </span>
                    )}
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  Total: R$ {finalOrderTotal.toFixed(2)}
                </span>
              </div>

              {/* 1. Customer Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
                  <span>1.</span> Dados Pessoais & Contato
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] text-slate-300 font-semibold">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Gabriel Silva"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#181a24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-semibold">WhatsApp com DDD *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#181a24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address & Correios Shipping */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>2.</span> Endereço de Entrega & Frete Correios
                  </h4>
                  {shippingDestination && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      {shippingDestination}
                    </span>
                  )}
                </div>

                {/* Correios Origin Agency Notice */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#181a24] to-[#12131b] border border-amber-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Origem do Envio: Agência Correios São Vicente - SP</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Av. Capitão Luiz Hourneaux, 748 - Jardim Paraíso, São Vicente - SP (CEP 11370-971)
                  </p>
                  <p className="text-[10px] text-slate-400">
                    O cálculo oficial de PAC e SEDEX é realizado da agência de São Vicente até o seu endereço.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-slate-300 font-semibold">CEP *</label>
                      {isCalculatingShipping && (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Buscando...
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={9}
                        placeholder="00000-000"
                        value={cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#181a24] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-3 space-y-1">
                    <label className="text-[11px] text-slate-300 font-semibold">Rua / Logradouro *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Av. Paulista"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#181a24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-semibold">Número *</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#181a24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-semibold">Complemento</label>
                    <input
                      type="text"
                      placeholder="Apto 42, Bloco B"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#181a24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-semibold">Bairro</label>
                    <input
                      type="text"
                      placeholder="Bela Vista"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#181a24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-semibold">Cidade / UF</label>
                    <input
                      type="text"
                      placeholder="São Paulo / SP"
                      value={city ? `${city} - ${state}` : ''}
                      onChange={(e) => {
                        const parts = e.target.value.split('-');
                        setCity(parts[0]?.trim() || e.target.value);
                        if (parts[1]) setState(parts[1].trim());
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#181a24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Correios Shipping Options in Checkout */}
                {shippingOptions.length > 0 && (
                  <div className="pt-2">
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1.5">
                      Selecione a Modalidade dos Correios:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {shippingOptions.map((opt) => {
                        const isSelected = selectedShippingOption?.id === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedShippingOption(opt)}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                                : 'bg-[#181a24] border-white/10 text-slate-300 hover:border-white/30'
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
                                    {opt.id === 'sedex' ? 'SEDEX' : 'PAC'} Correios
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

              {/* 3. Payment Method */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
                    <span>3.</span> Forma de Pagamento
                  </h4>
                  <a
                    href="https://wa.me/5511999999999?text=Ol%C3%A1%20MN%20Store!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20o%20pagamento%20de%20pedido%20acima%20de%2010%20pe%C3%A7as."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Acima de 10 peças chamar no WhatsApp</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'pix'
                        ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-[#181a24] border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs uppercase text-white font-display">PIX Imediato</span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase">
                          Aprovação Imediata
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Aprovação instantânea e envio prioritário
                      </p>
                      <p className="text-xs font-mono font-bold text-amber-300 mt-1">
                        R$ {pixTotal.toFixed(2)}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-[#181a24] border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs uppercase text-white font-display">Cartão de Crédito</span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold uppercase">
                          Até 5x s/ juros
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Em até 5x de R$ {(cartTotal / 5).toFixed(2)} sem juros
                      </p>
                      <p className="text-xs font-mono font-bold text-white mt-1">
                        {currentInstallment.hasInterest 
                          ? `Total: R$ ${finalCardTotal.toFixed(2)} (${currentInstallment.number}x c/ juros maquininha)`
                          : `Total: R$ ${cartTotal.toFixed(2)} (sem juros)`}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Credit Card inputs if chosen */}
                {paymentMethod === 'credit_card' && (
                  <div className="p-4 rounded-xl bg-[#161822] border border-white/10 space-y-3.5 animate-in fade-in duration-150">
                    {/* Installments selection */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] text-slate-300 font-semibold">
                          Número de Parcelas
                        </label>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          Até 5x sem juros no cartão
                        </span>
                      </div>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        {installmentOptions.map((opt) => (
                          <option key={opt.number} value={String(opt.number)}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {currentInstallment.hasInterest ? (
                        <p className="text-[10px] text-amber-400 italic pt-0.5">
                          * A partir de 5 parcelas incide taxa da maquininha de cartão. Total: R$ {currentInstallment.totalValue.toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-[10px] text-emerald-400 font-medium pt-0.5">
                          ✓ Parcela sem juros garantida pela MN Store.
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300 font-semibold">Número do Cartão</label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#111216] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="col-span-2 sm:col-span-1 space-y-1">
                        <label className="text-[11px] text-slate-300 font-semibold">Nome no Cartão</label>
                        <input
                          type="text"
                          placeholder="Como impresso"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#111216] border border-white/10 text-white text-xs uppercase focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-300 font-semibold">Validade (MM/AA)</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#111216] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-300 font-semibold">CVV</label>
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#111216] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gold-gradient text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all"
                >
                  <Lock className="w-4 h-4 fill-black" />
                  Confirmar Pedido (R$ {finalOrderTotal.toFixed(2)})
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
