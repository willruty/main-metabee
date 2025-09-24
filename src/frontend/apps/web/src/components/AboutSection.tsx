import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: "Missão",
      description: "Democratizar o acesso ao conhecimento tecnológico de qualidade, formando profissionais preparados para o futuro digital."
    },
    {
      icon: Eye,
      title: "Visão",
      description: "Ser a principal plataforma de educação digital da América Latina, reconhecida pela excelência e inovação."
    },
    {
      icon: Heart,
      title: "Valores",
      description: "Inovação, qualidade, acessibilidade e compromisso com o sucesso de cada estudante."
    },
    {
      icon: Award,
      title: "Diferencial",
      description: "Metodologia prática, projetos reais e mentoria personalizada com especialistas do mercado."
    }
  ];

  return (
    <section id="about" className="section-padding bg-card/30">
      <div className="container-width">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Sobre a <span className="text-primary">Metabee</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Fundada em 2020 por especialistas em tecnologia e educação, a Metabee 
              nasceu com o propósito de revolucionar o ensino digital no Brasil. 
              Nossa plataforma combina cursos online de alta qualidade com nossa 
              exclusiva plataforma desktop MetaStation, equipada com simulador integrado 
              para prática em ambiente real.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Com mais de 5000 estudantes formados e uma taxa de empregabilidade de 
              85% em até 6 meses, somos reconhecidos por grandes empresas como Google, 
              Microsoft e Meta como parceiros oficiais de educação. Nossa MetaStation 
              oferece um ambiente de desenvolvimento completo para você praticar sem limites.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-background/50 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                <div className="text-sm text-muted-foreground">Estudantes Formados</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">85%</div>
                <div className="text-sm text-muted-foreground">Taxa de Empregabilidade</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Cursos Disponíveis</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Suporte Especializado</div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-scale-in">
            {values.map((value, index) => (
              <Card key={index} className="card-gradient border-border hover:glow-effect smooth-transition group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 smooth-transition">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary smooth-transition">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;