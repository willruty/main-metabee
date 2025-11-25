import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, TrendingUp } from "lucide-react";
import { getAllCourses, getMarketplaceStats, Course, MarketplaceStats } from "../services/CourseService";
import { getCourseImageUrl } from "../services/CourseService";

export default function Marketplace() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState<MarketplaceStats>({
    total_courses: 0,
    average_rating: 0,
    total_students: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Carregar cursos e estatísticas
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Carregar cursos (prioritário)
        const coursesData = await getAllCourses();
        setCourses(coursesData.courses || []);
        
        // Tentar carregar estatísticas (não crítico se falhar)
        try {
          const statsData = await getMarketplaceStats();
          setStats(statsData);
        } catch (statsError) {
          console.warn("Erro ao carregar estatísticas (não crítico):", statsError);
          // Manter valores padrão se falhar
        }
      } catch (error) {
        console.error("Erro ao carregar dados do marketplace:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    filterCourses()
  }, [selectedCategory, searchTerm, courses])

  const filterCourses = () => {
    let filtered = [...courses]

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term)
      )
    }

    setFilteredCourses(filtered)
  }

  const categories = ["Todos", ...new Set(courses.map(c => c.category).filter(Boolean))]

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
            <p className="text-muted-foreground mt-2">
              Descubra cursos incríveis para acelerar seu aprendizado
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                className="pl-10 w-64 bg-brand-input-bg border-brand-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Cursos Disponíveis</h3>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {isLoading ? "..." : `${stats.total_courses} cursos disponíveis`}
            </p>
          </div>
          <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/30 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-secondary" />
              <h3 className="text-sm font-medium text-foreground">Melhor Avaliados</h3>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {isLoading ? "..." : `${stats.average_rating.toFixed(1)}★ média`}
            </p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total de Alunos</h3>
            <p className="text-lg font-semibold text-foreground">
              {isLoading ? "..." : `${stats.total_students.toLocaleString('pt-BR')} estudantes`}
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Badge
              key={`category-${category}-${index}`}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando cursos...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => {
            const imageUrl = getCourseImageUrl(course._id, course.image);
            // Garantir que a key seja única mesmo se _id estiver vazio ou duplicado
            const uniqueKey = course._id || `course-${index}-${course.title}`;
            
            return (
              <div key={uniqueKey} className="space-y-3 group">
                <CourseCard
                  id={parseInt(course._id) || 0}
                  title={course.title}
                  description={course.description}
                  image={imageUrl}
                  duration={`${course.duration || 0}h`}
                  students={0} // Por enquanto não temos contagem de alunos por curso
                  onAction={() => navigate(`/app/visao-geral-curso?courseId=${course._id}`)}
                />
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {course.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.grade ? course.grade.toFixed(1) : '0.0'}</span>
                    </div>
                  </div>
                  {course.price && course.price > 0 && (
                    <div className="text-lg font-bold text-primary">
                      R$ {course.price.toFixed(2).replace('.', ',')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum curso encontrado</p>
        </div>
      )}
    </div>
  );
}