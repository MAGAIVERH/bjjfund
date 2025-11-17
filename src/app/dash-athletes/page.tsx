"use client";

import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Edit,
  LogOut,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

import {
  deleteAthleteAccount,
  getAthleteByUserId,
} from "../actions/athlete-actions";
import { getCampaignByUserId } from "../actions/campaign-actions";
import { AthleteCampaignCard } from "./components/athlete-campaign-card";
import { AthleteChartCard } from "./components/athlete-chart-card";
import { AthleteForm, AthleteFormValues } from "./components/athlete-form";
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
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    const res = await deleteAthleteAccount(user.id);
    if (res.success) {
      // Finaliza sessão e redireciona
      router.push("/");
    } else {
      alert("Erro ao excluir conta.");
    }
  };

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
            <Button
              onClick={() => router.push("/create-campaigns")}
              className="bg-primary hover:bg-primary/90 w-40 text-white"
            >
              Criar Campanha
            </Button>
            {/* 🔹 BOTÃO VOLTAR AO PERFIL – SOMENTE MOBILE */}
            <Button
              variant="outline"
              onClick={() => setShowCampaign(false)}
              className="mt-4 w-40 lg:hidden"
            >
              ← Voltar ao perfil
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
        {athleteData && (
          <>
            <div className="hidden gap-3 lg:flex">
              <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-black hover:text-white"
                  >
                    <Trash className="mr-2 h-4 w-4" /> Excluir Conta
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Isso irá excluir sua
                      conta, campanha e todas as doações associadas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-gray-200">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={handleDeleteAccount}
                    >
                      Confirmar Exclusão
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

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
            <div className="mt-4 flex w-full items-center justify-center gap-3 lg:hidden">
              <Button
                className="bg-primary hover:bg-primary/90 w-42 text-white"
                onClick={() => setEditing(true)}
              >
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>

              <Button
                variant="outline"
                className="w-42"
                onClick={() => setShowCampaign(true)}
              >
                <BarChart3 className="mr-2 h-4 w-4" /> Ver campanha
              </Button>
            </div>
          </>
        )}
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
                totalAmount={
                  campaignData?.collectedAmount ?? athleteData.totalAmount ?? 0
                }
                totalSupporters={
                  campaignData?.supportersCount ??
                  athleteData.totalSupporters ??
                  0
                }
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
                  totalAmount={
                    campaignData?.collectedAmount ??
                    athleteData.totalAmount ??
                    0
                  }
                  totalSupporters={
                    campaignData?.supportersCount ??
                    athleteData.totalSupporters ??
                    0
                  }
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
      {athleteData && (
        <div className="mt-10 flex justify-center gap-2 lg:hidden">
          <Button
            onClick={() => router.push("/")}
            className="bg-primary hover:bg-primary/90 flex w-42 items-center gap-2 text-white"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>

          <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-42 hover:bg-black hover:text-white"
              >
                <Trash className="mr-2 h-4 w-4" />
                Excluir conta
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Isso irá excluir sua conta,
                  campanha e todas as doações associadas.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="hover:bg-gray-200">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={handleDeleteAccount}
                >
                  Confirmar Exclusão
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
