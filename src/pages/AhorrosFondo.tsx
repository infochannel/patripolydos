import { useState, useEffect } from "react";
import { ArrowLeft, Plus, PiggyBank, Target, Trophy, TrendingUp, Coins, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SavingEntry {
  id: string;
  name: string;
  amount: number;
  type: 'saving' | 'withdrawal';
  createdAt: string;
}

interface AhorrosFondoProps {
  onBack: () => void;
}

const SAVINGS_LEVELS = [
  {
    id: 1,
    name: "Principiante",
    monthsRequired: 0.5,
    color: "bg-red-500",
    description: "15 días de gastos"
  },
  {
    id: 2,
    name: "Básico",
    monthsRequired: 1,
    color: "bg-orange-500",
    description: "1 mes de gastos"
  },
  {
    id: 3,
    name: "Intermedio",
    monthsRequired: 3,
    color: "bg-yellow-500",
    description: "3 meses de gastos"
  },
  {
    id: 4,
    name: "Avanzado",
    monthsRequired: 6,
    color: "bg-green-500",
    description: "6 meses de gastos (Ideal)"
  },
  {
    id: 5,
    name: "Experto",
    monthsRequired: 12,
    color: "bg-purple-500",
    description: "12+ meses de gastos"
  }
];

export const AhorrosFondo = ({ onBack }: AhorrosFondoProps) => {
  const [savings, setSavings] = useState<SavingEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
  const [newSaving, setNewSaving] = useState({
    name: "",
    amount: 0
  });
  const [newWithdrawal, setNewWithdrawal] = useState({
    name: "",
    amount: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedSavings = localStorage.getItem('ahorros-fondo');
    if (savedSavings) {
      setSavings(JSON.parse(savedSavings));
    }
  }, []);

  const saveSavings = (updatedSavings: SavingEntry[]) => {
    localStorage.setItem('ahorros-fondo', JSON.stringify(updatedSavings));
    setSavings(updatedSavings);
  };

  const addSaving = () => {
    if (!newSaving.name || newSaving.amount <= 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos correctamente",
        variant: "destructive"
      });
      return;
    }

    const saving: SavingEntry = {
      id: Date.now().toString(),
      name: newSaving.name,
      amount: newSaving.amount,
      type: 'saving',
      createdAt: new Date().toISOString()
    };

    const updatedSavings = [...savings, saving];
    saveSavings(updatedSavings);

    setNewSaving({ name: "", amount: 0 });
    setIsDialogOpen(false);
    
    toast({
      title: "¡Excelente!",
      description: "Ahorro agregado correctamente. ¡Sigue así!"
    });
  };

  const addWithdrawal = () => {
    if (!newWithdrawal.name || newWithdrawal.amount <= 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos correctamente",
        variant: "destructive"
      });
      return;
    }

    const totalSavings = getTotalSavings();
    if (newWithdrawal.amount > totalSavings) {
      toast({
        title: "Error",
        description: "No puedes retirar más de lo que tienes ahorrado",
        variant: "destructive"
      });
      return;
    }

    const withdrawal: SavingEntry = {
      id: Date.now().toString(),
      name: newWithdrawal.name,
      amount: -newWithdrawal.amount, // Negative amount for withdrawal
      type: 'withdrawal',
      createdAt: new Date().toISOString()
    };

    const updatedSavings = [...savings, withdrawal];
    saveSavings(updatedSavings);

    setNewWithdrawal({ name: "", amount: 0 });
    setIsWithdrawalDialogOpen(false);
    
    toast({
      title: "Retiro registrado",
      description: "El retiro ha sido procesado correctamente"
    });
  };

  const deleteSaving = (id: string) => {
    const updatedSavings = savings.filter(saving => saving.id !== id);
    saveSavings(updatedSavings);
    
    toast({
      title: "Ahorro eliminado",
      description: "El registro de ahorro ha sido eliminado"
    });
  };

  const getTotalSavings = () => {
    return savings.reduce((total, saving) => total + saving.amount, 0);
  };

  const getMonthlyCostOfLiving = () => {
    const savedItems = localStorage.getItem('calidad-vida-items');
    if (savedItems) {
      const items = JSON.parse(savedItems);
      return items.reduce((sum: number, item: any) => sum + item.monthlyCost, 0);
    }
    return 2500; // Default monthly cost
  };

  const getEmergencyFundGoal = () => {
    return getMonthlyCostOfLiving() * 6; // 6 months of expenses
  };

  const getCurrentLevel = () => {
    const totalSavings = getTotalSavings();
    const monthlyCost = getMonthlyCostOfLiving();
    const monthsCovered = totalSavings / monthlyCost;

    for (let i = SAVINGS_LEVELS.length - 1; i >= 0; i--) {
      if (monthsCovered >= SAVINGS_LEVELS[i].monthsRequired) {
        return SAVINGS_LEVELS[i];
      }
    }
    return SAVINGS_LEVELS[0];
  };

  const getProgressPercentage = () => {
    const totalSavings = getTotalSavings();
    const goal = getEmergencyFundGoal();
    return Math.min((totalSavings / goal) * 100, 100);
  };

  const getMonthsCovered = () => {
    const totalSavings = getTotalSavings();
    const monthlyCost = getMonthlyCostOfLiving();
    return totalSavings / monthlyCost;
  };

  const currentLevel = getCurrentLevel();
  const progressPercentage = getProgressPercentage();
  const monthsCovered = getMonthsCovered();

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Ahorros y Fondo de Emergencia</h1>
            <p className="text-white/80">Construye tu seguridad financiera</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emergency Fund Progress */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progreso del Fondo de Emergencia
                </CardTitle>
                <CardDescription className="text-white/70">
                  Meta: 6 meses de gastos (${getEmergencyFundGoal().toLocaleString('es-MX')})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-white">
                    <span>Progreso actual</span>
                    <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      ${getTotalSavings().toLocaleString('es-MX')}
                    </div>
                    <div className="text-white/70">
                      {monthsCovered.toFixed(1)} meses cubiertos
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-white text-primary hover:bg-white/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Ahorro
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Nuevo Ahorro</DialogTitle>
                        <DialogDescription>
                          Registra un nuevo aporte a tu fondo de emergencia
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="saving-name">Concepto del ahorro</Label>
                          <Input
                            id="saving-name"
                            placeholder="ej. Ahorro mensual, Bonificación, etc."
                            value={newSaving.name}
                            onChange={(e) => setNewSaving({ ...newSaving, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="saving-amount">Cantidad</Label>
                          <Input
                            id="saving-amount"
                            type="number"
                            placeholder="0"
                            value={newSaving.amount || ""}
                            onChange={(e) => setNewSaving({ ...newSaving, amount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <Button onClick={addSaving} className="w-full">
                          Agregar Ahorro
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isWithdrawalDialogOpen} onOpenChange={setIsWithdrawalDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Minus className="h-4 w-4 mr-2" />
                        Retirar Fondos
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Retirar Fondos</DialogTitle>
                        <DialogDescription>
                          Registra un retiro de tu fondo de emergencia. Solo retira en caso de verdadera emergencia.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="withdrawal-name">Motivo del retiro</Label>
                          <Input
                            id="withdrawal-name"
                            placeholder="ej. Reparación de auto, Gastos médicos, etc."
                            value={newWithdrawal.name}
                            onChange={(e) => setNewWithdrawal({ ...newWithdrawal, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="withdrawal-amount">Cantidad a retirar</Label>
                          <Input
                            id="withdrawal-amount"
                            type="number"
                            placeholder="0"
                            max={getTotalSavings()}
                            value={newWithdrawal.amount || ""}
                            onChange={(e) => setNewWithdrawal({ ...newWithdrawal, amount: parseFloat(e.target.value) || 0 })}
                          />
                          <p className="text-sm text-gray-600 mt-1">
                            Disponible: ${getTotalSavings().toLocaleString('es-MX')}
                          </p>
                        </div>
                        <Button onClick={addWithdrawal} className="w-full" variant="destructive">
                          Confirmar Retiro
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Savings List */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Historial de Movimientos
                </CardTitle>
                <CardDescription className="text-white/70">
                  Ahorros y retiros de tu fondo de emergencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savings.length === 0 ? (
                  <div className="text-center py-8 text-white/70">
                    No has registrado movimientos aún
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savings
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((saving) => (
                      <div key={saving.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                        saving.amount >= 0 
                          ? 'bg-green-500/10 border-green-500/20' 
                          : 'bg-red-500/10 border-red-500/20'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            saving.amount >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            {saving.amount >= 0 ? (
                              <Plus className="h-4 w-4 text-green-300" />
                            ) : (
                              <Minus className="h-4 w-4 text-red-300" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{saving.name}</h3>
                            <p className="text-sm text-white/70">
                              {new Date(saving.createdAt).toLocaleDateString('es-ES')}
                            </p>
                            <Badge variant="secondary" className={`text-xs ${
                              saving.amount >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {saving.amount >= 0 ? 'Ahorro' : 'Retiro'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-lg font-semibold ${
                            saving.amount >= 0 ? 'text-green-300' : 'text-red-300'
                          }`}>
                            {saving.amount >= 0 ? '+' : ''}${Math.abs(saving.amount).toLocaleString('es-MX')}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteSaving(saving.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Savings Level */}
          <div className="space-y-6">
            {/* Current Level */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Tu Nivel Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className={`w-16 h-16 rounded-full ${currentLevel.color} flex items-center justify-center mx-auto`}>
                  <PiggyBank className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentLevel.name}</h3>
                  <p className="text-white/70 text-sm">{currentLevel.description}</p>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Nivel {currentLevel.id} de 5
                </Badge>
              </CardContent>
            </Card>

            {/* Levels Progress */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Niveles de Ahorro
                </CardTitle>
                <CardDescription className="text-white/70">
                  Progresa en tu camino financiero
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {SAVINGS_LEVELS.map((level) => {
                  const isAchieved = monthsCovered >= level.monthsRequired;
                  const isCurrent = level.id === currentLevel.id;
                  
                  return (
                    <div key={level.id} className={`p-3 rounded-lg border ${
                      isCurrent 
                        ? 'border-white bg-white/10' 
                        : isAchieved 
                          ? 'border-green-400/50 bg-green-400/10' 
                          : 'border-white/20 bg-white/5'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${level.color} flex items-center justify-center ${
                          !isAchieved ? 'opacity-50' : ''
                        }`}>
                          <span className="text-white font-bold text-sm">{level.id}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${isCurrent ? 'text-white' : isAchieved ? 'text-green-300' : 'text-white/70'}`}>
                            {level.name}
                          </h4>
                          <p className="text-xs text-white/60">{level.description}</p>
                        </div>
                        {isAchieved && (
                          <Trophy className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};