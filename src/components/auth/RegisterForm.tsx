import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import patripolyLogo from "@/assets/patripoly-logo.png";
import axios from '@/lib/axios';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // // Simulate registration
    // setTimeout(() => {
    //   if (formData.name && formData.email && formData.password) {
    //     localStorage.setItem('patripoly_user', JSON.stringify({ 
    //       email: formData.email, 
    //       name: formData.name,
    //       patrimonioLevel: 'Nuevo Inversor',
    //       joinedAt: new Date().toISOString()
    //     }));
    //     toast({
    //       title: "¡Cuenta creada!",
    //       description: "Bienvenido a Patripoly. ¡Comienza tu viaje hacia la libertad financiera!",
    //     });
    //     window.location.reload();
    //   } else {
    //     toast({
    //       title: "Error",
    //       description: "Por favor completa todos los campos",
    //       variant: "destructive",
    //     });
    //   }
    //   setIsLoading(false);
    // }, 1000);

     try {
      
      const response = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        c_password: formData.confirmPassword,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem('patripoly_user', JSON.stringify(response.data.usuario));
        localStorage.setItem('token', `${response.data.accessToken}`);
        localStorage.setItem('isAuthenticated', 'true');
        
        toast({
          title: "¡Cuenta creada!",
          description: "Bienvenido a Patripoly. ¡Comienza tu viaje hacia la libertad financiera!",
        });

        location.reload();

      } else {

         toast({
          title: "Error",
          description: "Por favor completa todos los campos",
          variant: "destructive",
        });
      
      }

    } catch (error) {
      toast({
        title: 'Error de registro',
        description: error?.response?.data?.message || 'Error al conectar con el servidor',
        variant: 'destructive',
      });
    }

    setIsLoading(false);

  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-elevated">
      <CardHeader className="text-center space-y-4">
        <img 
          src={patripolyLogo} 
          alt="Patripoly Logo" 
          className="h-16 mx-auto"
        />
        <div>
          <CardTitle className="text-2xl font-bold text-primary">¡Únete a Patripoly!</CardTitle>
          <CardDescription>Comienza tu viaje hacia la libertad financiera</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10"
                minLength={6}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            variant="wealth"
            disabled={isLoading}
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Button variant="link" size="sm" onClick={onToggleMode} className="p-0">
                Inicia sesión aquí
              </Button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}