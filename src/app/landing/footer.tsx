import { Heart, Mail, MapPin, Phone,Trophy } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-6 py-10">
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* LOGO E DESCRIÇÃO */}
          <div className="space-y-6 text-center md:text-left">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 md:justify-start"
            >
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <Trophy className="text-primary-foreground h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">BJJ Fund</span>
            </Link>
            <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed md:mx-0">
              A maior plataforma de crowdfunding para atletas de jiu-jitsu do
              Brasil. Conectamos sonhos com apoiadores que acreditam no
              potencial de cada guerreiro.
            </p>
          </div>

          {/* CONTATOS — Ajuste de posição no desktop */}
          <div className="space-y-4 text-center md:self-end md:text-right">
            <div className="flex items-center justify-center gap-2 text-sm md:justify-end">
              <Mail className="h-4 w-4" />
              <span>contato@bjjfund.com.br</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm md:justify-end">
              <Phone className="h-4 w-4" />
              <span>+55 (85) 98146-7094</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm md:justify-end">
              <MapPin className="h-4 w-4" />
              <span>Fortaleza, CE - Brasil</span>
            </div>
          </div>
        </div>

        {/* LINHA DIVISÓRIA */}
        <div className="border-border mt-10 border-t" />

        {/* COPYRIGHT + FEITO COM AMOR */}
        <div className="text-muted-foreground mt-6 flex flex-col items-center justify-between gap-4 text-center text-xs md:flex-row md:text-sm">
          <p>© 2025 BJJ Fund. Todos os direitos reservados.</p>

          {/* Mobile quebra em 2 linhas — Desktop uma linha só */}
          <div className="flex flex-col items-center md:flex-row md:gap-2">
            <span className="flex items-center gap-2">
              Feito com <Heart className="text-primary h-4 w-4" />
            </span>
            <span>
              por Magaiver Magalhães para a comunidade do jiu-jitsu brasileiro
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
