import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Play, Users, Mail, Calendar } from "lucide-react";

const Success = () => {
  const purchaseData = {
    orderNumber: "MB-2024-001234",
    courseName: "Desenvolvimento Web Moderno",
    purchaseDate: "15 de Janeiro, 2024",
    amount: "R$ 497,00",
    email: "usuario@email.com"
  };

  const nextSteps = [
    {
      icon: Mail,
      title: "Verifique seu E-mail",
      description: "Enviamos todas as informações de acesso para seu e-mail",
      action: "Verificar E-mail"
    },
    {
      icon: Download,
      title: "Baixe a plataforma MetaStation Desktop",
      description: "Acesse e baixe todo o material da plataforma referente ao seu curso",
      action: "Baixar Materiais"
    },
    {
      icon: Users,
      title: "Entre na Comunidade",
      description: "Conecte-se com outros estudantes e instrutores",
      action: "Acessar Comunidade"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="section-padding pt-24">
        <div className="container-width max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎉 <span className="text-primary">Parabéns!</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Sua compra foi realizada com sucesso!
            </p>
            <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm">
              Bem-vindo à Metabee
            </Badge>
          </div>

          {/* Purchase Summary */}
          <Card className="card-gradient border-border mb-8 animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Resumo da Compra</CardTitle>
              <CardDescription>
                Detalhes do seu pedido e informações importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Número do Pedido</label>
                    <p className="font-mono font-bold text-primary">{purchaseData.orderNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Curso Adquirido</label>
                    <p className="font-bold">{purchaseData.courseName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">E-mail de Acesso</label>
                    <p className="font-bold">{purchaseData.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Data da Compra</label>
                    <p className="font-bold">{purchaseData.purchaseDate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Valor Pago</label>
                    <p className="font-bold text-primary text-2xl">{purchaseData.amount}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Status</label>
                    <Badge className="bg-green-500 text-white">✓ Confirmado</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Próximos <span className="text-primary">Passos</span>
            </h2>
            <div className="grid md:grid-cols-1 gap-6">
              {nextSteps.map((step, index) => (
                <Card key={index} className="card-gradient border-border hover:glow-effect smooth-transition group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 smooth-transition">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary smooth-transition">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {step.description}
                        </p>
                        <Button 
                          size="sm" 
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {step.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Important Information */}
          <Card className="card-gradient border-primary/20 bg-primary/5 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>E-mail de confirmação:</strong> Enviamos todos os detalhes para {purchaseData.email}. 
                  Verifique também sua caixa de spam.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Acesso vitalício:</strong> Você terá acesso aos cursos online e 
                  à plataforma MetaStation desktop para sempre, incluindo todas as atualizações futuras.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Certificado:</strong> Após completar 80% do curso, você receberá 
                  automaticamente seu certificado de conclusão.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Suporte 24/7:</strong> Nossa equipe está disponível para ajudar 
                  você a qualquer momento durante sua jornada.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
            >
              <Play className="mr-2 h-5 w-5" />
              Começar Curso Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Download className="mr-2 h-5 w-5" />
              Baixar Materiais
            </Button>
          </div>

          {/* Support */}
          <Card className="mt-12 text-center card-gradient border-border">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Precisa de Ajuda?</h3>
              <p className="text-muted-foreground mb-6">
                Nossa equipe de suporte está pronta para ajudar você em qualquer dúvida
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  suporte@metabee.com.br
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  Chat ao Vivo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Success;