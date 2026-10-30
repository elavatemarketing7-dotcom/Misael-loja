import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Clock, 
  Camera, 
  Sparkles,
  Zap,
  Check
} from 'lucide-react';
import { Product, JerseySize } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    setSelectedProductDetail,
    addToCart,
    wishlist,
    toggleWishlist,
    openProductEditor
  } = useShop();

  const [selectedQuickSize, setSelectedQuickSize] = useState<JerseySize>('M');
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = wishlist.includes(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(
      product,
      selectedQuickSize,
      'torcedor',
      { enabled: false, name: '', number: '', patch: 'nenhum' },
      1
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div 
      onClick={() => setSelectedProductDetail(product)}
      className="group relative bg-[#13151b] border border-white/10 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1"
    >
      {/* 1. Image Container (takes 65-70% height) */}
      <div className="relative aspect-[4/3] bg-[#181a24] overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* High-impact sports fallback with club branding */
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-transform duration-500 group-hover:scale-102"
            style={{
              background: `linear-gradient(135deg, #181a24 0%, ${product.fallbackColor}30 100%)`
            }}
          >
            <div 
              className="w-16 h-16 rounded-full border border-amber-400/40 flex items-center justify-center mb-2 shadow-md shadow-black/50"
              style={{ backgroundColor: `${product.fallbackColor}60` }}
            >
              <span className="font-display font-black text-xl text-amber-300 tracking-wider">
                {product.team.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <span className="font-bold text-white text-sm font-display uppercase tracking-wide">
              {product.team}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Manto Oficial {product.season}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openProductEditor(product);
              }}
              className="mt-3 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Camera className="w-3 h-3" />
              Editar Foto
            </button>
          </div>
        )}

        {/* Dynamic Scarcity Tag: DE / POR */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.originalPrice > product.promoPrice && (
            <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider shadow">
              {Math.round(((product.originalPrice - product.promoPrice) / product.originalPrice) * 100)}% OFF
            </span>
          )}
          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-amber-400 font-bold text-[10px] font-mono border border-amber-500/30">
            DE {product.originalPrice} POR {product.promoPrice}
          </span>
        </div>

        {/* Favorite & Quick Edit Actions */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openProductEditor(product);
            }}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-amber-400 border border-white/10 transition-colors opacity-90 hover:opacity-100"
            title="Trocar Foto deste Manto"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-slate-300 hover:text-rose-500 border border-white/10 transition-colors"
            title="Favoritar"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Stock Urgency Strip */}
        <div className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-xs py-1 px-3 flex items-center justify-between text-[10px] text-amber-300">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-rose-400" />
            Restam apenas <strong className="text-white font-mono">{product.stockCount}</strong> unidades!
          </span>
          <span className="text-amber-400 font-semibold flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5" />
            Personalizável
          </span>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 truncate">
            {product.league} · {product.team}
          </div>
          <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors font-display tracking-wide uppercase">
            {product.name}
          </h3>
        </div>

        {/* Pricing Block strictly adhering to user instructions */}
        <div className="space-y-1 pt-1 border-t border-white/5">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-500 line-through font-mono">
              R$ {product.originalPrice},00
            </span>
            <span className="text-xl font-black text-white font-display tracking-wide text-gold-gradient">
              R$ {product.promoPrice},00
            </span>
          </div>
          <div className="flex flex-col gap-0.5 text-[11px]">
            <span className="text-slate-300 font-medium">
              em até <strong className="text-amber-400">5x de R$ {(product.promoPrice / 5).toFixed(2)} sem juros</strong>
            </span>
            <span className="text-[10px] text-slate-400">
              ou à vista via PIX por R$ {product.promoPrice},00
            </span>
          </div>
        </div>

        {/* Quick Sizes & Actions */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          {/* Quick size selection chips */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Tamanhos:</span>
            <div className="flex items-center gap-1">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuickSize(size);
                  }}
                  className={`w-6 h-6 rounded text-[10px] font-mono font-bold transition-colors ${
                    selectedQuickSize === size
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gold-gradient text-black hover:brightness-110 active:scale-95 shadow-md shadow-amber-500/15'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  Garantido!
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  Comprar por R$ {product.promoPrice}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProductDetail(product);
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Personalizar nome e número"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
