import React, { useRef, useState, useEffect, useCallback } from "react";
import { OpeningScreen } from "./components/OpeningScreen";
import { GameOverOverlay } from "./components/GameOverOverlay";
import { GameState, Level, Player, Platform, Paint, Monster, Particle, getAssetPath } from "./types";

const portinari1Url = "https://i.imgur.com/UxHnz1J.jpg";
const portinari2Url = "https://i.imgur.com/GnCo524.jpg";
const portinari3Url = "https://i.imgur.com/VZH7ezB.jpg";
const portinari4Url = "https://i.imgur.com/fRrjPu4.jpg";

// Verified direct high-res images from Google Arts & Culture for Cândido Portinari masterpieces
const chorinhoUrl = "https://lh3.googleusercontent.com/ci/AL18g_Q1NenEUCYAuqideiggOhD6wbwyzvWHXI91ZYjr7cz9OCmsOWVm02X0z8RA19VbYSNmzpauDQU=s1200";
const namoradosUrl = "https://lh3.googleusercontent.com/ci/AL18g_TQeaNMpSkFkC6H6z8iMiZXn-rjYxymo6XMGzcCP3vIlXsDuLkZy-fOUy0igS-P7oDcRJX5IA=s1200";
const baianaUrl = "https://lh3.googleusercontent.com/ci/AL18g_SoHZLRc-1xyHJma3EnaMPvrigdSTCeLH5KrnyUFr6844kaJXzg9IqIeXX7Yi4ZvRBH0pupz1Kx=s1200";
const descobrimentoUrl = "https://lh3.googleusercontent.com/ci/AL18g_QI0ed5LO7C8U0LXNhFpPKwG_N_e_P1AcKhuGyj8LT8uFLYPlG8eLk5cH-UPCLAg9ou3pUPcT0=s1200";
const cafeUrl = "https://lh3.googleusercontent.com/ci/AL18g_Q14DitxUjD8j3pUO8VVcBdczB1heujp7zn8W5siZENX0z7_GOMfhPgA_pkAici5wLy2QIv0w=s1200";

// Core Game Area Constants
const Et = 1920; // Virtual width
const vn = 1080; // Virtual height
const Ve = vn - 240; // Ground height (840)

const ye = [
  "#ff4444",
  "#4488ff",
  "#44cc44",
  "#ffaa00",
  "#ff44ff",
  "#44ffff",
  "#ff8844",
  "#ffff44",
  "#44ff88",
  "#8844ff",
  "#ff4488",
  "#88ff44",
  "#4488aa",
  "#aa4488",
  "#ffffff",
];

const je = 90; // Monster width
const te = 120; // Monster height
const we = 55; // Paint width
const Se = 55; // Paint height
const ge = 32; // Platform height

// Physics Settings
const UE = 0.85; // Gravity
const kf = -19; // Jump power
const Pf = 12; // Speed
const Gi = 7; // Lives

function Zl(e: number, t = 0): Paint[] {
  const n: Paint[] = [];
  const o = Et - 240;
  for (let i = 0; i < e; i++) {
    n.push({
      x: 120 + (o * i) / Math.max(1, e - 1) - we / 2,
      y: Ve - 80,
      width: we,
      height: Se,
      color: ye[(t + i) % ye.length],
      collected: false,
    });
  }
  return n;
}

