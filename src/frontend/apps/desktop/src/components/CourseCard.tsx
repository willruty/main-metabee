import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom"

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  duration?: string;
  students?: number;
  progress?: number;
  type?: "owned" | "marketplace" | "buy-more";
  onAction?: () => void;
}

export function CourseCard({
  title,
  description,
  image,
  duration = "8h",
  students = 150,
  progress,
  type = "marketplace",
  onAction
}: CourseCardProps) {
  const navigate = useNavigate()
  if (type === "buy-more") {
    return (
      <Card
        className="bg-brand-surface border-brand-border hover:bg-brand-surface-hover transition-colors cursor-pointer group"
        onClick={() => navigate('/app/marketplace')}
      >
        <CardContent className="flex flex-col items-center justify-center h-full min-h-48 p-6 text-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Play className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            Comprar mais cursos
          </h3>
          <p className="text-muted-foreground text-sm">
            Explore nossa biblioteca completa de cursos
          </p>
        </CardContent>
      </Card>

    );
  }

  return (
    <Card className="bg-brand-surface border-brand-border hover:bg-brand-surface-hover transition-all duration-300 group overflow-hidden flex flex-col h-[420px]">
      <CardHeader className="p-0 flex-shrink-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback para imagem placeholder se a imagem não carregar
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23ddd' width='400' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ESem imagem%3C/text%3E%3C/svg%3E";
            }}
          />
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
              <div className="w-full bg-brand-surface rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-white text-xs mt-1">{progress}% concluído</p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
          {description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{students} alunos</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex-shrink-0">
        <Button
          className="w-full"
          variant={type === "owned" ? "secondary" : "default"}
          onClick={onAction}
        >
          {type === "owned" ? "Continuar" : "Ver Curso"}
        </Button>
      </CardFooter>
    </Card>
  );
}