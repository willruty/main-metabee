import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="section-padding pt-24 min-h-screen flex items-center">
      <div className="container-width">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Transforme seu
              <span className="text-primary block">
                Futuro Digital
              </span>
              com a Metabee
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              A plataforma completa para dominar as tecnologias do futuro. 
              Cursos práticos online + nossa revolucionária plataforma desktop 
              MetaStation com simulador integrado para acelerar sua carreira na era digital.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-effect group"
              >
                Começar Jornada
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 smooth-transition" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground smooth-transition group"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Estudantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Cursos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Satisfação</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-scale-in">
            <div className="relative z-10">
                <img
                  src={heroImage}
                  alt="Metabee - Plataforma de Cursos Digitais com MetaStation Desktop"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
            </div>
            {/* Glow Effect */}
            <div className="absolute -inset-4 hero-gradient opacity-20 rounded-3xl blur-xl animate-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;