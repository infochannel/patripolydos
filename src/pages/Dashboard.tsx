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
    
    // Get Calidad de Vida progress
    const getCalidadVidaProgress = () => {
      const savedItems = localStorage.getItem('calidad-vida-items');
      if (savedItems) {
        const items = JSON.parse(savedItems);
        const totalDesiredCost = items.reduce((sum: number, item: any) => sum + item.monthlyCost, 0);
        const ownedCost = items.filter((item: any) => item.isOwned).reduce((sum: number, item: any) => sum + item.monthlyCost, 0);
        return totalDesiredCost > 0 ? Math.round((ownedCost / totalDesiredCost) * 100) : 0;
      }
      return 35; // Default value
    };

    // Get Ingresos Activos total
    const getIngresosActivos = () => {
      const savedIncomes = localStorage.getItem('ingresos-activos');
      if (savedIncomes) {
        const incomes = JSON.parse(savedIncomes);
        return incomes.reduce((total: number, income: any) => {
          const monthlyAmount = (() => {
            switch (income.frequency) {
              case 'weekly': return income.amount * 4.33;
              case 'bi-weekly': return income.amount * 2.17;
              case 'yearly': return income.amount / 12;
              case 'one-time': return income.amount; // Include one-time payments in total
              default: return income.amount;
            }
          })();
          return total + monthlyAmount;
        }, 0);
      }
      return 3200; // Default value
    };
    
    if (savedAssets) {
      const assets = JSON.parse(savedAssets);
      const totalAssets = assets.filter((a: any) => a.type === 'asset').reduce((sum: number, asset: any) => sum + asset.value, 0);
      const totalLiabilities = assets.filter((a: any) => a.type === 'liability').reduce((sum: number, asset: any) => sum + asset.value, 0);
      const patrimonioTotal = totalAssets - totalLiabilities;
      
      return {
        patrimonioTotal,
        cashflow: 850,
        ingresosActivos: getIngresosActivos(),
        nivelAhorro: 15,
        progresoCalidadVida: getCalidadVidaProgress()
      };
    }
    
    // Default values
    return {
      patrimonioTotal: 25000,
      cashflow: 850,
      ingresosActivos: getIngresosActivos(),
      nivelAhorro: 15,
      progresoCalidadVida: getCalidadVidaProgress()
    };
  };

  const [wealthData, setWealthData] = useState(getWealthData());
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('patripoly_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Load profile picture from profile settings
    const profileSettings = localStorage.getItem('patripoly_profile_settings');
    if (profileSettings) {
      const settings = JSON.parse(profileSettings);
      setProfilePicture(settings.profilePicture || '');
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
      navigate("/duplicador");
    } else if (moduleId === "calidad-vida") {
      navigate("/calidad-vida");
    } else if (moduleId === "ingresos") {
      navigate("/ingresos-activos");
    } else if (moduleId === "ahorros") {
      navigate("/ahorros-fondo");
    } else if (moduleId === "gastos") {
      navigate("/gastos");
    } else if (moduleId === "promotor") {
      navigate("/programa-promotor");
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
    } else if (cardType === "calidad-vida") {
      navigate("/calidad-vida");
    } else if (cardType === "ingresos-activos") {
      navigate("/ingresos-activos");
    } else if (cardType === "ahorros") {
      navigate("/ahorros-fondo");
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
                  <AvatarImage src={profilePicture} />
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
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
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
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primary">Tu Nivel de Patrimonio</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/wealth-levels')}
              className="text-xs"
            >
              Ver Todos los Niveles
            </Button>
          </div>
          <PatrimonioLevelBar 
            wealth={wealthData.patrimonioTotal} 
          />
        </div>

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