import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  RotateCcw, 
  Check, 
  Sparkles, 
  LogOut, 
  UserCheck, 
  Trash2, 
  PlusCircle, 
  Edit3,
  Shirt,
  DollarSign,
  TrendingDown,
  Eye,
  Loader2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, JerseyCategory } from '../types';
import { compressImage } from '../utils/imageCompressor';

export const ProductEditorModal: React.FC = () => {
  const {
    isLojistaModalOpen,
    setIsLojistaModalOpen,
    isLojistaAuthenticated,
    logoutLojista,
    products,
    editingProduct,
    setEditingProduct,
    updateProduct,
    addProduct,
    removeProduct,
    resetProductsToDefault,
    showToast
  } = useShop();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);

  // Tab: 'edit' or 'create'
  const [activeTab, setActiveTab] = useState<'edit' | 'create'>('edit');
  const [createdProductSuccess, setCreatedProductSuccess] = useState<Product | null>(null);
  const [isCompressingImage, setIsCompressingImage] = useState(false);

  // Edit fields
  const [selectedId, setSelectedId] = useState<string>('');
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [league, setLeague] = useState('');
  const [category, setCategory] = useState<JerseyCategory>('brasileirao');
  const [imageUrl, setImageUrl] = useState('');
  const [originalPrice, setOriginalPrice] = useState<number>(180);
  const [promoPrice, setPromoPrice] = useState<number>(130);
  const [stockCount, setStockCount] = useState(3);
  const [description, setDescription] = useState('');
  const [season, setSeason] = useState('2024/2025');
  const [fallbackColor, setFallbackColor] = useState('#111111');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New product fields
  const [newName, setNewName] = useState('');
  const [newTeam, setNewTeam] = useState('');
  const [newLeague, setNewLeague] = useState('');
  const [newCategory, setNewCategory] = useState<JerseyCategory>('brasileirao');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(180);
  const [newPromoPrice, setNewPromoPrice] = useState<number>(130);
  const [newStockCount, setNewStockCount] = useState(3);
  const [newDescription, setNewDescription] = useState('');
  const [newSeason, setNewSeason] = useState('2024/2025');
  const [newFallbackColor, setNewFallbackColor] = useState('#1e202c');

  useEffect(() => {
    if (products.length === 0) {
      setActiveTab('create');
      return;
    }
    const current = editingProduct || products[0];
    if (current) {
      setSelectedId(current.id);
      setName(current.name);
      setTeam(current.team);
      setLeague(current.league);
      setCategory(current.category);
      setImageUrl(current.image || '');
      setOriginalPrice(current.originalPrice || 180);
      setPromoPrice(current.promoPrice || 130);
      setStockCount(current.stockCount);
      setDescription(current.description);
      setSeason(current.season || '2024/2025');
      setFallbackColor(current.fallbackColor || '#111111');
    }
  }, [editingProduct, products]);

  const handleSelectProduct = (id: string) => {
    setSelectedId(id);
    setDeleteConfirmId(null);
    const found = products.find((p) => p.id === id);
    if (found) {
      setEditingProduct(found);
      setName(found.name);
      setTeam(found.team);
      setLeague(found.league);
      setCategory(found.category);
      setImageUrl(found.image || '');
      setOriginalPrice(found.originalPrice || 180);
      setPromoPrice(found.promoPrice || 130);
      setStockCount(found.stockCount);
      setDescription(found.description);
      setSeason(found.season || '2024/2025');
      setFallbackColor(found.fallbackColor || '#111111');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNew = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingImage(true);
    try {
      const compressedDataUrl = await compressImage(file, 960, 960, 0.82);
      if (isNew) {
        setNewImageUrl(compressedDataUrl);
      } else {
        setImageUrl(compressedDataUrl);
      }
      showToast('Foto do manto carregada e otimizada!');
    } catch (err: unknown) {
      console.warn('Fallback para leitor padrão:', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (isNew) {
            setNewImageUrl(reader.result);
          } else {
            setImageUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressingImage(false);
      e.target.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;

    updateProduct(selectedId, {
      name,
      team,
      league,
      category,
      image: imageUrl,
      originalPrice: Number(originalPrice) || 180,
      promoPrice: Number(promoPrice) || 130,
      stockCount: Number(stockCount),
      description,
      season,
      fallbackColor
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTeam = newTeam.trim();
    const cleanName = newName.trim();

    if (!cleanTeam && !cleanName) {
      showToast('Por favor, informe pelo menos o Nome da Camisa e o Clube.');
      return;
    }

    const finalTeam = cleanTeam || cleanName;
    const finalName = cleanName || `Camisa Oficial ${finalTeam}`;

    const created = addProduct({
      name: finalName,
      team: finalTeam,
      league: newLeague.trim() || 'Campeonato Oficial',
      category: newCategory,
      originalPrice: Number(newOriginalPrice) || 180,
      promoPrice: Number(newPromoPrice) || 130,
      image: newImageUrl.trim(),
      fallbackColor: newFallbackColor,
      stockCount: Number(newStockCount) || 3,
      availableSizes: ['P', 'M', 'G', 'GG'],
      isFeatured: true,
      isBestseller: true,
      description:
        newDescription.trim() ||
        `Manto oficial ${finalTeam} temporada ${newSeason.trim() || '2024/2025'}. Confeccionado em tecido tecnológico dry-fit respirável.`,
      season: newSeason.trim() || '2024/2025'
    });

    // Populate the edit form fields directly with the created product so there's zero desync
    setSelectedId(created.id);
    setName(created.name);
    setTeam(created.team);
    setLeague(created.league);
    setCategory(created.category);
    setImageUrl(created.image || '');
    setOriginalPrice(created.originalPrice);
    setPromoPrice(created.promoPrice);
    setStockCount(created.stockCount);
    setDescription(created.description);
    setSeason(created.season);
    setFallbackColor(created.fallbackColor || '#111111');

    // Show celebration banner in modal
    setCreatedProductSuccess(created);

    // Reset new form
    setNewName('');
    setNewTeam('');
    setNewLeague('');
    setNewImageUrl('');
    setNewDescription('');
    setNewOriginalPrice(180);
    setNewPromoPrice(130);
  };

  const handleDeleteCurrentProduct = () => {
    if (!selectedId) return;
    removeProduct(selectedId);
    setDeleteConfirmId(null);

    // Select another product
    const remaining = products.filter((p) => p.id !== selectedId);
    if (remaining.length > 0) {
      handleSelectProduct(remaining[0].id);
    } else {
      setSelectedId('');
      setName('');
      setImageUrl('');
    }
  };

  // Price calculators for preview
  const editDiscount = originalPrice > promoPrice
    ? Math.round(((originalPrice - promoPrice) / originalPrice) * 100)
    : 0;

  const newDiscount = newOriginalPrice > newPromoPrice
    ? Math.round(((newOriginalPrice - newPromoPrice) / newOriginalPrice) * 100)
    : 0;

  const handleCloseModal = () => {
    setIsLojistaModalOpen(false);
    logoutLojista();
  };

  if (!isLojistaModalOpen || !isLojistaAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#111216] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161820]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider font-display">
                  Painel mnstore: Gerenciar Mantos & Preços
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  mnstore
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Diversifique os valores de cada camisa (ex: De 180 por 130, De 200 por 160), adicione ou remova mantos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCloseModal}
              className="px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 border border-rose-500/20 transition-colors flex items-center gap-1 font-semibold"
              title="Encerrar sessão e bloquear painel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bloquear / Sair</span>
            </button>
            <button
              onClick={handleCloseModal}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-white/10 bg-[#13141a] px-6">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`py-3 px-4 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'edit'
                ? 'border-amber-400 text-amber-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Editar Fotos & Preços dos Mantos ({products.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`py-3 px-4 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'create'
                ? 'border-amber-400 text-amber-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Cadastrar Nova Camisa com Preços</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'edit' ? (
            /* ================= TAB 1: EDIT EXISTING ================= */
            <form onSubmit={handleSave} className="space-y-6">
              {products.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <Shirt className="w-12 h-12 text-slate-500 mx-auto" />
                  <h4 className="text-white font-bold text-base font-display uppercase">
                    Nenhum manto cadastrado
                  </h4>
                  <p className="text-xs text-slate-400">
                    Você removeu todas as camisas do catálogo. Clique na aba "+ Cadastrar Nova Camisa" para cadastrar novas camisas.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider"
                  >
                    + Cadastrar Primeira Camisa
                  </button>
                </div>
              ) : (
                <>
                  {/* Product selector dropdown & Delete Action */}
                  <div className="space-y-1.5 p-4 rounded-xl bg-[#161822] border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Selecione o Manto para Editar ou Remover:
                      </label>

                      {/* Remove Button */}
                      {deleteConfirmId === selectedId ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-rose-300 font-semibold">
                            Confirmar exclusão?
                          </span>
                          <button
                            type="button"
                            onClick={handleDeleteCurrentProduct}
                            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase transition-colors"
                          >
                            Sim, Excluir
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded bg-white/10 text-slate-300 hover:text-white text-xs transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(selectedId)}
                          className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                          title="Remover esta camisa do catálogo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remover Esta Camisa</span>
                        </button>
                      )}
                    </div>

                    <select
                      value={selectedId}
                      onChange={(e) => handleSelectProduct(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1b1d25] border border-white/15 text-white focus:outline-none focus:border-amber-500 text-sm"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.team} - {p.name} (De R$ {p.originalPrice} por R$ {p.promoPrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PRICING DIVERSIFICATION SECTION (NEW) */}
                  <div className="p-4 rounded-xl bg-[#161822] border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
                          Configurar Preços & Promoção Deste Manto
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {editDiscount > 0 ? `${editDiscount}% de desconto aplicado` : 'Sem desconto'}
                      </span>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                      <span className="text-[11px] text-slate-400 shrink-0">Predefinições rápidas:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setOriginalPrice(180);
                          setPromoPrice(130);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 shrink-0 transition-colors"
                      >
                        De 180 por 130 (28% OFF)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOriginalPrice(200);
                          setPromoPrice(160);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 shrink-0 transition-colors"
                      >
                        De 200 por 160 (20% OFF)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOriginalPrice(220);
                          setPromoPrice(170);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 shrink-0 transition-colors"
                      >
                        De 220 por 170 (23% OFF)
                      </button>
                    </div>

                    {/* Custom price inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                          <span>Preço "De" (Valor Original / Riscado):</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">R$</span>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="180"
                            value={originalPrice}
                            onChange={(e) => setOriginalPrice(Number(e.target.value))}
                            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#111216] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Preço "Por" (Valor Promocional de Venda) *:</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs text-amber-400 font-bold">R$</span>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="130"
                            value={promoPrice}
                            onChange={(e) => setPromoPrice(Number(e.target.value))}
                            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#111216] border border-amber-500/50 text-amber-300 font-mono text-sm font-bold focus:outline-none focus:border-amber-400"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic preview summary */}
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-300">
                        O cliente verá: <strong className="line-through text-slate-500">De R$ {originalPrice},00</strong> por <strong className="text-amber-400 text-sm">R$ {promoPrice},00</strong>
                      </span>
                      <span className="text-emerald-400 font-mono font-semibold">
                        PIX: R$ {(promoPrice * 0.95).toFixed(2)} (-5%)
                      </span>
                    </div>
                  </div>

                  {/* Image Upload Area */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Live Preview Box */}
                    <div className="md:col-span-5 space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Foto Atual da Camisa:
                      </label>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-[#161820] flex items-center justify-center group shadow-inner">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-10 h-10 text-amber-400/50 mx-auto mb-2" />
                            <span className="text-xs text-slate-400 block font-medium">Nenhuma foto enviada ainda</span>
                            <span className="text-[11px] text-slate-500">Exibindo mockup nas cores do clube</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] text-amber-400 font-mono">
                          R$ {promoPrice},00
                        </div>
                      </div>

                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="w-full py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 rounded-lg transition-colors"
                        >
                          Remover foto atual
                        </button>
                      )}
                    </div>

                    {/* Upload Options */}
                    <div className="md:col-span-7 space-y-4">
                      {/* File upload from device */}
                      <div className="p-4 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/[0.03] text-center space-y-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, false)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={isCompressingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 mx-auto transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
                        >
                          {isCompressingImage ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Otimizando foto...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              Enviar Foto do Computador / Celular
                            </>
                          )}
                        </button>
                        <p className="text-[11px] text-slate-400">
                          Formatos aceitos: JPG, PNG, WEBP (foto de estúdio da camisa)
                        </p>
                      </div>

                      {/* Or URL input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          Ou cole o link (URL) direto de uma foto:
                        </label>
                        <input
                          type="url"
                          placeholder="https://exemplo.com/camisa-manto.jpg"
                          value={imageUrl.startsWith('data:') ? '' : imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Details input grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Nome da Camisa *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Time / Clube *</label>
                      <input
                        type="text"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Categoria</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as JerseyCategory)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="brasileirao">Brasileirão</option>
                        <option value="europeus">Europeus</option>
                        <option value="selecoes">Seleções</option>
                        <option value="retro">Retrô Clássicas</option>
                        <option value="especiais">Especiais / Black Edition</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Liga / Competição</label>
                      <input
                        type="text"
                        value={league}
                        onChange={(e) => setLeague(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Unidades no Estoque (Gera Escassez):
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={stockCount}
                        onChange={(e) => setStockCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Temporada / Ano</label>
                      <input
                        type="text"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Descrição do Manto</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={resetProductsToDefault}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restaurar Catálogo Original
                    </button>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-5 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors flex-1 sm:flex-initial"
                      >
                        Fechar e Bloquear
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 flex-1 sm:flex-initial"
                      >
                        {savedSuccess ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-950" />
                            Salvo com Sucesso!
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Salvar Alterações
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>
          ) : (
            /* ================= TAB 2: ADD NEW JERSEY WITH PRICES ================= */
            <form onSubmit={handleCreateProduct} className="space-y-6 animate-in fade-in duration-150">
              {/* Celebration Success Banner when shirt is created */}
              {createdProductSuccess && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-[#141620] to-emerald-950/60 border-2 border-emerald-500/60 shadow-xl space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold shrink-0 shadow-lg">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider">
                          Salvo no Catálogo
                        </span>
                        <span className="text-xs text-amber-400 font-mono font-bold">
                          R$ {createdProductSuccess.promoPrice},00
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base uppercase tracking-wide font-display mt-0.5">
                        {createdProductSuccess.name}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Este manto sagrado foi salvo e já está aparecendo no topo do catálogo da loja!
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLojistaModalOpen(false);
                        const el = document.getElementById('catalogo-de-mantos');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver Manto no Catálogo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCreatedProductSuccess(null);
                        setActiveTab('edit');
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Editar Detalhes Desta Camisa
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreatedProductSuccess(null)}
                      className="px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      Dispensar aviso
                    </button>
                  </div>
                </div>
              )}

              {/* Header Box */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-200 space-y-1">
                <span className="font-bold text-amber-400 uppercase tracking-wider block font-display text-sm">
                  Cadastrar Novo Manto com Preços Personalizados
                </span>
                <p className="text-slate-300">
                  Defina o valor original "De" e o valor promocional "Por" para criar escassez e descontos reais para cada modelo.
                </p>
              </div>

              {/* PRICING INPUTS FOR NEW JERSEY (NEW) */}
              <div className="p-4 rounded-xl bg-[#161822] border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
                      Preços & Desconto do Novo Manto
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {newDiscount > 0 ? `${newDiscount}% de desconto` : 'Sem desconto'}
                  </span>
                </div>

                {/* Presets */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] text-slate-400 shrink-0">Sugestões rápidas:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewOriginalPrice(180);
                      setNewPromoPrice(130);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 shrink-0 transition-colors"
                  >
                    De 180 por 130 (28% OFF)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewOriginalPrice(200);
                      setNewPromoPrice(160);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 shrink-0 transition-colors"
                  >
                    De 200 por 160 (20% OFF)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewOriginalPrice(220);
                      setNewPromoPrice(170);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 shrink-0 transition-colors"
                  >
                    De 220 por 170 (23% OFF)
                  </button>
                </div>

                {/* Custom price inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Preço "De" (Valor Riscado / Normal):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">R$</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="180"
                        value={newOriginalPrice}
                        onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#111216] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preço "Por" (Valor Promocional de Venda) *:</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-amber-400 font-bold">R$</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="130"
                        value={newPromoPrice}
                        onChange={(e) => setNewPromoPrice(Number(e.target.value))}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#111216] border border-amber-500/50 text-amber-300 font-mono text-sm font-bold focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-300">
                    Na loja aparecerá: <strong className="line-through text-slate-500">De R$ {newOriginalPrice},00</strong> por <strong className="text-amber-400 text-sm">R$ {newPromoPrice},00</strong>
                  </span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    PIX: R$ {(newPromoPrice * 0.95).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Upload image for new product */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Foto do Novo Manto:
                  </label>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-[#161820] flex items-center justify-center group shadow-inner">
                    {newImageUrl ? (
                      <img
                        src={newImageUrl}
                        alt="Preview Novo Manto"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="w-10 h-10 text-amber-400/50 mx-auto mb-2" />
                        <span className="text-xs text-slate-400 block font-medium">
                          {newTeam || 'Novo Manto'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Envie uma foto ou deixe para editar depois
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] text-amber-400 font-mono">
                      R$ {newPromoPrice},00
                    </div>
                  </div>

                  {newImageUrl && (
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('')}
                      className="w-full py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 rounded-lg transition-colors"
                    >
                      Remover foto
                    </button>
                  )}
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="p-4 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/[0.03] text-center space-y-2">
                    <input
                      type="file"
                      ref={newFileInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isCompressingImage}
                      onClick={() => newFileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 mx-auto transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
                    >
                      {isCompressingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Otimizando foto...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Enviar Foto do Celular / Computador
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400">
                      Formatos aceitos: JPG, PNG, WEBP
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Ou link (URL) da imagem:
                    </label>
                    <input
                      type="url"
                      placeholder="https://exemplo.com/camisa.jpg"
                      value={newImageUrl.startsWith('data:') ? '' : newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form fields for new item */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Nome Completo da Camisa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Camisa Chelsea I 24/25 Blue Lion"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Nome do Time / Clube *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Chelsea"
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as JerseyCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="brasileirao">Brasileirão</option>
                    <option value="europeus">Europeus</option>
                    <option value="selecoes">Seleções</option>
                    <option value="retro">Retrô Clássicas</option>
                    <option value="especiais">Especiais / Black Edition</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Liga / Competição</label>
                  <input
                    type="text"
                    placeholder="Ex: Premier League / Champions"
                    value={newLeague}
                    onChange={(e) => setNewLeague(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Estoque Inicial Promocional:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={newStockCount}
                    onChange={(e) => setNewStockCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Temporada / Ano</label>
                  <input
                    type="text"
                    placeholder="2024/2025"
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Descrição do Manto</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Manto oficial com tecnologia dry-fit respirável e acabamento esportivo de alta qualidade..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1b1d25] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className="px-5 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gold-gradient text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all"
                >
                  <PlusCircle className="w-4 h-4 fill-black text-amber-400" />
                  Cadastrar Camisa por R$ {newPromoPrice},00
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
