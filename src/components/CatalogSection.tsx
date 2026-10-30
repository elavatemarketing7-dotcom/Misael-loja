import React, { useMemo, useState } from 'react';
import { 
  Filter, 
  Flame, 
  RotateCcw, 
  Sparkles, 
  MessageCircle,
  Camera,
  Lock,
  UserCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { JerseyCategory, JerseySize } from '../types';

export const CatalogSection: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    selectedSizeFilter,
    setSelectedSizeFilter,
    openProductEditor,
    isLojistaAuthenticated
  } = useShop();

  const [sortBy, setSortBy] = useState<'popular' | 'stock' | 'name'>('popular');

  const categories: { id: JerseyCategory; label: string; count: number }[] = [
    { id: 'todos', label: 'Todos os Mantos', count: products.length },
    { id: 'brasileirao', label: 'Brasileirão', count: products.filter((p) => p.category === 'brasileirao').length },
    { id: 'europeus', label: 'Europeus', count: products.filter((p) => p.category === 'europeus').length },
    { id: 'selecoes', label: 'Seleções', count: products.filter((p) => p.category === 'selecoes').length },
    { id: 'retro', label: 'Retrô Clássicas', count: products.filter((p) => p.category === 'retro').length },
    { id: 'especiais', label: 'Especiais MN', count: products.filter((p) => p.category === 'especiais').length }
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (activeCategory !== 'todos') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.league.toLowerCase().includes(q)
      );
    }

    // Filter by Size
    if (selectedSizeFilter) {
      list = list.filter((p) => p.availableSizes.includes(selectedSizeFilter));
    }

    // Sorting
    if (sortBy === 'popular') {
      list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    } else if (sortBy === 'stock') {
      list.sort((a, b) => a.stockCount - b.stockCount);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, activeCategory, searchQuery, selectedSizeFilter, sortBy]);

  return (
    <section id="catalogo-de-mantos" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* 1. Header & Scarcity Kicker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold font-display">
              Catálogo de Futebol 2024 / 2025
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              Preço único: De R$ 180 por R$ 120
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-display tracking-wide">
            ESCOLHA SEU MANTO SAGRADO
          </h2>

          <p className="text-xs text-slate-400 max-w-xl">
            Todos os modelos confeccionados em tecido tecnológico dry-fit. Selecione seu clube favorito e personalize com seu nome e número.
          </p>
        </div>

        {/* Lojista Quick Edit trigger with authentication */}
        <button
          onClick={() => openProductEditor()}
          className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start md:self-auto transition-colors"
          title={isLojistaAuthenticated ? 'Painel conectado como mnstore' : 'Acesso Restrito: Painel do Lojista'}
        >
          {isLojistaAuthenticated ? (
            <UserCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <Lock className="w-4 h-4 text-amber-400" />
          )}
          <span>{isLojistaAuthenticated ? 'Trocar Fotos (mnstore)' : 'Trocar Fotos dos Mantos'}</span>
        </button>
      </div>

      {/* 2. Filter Bar: Categories + Size Filter + Sort */}
      <div className="space-y-4">
        {/* Category Tabs (Segmented Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id && !searchQuery;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-[#151720] text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row: Sizes + Sorting + Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#121319] border border-white/10">
          {/* Sizes */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
              Filtrar Tamanho:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedSizeFilter(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  selectedSizeFilter === null
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              {(['P', 'M', 'G', 'GG', 'XGG'] as JerseySize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    setSelectedSizeFilter(selectedSizeFilter === size ? null : size)
                  }
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors ${
                    selectedSizeFilter === size
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
              Ordenar por:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-[#1a1c26] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="popular">Mais Populares / Mais Vendidos</option>
              <option value="stock">Menor Estoque (Urgência)</option>
              <option value="name">Nome do Time (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Search indicator */}
        {searchQuery && (
          <div className="flex items-center justify-between text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/10">
            <span>
              Exibindo resultados para busca: <strong className="text-amber-400">"{searchQuery}"</strong> ({filteredProducts.length} mantos encontrados)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Limpar busca
            </button>
          </div>
        )}
      </div>

      {/* 3. Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-2xl bg-[#14151e] border border-white/10 p-8">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-amber-400">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-display uppercase">
            Nenhum manto encontrado
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Não encontramos camisas com esses filtros. Experimente buscar por outro time ou limpar os filtros.
          </p>
          <button
            onClick={() => {
              setActiveCategory('todos');
              setSelectedSizeFilter(null);
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Ver Todos os Mantos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* 4. Custom Request Callout Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171824] via-[#1c1e2e] to-[#171824] border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 justify-center md:justify-start">
            <Sparkles className="w-4 h-4" />
            Não encontrou o manto do seu time do coração?
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white font-display uppercase">
            NÓS ENCOMENDAMOS QUALQUER CAMISA DO MUNDO PARA VOCÊ POR R$ 120!
          </h3>
          <p className="text-xs text-slate-400">
            Trabalhamos com mais de 500 modelos de clubes do Brasil, Europa, Ásia e seleções históricas.
          </p>
        </div>

        <a
          href="https://wa.me/5511999999999?text=Ol%C3%A1%20MN%20Store!%20Gostaria%20de%20encomendar%20um%20manto%20espec%C3%ADfico%20na%20promo%C3%A7%C3%A3o%20de%20R$%20120."
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-colors shadow-lg shadow-emerald-600/20"
        >
          <MessageCircle className="w-4 h-4" />
          Pedir Encomenda no WhatsApp
        </a>
      </div>
    </section>
  );
};
