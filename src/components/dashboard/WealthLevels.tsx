import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, Trophy, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WEALTH_LEVELS = [
  {
    level: 1,
    name: "Iniciador",
    range: "0 – 499",
    minWealth: 0,
    maxWealth: 499,
    message: "Every empire starts with a single coin. You're on the path to building yours.",
    icon: Star,
    color: "bg-slate-500"
  },
  {
    level: 2,
    name: "Constructor",
    range: "500 – 999",
    minWealth: 500,
    maxWealth: 999,
    message: "You're laying down the foundation of your fortune. Keep going!",
    icon: TrendingUp,
    color: "bg-amber-500"
  },
  {
    level: 3,
    name: "Visionario",
    range: "1,000 – 4,999",
    minWealth: 1000,
    maxWealth: 4999,
    message: "You've begun to think like an investor. Vision brings momentum.",
    icon: TrendingUp,
    color: "bg-orange-500"
  },
  {
    level: 4,
    name: "Arquitecto",
    range: "5,000 – 19,999",
    minWealth: 5000,
    maxWealth: 19999,
    message: "You're designing the future with every move. Growth is now intentional.",
    icon: TrendingUp,
    color: "bg-blue-500"
  },
  {
    level: 5,
    name: "Estratega",
    range: "20,000 – 99,999",
    minWealth: 20000,
    maxWealth: 99999,
    message: "Strategy is your ally. You've crossed into serious builder territory.",
    icon: Trophy,
    color: "bg-purple-500"
  },
  {
    level: 6,
    name: "Impulsor",
    range: "100,000 – 499,999",
    minWealth: 100000,
    maxWealth: 499999,
    message: "You manage capital with confidence. The game is getting interesting.",
    icon: Trophy,
    color: "bg-green-500"
  },
  {
    level: 7,
    name: "Magnate",
    range: "500,000 – 999,999",
    minWealth: 500000,
    maxWealth: 999999,
    message: "Halfway to the million. You're already someone others admire.",
    icon: Crown,
    color: "bg-indigo-500"
  },
  {
    level: 8,
    name: "Millonario",
    range: "1,000,000 – 1,999,999",
    minWealth: 1000000,
    maxWealth: 1999999,
    message: "You did it! Welcome to the Millionaire's Club. Keep your focus and expand wisely.",
    icon: Crown,
    color: "bg-yellow-500"
  },
  {
    level: 9,
    name: "Multi-Millonario",
    range: "2,000,000 – 9,999,999",
    minWealth: 2000000,
    maxWealth: 9999999,
    message: "Your wealth multiplies. You've mastered the art of growth.",
    icon: Crown,
    color: "bg-pink-500"
  },
  {
    level: 10,
    name: "Patrimonio Legendario",
    range: "10,000,000+",
    minWealth: 10000000,
    maxWealth: Infinity,
    message: "You're building legacy, not just capital. Few reach this far — and you're one of them.",
    icon: Crown,
    color: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
  }
];

interface WealthLevelsProps {
  currentWealth: number;
}

export function WealthLevels({ currentWealth }: WealthLevelsProps) {
  const { toast } = useToast();
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);

  const getCurrentLevel = (wealth: number) => {
    return WEALTH_LEVELS.find(level => 
      wealth >= level.minWealth && wealth <= level.maxWealth
    ) || WEALTH_LEVELS[0];
  };

  const currentLevel = getCurrentLevel(currentWealth);
  const nextLevel = WEALTH_LEVELS.find(level => level.level === currentLevel.level + 1);

  const getProgressToNextLevel = () => {
    if (!nextLevel) return 100; // Max level reached
    
    const progressInCurrentLevel = currentWealth - currentLevel.minWealth;
    const currentLevelRange = currentLevel.maxWealth - currentLevel.minWealth + 1;
    return Math.min((progressInCurrentLevel / currentLevelRange) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Check for level up
  useEffect(() => {
    const savedLevel = localStorage.getItem('patripoly_previous_level');
    if (savedLevel) {
      const prevLevel = parseInt(savedLevel);
      if (currentLevel.level > prevLevel) {
        toast({
          title: "🎉 ¡Felicidades!",
          description: `¡Has alcanzado el nivel ${currentLevel.name}!`,
        });
      }
    }
    
    localStorage.setItem('patripoly_previous_level', currentLevel.level.toString());
  }, [currentLevel.level, toast]);

  return (
    <div className="space-y-6">
      {/* Current Level Card */}
      <Card className="bg-gradient-primary text-white shadow-glow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            <currentLevel.icon className="h-6 w-6" />
            Tu Nivel Actual: {currentLevel.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center text-sm opacity-90">
            <span>Patrimonio Actual</span>
            <span className="font-bold">{formatCurrency(currentWealth)}</span>
          </div>
          
          {nextLevel && (
            <>
              <div className="flex justify-between items-center text-sm opacity-90">
                <span>Próximo Nivel: {nextLevel.name}</span>
                <span>{formatCurrency(nextLevel.minWealth)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs opacity-75">
                  <span>Progreso al siguiente nivel</span>
                  <span>{Math.round(getProgressToNextLevel())}%</span>
                </div>
                <Progress 
                  value={getProgressToNextLevel()} 
                  className="bg-white/20 [&>div]:bg-white"
                />
              </div>
            </>
          )}
          
          <p className="text-sm opacity-90 italic">
            "{currentLevel.message}"
          </p>
        </CardContent>
      </Card>

      {/* Levels Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Niveles de Patrimonio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full space-y-2">
              {WEALTH_LEVELS.map((level) => {
                const isCurrentLevel = level.level === currentLevel.level;
                const isCompleted = currentWealth > level.maxWealth;
                
                return (
                  <div
                    key={level.level}
                    className={`
                      p-4 rounded-lg border transition-all duration-200
                      ${isCurrentLevel 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : isCompleted 
                        ? 'border-green-200 bg-green-50/50' 
                        : 'border-muted bg-card hover:bg-muted/30'
                      }
                    `}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                      {/* Level & Name */}
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={isCurrentLevel ? "default" : isCompleted ? "secondary" : "outline"}
                          className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                        >
                          {level.level}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <level.icon className={`h-4 w-4 ${isCurrentLevel ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`font-medium ${isCurrentLevel ? 'text-primary' : ''}`}>
                            {level.name}
                          </span>
                          {isCurrentLevel && (
                            <Badge variant="default" className="text-xs ml-2">
                              ACTUAL
                            </Badge>
                          )}
                          {isCompleted && !isCurrentLevel && (
                            <Badge variant="secondary" className="text-xs ml-2">
                              ✓
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Wealth Range */}
                      <div className="text-sm text-muted-foreground md:text-center">
                        €{level.range}
                      </div>

                      {/* Message */}
                      <div className="text-sm text-muted-foreground md:col-span-2">
                        {level.message}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}