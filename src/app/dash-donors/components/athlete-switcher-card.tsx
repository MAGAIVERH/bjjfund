"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AthleteProfileCard from "@/app/dash-athletes/components/athlete-profile-card";
import { createCheckoutSession } from "@/app/actions/create-checkout-session";

type Mode = "profile" | "photo" | "history" | "donate";

export interface AthleteData {
  athleteId: string;
  name: string;

  // ========= Campos de imagem =========
  // Já existia:
  avatar?: string | null;
  fullImage?: string | null;

  // Novos (opcionais), para suportar todos os casos (Google / Manual):
  image?: string | null; // foto de rosto salva no schema "athletes.image"
  userImage?: string | null; // foto do Google (schema "user.image")
  photo?: string | null; // alguns fluxos podem usar "photo" no front

  // ========= Demais campos =========
  faixa?: string | null;
  escola?: string | null;
  nascimento?: string | null;
  cidade?: string | null;
  bio?: string | null;
  evento?: string | null;
  ouro?: number | null;
  prata?: number | null;
  bronze?: number | null;
  historia?: string | null;
}

interface AthleteSwitcherCardProps {
  athlete: AthleteData;
  fixedHeight?: number;
  showDonateButton?: boolean;
}

export default function AthleteSwitcherCard({
  athlete,
  fixedHeight = 560,
  showDonateButton = false,
}: AthleteSwitcherCardProps) {
  const [mode, setMode] = useState<Mode>("profile");
  const [customAmount, setCustomAmount] = useState("$ 0,00");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDonate = async (amount: number) => {
    try {
      setLoading(true);

      // 🔹 Recupera campaignId salvo no localStorage (se veio da home)
      const campaignId = localStorage.getItem("pendingCampaignId");

      // 🔹 Chama a função de checkout incluindo o campaignId (se existir)
      await createCheckoutSession(
        athlete.athleteId,
        athlete.name,
        amount,
        campaignId ?? undefined,
      );

      // 🔹 Limpa o localStorage após usar
      localStorage.removeItem("pendingAthleteId");
      localStorage.removeItem("pendingCampaignId");
    } catch (error) {
      console.error("Erro ao iniciar doação:", error);
    } finally {
      setLoading(false);
    }
  };

  // formata valor numérico como "$ 20,00"
  const formatCurrency = (value: number) =>
    `$ ${value.toFixed(2).replace(".", ",")}`;

  // converte string "$ 20,00" -> number 20
  const parseCurrency = (value: string) => {
    const numeric = value.replace(/[^\d,]/g, "").replace(",", ".");
    return parseFloat(numeric) || 0;
  };

  // ========= Fallback unificado de avatar =========
  const resolvedAvatar =
    athlete.avatar ||
    athlete.image ||
    athlete.fullImage ||
    athlete.userImage ||
    athlete.photo ||
    null;

  return (
    <div className="relative" style={{ height: `${fixedHeight}px` }}>
      {/* -------- MODO PROFILE -------- */}
      {mode === "profile" && (
        <div className="h-full cursor-pointer" onClick={() => setMode("photo")}>
          <AthleteProfileCard
            name={athlete.name}
            avatar={resolvedAvatar}
            faixa={athlete.faixa || undefined}
            escola={athlete.escola || undefined}
            nascimento={athlete.nascimento || undefined}
            cidade={athlete.cidade || undefined}
            bio={athlete.bio || undefined}
            evento={athlete.evento || undefined}
            ouro={athlete.ouro ?? 0}
            prata={athlete.prata ?? 0}
            bronze={athlete.bronze ?? 0}
            className="h-full"
            showDonateCta={showDonateButton}
            onDonate={() => setMode("donate")}
          />
        </div>
      )}

      {/* -------- MODO FOTO -------- */}
      {mode === "photo" && (
        <Card className="relative h-full overflow-hidden border-2 p-0">
          <img
            src={
              athlete.fullImage ||
              athlete.image ||
              athlete.userImage ||
              athlete.avatar ||
              "/placeholder.jpg"
            }
            alt={athlete.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-between px-6">
            <Button
              variant="ghost"
              className="rounded-xl border border-white/40 bg-transparent px-5 py-2 text-white transition-all duration-300 hover:border-black/70 hover:bg-black/70"
              onClick={() => setMode("profile")}
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-primary/90 hover:border-primary/90 rounded-xl border border-white/40 bg-transparent px-5 py-2 text-white transition-all duration-300"
              onClick={() => setMode("history")}
            >
              História
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* -------- MODO HISTÓRIA -------- */}
      {mode === "history" && (
        <Card className="relative h-full overflow-hidden border-2 p-0">
          <div className="relative flex h-full flex-col">
            <div
              className="flex-1 overflow-auto p-6 pr-3 pb-28 text-gray-700"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <h3 className="mb-3 text-lg font-semibold">
                História de {athlete.name}
              </h3>
              <p className="text-sm leading-relaxed">
                {athlete.historia || "História não cadastrada."}
              </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-0 h-32 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-between px-6">
              <Button
                variant="ghost"
                className="rounded-xl border border-white/40 bg-transparent px-5 py-2 text-white transition-all duration-300 hover:border-black/70 hover:bg-black/70"
                onClick={() => setMode("photo")}
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl border border-white/30 px-5 py-2 text-white transition-all duration-300"
                onClick={() => setMode("donate")}
              >
                <Heart className="h-4 w-4" />
                Doar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* -------- MODO DOAÇÃO -------- */}
      {mode === "donate" && (
        <Card className="flex h-full flex-col items-center justify-center border-2 p-6 text-center">
          <h3 className="mb-4 text-xl font-semibold">
            Escolha um valor para doar a{" "}
            <span className="text-primary">{athlete.name}</span>
          </h3>

          <div className="mb-6 flex flex-wrap justify-center gap-4">
            {[20, 50, 100].map((value) => (
              <Button
                key={value}
                onClick={() => setCustomAmount(formatCurrency(value))}
                className={`rounded-xl border px-6 py-2 font-semibold shadow-sm transition-all duration-300 hover:shadow-md ${
                  parseCurrency(customAmount) === value
                    ? "bg-primary text-white"
                    : ""
                }`}
              >
                R$ {value}
              </Button>
            ))}
          </div>

          <div className="flex w-full max-w-xs flex-col items-center">
            <Input
              type="text"
              placeholder="$ 0,00"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="mb-3 text-center font-semibold"
            />

            <Button
              disabled={loading}
              onClick={() => {
                const value = parseCurrency(customAmount);
                if (!isNaN(value) && value >= 5) {
                  handleDonate(value);
                } else {
                  alert("Informe um valor mínimo de R$5");
                }
              }}
              className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-xl text-white transition-all duration-300"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Processando..." : "Confirmar Doação"}
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => setMode("profile")}
            className="mt-6 text-gray-500 underline"
          >
            Cancelar
          </Button>
        </Card>
      )}
    </div>
  );
}
