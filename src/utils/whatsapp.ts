import { CartItem, Product, JerseySize, JerseyVersion, CustomizationOption, ShippingOption } from '../types';

export const WHATSAPP_BASE_URL = 'https://wa.me/message/LC7PW3CRA6G5P1';

export const getWhatsAppUrl = (text?: string): string => {
  if (!text) {
    return WHATSAPP_BASE_URL;
  }
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
};

export const buildCartWhatsAppMessage = (
  cart: CartItem[],
  cartTotal: number,
  shippingOption?: ShippingOption | null,
  cep?: string
): string => {
  const itemsText = cart
    .map((item, idx) => {
      const customText = item.customization?.enabled
        ? `\n   ↳ *Personalização:* Nome: "${item.customization.name || 'SEM NOME'}" | Número: "${item.customization.number || 'S/N'}"${
            item.customization.patch && item.customization.patch !== 'nenhum'
              ? ` | Patch: ${item.customization.patch}`
              : ''
          }`
        : '';
      return `${idx + 1}. *${item.quantity}x ${item.product.name}*\n   • Time: ${item.product.team}\n   • Tamanho: ${item.size} | Versão: ${item.version}${customText}\n   • Valor: R$ ${(item.unitPrice * item.quantity).toFixed(2)}`;
    })
    .join('\n\n');

  let shippingText = '• *Frete:* A calcular via Correios';
  if (shippingOption) {
    shippingText = `• *Frete Correios:* ${shippingOption.service} (${shippingOption.deadline}) - ${
      shippingOption.price === 0 ? 'GRÁTIS' : `R$ ${shippingOption.price.toFixed(2)}`
    }${cep ? ` (CEP: ${cep})` : ''}`;
  }

  return (
    `🦁 *ENCOMENDA DE MANTOS - MN STORE*\n\n` +
    `Olá MN Store! Gostaria de encomendar os seguintes mantos da promoção (De R$ 180 por R$ 130 cada):\n\n` +
    `${itemsText}\n\n` +
    `--------------------------------\n` +
    `${shippingText}\n` +
    `💰 *TOTAL DA ENCOMENDA:* R$ ${cartTotal.toFixed(2)}\n` +
    `💳 *Formas de Pagamento:* PIX ou Cartão (em até 5x sem juros)\n` +
    `--------------------------------\n\n` +
    `Poderia confirmar a disponibilidade das peças e os dados para pagamento? Obrigado!`
  );
};

export const buildSingleProductWhatsAppMessage = (
  product: Product,
  size: JerseySize,
  version: JerseyVersion,
  customization: CustomizationOption,
  quantity = 1
): string => {
  const customText = customization.enabled
    ? `\n• *Personalização:* Nome: "${customization.name || 'SEM NOME'}" | Número: "${customization.number || 'S/N'}"${
        customization.patch && customization.patch !== 'nenhum' ? ` | Patch: ${customization.patch}` : ''
      }`
    : '';

  const total = product.promoPrice * quantity;

  return (
    `🦁 *ENCOMENDA DE MANTO - MN STORE*\n\n` +
    `Olá MN Store! Gostaria de encomendar este manto na promoção (De R$ 180 por R$ 130):\n\n` +
    `• *Manto:* ${product.name}\n` +
    `• *Time:* ${product.team} (${product.season || '2024/2025'})\n` +
    `• *Tamanho:* ${size}\n` +
    `• *Versão:* ${version}\n` +
    `• *Quantidade:* ${quantity}x${customText}\n\n` +
    `💰 *Valor:* R$ ${total.toFixed(2)}\n\n` +
    `Por favor, me informe o valor do frete e os dados para pagamento (PIX ou cartão). Obrigado!`
  );
};
