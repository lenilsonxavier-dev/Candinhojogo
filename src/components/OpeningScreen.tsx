import React, { useEffect, useRef, useState } from "react";
import { getAssetPath, getLeaderboard, LeaderboardEntry } from "../types";

interface OpeningScreenProps {
  onStart: (name: string) => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [childName, setChildName] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [leaderboard] = useState<LeaderboardEntry[]>(() => getLeaderboard());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;

    // Preload sprites
    const candinhoImg = new Image();
    candinhoImg.crossOrigin = "anonymous";
    candinhoImg.src = "https://i.imgur.com/63Woy0z.png";

    const monsterImg = new Image();
    monsterImg.crossOrigin = "anonymous";
    monsterImg.src = "https://i.imgur.com/21iZsMM.png";

    const bucketColors = ["#ff4081", "#ffd54f", "#4fc3f7", "#ba68c8", "#ff5722"];

    let width = 800;
    let height = 240;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Floor and state entities
    const groundY = height - 50;

    const player = {
      x: 180,
      y: groundY - 90,
      width: 75,
      height: 90,
      vy: 0,
      onGround: true,
    };

    const monster = {
      x: 40,
      y: groundY - 55,
      width: 55,
      height: 55,
    };

    const obstacle = {
      x: width + 100,
      y: groundY - 30,
      width: 20,
      height: 30,
      color: "#ffeb3b",
    };

