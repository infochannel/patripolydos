export interface WealthLevel {
  level: number;
  name: string;
  minWealth: number;
  maxWealth: number;
  description: string;
}

export const WEALTH_LEVELS: WealthLevel[] = [
  { level: 1, name: "Iniciador", minWealth: 0, maxWealth: 499, description: "Every empire starts with a single coin. You're on the path to building yours." },
  { level: 2, name: "Constructor", minWealth: 500, maxWealth: 999, description: "You're laying down the foundation of your fortune. Keep going!" },
  { level: 3, name: "Visionario", minWealth: 1000, maxWealth: 4999, description: "You've begun to think like an investor. Vision brings momentum." },
  { level: 4, name: "Arquitecto", minWealth: 5000, maxWealth: 19999, description: "You're designing the future with every move. Growth is now intentional." },
  { level: 5, name: "Estratega", minWealth: 20000, maxWealth: 99999, description: "Strategy is your ally. You've crossed into serious builder territory." },
  { level: 6, name: "Ejecutivo", minWealth: 100000, maxWealth: 499999, description: "You manage capital with confidence. The game is getting interesting." },
  { level: 7, name: "Magnate", minWealth: 500000, maxWealth: 999999, description: "Halfway to the million. You're already someone others admire." },
  { level: 8, name: "Millonario", minWealth: 1000000, maxWealth: 1999999, description: "You did it! Welcome to the Millionaire's Club. Keep your focus and expand wisely." },
  { level: 9, name: "Multi-Millonario", minWealth: 2000000, maxWealth: 9999999, description: "Your wealth multiplies. You've mastered the art of growth." },
  { level: 10, name: "Patrimono Legendario", minWealth: 10000000, maxWealth: Infinity, description: "You're building legacy, not just capital. Few reach this far — and you're one of them." }
];

export function getCurrentWealthLevel(wealth: number): WealthLevel {
  return WEALTH_LEVELS.find(level => wealth >= level.minWealth && wealth <= level.maxWealth) || WEALTH_LEVELS[0];
}

export function getNextWealthLevel(wealth: number): WealthLevel | null {
  const currentLevel = getCurrentWealthLevel(wealth);
  return WEALTH_LEVELS.find(level => level.level === currentLevel.level + 1) || null;
}

export function getWealthProgress(wealth: number): number {
  const currentLevel = getCurrentWealthLevel(wealth);
  const nextLevel = getNextWealthLevel(wealth);
  
  if (!nextLevel) return 100; // Already at max level
  
  const progressWithinLevel = wealth - currentLevel.minWealth;
  const levelRange = nextLevel.minWealth - currentLevel.minWealth;
  
  return Math.round((progressWithinLevel / levelRange) * 100);
}