function Ki(level: number): Level {
  const platforms: Platform[] = [{ x: 0, y: Ve, width: Et, height: 80, color: "#2e7d32" }];
  const paints: Paint[] = [];
  const monsters: Monster[] = [];

  if (level === 1) {
    platforms.push(
      { x: 240, y: 780, width: 280, height: ge, color: "#2e7d32" },
      { x: 600, y: 640, width: 280, height: ge, color: "#2e7d32" },
      { x: 960, y: 500, width: 320, height: ge, color: "#2e7d32" },
      { x: 1340, y: 360, width: 280, height: ge, color: "#2e7d32" },
      { x: 380, y: 480, width: 220, height: ge, color: "#2e7d32" }
    );
    paints.push(...Zl(10, 0));
    paints.push(
      { x: 320, y: 720, width: we, height: Se, color: ye[10], collected: false },
      { x: 670, y: 580, width: we, height: Se, color: ye[11], collected: false },
      { x: 1040, y: 440, width: we, height: Se, color: ye[12], collected: false },
      { x: 1420, y: 300, width: we, height: Se, color: ye[13], collected: false },
      { x: 440, y: 420, width: we, height: Se, color: ye[14], collected: false }
    );
    monsters.push(
      { x: 600, y: Ve - te, width: je, height: te, vx: 2.5, color: "#880088", minX: 480, maxX: 880 },
      { x: 1100, y: Ve - te, width: je, height: te, vx: 3, color: "#880088", minX: 920, maxX: 1340 }
    );
  } else if (level === 2) {
    platforms.push(
      { x: 140, y: 780, width: 260, height: ge, color: "#2e7d32" },
      { x: 500, y: 640, width: 260, height: ge, color: "#1b5e20", vx: 2, minX: 480, maxX: 820 },
      { x: 860, y: 500, width: 300, height: ge, color: "#2e7d32" },
      { x: 1240, y: 360, width: 260, height: ge, color: "#1b5e20", vy: 1.6, minY: 280, maxY: 460 },
      { x: 1600, y: 240, width: 280, height: ge, color: "#2e7d32" },
      { x: 260, y: 540, width: 220, height: ge, color: "#2e7d32" },
      { x: 740, y: 360, width: 220, height: ge, color: "#2e7d32" }
    );
    paints.push(...Zl(9, 0));
    paints.push(
      { x: 220, y: 720, width: we, height: Se, color: ye[9], collected: false },
      { x: 580, y: 580, width: we, height: Se, color: ye[10], collected: false },
      { x: 940, y: 440, width: we, height: Se, color: ye[11], collected: false },
      { x: 1320, y: 300, width: we, height: Se, color: ye[12], collected: false },
      { x: 1680, y: 180, width: we, height: Se, color: ye[13], collected: false },
      { x: 820, y: 300, width: we, height: Se, color: ye[14], collected: false }
    );
    monsters.push(
      { x: 360, y: Ve - te, width: je, height: te, vx: 2.5, color: "#880088", minX: 120, maxX: 600 },
      { x: 860, y: Ve - te, width: je, height: te, vx: 3.5, color: "#880088", minX: 660, maxX: 1080 },
      { x: 1340, y: Ve - te, width: je, height: te, vx: 3, color: "#880088", minX: 1140, maxX: 1560 },
      { x: 560, y: 640 - te, width: je, height: te, vx: 1.8, color: "#aa0066", minX: 0, maxX: 0, platformIdx: 2 },
      { x: 1290, y: 360 - te, width: je, height: te, vx: 1.5, color: "#aa0066", minX: 0, maxX: 0, platformIdx: 4 }
    );
  } else if (level === 3) {
    platforms.push(
      { x: 120, y: 780, width: 220, height: ge, color: "#2e7d32" },
      { x: 400, y: 640, width: 220, height: ge, color: "#1b5e20", vx: 2.5, minX: 380, maxX: 720 },
      { x: 700, y: 500, width: 260, height: ge, color: "#2e7d32" },
      { x: 1040, y: 360, width: 240, height: ge, color: "#1b5e20", vy: 1.8, minY: 260, maxY: 480 },
      { x: 1340, y: 380, width: 220, height: ge, color: "#2e7d32" },
      { x: 1620, y: 300, width: 240, height: ge, color: "#1b5e20", vx: -2, minX: 1500, maxX: 1760 },
      { x: 280, y: 460, width: 180, height: ge, color: "#2e7d32" },
      { x: 640, y: 460, width: 180, height: ge, color: "#1b5e20", vy: 2.2, minY: 380, maxY: 540 },
      { x: 940, y: 360, width: 180, height: ge, color: "#2e7d32" }
    );
    paints.push(...Zl(8, 0));
    paints.push(
      { x: 200, y: 720, width: we, height: Se, color: ye[8], collected: false },
      { x: 480, y: 580, width: we, height: Se, color: ye[9], collected: false },
      { x: 780, y: 440, width: we, height: Se, color: ye[10], collected: false },
      { x: 1120, y: 300, width: we, height: Se, color: ye[11], collected: false },
      { x: 1400, y: 320, width: we, height: Se, color: ye[12], collected: false },
      { x: 1700, y: 240, width: we, height: Se, color: ye[13], collected: false },
      { x: 1000, y: 300, width: we, height: Se, color: ye[14], collected: false }
    );
    monsters.push(
      { x: 240, y: Ve - te, width: je, height: te, vx: 3, color: "#880088", minX: 60, maxX: 540 },
      { x: 720, y: Ve - te, width: je, height: te, vx: 3.5, color: "#880088", minX: 540, maxX: 960 },
      { x: 1200, y: Ve - te, width: je, height: te, vx: 4, color: "#880088", minX: 1020, maxX: 1440 },
      { x: 1620, y: Ve - te, width: je, height: te, vx: 2.5, color: "#880088", minX: 1440, maxX: 1800 },
      { x: 460, y: 640 - te, width: je, height: te, vx: 1.8, color: "#aa0066", minX: 0, maxX: 0, platformIdx: 2 },
      { x: 1100, y: 360 - te, width: je, height: te, vx: 1.5, color: "#aa0066", minX: 0, maxX: 0, platformIdx: 4 },
      { x: 1680, y: 300 - te, width: je, height: te, vx: 2, color: "#aa0066", minX: 0, maxX: 0, platformIdx: 6 },
      { x: 700, y: 460 - te, width: je, height: te, vx: 1.4, color: "#aa0066", minX: 0, maxX: 0, platformIdx: 8 }
    );
  } else if (level === 4) {
    platforms.push(
      { x: 160, y: 770, width: 240, height: ge, color: "#2e7d32" },
      { x: 480, y: 640, width: 240, height: ge, color: "#2e7d32" },
      { x: 800, y: 510, width: 280, height: ge, color: "#1b5e20", vx: 2.2, minX: 750, maxX: 1100 },
      { x: 1160, y: 370, width: 240, height: ge, color: "#2e7d32" },
      { x: 1460, y: 495, width: 250, height: ge, color: "#1b5e20", vy: 1.7, minY: 320, maxY: 640 },
      { x: 300, y: 400, width: 220, height: ge, color: "#2e7d32" }
    );
    paints.push(...Zl(9, 4));
    paints.push(
      { x: 240, y: 710, width: we, height: Se, color: ye[0], collected: false },
      { x: 540, y: 580, width: we, height: Se, color: ye[1], collected: false },
      { x: 860, y: 450, width: we, height: Se, color: ye[2], collected: false },
      { x: 1220, y: 310, width: we, height: Se, color: ye[3], collected: false },
      { x: 1510, y: 435, width: we, height: Se, color: ye[4], collected: false }
    );
    monsters.push(
      { x: 300, y: Ve - te, width: je, height: te, vx: 2.8, color: "#880088", minX: 100, maxX: 600 },
      { x: 1000, y: Ve - te, width: je, height: te, vx: 3.3, color: "#880088", minX: 800, maxX: 1400 },
      { x: 540, y: 640 - te, width: je, height: te, vx: 1.6, color: "#aa0066", minX: 0, maxX: 0, platformIdx: 2 }
    );
  } else {
    platforms.push(
      { x: 200, y: 765, width: 250, height: ge, color: "#2e7d32" },
      { x: 520, y: 620, width: 250, height: ge, color: "#1b5e20", vx: 3.2, minX: 470, maxX: 870 },
      { x: 880, y: 480, width: 280, height: ge, color: "#2e7d32" },
      { x: 1220, y: 340, width: 250, height: ge, color: "#1b5e20", vy: 2.2, minY: 220, maxY: 600 },
      { x: 1540, y: 220, width: 260, height: ge, color: "#2e7d32" }
    );
    paints.push(...Zl(9, 8));
    paints.push(
      { x: 290, y: 705, width: we, height: Se, color: ye[5], collected: false },
      { x: 590, y: 560, width: we, height: Se, color: ye[6], collected: false },
      { x: 940, y: 420, width: we, height: Se, color: ye[7], collected: false },
      { x: 1300, y: 280, width: we, height: Se, color: ye[8], collected: false }
    );
    monsters.push(
      { x: 400, y: Ve - te, width: je, height: te, vx: 3.6, color: "#880088", minX: 100, maxX: 700 },
      { x: 1100, y: Ve - te, width: je, height: te, vx: 4.2, color: "#880088", minX: 800, maxX: 1500 },
      { x: 940, y: 480 - te, width: je, height: te, vx: 2.3, color: "#aa0066", minX: 0, maxX: 0, platformIdx: 3 }
    );
  }

  return {
    platforms,
    paints,
    monsters,
    goal: { x: Et - 140, y: Ve - 180, width: 110, height: 180 },
  };
}

