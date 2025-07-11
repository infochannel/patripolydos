import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Crown } from "lucide-react";

interface PatrimonioLevelBarProps {
  level: string;
  progress: number;
}

const levelIcons = {
  "Nuevo Inversor": Star,
  "Beginner": Trophy,
  "Intermedio": Crown,
  "Avanzado": Crown,
  "Experto": Crown
};

const levelColors = {
  "Nuevo Inversor": "text-brand-yellow",
  "Beginner": "text-accent",
  "Intermedio": "text-success",
  "Avanzado": "text-primary",
  "Experto": "text-brand-teal"
};

export function PatrimonioLevelBar({ level, progress }: PatrimonioLevelBarProps) {
  const Icon = levelIcons[level as keyof typeof levelIcons] || Star;
  const colorClass = levelColors[level as keyof typeof levelColors] || "text-accent";

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
              <p className="text-sm text-muted-foreground">{level}</p>
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
            <span>Progreso actual</span>
            <span>Siguiente nivel: {progress < 100 ? `${100 - progress}% restante` : '¡Completado!'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}