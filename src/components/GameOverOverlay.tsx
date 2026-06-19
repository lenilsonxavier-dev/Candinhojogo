import React, { useEffect, useRef } from "react";
import { getAssetPath } from "../types";

export interface RankInfo {
  title: string;
  emoji: string;
  description: string;
  color: string;
  badgeBg: string;
}

export function getRankInfo(score: number): RankInfo {
  if (score >= 2000) {
    return {
      title: "Mestre Portinari",
      emoji: "🏆",
      description: "Incrível! Você se tornou um verdadeiro mestre das artes, assim como Candido Portinari! 🎨🎖️",
      color: "text-amber-300 font-extrabold",
      badgeBg: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-amber-300 text-white shadow-yellow-500/30",
    };
  } else if (score >= 1000) {
    return {
      title: "Explorador da Criatividade",
      emoji: "🌈",
      description: "Espetacular! Você explorou o mundo das cores e desbloqueou muita criatividade! 🎨✨",
      color: "text-sky-300 font-extrabold",
      badgeBg: "bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 border-indigo-300 text-white shadow-indigo-500/30",
    };
  } else if (score >= 500) {
    return {
      title: "Pequeno Artista",
      emoji: "🖌️",
      description: "Parabéns! Suas pinceladas já estão enchendo de alegria todas as telas! 🎨💖",
      color: "text-emerald-300 font-extrabold",
      badgeBg: "bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-300 text-white shadow-emerald-500/30",
    };
  } else {
    return {
      title: "Aprendiz das Cores",
      emoji: "🎨",
      description: "Muito bem! Você deu seus primeiros passos no maravilhoso mundo das artes! 🌟🖌️",
      color: "text-pink-300 font-extrabold",
      badgeBg: "bg-gradient-to-r from-pink-500 to-rose-600 border-pink-300 text-white shadow-rose-500/30",
    };
  }
}

interface GameOverOverlayProps {
  onRestart: () => void;
  victory: boolean;
  paintsCollected: number;
  totalPaints: number;
  childName: string;
  score: number;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  onRestart,
  victory,
  paintsCollected = 0,
  totalPaints = 0,
  childName = "Artista",
  score = 0,
}) => {
  const victoryAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!victory) return;
    const audio = new Audio(getAssetPath("assets/vitoriapackcandino-BOqSYP0I.mp3"));
    audio.volume = 0.8;
    victoryAudioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [victory]);

  const rank = getRankInfo(score);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200] bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="bg-gradient-to-br from-game-navy to-[#0b0b1f] rounded-3xl text-center p-6 md:p-8 border-3 border-accent/60 max-w-[500px] w-full shadow-2xl flex flex-col items-center">
        {victory ? (
          <>
            <img
              src="https://i.imgur.com/rpoxun5.jpg"
              alt="Candinho vitorioso"
              className="w-40 h-40 md:w-52 md:h-52 object-cover rounded-2xl mx-auto mb-4 border-2 border-accent shadow-lg"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-accent font-display text-2xl md:text-3xl mb-1 uppercase font-black tracking-tight drop-shadow-md">
              🎨 VITÓRIA INCRÍVEL! 🎨
            </h2>
            <p className="text-accent/80 font-body text-sm md:text-base mb-4 font-bold">
              Você completou a jornada das telas!
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-3 animate-bounce">💀</div>
            <h2 className="text-red-500 font-display text-2xl md:text-3xl mb-1 uppercase font-black">
              FIM DE JOGO
            </h2>
            <p className="text-accent/70 font-body text-sm md:text-base mb-4">
              Mas todo artista pode tentar de novo!
            </p>
          </>
        )}

        {/* 🏆 KID RANKING & STATS CARD 🏆 */}
        <div className="w-full bg-black/40 rounded-2xl p-4 md:p-5 border border-accent/20 mb-4 flex flex-col items-center gap-3">
          
          <div className="flex flex-col items-center">
            <span className="text-accent/60 text-[10px] md:text-xs tracking-widest uppercase font-mono">🎨 ARTISTA REGISTRADO</span>
            <span className="text-white text-lg md:text-2xl font-display font-black tracking-wide truncate max-w-xs uppercase mt-0.5">
              🌟 {childName} 🌟
            </span>
          </div>

          <div className="w-full flex justify-around items-center border-y border-accent/15 py-2">
            <div className="flex flex-col items-center">
              <span className="text-accent/50 text-[9px] md:text-[10px] font-mono tracking-wider">PONTUAÇÃO</span>
              <span className="text-white font-sans text-lg md:text-xl font-black">{score} pts</span>
            </div>
            <div className="w-px h-8 bg-accent/15" />
            <div className="flex flex-col items-center">
              <span className="text-accent/50 text-[9px] md:text-[10px] font-mono tracking-wider">TINTAS COLHIDAS</span>
              <span className="text-white font-sans text-lg md:text-xl font-black">{paintsCollected}</span>
            </div>
          </div>

          {/* Golden/Colorful Badge Rank */}
          <div className={`w-full flex flex-col items-center p-3 rounded-xl border-2 ${rank.badgeBg} transition-all duration-300`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl">{rank.emoji}</span>
              <span className="text-sm md:text-lg font-display font-black tracking-wide uppercase drop-shadow-md">
                {rank.title}
              </span>
              <span className="text-2xl md:text-3xl">{rank.emoji}</span>
            </div>
            <p className="text-[11px] md:text-xs text-white/90 font-medium text-center mt-1 leading-snug px-1">
              {rank.description}
            </p>
          </div>

        </div>

        <button
          onClick={onRestart}
          className="w-full max-w-sm px-6 py-3.5 bg-game-green hover:bg-game-green/90 border-none rounded-full text-primary-foreground font-display text-base md:text-lg font-extrabold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg active:bg-game-green/80 uppercase tracking-wider"
        >
          {victory ? "JOGAR NOVAMENTE 🌈" : "CONFIRMAR E RECOMEÇAR 🔄"}
        </button>
      </div>
    </div>
  );
};