// Hook to load offline game images
function useGameImages() {
  const playerImgRef = useRef<HTMLImageElement | null>(null);
  const playerImgFlippedRef = useRef<HTMLCanvasElement | null>(null);
  const monsterImgRef = useRef<HTMLImageElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const portinari1ImgRef = useRef<HTMLImageElement | null>(null);
  const portinari2ImgRef = useRef<HTMLImageElement | null>(null);
  const portinari3ImgRef = useRef<HTMLImageElement | null>(null);
  const portinari4ImgRef = useRef<HTMLImageElement | null>(null);
  
  // High-res Google Arts and Culture references
  const chorinhoImgRef = useRef<HTMLImageElement | null>(null);
  const namoradosImgRef = useRef<HTMLImageElement | null>(null);
  const baianaImgRef = useRef<HTMLImageElement | null>(null);
  const descobrimentoImgRef = useRef<HTMLImageElement | null>(null);
  const cafeImgRef = useRef<HTMLImageElement | null>(null);
  
  const loadedRef = useRef<boolean>(false);

  useEffect(() => {
    const pImg = new Image();
    pImg.crossOrigin = "anonymous";
    pImg.src = "https://i.imgur.com/63Woy0z.png";
    pImg.onload = () => {
      playerImgRef.current = pImg;
      const flippedCanvas = document.createElement("canvas");
      flippedCanvas.width = pImg.width;
      flippedCanvas.height = pImg.height;
      const ctx = flippedCanvas.getContext("2d");
      if (ctx) {
        ctx.translate(pImg.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(pImg, 0, 0);
        playerImgFlippedRef.current = flippedCanvas;
      }
      checkLoaded();
    };

    const mImg = new Image();
    mImg.crossOrigin = "anonymous";
    mImg.src = "https://i.imgur.com/21iZsMM.png";
    mImg.onload = () => {
      monsterImgRef.current = mImg;
      checkLoaded();
    };

    const bImg = new Image();
    bImg.src = getAssetPath("assets/game-background-new.png");
    bImg.onload = () => {
      bgImgRef.current = bImg;
      checkLoaded();
    };

    const p1Img = new Image();
    p1Img.src = portinari1Url;
    p1Img.onload = () => {
      portinari1ImgRef.current = p1Img;
      checkLoaded();
    };

    const p2Img = new Image();
    p2Img.src = portinari2Url;
    p2Img.onload = () => {
      portinari2ImgRef.current = p2Img;
      checkLoaded();
    };

    const p3Img = new Image();
    p3Img.src = portinari3Url;
    p3Img.onload = () => {
      portinari3ImgRef.current = p3Img;
      checkLoaded();
    };

    const p4Img = new Image();
    p4Img.src = portinari4Url;
    p4Img.onload = () => {
      portinari4ImgRef.current = p4Img;
      checkLoaded();
    };

    const chImg = new Image();
    chImg.src = chorinhoUrl;
    chImg.onload = () => {
      chorinhoImgRef.current = chImg;
      checkLoaded();
    };

    const namImg = new Image();
    namImg.src = namoradosUrl;
    namImg.onload = () => {
      namoradosImgRef.current = namImg;
      checkLoaded();
    };

    const baiImg = new Image();
    baiImg.src = baianaUrl;
    baiImg.onload = () => {
      baianaImgRef.current = baiImg;
      checkLoaded();
    };

    const desImg = new Image();
    desImg.src = descobrimentoUrl;
    desImg.onload = () => {
      descobrimentoImgRef.current = desImg;
      checkLoaded();
    };

    const cafImg = new Image();
    cafImg.src = cafeUrl;
    cafImg.onload = () => {
      cafeImgRef.current = cafImg;
      checkLoaded();
    };

    function checkLoaded() {
      if (
        playerImgRef.current &&
        monsterImgRef.current &&
        bgImgRef.current &&
        portinari1ImgRef.current &&
        portinari2ImgRef.current &&
        portinari3ImgRef.current &&
        portinari4ImgRef.current &&
        chorinhoImgRef.current &&
        namoradosImgRef.current &&
        baianaImgRef.current &&
        descobrimentoImgRef.current &&
        cafeImgRef.current
      ) {
        loadedRef.current = true;
      }
    }
  }, []);

  return {
    playerImg: playerImgRef,
    playerImgFlipped: playerImgFlippedRef,
    monsterImg: monsterImgRef,
    bgImg: bgImgRef,
    portinari1Img: portinari1ImgRef,
    portinari2Img: portinari2ImgRef,
    portinari3Img: portinari3ImgRef,
    portinari4Img: portinari4ImgRef,
    chorinhoImg: chorinhoImgRef,
    namoradosImg: namoradosImgRef,
    baianaImg: baianaImgRef,
    descobrimentoImg: descobrimentoImgRef,
    cafeImg: cafeImgRef,
    loaded: loadedRef,
  };
}

// Hook to play Background Theme Music on Loop
function useBackgroundTheme() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(getAssetPath("candinhotema.mp3"));
      audio.loop = true;
      audio.volume = 0.4;
      audioRef.current = audio;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
}

