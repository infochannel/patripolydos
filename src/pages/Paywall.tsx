import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, Star, Zap, Shield, TrendingUp, BarChart3 } from "lucide-react";

export function Paywall() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubscribe = () => {
    // This would eventually integrate with Stripe
    console.log("Starting subscription flow...");
    // For now, just show a message
    alert("¡Funcionalidad de pago próximamente! Esta página muestra cómo se vería el paywall.");
  };

  const monthlyPrice = 4;
  const annualPrice = 40; // 2 months free
  const currentPrice = isAnnual ? annualPrice : monthlyPrice;
  const billingPeriod = isAnnual ? "año" : "mes";

  const premiumFeatures = [
    {
      icon: BarChart3,
      title: "Análisis Avanzados",
      description: "Reportes detallados de tu patrimonio y evolución financiera"
    },
    {
      icon: TrendingUp,
      title: "Proyecciones Inteligentes",
      description: "Predicciones de crecimiento patrimonial basadas en IA"
    },
    {
      icon: Shield,
      title: "Alertas Personalizadas",
      description: "Notificaciones cuando tus métricas cambien significativamente"
    },
    {
      icon: Zap,
      title: "Herramientas Exclusivas",
      description: "Calculadoras avanzadas y simuladores de inversión"
    },
    {
      icon: Star,
      title: "Soporte Prioritario",
      description: "Atención personalizada y respuesta en menos de 24h"
    },
    {
      icon: Crown,
      title: "Acceso Completo",
      description: "Todas las funciones actuales y futuras sin restricciones"
    }
  ];

  const freeFeatures = [
    "Dashboard básico",
    "Registro de gastos e ingresos",
    "3 meses gratis con código promocional",
    "Soporte por email"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-primary">Actualizar a Premium</h1>
              <p className="text-sm text-muted-foreground">Desbloquea todo el potencial de PatriPoly</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Pricing Toggle */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Elige tu plan Premium
          </h2>
          <p className="text-muted-foreground mb-6">
            Herramientas profesionales para gestionar tu patrimonio como un experto
          </p>
          
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                !isAnnual 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all relative ${
                isAnnual 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anual
              <Badge className="absolute -top-2 -right-2 text-xs bg-gradient-primary">
                2 meses gratis
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto mb-12">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Plan Gratuito</CardTitle>
                <Badge variant="secondary">Actual</Badge>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">€0</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Perfecto para comenzar con PatriPoly
              </p>
              <ul className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button variant="outline" className="w-full" disabled>
                  Plan Actual
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-primary text-white px-4 py-1">
                Más Popular
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Plan Premium
                </CardTitle>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">€{currentPrice}</span>
                <span className="text-muted-foreground">/{billingPeriod}</span>
                {isAnnual && (
                  <div className="text-sm text-muted-foreground">
                    €{monthlyPrice}/mes facturado anualmente
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Herramientas avanzadas para maximizar tu patrimonio
              </p>
              
              <div className="space-y-4">
                <div className="text-sm font-medium text-foreground">
                  Todo en el plan gratuito, más:
                </div>
                <div className="grid gap-4">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-1 bg-primary/10 rounded">
                        <feature.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{feature.title}</div>
                        <div className="text-xs text-muted-foreground">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium"
                  size="lg"
                >
                  Comenzar Premium
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Cancela en cualquier momento
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">¿Por qué elegir Premium?</h3>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div className="font-medium">Optimiza tu patrimonio</div>
                <div className="text-muted-foreground">
                  Identifica oportunidades de crecimiento y mejora tu situación financiera
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div className="font-medium">Decisiones informadas</div>
                <div className="text-muted-foreground">
                  Análisis detallados para tomar mejores decisiones de inversión
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div className="font-medium">Soporte experto</div>
                <div className="text-muted-foreground">
                  Atención personalizada para resolver todas tus dudas
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Tu plan gratuito actual finaliza el 15 de Abril de 2025. 
            Actualiza ahora para continuar disfrutando de todas las funciones.
          </div>
        </div>
      </main>
    </div>
  );
}