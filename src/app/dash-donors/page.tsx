// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useSession } from "@/lib/auth-client";
// import { getAllAthletes } from "../actions/athlete-support-actions";
// import { useRouter } from "next/navigation";
// import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import AthleteSwitcherCard from "./components/athlete-switcher-card";

// export default function DonorDashboard() {
//   const { data, isPending } = useSession();
//   const user = data?.user;
//   const router = useRouter();

//   const [athletes, setAthletes] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [paused, setPaused] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const loadAthletes = async () => {
//       const res = await getAllAthletes();
//       if (res.success) setAthletes(res.athletes || []);
//       setLoading(false);
//     };
//     loadAthletes();
//   }, []);

//   const scrollManual = (dir: "left" | "right") => {
//     const el = containerRef.current;
//     if (!el) return;
//     setPaused(true);
//     const amount = el.clientWidth * 0.8;
//     el.scrollBy({
//       left: dir === "left" ? -amount : amount,
//       behavior: "smooth",
//     });
//   };

//   if (!user || isPending || loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         Carregando atletas...
//       </div>
//     );
//   }

//   if (!athletes.length) {
//     return (
//       <div className="flex min-h-screen items-center justify-center text-gray-600">
//         Nenhum atleta cadastrado ainda.
//       </div>
//     );
//   }

//   // duplicamos pra efeito de looping infinito
//   const loopList = [...athletes, ...athletes];

//   return (
//     <section
//       className="relative overflow-hidden bg-white py-16"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//     >
//       <div className="container mx-auto px-6">
//         {/* Cabeçalho */}
//         <div className="mb-8 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               Dashboard do Apoiador
//             </h1>
//             <p className="mt-2 text-sm text-gray-600">
//               Clique em um atleta para ver a foto e doar à história.
//             </p>
//           </div>
//           <Button
//             className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl text-white transition-colors duration-300"
//             onClick={() => router.push("/")}
//           >
//             <LogOut className="h-4 w-4" />
//             Sair
//           </Button>
//         </div>

//         {/* Carrossel com os cards */}
//         <div className="relative flex items-center">
//           {/* Botão Esquerdo */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute top-1/2 -left-12 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 shadow backdrop-blur hover:bg-white lg:flex"
//             onClick={() => scrollManual("left")}
//           >
//             <ChevronLeft className="h-6 w-6" />
//           </Button>

//           {/* Faixa rolável */}
//           <div ref={containerRef} className="w-full overflow-hidden">
//             <div
//               className="marquee-track flex items-stretch justify-start gap-4"
//               style={{
//                 animationPlayState: paused
//                   ? ("paused" as const)
//                   : ("running" as const),
//               }}
//             >
//               {loopList.map((athlete, i) => (
//                 <div
//                   key={i}
//                   className="flex-none"
//                   style={
//                     {
//                       "--card-width": "420px",
//                       width: "var(--card-width)",
//                       height: "700px",
//                     } as React.CSSProperties
//                   }
//                 >
//                   <AthleteSwitcherCard
//                     athlete={athlete}
//                     fixedHeight={560}
//                     showDonateButton
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Botão Direito */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute top-1/2 -right-12 z-10 hidden -translate-y-1/2 rounded-full bg-white/80 shadow backdrop-blur hover:bg-white lg:flex"
//             onClick={() => scrollManual("right")}
//           >
//             <ChevronRight className="h-6 w-6" />
//           </Button>
//         </div>
//       </div>

//       {/* CSS para movimento automático */}
//       <style jsx>{`
//         @keyframes marquee {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }

//         .marquee-track {
//           width: max-content;
//           animation: marquee 40s linear infinite;
//           will-change: transform;
//         }
//       `}</style>
//     </section>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getAllAthletes } from "../actions/athlete-support-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AthleteSwitcherCard from "./components/athlete-switcher-card";

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

  return (
    <section
      className="relative overflow-hidden bg-white py-16"
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
                ✖ Sair
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho principal */}
      <div className="container mx-auto px-6">
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

        {/* Carrossel */}
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
                animationPlayState: paused ? "paused" : "running",
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
