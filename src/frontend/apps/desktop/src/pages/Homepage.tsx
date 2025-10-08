import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Clock, Plus } from "lucide-react";

// Import course images
import courseRoboticsImage from "@/assets/course-robotics.jpg";
import courseAiImage from "@/assets/course-ai.jpg";

// Mock data
const newCourses = [
  {
    id: 1,
    title: "Robótica com Arduino",
    description: "Aprenda os fundamentos da robótica usando Arduino e sensores.",
    image: courseRoboticsImage
  },
  {
    id: 2,
    title: "Inteligência Artificial Aplicada",
    description: "Implementação de IA em sistemas robóticos modernos.",
    image: courseAiImage
  }
];

const recentClasses = [
  { title: "Sensores e Atuadores", progress: 75, duration: "45min" },
  { title: "Programação em C++", progress: 60, duration: "1h 20min" },
  { title: "Visão Computacional", progress: 30, duration: "2h" }
];

const news = [
  {
    title: "Nova versão do MetaBot disponível",
    date: "Há 2 dias",
    description: "Conheça as novas funcionalidades do nosso robô educacional."
  },
  {
    title: "Competição de Robótica 2024",
    date: "Há 1 semana",
    description: "Inscrições abertas para a maior competição de robótica do país."
  }
];

export default function Homepage() {

  const navigate = useNavigate()

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo de volta! 👋
        </h1>
        <p className="text-muted-foreground">
          Continue sua jornada de aprendizado em robótica e IA
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-brand-surface border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">Cursos Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-surface border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24h</p>
                <p className="text-sm text-muted-foreground">Estudadas este mês</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-surface border-brand-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">85%</p>
                <p className="text-sm text-muted-foreground">Progresso médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Minhas Aulas */}
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle className="text-foreground">Minhas Aulas Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentClasses.map((cls, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-brand-input-bg rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{cls.title}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1 bg-brand-surface rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${cls.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{cls.progress}%</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button variant="secondary" size="sm" onClick={() => navigate("/app/aula")}>
                      Continuar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resumo de Cursos Novos */}
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Novos Cursos</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/app/marketplace")}>
                Ver Todos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                    duration="18h"
                    students={89}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notícias */}
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle className="text-foreground">Notícias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {news.map((item, index) => (
                <div key={index} className="border-b border-brand-border last:border-0 pb-4 last:pb-0">
                  <h4 className="font-medium text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Action */}
          <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Explore Novos Cursos
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Descubra nossa biblioteca completa de cursos de robótica
              </p>
              <Button className="w-full" onClick={() => navigate("/app/marketplace")}>
                Ir para Marketplace
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}