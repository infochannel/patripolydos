import { motion } from "framer-motion";
import { 
  Sprout, Leaf, TreeDeciduous, Trees, Mountain, 
  Crown, Globe, Sparkles, Zap, LucideIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlipLevelCardProps {
  currentFlip: number;
  currentAmount: number;
  maxFlips: number;
  showAnimation?: boolean;
}

interface LevelData {
  level: number;
  name: string;
  stage: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// 🌱 ETAPA 1 · INICIO (Niveles 1–4)
// 🌿 ETAPA 2 · CRECIMIENTO (Niveles 5–8)
// 🌳 ETAPA 3 · CONSOLIDACIÓN (Niveles 9–12)
// 🍃 ETAPA 4 · EXPANSIÓN (Niveles 13–16)
// 🌍 ETAPA 5 · MAESTRÍA (Niveles 17–20)

const levelData: LevelData[] = [
  // ETAPA 1 · INICIO
  { level: 1, name: "Semilla", stage: "Inicio", icon: Sprout, color: "from-lime-400 to-lime-600", bgColor: "bg-lime-500/10" },
  { level: 2, name: "Germinación", stage: "Inicio", icon: Sprout, color: "from-lime-500 to-green-500", bgColor: "bg-lime-500/10" },
  { level: 3, name: "Brote", stage: "Inicio", icon: Leaf, color: "from-green-400 to-green-600", bgColor: "bg-green-500/10" },
  { level: 4, name: "Plántula", stage: "Inicio", icon: Leaf, color: "from-green-500 to-emerald-500", bgColor: "bg-green-500/10" },
  // ETAPA 2 · CRECIMIENTO
  { level: 5, name: "Planta joven", stage: "Crecimiento", icon: TreeDeciduous, color: "from-emerald-400 to-emerald-600", bgColor: "bg-emerald-500/10" },
  { level: 6, name: "Planta", stage: "Crecimiento", icon: TreeDeciduous, color: "from-emerald-500 to-teal-500", bgColor: "bg-emerald-500/10" },
  { level: 7, name: "Planta fuerte", stage: "Crecimiento", icon: TreeDeciduous, color: "from-teal-400 to-teal-600", bgColor: "bg-teal-500/10" },
  { level: 8, name: "Arbusto", stage: "Crecimiento", icon: TreeDeciduous, color: "from-teal-500 to-cyan-500", bgColor: "bg-teal-500/10" },
  // ETAPA 3 · CONSOLIDACIÓN
  { level: 9, name: "Árbol joven", stage: "Consolidación", icon: TreeDeciduous, color: "from-cyan-400 to-cyan-600", bgColor: "bg-cyan-500/10" },
  { level: 10, name: "Árbol", stage: "Consolidación", icon: TreeDeciduous, color: "from-cyan-500 to-blue-500", bgColor: "bg-cyan-500/10" },
  { level: 11, name: "Árbol robusto", stage: "Consolidación", icon: TreeDeciduous, color: "from-blue-400 to-blue-600", bgColor: "bg-blue-500/10" },
  { level: 12, name: "Árbol maduro", stage: "Consolidación", icon: TreeDeciduous, color: "from-blue-500 to-indigo-500", bgColor: "bg-blue-500/10" },
  // ETAPA 4 · EXPANSIÓN
  { level: 13, name: "Árbol fructífero", stage: "Expansión", icon: Trees, color: "from-indigo-400 to-indigo-600", bgColor: "bg-indigo-500/10" },
  { level: 14, name: "Bosque incipiente", stage: "Expansión", icon: Trees, color: "from-indigo-500 to-purple-500", bgColor: "bg-indigo-500/10" },
  { level: 15, name: "Bosque", stage: "Expansión", icon: Trees, color: "from-purple-400 to-purple-600", bgColor: "bg-purple-500/10" },
  { level: 16, name: "Bosque próspero", stage: "Expansión", icon: Trees, color: "from-purple-500 to-pink-500", bgColor: "bg-purple-500/10" },
  // ETAPA 5 · MAESTRÍA
  { level: 17, name: "Ecosistema", stage: "Maestría", icon: Globe, color: "from-pink-400 to-pink-600", bgColor: "bg-pink-500/10" },
  { level: 18, name: "Territorio fértil", stage: "Maestría", icon: Mountain, color: "from-amber-400 to-amber-600", bgColor: "bg-amber-500/10" },
  { level: 19, name: "Dominio", stage: "Maestría", icon: Crown, color: "from-orange-400 to-orange-600", bgColor: "bg-orange-500/10" },
  { level: 20, name: "Legado", stage: "Maestría", icon: Crown, color: "from-yellow-400 to-amber-500", bgColor: "bg-yellow-500/10" },
];

const getFlipLevel = (flip: number): LevelData => {
  // Cada flip corresponde directamente a un nivel (1-20)
  const levelIndex = Math.min(Math.max(flip - 1, 0), 19);
  return levelData[levelIndex];
};

export function FlipLevelCard({ currentFlip, currentAmount, maxFlips, showAnimation = false }: FlipLevelCardProps) {
  const currentLevel = getFlipLevel(currentFlip);
  const nextLevel = getFlipLevel(Math.min(currentFlip + 1, 20));
  const Icon = currentLevel.icon;
  
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M€`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K€`;
    return `${amount}€`;
  };

  // Progreso dentro del nivel actual hacia el siguiente
  const isMaxLevel = currentFlip >= 20;
  const levelProgress = isMaxLevel ? 100 : 0;

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
                  Etapa: {currentLevel.stage}
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
                Nivel {currentLevel.level}: {currentLevel.name}
              </motion.h3>
              
              <p className="text-sm text-muted-foreground mt-1">
                Flip {currentFlip} de {maxFlips}
              </p>

              {/* Progress to next level */}
              {!isMaxLevel && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Siguiente nivel</span>
                    <span>{nextLevel.name}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={cn("h-full bg-gradient-to-r", currentLevel.color)}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
              {isMaxLevel && (
                <div className="mt-3 text-xs text-amber-500 font-medium flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  ¡Reto completado!
                </div>
              )}
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
