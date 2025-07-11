import { useState, useEffect } from "react";
import { ArrowLeft, Target, Trophy, Plus, Calendar, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ActionLog {
  id: string;
  flip: number;
  description: string;
  date: string;
  amount: number;
}

interface DuplicadorProps {
  onBack: () => void;
}

export function Duplicador({ onBack }: DuplicadorProps) {
  const [currentFlip, setCurrentFlip] = useState(1);
  const [currentAmount, setCurrentAmount] = useState(1);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [newActionDescription, setNewActionDescription] = useState("");
  const [newActionDate, setNewActionDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const targetAmount = 1000000; // 1M€
  const maxFlips = 21;

  useEffect(() => {
    const savedData = localStorage.getItem('duplicador-progress');
    if (savedData) {
      const data = JSON.parse(savedData);
      setCurrentFlip(data.currentFlip || 1);
      setCurrentAmount(data.currentAmount || 1);
      setActionLogs(data.actionLogs || []);
      setIsCompleted(data.isCompleted || false);
      setShowIntro(false);
    }
  }, []);

  useEffect(() => {
    const data = {
      currentFlip,
      currentAmount,
      actionLogs,
      isCompleted
    };
    localStorage.setItem('duplicador-progress', JSON.stringify(data));
  }, [currentFlip, currentAmount, actionLogs, isCompleted]);

  const calculateExpectedAmount = (flip: number) => {
    return Math.pow(2, flip - 1);
  };

  const progressPercentage = (currentFlip / maxFlips) * 100;

  const handleAddAction = () => {
    if (!newActionDescription.trim()) {
      toast({
        title: "Error",
        description: "Por favor, añade una descripción de la acción",
        variant: "destructive"
      });
      return;
    }

    const newAction: ActionLog = {
      id: Date.now().toString(),
      flip: currentFlip,
      description: newActionDescription,
      date: newActionDate,
      amount: currentAmount
    };

    setActionLogs([...actionLogs, newAction]);
    setNewActionDescription("");
    setNewActionDate(new Date().toISOString().split('T')[0]);
    
    toast({
      title: "Acción registrada",
      description: `Flip ${currentFlip} documentado exitosamente`
    });
  };

  const handleCompleteFlip = () => {
    if (currentFlip < maxFlips) {
      const nextFlip = currentFlip + 1;
      const nextAmount = calculateExpectedAmount(nextFlip);
      
      setCurrentFlip(nextFlip);
      setCurrentAmount(nextAmount);
      
      if (nextFlip === maxFlips) {
        setIsCompleted(true);
        toast({
          title: "¡Felicitaciones!",
          description: "¡Has completado el Duplicador Challenge!",
        });
      }
    }
  };

  const resetChallenge = () => {
    setCurrentFlip(1);
    setCurrentAmount(1);
    setActionLogs([]);
    setIsCompleted(false);
    setShowIntro(true);
    localStorage.removeItem('duplicador-progress');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Duplicador Challenge</h1>
          </div>

          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">¡Bienvenido al Duplicador Challenge!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">1€ → 1M€</div>
                <p className="text-lg text-muted-foreground">En 21 pasos duplicando tu inversión</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Objetivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Duplicar tu inversión simbólica 21 veces consecutivas, desde 1€ hasta alcanzar 1.048.576€ (≈1M€)</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Reglas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Cada flip debe duplicar la cantidad anterior</li>
                      <li>• Documenta cada acción realizada</li>
                      <li>• Registra fechas y descripciones</li>
                      <li>• ¡No abandones el challenge!</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => setShowIntro(false)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  Comenzar Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Duplicador Challenge</h1>
          </div>

          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <div className="space-y-6">
                <Trophy className="h-24 w-24 text-yellow-500 mx-auto" />
                <div>
                  <h2 className="text-4xl font-bold text-primary mb-2">¡Felicitaciones!</h2>
                  <p className="text-xl text-muted-foreground">Has completado el Duplicador Challenge</p>
                </div>
                <div className="text-6xl font-bold text-success">
                  {formatCurrency(currentAmount)}
                </div>
                <p className="text-lg">Has completado {maxFlips} flips exitosos</p>
                <div className="space-y-4">
                  <Button onClick={resetChallenge} variant="outline">
                    Reiniciar Challenge
                  </Button>
                  <div>
                    <Button onClick={onBack}>
                      Volver al Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Duplicador Challenge</h1>
          <Badge variant="secondary">Flip {currentFlip} de {maxFlips}</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Flip Tracker */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Flip Actual: {currentFlip}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">
                      {formatCurrency(currentAmount)}
                    </div>
                    <p className="text-muted-foreground">
                      Objetivo: {formatCurrency(calculateExpectedAmount(currentFlip + 1))}
                    </p>
                  </div>
                  
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-center text-sm text-muted-foreground">
                    Progreso: {currentFlip}/{maxFlips} flips ({Math.round(progressPercentage)}%)
                  </p>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1">
                          <Plus className="h-4 w-4 mr-2" />
                          Registrar Acción
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Registrar Acción - Flip {currentFlip}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="description">Descripción de la acción</Label>
                            <Textarea
                              id="description"
                              placeholder="Describe qué acción realizaste para duplicar tu inversión..."
                              value={newActionDescription}
                              onChange={(e) => setNewActionDescription(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="date">Fecha</Label>
                            <Input
                              id="date"
                              type="date"
                              value={newActionDate}
                              onChange={(e) => setNewActionDate(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleAddAction} className="w-full">
                            Guardar Acción
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {currentFlip < maxFlips && (
                      <Button 
                        onClick={handleCompleteFlip}
                        variant="outline"
                        disabled={actionLogs.filter(log => log.flip === currentFlip).length === 0}
                      >
                        Completar Flip
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Log */}
            <Card>
              <CardHeader>
                <CardTitle>Registro de Acciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {actionLogs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay acciones registradas aún
                    </p>
                  ) : (
                    actionLogs.slice().reverse().map((log) => (
                      <Card key={log.id} className="border-l-4 border-l-primary">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary">Flip {log.flip}</Badge>
                            <span className="text-sm text-muted-foreground">{log.date}</span>
                          </div>
                          <p className="text-sm mb-2">{log.description}</p>
                          <p className="text-sm font-semibold text-success">
                            {formatCurrency(log.amount)}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Progreso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(currentAmount)}
                    </div>
                    <p className="text-sm text-muted-foreground">Cantidad actual</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {formatCurrency(targetAmount - currentAmount)}
                    </div>
                    <p className="text-sm text-muted-foreground">Restante para el objetivo</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Próximos Flips:</p>
                    {Array.from({ length: Math.min(5, maxFlips - currentFlip) }, (_, i) => {
                      const flipNumber = currentFlip + i + 1;
                      const amount = calculateExpectedAmount(flipNumber);
                      return (
                        <div key={flipNumber} className="flex justify-between text-sm">
                          <span>Flip {flipNumber}:</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Flips completados:</span>
                    <span className="font-medium">{currentFlip - 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Acciones registradas:</span>
                    <span className="font-medium">{actionLogs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Multiplicador actual:</span>
                    <span className="font-medium">×{currentAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}