// Hook to play Point and GameOver alert sounds
function useSounds() {
  const gameOverAudioRef = useRef<HTMLAudioElement | null>(null);
  const pointAudioRef = useRef<HTMLAudioElement | null>(null);

  const playGameOver = useCallback(() => {
    if (!gameOverAudioRef.current) {
      const audio = new Audio(getAssetPath("candingameover.mp3"));
      audio.volume = 0.6;
      gameOverAudioRef.current = audio;
    }
    gameOverAudioRef.current.currentTime = 0;
    gameOverAudioRef.current.play().catch(() => {});
  }, []);

  const playPoint = useCallback(() => {
    if (!pointAudioRef.current) {
      const audio = new Audio(getAssetPath("pontocandinho.mp3"));
      audio.volume = 0.5;
      pointAudioRef.current = audio;
    }
    pointAudioRef.current.currentTime = 0;
    pointAudioRef.current.play().catch(() => {});
  }, []);

  return { playGameOver, playPoint };
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>("opening");
  const [lives, setLives] = useState<number>(Gi);
  const [paintsCollected, setPaintsCollected] = useState<number>(0);
  const [totalPaints, setTotalPaints] = useState<number>(0);

  // Asset hooks
  const { playerImg, playerImgFlipped, monsterImg, bgImg, portinari1Img, portinari2Img, portinari3Img, portinari4Img, chorinhoImg, namoradosImg, baianaImg, descobrimentoImg, cafeImg } = useGameImages();
  const themeMusic = useBackgroundTheme();
  const sounds = useSounds();

  // Highlight particle effects elements
  const particlesRef = useRef<Particle[]>([]);
  const nextParticleIdRef = useRef<number>(0);
  const frameCounterRef = useRef<number>(0);

  // Spawner helper
  const spawnParticles = useCallback((x: number, y: number, count: number, type: Particle["type"], forceColor?: string) => {
    const list = ye;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      let speed = Math.random() * 5 + 1;
      let vx = Math.cos(angle) * speed;
      let vy = Math.sin(angle) * speed;
      let size = Math.random() * 8 + 4;
      let maxLife = Math.random() * 20 + 20;

      if (type === "trail") {
        vx = (playerRef.current.facing === "right" ? -1 : 1) * (Math.random() * 3 + 1);
        vy = -Math.random() * 2;
        size = Math.random() * 6 + 3;
        maxLife = Math.random() * 15 + 10;
      } else if (type === "jump") {
        vx = (Math.random() - 0.5) * 8;
        vy = Math.random() * 3 + 1;
        size = Math.random() * 10 + 5;
        maxLife = Math.random() * 25 + 15;
      } else if (type === "dust") {
        vx = (Math.random() - 0.5) * 5;
        vy = -Math.random() * 3;
        size = Math.random() * 8 + 4;
        maxLife = Math.random() * 20 + 10;
      } else if (type === "smudge") {
        vx = (Math.random() - 0.5) * 2;
        vy = -Math.random() * 1.5;
        size = Math.random() * 12 + 6;
        maxLife = Math.random() * 30 + 15;
      } else if (type === "celebration") {
        vx = (Math.random() - 0.5) * 12;
        vy = (Math.random() - 0.5) * 12 - 5;
        size = Math.random() * 12 + 6;
        maxLife = Math.random() * 40 + 30;
      }

      const color = forceColor || (type === "smudge" ? ["#424242", "#212121", "#3e2723", "#311b92", "#000000"][Math.floor(Math.random() * 5)] : list[Math.floor(Math.random() * list.length)]);

      particlesRef.current.push({
        id: nextParticleIdRef.current++,
        x,
        y,
        vx,
        vy,
        size,
        color,
        alpha: 1,
        life: maxLife,
        maxLife,
        type,
      });
    }
  }, []);

  // Physics entity states managed synchronously through refs to keep steady 60FPS on canvas
  const playerRef = useRef<Player>({
    x: 100,
    y: Ve - 150,
    width: 100,
    height: 140,
    vx: 0,
    vy: 0,
    onGround: false,
    color: "#ffeb3b",
    facing: "right",
  });

  const activeLevelRef = useRef<Level>(Ki(1));
  const controlsRef = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>(0);
  const livesRef = useRef<number>(Gi);
  const currentLevelNumberRef = useRef<number>(1);
  const cameraRef = useRef<{ x: number }>({ x: 0 });

  // Reset Player state
  const resetPlayer = useCallback(() => {
    const player = playerRef.current;
    player.x = 100;
    player.y = Ve - 150;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.facing = "right";
    cameraRef.current.x = 0;
  }, []);

  // Launch Game
  const startGame = useCallback(() => {
    livesRef.current = Gi;
    setLives(Gi);
    currentLevelNumberRef.current = 1;
    activeLevelRef.current = Ki(1);
    setTotalPaints(activeLevelRef.current.paints.length);
    setPaintsCollected(0);
    resetPlayer();
    // Clear particles on restart
    particlesRef.current = [];
    setGameState("playing");
    themeMusic.play();

    // Request fullscreen (optional/best-effort)
    const el = document.documentElement as any;
    const fullscreenFn =
      el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (fullscreenFn) {
      fullscreenFn.call(el).catch(() => {});
    }
  }, [resetPlayer, themeMusic]);

  // Handle player death or loss of life
  const handlePlayerLostLife = useCallback(() => {
    livesRef.current -= 1;
    setLives(livesRef.current);
    if (livesRef.current <= 0) {
      setGameState("gameover");
      themeMusic.stop();
      sounds.playGameOver();
    } else {
      resetPlayer();
      activeLevelRef.current = Ki(currentLevelNumberRef.current);
      particlesRef.current = [];
    }
  }, [resetPlayer, themeMusic, sounds]);

  // Drawing Canvas Elements
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const camera = cameraRef.current;
      const player = playerRef.current;
      const level = activeLevelRef.current;

      // Restrict camera margins
      camera.x = Math.max(0, Math.min(player.x - Et / 3, Et * 0.3));

      ctx.clearRect(0, 0, Et, vn);

      // 1. Draw Background
      if (bgImg.current) {
        const img = bgImg.current;
        const ratio = vn / img.height;
        const drawWidth = img.width * ratio;
        const xOffset = -(camera.x * 0.4) % drawWidth;
        for (let x = xOffset - drawWidth; x < Et; x += drawWidth) {
          ctx.drawImage(img, x, 0, drawWidth, vn);
        }
      } else {
        const gradient = ctx.createLinearGradient(0, 0, 0, vn);
        gradient.addColorStop(0, "#1a1a3e");
        gradient.addColorStop(0.6, "#2d1b69");
        gradient.addColorStop(1, "#0d0d1a");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, Et, vn);
      }

      ctx.save();
      // Apply Camera parallax scrolling movement
      ctx.translate(-camera.x, 0);

      // Draw Hung Classical Paintings in the scenery!
      const drawSceneryPaintings = () => {
        const p1 = portinari1Img.current;
        const p2 = portinari2Img.current;
        const p3 = portinari3Img.current;
        const p4 = portinari4Img.current;
        const ch = chorinhoImg.current;
        const nam = namoradosImg.current;
        const bai = baianaImg.current;
        const des = descobrimentoImg.current;
        const caf = cafeImg.current;

        // Custom coordinates and configurations to distribute all 9 masterpiece paintings beautifully in each level to fill and populate the scenery with ONLY genuine Portinari works
        let items: Array<{ x: number; y: number; w: number; h: number; img: HTMLImageElement | null; label: string }> = [];

        if (currentLevelNumberRef.current === 1) {
          items = [
            { x: 250, y: 120, w: 220, h: 165, img: p1, label: "Meninos Soltando Pipas (1947)" },
            { x: 580, y: 150, w: 220, h: 165, img: ch, label: "Chorinho (1942)" },
            { x: 910, y: 110, w: 220, h: 165, img: nam, label: "Os Namorados (1940)" },
            { x: 1240, y: 140, w: 220, h: 165, img: p4, label: "A Esticada (1940)" },
            { x: 1570, y: 120, w: 220, h: 165, img: p2, label: "Futebol em Brodowski (1935)" },
          ];
        } else if (currentLevelNumberRef.current === 2) {
          items = [
            { x: 220, y: 140, w: 220, h: 165, img: p2, label: "Futebol em Brodowski (1935)" },
            { x: 550, y: 110, w: 220, h: 165, img: bai, label: "Baiana (1953)" },
            { x: 880, y: 150, w: 220, h: 165, img: p4, label: "A Esticada (1940)" },
            { x: 1210, y: 125, w: 220, h: 165, img: des, label: "Descobrimento da Terra (1941)" },
            { x: 1540, y: 150, w: 220, h: 165, img: p3, label: "O Lavrador de Café (1934)" },
          ];
        } else if (currentLevelNumberRef.current === 3) {
          items = [
            { x: 240, y: 110, w: 220, h: 165, img: p3, label: "O Lavrador de Café (1934)" },
            { x: 570, y: 140, w: 220, h: 165, img: caf, label: "O Café (1935)" },
            { x: 900, y: 110, w: 220, h: 165, img: p4, label: "A Esticada (1940)" },
            { x: 1230, y: 135, w: 220, h: 165, img: nam, label: "Os Namorados (1940)" },
            { x: 1560, y: 110, w: 220, h: 165, img: p1, label: "Meninos Soltando Pipas (1947)" },
          ];
        } else if (currentLevelNumberRef.current === 4) {
          items = [
            { x: 210, y: 130, w: 220, h: 165, img: bai, label: "Baiana (1953)" },
            { x: 540, y: 150, w: 220, h: 165, img: caf, label: "O Café (1935)" },
            { x: 870, y: 115, w: 220, h: 165, img: ch, label: "Chorinho (1942)" },
            { x: 1200, y: 140, w: 220, h: 165, img: p4, label: "A Esticada (1940)" },
            { x: 1530, y: 120, w: 220, h: 165, img: des, label: "Descobrimento da Terra (1941)" },
          ];
        } else {
          items = [
            { x: 200, y: 110, w: 220, h: 165, img: ch, label: "Chorinho (1942)" },
            { x: 510, y: 140, w: 220, h: 165, img: des, label: "Descobrimento da Terra (1941)" },
            { x: 820, y: 110, w: 220, h: 165, img: caf, label: "O Café (1935)" },
            { x: 1130, y: 135, w: 220, h: 165, img: bai, label: "Baiana (1953)" },
            { x: 1440, y: 110, w: 220, h: 165, img: nam, label: "Os Namorados (1940)" },
            { x: 1750, y: 140, w: 220, h: 165, img: p1, label: "Meninos Soltando Pipas (1947)" },
          ];
        }

        items.forEach((item) => {
          if (!item.img) return;

          // Drawing hanging suspension wire/rope from the ceiling (y = 0)
          ctx.strokeStyle = "rgba(141, 110, 99, 0.65)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(item.x + item.w / 2, 0);
          ctx.lineTo(item.x + item.w / 2, item.y);
          ctx.stroke();

          // Soft drop shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
          ctx.fillRect(item.x + 8, item.y + 8, item.w, item.h);

          // Rich Golden Classical Frame Border with double bevel styling!
          ctx.fillStyle = "#cca43b"; 
          ctx.fillRect(item.x, item.y, item.w, item.h);

          // Dark Mahogany wood inner border
          ctx.fillStyle = "#5d4037"; 
          ctx.fillRect(item.x + 10, item.y + 10, item.w - 20, item.h - 20);

          // Matte Canvas sheet backing
          ctx.fillStyle = "#f5f5ee";
          ctx.fillRect(item.x + 16, item.y + 16, item.w - 32, item.h - 32);

          // Draw Portinari classical masterpiece
          ctx.drawImage(item.img, item.x + 16, item.y + 16, item.w - 32, item.h - 32);

          // Plaque with names of the artworks
          ctx.fillStyle = "rgba(20, 20, 40, 0.82)";
          ctx.beginPath();
          ctx.roundRect(item.x + item.w / 2 - 95, item.y + item.h - 8, 190, 22, 6);
          ctx.fill();

          ctx.fillStyle = "#fbbf24"; // golden plaque text
          ctx.font = "bold 11px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(item.label, item.x + item.w / 2, item.y + item.h + 6);
        });
      };

      drawSceneryPaintings();

      const time = performance.now() / 1000;
      const pulseMultiplier = 0.5 + 0.5 * Math.sin(time * 4);

      // 2. Draw Platforms
      for (const platform of level.platforms) {
        if (platform.vx !== undefined || platform.vy !== undefined) {
          ctx.save();
          // Apply beautiful golden glowing neon shadow effect to moving platforms
          ctx.shadowColor = `rgba(255, 235, 59, ${0.6 + pulseMultiplier * 0.4})`;
          ctx.shadowBlur = 20 + pulseMultiplier * 15;
          ctx.fillStyle = "#1b5e20";
          ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
          ctx.restore();

          // Green surface indicators
          ctx.fillStyle = `rgba(255, 235, 59, ${0.7 + pulseMultiplier * 0.3})`;
          ctx.fillRect(platform.x, platform.y, platform.width, 8);

          // Moving guide directional texts
          ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + pulseMultiplier * 0.3})`;
          ctx.font = "bold 24px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const textX = platform.x + platform.width / 2;
          const textY = platform.y + platform.height / 2 + 2;
          if (platform.vx !== undefined) {
            ctx.fillText("◀  ▶", textX, textY);
          } else if (platform.vy !== undefined) {
            ctx.fillText("▲ ▼", textX, textY);
          }
          ctx.textAlign = "start";
          ctx.textBaseline = "alphabetic";
        } else {
          // Standard ground & platforms
          ctx.fillStyle = "#2e7d32";
          ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
          ctx.fillStyle = "#66bb6a";
          ctx.fillRect(platform.x, platform.y, platform.width, 8);
        }
      }

      // 3. Draw Easel Canvas (Goal Point) with Portinari artwork progression!
      const goal = level.goal;
      ctx.fillStyle = "#8d6e63"; // Easel legs
      ctx.fillRect(goal.x + 10, goal.y, 5, goal.height);
      ctx.fillRect(goal.x + goal.width - 15, goal.y, 5, goal.height);
      ctx.fillRect(goal.x, goal.y + 5, goal.width, goal.height - 20); // Easel frames
      ctx.fillStyle = "#fff"; // White Canvas sheet background
      ctx.fillRect(goal.x + 5, goal.y + 10, goal.width - 10, goal.height - 30);

      // Draw Selected Portinari Painting representing the level!
      const ch = chorinhoImg.current;
      const nam = namoradosImg.current;
      const bai = baianaImg.current;
      const des = descobrimentoImg.current;
      const caf = cafeImg.current;

      let currentPortinariImg: HTMLImageElement | null = null;
      let paintingTitleText = "";
      if (currentLevelNumberRef.current === 1) {
        currentPortinariImg = ch;
        paintingTitleText = "Chorinho (1942)";
      } else if (currentLevelNumberRef.current === 2) {
        currentPortinariImg = nam;
        paintingTitleText = "Os Namorados (1940)";
      } else if (currentLevelNumberRef.current === 3) {
        currentPortinariImg = bai;
        paintingTitleText = "Baiana (1953)";
      } else if (currentLevelNumberRef.current === 4) {
        currentPortinariImg = des;
        paintingTitleText = "Descobrimento da Terra (1941)";
      } else {
        currentPortinariImg = caf;
        paintingTitleText = "O Café (1935)";
      }

      const totalP = level.paints.length;
      const collectedP = level.paints.filter(p => p.collected).length;
      const revealRatio = totalP > 0 ? collectedP / totalP : 0;

      if (currentPortinariImg) {
        // Draw sketched gray-scale preview
        ctx.save();
        try {
          ctx.filter = "grayscale(100%) opacity(30%)";
        } catch (e) {}
        ctx.drawImage(currentPortinariImg, goal.x + 5, goal.y + 10, goal.width - 10, goal.height - 30);
        ctx.restore();

        // Reveal colored oil painting dynamically bottom-to-top!
        if (revealRatio > 0) {
          const cw = goal.width - 10;
          const ch = goal.height - 30;
          const revealYHeight = ch * revealRatio;
          const revealYStart = ch - revealYHeight;

          ctx.save();
          ctx.beginPath();
          ctx.rect(goal.x + 5, goal.y + 10 + revealYStart, cw, revealYHeight);
          ctx.clip();
          ctx.drawImage(currentPortinariImg, goal.x + 5, goal.y + 10, cw, ch);
          ctx.restore();
        }
      } else {
        // Fallback beautiful rainbow pattern loading
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(goal.x + 5, goal.y + 10, goal.width - 10, goal.height - 30);
        ctx.fillStyle = "#888";
        ctx.font = "italic 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Preparando tela...", goal.x + goal.width / 2, goal.y + goal.height / 2);
      }

      // Draw shiny dots on canvas representing your gathered points
      level.paints
        .filter((p) => p.collected)
        .forEach((p, idx) => {
          ctx.fillStyle = p.color;
          const dotX = goal.x + 8 + (idx % 4) * 12;
          const dotY = goal.y + 15 + Math.floor(idx / 4) * 12;
          ctx.beginPath();
          ctx.arc(dotX + 6, dotY + 6, 5, 0, Math.PI * 2);
          ctx.fill();
        });

      // Show historical painting label/plaque
      ctx.save();
      const titleW = 340;
      const titleH = 40;
      const titleX = goal.x + goal.width / 2 - titleW / 2;
      const titleY = goal.y - 65;

      ctx.fillStyle = revealRatio >= 1 ? "rgba(22, 101, 52, 0.9)" : "rgba(30, 30, 50, 0.85)";
      ctx.strokeStyle = revealRatio >= 1 ? "#4ade80" : "#fbbf24";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(titleX, titleY, titleW, titleH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = revealRatio >= 1 ? "#4ade80" : "#fbbf24";
      ctx.font = "bold 15px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const statusText = revealRatio >= 1 ? `✅ Obra Concluída!` : `🎨 Recolha as Tintas: ${Math.round(revealRatio * 100)}%`;
      ctx.fillText(statusText, titleX + titleW / 2, titleY + titleH / 2 - 10);
      
      ctx.fillStyle = "#fff";
      ctx.font = "italic 12px sans-serif";
      ctx.fillText(paintingTitleText, titleX + titleW / 2, titleY + titleH / 2 + 10);
      ctx.restore();

      // 4. Draw Buckets of Paints
      for (const paint of level.paints) {
        if (!paint.collected) {
          ctx.fillStyle = paint.color;
          ctx.beginPath();
          ctx.roundRect(paint.x, paint.y + 5, paint.width, paint.height - 5, 4);
          ctx.fill();

          // Silver shiny lid
          ctx.fillStyle = "#ddd";
          ctx.fillRect(paint.x + 10, paint.y, 10, 10);

          // Sparkle reflection glint
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.fillRect(paint.x + 3, paint.y + 8, 4, 10);
        }
      }

      // 5. Draw Monsters
      for (const monster of level.monsters) {
        const monsterTimeOffset = time * 8 + monster.x * 0.05;
        const bounceHeight = Math.abs(Math.sin(monsterTimeOffset)) * 4;
        if (monsterImg.current) {
          ctx.save();
          // Find center for mirroring
          const cx = monster.x + monster.width / 2;
          ctx.translate(cx, 0);

          // If moving left (vx < 0), flip horizontally.
          // If vx > 0, render normally (default image faces right).
          if (monster.vx < 0) {
            ctx.scale(-1, 1);
          }

          const drawX = -(monster.width / 2 + 20);
          ctx.drawImage(
            monsterImg.current,
            drawX,
            monster.y - 20 - bounceHeight,
            monster.width + 40,
            monster.height + 40
          );
          ctx.restore();
        } else {
          ctx.fillStyle = monster.color;
          ctx.beginPath();
          ctx.roundRect(monster.x, monster.y - bounceHeight, monster.width, monster.height, 8);
          ctx.fill();
        }
      }

      // 6. Draw Player (Candinho)
      const isMoving = Math.abs(player.vx) > 0.1;
      const walkTime = time * 18;
      const runBounceY = isMoving && player.onGround ? Math.abs(Math.sin(walkTime)) * 5 : 0;

      if (playerImg.current) {
        const drawX = player.x - 30;
        const drawY = player.y - 20 - runBounceY;
        if (player.facing === "right") {
          ctx.drawImage(playerImg.current, drawX, drawY, 160, 160);
        } else if (playerImgFlipped.current) {
          ctx.drawImage(playerImgFlipped.current, drawX, drawY, 160, 160);
        }
      } else {
        // Aesthetic fully detailed retro fallback avatar
        const faceDirMultiplier = player.facing === "right" ? 1 : -1;
        // Blue clothes
        ctx.fillStyle = "#4488ff";
        ctx.beginPath();
        ctx.roundRect(player.x + 5, player.y + 20 - runBounceY, player.width - 10, player.height - 20, 4);
        ctx.fill();

        // Peach skin Face
        ctx.fillStyle = "#ffcc80";
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2, player.y + 12 - runBounceY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Green artist beret hat
        ctx.fillStyle = "#2e7d32";
        ctx.beginPath();
        ctx.ellipse(player.x + player.width / 2, player.y + 4 - runBounceY, 16, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye dots
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2 + faceDirMultiplier * 5, player.y + 12 - runBounceY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2 + faceDirMultiplier * 2, player.y + 16 - runBounceY, 4, 0, Math.PI);
        ctx.stroke();
      }

      // 7. Draw Splash Particles
      for (const p of particlesRef.current) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (p.type === "smudge") {
          // Dark charcoal smudges sliding off the monsters
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "trail" || p.type === "dust") {
          // Circular colorful paint droplet trails
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "celebration" || p.type === "jump") {
          // Luminous paint sparkles
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.restore();
      }

      ctx.restore();
    },
    [playerImg, playerImgFlipped, monsterImg, bgImg, portinari1Img, portinari2Img, portinari3Img, portinari4Img, chorinhoImg, namoradosImg, baianaImg, descobrimentoImg, cafeImg]
  );

  // Physics Updates and Collisions Loop
  const updatePhysics = useCallback(() => {
    const player = playerRef.current;
    const level = activeLevelRef.current;
    const controls = controlsRef.current;

    // Frame increment for particle triggers
    frameCounterRef.current++;

    // Update active particles list
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.type === "jump" || p.type === "celebration" || p.type === "dust") {
        p.vy += 0.22; // Gravity simulation on paint drips
      }
      p.life--;
      p.alpha = p.life / p.maxLife;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    // Moving Platforms update
    for (const platform of level.platforms) {
      const isOnMovingPlatform =
        player.onGround &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width &&
        Math.abs(player.y + player.height - platform.y) < 2;

      if (platform.vx !== undefined && platform.minX !== undefined && platform.maxX !== undefined) {
        platform.x += platform.vx;
        if (platform.x <= platform.minX || platform.x + platform.width >= platform.maxX) {
          platform.vx *= -1;
        }
        if (isOnMovingPlatform) {
          player.x += platform.vx;
        }
      }

      if (platform.vy !== undefined && platform.minY !== undefined && platform.maxY !== undefined) {
        platform.y += platform.vy;
        if (platform.y <= platform.minY || platform.y >= platform.maxY) {
          platform.vy *= -1;
        }
        if (isOnMovingPlatform) {
          player.y += platform.vy;
        }
      }
    }

    // Horizontal Movement
    player.vx = 0;
    if (controls.has("left")) {
      player.vx = -Pf;
      player.facing = "left";
    }
    if (controls.has("right")) {
      player.vx = Pf;
      player.facing = "right";
    }

    // Add Candinho's colorful artist running trails at his feet
    if (Math.abs(player.vx) > 0.1 && player.onGround) {
      if (frameCounterRef.current % 4 === 0) {
        const spawnX = player.x + (player.facing === "right" ? 15 : player.width - 15);
        const spawnY = player.y + player.height;
        spawnParticles(spawnX, spawnY, 2, "trail");
      }
    }

    // Jumps with immediate jump particles
    if (controls.has("up") && player.onGround) {
      player.vy = kf;
      player.onGround = false;
      // Spawn outward/downward paint burst
      spawnParticles(player.x + player.width / 2, player.y + player.height, 12, "jump");
    }

    // Gravity pull
    player.vy += UE;

    const wasOnGround = player.onGround;
    player.x += player.vx;
    player.y += player.vy;
    player.onGround = false;

    // Collide with platforms
    for (const platform of level.platforms) {
      if (
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width &&
        player.y + player.height > platform.y &&
        player.y + player.height < platform.y + platform.height + 15 &&
        player.vy >= 0
      ) {
        player.y = platform.y - player.height;
        player.vy = 0;
        player.onGround = true;
      }
    }

    // Landing particles trigger (transition from air to ground)
    if (player.onGround && !wasOnGround) {
      spawnParticles(player.x + player.width / 2, player.y + player.height, 8, "dust");
    }

    // Horizontal boundaries
    if (player.x < 0) {
      player.x = 0;
    }
    if (player.x + player.width > Et) {
      player.x = Et - player.width;
    }
    if (player.y < 0) {
      player.y = 0;
    }

    // Abyss fall
    if (player.y > vn) {
      handlePlayerLostLife();
      return;
    }

    // Paint bucket collection
    let collectedCount = 0;
    for (const paint of level.paints) {
      if (paint.collected) {
        collectedCount++;
        continue;
      }
      if (
        player.x + player.width > paint.x &&
        player.x < paint.x + paint.width &&
        player.y + player.height > paint.y &&
        player.y < paint.y + paint.height
      ) {
        paint.collected = true;
        collectedCount++;
        sounds.playPoint();
        // Colorful explosion splash
        spawnParticles(paint.x + paint.width / 2, paint.y + paint.height / 2, 12, "celebration", paint.color);
      }
    }
    setPaintsCollected(collectedCount);

    // Monsters checks
    for (const monster of level.monsters) {
      // Pin platform monsters onto their parents
      if (monster.platformIdx !== undefined) {
        const plat = level.platforms[monster.platformIdx];
        if (plat) {
          monster.minX = plat.x;
          monster.maxX = plat.x + plat.width;
          monster.y = plat.y - monster.height;
        }
      } else {
        // Ground patrol covering the entire scenario width
        monster.minX = 20;
        monster.maxX = Et - 20;
      }

      // 🧠 Seeking & hunting AI for Candinho
      // Calculate chase direction towards Candinho
      const dx = player.x - monster.x;
      const faceDir = dx > 0 ? 1 : -1;
      
      // Establish a normal, fully controlled chasing speed
      const baseChaseSpeed = monster.platformIdx !== undefined ? 1.5 : 2.5;
      monster.vx = faceDir * baseChaseSpeed;

      // Apply movement
      monster.x += monster.vx;

      // Clamp to patrol/scenario boundaries
      if (monster.x < monster.minX) {
        monster.x = monster.minX;
      } else if (monster.x + monster.width > monster.maxX) {
        monster.x = monster.maxX - monster.width;
      }

      // Smudge ink trail sliding under slide monsters
      if (monster.x > 0 && frameCounterRef.current % 15 === 0) {
        spawnParticles(monster.x + monster.width / 2, monster.y + monster.height, 1, "smudge");
      }

      // Hit collision
      if (
        player.x + player.width > monster.x + 5 &&
        player.x < monster.x + monster.width - 5 &&
        player.y + player.height > monster.y + 5 &&
        player.y < monster.y + monster.height - 5
      ) {
        // Stomp from top -> Squash monster
        if (player.vy > 0 && player.y + player.height < monster.y + monster.height / 2) {
          if (monster.platformIdx !== undefined) {
            // Drop custom decorative paints under platform index monsters!
            const colorsList = ["#ff4081", "#ffd54f", "#4fc3f7", "#ba68c8"];
            level.paints.push({
              x: monster.x + monster.width / 2 - 15,
              y: monster.y - 10,
              width: 30,
              height: 40,
              color: colorsList[Math.floor(Math.random() * colorsList.length)],
              collected: false,
            });
            setTotalPaints((prev) => prev + 1);
            sounds.playPoint();
          }

          // Squash splat blast
          spawnParticles(monster.x + monster.width / 2, monster.y + monster.height / 2, 25, "celebration", monster.color);

          // Launch off-screen & bounce up
          monster.x = -1000;
          player.vy = kf * 0.6;
        } else {
          // Touch from side or below -> lose life
          handlePlayerLostLife();
          return;
        }
      }
    }

    // Touch Easel/Finished Level Check
    const goal = level.goal;
    const isLevelPaintsAllCollected = level.paints.every((p) => p.collected);
    if (
      isLevelPaintsAllCollected &&
      player.x + player.width > goal.x &&
      player.x < goal.x + goal.width &&
      player.y + player.height > goal.y &&
      player.y < goal.y + goal.height
    ) {
      if (currentLevelNumberRef.current < 5) {
        currentLevelNumberRef.current += 1;
        activeLevelRef.current = Ki(currentLevelNumberRef.current);
        setTotalPaints((prev) => prev + activeLevelRef.current.paints.length);
        resetPlayer();
        // Level completion easel fireworks splatters
        spawnParticles(goal.x + goal.width / 2, goal.y + goal.height / 2, 40, "celebration");
      } else {
        setGameState("victory");
        themeMusic.stop();
        sounds.playGameOver();
        // Epic final victory burst!
        spawnParticles(goal.x + goal.width / 2, goal.y + goal.height / 2, 80, "celebration");
      }
    }
  }, [handlePlayerLostLife, resetPlayer, themeMusic, sounds, spawnParticles]);

  // Main Canvas game Loop
  useEffect(() => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Et;
    canvas.height = vn;

    const gameTick = () => {
      updatePhysics();
      draw(ctx);
      requestRef.current = requestAnimationFrame(gameTick);
    };

    requestRef.current = requestAnimationFrame(gameTick);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, updatePhysics, draw]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        controlsRef.current.add("left");
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        controlsRef.current.add("right");
      }
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") {
        controlsRef.current.add("up");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        controlsRef.current.delete("left");
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        controlsRef.current.delete("right");
      }
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") {
        controlsRef.current.delete("up");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Touch screen controller commands
  const pressControl = (key: string) => controlsRef.current.add(key);
  const releaseControl = (key: string) => controlsRef.current.delete(key);

  return (
    <>
      {gameState === "opening" ? (
        <OpeningScreen onStart={startGame} />
      ) : (
        <div className="fixed inset-0 bg-[#070711] select-none overflow-hidden touch-none flex flex-col items-center justify-center p-1 sm:p-4">
          
          {/* Adaptable 16:9 Canvas Container */}
          <div 
            className="relative w-full h-full max-w-full max-h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#111126] to-[#040409] rounded-2xl border-4 border-accent/30 shadow-2xl"
            style={{
              maxWidth: "min(100vw - 12px, (100vh - 12px) * 16 / 9)",
              height: "auto",
              aspectRatio: "16 / 9",
            }}
          >
            <canvas ref={canvasRef} className="block w-full h-full" style={{ imageRendering: "auto" }} />
          </div>

          {/* Stats Bar */}
          <div className="fixed top-3 left-3 bg-[#0d0d1f]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-accent font-display text-sm md:text-lg text-accent z-50 pointer-events-none flex items-center gap-3.5 shadow-lg">
            <img
              src="https://i.imgur.com/UDl1c5j.png"
              alt="Candinho"
              className="w-7 h-7 rounded-full border border-accent/70 object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="w-px h-4 bg-accent/30" />
            <span className="flex items-center gap-1">❤️ <b className="font-sans text-white">{lives}</b></span>
            <span className="w-px h-4 bg-accent/30" />
            <span className="flex items-center gap-1">🎨 <b className="font-sans text-white">{paintsCollected}/{totalPaints}</b></span>
            <span className="w-px h-4 bg-accent/30" />
            <span className="text-xs bg-accent/20 px-2.5 py-0.5 rounded-full text-white font-sans font-medium">Nível {currentLevelNumberRef.current}</span>
          </div>

          {/* Touch Directional Controls for Left/Right movement */}
          <div className="fixed bottom-4 left-4 flex gap-3 z-50">
            <button
              className="bg-[#0d0d1f]/85 hover:bg-[#151533]/90 active:bg-accent active:text-accent-foreground backdrop-blur-md border-2 border-accent/70 w-16 h-16 md:w-20 md:h-20 text-xl md:text-2xl rounded-full font-display text-accent active:scale-95 transition-all touch-none flex items-center justify-center cursor-pointer shadow-xl select-none"
              onTouchStart={(e) => {
                e.preventDefault();
                pressControl("left");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                releaseControl("left");
              }}
              onMouseDown={() => pressControl("left")}
              onMouseUp={() => releaseControl("left")}
              onMouseLeave={() => releaseControl("left")}
            >
              ◀
            </button>
            <button
              className="bg-[#0d0d1f]/85 hover:bg-[#151533]/90 active:bg-accent active:text-accent-foreground backdrop-blur-md border-2 border-accent/70 w-16 h-16 md:w-20 md:h-20 text-xl md:text-2xl rounded-full font-display text-accent active:scale-95 transition-all touch-none flex items-center justify-center cursor-pointer shadow-xl select-none"
              onTouchStart={(e) => {
                e.preventDefault();
                pressControl("right");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                releaseControl("right");
              }}
              onMouseDown={() => pressControl("right")}
              onMouseUp={() => releaseControl("right")}
              onMouseLeave={() => releaseControl("right")}
            >
              ▶
            </button>
          </div>

          {/* Touch Jump Button */}
          <div className="fixed bottom-4 right-4 flex items-center gap-3 z-50">
            {/* Quick Level Reset Button placed on the bottom right for accessibility */}
            <button
              className="bg-[#0d0d1f]/70 hover:bg-[#151533]/80 backdrop-blur-md border border-accent/50 w-12 h-12 rounded-full font-display text-accent active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-lg"
              onClick={startGame}
              title="Resetar Jogo"
            >
              🔄
            </button>

            <button
              className="bg-[#0d0d1f]/85 hover:bg-[#151533]/90 active:bg-accent active:text-accent-foreground backdrop-blur-md border-2 border-accent/80 w-18 h-18 md:w-22 md:h-22 text-2xl md:text-3xl rounded-full font-display text-accent active:scale-95 transition-all touch-none flex items-center justify-center cursor-pointer shadow-xl select-none"
              onTouchStart={(e) => {
                e.preventDefault();
                pressControl("up");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                releaseControl("up");
              }}
              onMouseDown={() => pressControl("up")}
              onMouseUp={() => releaseControl("up")}
              onMouseLeave={() => releaseControl("up")}
            >
              ▲
            </button>
          </div>

          {/* Overlay for Victory/Game Over */}
          {(gameState === "gameover" || gameState === "victory") && (
            <GameOverOverlay
              onRestart={startGame}
              victory={gameState === "victory"}
              paintsCollected={paintsCollected}
              totalPaints={totalPaints}
            />
          )}
        </div>
      )}
    </>
  );
}
