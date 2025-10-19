import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Shield, Heart, Trophy, Target, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Doações Transparentes",
    description:
      "Acompanhe exatamente como cada real é utilizado. Transparência total nos gastos com viagens, hospedagem e competições.",
    badge: "Confiança",
  },
  {
    icon: Shield,
    title: "Pagamentos Seguros",
    description:
      "Processamento seguro via Stripe com suporte a cartão de crédito e PIX. Seus dados sempre protegidos.",
    badge: "Segurança",
  },
  {
    icon: Trophy,
    title: "Atletas Verificados",
    description:
      "Todos os atletas passam por processo de verificação. Apoie com confiança guerreiros reais.",
    badge: "Verificação",
  },
  {
    icon: Target,
    title: "Metas Claras",
    description:
      "Cada campanha tem objetivos específicos: competição, local, data e detalhamento completo dos custos.",
    badge: "Objetividade",
  },
  {
    icon: Users,
    title: "Comunidade Ativa",
    description:
      "Faça parte de uma comunidade que acredita no potencial dos atletas brasileiros de jiu-jitsu.",
    badge: "Comunidade",
  },
  {
    icon: BarChart3,
    title: "Acompanhamento Real",
    description:
      "Dashboard completo para atletas e apoiadores acompanharem o progresso das campanhas em tempo real.",
    badge: "Controle",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            Por que escolher nossa plataforma?
          </Badge>
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-5xl">
            Construída para <span className="text-primary">Atletas</span> e{" "}
            <span className="text-primary">Apoiadores</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl text-balance">
            Nossa plataforma foi desenvolvida especificamente para as
            necessidades únicas dos atletas de jiu-jitsu e das pessoas que
            querem apoiá-los em suas jornadas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:border-primary/20 group border-2 transition-colors duration-300"
            >
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-3 transition-colors">
                    <feature.icon className="text-primary h-6 w-6" />
                  </div>
                  <Badge variant="secondary">{feature.badge}</Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
