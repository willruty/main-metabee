import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      description: "Ideal para iniciantes",
      price: "R$ 97",
      period: "/mês",
      features: [
        "Acesso a 10 cursos básicos",
        "Suporte por email",
        "Certificados de conclusão",
        "Acesso móvel",
        "Comunidade exclusiva"
      ],
      popular: false,
      buttonText: "Começar Agora"
    },
    {
      name: "Professional",
      description: "Para profissionais em crescimento",
      price: "R$ 197",
      period: "/mês",
      features: [
        "Acesso a todos os cursos",
        "Suporte prioritário 24/7",
        "Projetos práticos exclusivos",
        "Mentoria 1:1 mensal",
        "Workshops ao vivo",
        "Download de conteúdos",
        "Certificações reconhecidas",
        "Networking com experts"
      ],
      popular: true,
      buttonText: "Mais Popular"
    },
    {
      name: "Enterprise",
      description: "Para equipes e empresas",
      price: "R$ 497",
      period: "/mês",
      features: [
        "Tudo do Professional",
        "Cursos personalizados",
        "Dashboard de progresso",
        "Mentoria ilimitada",
        "Consultoria técnica",
        "Suporte dedicado",
        "Treinamentos in-company",
        "SLA garantido"
      ],
      popular: false,
      buttonText: "Falar com Vendas"
    }
  ];

  return (
    <section id="pricing" className="section-padding">
      <div className="container-width">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Planos que <span className="text-primary">Cabem</span> no seu Orçamento
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Escolha o plano ideal para sua jornada. Todos incluem acesso 
            completo à plataforma e garantia de 30 dias.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative card-gradient border-border smooth-transition group ${
                plan.popular ? 'ring-2 ring-primary glow-effect scale-105' : 'hover:glow-effect'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  Mais Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4">
                  {plan.description}
                </CardDescription>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  className={`w-full smooth-transition ${
                    plan.popular 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-effect' 
                      : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 p-6 bg-card/50 rounded-2xl border border-border">
          <p className="text-muted-foreground mb-4">
            💎 <strong>Garantia de 30 dias:</strong> Não ficou satisfeito? Devolvemos 100% do seu dinheiro
          </p>
          <p className="text-sm text-muted-foreground">
            Todos os planos incluem acesso vitalício às atualizações de conteúdo
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;