import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, CreditCard, Smartphone, Building, Check, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isProcessing, setIsProcessing] = useState(false);

  const courseData = {
    title: "Desenvolvimento Web Moderno",
    description: "Curso completo de React, TypeScript e tecnologias modernas",
    originalPrice: 697,
    discountPrice: 497,
    discount: 29,
    features: [
      "40 horas de conteúdo prático",
      "Projetos reais no portfólio",
      "Mentoria 1:1 inclusa",
      "Certificado reconhecido",
      "Acesso vitalício",
      "Suporte 24/7"
    ]
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    toast({
      title: "Pagamento processado com sucesso!",
      description: "Redirecionando para página de confirmação...",
    });

    // Redirect to success page
    setTimeout(() => {
      window.location.href = "/success";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="section-padding pt-24">
        <div className="container-width max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="outline" className="mb-4 text-primary hover:text-primary/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <a href="/">
                Voltar
              </a>
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Finalizar Compra</h1>
            <p className="text-muted-foreground">Complete sua inscrição e comece a transformar sua carreira hoje mesmo</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method */}
              <Card className="card-gradient border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Método de Pagamento
                  </CardTitle>
                  <CardDescription>
                    Escolha como deseja pagar seu curso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary smooth-transition">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Cartão de Crédito
                      </Label>
                      <Badge variant="outline" className="ml-auto">Parcelado</Badge>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary smooth-transition">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
                        <Smartphone className="h-4 w-4" />
                        PIX
                      </Label>
                      <Badge className="ml-auto bg-primary text-primary-foreground">5% desconto</Badge>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary smooth-transition">
                      <RadioGroupItem value="boleto" id="boleto" />
                      <Label htmlFor="boleto" className="flex items-center gap-2 cursor-pointer">
                        <Building className="h-4 w-4" />
                        Boleto Bancário
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Details */}
              {paymentMethod === "credit" && (
                <Card className="card-gradient border-border">
                  <CardHeader>
                    <CardTitle>Dados do Cartão</CardTitle>
                    <CardDescription>
                      Suas informações estão protegidas com criptografia SSL
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        placeholder="Nome como está no cartão"
                        className="bg-background/50 border-border focus:border-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="bg-background/50 border-border focus:border-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Validade</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          className="bg-background/50 border-border focus:border-primary"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className="bg-background/50 border-border focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Installments */}
                    <div>
                      <Label>Parcelamento</Label>
                      <RadioGroup defaultValue="1x" className="mt-2">
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1x" id="1x" />
                            <Label htmlFor="1x">À vista</Label>
                          </div>
                          <span className="font-bold text-primary">R$ 497,00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3x" id="3x" />
                            <Label htmlFor="3x">3x sem juros</Label>
                          </div>
                          <span>R$ 165,67/mês</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="6x" id="6x" />
                            <Label htmlFor="6x">6x sem juros</Label>
                          </div>
                          <span>R$ 82,83/mês</span>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Billing Info */}
              <Card className="card-gradient border-border">
                <CardHeader>
                  <CardTitle>Dados de Cobrança</CardTitle>
                  <CardDescription>
                    Informações necessárias para emissão da nota fiscal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        placeholder="Seu nome"
                        className="bg-background/50 border-border focus:border-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        placeholder="Seu sobrenome"
                        className="bg-background/50 border-border focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="bg-background/50 border-border focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      className="bg-background/50 border-border focus:border-primary"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Terms */}
              <Card className="card-gradient border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      Ao finalizar a compra, você concorda com nossos{" "}
                      <a href="/terms" className="text-primary hover:underline">Termos de Uso</a> e{" "}
                      <a href="/privacy" className="text-primary hover:underline">Política de Privacidade</a>.
                      Você também confirma que tem mais de 18 anos.
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="card-gradient border-border sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Course Info */}
                  <div>
                    <h3 className="font-bold text-lg mb-2">{courseData.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{courseData.description}</p>

                    <div className="space-y-2 text-sm">
                      {courseData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Preço original:</span>
                      <span className="line-through text-muted-foreground">R$ {courseData.originalPrice}</span>
                    </div>
                    <div className="flex justify-between text-primary">
                      <span>Desconto ({courseData.discount}%):</span>
                      <span>-R$ {courseData.originalPrice - courseData.discountPrice}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">R$ {courseData.discountPrice}</span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
                    size="lg"
                  >
                    {isProcessing ? "Processando..." : "Finalizar Compra"}
                  </Button>

                  {/* Security */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Pagamento 100% seguro e criptografado</span>
                  </div>
                </CardContent>
              </Card>

              {/* Guarantee */}
              <Card className="card-gradient border-primary/20 bg-primary/5">
                <CardContent className="pt-6 text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Garantia de 30 Dias</h4>
                  <p className="text-sm text-muted-foreground">
                    Se não ficar satisfeito, devolvemos 100% do seu dinheiro.
                    Sem perguntas, sem complicações.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Payment;