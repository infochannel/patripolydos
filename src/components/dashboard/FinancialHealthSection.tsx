import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet, DollarSign, PiggyBank, ShoppingCart } from "lucide-react";

interface FinancialHealthSectionProps {
  wealthData: {
    patrimonioTotal: number;
    cashflow: number;
    gastos: number;
    nivelAhorro: number;
  };
}

export function FinancialHealthSection({ wealthData }: FinancialHealthSectionProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Cálculos según especificaciones
  const patrimonioMinimum = wealthData.patrimonioTotal * 0.0075; // 0.75%
  const costoVidaMaximum = wealthData.patrimonioTotal * 0.0075; // 0.75%
  const ahorroMinimum = wealthData.gastos * 3;

  // Indicadores de color
  const cashflowHealthy = patrimonioMinimum < wealthData.cashflow;
  const costoVidaHealthy = costoVidaMaximum > wealthData.gastos;
  const ahorroHealthy = ahorroMinimum < wealthData.nivelAhorro;

  const getHealthBadge = (isHealthy: boolean) => (
    <Badge 
      variant={isHealthy ? "default" : "destructive"} 
      className={`ml-2 ${isHealthy ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
    >
      {isHealthy ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
    </Badge>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-primary">Salud Financiera</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Tarjeta 1: Patrimonio */}
        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-semibold">
              <Wallet className="w-5 h-5 mr-2 text-primary" />
              Patrimonio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(wealthData.patrimonioTotal)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Tu patrimonio neto actual
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta 2: Cashflow */}
        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-semibold">
              <DollarSign className="w-5 h-5 mr-2 text-primary" />
              Cashflow
              {getHealthBadge(cashflowHealthy)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Tus ingresos pasivos</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Mínimo:</p>
              <p className="text-lg font-semibold">{formatCurrency(patrimonioMinimum)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Real:</p>
              <p className="text-lg font-semibold text-primary">{formatCurrency(wealthData.cashflow)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta 3: Costo de Vida */}
        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-semibold">
              <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
              Costo de Vida
              {getHealthBadge(costoVidaHealthy)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Tus gastos mensuales</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Máximo:</p>
              <p className="text-lg font-semibold">{formatCurrency(costoVidaMaximum)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Real:</p>
              <p className="text-lg font-semibold text-primary">{formatCurrency(wealthData.gastos)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta 4: Ahorro */}
        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-semibold">
              <PiggyBank className="w-5 h-5 mr-2 text-primary" />
              Ahorro
              {getHealthBadge(ahorroHealthy)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Fondo de emergencias y oportunidades</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Mínimo:</p>
              <p className="text-lg font-semibold">{formatCurrency(ahorroMinimum)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Real:</p>
              <p className="text-lg font-semibold text-primary">{formatCurrency(wealthData.nivelAhorro)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}