import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

const Blog = () => {
  const articles = [
    {
      id: 1,
      title: "Como a IA está Revolucionando o Mercado de Trabalho",
      excerpt: "Descubra as principais tendências em inteligência artificial e como se preparar para as profissões do futuro.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
      author: "Dr. Carlos Silva",
      date: "15 de Janeiro, 2024",
      readTime: "8 min",
      category: "Inteligência Artificial",
      featured: true
    },
    {
      id: 2,
      title: "5 Linguagens de Programação para Aprender em 2024",
      excerpt: "Análise das linguagens mais demandadas pelo mercado e suas aplicações práticas no desenvolvimento moderno.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop",
      author: "Ana Rodrigues",
      date: "12 de Janeiro, 2024",
      readTime: "6 min",
      category: "Programação",
      featured: false
    },
    {
      id: 3,
      title: "UX/UI Design: Tendências que Dominam 2024",
      excerpt: "As principais tendências de design que estão moldando as interfaces e experiências digitais este ano.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop",
      author: "Marina Costa",
      date: "10 de Janeiro, 2024",
      readTime: "5 min",
      category: "Design",
      featured: false
    },
    {
      id: 4,
      title: "DevOps na Prática: Automatizando Deploys",
      excerpt: "Guia completo para implementar pipelines de CI/CD e automatizar o processo de deployment de aplicações.",
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=300&fit=crop",
      author: "Ricardo Santos",
      date: "8 de Janeiro, 2024",
      readTime: "10 min",
      category: "DevOps",
      featured: false
    },
    {
      id: 5,
      title: "Blockchain Beyond Crypto: Aplicações Reais",
      excerpt: "Explore como a tecnologia blockchain está sendo aplicada em diversos setores além das criptomoedas.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=300&fit=crop",
      author: "Felipe Oliveira",
      date: "5 de Janeiro, 2024",
      readTime: "7 min",
      category: "Blockchain",
      featured: false
    },
    {
      id: 6,
      title: "Mobile Development: Native vs React Native",
      excerpt: "Comparativo detalhado entre desenvolvimento nativo e React Native para tomada de decisão em projetos.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop",
      author: "Juliana Ferreira",
      date: "3 de Janeiro, 2024",
      readTime: "9 min",
      category: "Mobile",
      featured: false
    }
  ];

  const categories = ["Todos", "Inteligência Artificial", "Programação", "Design", "DevOps", "Blockchain", "Mobile"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="section-padding pt-24">
        <div className="container-width">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Blog <span className="text-primary">Metabee</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Insights, tutoriais e tendências do mundo tech. 
              Conteúdo exclusivo dos nossos especialistas para acelerar seu aprendizado 
              com nossa plataforma online e MetaStation desktop.
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Todos" ? "default" : "outline"}
                size="sm"
                className={category === "Todos" 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "border-border hover:border-primary hover:text-primary"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="section-padding py-8">
        <div className="container-width">
          {articles.filter(article => article.featured).map((article) => (
            <Card key={article.id} className="card-gradient border-border hover:glow-effect smooth-transition group mb-12">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="relative overflow-hidden rounded-l-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-64 lg:h-full object-cover group-hover:scale-105 smooth-transition"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    Destaque
                  </Badge>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-4 border-primary text-primary">
                    {article.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary smooth-transition">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {article.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.readTime}
                    </div>
                  </div>
                  <Button className="w-fit bg-primary text-primary-foreground hover:bg-primary/90 group">
                    Ler Artigo Completo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 smooth-transition" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding py-8">
        <div className="container-width">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Últimos Artigos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.filter(article => !article.featured).map((article) => (
              <Card key={article.id} className="card-gradient border-border hover:glow-effect smooth-transition group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 smooth-transition"
                  />
                  <Badge variant="outline" className="absolute top-4 left-4 bg-background/80 border-primary text-primary">
                    {article.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary smooth-transition line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">{article.date}</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground group"
                  >
                    Ler Mais
                    <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 smooth-transition" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Carregar Mais Artigos
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;