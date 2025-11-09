import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Heart, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-red-50 via-white to-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="bg-primary animate-float absolute top-20 left-20 h-32 w-32 rounded-full"></div>
        <div
          className="bg-accent animate-float absolute top-40 right-32 h-24 w-24 rounded-full"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="bg-primary animate-float /* posição melhor no mobile */ /* comportamento original no desktop */ absolute bottom-40 left-4 h-20 w-20 rounded-full md:bottom-32 md:left-1/4"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Badge */}
          <div className="animate-fade-in-up pt-8 md:pt-0">
            <Badge
              variant="outline"
              className="max-w-full px-4 py-2 text-center text-sm font-medium whitespace-normal"
            >
              <Trophy className="mr-2 h-4 w-4 shrink-0" />
              Plataforma de Doações para Atletas de Jiu-Jitsu
            </Badge>
          </div>

          {/* Main Heading */}
          <div
            className="animate-fade-in-up space-y-4"
            style={{ animationDelay: "0.2s" }}
          >
            <h1 className="text-4xl leading-tight font-bold text-balance md:text-6xl lg:text-7xl">
              Transforme
              <span className="text-primary"> Sonhos </span>
              em
              <span className="text-primary"> Conquistas</span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed text-balance md:text-2xl">
              Conectamos atletas de jiu-jitsu com apoiadores que acreditam no
              potencial de cada guerreiro. Juntos, tornamos possível a
              participação em competições ao redor do mundo.
            </p>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in-up grid grid-cols-1 gap-8 py-8 md:grid-cols-3"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="space-y-2">
              <div className="text-primary text-3xl font-bold md:text-4xl">
                R$ 2.5M+
              </div>
              <div className="text-muted-foreground">
                Arrecadados para atletas
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-primary text-3xl font-bold md:text-4xl">
                500+
              </div>
              <div className="text-muted-foreground">Atletas apoiados</div>
            </div>
            <div className="space-y-2">
              <div className="text-primary text-3xl font-bold md:text-4xl">
                15K+
              </div>
              <div className="text-muted-foreground">Apoiadores ativos</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            className="animate-fade-in-up flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "0.6s" }}
          >
            <Button
              asChild
              size="lg"
              className="px-8 py-6 text-lg font-semibold"
            >
              <Link href="/register">
                <Heart className="mr-2 h-5 w-5" />
                Apoiar Atletas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent px-8 py-6 text-lg font-semibold"
            >
              <Link href="/register">
                <Target className="mr-2 h-5 w-5" />
                Sou Atleta
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div
            className="animate-fade-in-up pt-8"
            style={{ animationDelay: "0.8s" }}
          >
            <p className="text-muted-foreground mb-4 text-sm">
              Pagamentos seguros via
            </p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-2xl font-bold">Stripe</div>
              <div className="text-2xl font-bold">PIX</div>
              <div className="text-2xl font-bold">SSL</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
