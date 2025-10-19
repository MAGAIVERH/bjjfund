import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trophy, ArrowRight, Users } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="from-primary/5 to-accent/5 bg-gradient-to-br via-white py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          {/* Main CTA */}
          <Card className="border-primary/20 to-primary/5 border-2 bg-gradient-to-br from-white">
            <CardContent className="p-12 text-center">
              <div className="space-y-8">
                <div>
                  <h2 className="mb-6 text-3xl font-bold text-balance md:text-5xl">
                    Pronto para Fazer a{" "}
                    <span className="text-primary">Diferença</span>?
                  </h2>
                  <p className="text-muted-foreground mx-auto max-w-2xl text-xl text-balance">
                    Junte-se à maior comunidade de apoio aos atletas de
                    jiu-jitsu do Brasil. Seja parte da jornada de guerreiros
                    determinados a conquistar o mundo.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Para Apoiadores */}
                  <div className="space-y-6">
                    <div className="rounded-lg bg-red-50 p-4">
                      <Heart className="text-primary mx-auto mb-4 h-12 w-12" />
                      <h3 className="mb-2 text-2xl font-bold">
                        Para Apoiadores
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Descubra atletas incríveis e seja parte de suas
                        conquistas. Cada doação é um investimento no futuro do
                        jiu-jitsu brasileiro.
                      </p>
                      <Button asChild size="lg" className="w-full">
                        <Link href="/register">
                          <Heart className="mr-2 h-5 w-5" />
                          Começar a Apoiar
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Para Atletas */}
                  <div className="space-y-6">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <Trophy className="text-accent mx-auto mb-4 h-12 w-12" />
                      <h3 className="mb-2 text-2xl font-bold">Para Atletas</h3>
                      <p className="text-muted-foreground mb-6">
                        Transforme seus sonhos em realidade. Crie campanhas
                        transparentes e conecte-se com apoiadores que acreditam
                        no seu potencial.
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full bg-transparent"
                      >
                        <Link href="/register">
                          <Trophy className="mr-2 h-5 w-5" />
                          Criar Campanha
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="border-t pt-8">
                  <div className="text-muted-foreground flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span>15K+ Usuários</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      <span>500+ Atletas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      <span>R$ 2.5M+ Arrecadados</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
