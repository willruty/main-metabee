import { useEffect, useState } from "react"
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMyCourses, Purchase } from "@/services/PurchaseService";
import { startCourseDownload } from "@/utils/downloadManager";
import { useToast } from "@/hooks/use-toast";
import { getCourseImageUrl } from "@/services/CourseService";

export default function MeusCursos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await getMyCourses();
      setCourses(response.courses);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar cursos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyMore = () => {
    navigate("/app/marketplace");
  };

  const handleDownload = async (course: Purchase) => {
    if (course.status === "downloaded") {
      navigate(`/app/visao-geral-curso?courseId=${course.course_id}`);
      return;
    }

    if (!course.drive_link) {
      toast({
        title: "Erro",
        description: "Link do Drive não disponível",
        variant: "destructive",
      });
      return;
    }

    try {
      setDownloading(prev => new Set(prev).add(course.purchase_id));
      
      await startCourseDownload(
        course.purchase_id,
        course.course_id,
        course.drive_link,
        (progress) => {
          // Atualizar progresso na UI
          console.log("Progresso:", progress);
        }
      );

      toast({
        title: "Sucesso",
        description: "Download concluído!",
      });

      // Recarregar cursos
      await loadCourses();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer download",
        variant: "destructive",
      });
    } finally {
      setDownloading(prev => {
        const newSet = new Set(prev);
        newSet.delete(course.purchase_id);
        return newSet;
      });
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meus Cursos</h1>
            <p className="text-muted-foreground mt-2">
              Continue sua jornada de aprendizado • {courses.length} cursos ativos
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                className="pl-10 w-64 bg-brand-input-bg border-brand-border"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Cursos Comprados</h3>
            <p className="text-2xl font-bold text-primary mt-1">{courses.length}</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Cursos Baixados</h3>
            <p className="text-2xl font-bold text-foreground mt-1">
              {courses.filter(c => c.status === "downloaded").length}
            </p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Em Download</h3>
            <p className="text-2xl font-bold text-secondary mt-1">
              {courses.filter(c => c.status === "downloading").length}
            </p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando cursos...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Você ainda não comprou nenhum curso</p>
          <Button onClick={handleBuyMore}>Explorar Marketplace</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.purchase_id} className="relative">
              <CourseCard
                id={parseInt(course.course_id.slice(-8), 16) || 0}
                title={course.title}
                description={course.description}
                image={course.course_id ? getCourseImageUrl(course.course_id) : ""}
                progress={0}
                duration={`${course.duration}h`}
                students={0}
                type={course.status === "downloaded" ? "owned" : "pending"}
                onAction={() => {
                  if (course.status === "downloaded") {
                    navigate(`/app/visao-geral-curso?courseId=${course.course_id}`);
                  } else {
                    handleDownload(course);
                  }
                }}
              />
              {course.status !== "downloaded" && (
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownload(course)}
                    disabled={downloading.has(course.purchase_id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloading.has(course.purchase_id) ? "Baixando..." : 
                     course.status === "downloading" ? "Continuar" : "Baixar"}
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Buy More Card */}
          <CourseCard
            id={0}
            title=""
            description=""
            image=""
            type="buy-more"
            onAction={handleBuyMore}
          />
        </div>
      )}
    </div>
  );
}