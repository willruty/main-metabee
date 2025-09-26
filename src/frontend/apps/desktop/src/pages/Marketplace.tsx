import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, TrendingUp } from "lucide-react";

// Import course images
import courseRoboticsImage from "@/assets/course-robotics.jpg";
import courseAiImage from "@/assets/course-ai.jpg";
import courseVisionImage from "@/assets/course-vision.jpg";
import coursePythonImage from "@/assets/course-python.jpg";

// Mock data
const marketplaceCourses = [
  {
    id: 1,
    title: "Robótica com Arduino Avançado",
    description: "Projetos complexos usando Arduino, sensores avançados e comunicação wireless.",
    image: courseRoboticsImage,
    duration: "18h",
    students: 456,
    rating: 4.8,
    price: "R$ 299",
    category: "Arduino"
  },
  {
    id: 2,
    title: "Machine Learning para Robôs",
    description: "Implemente redes neurais e algoritmos de aprendizado em sistemas robóticos.",
    image: courseAiImage,
    duration: "24h",
    students: 378,
    rating: 4.9,
    price: "R$ 399",
    category: "IA"
  },
  {
    id: 3,
    title: "ROS - Robot Operating System",
    description: "Domine o ROS para desenvolvimento de robôs profissionais e industriais.",
    image: courseVisionImage,
    duration: "30h",
    students: 234,
    rating: 4.7,
    price: "R$ 499",
    category: "ROS"
  },
  {
    id: 4,
    title: "Eletrônica para Robótica",
    description: "Circuitos, PCB design e eletrônica aplicada em projetos robóticos.",
    image: coursePythonImage,
    duration: "22h",
    students: 567,
    rating: 4.6,
    price: "R$ 349",
    category: "Eletrônica"
  },
  {
    id: 5,
    title: "Braços Robóticos Industriais",
    description: "Programação e controle de braços robóticos para automação industrial.",
    image: courseRoboticsImage,
    duration: "20h",
    students: 189,
    rating: 4.8,
    price: "R$ 449",
    category: "Industrial"
  },
  {
    id: 6,
    title: "Drones Autônomos",
    description: "Construção e programação de drones com navegação autônoma.",
    image: courseAiImage,
    duration: "16h",
    students: 298,
    rating: 4.5,
    price: "R$ 379",
    category: "Drones"
  }
];

const categories = ["Todos", "Arduino", "IA", "ROS", "Eletrônica", "Industrial", "Drones"];

export default function Marketplace() {

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log("Token nao encontrado na home page, voltando para o login")
      navigate("/login")
      return
    }

    fetch("http://192.168.0.203:8080/metabee/user/auth/validate", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Token inválido ou expirado")
        }

        const contentType = res.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json()
          console.log("Token válido:", data)
        } else {
          throw new Error("Resposta não é JSON")
        }
      })
      .catch((err) => {
        console.error("Erro na validação do token:", err.message)
        navigate("/login")
      })
  }, [])

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
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Mais Populares</h3>
            </div>
            <p className="text-lg font-semibold text-foreground">24 cursos novos</p>
          </div>
          <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-secondary" />
              <h3 className="text-sm font-medium text-foreground">Melhor Avaliados</h3>
            </div>
            <p className="text-lg font-semibold text-foreground">4.8★ média</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total de Alunos</h3>
            <p className="text-lg font-semibold text-foreground">12,487 estudantes</p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === "Todos" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaceCourses.map((course) => (
          <div key={course.id} className="space-y-2">
            <CourseCard
              {...course}
              onAction={() => console.log(`View course ${course.id}`)}
            />
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-foreground">{course.rating}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {course.category}
                </Badge>
              </div>
              <div className="text-lg font-bold text-primary">
                {course.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}