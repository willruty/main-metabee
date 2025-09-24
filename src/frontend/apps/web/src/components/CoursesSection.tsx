import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star } from "lucide-react";

const CoursesSection = () => {
  const courses = [
    {
      id: 1,
      title: "Desenvolvimento Web Moderno",
      description: "Domine React, TypeScript e as tecnologias mais demandadas do mercado",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
      duration: "40h",
      students: 1234,
      rating: 4.9,
      level: "Intermediário",
      price: "R$ 497"
    },
    {
      id: 2,
      title: "IA e Machine Learning",
      description: "Construa modelos de IA e integre machine learning em suas aplicações",
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop",
      duration: "60h",
      students: 890,
      rating: 4.8,
      level: "Avançado",
      price: "R$ 697"
    },
    {
      id: 3,
      title: "Design UX/UI Completo",
      description: "Crie interfaces incríveis e experiências de usuário memoráveis",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
      duration: "35h",
      students: 2156,
      rating: 4.9,
      level: "Iniciante",
      price: "R$ 397"
    },
    {
      id: 4,
      title: "DevOps e Cloud Computing",
      description: "Automatize deployments e gerencie infraestrutura na nuvem",
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop",
      duration: "45h",
      students: 756,
      rating: 4.7,
      level: "Intermediário",
      price: "R$ 597"
    },
    {
      id: 5,
      title: "Mobile Development",
      description: "Desenvolva apps nativos para iOS e Android com React Native",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
      duration: "50h",
      students: 1089,
      rating: 4.8,
      level: "Intermediário",
      price: "R$ 547"
    },
    {
      id: 6,
      title: "Blockchain e Web3",
      description: "Entre no futuro das aplicações descentralizadas e criptomoedas",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
      duration: "30h",
      students: 543,
      rating: 4.6,
      level: "Avançado",
      price: "R$ 747"
    }
  ];

  return (
    <section id="courses" className="section-padding bg-card/30">
      <div className="container-width">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Cursos que <span className="text-primary">Transformam</span> Carreiras
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Metodologia prática com projetos reais. Aprenda com especialistas da Metabee 
              e construa um portfólio que impressiona recrutadores usando nossa plataforma 
              online + MetaStation desktop.
            </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="card-gradient border-border hover:glow-effect smooth-transition group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 smooth-transition"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  {course.level}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary smooth-transition">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {course.rating}
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">{course.price}</div>
              </CardContent>

              <CardFooter>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group-hover:glow-effect smooth-transition">
                  Saiba Mais
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Ver Todos os Cursos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;