import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Target, DollarSign, CheckCircle2, Circle, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface LifestyleItem {
  id: string;
  name: string;
  monthlyCost: number;
  isOwned: boolean;
  imageUrl?: string;
}

interface CalidadVidaProps {
  onBack: () => void;
}

export function CalidadVida({ onBack }: CalidadVidaProps) {
  const [items, setItems] = useState<LifestyleItem[]>([]);
  const [showOnlyDesired, setShowOnlyDesired] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LifestyleItem | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCost, setNewItemCost] = useState("");
  const [newItemImage, setNewItemImage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedItems = localStorage.getItem('calidad-vida-items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calidad-vida-items', JSON.stringify(items));
  }, [items]);

  const totalDesiredCost = items.reduce((sum, item) => sum + item.monthlyCost, 0);
  const ownedCost = items.filter(item => item.isOwned).reduce((sum, item) => sum + item.monthlyCost, 0);
  const progressPercentage = totalDesiredCost > 0 ? (ownedCost / totalDesiredCost) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un nombre para el item",
        variant: "destructive"
      });
      return;
    }

    const cost = parseFloat(newItemCost) || 0;
    if (cost < 0) {
      toast({
        title: "Error",
        description: "El costo debe ser un número positivo",
        variant: "destructive"
      });
      return;
    }

    const newItem: LifestyleItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      monthlyCost: cost,
      isOwned: false,
      imageUrl: newItemImage.trim() || undefined
    };

    setItems([...items, newItem]);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Item agregado",
      description: `${newItem.name} ha sido agregado a tu estilo de vida deseado`
    });
  };

  const handleEditItem = () => {
    if (!editingItem || !newItemName.trim()) return;

    const cost = parseFloat(newItemCost) || 0;
    if (cost < 0) {
      toast({
        title: "Error",
        description: "El costo debe ser un número positivo",
        variant: "destructive"
      });
      return;
    }

    setItems(items.map(item => 
      item.id === editingItem.id 
        ? { ...item, name: newItemName.trim(), monthlyCost: cost, imageUrl: newItemImage.trim() || undefined }
        : item
    ));

    resetForm();
    setEditingItem(null);
    
    toast({
      title: "Item actualizado",
      description: "Los cambios han sido guardados"
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Item eliminado",
      description: "El item ha sido eliminado de tu lista"
    });
  };

  const toggleOwnership = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isOwned: !item.isOwned } : item
    ));
  };

  const resetForm = () => {
    setNewItemName("");
    setNewItemCost("");
    setNewItemImage("");
  };

  const startEditing = (item: LifestyleItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemCost(item.monthlyCost.toString());
    setNewItemImage(item.imageUrl || "");
  };

  const filteredItems = showOnlyDesired ? items.filter(item => !item.isOwned) : items;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Calidad de Vida</h1>
          <Badge variant="secondary">Estilo de vida deseado</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progreso del Estilo de Vida
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {Math.round(progressPercentage)}%
                  </div>
                  <p className="text-sm text-muted-foreground">De tu estilo de vida deseado</p>
                </div>
                
                <Progress value={progressPercentage} className="h-3" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ya tienes:</span>
                    <span className="font-medium text-success">{formatCurrency(ownedCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Costo total deseado:</span>
                    <span className="font-medium">{formatCurrency(totalDesiredCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Falta por alcanzar:</span>
                    <span className="font-medium text-destructive">
                      {formatCurrency(totalDesiredCost - ownedCost)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Costo Mensual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(totalDesiredCost)}
                  </div>
                  <p className="text-sm text-muted-foreground">Costo mensual del estilo de vida deseado</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Items del Estilo de Vida</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={showOnlyDesired}
                        onCheckedChange={setShowOnlyDesired}
                      />
                      <Label className="text-sm">Solo mostrar deseados</Label>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Item
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Agregar Nuevo Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Nombre del item</Label>
                            <Input
                              id="name"
                              placeholder="Ej: Casa propia, Auto deportivo, Vacaciones..."
                              value={newItemName}
                              onChange={(e) => setNewItemName(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cost">Costo mensual (€)</Label>
                            <Input
                              id="cost"
                              type="number"
                              placeholder="0"
                              value={newItemCost}
                              onChange={(e) => setNewItemCost(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="image">URL de imagen (opcional)</Label>
                            <Input
                              id="image"
                              placeholder="https://ejemplo.com/imagen.jpg"
                              value={newItemImage}
                              onChange={(e) => setNewItemImage(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleAddItem} className="w-full">
                            Agregar Item
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {showOnlyDesired 
                          ? "No tienes items deseados pendientes" 
                          : "No has agregado items aún. ¡Comienza a definir tu estilo de vida ideal!"
                        }
                      </p>
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <Card 
                        key={item.id} 
                        className={`transition-all duration-200 ${
                          item.isOwned ? 'bg-success/5 border-success/20' : 'hover:shadow-md'
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {item.imageUrl && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-medium ${item.isOwned ? 'text-success' : ''}`}>
                                  {item.name}
                                </h3>
                                {item.isOwned && <Badge variant="secondary" className="text-xs">Owned</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(item.monthlyCost)}/mes
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleOwnership(item.id)}
                                className={`${item.isOwned ? 'text-success hover:text-success/80' : 'text-muted-foreground hover:text-foreground'}`}
                              >
                                {item.isOwned ? (
                                  <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                  <Circle className="h-5 w-5" />
                                )}
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEditing(item)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-destructive hover:text-destructive/80"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre del item</Label>
                <Input
                  id="edit-name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-cost">Costo mensual (€)</Label>
                <Input
                  id="edit-cost"
                  type="number"
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-image">URL de imagen (opcional)</Label>
                <Input
                  id="edit-image"
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditItem} className="flex-1">
                  Guardar Cambios
                </Button>
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}