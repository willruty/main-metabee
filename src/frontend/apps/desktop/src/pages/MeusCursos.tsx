import { useEffect } from "react"
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import course images
import courseRoboticsImage from "@/assets/course-robotics.jpg";
import courseAiImage from "@/assets/course-ai.jpg";
import courseVisionImage from "@/assets/course-vision.jpg";
import coursePythonImage from "@/assets/course-python.jpg";

// Mock data
const myCourses = [
  {
    id: 1,
    title: "Robótica com Arduino",
    description: "Aprenda os fundamentos da robótica usando Arduino e componentes eletrônicos básicos.",
    image: courseRoboticsImage,
    progress: 75,
    duration: "12h",
    students: 234
  },
  {
    id: 2,
    title: "Inteligência Artificial Aplicada",
    description: "Implementação de algoritmos de IA em sistemas robóticos modernos.",
    image: courseAiImage,
    progress: 45,
    duration: "16h",
    students: 189
  },
  {
    id: 3,
    title: "Visão Computacional",
    description: "Processamento de imagens e reconhecimento de padrões para robôs autônomos.",
    image: courseVisionImage,
    progress: 30,
    duration: "20h",
    students: 156
  },
  {
    id: 4,
    title: "Programação em Python para Robótica",
    description: "Domine Python aplicado ao desenvolvimento de sistemas robóticos.",
    image: coursePythonImage,
    progress: 90,
    duration: "14h",
    students: 298
  }
];

export default function MeusCursos() {
  const navigate = useNavigate();

  const handleBuyMore = () => {
    navigate("/marketplace");
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meus Cursos</h1>
            <p className="text-muted-foreground mt-2">
              Continue sua jornada de aprendizado • {myCourses.length} cursos ativos
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
            <h3 className="text-sm font-medium text-muted-foreground">Progresso Médio</h3>
            <p className="text-2xl font-bold text-primary mt-1">62%</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Horas Estudadas</h3>
            <p className="text-2xl font-bold text-foreground mt-1">48h</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Certificados</h3>
            <p className="text-2xl font-bold text-secondary mt-1">2</p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.map((course) => (
          <CourseCard
            key={course.id}
            {...course}
            type="owned"
            onAction={() => navigate(`/app/visao-geral`)}
          />
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
    </div>
  );
}