import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  Headphones, 
  BookOpen, 
  Smartphone,
  Users,
  Trophy,
  Clock,
  Shield
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Aprendizado Acelerado",
      description: "Metodologia exclusiva que reduz o tempo de aprendizado em 70% com foco na prática."
    },
    {
      icon: Headphones,
      title: "Suporte 24/7",
      description: "Equipe especializada disponível a qualquer hora para tirar suas dúvidas."
    },
    {
      icon: BookOpen,
      title: "Conteúdo Atualizado",
      description: "Currículos revisados mensalmente com as tecnologias mais demandadas."
    },
    {
      icon: Smartphone,
      title: "MetaStation Desktop",
      description: "Plataforma desktop exclusiva com simulador integrado para prática em ambiente real."
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Network com mais de 10.000 profissionais e estudantes engajados."
    },
    {
      icon: Trophy,
      title: "Certificações Reconhecidas",
      description: "Certificados validados por empresas líderes do mercado tech."
    },
    {
      icon: Clock,
      title: "Horários Flexíveis",
      description: "Estude no seu ritmo, com cronograma adaptável à sua rotina."
    },
    {
      icon: Shield,
      title: "Garantia Total",
      description: "30 dias de garantia incondicional ou seu dinheiro de volta."
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-width">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              O que nos torna <span className="text-primary">Únicos</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Combinamos cursos online de alta qualidade com nossa revolucionária 
              plataforma desktop MetaStation, que possui simulador integrado para 
              oferecer a melhor experiência de aprendizado prático do mercado.
            </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-gradient border-border hover:glow-effect smooth-transition group cursor-pointer"
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 smooth-transition">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-primary smooth-transition">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12 border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para <span className="text-primary">Transformar</span> sua Carreira?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que já mudaram de vida com nossos cursos online 
              e nossa plataforma desktop MetaStation. Comece hoje mesmo sua jornada no mundo tech!
            </p>
          
          {/* Success indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">Resultados Comprovados</h4>
              <p className="text-muted-foreground text-sm">
                85% dos nossos alunos conseguem emprego em até 6 meses
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">Comunidade Forte</h4>
              <p className="text-muted-foreground text-sm">
                Network ativo com profissionais de grandes empresas
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">Método Exclusivo</h4>
              <p className="text-muted-foreground text-sm">
                Aprenda 70% mais rápido com cursos online + MetaStation desktop
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;