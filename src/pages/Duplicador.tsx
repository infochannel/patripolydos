import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Target, Trophy, Plus, Calendar, Image, FileText, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FlipLevelCard } from "@/components/duplicador/FlipLevelCard";
import { FlipProgressMap } from "@/components/duplicador/FlipProgressMap";
import { AchievementBadges } from "@/components/duplicador/AchievementBadges";

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
  const [showLevelUp, setShowLevelUp] = useState(false);
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
      
      // Show level up animation
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2000);
      
      setCurrentFlip(nextFlip);
      setCurrentAmount(nextAmount);
      
      if (nextFlip === maxFlips) {
        setIsCompleted(true);
        toast({
          title: "¡Felicitaciones!",
          description: "¡Has completado el Duplicador Challenge!",
        });
      } else {
        toast({
          title: `🎮 ¡Flip ${currentFlip} completado!`,
          description: `Has desbloqueado el Flip ${nextFlip}. ¡Sigue así!`,
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
    toast({
      title: "Challenge reiniciado",
      description: "Todos los datos han sido eliminados. ¡Buena suerte en tu nuevo intento!",
    });
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Duplicador Challenge</h1>
            <Badge variant="secondary">Flip {currentFlip} de {maxFlips}</Badge>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reiniciar Reto
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Reiniciar el Duplicador Challenge?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente todo tu progreso, incluyendo {actionLogs.length} acciones registradas y {currentFlip - 1} flips completados. No podrás recuperar estos datos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={resetChallenge} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Sí, reiniciar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Level Up Animation Overlay */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="text-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <Sparkles className="h-24 w-24 text-yellow-500 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-4xl font-bold text-primary mb-2">¡FLIP COMPLETADO!</h2>
                <p className="text-xl text-muted-foreground">Nivel {currentFlip} desbloqueado</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Card - Game Style */}
            <FlipLevelCard 
              currentFlip={currentFlip}
              currentAmount={currentAmount}
              maxFlips={maxFlips}
              showAnimation={showLevelUp}
            />

            {/* Progress Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Mapa de Progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FlipProgressMap 
                  currentFlip={currentFlip}
                  maxFlips={maxFlips}
                  actionLogs={actionLogs}
                />
              </CardContent>
            </Card>

            {/* Current Flip Actions */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm">
                    FLIP {currentFlip}
                  </span>
                  <span className="text-2xl font-bold">{formatCurrency(currentAmount)}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-lg text-muted-foreground">{formatCurrency(calculateExpectedAmount(currentFlip + 1))}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1" size="lg">
                          <Plus className="h-5 w-5 mr-2" />
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
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={handleCompleteFlip}
                          variant="outline"
                          size="lg"
                          disabled={actionLogs.filter(log => log.flip === currentFlip).length === 0}
                          className="border-2 border-green-500/50 hover:bg-green-500/10 hover:border-green-500"
                        >
                          <Trophy className="h-5 w-5 mr-2 text-green-500" />
                          Completar Flip
                        </Button>
                      </motion.div>
                    )}
                  </div>

                  {/* Current flip actions */}
                  <div className="space-y-2">
                    {actionLogs.filter(log => log.flip === currentFlip).length === 0 ? (
                      <p className="text-center text-muted-foreground py-4 bg-muted/30 rounded-lg">
                        Registra al menos una acción para completar este flip
                      </p>
                    ) : (
                      actionLogs.filter(log => log.flip === currentFlip).map((log) => (
                        <motion.div 
                          key={log.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                        >
                          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{log.description}</p>
                            <p className="text-xs text-muted-foreground">{log.date}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Log - Collapsed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Historial de Acciones</span>
                  <Badge variant="secondary">{actionLogs.length} registros</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {actionLogs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No hay acciones registradas aún
                    </p>
                  ) : (
                    actionLogs.slice().reverse().map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Badge variant="outline" className="shrink-0">Flip {log.flip}</Badge>
                        <p className="text-sm flex-1 truncate">{log.description}</p>
                        <span className="text-xs text-muted-foreground shrink-0">{log.date}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Game Stats */}
          <div className="space-y-6">
            {/* Achievements */}
            <AchievementBadges 
              currentFlip={currentFlip}
              actionLogs={actionLogs}
              currentAmount={currentAmount}
            />

            {/* Stats Card - Game Style */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <motion.div 
                    className="text-center p-4 bg-background rounded-xl border"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-3xl font-bold text-primary">{currentFlip - 1}</div>
                    <p className="text-xs text-muted-foreground">Flips Completados</p>
                  </motion.div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-background rounded-lg border">
                      <div className="text-xl font-bold">{actionLogs.length}</div>
                      <p className="text-[10px] text-muted-foreground">Acciones</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg border">
                      <div className="text-xl font-bold">×{currentAmount.toLocaleString()}</div>
                      <p className="text-[10px] text-muted-foreground">Multiplicador</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Próximos objetivos:</p>
                    {Array.from({ length: Math.min(3, maxFlips - currentFlip) }, (_, i) => {
                      const flipNumber = currentFlip + i + 1;
                      const amount = calculateExpectedAmount(flipNumber);
                      return (
                        <div key={flipNumber} className="flex justify-between text-sm p-2 bg-background/50 rounded-lg">
                          <span className="text-muted-foreground">Flip {flipNumber}</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                      );
                    })}
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