import { CartItem, Product, JerseySize, JerseyVersion, CustomizationOption, ShippingOption, ShippingAddressInfo } from '../types';

// The verified phone number for MN Store (mapped from WhatsApp Business LC7PW3CRA6G5P1)
export const MN_STORE_WHATSAPP_PHONE = '5513978245122';
export const MN_STORE_SHORTLINK = 'https://wa.me/message/LC7PW3CRA6G5P1';

/**
 * Returns the direct WhatsApp URL.
 * When text is provided, using api.whatsapp.com/send?phone=... guarantees that 100% of the
 * message body is pre-filled on WhatsApp Web, Mobile (Android/iOS), and Desktop without being dropped.
 */
export const getWhatsAppUrl = (text?: string): string => {
  if (!text || !text.trim()) {
    return MN_STORE_SHORTLINK;
  }
  return `https://api.whatsapp.com/send?phone=${MN_STORE_WHATSAPP_PHONE}&text=${encodeURIComponent(text)}`;
};

/**
 * Builds a comprehensive, professional order message with all shirt details,
 * total quantity, free shipping qualification (from 3+ shirts), Correios logistics, and values.
 */
export const buildCartWhatsAppMessage = (
  cart: CartItem[],
  cartTotal: number,
  shippingOption?: ShippingOption | null,
  cep?: string,
  destination?: string,
  address?: ShippingAddressInfo | null
): string => {
  const orderId = `MN-${Date.now().toString().slice(-6)}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalOriginal = cart.reduce((acc, item) => acc + item.product.originalPrice * item.quantity, 0);
  const totalSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const totalEconomy = totalOriginal - totalSubtotal;

  const hasFreeShipping = totalQuantity >= 3;

  const itemsList = cart
    .map((item, idx) => {
      let customInfo = '• Personalização: Sem personalização (Manto liso)';
      if (item.customization && item.customization.enabled) {
        const namePart = item.customization.name ? `Nome: "${item.customization.name}"` : 'Sem nome';
        const numPart = item.customization.number ? `Número: "${item.customization.number}"` : 'Sem número';
        const patchPart = item.customization.patch && item.customization.patch !== 'nenhum' 
          ? ` | Patch: ${item.customization.patch.toUpperCase()}` 
          : '';
        customInfo = `• *Personalização Oficial:* ${namePart} | ${numPart}${patchPart}`;
      }

      return (
        `👕 *ITEM ${idx + 1}: ${item.product.name}*\n` +
        `• Quantidade: *${item.quantity} unidade(s)*\n` +
        `• Time / Clube: ${item.product.team}\n` +
        `• Temporada: ${item.product.season || '2024/2025'}\n` +
        `• Tamanho Escolhido: *${item.size}*\n` +
        `• Versão: *${item.version.toUpperCase()}*\n` +
        `${customInfo}\n` +
        `• Preço Unitário: R$ ${item.unitPrice},00 (De R$ 180 por R$ 130)\n` +
        `• Subtotal deste item: *R$ ${(item.unitPrice * item.quantity).toFixed(2)}*`
      );
    })
    .join('\n\n───────────────────\n\n');

  // Free shipping highlight block
  const freeShippingNotice = hasFreeShipping
    ? `🎁 *BENEFÍCIO APLICADO:*\n🎉 *VOCÊ GANHOU FRETE GRÁTIS!*\n• Como o pedido tem *${totalQuantity} camisetas* (a partir de 3 peças), o envio via Correios PAC é *100% GRATUITO*!`
    : `📦 *STATUS DO FRETE:*\n• Quantidade no pedido: *${totalQuantity} camiseta(s)*\n• Dica: Compras *a partir de 3 camisetas ganham FRETE GRÁTIS*! (Falta apenas ${3 - totalQuantity} para zerar o frete)`;

  // Shipping & Delivery Address details
  const streetPart = address?.logradouro 
    ? `${address.logradouro}${address.numero ? `, nº ${address.numero}` : ''}${address.complemento ? ` (${address.complemento})` : ''} - ${address.bairro || ''}, ${address.localidade || ''}/${address.uf || ''}`
    : (destination || 'Endereço a confirmar no WhatsApp');

  let shippingBlock = '';
  if (hasFreeShipping) {
    shippingBlock = (
      `📦 *LOGÍSTICA & ENDEREÇO DE RECEBIMENTO (FRETE GRÁTIS):*\n` +
      `• Modalidade: *CORREIOS PAC (100% GRATUITO)*\n` +
      `• Benefício Especial: *VOCÊ GANHOU FRETE GRÁTIS POR CONTER ${totalQuantity} CAMISETAS!*\n` +
      `• CEP de Entrega: *${cep ? `${cep.replace(/\D/g, '').slice(0, 5)}-${cep.replace(/\D/g, '').slice(5)}` : 'Não informado'}*\n` +
      `• Endereço de Entrega: *${streetPart}*\n` +
      `• Origem do Envio: Agência Correios São Vicente/SP (CEP: 11370-971)`
    );
  } else if (shippingOption) {
    const priceText = `R$ ${shippingOption.price.toFixed(2)}`;
    const deadlineText = shippingOption.deadline || 'Prazo padrão dos Correios';

    shippingBlock = (
      `📦 *LOGÍSTICA & ENDEREÇO DE RECEBIMENTO:*\n` +
      `• Modalidade dos Correios: *${shippingOption.service.toUpperCase()}*\n` +
      `• Prazo Estimado: *${deadlineText}*\n` +
      `• Valor do Frete: *${priceText}*\n` +
      `• CEP de Entrega: *${cep ? `${cep.replace(/\D/g, '').slice(0, 5)}-${cep.replace(/\D/g, '').slice(5)}` : 'Não informado'}*\n` +
      `• Endereço de Entrega: *${streetPart}*\n` +
      `• Origem do Envio: Agência Correios São Vicente/SP (CEP: 11370-971)`
    );
  } else {
    shippingBlock = (
      `📦 *LOGÍSTICA & FRETE:*\n` +
      `• CEP Informado: *${cep || 'A combinar no WhatsApp'}*\n` +
      `• Endereço: *${streetPart}*\n` +
      `• Origem do Envio: São Vicente - SP (CEP: 11370-971)`
    );
  }

  const installments = (cartTotal / 5).toFixed(2);

  return (
    `🦁 *NOVO PEDIDO MN STORE - #${orderId}*\n` +
    `📅 *Data do Pedido:* ${dateStr} às ${timeStr}\n` +
    `🔢 *QUANTIDADE TOTAL:* *${totalQuantity} camiseta(s)*\n` +
    (hasFreeShipping ? `🎉 *DESTAQUE:* *GANHOU FRETE GRÁTIS (A partir de 3 camisetas)!*\n\n` : `\n`) +
    `Olá MN Store! Montei meu pedido no site na promoção de *R$ 130* e quero fechar com você:\n\n` +
    `═══════════════════\n` +
    `📋 *DETALHES DAS CAMISETAS (${totalQuantity} peças):*\n\n` +
    `${itemsList}\n\n` +
    `═══════════════════\n` +
    `${freeShippingNotice}\n\n` +
    `═══════════════════\n` +
    `${shippingBlock}\n\n` +
    `═══════════════════\n` +
    `💰 *RESUMO FINANCEIRO:*\n` +
    `• Quantidade de Mantos: *${totalQuantity} unidade(s)*\n` +
    `• Subtotal das Camisetas: R$ ${totalSubtotal.toFixed(2)}\n` +
    (totalEconomy > 0 ? `• Economia da Promoção: R$ ${totalEconomy.toFixed(2)} OFF\n` : '') +
    `• Frete dos Correios: *${hasFreeShipping || (shippingOption && shippingOption.price === 0) ? 'GRÁTIS (Promoção 3+ camisetas)' : (shippingOption ? `R$ ${shippingOption.price.toFixed(2)}` : 'A calcular')}*\n` +
    `• *VALOR TOTAL A PAGAR:* *R$ ${cartTotal.toFixed(2)}*\n\n` +
    `💳 *Condições de Pagamento:*\n` +
    `• PIX: Aprovação e envio prioritário com rastreio\n` +
    `• Cartão: até *5x de R$ ${installments} SEM JUROS*\n` +
    `═══════════════════\n\n` +
    `Por favor, me envie a chave PIX ou o link do cartão para eu realizar o pagamento e vocês iniciarem o envio!`
  );
};

