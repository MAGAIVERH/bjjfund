"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AthleteProfileCard } from "./components/athlete-profile-card";
import { AthleteChartCard } from "./components/athlete-chart-card";
import { AthleteForm, AthleteFormValues } from "./components/athlete-form";
import { useSession } from "@/lib/auth-client";
import { getAthleteByUserId } from "../actions/athlete-actions";
import { Edit, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AthleteDashboard() {
  const { data, isPending } = useSession();
  const user = data?.user;
  const router = useRouter();

  const [athleteData, setAthleteData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const loadAthlete = async () => {
      if (!user?.id) return;
      const res = await getAthleteByUserId(user.id);
      if (res.success && res.athlete) {
        setAthleteData(res.athlete);
      } else {
        setAthleteData(null);
      }
      setLoading(false);
    };
    loadAthlete();
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
        Carregando informações do atleta...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!athleteData || editing ? (
        <AthleteForm
          onSuccess={handleFormSuccess}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Atleta
              <p className="mt-4 text-sm text-gray-600">
                Gerencie seu perfil e acompanhe o apoio que impulsiona sua
                jornada!
              </p>
            </h1>

            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="text-primary flex items-center gap-2 rounded-xl transition-colors duration-300 hover:bg-black hover:text-white"
                onClick={() => setEditing(true)}
              >
                <Edit className="h-4 w-4" />
                Editar informações
              </Button>

              <Button
                className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl text-white transition-colors duration-300"
                onClick={() => router.push("/")}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>

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
              />
            </div>
            <div className="md:col-span-2">
              <AthleteChartCard />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
