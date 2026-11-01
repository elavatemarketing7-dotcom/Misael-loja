import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Settings2, 
  Heart, 
  Flame, 
  Clock, 
  Menu, 
  X,
  Camera,
  Lock,
  UserCheck,
  MessageCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { JerseyCategory } from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const Header: React.FC = () => {
  const {
    cartItemCount,
    setIsCartOpen,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    wishlist,
    openProductEditor,
    isLojistaAuthenticated
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: JerseyCategory; label: string }[] = [
    { id: 'todos', label: 'Todos os Mantos' },
    { id: 'brasileirao', label: 'Brasileirão' },
    { id: 'europeus', label: 'Europeus' },
    { id: 'selecoes', label: 'Seleções' },
    { id: 'retro', label: 'Retrô' },
    { id: 'especiais', label: 'Especiais' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0e12]/95 backdrop-blur-md border-b border-white/10">
      {/* 1. Scarcity & Wholesale Announcement Bar - No Começo */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black py-1.5 sm:py-2 px-2 sm:px-4 text-[11px] sm:text-xs font-extrabold tracking-wide text-center shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-4 flex-wrap">
          {/* WhatsApp Callout no começo */}
          <a
            href={getWhatsAppUrl("Olá MN Store! Gostaria de fazer um pedido acima de 10 peças no atacado.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-black hover:bg-zinc-900 text-amber-300 hover:text-white px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-400/40 shrink-0"
          >
            <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Acima de 10 peças chamar no WhatsApp</span>
          </a>

          <span className="hidden md:inline font-bold text-black/60">·</span>

          <span className="flex items-center gap-1 font-display uppercase tracking-wider text-[11px] sm:text-sm font-black whitespace-nowrap">
            <Flame className="w-3.5 h-3.5 fill-black" />
            DE R$ 180 POR R$ 130
          </span>

          <span className="hidden md:inline font-bold text-black/60">·</span>
          <span className="hidden md:inline font-bold uppercase">PARCELAMENTO EM ATÉ 5X SEM JUROS</span>

          <span className="hidden sm:inline font-bold text-black/60">·</span>
          <span className="hidden sm:inline font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Frete Grátis acima de 2 peças
          </span>
        </div>
      </div>

      {/* 2. Main Top Bar - Adhering to the Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-15 sm:h-18 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand Wordmark with Crowned Lion Emblem */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveCategory('todos');
              setSearchQuery('');
            }}
            className="flex items-center gap-2 sm:gap-3 group text-left"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-black/60 border border-amber-500/40 p-0.5 shadow-lg shadow-amber-500/10 group-hover:border-amber-400 transition-colors shrink-0">
              <img
                src="/assets/aistudio/Emblema_Dourado_MN_Store_com_Leao_Encoroado_2ec60587.png"
                alt="MN Store Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-display font-black text-xl sm:text-2xl tracking-wider text-white flex items-center gap-1 leading-tight">
                MN <span className="text-gold-gradient">STORE</span>
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-amber-400/90 font-bold block -mt-0.5">
                Mantos & Camisas
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean Single-Line Typography) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveCategory(link.id);
                setSearchQuery('');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-400 ${
                activeCategory === link.id && !searchQuery
                  ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5'
                  : 'text-slate-300'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Search, Lojista Tool & Shopping Bag */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Search bar desktop */}
          <div className="relative hidden md:block w-48 lg:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar time ou liga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Botão Painel mnstore com acesso restrito por senha */}
          <button
            onClick={() => openProductEditor()}
            className="px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm active:scale-95"
            title="Acesso com login e senha: mnstore"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              Painel mnstore
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gold-gradient text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
            aria-label="Abrir Sacola"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black" />
            <span className="hidden sm:inline">Mantos</span>
            <span className="font-mono bg-black text-amber-400 px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] leading-none">
              {cartItemCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#121318] p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar camisa de time..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveCategory(link.id);
                  setSearchQuery('');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-lg text-left text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeCategory === link.id && !searchQuery
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-300 bg-white/5 hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
