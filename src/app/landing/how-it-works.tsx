import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, FileText, Heart, Trophy } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Cadastro Simples",
    description:
      "Atletas criam perfil verificado com histórico, conquistas e informações da equipe.",
    color: "bg-blue-500",
  },
  {
    step: "02",
    icon: FileText,
    title: "Campanha Detalhada",
    description:
      "Criação de campanha com meta, competição, local, data e detalhamento completo dos gastos.",
    color: "bg-green-500",
  },
  {
    step: "03",
    icon: Heart,
    title: "Apoio da Comunidade",
    description:
      "Apoiadores descobrem e contribuem com atletas através de doações seguras e transparentes.",
    color: "bg-red-500",
  },
  {
    step: "04",
    icon: Trophy,
    title: "Conquista Realizada",
    description:
      "Atleta compete, representa o Brasil e compartilha resultados com toda a comunidade.",
    color: "bg-yellow-500",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 text-sm font-medium"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Como funciona?
          </Badge>
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-5xl">
            <span className="text-primary">4 Passos</span> para Transformar
            Sonhos em Realidade
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl text-balance">
            Um processo simples e transparente que conecta atletas determinados
            com apoiadores que acreditam no potencial do jiu-jitsu brasileiro.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-16 left-full z-0 hidden h-0.5 w-full bg-gradient-to-r from-gray-300 to-transparent lg:block" />
              )}

              <Card className="hover:border-primary/20 relative z-10 border-2 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="mb-6">
                    <div
                      className={`h-16 w-16 ${step.color} mx-auto mb-4 flex items-center justify-center rounded-full`}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <Badge
                      variant="outline"
                      className="px-3 py-1 text-lg font-bold"
                    >
                      {step.step}
                    </Badge>
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
