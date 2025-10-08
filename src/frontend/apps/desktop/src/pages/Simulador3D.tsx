import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Maximize,
  Download,
  Cpu,
  Zap,
  Activity
} from "lucide-react";

const robotModels = [
  { id: 1, name: "MetaBot Basic", status: "active" },
  { id: 2, name: "Industrial Arm", status: "available" },
  { id: 3, name: "Autonomous Drone", status: "locked" }
];

const simulationStats = [
  { label: "CPU Usage", value: "34%", icon: Cpu },
  { label: "Power Draw", value: "2.4A", icon: Zap },
  { label: "Simulation Speed", value: "1.2x", icon: Activity }
];

export default function Simulador3D() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(robotModels[0]);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Simulador 3D</h1>
          <p className="text-muted-foreground mt-2">
            Teste e programe robôs em ambiente virtual
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button variant="outline" size="sm">
            <Maximize className="h-4 w-4 mr-2" />
            Tela Cheia
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Simulator Area */}
        <div className="xl:col-span-3 space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between bg-brand-surface border border-brand-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={toggleSimulation}
                className={isSimulating ? "bg-destructive hover:bg-destructive/90" : ""}
              >
                {isSimulating ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>

              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>

              <Badge variant={isSimulating ? "default" : "secondary"}>
                {isSimulating ? "Simulando" : "Parado"}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              Modelo: <span className="text-foreground font-medium">{selectedRobot.name}</span>
            </div>
          </div>

          {/* 3D Viewport */}
          <Card className="bg-brand-surface border-brand-border">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-brand-input-bg to-brand-surface rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* 3D Canvas Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />

                {/* Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }}
                />

                {/* Robot Model Placeholder */}
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {selectedRobot.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {isSimulating ? "Simulação em execução..." : "Clique em Iniciar para começar"}
                  </p>
                </div>

                {/* Status Indicators */}
                {isSimulating && (
                  <div className="absolute top-4 right-4 space-y-2">
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-1 text-xs text-green-300">
                      ● Online
                    </div>
                    <div className="bg-primary/20 border border-primary/50 rounded-lg px-3 py-1 text-xs text-primary">
                      ● Recording
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Robot Models */}
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Modelos de Robô</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {robotModels.map((robot) => (
                <div
                  key={robot.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedRobot.id === robot.id
                    ? "border-primary bg-primary/10"
                    : "border-brand-border hover:border-primary/50"
                    } ${robot.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => robot.status !== 'locked' && setSelectedRobot(robot)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{robot.name}</span>
                    <Badge
                      variant={
                        robot.status === 'active' ? 'default' :
                          robot.status === 'available' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {robot.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Simulation Stats */}
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Status da Simulação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {simulationStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-semibold text-foreground">{stat.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="secondary">
                Carregar Programa
              </Button>
              <Button className="w-full justify-start" variant="secondary">
                Salvar Estado
              </Button>
              <Button className="w-full justify-start" variant="secondary">
                Compartilhar Simulação
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}