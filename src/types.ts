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

export function getAssetPath(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  if (baseUrl === './' || baseUrl === '.') {
    return cleanPath;
  }
  return baseUrl.endsWith('/') ? `${baseUrl}${cleanPath}` : `${baseUrl}/${cleanPath}`;
}

