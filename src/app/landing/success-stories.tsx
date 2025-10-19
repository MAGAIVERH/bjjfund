import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Trophy, MapPin } from "lucide-react";

const stories = [
  {
    name: "João Silva",
    belt: "Faixa Preta",
    team: "Alliance",
    achievement: "Campeão Mundial IBJJF 2024",
    amount: "R$ 18.500",
    supporters: 127,
    quote:
      "Graças ao apoio da comunidade, consegui realizar meu sonho de competir no Mundial. A transparência da plataforma me deu confiança para focar apenas no treino.",
    location: "Long Beach, CA",
    avatar: "/brazilian-jiu-jitsu-athlete-male.jpg",
  },
  {
    name: "Maria Santos",
    belt: "Faixa Marrom",
    team: "Gracie Barra",
    achievement: "Vice-campeã Pan-Americano 2024",
    amount: "R$ 12.300",
    supporters: 89,
    quote:
      "A plataforma me permitiu mostrar minha jornada de forma transparente. Cada apoiador se tornou parte da minha conquista. Gratidão eterna!",
    location: "Irvine, CA",
    avatar: "/brazilian-jiu-jitsu-athlete-female.jpg",
  },
  {
    name: "Carlos Oliveira",
    belt: "Faixa Roxa",
    team: "Checkmat",
    achievement: "3º lugar Brasileiro 2024",
    amount: "R$ 8.750",
    supporters: 64,
    quote:
      "Como atleta jovem, essa plataforma foi essencial. Consegui competir no Brasileiro e trazer medalha para casa. O sonho continua!",
    location: "São Paulo, SP",
    avatar: "/young-brazilian-jiu-jitsu-athlete.jpg",
  },
];

export function SuccessStories() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            Histórias de Sucesso
          </Badge>
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-5xl">
            <span className="text-primary">Sonhos Realizados</span> com Apoio da
            Comunidade
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl text-balance">
            Conheça atletas que transformaram suas vidas e representaram o
            Brasil em competições internacionais graças ao apoio de nossa
            comunidade.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {stories.map((story, index) => (
            <Card
              key={index}
              className="hover:border-primary/20 border-2 transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-8">
                {/* Quote */}
                <div className="mb-6">
                  <Quote className="text-primary mb-4 h-8 w-8" />
                  <p className="text-lg leading-relaxed text-balance italic">
                    "{story.quote}"
                  </p>
                </div>

                {/* Athlete Info */}
                <div className="mb-6 flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={story.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {story.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-lg font-bold">{story.name}</h4>
                    <p className="text-muted-foreground">
                      {story.belt} • {story.team}
                    </p>
                  </div>
                </div>

                {/* Achievement */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="text-primary h-5 w-5" />
                    <span className="font-semibold">{story.achievement}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-muted-foreground h-5 w-5" />
                    <span className="text-muted-foreground">
                      {story.location}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6">
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">
                      {story.amount}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Arrecadado
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">
                      {story.supporters}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Apoiadores
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
