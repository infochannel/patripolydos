import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Crown, Target, Zap, TrendingUp, Award, Medal, Gem, Sparkles } from "lucide-react";
import { getCurrentWealthLevel, getNextWealthLevel, getWealthProgress } from "@/lib/wealth-levels";

interface PatrimonioLevelBarProps {
  wealth: number;
}

const levelIcons = {
  1: Star,
  2: Trophy,
  3: Target,
  4: Zap,
  5: TrendingUp,
  6: Award,
  7: Medal,
  8: Crown,
  9: Gem,
  10: Sparkles
};

const levelColors = {
  1: "text-yellow-500",
  2: "text-orange-500",
  3: "text-blue-500",
  4: "text-green-500",
  5: "text-purple-500",
  6: "text-red-500",
  7: "text-pink-500",
  8: "text-amber-500",
  9: "text-violet-500",
  10: "text-gold"
};

export function PatrimonioLevelBar({ wealth }: PatrimonioLevelBarProps) {
  const currentLevel = getCurrentWealthLevel(wealth);
  const nextLevel = getNextWealthLevel(wealth);
  const progress = getWealthProgress(wealth);
  
  const Icon = levelIcons[currentLevel.level as keyof typeof levelIcons] || Star;
  const colorClass = levelColors[currentLevel.level as keyof typeof levelColors] || "text-accent";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-gradient-primary ${colorClass}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Nivel de Patrimonio</h3>
              <p className="text-sm text-muted-foreground">Nivel {currentLevel.level}: {currentLevel.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">{progress}%</p>
            <p className="text-xs text-muted-foreground">Completado</p>
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Patrimonio actual: {formatCurrency(wealth)}</span>
            {nextLevel ? (
              <span>Siguiente: {formatCurrency(nextLevel.minWealth)}</span>
            ) : (
              <span>¡Nivel máximo alcanzado!</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}