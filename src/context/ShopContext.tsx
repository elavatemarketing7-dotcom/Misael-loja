import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, JerseyCategory, JerseySize, JerseyVersion, CustomizationOption, ShippingOption, ShippingAddressInfo } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { calculateCorreios, CORREIOS_ORIGIN } from '../utils/correios';

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
  shippingOptions: ShippingOption[];
  selectedShippingOption: ShippingOption | null;
  setSelectedShippingOption: (option: ShippingOption) => void;
  shippingDestination: string;
  shippingAddress: ShippingAddressInfo | null;
  originAgency: typeof CORREIOS_ORIGIN;
  isCalculatingShipping: boolean;
  calculateShipping: (cep: string) => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
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

/**
 * Robust persistence function that guarantees custom products are saved
 * even if quota limits are approached.
 */
const saveProductsToStorage = (items: Product[]): boolean => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(items));
    return true;
  } catch (err) {
    console.warn('Quota exceeded on localStorage. Retrying with compressed payload...', err);
    try {
      // If quota exceeded, sanitize any excessively large images
      const sanitized = items.map((p) => {
        if (p.image && p.image.length > 500000) {
          return { ...p, image: '' };
        }
        return p;
      });
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(sanitized));
      return true;
    } catch (e2) {
      console.error('Falha crítica ao gravar no localStorage:', e2);
      return false;
    }
  }
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products with local storage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Automatic migration: update default promotion from 120 to 130
          return parsed.map((item: Product) => {
            if (item.promoPrice === 120 && item.originalPrice === 180) {
              return { ...item, promoPrice: 130 };
            }
            return item;
          });
        }
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

  // Checkout & Shipping state (Correios PAC & SEDEX)
  const [calculatedCep, setCalculatedCep] = useState<string>('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null);
  const [shippingDestination, setShippingDestination] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressInfo | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState<boolean>(false);

  // Load persisted products from server API on mount
  useEffect(() => {
    let isMounted = true;
    const loadServerProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.products) && data.products.length > 0) {
            if (isMounted) {
              setProducts(data.products);
              saveProductsToStorage(data.products);
            }
          }
        }
      } catch (err) {
        console.warn('API /api/products indisponível, usando cache:', err);
      }
    };
    loadServerProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    saveProductsToStorage(products);
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
    
    setProducts((prev) => {
      const updated = [newProduct, ...prev.filter((p) => p.id !== newProduct.id)];
      saveProductsToStorage(updated);
      return updated;
    });

    // Make the new shirt immediately visible in catalog and editing context
    setActiveCategory('todos');
    setEditingProduct(newProduct);
    showToast(`Manto "${newProduct.team || newProduct.name}" cadastrado e salvo com sucesso!`);

    // Persist permanently on server
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).catch((err) => {
      console.error('Falha ao salvar produto no servidor:', err);
    });

    return newProduct;
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveProductsToStorage(updated);
      return updated;
    });
    setCart((prev) => prev.filter((item) => item.productId !== id));
    setEditingProduct((curr) => (curr?.id === id ? null : curr));
    showToast('Camisa removida do catálogo com sucesso!');

    // Persist permanently on server
    fetch(`/api/products/${id}`, {
      method: 'DELETE'
    }).catch((err) => {
      console.error('Falha ao deletar produto no servidor:', err);
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      saveProductsToStorage(updated);
      return updated;
    });
    setEditingProduct((curr) => (curr?.id === id ? { ...curr, ...updates } : curr));
    showToast('Manto atualizado com sucesso no catálogo!');

    // Persist permanently on server
    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch((err) => {
      console.error('Falha ao atualizar produto no servidor:', err);
    });
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(LOCAL_STORAGE_PRODUCTS_KEY);
    showToast('Catálogo restaurado para as fotos e modelos padrão!');

    fetch('/api/products/reset', {
      method: 'POST'
    }).catch(() => {
      // fallback
    });
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
        unitPrice: product.promoPrice // 130
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

  // Free shipping rule: 3 or more jerseys = free shipping!
  const freeShippingQualified = cartItemCount >= 3;
  const freeShippingRemaining = Math.max(0, 3 - cartItemCount);

  // Shipping calculation via Correios (PAC and SEDEX)
  const calculateShipping = useCallback(
    async (cep: string) => {
      const clean = cep.replace(/\D/g, '');
      if (clean.length !== 8) {
        showToast('Digite um CEP válido com 8 dígitos.');
        return;
      }

      setCalculatedCep(clean);
      setIsCalculatingShipping(true);

      try {
        const result = await calculateCorreios(clean, freeShippingQualified);
        setShippingOptions(result.options);
        setShippingDestination(result.destination);
        if (result.address) {
          setShippingAddress(result.address);
        }

        // Keep current selected method if valid, or default to PAC
        setSelectedShippingOption((prev) => {
          if (prev) {
            const match = result.options.find((o) => o.id === prev.id);
            if (match) return match;
          }
          return result.options[0] || null;
        });

        if (freeShippingQualified) {
          showToast(`Correios para ${result.destination}: PAC Grátis ativado!`);
        } else {
          showToast(`Correios para ${result.destination}: PAC e SEDEX disponíveis!`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro ao calcular frete dos Correios';
        showToast(msg);
      } finally {
        setIsCalculatingShipping(false);
      }
    },
    [freeShippingQualified, showToast]
  );

  // Recalculate rates when cart qualification changes (e.g. from 1 item to 2 items)
  useEffect(() => {
    if (calculatedCep && calculatedCep.length === 8) {
      calculateCorreios(calculatedCep, freeShippingQualified)
        .then((result) => {
          setShippingOptions(result.options);
          setSelectedShippingOption((prev) => {
            const idToKeep = prev ? prev.id : 'pac';
            const matched = result.options.find((o) => o.id === idToKeep);
            return matched || result.options[0] || null;
          });
        })
        .catch(() => {
          // ignore background update error
        });
    }
  }, [freeShippingQualified, calculatedCep]);

  const effectiveShipping = selectedShippingOption ? selectedShippingOption.price : 0;
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
        shippingOptions,
        selectedShippingOption,
        setSelectedShippingOption,
        shippingDestination,
        shippingAddress,
        originAgency: CORREIOS_ORIGIN,
        isCalculatingShipping,
        calculateShipping,
        isCartOpen,
        setIsCartOpen,
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
