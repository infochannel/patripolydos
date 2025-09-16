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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fila 1 - Patrimonio y Cashflow */}
        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg font-semibold">
              <div className="flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-primary" />
                Patrimonio
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(wealthData.patrimonioTotal)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary" />
                <span className="font-semibold">Cashflow</span>
                {getHealthBadge(cashflowHealthy)}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Mínimo</p>
                    <p className="text-sm font-semibold">{formatCurrency(patrimonioMinimum)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Real</p>
                    <p className="text-sm font-semibold text-primary">{formatCurrency(wealthData.cashflow)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fila 1 - Costo de Vida y Ahorro */}
        <Card className="bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg font-semibold">
              <div className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
                Costo de Vida
                {getHealthBadge(costoVidaHealthy)}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Máximo</p>
                  <p className="text-sm font-semibold">{formatCurrency(costoVidaMaximum)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Real</p>
                  <p className="text-sm font-semibold text-primary">{formatCurrency(wealthData.gastos)}</p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <PiggyBank className="w-5 h-5 mr-2 text-primary" />
                <span className="font-semibold">Ahorro</span>
                {getHealthBadge(ahorroHealthy)}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Mínimo</p>
                    <p className="text-sm font-semibold">{formatCurrency(ahorroMinimum)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Real</p>
                    <p className="text-sm font-semibold text-primary">{formatCurrency(wealthData.nivelAhorro)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}