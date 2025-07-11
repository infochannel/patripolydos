import { useState, useEffect } from "react";
import { ArrowLeft, Plus, ShoppingCart, Edit3, Trash2, Calendar, BarChart3, Filter, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  note?: string;
  date: string;
  createdAt: string;
}

interface GastosProps {
  onBack: () => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Alimentación", color: "bg-green-500", icon: "🍕" },
  { id: "2", name: "Transporte", color: "bg-blue-500", icon: "🚗" },
  { id: "3", name: "Entretenimiento", color: "bg-purple-500", icon: "🎮" },
  { id: "4", name: "Salud", color: "bg-red-500", icon: "🏥" },
  { id: "5", name: "Educación", color: "bg-yellow-500", icon: "📚" },
  { id: "6", name: "Servicios", color: "bg-gray-500", icon: "💡" },
  { id: "7", name: "Ropa", color: "bg-pink-500", icon: "👕" },
  { id: "8", name: "Otros", color: "bg-orange-500", icon: "📦" }
];

export const Gastos = ({ onBack }: GastosProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  
  const [newExpense, setNewExpense] = useState({
    amount: 0,
    categoryId: "",
    note: "",
    date: new Date().toISOString().slice(0, 10)
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "bg-blue-500",
    icon: "📦"
  });

  const { toast } = useToast();

  useEffect(() => {
    const savedExpenses = localStorage.getItem('gastos-expenses');
    const savedCategories = localStorage.getItem('gastos-categories');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  const saveExpenses = (updatedExpenses: Expense[]) => {
    localStorage.setItem('gastos-expenses', JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
  };

  const saveCategories = (updatedCategories: Category[]) => {
    localStorage.setItem('gastos-categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
  };

  const addExpense = () => {
    if (!newExpense.categoryId || newExpense.amount <= 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      amount: newExpense.amount,
      categoryId: newExpense.categoryId,
      note: newExpense.note,
      date: newExpense.date,
      createdAt: new Date().toISOString()
    };

    const updatedExpenses = [...expenses, expense];
    saveExpenses(updatedExpenses);

    setNewExpense({
      amount: 0,
      categoryId: "",
      note: "",
      date: new Date().toISOString().slice(0, 10)
    });
    setIsExpenseDialogOpen(false);
    
    toast({
      title: "Gasto registrado",
      description: "El gasto ha sido agregado correctamente"
    });
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    saveExpenses(updatedExpenses);
    
    toast({
      title: "Gasto eliminado",
      description: "El gasto ha sido eliminado correctamente"
    });
  };

  const addCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es requerido",
        variant: "destructive"
      });
      return;
    }

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      color: newCategory.color,
      icon: newCategory.icon
    };

    const updatedCategories = [...categories, category];
    saveCategories(updatedCategories);

    setNewCategory({ name: "", color: "bg-blue-500", icon: "📦" });
    setIsCategoryDialogOpen(false);
    
    toast({
      title: "Categoría creada",
      description: "La nueva categoría ha sido agregada"
    });
  };

  const updateCategory = () => {
    if (!editingCategory || !newCategory.name) return;

    const updatedCategories = categories.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, name: newCategory.name, color: newCategory.color, icon: newCategory.icon }
        : cat
    );
    
    saveCategories(updatedCategories);
    setEditingCategory(null);
    setNewCategory({ name: "", color: "bg-blue-500", icon: "📦" });
    setIsCategoryDialogOpen(false);
    
    toast({
      title: "Categoría actualizada",
      description: "Los cambios han sido guardados"
    });
  };

  const deleteCategory = (id: string) => {
    // Don't allow deleting if there are expenses in this category
    const hasExpenses = expenses.some(expense => expense.categoryId === id);
    if (hasExpenses) {
      toast({
        title: "No se puede eliminar",
        description: "Esta categoría tiene gastos asociados",
        variant: "destructive"
      });
      return;
    }

    const updatedCategories = categories.filter(cat => cat.id !== id);
    saveCategories(updatedCategories);
    
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada"
    });
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
    setIsCategoryDialogOpen(true);
  };

  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      const matchesCategory = selectedCategory === "all" || expense.categoryId === selectedCategory;
      const matchesMonth = expense.date.startsWith(selectedMonth);
      return matchesCategory && matchesMonth;
    });
  };

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  const getMonthlyTotal = () => {
    return getFilteredExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = () => {
    const filtered = getFilteredExpenses();
    const grouped = categories.map(category => {
      const categoryExpenses = filtered.filter(expense => expense.categoryId === category.id);
      const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        category,
        total,
        count: categoryExpenses.length,
        percentage: filtered.length > 0 ? (total / getMonthlyTotal()) * 100 : 0
      };
    }).filter(item => item.total > 0);

    return grouped.sort((a, b) => b.total - a.total);
  };

  const colorOptions = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-gray-500",
    "bg-orange-500", "bg-teal-500", "bg-cyan-500", "bg-lime-500"
  ];

  const iconOptions = ["📦", "🍕", "🚗", "🎮", "🏥", "📚", "💡", "👕", "💰", "🏠", "📱", "✈️"];

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
            <h1 className="text-3xl font-bold text-white">Gastos</h1>
            <p className="text-white/80">Controla tus gastos diarios</p>
          </div>
        </div>

        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="expenses" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              Gastos
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              Categorías
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              Reportes
            </TabsTrigger>
          </TabsList>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            {/* Filters and Add Expense */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Total del Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${getMonthlyTotal().toLocaleString('es-MX')}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-white text-primary hover:bg-white/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Gasto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Nuevo Gasto</DialogTitle>
                        <DialogDescription>
                          Registra un nuevo gasto en tu presupuesto
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expense-amount">Cantidad</Label>
                            <Input
                              id="expense-amount"
                              type="number"
                              placeholder="0"
                              value={newExpense.amount || ""}
                              onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="expense-date">Fecha</Label>
                            <Input
                              id="expense-date"
                              type="date"
                              value={newExpense.date}
                              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="expense-category">Categoría</Label>
                          <Select value={newExpense.categoryId} onValueChange={(value) => setNewExpense({ ...newExpense, categoryId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.icon} {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="expense-note">Nota (opcional)</Label>
                          <Textarea
                            id="expense-note"
                            placeholder="Descripción del gasto..."
                            value={newExpense.note}
                            onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })}
                          />
                        </div>
                        <Button onClick={addExpense} className="w-full">
                          Agregar Gasto
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Expenses List */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Gastos del Mes
                </CardTitle>
                <CardDescription className="text-white/70">
                  {getFilteredExpenses().length} gastos registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getFilteredExpenses().length === 0 ? (
                  <div className="text-center py-8 text-white/70">
                    No hay gastos registrados para este período
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getFilteredExpenses()
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((expense) => {
                        const category = getCategoryById(expense.categoryId);
                        return (
                          <div key={expense.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center gap-3">
                              {category && (
                                <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center`}>
                                  <span className="text-white">{category.icon}</span>
                                </div>
                              )}
                              <div>
                                <h3 className="font-medium text-white">
                                  {category?.name || "Sin categoría"}
                                </h3>
                                <p className="text-sm text-white/70">
                                  {new Date(expense.date).toLocaleDateString('es-ES')}
                                </p>
                                {expense.note && (
                                  <p className="text-xs text-white/60 mt-1">{expense.note}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-lg font-semibold text-white">
                                ${expense.amount.toLocaleString('es-MX')}
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteExpense(expense.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white">Gestión de Categorías</h2>
                <p className="text-white/70">Crea y edita las categorías de gastos</p>
              </div>
              <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
                setIsCategoryDialogOpen(open);
                if (!open) {
                  setEditingCategory(null);
                  setNewCategory({ name: "", color: "bg-blue-500", icon: "📦" });
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-primary hover:bg-white/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Categoría
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCategory ? "Modifica los datos de la categoría" : "Crea una nueva categoría de gastos"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category-name">Nombre</Label>
                      <Input
                        id="category-name"
                        placeholder="ej. Entretenimiento"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Color</Label>
                      <div className="grid grid-cols-6 gap-2 mt-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full ${color} border-2 ${
                              newCategory.color === color ? 'border-gray-800' : 'border-gray-300'
                            }`}
                            onClick={() => setNewCategory({ ...newCategory, color })}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Icono</Label>
                      <div className="grid grid-cols-6 gap-2 mt-2">
                        {iconOptions.map((icon) => (
                          <button
                            key={icon}
                            className={`w-8 h-8 rounded border-2 flex items-center justify-center ${
                              newCategory.icon === icon ? 'border-gray-800 bg-gray-100' : 'border-gray-300'
                            }`}
                            onClick={() => setNewCategory({ ...newCategory, icon })}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={editingCategory ? updateCategory : addCategory} 
                      className="w-full"
                    >
                      {editingCategory ? "Actualizar Categoría" : "Crear Categoría"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const expenseCount = expenses.filter(e => e.categoryId === category.id).length;
                return (
                  <Card key={category.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center`}>
                            <span className="text-white text-lg">{category.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{category.name}</h3>
                            <p className="text-sm text-white/70">{expenseCount} gastos</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditCategory(category)}
                            className="text-white hover:bg-white/10"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCategory(category.id)}
                            className="text-red-300 hover:bg-red-500/20"
                            disabled={expenseCount > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Monthly Summary */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Resumen Mensual
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {new Date(selectedMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">
                      ${getMonthlyTotal().toLocaleString('es-MX')}
                    </div>
                    <div className="text-white/70">Total gastado</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-semibold text-white">
                        {getFilteredExpenses().length}
                      </div>
                      <div className="text-sm text-white/70">Transacciones</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-white">
                        ${getFilteredExpenses().length > 0 ? (getMonthlyTotal() / getFilteredExpenses().length).toFixed(0) : '0'}
                      </div>
                      <div className="text-sm text-white/70">Promedio por gasto</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Categories */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Gastos por Categoría
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Distribución del presupuesto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getExpensesByCategory().map((item) => (
                      <div key={item.category.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${item.category.color} flex items-center justify-center`}>
                            <span className="text-white text-sm">{item.category.icon}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{item.category.name}</div>
                            <div className="text-white/70 text-sm">{item.count} gastos</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">
                            ${item.total.toLocaleString('es-MX')}
                          </div>
                          <div className="text-white/70 text-sm">
                            {item.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};