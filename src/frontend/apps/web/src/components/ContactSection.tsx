import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Nossa equipe entrará em contato em breve.",
    });
    
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="section-padding bg-card/30">
      <div className="container-width">
        {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Vamos <span className="text-primary">Conversar</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tem dúvidas sobre nossos cursos ou sobre a plataforma MetaStation? 
              Quer uma consultoria personalizada? Entre em contato conosco e 
              descubra como podemos acelerar sua carreira.
            </p>
          </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="card-gradient border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário e nossa equipe entrará em contato em até 24h
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      required
                      className="bg-background/50 border-border focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone (opcional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="bg-background/50 border-border focus:border-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                    className="bg-background/50 border-border focus:border-primary"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Conte-nos sobre seus objetivos e como podemos ajudar..."
                    rows={4}
                    required
                    className="bg-background/50 border-border focus:border-primary resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-effect group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 smooth-transition" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <Card className="card-gradient border-border hover:glow-effect smooth-transition">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">E-mail</h3>
                    <p className="text-primary">contato@metabee.com.br</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Resposta garantida em até 24 horas
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient border-border hover:glow-effect smooth-transition">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">WhatsApp</h3>
                    <p className="text-primary">(11) 99999-9999</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Atendimento de segunda à sexta, 9h às 18h
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient border-border hover:glow-effect smooth-transition">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Chat Online</h3>
                    <p className="text-primary">Disponível no site</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Suporte instantâneo durante horário comercial
                </p>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-xl font-bold mb-4">
                Quer uma <span className="text-primary">Consultoria Gratuita</span>?
              </h3>
              <p className="text-muted-foreground mb-6">
                Agende uma conversa de 30 minutos com nossos especialistas 
                para descobrir qual curso é ideal para seu perfil.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-effect">
                Agendar Consultoria
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;