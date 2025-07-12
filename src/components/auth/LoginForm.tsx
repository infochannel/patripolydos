import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import patripolyLogo from "@/assets/patripoly-logo.png";
import axios from "@/lib/axios";
import { Link, useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onToggleMode: () => void;
}


export function LoginForm({ onToggleMode }: LoginFormProps) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email: email,
        password: password,
        remember:false,
      });
      // Suponiendo que el token viene en response.data.token
      if (response.data && response.data.accessToken) {
        localStorage.setItem('patripoly_user', JSON.stringify(response.data.usuario));
        localStorage.setItem('token', `${response.data.accessToken}`);
        localStorage.setItem('isAuthenticated', 'true');
        
        toast({
          title:'login_successful',
          description: 'Redirigiendo al panel de control' ,
        });
        // Redirige inmediatamente a la raíz
        // navigate('/', { replace: true });
        location.reload();
      } else {
        toast({
          title: 'Error de inicio de sesión',
          description: 'Credenciales inválidas' ,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title:'Error de inicio de sesión',
        description: error?.response?.data?.message || 'Error al conectar con el servidor',
        variant: 'destructive',
      });
    }
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
          <CardTitle className="text-2xl font-bold text-primary">¡Bienvenido de vuelta!</CardTitle>
          <CardDescription>Continúa tu viaje hacia la libertad financiera</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
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
          <Button 
            type="submit" 
            className="w-full" 
            variant="success"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
          <div className="text-center space-y-2">
            <Button variant="link" size="sm">
              ¿Olvidaste tu contraseña?
            </Button>
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Button variant="link" size="sm" onClick={onToggleMode} className="p-0">
                Regístrate aquí
              </Button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}