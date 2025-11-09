"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { deleteCampaign } from "@/app/actions/campaign-actions";

interface AthleteCampaignCardProps {
  campaign: {
    id: string;
    title: string;
    description: string;
    goalAmount: string;
    collectedAmount: string;
    status: string;
    athleteName?: string;
    athleteImage?: string | null;
    campaignImage?: string | null;
    faixa?: string;
    escola?: string;
    athleteId?: string; // ✅ necessário para salvar no localStorage
  };
  onDeleted?: () => void;
}

export function AthleteCampaignCard({
  campaign,
  onDeleted,
}: AthleteCampaignCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useSession();
  const user = data?.user;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isClient, setIsClient] = useState(false); // ✅ evita erro de hidratação

  // Habilita comportamento de cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  const progress = (() => {
    const goal = Number(campaign.goalAmount);
    const collected = Number(campaign.collectedAmount);
    if (!goal || isNaN(goal)) return 0;
    return Math.min((collected / goal) * 100, 100);
  })();

  // 🎯 Se existir imagem de campanha, usa ela — senão, foto do atleta
  const coverImage = campaign.campaignImage || campaign.athleteImage || null;

  // ✅ Exibir botões de excluir/editar só no dashboard do atleta
  const showActions = isClient && pathname === "/dash-athletes";

  // 🗑 Excluir campanha
  const handleDelete = async () => {
    if (!user?.id) {
      toast.error("Usuário não encontrado. Faça login novamente.");
      return;
    }

    setIsDeleting(true);
    const res = await deleteCampaign(campaign.id, user.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Campanha excluída com sucesso!");
      onDeleted?.();
    } else {
      toast.error(res.error || "Erro ao excluir campanha.");
    }
  };

  // ❤️ Apoiar campanha (para página inicial)
  const handleSupport = () => {
    if (!isClient) return;
    localStorage.setItem("pendingAthleteId", campaign.athleteId || "");
    localStorage.setItem("pendingCampaignId", campaign.id);
    router.push("/authentication");
  };

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm transition hover:shadow-lg">
      {/* ✅ Imagem principal */}
      <div className="relative h-56 w-full bg-gray-100">
        {coverImage ? (
          <Image
            src={coverImage}
            alt="Imagem da campanha ou atleta"
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
      </div>

      {/* ✅ Título */}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          🏆 {campaign.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ✅ Avatar + Nome + Faixa + Escola */}
        {(campaign.athleteName || campaign.athleteImage) && (
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={campaign.athleteImage || ""} />
              <AvatarFallback>
                {campaign.athleteName?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold">{campaign.athleteName}</span>
              <span className="text-sm text-gray-500">
                {campaign.faixa} • {campaign.escola}
              </span>
            </div>
          </div>
        )}

        {/* ✅ Descrição */}
        <p className="text-sm text-gray-700">{campaign.description}</p>

        {/* 🎯 Meta x Arrecadado */}
        <div className="flex items-center justify-between text-sm">
          <span>
            🎯 <strong>Meta:</strong> R${" "}
            {Number(campaign.goalAmount).toLocaleString("pt-BR")}
          </span>
          <span>
            ❤️ <strong>Arrecadado:</strong> R${" "}
            {Number(campaign.collectedAmount).toLocaleString("pt-BR")}
          </span>
        </div>

        {/* 📊 Barra de progresso */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="bg-primary h-full transition-all duration-700"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* ✅ Botões no dashboard */}
        {showActions && (
          <div className="flex gap-3 pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90 flex-1 text-white"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir campanha?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={handleDelete}
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                router.push(`/create-campaigns?edit=${campaign.id}`)
              }
            >
              Editar
            </Button>
          </div>
        )}

        {/* ✅ Botão "Apoiar Campanha" só na Home */}
        {isClient && pathname === "/" && (
          <Button
            onClick={handleSupport}
            className="bg-primary hover:bg-primary/90 mt-6 w-full text-white"
          >
            ❤️ Apoiar Campanha
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default AthleteCampaignCard;
