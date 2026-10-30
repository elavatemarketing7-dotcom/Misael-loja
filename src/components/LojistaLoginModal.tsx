import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const LojistaLoginModal: React.FC = () => {
  const { isLojistaLoginOpen, setIsLojistaLoginOpen, loginLojista } = useShop();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLojistaLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = loginLojista(username, password);
      setIsLoading(false);

      if (!result.success) {
        setErrorMessage(result.message);
      } else {
        setUsername('');
        setPassword('');
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#121319] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with MN Store Crowned Lion Brand */}
        <div className="relative p-6 border-b border-white/10 bg-gradient-to-b from-[#181a24] to-[#121319] text-center">
          <button
            onClick={() => {
              setErrorMessage('');
              setIsLojistaLoginOpen(false);
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo Badge */}
          <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border-2 border-amber-500/40 p-0.5 shadow-xl shadow-amber-500/10 bg-black/60">
            <img
              src="/assets/aistudio/Emblema_Dourado_MN_Store_com_Leao_Encoroado_2ec60587.png"
              alt="MN Store"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            Acesso Restrito: Painel mnstore
          </div>

          <h3 className="font-display font-black text-2xl text-white uppercase tracking-wider">
            Painel MNSTORE
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Área protegida por senha. Digite o login e senha de lojista para gerenciar fotos, preços e mantos.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Info hint */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-[11px] text-slate-300">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Login de administrador: <strong>mnstore</strong></span>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Login:
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Digite: mnstore"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#181a24] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Senha:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Digite a senha (Misael@123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-[#181a24] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors p-1"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verificando credenciais...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 fill-black" />
                  <span>Acessar Painel mnstore</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2 border-t border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Acesso restrito ao lojista da MN Store</span>
          </div>
        </form>
      </div>
    </div>
  );
};
