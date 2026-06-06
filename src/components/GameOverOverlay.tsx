import React, { useEffect, useRef } from "react";

interface GameOverOverlayProps {
  onRestart: () => void;
  victory: boolean;
  paintsCollected: number;
  totalPaints: number;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  onRestart,
  victory,
  paintsCollected = 0,
  totalPaints = 0,
}) => {
  const victoryAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!victory) return;
    const audio = new Audio("/assets/vitoriapackcandino-BOqSYP0I.mp3");
    audio.volume = 0.8;
    victoryAudioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [victory]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200] bg-black/60">
      <div className="bg-gradient-to-br from-game-navy to-game-dark rounded-3xl text-center p-6 md:p-8 border-3 border-accent min-w-[250px] max-w-[90vw] shadow-2xl">
        {victory ? (
          <>
            <img
              src="/assets/candinho-vitoria-CfuzTwaO.jpg"
              alt="Candinho vitorioso"
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl mx-auto mb-4 border-2 border-accent shadow-lg"
            />
            <h2 className="text-accent font-display text-3xl md:text-4xl mb-3">🎨 VITÓRIA! 🎨</h2>
            <p className="text-accent/80 font-body text-base md:text-lg mb-2">
              Candinho pintou sua obra-prima!
            </p>
            <p className="text-accent/60 font-body text-sm">
              Tintas: {paintsCollected}/{totalPaints}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-game-red font-display text-3xl md:text-4xl mb-3">💀 GAME OVER 💀</h2>
            <p className="text-accent/80 font-body text-base md:text-lg">
              Você foi pego pelo monstro!
            </p>
          </>
        )}
        <button
          onClick={onRestart}
          className="mt-5 px-6 py-2.5 bg-game-green border-none rounded-full text-primary-foreground font-display text-base cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          TENTAR NOVAMENTE
        </button>
      </div>
    </div>
  );
};
