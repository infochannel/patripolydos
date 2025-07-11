import { useState, useEffect } from "react";
import { ArrowLeft, Plus, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Income {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'bi-weekly' | 'weekly' | 'yearly' | 'one-time';
}

interface IngresosActivosProps {
  onBack: () => void;
}

export const IngresosActivos = ({ onBack }: IngresosActivosProps) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIncome, setNewIncome] = useState({
    name: "",
    amount: 0,
    frequency: "monthly" as const
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedIncomes = localStorage.getItem('ingresos-activos');
    if (savedIncomes) {
      setIncomes(JSON.parse(savedIncomes));
    }
  }, []);

  const saveIncomes = (updatedIncomes: Income[]) => {
    localStorage.setItem('ingresos-activos', JSON.stringify(updatedIncomes));
    setIncomes(updatedIncomes);
  };

  const addIncome = () => {
    if (!newIncome.name || newIncome.amount <= 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos correctamente",
        variant: "destructive"
      });
      return;
    }

    const income: Income = {
      id: Date.now().toString(),
      name: newIncome.name,
      amount: newIncome.amount,
      frequency: newIncome.frequency
    };

    const updatedIncomes = [...incomes, income];
    saveIncomes(updatedIncomes);

    setNewIncome({ name: "", amount: 0, frequency: "monthly" });
    setIsDialogOpen(false);
    
    toast({
      title: "Éxito",
      description: "Ingreso agregado correctamente"
    });
  };

  const deleteIncome = (id: string) => {
    const updatedIncomes = incomes.filter(income => income.id !== id);
    saveIncomes(updatedIncomes);
    
    toast({
      title: "Éxito",
      description: "Ingreso eliminado correctamente"
    });
  };

  const getMonthlyAmount = (income: Income) => {
    switch (income.frequency) {
      case 'weekly':
        return income.amount * 4.33; // Average weeks per month
      case 'bi-weekly':
        return income.amount * 2.17; // Average bi-weeks per month
      case 'yearly':
        return income.amount / 12;
      case 'one-time':
        return 0; // One-time payments don't contribute to monthly recurring income
      default:
        return income.amount;
    }
  };

  const getTotalMonthlyIncome = () => {
    return incomes.reduce((total, income) => total + getMonthlyAmount(income), 0);
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      'monthly': 'Mensual',
      'bi-weekly': 'Quincenal',
      'weekly': 'Semanal',
      'yearly': 'Anual',
      'one-time': 'Pago único'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-3xl font-bold text-white">Ingresos Activos</h1>
            <p className="text-white/80">Gestiona tus fuentes de ingresos regulares</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Summary Panel */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumen de Ingresos
              </CardTitle>
              <CardDescription className="text-white/70">
                Tu flujo de ingresos mensual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  ${getTotalMonthlyIncome().toLocaleString('es-MX')}
                </div>
                <div className="text-white/70">Ingresos mensuales totales</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold text-white">
                    {incomes.length}
                  </div>
                  <div className="text-sm text-white/70">Fuentes de ingreso</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-white">
                    ${incomes.length > 0 ? (getTotalMonthlyIncome() / incomes.length).toLocaleString('es-MX') : '0'}
                  </div>
                  <div className="text-sm text-white/70">Promedio por fuente</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add New Income */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Agregar Nuevo Ingreso
              </CardTitle>
              <CardDescription className="text-white/70">
                Registra una nueva fuente de ingresos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-white text-primary hover:bg-white/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Ingreso
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Nuevo Ingreso</DialogTitle>
                    <DialogDescription>
                      Agrega una nueva fuente de ingresos a tu presupuesto
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="income-name">Nombre del ingreso</Label>
                      <Input
                        id="income-name"
                        placeholder="ej. Salario principal, Freelance, etc."
                        value={newIncome.name}
                        onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="income-amount">Cantidad</Label>
                      <Input
                        id="income-amount"
                        type="number"
                        placeholder="0"
                        value={newIncome.amount || ""}
                        onChange={(e) => setNewIncome({ ...newIncome, amount: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="income-frequency">Frecuencia</Label>
                      <Select value={newIncome.frequency} onValueChange={(value: any) => setNewIncome({ ...newIncome, frequency: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="bi-weekly">Quincenal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                          <SelectItem value="yearly">Anual</SelectItem>
                          <SelectItem value="one-time">Pago único</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addIncome} className="w-full">
                      Agregar Ingreso
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Income List */}
        <div className="mt-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Mis Ingresos
              </CardTitle>
              <CardDescription className="text-white/70">
                Lista de todas tus fuentes de ingresos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incomes.length === 0 ? (
                <div className="text-center py-8 text-white/70">
                  No has agregado ningún ingreso aún
                </div>
              ) : (
                <div className="space-y-3">
                  {incomes.map((income) => (
                    <div key={income.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <h3 className="font-medium text-white">{income.name}</h3>
                        <p className="text-sm text-white/70">
                          ${income.amount.toLocaleString('es-MX')} • {getFrequencyLabel(income.frequency)}
                        </p>
                        <p className="text-xs text-white/60">
                          Mensual: ${getMonthlyAmount(income).toLocaleString('es-MX')}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteIncome(income.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};