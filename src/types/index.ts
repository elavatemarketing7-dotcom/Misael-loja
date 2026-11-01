export type JerseyCategory = 'todos' | 'brasileirao' | 'europeus' | 'selecoes' | 'retro' | 'especiais';

export type JerseySize = 'P' | 'M' | 'G' | 'GG' | 'XGG';

export type JerseyVersion = 'torcedor' | 'jogador';

export interface Product {
  id: string;
  name: string;
  team: string;
  league: string;
  category: JerseyCategory;
  originalPrice: number; // 180
  promoPrice: number; // 130
  image: string;
  fallbackColor: string; // for fallback graphic if no image
  secondaryImage?: string;
  badgeText?: string;
  stockCount: number;
  availableSizes: JerseySize[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  description: string;
  season: string;
}

export interface CustomizationOption {
  enabled: boolean;
  name: string;
  number: string;
  patch: 'nenhum' | 'champions' | 'libertadores' | 'brasileirao' | 'fifa';
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: JerseySize;
  version: JerseyVersion;
  customization: CustomizationOption;
  quantity: number;
  unitPrice: number;
}

export interface ShippingOption {
  id: 'pac' | 'sedex';
  name: string;
  service: string;
  price: number;
  originalPrice?: number;
  deadline: string;
  isFree?: boolean;
  description: string;
}

export interface ShippingAddressInfo {
  cep: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

export interface CustomerOrder {
  customerName: string;
  customerPhone: string;
  customerCpf: string;
  cep: string;
  address: string;
  number: string;
  city: string;
  state: string;
  paymentMethod: 'pix' | 'credit_card';
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  shippingOption?: ShippingOption;
  total: number;
}
