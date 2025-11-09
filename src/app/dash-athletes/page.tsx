"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getAthleteByUserId } from "../actions/athlete-actions";
import { getCampaignByUserId } from "../actions/campaign-actions";

import { AthleteChartCard } from "./components/athlete-chart-card";
import { AthleteForm, AthleteFormValues } from "./components/athlete-form";
import { AthleteCampaignCard } from "./components/athlete-campaign-card";

import { Button } from "@/components/ui/button";
import {
  Edit,
  LogOut,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AthleteProfileCard from "./components/athlete-profile-card";

export default function AthleteDashboard() {
  const { data, isPending } = useSession();
  const user = data?.user;
  const router = useRouter();

  const [athleteData, setAthleteData] = useState<any | null>(null);
  const [campaignData, setCampaignData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showCampaign, setShowCampaign] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // 0 = Card, 1 = Grafico

  // 🔹 Carrega dados do atleta e da campanha
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      const athleteRes = await getAthleteByUserId(user.id);
      const campaignRes = await getCampaignByUserId(user.id);

      if (athleteRes.success && athleteRes.athlete)
        setAthleteData(athleteRes.athlete);
      if (campaignRes.success && campaignRes.data)
        setCampaignData(campaignRes.data);

      console.log("👟 user.id:", user.id);
      console.log("👟 athleteData:", athleteRes.athlete);
      console.log("👟 campaignData:", campaignRes.data);

      setLoading(false);
    };
    loadData();
  }, [user?.id]);

  const handleFormSuccess = (data: AthleteFormValues) => {
    setAthleteData((prev: any) => ({
      ...(prev || {}),
      ...data,
      name: user?.name || prev?.name || "",
      image: data.photo || user?.image || prev?.image || null,
    }));
    setEditing(false);
  };

  if (!user || isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando informações...
      </div>
    );
  }

  // ✅ CAMPANHA
  if (showCampaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* ✅ Cabeçalho da campanha – responsivo e alinhado */}
        <div className="mb-6 flex flex-col items-center justify-between lg:flex-row">
          {/* Título fica à esquerda no desktop e centralizado no mobile */}
          <h1 className="text-center text-2xl font-bold lg:text-left">
            Minha Campanha
          </h1>

          {/* Botões no desktop, alinhados à direita */}
          <div className="mt-4 hidden gap-3 lg:mt-0 lg:flex">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowCampaign(false)}
            >
              ← Voltar ao perfil
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 flex items-center gap-2 text-white"
              onClick={() => router.push("/")}
            >
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>

        {/* ✅ Se não tiver campanha ativa */}
        {!campaignData ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="mb-4 text-gray-600">
              Você ainda não possui uma campanha ativa no momento.
            </p>
            <Button onClick={() => router.push("/create-campaigns")}>
              Criar Campanha
            </Button>
          </div>
        ) : (
          <>
            {/* ✅ DESKTOP permanece igual */}
            <div className="hidden gap-8 md:grid md:grid-cols-3">
              <div className="md:col-span-1">
                <AthleteCampaignCard campaign={campaignData} />
              </div>
              <div className="md:col-span-2">
                <AthleteChartCard campaignId={campaignData.id} />
              </div>
            </div>

            {/* ✅ MOBILE – Card ↔ Gráfico com setas laterais */}
            <div className="relative flex flex-col items-center md:hidden">
              {currentIndex === 0 ? (
                <div className="w-[350px] max-w-[90%]">
                  <AthleteCampaignCard campaign={campaignData} />
                </div>
              ) : (
                <div className="h-[610px] w-[350px] max-w-[90%]">
                  <AthleteChartCard campaignId={campaignData.id} />
                </div>
              )}

              {/* ✅ Setas laterais */}
              <button
                onClick={() => setCurrentIndex(0)}
                className="bg-primary absolute top-1/2 -left-4 -translate-y-1/2 rounded-full p-2 shadow-md hover:bg-black"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>

              <button
                onClick={() => setCurrentIndex(1)}
                className="bg-primary absolute top-1/2 -right-4 -translate-y-1/2 rounded-full p-2 shadow-md hover:bg-black"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* ✅ Botões no final, empilhados no mobile */}
            <div className="mt-10 flex flex-col items-center gap-3 lg:hidden">
              <Button
                variant="outline"
                className="w-40"
                onClick={() => setShowCampaign(false)}
              >
                ← Voltar ao perfil
              </Button>
              <Button
                className="bg-primary w-40 text-white"
                onClick={() => router.push("/")}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ✅ PERFIL
  return (
    <div className="container mx-auto px-4 py-8">
      {/* CABEÇALHO - versão mobile centralizada / desktop alinhada à esquerda */}
      <div className="mb-6 flex flex-col items-center lg:flex-row lg:items-center lg:justify-between">
        {/* Título sempre visível */}
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold">Dashboard do Atleta</h1>
          <p className="mt-1 text-sm text-gray-600">Gerencie suas doações.</p>
        </div>

        {/* Botões no desktop (lado direito) */}
        <div className="hidden gap-3 lg:flex">
          <Button variant="ghost" onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4" /> Editar
          </Button>
          <Button variant="ghost" onClick={() => setShowCampaign(true)}>
            <BarChart3 className="h-4 w-4" /> Ver campanha
          </Button>
          <Button
            className="bg-primary text-white"
            onClick={() => router.push("/")}
          >
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>

        {/* Botões no mobile (embaixo do título) */}
        <div className="mt-4 flex w-full flex-col items-center gap-3 lg:hidden">
          <Button
            variant="outline"
            className="w-40"
            onClick={() => setEditing(true)}
          >
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>

          <Button
            variant="outline"
            className="w-40"
            onClick={() => setShowCampaign(true)}
          >
            <BarChart3 className="mr-2 h-4 w-4" /> Ver campanha
          </Button>
        </div>
      </div>

      {/* Conteúdo principal */}
      {!athleteData || editing ? (
        <AthleteForm
          onSuccess={handleFormSuccess}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          {/* ✅ DESKTOP – mantém igual */}
          <div className="hidden gap-8 md:grid md:grid-cols-3">
            {/* Card do atleta com altura automática */}
            <div className="h-full md:col-span-1">
              <AthleteProfileCard
                name={athleteData.name}
                avatar={athleteData.avatar || athleteData.image || user?.image}
                faixa={athleteData.faixa}
                escola={athleteData.escola}
                nascimento={athleteData.nascimento}
                cidade={athleteData.cidade}
                bio={athleteData.bio}
                evento={athleteData.evento}
                ouro={athleteData.ouro ?? 0}
                prata={athleteData.prata ?? 0}
                bronze={athleteData.bronze ?? 0}
                totalAmount={campaignData?.collectedAmount}
                totalSupporters={campaignData?.supportersCount}
              />
            </div>

            {/* GRÁFICO ajustado para acompanhar a altura do card */}
            <div className="flex md:col-span-2">
              <div className="h-full w-full">
                <AthleteChartCard userId={user.id} />
              </div>
            </div>
          </div>

          {/* ✅ MOBILE – alterna Card ↔ Gráfico com setas */}
          <div className="relative flex flex-col items-center md:hidden">
            {currentIndex === 0 ? (
              <div className="w-[350px] max-w-[90%]">
                <AthleteProfileCard
                  name={athleteData.name}
                  avatar={
                    athleteData.avatar || athleteData.image || user?.image
                  }
                  faixa={athleteData.faixa}
                  escola={athleteData.escola}
                  nascimento={athleteData.nascimento}
                  cidade={athleteData.cidade}
                  bio={athleteData.bio}
                  evento={athleteData.evento}
                  ouro={athleteData.ouro ?? 0}
                  prata={athleteData.prata ?? 0}
                  bronze={athleteData.bronze ?? 0}
                  totalAmount={campaignData?.collectedAmount}
                  totalSupporters={campaignData?.supportersCount}
                />
              </div>
            ) : (
              <div className="h-[610px] w-[350px] max-w-[90%]">
                <AthleteChartCard userId={user.id} />
              </div>
            )}

            {/* ✅ Botões laterais de navegação */}
            <button
              onClick={() => setCurrentIndex(0)}
              className="bg-primary absolute top-1/2 -left-4 -translate-y-1/2 rounded-full p-2 shadow-md hover:bg-black"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>

            <button
              onClick={() => setCurrentIndex(1)}
              className="bg-primary absolute top-1/2 -right-4 -translate-y-1/2 rounded-full p-2 shadow-md hover:bg-black"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </>
      )}

      {/* Botão Sair no final (somente mobile) */}
      <div className="mt-10 flex justify-center lg:hidden">
        <Button
          onClick={() => router.push("/")}
          className="bg-primary hover:bg-primary/90 flex w-40 items-center gap-2 text-white"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </div>
    </div>
  );
}
