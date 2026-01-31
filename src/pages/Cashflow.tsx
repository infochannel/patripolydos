import { useState, useEffect } from "react";
import { ArrowLeft, Plus, TrendingUp, Target, Calendar, DollarSign, Zap, Home, Building, Briefcase, PiggyBank, Edit, Trash2, Check, History, CheckCircle2 } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface IncomeConfirmation {
  id: string;
  sourceId: string;
  sourceName: string;
  amount: number;
  confirmedAt: string;
  notes?: string;
}

interface PassiveIncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "yearly";
  category: string;
  dateAdded: string;
  lastConfirmedAt?: string;
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
  const [sources, setSources] = useState<PassiveIncomeSource[]>([]);
  const [confirmations, setConfirmations] = useState<IncomeConfirmation[]>([]);

  const [monthlyGoal, setMonthlyGoal] = useState(2000);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSources = localStorage.getItem('passiveIncomeSources');
    const savedGoal = localStorage.getItem('monthlyGoal');
    const savedConfirmations = localStorage.getItem('incomeConfirmations');
    
    if (savedSources) {
      try {
        setSources(JSON.parse(savedSources));
      } catch (error) {
        console.error('Error loading passive income sources:', error);
      }
    } else {
      // Set default data if none exists
      const defaultSources: PassiveIncomeSource[] = [
        {
          id: "1",
          name: "Alquiler Apartamento Centro",
          amount: 800,
          frequency: "monthly" as const,
          category: "real-estate",
          dateAdded: "2024-01-15"
        },
        {
          id: "2",
          name: "Dividendos ETF S&P 500",
          amount: 150,
          frequency: "quarterly" as const,
          category: "dividends",
          dateAdded: "2024-02-01"
        }
      ];
      setSources(defaultSources);
      localStorage.setItem('passiveIncomeSources', JSON.stringify(defaultSources));
    }
    
    if (savedGoal) {
      setMonthlyGoal(parseFloat(savedGoal));
    }

    if (savedConfirmations) {
      try {
        setConfirmations(JSON.parse(savedConfirmations));
      } catch (error) {
        console.error('Error loading income confirmations:', error);
      }
    }
  }, []);

  // Save sources to localStorage whenever they change
  const saveSources = (updatedSources: PassiveIncomeSource[]) => {
    setSources(updatedSources);
    localStorage.setItem('passiveIncomeSources', JSON.stringify(updatedSources));
  };

  // Save confirmations to localStorage
  const saveConfirmations = (updatedConfirmations: IncomeConfirmation[]) => {
    setConfirmations(updatedConfirmations);
    localStorage.setItem('incomeConfirmations', JSON.stringify(updatedConfirmations));
  };

  // Save goal to localStorage
  const saveGoal = (goal: number) => {
    setMonthlyGoal(goal);
    localStorage.setItem('monthlyGoal', goal.toString());
  };
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [confirmingSource, setConfirmingSource] = useState<PassiveIncomeSource | null>(null);
  const [confirmationData, setConfirmationData] = useState({
    amount: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const [editingSource, setEditingSource] = useState<PassiveIncomeSource | null>(null);
  const [customGoal, setCustomGoal] = useState("");
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

    saveSources([...sources, source]);
    setNewSource({ name: "", amount: "", frequency: "monthly", category: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Fuente agregada",
      description: "Tu nueva fuente de ingresos pasivos ha sido registrada"
    });
  };

  const handleEditSource = () => {
    if (!editingSource || !editingSource.name || !editingSource.amount || !editingSource.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    saveSources(sources.map(source => 
      source.id === editingSource.id ? editingSource : source
    ));
    setEditingSource(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Fuente actualizada",
      description: "Los cambios han sido guardados"
    });
  };

  const handleDeleteSource = (id: string) => {
    saveSources(sources.filter(source => source.id !== id));
    toast({
      title: "Fuente eliminada",
      description: "La fuente de ingresos ha sido eliminada"
    });
  };

  const handleCustomGoal = () => {
    const goal = parseFloat(customGoal);
    if (isNaN(goal) || goal <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa un monto válido",
        variant: "destructive"
      });
      return;
    }

    saveGoal(goal);
    setCustomGoal("");
    setIsGoalDialogOpen(false);
    
    toast({
      title: "Meta actualizada",
      description: `Nueva meta: €${goal}/mes`
    });
  };

  const handleConfirmIncome = () => {
    if (!confirmingSource) return;

    const amount = parseFloat(confirmationData.amount) || confirmingSource.amount;
    
    const confirmation: IncomeConfirmation = {
      id: Date.now().toString(),
      sourceId: confirmingSource.id,
      sourceName: confirmingSource.name,
      amount: amount,
      confirmedAt: confirmationData.date,
      notes: confirmationData.notes || undefined
    };

    saveConfirmations([confirmation, ...confirmations]);
    
    // Update the source's lastConfirmedAt
    const updatedSources = sources.map(source => 
      source.id === confirmingSource.id 
        ? { ...source, lastConfirmedAt: confirmationData.date }
        : source
    );
    saveSources(updatedSources);

    setConfirmationData({ amount: "", date: new Date().toISOString().split('T')[0], notes: "" });
    setConfirmingSource(null);
    setIsConfirmDialogOpen(false);

    toast({
      title: "Ingreso confirmado",
      description: `€${amount.toFixed(0)} registrado de ${confirmingSource.name}`
    });
  };

  const getConfirmationsForSource = (sourceId: string) => {
    return confirmations.filter(c => c.sourceId === sourceId);
  };

  const getCurrentMonthConfirmations = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return confirmations.filter(c => {
      const date = new Date(c.confirmedAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  };

  const totalConfirmedThisMonth = getCurrentMonthConfirmations().reduce((sum, c) => sum + c.amount, 0);

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          <Card className="border-teal/30 bg-teal/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-teal" />
                Confirmados Este Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal">€{totalConfirmedThisMonth.toFixed(0)}</div>
              <p className="text-muted-foreground text-sm">{getCurrentMonthConfirmations().length} ingresos confirmados</p>
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
              <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Aumentar Meta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Actualizar Meta Mensual</DialogTitle>
                    <DialogDescription>
                      Define tu nueva meta de ingresos pasivos mensuales
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customGoal">Meta mensual (€)</Label>
                      <Input
                        id="customGoal"
                        type="number"
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                        placeholder={`Actual: ${monthlyGoal}`}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => { setCustomGoal((monthlyGoal + 500).toString()) }} variant="outline" className="flex-1">
                        +€500
                      </Button>
                      <Button onClick={() => { setCustomGoal((monthlyGoal + 1000).toString()) }} variant="outline" className="flex-1">
                        +€1000
                      </Button>
                    </div>
                    <Button onClick={handleCustomGoal} className="w-full">
                      Actualizar Meta
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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

            {/* Quick Confirm Income Section */}
            {sources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal" />
                    Confirmar Ingresos
                  </CardTitle>
                  <CardDescription>
                    Registra los ingresos que has recibido este mes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sources.map((source) => {
                    const categoryInfo = getCategoryInfo(source.category);
                    const IconComponent = categoryInfo.icon;
                    const sourceConfirmations = getConfirmationsForSource(source.id);
                    const lastConfirmation = sourceConfirmations[0];
                    
                    return (
                      <div 
                        key={source.id} 
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{source.name}</p>
                            <p className="text-xs text-muted-foreground">
                              €{source.amount}/{source.frequency === "monthly" ? "mes" : source.frequency === "quarterly" ? "trim" : "año"}
                              {lastConfirmation && (
                                <span className="ml-2">
                                  · Último: {new Date(lastConfirmation.confirmedAt).toLocaleDateString()}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-1"
                          onClick={() => {
                            setConfirmingSource(source);
                            setConfirmationData({
                              amount: source.amount.toString(),
                              date: new Date().toISOString().split('T')[0],
                              notes: ""
                            });
                            setIsConfirmDialogOpen(true);
                          }}
                        >
                          <Check className="h-4 w-4" />
                          <span className="hidden sm:inline">Confirmar</span>
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Mis Fuentes de Ingresos</h3>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Fuente
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
            </div>

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
                  const sourceConfirmations = getConfirmationsForSource(source.id);
                  const lastConfirmation = sourceConfirmations[0];
                  
                  return (
                    <Card key={source.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col gap-4">
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
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <div className="font-bold text-primary">
                                  €{monthlyAmount.toFixed(0)}/mes
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  €{source.amount} {source.frequency === 'monthly' ? 'mensual' : 
                                    source.frequency === 'quarterly' ? 'trimestral' : 'anual'}
                                </Badge>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => {
                                    setEditingSource(source);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteSource(source.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Confirmation Section */}
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center gap-2 text-sm">
                              {lastConfirmation ? (
                                <span className="text-muted-foreground">
                                  Último ingreso: {new Date(lastConfirmation.confirmedAt).toLocaleDateString('es-ES')} - €{lastConfirmation.amount.toFixed(0)}
                                </span>
                              ) : (
                                <span className="text-muted-foreground italic">Sin ingresos confirmados</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {sourceConfirmations.length > 0 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setConfirmingSource(source);
                                    setIsHistoryDialogOpen(true);
                                  }}
                                >
                                  <History className="h-4 w-4 mr-1" />
                                  Historial
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-teal hover:bg-teal/90"
                                onClick={() => {
                                  setConfirmingSource(source);
                                  setConfirmationData({
                                    amount: source.amount.toString(),
                                    date: new Date().toISOString().split('T')[0],
                                    notes: ""
                                  });
                                  setIsConfirmDialogOpen(true);
                                }}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Confirmar Ingreso
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Edit Source Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Fuente de Ingresos</DialogTitle>
                  <DialogDescription>
                    Modifica los datos de tu fuente de ingresos
                  </DialogDescription>
                </DialogHeader>
                {editingSource && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Nombre de la fuente</Label>
                      <Input
                        id="edit-name"
                        value={editingSource.name}
                        onChange={(e) => setEditingSource({...editingSource, name: e.target.value})}
                        placeholder="ej. Alquiler apartamento, Dividendos..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-amount">Monto</Label>
                      <Input
                        id="edit-amount"
                        type="number"
                        value={editingSource.amount.toString()}
                        onChange={(e) => setEditingSource({...editingSource, amount: parseFloat(e.target.value) || 0})}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-frequency">Frecuencia</Label>
                      <Select value={editingSource.frequency} onValueChange={(value: any) => setEditingSource({...editingSource, frequency: value})}>
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
                      <Label htmlFor="edit-category">Categoría</Label>
                      <Select value={editingSource.category} onValueChange={(value) => setEditingSource({...editingSource, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
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
                    <Button onClick={handleEditSource} className="w-full">
                      Guardar Cambios
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

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

        {/* Confirm Income Dialog - Outside Tabs so it works from any tab */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-teal" />
                Confirmar Ingreso
              </DialogTitle>
              <DialogDescription>
                Registra que has recibido este ingreso
              </DialogDescription>
            </DialogHeader>
            {confirmingSource && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="font-medium">{confirmingSource.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Monto esperado: €{confirmingSource.amount}
                  </p>
                </div>
                <div>
                  <Label htmlFor="confirm-amount">Monto recibido (€)</Label>
                  <Input
                    id="confirm-amount"
                    type="number"
                    value={confirmationData.amount}
                    onChange={(e) => setConfirmationData({...confirmationData, amount: e.target.value})}
                    placeholder={confirmingSource.amount.toString()}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-date">Fecha del ingreso</Label>
                  <Input
                    id="confirm-date"
                    type="date"
                    value={confirmationData.date}
                    onChange={(e) => setConfirmationData({...confirmationData, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-notes">Notas (opcional)</Label>
                  <Input
                    id="confirm-notes"
                    value={confirmationData.notes}
                    onChange={(e) => setConfirmationData({...confirmationData, notes: e.target.value})}
                    placeholder="Ej. Pago puntual, incluye extra..."
                  />
                </div>
                <Button onClick={handleConfirmIncome} className="w-full bg-teal hover:bg-teal/90">
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar Ingreso
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Income History Dialog - Outside Tabs */}
        <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historial de Ingresos
              </DialogTitle>
              <DialogDescription>
                {confirmingSource?.name}
              </DialogDescription>
            </DialogHeader>
            {confirmingSource && (
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-3">
                  {getConfirmationsForSource(confirmingSource.id).length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No hay ingresos confirmados para esta fuente
                    </p>
                  ) : (
                    getConfirmationsForSource(confirmingSource.id).map((confirmation) => (
                      <div 
                        key={confirmation.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">€{confirmation.amount}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(confirmation.confirmedAt).toLocaleDateString()}
                          </p>
                          {confirmation.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{confirmation.notes}</p>
                          )}
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-teal" />
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}