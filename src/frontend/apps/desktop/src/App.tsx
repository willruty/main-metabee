import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import MeusCursos from "./pages/MeusCursos";
import Marketplace from "./pages/Marketplace";
import Simulador3D from "./pages/Simulador3D";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/meus-cursos" element={<MeusCursos />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/simulador-3d" element={<Simulador3D />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
