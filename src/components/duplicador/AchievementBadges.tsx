import { motion } from "framer-motion";
import { 
  Flame, Zap, Award, TrendingUp, Calendar, 
  Target, Rocket, Star, Crown, Medal 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActionLog {
  flip: number;
  date: string;
}

interface AchievementBadgesProps {
  currentFlip: number;
  actionLogs: ActionLog[];
  currentAmount: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: typeof Flame;
  color: string;
  bgColor: string;
  check: (flip: number, logs: ActionLog[], amount: number) => boolean;
}

const achievements: Achievement[] = [
  {
    id: "level_1",
    name: "Primer paso",
    description: "Lograste tu primer flip. Ya no estás pensando en empezar: ya empezaste.",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    check: (flip) => flip > 1
  },
  {
    id: "level_3",
    name: "En movimiento",
    description: "Has completado varios flips. La acción empieza a reemplazar a la duda.",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    check: (flip) => flip > 3
  },
  {
    id: "level_5",
    name: "En racha",
    description: "Completaste 5 flips. La constancia empieza a jugar a tu favor.",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    check: (flip) => flip > 5
  },
  {
    id: "level_8",
    name: "Documentador",
    description: "Has registrado al menos 20 pasos del proceso. Aprender de lo que haces te hace avanzar más rápido.",
    icon: Calendar,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    check: (_, logs) => logs.length >= 20
  },
  {
    id: "level_10",
    name: "Mitad del camino",
    description: "Alcanzaste tus primeros 1.000 €. El reto deja de ser teórico: ya es real.",
    icon: Target,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    check: (_, __, amount) => amount >= 1000
  },
  {
    id: "level_13",
    name: "Imparable",
    description: "Has acumulado 8.000 €. Tu progreso ya no es casual, es consecuencia.",
    icon: Award,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    check: (_, __, amount) => amount >= 8000
  },
  {
    id: "level_15",
    name: "A toda potencia",
    description: "Completaste 15 flips. Estás operando con foco, experiencia y ritmo.",
    icon: Rocket,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    check: (flip) => flip > 15
  },
  {
    id: "level_17",
    name: "Cambio de liga",
    description: "Superaste las seis cifras (+100.000 €). Ya no juegas el mismo juego que al inicio.",
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    check: (_, __, amount) => amount >= 100000
  },
  {
    id: "level_19",
    name: "A un paso",
    description: "Alcanzaste el medio millón. La meta está tan cerca que se siente.",
    icon: Medal,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    check: (_, __, amount) => amount >= 500000
  },
  {
    id: "level_20",
    name: "Millonario",
    description: "Completaste el reto del Duplicador. Lograste lo que muy pocos terminan.",
    icon: Crown,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    check: (flip) => flip > 20
  }
];

export function AchievementBadges({ currentFlip, actionLogs, currentAmount }: AchievementBadgesProps) {
  const unlockedAchievements = achievements.filter(a => 
    a.check(currentFlip, actionLogs, currentAmount)
  );
  
  const lockedAchievements = achievements.filter(a => 
    !a.check(currentFlip, actionLogs, currentAmount)
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Logros
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {unlockedAchievements.length}/{achievements.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {/* Unlocked achievements */}
          {unlockedAchievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                className="group relative"
              >
                <div className={cn(
                  "w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300",
                  achievement.bgColor,
                  "border-2 border-transparent hover:border-current",
                  achievement.color
                )}>
                  <Icon className={cn("h-5 w-5", achievement.color)} />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  <p className="text-xs font-medium">{achievement.name}</p>
                  <p className="text-[10px] text-muted-foreground">{achievement.description}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Locked achievements */}
          {lockedAchievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className="group relative"
              >
                <div className="w-full aspect-square rounded-xl flex items-center justify-center bg-muted/30 border border-muted">
                  <Icon className="h-5 w-5 text-muted-foreground/30" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  <p className="text-xs font-medium text-muted-foreground">{achievement.name}</p>
                  <p className="text-[10px] text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
