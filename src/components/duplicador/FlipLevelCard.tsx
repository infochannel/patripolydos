import { motion } from "framer-motion";
import { 
  Sprout, Leaf, TreeDeciduous, Mountain, Rocket, 
  Gem, Crown, Trophy, Star, Sparkles, Zap 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlipLevelCardProps {
  currentFlip: number;
  currentAmount: number;
  maxFlips: number;
  showAnimation?: boolean;
}

const levelData = [
  { level: 1, name: "Semilla", icon: Sprout, color: "from-green-400 to-green-600", bgColor: "bg-green-500/10" },
  { level: 2, name: "Brote", icon: Leaf, color: "from-green-500 to-emerald-600", bgColor: "bg-emerald-500/10" },
  { level: 3, name: "Planta", icon: TreeDeciduous, color: "from-emerald-500 to-teal-600", bgColor: "bg-teal-500/10" },
  { level: 4, name: "Árbol", icon: TreeDeciduous, color: "from-teal-500 to-cyan-600", bgColor: "bg-cyan-500/10" },
  { level: 5, name: "Bosque", icon: Mountain, color: "from-cyan-500 to-blue-600", bgColor: "bg-blue-500/10" },
  { level: 6, name: "Montaña", icon: Mountain, color: "from-blue-500 to-indigo-600", bgColor: "bg-indigo-500/10" },
  { level: 7, name: "Cohete", icon: Rocket, color: "from-indigo-500 to-purple-600", bgColor: "bg-purple-500/10" },
  { level: 8, name: "Estrella", icon: Star, color: "from-purple-500 to-pink-600", bgColor: "bg-pink-500/10" },
  { level: 9, name: "Diamante", icon: Gem, color: "from-pink-500 to-rose-600", bgColor: "bg-rose-500/10" },
  { level: 10, name: "Corona", icon: Crown, color: "from-amber-400 to-orange-600", bgColor: "bg-orange-500/10" },
  { level: 11, name: "Leyenda", icon: Trophy, color: "from-yellow-400 to-amber-600", bgColor: "bg-amber-500/10" },
];

const getFlipLevel = (flip: number) => {
  if (flip <= 2) return levelData[0];
  if (flip <= 4) return levelData[1];
  if (flip <= 6) return levelData[2];
  if (flip <= 8) return levelData[3];
  if (flip <= 10) return levelData[4];
  if (flip <= 12) return levelData[5];
  if (flip <= 14) return levelData[6];
  if (flip <= 16) return levelData[7];
  if (flip <= 18) return levelData[8];
  if (flip <= 20) return levelData[9];
  return levelData[10];
};

export function FlipLevelCard({ currentFlip, currentAmount, maxFlips, showAnimation = false }: FlipLevelCardProps) {
  const currentLevel = getFlipLevel(currentFlip);
  const nextLevel = getFlipLevel(currentFlip + 2);
  const Icon = currentLevel.icon;
  
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M€`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K€`;
    return `${amount}€`;
  };

  const levelProgress = ((currentFlip - 1) % 2) / 2 * 100 + 50;

  return (
    <motion.div
      initial={showAnimation ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
    >
      <Card className={cn(
        "relative overflow-hidden border-2",
        currentLevel.bgColor
      )}>
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {showAnimation && Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: "50%", 
                y: "50%", 
                opacity: 1,
                scale: 0 
              }}
              animate={{ 
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 100}%`, 
                opacity: 0,
                scale: 1.5
              }}
              transition={{ 
                duration: 1 + Math.random(), 
                delay: Math.random() * 0.3 
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </motion.div>
          ))}
        </div>

        <CardContent className="pt-6 pb-6 relative z-10">
          <div className="flex items-center gap-6">
            {/* Level Icon with animated ring */}
            <motion.div 
              className={cn(
                "relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br",
                currentLevel.color
              )}
              animate={showAnimation ? { 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-white/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <Icon className="h-10 w-10 text-white drop-shadow-lg" />
              
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 bg-background border-2 border-primary rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-primary">{currentLevel.level}</span>
              </div>
            </motion.div>

            {/* Level Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nivel {currentLevel.level}
                </span>
                <Zap className="h-3 w-3 text-yellow-500" />
              </div>
              
              <motion.h3 
                className={cn(
                  "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                  currentLevel.color
                )}
                animate={showAnimation ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {currentLevel.name}
              </motion.h3>
              
              <p className="text-sm text-muted-foreground mt-1">
                Flip {currentFlip} de {maxFlips}
              </p>

              {/* Progress to next level */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progreso al siguiente nivel</span>
                  <span>{nextLevel.name}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full bg-gradient-to-r", currentLevel.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Current Amount */}
            <div className="text-right">
              <motion.div 
                className="text-3xl font-bold text-foreground"
                animate={showAnimation ? { 
                  scale: [1, 1.2, 1],
                  color: ["hsl(var(--foreground))", "hsl(142 76% 36%)", "hsl(var(--foreground))"]
                } : {}}
                transition={{ duration: 0.6 }}
              >
                {formatCurrency(currentAmount)}
              </motion.div>
              <p className="text-xs text-muted-foreground">Cantidad actual</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { getFlipLevel, levelData };
