import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Wallet, 
  TrendingUp, 
  Target, 
  Repeat, 
  DollarSign, 
  PiggyBank, 
  ShoppingCart, 
  Share 
} from "lucide-react";

const modules = [
  {
    id: "estudios",
    title: "Centro de Estudios",
    description: "Educación financiera",
    icon: BookOpen,
    variant: "default",
    color: "bg-gradient-primary"
  },
  {
    id: "patrimonio",
    title: "Patrimonio",
    description: "Valor neto total",
    icon: Wallet,
    variant: "success",
    color: "bg-gradient-success"
  },
  {
    id: "cashflow",
    title: "Cashflow",
    description: "Ingresos pasivos",
    icon: TrendingUp,
    variant: "teal",
    color: "bg-accent"
  },
  {
    id: "calidad-vida",
    title: "Calidad de Vida",
    description: "Estilo de vida deseado",
    icon: Target,
    variant: "wealth",
    color: "bg-gradient-wealth"
  },
  {
    id: "duplicador",
    title: "Duplicador",
    description: "Reto 1€ a 1M€",
    icon: Repeat,
    variant: "success",
    color: "bg-brand-teal"
  },
  {
    id: "ingresos",
    title: "Ingresos",
    description: "Ingresos activos",
    icon: DollarSign,
    variant: "default",
    color: "bg-primary"
  },
  {
    id: "ahorros",
    title: "Ahorros",
    description: "Fondo de emergencia",
    icon: PiggyBank,
    variant: "teal",
    color: "bg-accent"
  },
  {
    id: "gastos",
    title: "Gastos",
    description: "Control de gastos",
    icon: ShoppingCart,
    variant: "default",
    color: "bg-muted-foreground"
  },
  {
    id: "promotor",
    title: "Promotor",
    description: "Programa de referidos",
    icon: Share,
    variant: "wealth",
    color: "bg-gradient-wealth"
  }
];

interface ModuleButtonsProps {
  onModuleClick: (moduleId: string) => void;
}

export function ModuleButtons({ onModuleClick }: ModuleButtonsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => {
        const Icon = module.icon;
        
        return (
          <Card 
            key={module.id}
            className="group relative overflow-hidden cursor-pointer shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-[1.02]"
            onClick={() => onModuleClick(module.id)}
          >
            <div className={`absolute inset-0 ${module.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${module.color} flex-shrink-0`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary text-lg mb-1 group-hover:text-accent transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant={module.variant as any}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onModuleClick(module.id);
                  }}
                >
                  Abrir módulo
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}