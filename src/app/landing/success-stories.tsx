"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import AthleteProfileCard from "@/app/dash-athletes/components/athlete-profile-card";
import { getAllAthletes } from "../actions/athlete-actions";

export function SuccessStories() {
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllAthletes();
        if (res.success && res.data) setAthletes(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const scrollManual = (dir: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    setPaused(true);
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="bg-white py-24 text-center">
        <p className="text-gray-500">Carregando histórias...</p>
      </section>
    );
  }

  if (!athletes.length) {
    return (
      <section className="bg-white py-24 text-center">
        <h2 className="text-2xl font-semibold text-gray-600">
          Nenhum atleta cadastrado ainda.
        </h2>
      </section>
    );
  }

  const loopList = [...athletes, ...athletes];

  return (
    <section
      className="relative overflow-hidden bg-white py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-6">
        {/* Cabeçalho */}
        <div className="mb-16 text-center">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 text-sm font-medium"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Histórias de Sucesso
          </Badge>
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-5xl">
            <span className="text-primary">Sonhos Realizados</span> com Apoio da
            Comunidade
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl text-balance">
            Conheça atletas que transformaram suas vidas e representaram o
            Brasil em competições internacionais graças ao apoio da nossa
            comunidade.
          </p>
        </div>

        {/* Carrossel */}
        <div className="relative flex items-center">
          {/* Botão Esquerdo */}
          <Button
            variant="ghost"
            size="icon"
            className="bg-primary absolute top-1/2 -left-12 z-10 hidden -translate-y-1/2 rounded-full text-white shadow backdrop-blur transition-all duration-300 hover:bg-black hover:text-white lg:flex"
            onClick={() => scrollManual("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Container dos Cards */}
          <div ref={containerRef} className="w-full overflow-hidden">
            <div
              className="marquee-track flex items-stretch justify-start gap-4"
              style={{
                animationPlayState: paused
                  ? ("paused" as const)
                  : ("running" as const),
              }}
            >
              {loopList.map((athlete, i) => (
                <div
                  key={i}
                  className="h-[630px] flex-none"
                  style={
                    {
                      "--card-width": "420px",
                      width: "var(--card-width)",
                    } as React.CSSProperties
                  }
                >
                  <AthleteProfileCard
                    name={athlete.name || "Atleta"}
                    avatar={athlete.avatar || null}
                    faixa={athlete.faixa || undefined}
                    escola={athlete.escola || undefined}
                    nascimento={
                      athlete.nascimento
                        ? new Date(athlete.nascimento).toLocaleDateString(
                            "pt-BR",
                          )
                        : undefined
                    }
                    cidade={athlete.cidade || undefined}
                    bio={
                      athlete.bio && athlete.bio.length > 100
                        ? athlete.bio.slice(0, 100) + "..."
                        : athlete.bio || "Sem frase"
                    }
                    evento={athlete.evento || undefined}
                    ouro={Number(athlete.ouro) || 0}
                    prata={Number(athlete.prata) || 0}
                    bronze={Number(athlete.bronze) || 0}
                    totalAmount={Number(athlete.totalAmount) || 0}
                    totalSupporters={Number(athlete.totalSupporters) || 0}
                    showDonateCta={false}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botão Direito */}
          <Button
            variant="ghost"
            size="icon"
            className="bg-primary absolute top-1/2 -right-12 z-10 hidden -translate-y-1/2 rounded-full text-white shadow backdrop-blur transition-all duration-300 hover:bg-black hover:text-white lg:flex"
            onClick={() => scrollManual("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* CSS para o movimento automático */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-track {
          width: max-content;
          animation: marquee 40s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
