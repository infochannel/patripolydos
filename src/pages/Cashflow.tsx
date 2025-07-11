import { useState } from "react";
import { ArrowLeft, Plus, TrendingUp, Target, Calendar, DollarSign, Zap, Home, Building, Briefcase, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface PassiveIncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "yearly";
  category: string;
  dateAdded: string;
}

interface CashflowProps {
  onBack: () => void;
}

const categories = [
  { value: "real-estate", label: "Bienes Raíces", icon: Home },
  { value: "dividends", label: "Dividendos", icon: TrendingUp },
  { value: "business", label: "Negocio", icon: Briefcase },
  { value: "investments", label: "Inversiones", icon: PiggyBank },
  { value: "royalties", label: "Regalías", icon: Zap },
  { value: "other", label: "Otros", icon: DollarSign }
];

export function Cashflow({ onBack }: CashflowProps) {
  const { toast } = useToast();
  const [sources, setSources] = useState<PassiveIncomeSource[]>([
    {
      id: "1",
      name: "Alquiler Apartamento Centro",
      amount: 800,
      frequency: "monthly",
      category: "real-estate",
      dateAdded: "2024-01-15"
    },
    {
      id: "2",
      name: "Dividendos ETF S&P 500",
      amount: 150,
      frequency: "quarterly",
      category: "dividends",
      dateAdded: "2024-02-01"
    }
  ]);

  const [monthlyGoal, setMonthlyGoal] = useState(2000);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSource, setNewSource] = useState({
    name: "",
    amount: "",
    frequency: "monthly" as const,
    category: ""
  });

  const getMonthlyAmount = (amount: number, frequency: string) => {
    switch (frequency) {
      case "quarterly": return amount / 3;
      case "yearly": return amount / 12;
      default: return amount;
    }
  };

  const totalMonthlyIncome = sources.reduce((sum, source) => 
    sum + getMonthlyAmount(source.amount, source.frequency), 0
  );

  const progressToGoal = Math.min((totalMonthlyIncome / monthlyGoal) * 100, 100);

  const handleAddSource = () => {
    if (!newSource.name || !newSource.amount || !newSource.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const source: PassiveIncomeSource = {
      id: Date.now().toString(),
      name: newSource.name,
      amount: parseFloat(newSource.amount),
      frequency: newSource.frequency,
      category: newSource.category,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setSources([...sources, source]);
    setNewSource({ name: "", amount: "", frequency: "monthly", category: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Fuente agregada",
      description: "Tu nueva fuente de ingresos pasivos ha sido registrada"
    });
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[5];
  };

  const groupedSources = categories.map(category => ({
    ...category,
    sources: sources.filter(source => source.category === category.value),
    total: sources
      .filter(source => source.category === category.value)
      .reduce((sum, source) => sum + getMonthlyAmount(source.amount, source.frequency), 0)
  })).filter(group => group.sources.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-teal/10">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Cashflow</h1>
              <p className="text-muted-foreground">Gestiona tus ingresos pasivos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Overview Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-primary border-0 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Ingresos Mensuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">€{totalMonthlyIncome.toFixed(0)}</div>
              <p className="text-white/80 text-sm">Ingresos pasivos totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fuentes Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{sources.length}</div>
              <p className="text-muted-foreground text-sm">Generando ingresos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Progreso Meta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal">{progressToGoal.toFixed(0)}%</div>
              <p className="text-muted-foreground text-sm">de €{monthlyGoal}/mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tracker Motivacional
            </CardTitle>
            <CardDescription>
              Tu progreso hacia la meta de €{monthlyGoal} mensuales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">€{totalMonthlyIncome.toFixed(0)}</span>
              <span className="text-sm text-muted-foreground">€{monthlyGoal}</span>
            </div>
            <Progress value={progressToGoal} className="h-3" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{progressToGoal.toFixed(1)}% completado</span>
              <span className="text-sm text-muted-foreground">
                €{(monthlyGoal - totalMonthlyIncome).toFixed(0)} restantes
              </span>
            </div>
            {progressToGoal >= 100 && (
              <div className="bg-teal/10 border border-teal/20 rounded-lg p-4">
                <p className="text-teal font-medium">🎉 ¡Felicitaciones! Has alcanzado tu meta mensual</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="sources">Fuentes</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Fuente de Ingresos
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nueva Fuente de Ingresos Pasivos</DialogTitle>
                    <DialogDescription>
                      Registra una nueva fuente de ingresos pasivos
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre de la fuente</Label>
                      <Input
                        id="name"
                        value={newSource.name}
                        onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                        placeholder="ej. Alquiler apartamento, Dividendos..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Monto</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newSource.amount}
                        onChange={(e) => setNewSource({...newSource, amount: e.target.value})}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequency">Frecuencia</Label>
                      <Select value={newSource.frequency} onValueChange={(value: any) => setNewSource({...newSource, frequency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Mensual</SelectItem>
                          <SelectItem value="quarterly">Trimestral</SelectItem>
                          <SelectItem value="yearly">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Categoría</Label>
                      <Select value={newSource.category} onValueChange={(value) => setNewSource({...newSource, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddSource} className="w-full">
                      Agregar Fuente
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={() => setMonthlyGoal(monthlyGoal + 500)}>
                <Target className="h-4 w-4 mr-2" />
                Aumentar Meta
              </Button>
            </div>

            {/* Categories Overview */}
            {groupedSources.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedSources.map((group) => {
                  const IconComponent = group.icon;
                  return (
                    <Card key={group.value}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {group.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          €{group.total.toFixed(0)}/mes
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {group.sources.length} fuente{group.sources.length !== 1 ? 's' : ''}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            {sources.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tienes fuentes de ingresos pasivos registradas</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Comienza agregando tu primera fuente de ingresos
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sources.map((source) => {
                  const categoryInfo = getCategoryInfo(source.category);
                  const IconComponent = categoryInfo.icon;
                  const monthlyAmount = getMonthlyAmount(source.amount, source.frequency);
                  
                  return (
                    <Card key={source.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{source.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {categoryInfo.label}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              €{monthlyAmount.toFixed(0)}/mes
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              €{source.amount} {source.frequency === 'monthly' ? 'mensual' : 
                                source.frequency === 'quarterly' ? 'trimestral' : 'anual'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Gráficos y Tendencias
                </CardTitle>
                <CardDescription>
                  Análisis visual de tu evolución de cashflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Gráficos disponibles próximamente</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Aquí verás la evolución de tus ingresos pasivos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Projection */}
            <Card>
              <CardHeader>
                <CardTitle>Proyección de 12 Meses</CardTitle>
                <CardDescription>
                  Ingresos proyectados basados en tus fuentes actuales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({length: 12}, (_, i) => (
                    <div key={i} className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        {new Date(2024, i).toLocaleDateString('es-ES', { month: 'short' })}
                      </div>
                      <div className="font-bold text-primary">
                        €{totalMonthlyIncome.toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-teal/10 border border-teal/20 rounded-lg">
                  <p className="text-sm text-teal">
                    <strong>Ingresos anuales proyectados:</strong> €{(totalMonthlyIncome * 12).toFixed(0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}