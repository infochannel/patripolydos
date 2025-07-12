import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Lock, Globe, DollarSign, Crown, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  name: string;
  email: string;
  profilePicture: string;
  defaultCurrency: string;
  comparisonCountry: string;
  plan: 'Free' | 'Premium';
  isPromoterActive: boolean;
}

interface ProfileProps {
  onBack: () => void;
}

const currencies = [
  { value: 'USD', label: 'USD - Dólar Estadounidense' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - Libra Esterlina' },
  { value: 'JPY', label: 'JPY - Yen Japonés' },
  { value: 'CAD', label: 'CAD - Dólar Canadiense' },
  { value: 'AUD', label: 'AUD - Dólar Australiano' },
  { value: 'CHF', label: 'CHF - Franco Suizo' },
  { value: 'CNY', label: 'CNY - Yuan Chino' },
  { value: 'MXN', label: 'MXN - Peso Mexicano' },
  { value: 'BRL', label: 'BRL - Real Brasileño' },
];

const countries = [
  { value: 'US', label: 'Estados Unidos' },
  { value: 'GB', label: 'Reino Unido' },
  { value: 'DE', label: 'Alemania' },
  { value: 'FR', label: 'Francia' },
  { value: 'JP', label: 'Japón' },
  { value: 'CA', label: 'Canadá' },
  { value: 'AU', label: 'Australia' },
  { value: 'CH', label: 'Suiza' },
  { value: 'SG', label: 'Singapur' },
  { value: 'ES', label: 'España' },
  { value: 'IT', label: 'Italia' },
  { value: 'NL', label: 'Países Bajos' },
  { value: 'SE', label: 'Suecia' },
  { value: 'NO', label: 'Noruega' },
  { value: 'DK', label: 'Dinamarca' },
  { value: 'MX', label: 'México' },
  { value: 'BR', label: 'Brasil' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
];

export function Profile({ onBack }: ProfileProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    profilePicture: '',
    defaultCurrency: 'USD',
    comparisonCountry: 'US',
    plan: 'Free',
    isPromoterActive: false,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load profile data from localStorage
    const userData = localStorage.getItem('patripoly_user');
    const profileSettings = localStorage.getItem('patripoly_profile_settings');
    
    if (userData) {
      const user = JSON.parse(userData);
      const settings = profileSettings ? JSON.parse(profileSettings) : {};
      
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        profilePicture: settings.profilePicture || '',
        defaultCurrency: settings.defaultCurrency || 'USD',
        comparisonCountry: settings.comparisonCountry || 'US',
        plan: settings.plan || 'Free',
        isPromoterActive: settings.isPromoterActive || false,
      });
    }
  }, []);

  const handleSaveProfile = () => {
    // Update user data
    const userData = JSON.parse(localStorage.getItem('patripoly_user') || '{}');
    userData.name = profileData.name;
    userData.email = profileData.email;
    localStorage.setItem('patripoly_user', JSON.stringify(userData));
    
    // Save profile settings
    const settings = {
      profilePicture: profileData.profilePicture,
      defaultCurrency: profileData.defaultCurrency,
      comparisonCountry: profileData.comparisonCountry,
      plan: profileData.plan,
      isPromoterActive: profileData.isPromoterActive,
    };
    localStorage.setItem('patripoly_profile_settings', JSON.stringify(settings));
    
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios han sido guardados exitosamente.",
    });
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos de contraseña.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would validate current password and update it
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    
    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido cambiada exitosamente.",
    });
  };

  const handleActivatePromoter = () => {
    navigate('/programa-promotor');
  };

  const userInitials = profileData.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-primary">Mi Perfil</h1>
              <p className="text-sm text-muted-foreground">Gestiona tu información personal y configuración</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.profilePicture} />
                <AvatarFallback className="bg-gradient-primary text-white font-semibold text-xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  Cambiar foto
                </Button>
                <p className="text-sm text-muted-foreground">
                  JPG, GIF o PNG. Máximo 1MB.
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={handleSaveProfile}>
              Guardar cambios
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Cambiar Contraseña
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña actual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={handleChangePassword}>
              Actualizar contraseña
            </Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferencias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Moneda predeterminada</Label>
                <Select
                  value={profileData.defaultCurrency}
                  onValueChange={(value) => setProfileData({ ...profileData, defaultCurrency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>País de comparación para estadísticas</Label>
                <Select
                  value={profileData.comparisonCountry}
                  onValueChange={(value) => setProfileData({ ...profileData, comparisonCountry: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSaveProfile}>
              Guardar preferencias
            </Button>
          </CardContent>
        </Card>

        {/* Plan and Features */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Plan Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Plan Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Plan {profileData.plan}</span>
                <Badge variant={profileData.plan === 'Premium' ? 'default' : 'secondary'}>
                  {profileData.plan}
                </Badge>
              </div>
              
              {profileData.plan === 'Free' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Actualiza a Premium para obtener:
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Análisis avanzados</li>
                    <li>• Reportes detallados</li>
                    <li>• Soporte prioritario</li>
                    <li>• Herramientas exclusivas</li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Actualizar a Premium
                  </Button>
                </div>
              )}

              {profileData.plan === 'Premium' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Disfruta de todas las funciones premium
                  </p>
                  <Button variant="outline" className="w-full">
                    Gestionar suscripción
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Promoter Program */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Programa Promotor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Estado</span>
                <Badge variant={profileData.isPromoterActive ? 'default' : 'secondary'}>
                  {profileData.isPromoterActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              
              {!profileData.isPromoterActive && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Únete al programa y gana dinero refiriendo usuarios
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Comisiones por referidos</li>
                    <li>• Código personalizado</li>
                    <li>• Estadísticas detalladas</li>
                    <li>• Pagos automáticos</li>
                  </ul>
                  <Button onClick={handleActivatePromoter} className="w-full">
                    Activar Programa
                  </Button>
                </div>
              )}

              {profileData.isPromoterActive && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    ¡Programa activo! Gestiona tus referidos y ganancias
                  </p>
                  <Button onClick={handleActivatePromoter} className="w-full">
                    Ver Dashboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}