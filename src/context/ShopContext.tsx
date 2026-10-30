import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, JerseyCategory, JerseySize, JerseyVersion, CustomizationOption } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

interface ShopContextType {
  products: Product[];
  addProduct: (newProduct: Omit<Product, 'id'>) => Product;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  resetProductsToDefault: () => void;
  cart: CartItem[];
  addToCart: (
    product: Product,
    size: JerseySize,
    version: JerseyVersion,
    customization: CustomizationOption,
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  freeShippingQualified: boolean;
  freeShippingRemaining: number;
  shippingCost: number;
  calculatedCep: string;
  calculateShipping: (cep: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isLojistaModalOpen: boolean;
  setIsLojistaModalOpen: (open: boolean) => void;
  isLojistaLoginOpen: boolean;
  setIsLojistaLoginOpen: (open: boolean) => void;
  isLojistaAuthenticated: boolean;
  loginLojista: (user: string, pass: string) => { success: boolean; message: string };
  logoutLojista: () => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (product: Product | null) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  activeCategory: JerseyCategory;
  setActiveCategory: (cat: JerseyCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSizeFilter: JerseySize | null;
  setSelectedSizeFilter: (size: JerseySize | null) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  openProductEditor: (product?: Product) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LOCAL_STORAGE_PRODUCTS_KEY = 'mn_store_v1_products';
const LOCAL_STORAGE_CART_KEY = 'mn_store_v1_cart';
const LOCAL_STORAGE_WISHLIST_KEY = 'mn_store_v1_wishlist';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products with local storage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Cart persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Wishlist persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLojistaModalOpen, setIsLojistaModalOpen] = useState(false);
  const [isLojistaLoginOpen, setIsLojistaLoginOpen] = useState(false);
  const [isLojistaAuthenticated, setIsLojistaAuthenticated] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<JerseyCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<JerseySize | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Checkout & Shipping state
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [calculatedCep, setCalculatedCep] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const addProduct = (newProductData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...newProductData,
      id: `mn-custom-${Date.now()}`
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Manto "${newProduct.team}" adicionado ao catálogo com sucesso!`);
    return newProduct;
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.productId !== id));
    setEditingProduct((curr) => (curr?.id === id ? null : curr));
    showToast('Camisa removida do catálogo com sucesso!');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Manto atualizado com sucesso no catálogo!');
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(LOCAL_STORAGE_PRODUCTS_KEY);
    showToast('Catálogo restaurado para as fotos e modelos padrão!');
  };

  const addToCart = (
    product: Product,
    size: JerseySize,
    version: JerseyVersion,
    customization: CustomizationOption,
    quantity = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.size === size &&
          item.version === version &&
          item.customization.name === customization.name &&
          item.customization.number === customization.number &&
          item.customization.patch === customization.patch
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }

      const newItem: CartItem = {
        id: `${product.id}-${size}-${version}-${Date.now()}`,
        productId: product.id,
        product,
        size,
        version,
        customization,
        quantity,
        unitPrice: product.promoPrice // 120
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
    showToast(`Manto ${product.team} adicionado à sacola!`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  // Free shipping rule: 2 or more jerseys = free shipping!
  const freeShippingQualified = cartItemCount >= 2;
  const freeShippingRemaining = Math.max(0, 2 - cartItemCount);

  // Shipping calculation
  const calculateShipping = (cep: string) => {
    const clean = cep.replace(/\D/g, '');
    setCalculatedCep(clean);
    if (clean.length === 8) {
      if (freeShippingQualified) {
        setShippingCost(0);
        showToast('Parabéns! Seu pedido se qualificou para FRETE GRÁTIS!');
      } else {
        setShippingCost(14.9);
        showToast('Frete calculado com sucesso via Correios!');
      }
    }
  };

  const effectiveShipping = freeShippingQualified ? 0 : shippingCost;
  const cartTotal = Math.max(0, cartSubtotal + effectiveShipping);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Manto removido dos seus favoritos');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Manto salvo nos seus favoritos!');
        return [...prev, productId];
      }
    });
  };

  const loginLojista = (user: string, pass: string) => {
    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanUser === 'mnstore' && cleanPass === 'Misael@123') {
      setIsLojistaAuthenticated(true);
      try {
        sessionStorage.setItem('mn_lojista_authenticated', 'true');
      } catch {
        // ignore
      }
      setIsLojistaLoginOpen(false);
      setIsLojistaModalOpen(true);
      showToast('Acesso concedido ao Painel do Lojista!');
      return { success: true, message: 'Login realizado com sucesso!' };
    }

    return { success: false, message: 'Usuário ou senha incorretos. Verifique suas credenciais.' };
  };

  const logoutLojista = () => {
    setIsLojistaAuthenticated(false);
    try {
      sessionStorage.removeItem('mn_lojista_authenticated');
    } catch {
      // ignore
    }
    setIsLojistaModalOpen(false);
    showToast('Sessão do lojista encerrada.');
  };

  const openProductEditor = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
    } else {
      setEditingProduct(products[0]);
    }

    if (!isLojistaAuthenticated) {
      setIsLojistaLoginOpen(true);
    } else {
      setIsLojistaModalOpen(true);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        removeProduct,
        updateProduct,
        resetProductsToDefault,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        freeShippingQualified,
        freeShippingRemaining,
        shippingCost: effectiveShipping,
        calculatedCep,
        calculateShipping,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isLojistaModalOpen,
        setIsLojistaModalOpen,
        isLojistaLoginOpen,
        setIsLojistaLoginOpen,
        isLojistaAuthenticated,
        loginLojista,
        logoutLojista,
        editingProduct,
        setEditingProduct,
        selectedProductDetail,
        setSelectedProductDetail,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedSizeFilter,
        setSelectedSizeFilter,
        wishlist,
        toggleWishlist,
        openProductEditor,
        toastMessage,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
