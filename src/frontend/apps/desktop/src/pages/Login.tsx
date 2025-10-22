import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo-removebg-preview.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = isLoginMode ? "/api/v1/login" : "/api/v1/register";
    const body = isLoginMode
      ? { email, password }
      : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro. Tente novamente.");
      }

      if (isLoginMode) {
        localStorage.setItem("authToken", data.token);
        navigate("/app/homepage");
      } else {
        setIsLoginMode(true);
        setError("Cadastro realizado com sucesso! Faça o login.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-brand-surface border-brand-border">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-18 h-18" />
            </div>
          </div>

          <CardTitle className="text-3xl font-bold text-primary">
            {isLoginMode ? "Acessar Plataforma" : "Criar Conta"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            MetaStation
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-brand-input-bg border-brand-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
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

            {error && (
              <p className="text-sm font-medium text-red-500 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
              disabled={isLoading}
            >
              {isLoading
                ? "Carregando..."
                : isLoginMode
                  ? "Entrar"
                  : "Cadastrar"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={toggleMode}
              className="text-muted-foreground hover:text-primary"
            >
              {isLoginMode
                ? "Ainda não tenho conta."
                : "Já tenho conta! Fazer Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}