import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const endpoint = "http://192.168.0.203:8080/metabee/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = `Erro: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch (err) {
          // caso não seja JSON, mantém a mensagem padrão
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        toast.success("Login realizado com sucesso!");
        localStorage.setItem("token", data.token);
        navigate("/app/homepage");
      } else {
        toast.error("Resposta inesperada do servidor.");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro no login, tente novamente");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-brand-surface border-brand-border">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">M</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            MetaStation
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Plataforma de Estudos da Metabee
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Email
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-brand-input-bg border-brand-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-brand-input-bg border-brand-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
              onSubmit={(e) => handleSubmit(e)}
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}