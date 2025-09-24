import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "Sobre Nós", href: "/#about" },
      { name: "Equipe", href: "/#about" },
    ],
    courses: [
      { name: "Todos os Cursos", href: "#courses" },
      { name: "Web Development", href: "/courses/web" },
      { name: "Mobile", href: "/courses/mobile" },
      { name: "IA & ML", href: "/courses/ai" }
    ],
    support: [
      { name: "Central de Ajuda", href: "/help" },
      { name: "Contato", href: "#contact" },
      { name: "WhatsApp", href: "https://wa.me/5511999999999" },
      { name: "FAQ", href: "/faq" }
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/metastation", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/metastation", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/metastation", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com/metastation", label: "YouTube" }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-width">
        {/* Main Footer */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-primary mb-4">Metabee</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                A plataforma líder em educação digital do Brasil. 
                Transformamos vidas através da tecnologia, conhecimento e 
                nossa revolucionária plataforma desktop MetaStation.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  contato@metabee.com.br
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  (11) 99999-9999
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  São Paulo, SP - Brasil
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                {socialLinks.map((social) => (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 hover:bg-primary/10 hover:text-primary smooth-transition"
                    asChild
                  >
                    <a 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div>
              <h4 className="font-bold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary text-sm smooth-transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Cursos</h4>
              <ul className="space-y-2">
                {footerLinks.courses.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary text-sm smooth-transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Suporte</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary text-sm smooth-transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-12 border-t border-border">
          <div className="text-center max-w-2xl mx-auto">
            <h4 className="text-xl font-bold mb-4">
              Receba as <span className="text-primary">Novidades</span>
            </h4>
            <p className="text-muted-foreground mb-6">
              Fique por dentro dos lançamentos, promoções e conteúdos exclusivos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Metabee. Todos os direitos reservados. 
            CNPJ: 12.345.678/0001-90
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;