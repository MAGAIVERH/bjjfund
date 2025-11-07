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
import { Edit, LogOut, BarChart3 } from "lucide-react";
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
        {/* Cabeçalho da campanha */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Minha Campanha</h1>
          <div className="flex gap-3">
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

        {/* Conteúdo da campanha */}
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <AthleteCampaignCard
                campaign={campaignData}
                onDeleted={() => setCampaignData(null)} // ✅ agora a UI atualiza
              />
            </div>
            <div className="md:col-span-2">
              <AthleteChartCard campaignId={campaignData.id} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ✅ PERFIL
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Atleta</h1>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="text-primary flex items-center gap-2 hover:bg-black hover:text-white"
            onClick={() => setEditing(true)}
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>

          <Button
            variant="ghost"
            className="text-primary flex items-center gap-2 hover:bg-black hover:text-white"
            onClick={() => setShowCampaign(true)}
          >
            <BarChart3 className="h-4 w-4" />
            Ver campanha
          </Button>

          <Button
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 text-white"
            onClick={() => router.push("/")}
          >
            <LogOut className="h-4 w-4" />
            Sair
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <AthleteProfileCard
              name={athleteData.name}
              avatar={
                athleteData.avatar ||
                athleteData.image ||
                athleteData.fullImage ||
                user?.image ||
                null
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

          <div className="md:col-span-2">
            <AthleteChartCard userId={user.id} />
          </div>
        </div>
      )}
    </div>
  );
}
