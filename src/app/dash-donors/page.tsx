"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getAllAthletes } from "../actions/athlete-support-actions";
import { useRouter } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AthleteSwitcherCard from "./components/athlete-switcher-card";

export default function DonorDashboard() {
  const { data, isPending } = useSession();
  const user = data?.user;
  const router = useRouter();

  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAthletes = async () => {
      const res = await getAllAthletes();
      if (res.success) setAthletes(res.athletes || []);
      setLoading(false);
    };
    loadAthletes();
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

  if (!user || isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando atletas...
      </div>
    );
  }

  if (!athletes.length) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Nenhum atleta cadastrado ainda.
      </div>
    );
  }

  // duplicamos pra efeito de looping infinito
  const loopList = [...athletes, ...athletes];

  return (
    <section
      className="relative overflow-hidden bg-white py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-6">
        {/* Cabeçalho */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard do Apoiador
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Clique em um atleta para ver a foto e doar à história.
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl text-white transition-colors duration-300"
            onClick={() => router.push("/")}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Carrossel com os cards */}
        <div className="relative flex items-center">
          {/* Botão Esquerdo */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -left-12 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 shadow backdrop-blur hover:bg-white lg:flex"
            onClick={() => scrollManual("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Faixa rolável */}
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
                  className="flex-none"
                  style={
                    {
                      "--card-width": "420px",
                      width: "var(--card-width)",
                      height: "700px",
                    } as React.CSSProperties
                  }
                >
                  <AthleteSwitcherCard
                    athlete={athlete}
                    fixedHeight={560}
                    showDonateButton
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botão Direito */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -right-12 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 shadow backdrop-blur hover:bg-white lg:flex"
            onClick={() => scrollManual("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* CSS para movimento automático */}
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