    // Splash Particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      life: number;
    }> = [];

    const spawnSplash = (x: number, y: number, color?: string) => {
      const pColor = color || bucketColors[Math.floor(Math.random() * bucketColors.length)];
      for (let i = 0; i < 4; i++) {
        particles.push({
          x,
          y,
          vx: -Math.random() * 4 - 0.5,
          vy: -Math.random() * 3 - 0.5,
          size: Math.random() * 6 + 3,
          color: pColor,
          alpha: 1,
          life: 25,
        });
      }
    };

    let tick = 0;

    const runLoop = () => {
      tick++;

      // Draw sky backdrop gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#121235");
      skyGrad.addColorStop(1, "#070716");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw stylized twilight hills
      ctx.fillStyle = "#1e1e44";
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.quadraticCurveTo(width * 0.3, groundY - 70, width * 0.65, groundY - 20);
      ctx.quadraticCurveTo(width * 0.85, groundY - 60, width, groundY);
      ctx.closePath();
      ctx.fill();

      // Floor line
      const floorGrad = ctx.createLinearGradient(0, groundY, 0, height);
      floorGrad.addColorStop(0, "#2c7230");
      floorGrad.addColorStop(1, "#17441a");
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, groundY, width, height - groundY);
      ctx.fillStyle = "#4caf50";
      ctx.fillRect(0, groundY, width, 4);

      // Move Paint bucket obstacle
      obstacle.x -= 4.2;
      if (obstacle.x < -30) {
        obstacle.x = width + Math.random() * 200 + 100;
        obstacle.color = bucketColors[Math.floor(Math.random() * bucketColors.length)];
      }

      // Render challenge design bucket
      ctx.fillStyle = obstacle.color;
      ctx.beginPath();
      ctx.roundRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 4);
      ctx.fill();
      ctx.fillStyle = "#ddd";
      ctx.fillRect(obstacle.x + 3, obstacle.y - 4, obstacle.width - 6, 4);

      // Player kinematics
      player.vy += 0.44;
      player.y += player.vy;
      if (player.y >= groundY - player.height) {
        player.y = groundY - player.height;
        player.vy = 0;
        player.onGround = true;
      }

      // Check if player jumped obstacle
      const distToBucket = obstacle.x - player.x;
      if (distToBucket > 30 && distToBucket < 140 && player.onGround) {
        player.vy = -10.2;
        player.onGround = false;

        // Splendid paint sparkles on jump
        for (let i = 0; i < 10; i++) {
          particles.push({
            x: player.x + player.width / 2,
            y: groundY - 4,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 4 - 3,
            size: Math.random() * 8 + 4,
            color: obstacle.color,
            alpha: 1,
            life: 30,
          });
        }
      }

      // Footstep running smoke sparkles
      if (player.onGround && tick % 6 === 0) {
        spawnSplash(player.x + 10, groundY, obstacle.color);
      }

      // Render Player (Candinho)
      const walkTime = tick * 0.16;
      const runBounceY = player.onGround ? Math.abs(Math.sin(walkTime * Math.PI)) * 6 : 0;
      if (candinhoImg.complete && candinhoImg.naturalWidth > 0) {
        ctx.drawImage(candinhoImg, player.x, player.y - runBounceY, player.width, player.height);
      } else {
        // Fallback peach ball heads
        ctx.fillStyle = "#ffcc80";
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Monster pursuing player
      monster.x = player.x - 120 + Math.sin(tick * 0.04) * 20;
      const monsterHopOffset = Math.abs(Math.sin(tick * 0.12)) * 14;
      const monsterY = groundY - monster.height - monsterHopOffset;
      if (monsterImg.complete && monsterImg.naturalWidth > 0) {
        ctx.drawImage(monsterImg, monster.x, monsterY, monster.width, monster.height);
      } else {
        ctx.fillStyle = "#d32f2f";
        ctx.beginPath();
        ctx.roundRect(monster.x, monsterY, monster.width, monster.height, 6);
        ctx.fill();
      }

      // Update/Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // light gravity pull on particles
        p.life--;
        p.alpha = Math.max(0, p.life / 25);
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(runLoop);
    };

    runLoop();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleStartClick = () => {
    const trimmed = childName.trim();
    if (trimmed.length < 2) {
      setValidationError("Escreva seu nome de artista para começar! 🎨");
    } else {
      onStart(trimmed);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#070714] to-[#12122b] flex items-center justify-center z-[300] select-none p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-6xl bg-[#111126]/80 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-accent/20 shadow-2xl flex flex-col my-auto">
        
        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch w-full">
          
          {/* LEFT COLUMN: Student Ranking (Leaderboard) */}
          <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col bg-[#070714]/80 border border-accent/20 rounded-2xl p-4 sm:p-5 text-left justify-between">
            <div className="mb-3">
              <h3 className="text-accent font-display text-xs sm:text-sm font-black tracking-wider uppercase mb-1 flex items-center gap-1.5">
                🏆 REINO DOS ARTISTAS
              </h3>
              <p className="text-accent/60 font-sans text-[11px] leading-relaxed">
                Veja as melhores pontuações alcançadas pelos artistas da nossa galeria!
              </p>
            </div>

            {/* List of high-scored kids */}
            <div className="space-y-2 flex-grow max-h-[220px] lg:max-h-[350px] overflow-y-auto pr-1">
              {leaderboard.length === 0 ? (
                <div className="text-center py-6 text-accent/40 font-sans text-xs italic">
                  Nenhum registro ainda. Seja o primeiro! 🎨
                </div>
              ) : (
                leaderboard.map((item, idx) => {
                  let badgeBg = "bg-white/5 text-gray-400";
                  let scoreColor = "text-accent/80";
                  let emoji = "";
                  
                  if (idx === 0) {
                    badgeBg = "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-black animate-pulse";
                    scoreColor = "text-yellow-400 font-extrabold";
                    emoji = "👑";
                  } else if (idx === 1) {
                    badgeBg = "bg-slate-300/20 text-slate-300 border border-slate-300/30";
                    scoreColor = "text-slate-200 font-bold";
                    emoji = "🥈";
                  } else if (idx === 2) {
                    badgeBg = "bg-amber-600/20 text-amber-500 border border-amber-600/30";
                    scoreColor = "text-amber-500 font-bold";
                    emoji = "🥉";
                  } else {
                    emoji = `${idx + 1}º`;
                  }

                  return (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-accent/5 hover:border-accent/15 transition-all text-xs"
                    >
                      <div className="flex items-center gap-1.5 min-w-[65%]">
                        <span className={`w-5 h-5 flex items-center justify-center text-[10px] rounded-full shrink-0 ${badgeBg}`}>
                          {emoji}
                        </span>
                        <span className="text-white font-sans font-black truncate max-w-[90px] uppercase tracking-tight">
                          {item.name}
                        </span>
                      </div>
                      <span className={`font-mono text-[11px] shrink-0 ${scoreColor}`}>
                        {item.score} pts
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-3 border-t border-accent/10 pt-2 text-[10px] text-center font-mono text-accent/40 uppercase tracking-widest leading-none">
              🚀 COLOQUE SEU NOME AQUI!
            </div>
          </div>

          {/* CENTER COLUMN: Main game access & registration */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center justify-center text-center space-y-4 py-2">
            
            {/* Title with Portrait */}
            <div className="flex items-center gap-3 md:gap-4 select-none">
              <img
                src="https://i.imgur.com/UDl1c5j.png"
                alt="Candinho"
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-accent/80 shadow-md bg-[#0d0d1f] object-cover pointer-events-none select-none"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-accent tracking-tight drop-shadow-lg leading-none">
                  CANDINHO
                </h1>
                <p className="text-xs md:text-sm text-accent/60 font-mono tracking-widest uppercase mt-1">
                  O Pequeno Artista
                </p>
              </div>
            </div>

            {/* Animated Running Physics Simulator Box */}
            <div className="relative w-full h-32 md:h-40 bg-black/40 rounded-2xl border border-accent/15 overflow-hidden shadow-inner">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
            </div>

            {/* Briefing Box */}
            <div className="w-full bg-[#0d0d1f]/85 px-4 py-3 rounded-2xl border border-accent/10 text-xs sm:text-sm text-gray-200 leading-relaxed font-sans text-center">
              🎨 Ajude o Candinho a recolher tintas do cenário, desviando dos monstros removedores de cor, e pinte as obras históricas de Portinari ao fim de cada fase!
            </div>

            {/* Child Name Registration */}
            <div className="w-full max-w-sm flex flex-col items-center">
              <label className="text-accent font-display text-[10px] sm:text-xs uppercase tracking-widest mb-1.5 font-black">
                🎨 DIGITE SEU NOME DE ARTISTA PARA O RANKING:
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => {
                  setChildName(e.target.value);
                  if (e.target.value.trim().length >= 2) {
                    setValidationError("");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleStartClick();
                  }
                }}
                maxLength={20}
                placeholder="Ex: Pedrinho, Sofia..."
                className="bg-[#0c0c1e] text-white font-sans text-base sm:text-lg text-center font-black px-4 py-2.5 rounded-2xl border-2 border-accent/40 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/20 transition-all w-full select-text"
              />
              {validationError && (
                <p className="text-red-400 font-sans text-xs sm:text-sm mt-1.5 font-bold animate-pulse">
                  {validationError}
                </p>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleStartClick}
              className="bg-accent text-accent-foreground font-display text-lg md:text-xl px-12 py-3 rounded-full border-none cursor-pointer shadow-lg active:scale-95 hover:scale-105 hover:shadow-accent/40 active:bg-accent/90 transition-all uppercase tracking-wider font-extrabold max-w-sm w-full"
            >
              Jogar Agora 🎮
            </button>
          </div>

          {/* RIGHT COLUMN: Classification Level Milestones */}
          <div className="lg:col-span-3 order-3 flex flex-col bg-[#070714]/80 border border-accent/20 rounded-2xl p-4 sm:p-5 text-left justify-between">
            <div className="mb-3">
              <h3 className="text-accent font-display text-xs sm:text-sm font-black tracking-wider uppercase mb-1 flex items-center gap-1.5">
                🏷️ CLASSIFICAÇÃO ARTÍSTICA
              </h3>
              <p className="text-accent/60 font-sans text-[11px] leading-relaxed">
                Supere limites e pontuações para alcançar medalhas e títulos artísticos fantásticos!
              </p>
            </div>

            {/* Classification List */}
            <div className="space-y-3 flex-grow flex flex-col justify-center">
              
              {/* Rank 4: Mestre Portinari (2000 points) */}
              <div className="p-2.5 rounded-xl border border-amber-500/20 bg-[#1d150b]/40 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-amber-300 font-display font-black uppercase tracking-wide flex items-center gap-1">
                    🏆 Mestre Portinari
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold px-1.5 rounded">
                    2000+
                  </span>
                </div>
                <p className="text-[10px] text-amber-150/80 font-sans leading-snug">
                  Incrível! Consagrado como um verdadeiro mestre das artes brasileiras!
                </p>
              </div>

              {/* Rank 3: Explorador da Criatividade (1000 points) */}
              <div className="p-2.5 rounded-xl border border-sky-500/20 bg-[#101726]/40 hover:border-sky-500/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-sky-300 font-display font-black uppercase tracking-wide flex items-center gap-1">
                    🌈 Explorador...
                  </span>
                  <span className="bg-sky-500/20 text-sky-300 font-mono text-[9px] font-bold px-1.5 rounded">
                    1000+
                  </span>
                </div>
                <p className="text-[10px] text-sky-150/80 font-sans leading-snug">
                  Exploração espetacular desbloqueando muita cor e criatividade!
                </p>
              </div>

              {/* Rank 2: Pequeno Artista (500 points) */}
              <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-[#0d1c1a]/40 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-emerald-300 font-display font-black uppercase tracking-wide flex items-center gap-1">
                    🖌️ Pequeno Artista
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold px-1.5 rounded">
                    500+
                  </span>
                </div>
                <p className="text-[10px] text-emerald-150/80 font-sans leading-snug">
                  Pinceladas cheias de alegria e talento que já preenchem todas as telas!
                </p>
              </div>

              {/* Rank 1: Aprendiz das Cores (0 points) */}
              <div className="p-2.5 rounded-xl border border-pink-500/20 bg-[#1f101a]/40 hover:border-pink-500/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-pink-300 font-display font-black uppercase tracking-wide flex items-center gap-1">
                    🎨 Aprendiz...
                  </span>
                  <span className="bg-pink-500/20 text-pink-300 font-mono text-[9px] font-bold px-1.5 rounded">
                    0+
                  </span>
                </div>
                <p className="text-[10px] text-pink-150/80 font-sans leading-snug">
                  O início de uma bela jornada no maravilhoso mundo das cores!
                </p>
              </div>

            </div>

            <div className="mt-3 border-t border-accent/10 pt-2 text-[10px] text-center font-mono text-accent/40 uppercase tracking-widest leading-none">
              ✨ INSPIRAÇÃO E TALENTO
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};
