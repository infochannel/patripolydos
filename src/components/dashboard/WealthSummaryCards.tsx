import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Wallet, Target, PiggyBank } from "lucide-react";

interface WealthData {
  patrimonioTotal: number;
  cashflow: number;
  ingresosActivos: number;
  nivelAhorro: number;
  progresoCalidadVida: number;
}

interface WealthSummaryCardsProps {
  data: WealthData;
  onCardClick?: (cardType: string) => void;
}

export function WealthSummaryCards({ data, onCardClick }: WealthSummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      id: "patrimonio",
      title: "Patrimonio Total",
      value: formatCurrency(data.patrimonioTotal),
      icon: Wallet,
      trend: data.patrimonioTotal > 0 ? "up" : "down",
      bgGradient: "bg-gradient-primary",
      description: "Valor neto total",
      clickable: true
    },
    {
      id: "cashflow",
      title: "Cashflow Mensual",
      value: formatCurrency(data.cashflow),
      icon: TrendingUp,
      trend: data.cashflow > 0 ? "up" : "down",
      bgGradient: "bg-gradient-success",
      description: "Ingresos pasivos",
      clickable: true
    },
    {
      id: "ingresos-activos",
      title: "Ingresos Activos",
      value: formatCurrency(data.ingresosActivos),
      icon: DollarSign,
      trend: "up",
      bgGradient: "bg-gradient-wealth",
      description: "Ingresos del trabajo",
      clickable: true
    },
    {
      id: "ahorros",
      title: "Nivel de Ahorro",
      value: `${data.nivelAhorro}%`,
      icon: PiggyBank,
      trend: data.nivelAhorro > 20 ? "up" : "down",
      bgGradient: "bg-accent",
      description: "De tus ingresos",
      clickable: true
    },
    {
      id: "calidad",
      title: "Calidad de Vida",
      value: `${data.progresoCalidadVida}%`,
      icon: Target,
      trend: data.progresoCalidadVida > 50 ? "up" : "down",
      bgGradient: "bg-brand-teal",
      description: "Objetivo alcanzado",
      clickable: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <Card 
            key={index} 
            className={`relative overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] group ${
              card.clickable ? 'cursor-pointer' : 'cursor-default'
            }`}
            onClick={() => card.clickable && onCardClick?.(card.id)}
          >
            <div className={`absolute inset-0 ${card.bgGradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {card.title}
                <div className={`p-2 rounded-full ${card.bgGradient}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-primary">{card.value}</div>
                  <TrendIcon 
                    className={`h-4 w-4 ${
                      card.trend === "up" ? "text-success" : "text-destructive"
                    }`} 
                  />
                </div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}