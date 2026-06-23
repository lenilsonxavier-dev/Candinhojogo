export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  onGround: boolean;
  color: string;
  facing: "left" | "right";
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  vx?: number;
  vy?: number;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
}

export interface Paint {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  collected: boolean;
  isTintolinoPot?: boolean;
}

export interface Monster {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  color: string;
  minX: number;
  maxX: number;
  platformIdx?: number;
  isTintolino?: boolean;
  defeated?: boolean;
}

export interface Level {
  platforms: Platform[];
  paints: Paint[];
  monsters: Monster[];
  goal: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: "trail" | "jump" | "dust" | "smudge" | "celebration";
}

export type GameState = "opening" | "playing" | "gameover" | "victory" | "level_completed_showcase";

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export function getAssetPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  if (baseUrl === './' || baseUrl === '.') {
    return cleanPath;
  }
  return baseUrl.endsWith('/') ? `${baseUrl}${cleanPath}` : `${baseUrl}/${cleanPath}`;
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem("candinho_leaderboard");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Erro ao carregar ranking:", e);
  }
  // Default records to mock initial friendly competition for kids
  const defaults: LeaderboardEntry[] = [
    { name: "Pequeno Tarsila", score: 2500, date: new Date().toLocaleDateString("pt-BR") },
    { name: "Candinho Jr.", score: 1800, date: new Date().toLocaleDateString("pt-BR") },
    { name: "Beatriz Artista", score: 1200, date: new Date().toLocaleDateString("pt-BR") },
    { name: "Lucas Desenho", score: 600, date: new Date().toLocaleDateString("pt-BR") },
  ];
  return defaults;
}

export function saveLeaderboardScore(name: string, score: number): LeaderboardEntry[] {
  const current = getLeaderboard();
  const cleanName = name.trim() || "Artista";
  const newEntry: LeaderboardEntry = {
    name: cleanName,
    score: score,
    date: new Date().toLocaleDateString("pt-BR"),
  };
  
  // Add new entry, sort descending, limit to top 8
  const updated = [...current, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
    
  try {
    localStorage.setItem("candinho_leaderboard", JSON.stringify(updated));
  } catch (e) {
    console.error("Erro ao salvar no ranking:", e);
  }
  return updated;
}


