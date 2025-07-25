import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import "./login.css";
import { University } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      
      if (!success) {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <CardContent>
          <div className="login-header">
            <div className="login-logo">
              <University className="text-white w-8 h-8" />
            </div>
            <h1 className="login-title">Banco Solidario</h1>
            <p className="login-subtitle">Sistema de Gestión de Préstamos</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div>
              <Label>Nombre</Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su nombre"
                required
              />
            </div>
            
            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>
            
            <Button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="forgot-link">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