/**
 * Builds an order message for a single product directly from the product detail modal.
 */
export const buildSingleProductWhatsAppMessage = (
  product: Product,
  size: JerseySize,
  version: JerseyVersion,
  customization: CustomizationOption,
  quantity = 1
): string => {
  const orderId = `MN-${Date.now().toString().slice(-6)}`;
  const total = product.promoPrice * quantity;
  const installments = (total / 5).toFixed(2);
  const hasFreeShipping = quantity >= 3;

  let customInfo = '• Personalização: Sem personalização (Manto liso)';
  if (customization && customization.enabled) {
    const namePart = customization.name ? `Nome: "${customization.name}"` : 'Sem nome';
    const numPart = customization.number ? `Número: "${customization.number}"` : 'Sem número';
    const patchPart = customization.patch && customization.patch !== 'nenhum' 
      ? ` | Patch: ${customization.patch.toUpperCase()}` 
      : '';
    customInfo = `• *Personalização Oficial:* ${namePart} | ${numPart}${patchPart}`;
  }

  const freeShippingNotice = hasFreeShipping
    ? `🎁 *BENEFÍCIO APLICADO:*\n🎉 *GANHOU FRETE GRÁTIS!* Como você escolheu *${quantity} camisetas*, o frete PAC é 100% gratuito!\n\n`
    : `📦 *DICA DE FRETE:* Você escolheu *${quantity} camiseta(s)*. A partir de 3 camisetas o frete é 100% GRÁTIS!\n\n`;

  return (
    `🦁 *ENCOMENDA MN STORE - #${orderId}*\n` +
    `🔢 *QUANTIDADE:* *${quantity} camiseta(s)*\n` +
    (hasFreeShipping ? `🎉 *STATUS:* *GANHOU FRETE GRÁTIS (3+ camisetas)!*\n\n` : `\n`) +
    `Olá MN Store! Gostaria de encomendar este manto na promoção (De R$ 180 por R$ 130):\n\n` +
    `👕 *DETALHES DO MANTO:*\n` +
    `• Camisa: *${product.name}*\n` +
    `• Time: *${product.team}*\n` +
    `• Liga: ${product.league}\n` +
    `• Temporada: ${product.season || '2024/2025'}\n` +
    `• Quantidade Escolhida: *${quantity} unidade(s)*\n` +
    `• Tamanho Escolhido: *${size}*\n` +
    `• Versão: *${version.toUpperCase()}*\n` +
    `${customInfo}\n\n` +
    `${freeShippingNotice}` +
    `💰 *VALORES:*\n` +
    `• Preço Promocional: R$ ${product.promoPrice},00 cada\n` +
    `• Frete: *${hasFreeShipping ? 'GRÁTIS (Promoção 3+ camisetas)' : 'A calcular via Correios'}*\n` +
    `• *Total a Pagar:* *R$ ${total.toFixed(2)}*\n` +
    `• Parcelamento: até *5x de R$ ${installments} sem juros*\n\n` +
    `Por favor, me informe os dados para pagamento (PIX ou cartão) para confirmarmos o pedido. Obrigado!`
  );
};
