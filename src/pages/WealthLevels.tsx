import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WealthLevels as WealthLevelsComponent } from "@/components/dashboard/WealthLevels";
import { ArrowLeft } from "lucide-react";

export function WealthLevels() {
  const navigate = useNavigate();
  const [wealthData, setWealthData] = useState({ patrimonioTotal: 0 });

  useEffect(() => {
    // Get wealth data from localStorage
    const savedAssets = localStorage.getItem('patripoly_assets');
    
    if (savedAssets) {
      const assets = JSON.parse(savedAssets);
      const totalAssets = assets.filter((a: any) => a.type === 'asset').reduce((sum: number, asset: any) => sum + asset.value, 0);
      const totalLiabilities = assets.filter((a: any) => a.type === 'liability').reduce((sum: number, asset: any) => sum + asset.value, 0);
      const patrimonioTotal = totalAssets - totalLiabilities;
      
      setWealthData({ patrimonioTotal });
    } else {
      // Default value if no data
      setWealthData({ patrimonioTotal: 25000 });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Niveles de Patrimonio</h1>
              <p className="text-sm text-muted-foreground">Descubre tu progreso y los siguientes objetivos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <WealthLevelsComponent currentWealth={wealthData.patrimonioTotal} />
      </main>
    </div>
  );
}