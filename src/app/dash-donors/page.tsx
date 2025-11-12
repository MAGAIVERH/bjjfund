"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getAllAthletes } from "../actions/athlete-support-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import AthleteSwitcherCard from "./components/athlete-switcher-card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteDonorAccount } from "../actions/donor-actions";

export default function DonorDashboard() {
  const { data, isPending } = useSession();
  const user = data?.user;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [athletes, setAthletes] = useState<any[]>([]);
  const [highlighted, setHighlighted] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadAthletes = async () => {
      const res = await getAllAthletes();
      if (res.success) {
        setAthletes(res.athletes || []);

        // 🔹 Verifica se há highlight na URL
        const highlight = searchParams.get("highlight");
        if (highlight && res.athletes?.length) {
          const match = res.athletes.find(
            (a: any) => a.athleteId === highlight,
          );
          if (match) setHighlighted(match);
        }
      }
      setLoading(false);
    };
    loadAthletes();
  }, [searchParams]);

  const closeHighlight = () => setHighlighted(null);

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

  // 🔹 Criação da sessão Stripe
  const handleDonate = async () => {
    if (!highlighted) return;
    setIsDonating(true);
    try {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athleteId: highlighted.athleteId,
          donorId: user?.id,
          amount: 5000, // 💰 exemplo: R$50,00
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar pagamento.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar sessão de pagamento.");
    } finally {
      setIsDonating(false);
    }
  };

  if (!user || isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando atletas...
      </div>
    );
  }

  const loopList = [...athletes, ...athletes];

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    setIsDeleting(true);
    try {
      const res = await deleteDonorAccount(user.id);
      if (res.success) {
        router.push("/authentication");
      } else {
        alert("Erro ao excluir conta.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro inesperado.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section
      className="relative min-h-screen overflow-x-hidden overflow-y-hidden bg-white pt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 🔹 OVERLAY de destaque */}
      {highlighted && (
        <div className="bg-primary/50 animate-fade-in fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="animate-zoom-in relative w-[min(92vw,480px)] scale-95">
            {/* Mensagem de boas-vindas */}
            <div className="mb-4 text-center text-white">
              <h3 className="text-xl font-bold">
                Você escolheu apoiar o atleta{" "}
                <span className="capitalize">{highlighted?.name}</span> 💪
              </h3>
              <p className="mt-1 text-sm opacity-90">
                Revise o card abaixo e prossiga com a sua doação.
              </p>
            </div>

            {/* Card do atleta */}
            <AthleteSwitcherCard athlete={highlighted} showDonateButton />
            {/* Botão transparente "Sair" */}
            <div className="mt-16 pr-8 pl-8">
              <Button
                onClick={closeHighlight}
                className="w-full rounded-xl border-none bg-transparent text-black transition-all duration-300 hover:bg-black hover:text-white"
              >
                <LogOut className="h-4 w-4" /> Sair
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho principal */}
      <div className="container mx-auto px-6">
        <div className="mb-8 flex flex-col items-center lg:flex-row lg:items-center lg:justify-between">
          {/* Texto centralizado no mobile */}
          <div className="pt-10 text-center lg:pt-0 lg:text-left">
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard do Apoiador
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Clique na foto para conhecer o atleta.
            </p>
          </div>

          {/* Ações no topo – alinhadas à direita no desktop */}
          <div className="hidden items-center gap-3 lg:flex">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-black hover:bg-black hover:text-white"
                >
                  <Trash className="h-4 w-4" />
                  Excluir conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sua conta será excluída permanentemente. As doações feitas
                    continuarão registradas para os atletas, mas você não poderá
                    mais acessar a plataforma.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-primary hover:bg-primary/90 hover:text-white"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              className="bg-primary hover:bg-primary/90 flex items-center gap-2 text-white"
              onClick={() => router.push("/")}
            >
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>

        {/* Carrossel */}
        <div className="relative flex items-center">
          {/* ✅ DESKTOP (mantém igual) */}
          <Button
            variant="ghost"
            size="icon"
            className="bg-primary absolute top-1/2 -left-12 z-10 hidden -translate-y-1/2 rounded-full text-white shadow backdrop-blur transition-all duration-300 hover:bg-black hover:text-white lg:flex"
            onClick={() => scrollManual("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div
            ref={containerRef}
            className="hidden w-full overflow-hidden lg:block"
          >
            <div
              className="marquee-track flex items-stretch justify-start gap-4"
              style={{ animationPlayState: paused ? "paused" : "running" }}
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

          <Button
            variant="ghost"
            size="icon"
            className="bg-primary absolute top-1/2 -right-12 z-10 hidden -translate-y-1/2 rounded-full text-white shadow backdrop-blur transition-all duration-300 hover:bg-black hover:text-white lg:flex"
            onClick={() => scrollManual("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* ✅ MOBILE – UM CARD DE CADA VEZ */}
          <div className="relative flex w-full flex-col items-center lg:hidden">
            <div className="flex w-full justify-center">
              <div className="w-[90%] max-w-[360px]">
                <AthleteSwitcherCard
                  athlete={athletes[currentIndex]}
                  fixedHeight={560}
                  showDonateButton
                />
              </div>
            </div>

            {/* ✅ Botões laterais — aparecem somente se +1 atleta */}
            {athletes.length > 1 && (
              <>
                {/* Botão Esquerdo */}
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === 0 ? athletes.length - 1 : prev - 1,
                    )
                  }
                  className="bg-primary absolute top-1/2 -left-4 -translate-y-1/2 rounded-full p-2 shadow-md transition hover:bg-black"
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>

                {/* Botão Direito */}
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === athletes.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="bg-primary absolute top-1/2 -right-4 -translate-y-1/2 rounded-full p-2 shadow-md transition hover:bg-black"
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              </>
            )}
            {/* Botão Sair e excluir conta no mobile abaixo do Doar */}
            {athletes.length > 0 && (
              <div className="mt-16 flex w-full flex-col items-center justify-center gap-2 lg:hidden">
                <Button
                  onClick={() => router.push("/")}
                  className="w-[70%] max-w-[360px] rounded-xl bg-black py-2 text-white transition hover:bg-gray-800"
                >
                  <LogOut className="h-4 w-4" /> Sair
                </Button>
                {/* ⬇️ Botão de excluir conta — MOBILE */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-[70%] max-w-[360px] rounded-xl text-black hover:bg-black hover:text-white"
                    >
                      <Trash className="h-4 w-4" /> Encluir Conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Sua conta será permanentemente excluída. As doações
                        feitas continuarão sendo contabilizadas para os atletas.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-primary hover:bg-primary-90% text-white"
                        onClick={async () => {
                          const res = await deleteDonorAccount(user.id);
                          if (res.success) {
                            router.push("/authentication");
                          } else {
                            alert("Erro ao excluir conta");
                          }
                        }}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Animações */}
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
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.28s ease-out forwards;
        }

        .animate-zoom-in {
          animation: zoom-in 0.32s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
