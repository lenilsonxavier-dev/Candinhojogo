import React, { useEffect, useRef } from "react";

interface OpeningScreenProps {
  onStart: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;

    // Preload sprites
    const candinhoImg = new Image();
    candinhoImg.src = "/assets/candinho-correndo-ZKC8bzhz.png";

    const monsterImg = new Image();
    monsterImg.src = "/assets/monstrinho-B9QJWbS4.png";

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

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#070714] to-[#12122b] flex items-center justify-center z-[300] select-none p-4">
      <div className="text-center w-full max-w-4xl bg-[#111126]/60 backdrop-blur-md rounded-3xl p-6 md:p-10 border-2 border-accent/20 shadow-2xl flex flex-col items-center">
        
        {/* Title with Portrait */}
        <div className="flex items-center gap-3 md:gap-4 mb-4 select-none">
          <img
            src="https://i.imgur.com/UDl1c5j.png"
            alt="Candinho"
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-accent/80 shadow-md bg-[#0d0d1f] object-cover pointer-events-none select-none"
            referrerPolicy="no-referrer"
          />
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-accent tracking-tight drop-shadow-lg leading-none">
              CANDINHO
            </h1>
            <p className="text-xs md:text-sm text-accent/60 font-mono tracking-widest uppercase mt-1">
              O Pequeno Artista
            </p>
          </div>
        </div>

        {/* Animated Running Physics Simulator Box */}
        <div className="relative w-full h-40 md:h-52 bg-black/40 rounded-2xl border border-accent/15 overflow-hidden mb-6 shadow-inner">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        </div>

        {/* Briefing Box */}
        <div className="max-w-2xl bg-[#0d0d1f]/80 px-6 py-4 rounded-2xl border border-accent/10 mb-6 text-sm md:text-base text-gray-200 leading-relaxed font-sans">
          🎨 ajude o Candinho a recolher tintas, passando pelos monstros removedores de cor e pinte as obras históricas de Candido Portinari ao fim de cada fase!
        </div>

        {/* Action Button */}
        <button
          onClick={onStart}
          className="bg-accent text-accent-foreground font-display text-xl md:text-3xl px-12 py-4 rounded-full border-none cursor-pointer shadow-lg active:scale-95 hover:scale-105 hover:shadow-accent/40 active:bg-accent/90 transition-all uppercase tracking-wider font-extrabold max-w-sm w-full"
        >
          Jogar Agora 🎮
        </button>
      </div>
    </div>
  );
};
