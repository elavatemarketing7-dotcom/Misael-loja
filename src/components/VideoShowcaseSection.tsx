import React, { useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  ArrowRight,
  Flame,
  BadgeCheck
} from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const VideoShowcaseSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className="relative py-12 sm:py-20 px-3 sm:px-6 bg-gradient-to-b from-[#0b0c0e] via-[#10121a] to-[#0b0c0e] border-y border-white/10 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Vídeo Real do Material em Mãos</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase text-white font-display tracking-tight leading-none">
            Veja a <span className="text-gold-gradient">Qualidade Real</span> do Manto
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Nada de fotos genéricas de internet. Assista ao vídeo gravado de perto para conferir a textura do tecido, o bordado dos escudos e todos os acabamentos oficiais.
          </p>
        </div>

        {/* Video & Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Column 1: The Phone Frame with Video (5 cols on lg) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px]">
              
              {/* Outer Glow Halo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-emerald-500/30 rounded-[3rem] blur-xl opacity-75 animate-pulse" />

              {/* Smartphone Display Frame */}
              <div className="relative bg-[#1a1c24] rounded-[2.8rem] p-3 sm:p-3.5 border-4 sm:border-[6px] border-[#2a2d3a] shadow-2xl shadow-black/80 ring-1 ring-amber-500/40">
                
                {/* Phone Speaker Notch / Dynamic Island */}
                <div className="absolute top-5 inset-x-0 mx-auto w-24 h-4 bg-black rounded-full z-20 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-zinc-700" />
                </div>

                {/* Inner Screen Bezel with 9:16 Video */}
                <div className="relative rounded-[2.2rem] overflow-hidden bg-black aspect-[9/16] group select-none">
                  
                  {/* Video Player */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover cursor-pointer"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    poster="/videos/qualidade-manto-poster.jpg"
                    onTimeUpdate={handleTimeUpdate}
                    onClick={togglePlay}
                  >
                    <source src="/videos/qualidade-manto-mnstore.mp4" type="video/mp4" />
                    <source src="https://i.imgur.com/UK5DVnG.mp4" type="video/mp4" />
                    Seu navegador não suporta a tag de vídeo.
                  </video>

                  {/* Top Video Status Overlay */}
                  <div className="absolute top-10 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Qualidade 1:1 Tailandesa
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[9px] font-mono text-slate-300 border border-white/10">
                      HD 1080p
                    </span>
                  </div>

                  {/* Center Play/Pause button on hover or when paused */}
                  <div 
                    onClick={togglePlay}
                    className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity cursor-pointer ${
                      isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full bg-amber-500/90 hover:bg-amber-400 text-black flex items-center justify-center shadow-xl transition-transform transform hover:scale-110 active:scale-95">
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-black" />
                      ) : (
                        <Play className="w-6 h-6 fill-black ml-1" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Video Controls Strip */}
                  <div className="absolute bottom-3 inset-x-3 z-10 flex flex-col gap-1.5">
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 transition-all duration-150"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Quick Control Icons */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                          }}
                          className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white transition-colors"
                          title={isPlaying ? 'Pausar' : 'Reproduzir'}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                          }}
                          className={`p-1.5 rounded-lg text-white transition-colors flex items-center gap-1 text-[10px] font-bold ${
                            isMuted 
                              ? 'bg-black/70 hover:bg-black/90 text-amber-300' 
                              : 'bg-amber-500 text-black'
                          }`}
                          title={isMuted ? 'Ativar som' : 'Desativar som'}
                        >
                          {isMuted ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Sem som</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Com som</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFullscreen();
                        }}
                        className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white transition-colors"
                        title="Tela Cheia"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Bottom Frame Chin */}
                <div className="mt-3 flex items-center justify-center">
                  <div className="w-28 h-1 bg-zinc-700/80 rounded-full" />
                </div>
              </div>

            </div>
          </div>

          {/* Column 2: Material Details & Value Proposition (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
                O que você está vendo no vídeo:
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
                Padrão Idêntico ao Oficial de Jogo
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                As camisas da MN Store possuem corte anatômico, tecido respirável e toque suave. São confeccionadas na Tailândia nos mesmos teares das versões originais de campo.
              </p>
            </div>

            {/* Checklist of Material Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#141620] border border-white/10 hover:border-amber-500/40 transition-colors space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tecido Tecnológico Dry-Fit</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
                  Microperfurações inteligentes que absorvem o suor e mantêm o corpo fresco mesmo em dias quentes.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#141620] border border-white/10 hover:border-amber-500/40 transition-colors space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bordados & Emblemas 3D</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
                  Costura milimétrica de alta definição. Escudos não desbotam e não soltam após as lavagens.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#141620] border border-white/10 hover:border-amber-500/40 transition-colors space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Etiquetas & Tags Oficiais</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
                  Selos termosselados, códigos internos de autenticidade e etiquetas com número de série.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#141620] border border-white/10 hover:border-amber-500/40 transition-colors space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Garantia de 7 Dias ou Troca</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
                  Se você não ficar 100% satisfeito com o material ao receber em casa, devolvemos seu dinheiro.
                </p>
              </div>

            </div>

            {/* Price Box & WhatsApp Direct Order */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#181a24] to-emerald-500/10 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                    Promoção Ativa
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs text-slate-400 line-through">De R$ 180</span>
                  <span className="text-2xl sm:text-3xl font-black text-gold-gradient font-mono">
                    R$ 130,00
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  Frete Grátis a partir de 3 camisas via Correios PAC
                </span>
              </div>

              <a
                href={getWhatsAppUrl("Olá MN Store! Vi o vídeo do material do manto no site e gostaria de encomendar a minha camisa na promoção de R$ 130!")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/50 hover:brightness-110 active:scale-98 transition-all shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-700 shrink-0" />
                <span>Pedir no WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
