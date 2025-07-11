import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatrimonioLevelBar } from "@/components/dashboard/PatrimonioLevelBar";
import { WealthSummaryCards } from "@/components/dashboard/WealthSummaryCards";
import { ModuleButtons } from "@/components/dashboard/ModuleButtons";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Settings, User } from "lucide-react";
import patripolyLogo from "@/assets/patripoly-logo.png";

interface User {
  email: string;
  name: string;
  patrimonioLevel: string;
  joinedAt: string;
}

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get wealth data from localStorage or use defaults
  const getWealthData = () => {
    const savedAssets = localStorage.getItem('patripoly_assets');
    if (savedAssets) {
      const assets = JSON.parse(savedAssets);
      const totalAssets = assets.filter((a: any) => a.type === 'asset').reduce((sum: number, asset: any) => sum + asset.value, 0);
      const totalLiabilities = assets.filter((a: any) => a.type === 'liability').reduce((sum: number, asset: any) => sum + asset.value, 0);
      const patrimonioTotal = totalAssets - totalLiabilities;
      
      return {
        patrimonioTotal,
        cashflow: 850,
        ingresosActivos: 3200,
        nivelAhorro: 15,
        progresoCalidadVida: 35
      };
    }
    
    // Default values
    return {
      patrimonioTotal: 25000,
      cashflow: 850,
      ingresosActivos: 3200,
      nivelAhorro: 15,
      progresoCalidadVida: 35
    };
  };

  const [wealthData, setWealthData] = useState(getWealthData());

  useEffect(() => {
    const userData = localStorage.getItem('patripoly_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Listen for localStorage changes to update wealth data
    const handleStorageChange = () => {
      setWealthData(getWealthData());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes when component mounts/updates
    const interval = setInterval(() => {
      setWealthData(getWealthData());
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('patripoly_user');
    window.location.reload();
  };

  const handleModuleClick = (moduleId: string) => {
    if (moduleId === "estudios") {
      navigate("/centro-estudios");
    } else if (moduleId === "patrimonio") {
      navigate("/patrimonio");
    } else if (moduleId === "cashflow") {
      navigate("/cashflow");
    } else if (moduleId === "duplicador") {
      navigate("/patrimonio");
    } else {
      toast({
        title: "Módulo en desarrollo",
        description: `El módulo ${moduleId} estará disponible pronto. ¡Sigue construyendo tu patrimonio!`,
      });
    }
  };

  const handleCardClick = (cardType: string) => {
    if (cardType === "patrimonio") {
      navigate("/patrimonio");
    } else if (cardType === "cashflow") {
      navigate("/cashflow");
    }
  };

  if (!user) return null;

  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const patrimonioProgress = Math.min(Math.max((wealthData.patrimonioTotal / 100000) * 100, 5), 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={patripolyLogo} alt="Patripoly" className="h-10" />
              <div>
                <h1 className="text-xl font-bold text-primary">Patripoly</h1>
                <p className="text-sm text-muted-foreground">Tu camino hacia la libertad financiera</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="font-medium text-primary">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.patrimonioLevel}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-primary">
            ¡Hola, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bienvenido a tu dashboard financiero. Aquí puedes ver tu progreso y acceder a todas las herramientas 
            para construir tu patrimonio y alcanzar la libertad financiera.
          </p>
        </div>

        {/* Patrimonio Level */}
        <PatrimonioLevelBar 
          level={user.patrimonioLevel} 
          progress={patrimonioProgress} 
        />

        {/* Wealth Summary Cards */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-primary">Resumen Financiero</h3>
          <WealthSummaryCards data={wealthData} onCardClick={handleCardClick} />
        </div>

        {/* Modules */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-primary">Herramientas Patripoly</h3>
            <p className="text-muted-foreground">
              Selecciona un módulo para continuar construyendo tu riqueza
            </p>
          </div>
          <ModuleButtons onModuleClick={handleModuleClick} />
        </div>

        {/* Motivational Quote */}
        <Card className="bg-gradient-primary text-white shadow-glow">
          <CardContent className="p-8 text-center">
            <blockquote className="text-xl font-medium mb-4">
              "La riqueza no es tener mucho dinero; es tener muchas opciones."
            </blockquote>
            <cite className="text-sm opacity-90">- Robert Kiyosaki</cite>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}