import { useState } from "react";
import { ArrowLeft, Plus, TrendingUp, Building, Car, Coins, CreditCard, PiggyBank, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
  value: number;
  category: string;
  type: 'asset' | 'liability';
}

interface PatrimonioProps {
  onBack: () => void;
}

const assetCategories = [
  { id: 'real-estate', name: 'Inmobiliario', icon: Building },
  { id: 'vehicles', name: 'Vehículos', icon: Car },
  { id: 'investments', name: 'Inversiones', icon: TrendingUp },
  { id: 'savings', name: 'Ahorros', icon: PiggyBank },
  { id: 'other-assets', name: 'Otros Activos', icon: Coins },
];

const liabilityCategories = [
  { id: 'mortgage', name: 'Hipoteca', icon: Building },
  { id: 'loans', name: 'Préstamos', icon: Landmark },
  { id: 'credit-cards', name: 'Tarjetas de Crédito', icon: CreditCard },
  { id: 'other-debts', name: 'Otras Deudas', icon: CreditCard },
];

const countries = [
  { code: 'ES', name: 'España', currency: 'EUR' },
  { code: 'CH', name: 'Suiza', currency: 'CHF' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'US', name: 'Estados Unidos', currency: 'USD' },
  { code: 'DE', name: 'Alemania', currency: 'EUR' },
];

