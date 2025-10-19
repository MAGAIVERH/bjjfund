import Link from "next/link";
import { Trophy, Heart, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  platform: [
    { name: "Como Funciona", href: "#como-funciona" },
    { name: "Para Atletas", href: "/register" },
    { name: "Para Apoiadores", href: "/register" },
    { name: "Campanhas Ativas", href: "/campaigns" },
  ],
  support: [
    { name: "Central de Ajuda", href: "/help" },
    { name: "Contato", href: "/contact" },
    { name: "Termos de Uso", href: "/terms" },
    { name: "Política de Privacidade", href: "/privacy" },
  ],
  community: [
    { name: "Blog", href: "/blog" },
    { name: "Histórias de Sucesso", href: "#historias" },
    { name: "Eventos", href: "/events" },
    { name: "Newsletter", href: "/newsletter" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <Trophy className="text-primary-foreground h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">BJJ Fund</span>
            </Link>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              A maior plataforma de crowdfunding para atletas de jiu-jitsu do
              Brasil. Conectamos sonhos com apoiadores que acreditam no
              potencial de cada guerreiro.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>contato@bjjfund.com.br</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>+55 (85) 981467094</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Fortaleza, CE - Brasil</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Plataforma</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Suporte</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Comunidade</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-border mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-muted-foreground text-sm">
              © 2025 BJJ Fund. Todos os direitos reservados.
            </p>
            <div className="text-muted-foreground flex items-center gap-6 text-sm">
              <span>Feito com</span>
              <Heart className="text-primary h-4 w-4" />
              <span>
                por Magaiver Magalhães para a comunidade do jiu-jitsu brasileiro
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
