import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Clock, Plus } from "lucide-react";
import { getAllCourses, Course, getCourseImageUrl } from "../services/CourseService";
import { fetchDashboardData } from "../services/DashboardService";

interface DashboardData {
  user_name: string;
  active_courses: number;
  hours_this_month: number;
  average_progress: number;
  recent_lessons: Array<{
    course_id?: string;
    lesson_id?: string;
    id?: string;
    title?: string;
    progress?: number;
  }>;
  last_news: Array<{
    title: string;
    content: string;
    created_at: string;
  }>;
  last_courses?: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    created_at: string;
  }>;
}

export default function Homepage() {
  const [userName, setUserName] = useState("Usuário");
  const [newCourses, setNewCourses] = useState<Course[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Carregar dados do dashboard
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Limpar erro anterior
        
        // Verificar se o token existe antes de fazer a requisição
        const token = localStorage.getItem("authToken");
        console.log("🔍 Homepage: Verificando token...", token ? "Token encontrado" : "Token não encontrado");
        
        if (!token) {
          throw new Error("Token não encontrado. Faça login novamente.");
        }
        
        const data = await fetchDashboardData();
        setDashboardData(data);
        setUserName(data.user_name || "Usuário");
      } catch (err: any) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError(err.message || "Erro ao carregar dados");
        // Manter valores padrão em caso de erro
        setDashboardData({
          user_name: "Usuário",
          active_courses: 0,
          hours_this_month: 0,
          average_progress: 0,
          recent_lessons: [],
          last_news: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Carregar cursos
    getAllCourses().then(courses => {
      const sortedCourses = courses.courses.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      setNewCourses(sortedCourses.slice(0, 2));
    });
  }, []);

  const navigate = useNavigate()

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo de volta, <span className="text-primary">{isLoading ? "..." : userName}!</span> 👋
        </h1>
        <p className="text-muted-foreground">
          Continue sua jornada de aprendizado em robótica e IA
        </p>
        {error && (
          <p className="text-sm text-red-500 mt-2">
            ⚠️ {error}
          </p>
        )}
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
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? "..." : (dashboardData?.active_courses || 0)}
                </p>
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
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? "..." : (dashboardData?.hours_this_month ? `${Math.round(dashboardData.hours_this_month)}h` : "0h")}
                </p>
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
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? "..." : (dashboardData?.average_progress ? `${Math.round(dashboardData.average_progress)}%` : "0%")}
                </p>
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
              {isLoading ? (
                <p className="text-muted-foreground text-center py-4">Carregando...</p>
              ) : dashboardData?.recent_lessons && dashboardData.recent_lessons.length > 0 ? (
                dashboardData.recent_lessons.map((lesson: any, index: number) => (
                  <div key={lesson.id || index} className="flex items-center justify-between p-4 bg-brand-input-bg rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{lesson.title || `Aula ${index + 1}`}</h4>
                      {lesson.progress !== undefined && (
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex-1 bg-brand-surface rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${lesson.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{Math.round(lesson.progress || 0)}%</span>
                        </div>
                      )}
                    </div>
                    {(lesson.course_id || lesson.id) && (
                      <div className="ml-4">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => navigate(`/app/aula?courseId=${lesson.course_id || lesson.id}&lessonId=${lesson.lesson_id || lesson.id}`)}
                        >
                          Continuar
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhuma aula recente</p>
              )}
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
              {newCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {newCourses.map((course) => {
                    const imageUrl = getCourseImageUrl(course._id, course.image);
                    return (
                      <CourseCard
                        key={course._id}
                        id={parseInt(course._id) || 0}
                        title={course.title}
                        description={course.description}
                        image={imageUrl}
                        duration={`${course.duration}h`}
                        students={0}
                        onAction={() => navigate(`/app/visao-geral-curso?courseId=${course._id}`)}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhum curso disponível</p>
              )}
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
              {isLoading ? (
                <p className="text-muted-foreground text-center py-4">Carregando...</p>
              ) : dashboardData?.last_news && dashboardData.last_news.length > 0 ? (
                dashboardData.last_news.map((item: any, index: number) => (
                  <div key={index} className="border-b border-brand-border last:border-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-foreground mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{item.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhuma notícia disponível</p>
              )}
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