export function Patrimonio({ onBack }: PatrimonioProps) {
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: 'Casa Principal', value: 250000, category: 'real-estate', type: 'asset' },
    { id: '2', name: 'Coche', value: 15000, category: 'vehicles', type: 'asset' },
    { id: '3', name: 'Cuenta de Ahorros', value: 25000, category: 'savings', type: 'asset' },
    { id: '4', name: 'Hipoteca Casa', value: 180000, category: 'mortgage', type: 'liability' },
  ]);
  
  const [selectedCountry, setSelectedCountry] = useState('ES');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    value: '',
    category: '',
    type: 'asset' as 'asset' | 'liability'
  });
  
  const { toast } = useToast();

  const totalAssets = assets.filter(a => a.type === 'asset').reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = assets.filter(a => a.type === 'liability').reduce((sum, asset) => sum + asset.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.value || !newAsset.category) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const asset: Asset = {
      id: Date.now().toString(),
      name: newAsset.name,
      value: parseFloat(newAsset.value),
      category: newAsset.category,
      type: newAsset.type
    };

    setAssets([...assets, asset]);
    setNewAsset({ name: '', value: '', category: '', type: 'asset' });
    setIsDialogOpen(false);
    
    toast({
      title: "¡Éxito!",
      description: `${newAsset.type === 'asset' ? 'Activo' : 'Pasivo'} añadido correctamente`,
    });
  };

  const getNetWorthRank = () => {
    const country = countries.find(c => c.code === selectedCountry);
    if (netWorth >= 500000) return { level: "Top 5%", color: "bg-gradient-primary text-white" };
    if (netWorth >= 200000) return { level: "Top 20%", color: "bg-gradient-secondary text-white" };
    if (netWorth >= 100000) return { level: "Top 40%", color: "bg-teal text-white" };
    if (netWorth >= 50000) return { level: "Promedio", color: "bg-yellow text-black" };
    return { level: "Inicial", color: "bg-muted text-muted-foreground" };
  };

  const formatCurrency = (amount: number) => {
    const country = countries.find(c => c.code === selectedCountry);
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: country?.currency || 'EUR'
    }).format(amount);
  };

  const getCategoryAssets = (categoryId: string, type: 'asset' | 'liability') => {
    return assets.filter(asset => asset.category === categoryId && asset.type === type);
  };

  const rank = getNetWorthRank();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onBack}
            className="hover-scale"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Patrimonio</h1>
            <p className="text-muted-foreground">Gestiona y rastrea tu patrimonio neto</p>
          </div>
        </div>

        {/* Net Worth Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Activos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalAssets)}</div>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pasivos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{formatCurrency(totalLiabilities)}</div>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Patrimonio Neto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {formatCurrency(netWorth)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nivel de Rango</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={rank.color}>{rank.level}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="summary" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-4">
              <TabsTrigger value="summary">Resumen</TabsTrigger>
              <TabsTrigger value="categories">Categorías</TabsTrigger>
              <TabsTrigger value="ranking">Ranking</TabsTrigger>
              <TabsTrigger value="settings">Ajustes</TabsTrigger>
            </TabsList>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary text-white hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Activo/Pasivo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir Nuevo Elemento</DialogTitle>
                  <DialogDescription>
                    Agrega un nuevo activo o pasivo a tu patrimonio
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <RadioGroup 
                      value={newAsset.type} 
                      onValueChange={(value) => setNewAsset({...newAsset, type: value as 'asset' | 'liability', category: ''})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="asset" id="asset" />
                        <Label htmlFor="asset">Activo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="liability" id="liability" />
                        <Label htmlFor="liability">Pasivo</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                      placeholder="Ej: Casa, Coche, Hipoteca..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="value">Valor</Label>
                    <Input
                      id="value"
                      type="number"
                      value={newAsset.value}
                      onChange={(e) => setNewAsset({...newAsset, value: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select value={newAsset.category} onValueChange={(value) => setNewAsset({...newAsset, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {(newAsset.type === 'asset' ? assetCategories : liabilityCategories).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleAddAsset} className="w-full bg-gradient-primary text-white">
                    Añadir
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assets */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-emerald-600">Activos</CardTitle>
                  <CardDescription>Tus posesiones y inversiones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assets.filter(a => a.type === 'asset').map((asset) => (
                      <div key={asset.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-medium">{asset.name}</span>
                        <span className="text-emerald-600 font-semibold">{formatCurrency(asset.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Liabilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-500">Pasivos</CardTitle>
                  <CardDescription>Tus deudas y obligaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assets.filter(a => a.type === 'liability').map((asset) => (
                      <div key={asset.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-medium">{asset.name}</span>
                        <span className="text-red-500 font-semibold">{formatCurrency(asset.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-emerald-600">Categorías de Activos</h3>
                <div className="space-y-4">
                  {assetCategories.map((category) => {
                    const categoryAssets = getCategoryAssets(category.id, 'asset');
                    const categoryTotal = categoryAssets.reduce((sum, asset) => sum + asset.value, 0);
                    const Icon = category.icon;
                    
                    return (
                      <Card key={category.id} className="hover-scale">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-emerald-600" />
                              <div>
                                <div className="font-medium">{category.name}</div>
                                <div className="text-sm text-muted-foreground">{categoryAssets.length} elementos</div>
                              </div>
                            </div>
                            <div className="text-emerald-600 font-semibold">{formatCurrency(categoryTotal)}</div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-500">Categorías de Pasivos</h3>
                <div className="space-y-4">
                  {liabilityCategories.map((category) => {
                    const categoryAssets = getCategoryAssets(category.id, 'liability');
                    const categoryTotal = categoryAssets.reduce((sum, asset) => sum + asset.value, 0);
                    const Icon = category.icon;
                    
                    return (
                      <Card key={category.id} className="hover-scale">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-red-500" />
                              <div>
                                <div className="font-medium">{category.name}</div>
                                <div className="text-sm text-muted-foreground">{categoryAssets.length} elementos</div>
                              </div>
                            </div>
                            <div className="text-red-500 font-semibold">{formatCurrency(categoryTotal)}</div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ranking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tu Posición en el Ranking</CardTitle>
                <CardDescription>Comparación basada en datos nacionales de {countries.find(c => c.code === selectedCountry)?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{formatCurrency(netWorth)}</div>
                    <Badge className={`${rank.color} text-lg px-4 py-2`}>{rank.level}</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Top 5% (Muy Alto)</span>
                      <span className="text-muted-foreground">€500,000+</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Top 20% (Alto)</span>
                      <span className="text-muted-foreground">€200,000 - €499,999</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Top 40% (Medio-Alto)</span>
                      <span className="text-muted-foreground">€100,000 - €199,999</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Promedio</span>
                      <span className="text-muted-foreground">€50,000 - €99,999</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span>Inicial</span>
                      <span className="text-muted-foreground">&lt; €50,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Patrimonio</CardTitle>
                <CardDescription>Ajusta la configuración para el cálculo de tu patrimonio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>País de Comparación</Label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name} ({country.currency})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Esto afecta la moneda mostrada y los datos de comparación del ranking
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}