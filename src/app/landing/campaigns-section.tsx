"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAllCampaigns } from "@/app/actions/campaign-actions";

import AthleteCampaignCard from "../dash-athletes/components/athlete-campaign-card";

interface CampaignCard {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  collectedAmount: number;
  athleteName: string;
  athleteImage: string | null;
  status: string;
  athleteId: string;
  campaignImage?: string | null;
  faixa?: string;
  escola?: string;
}

export function CampaignsSection() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getAllCampaigns();
      if (res.success && res.data) setCampaigns(res.data as CampaignCard[]);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <section className="py-16 text-center text-gray-600">
        Carregando campanhas...
      </section>
    );

  if (!campaigns.length) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        {/* Cabeçalho */}
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
          Campanhas em Destaque 💪
        </h2>
        <p className="mb-12 text-center text-gray-600">
          Apoie atletas brasileiros e faça parte dessa jornada!
        </p>

        {/* ✅ Agora usamos o mesmo card da dashboard */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                // Salva para redirecionar corretamente após login
                localStorage.setItem("pendingAthleteId", c.athleteId);
                localStorage.setItem("pendingCampaignId", c.id);
                router.push("/authentication");
              }}
              className="cursor-pointer"
            >
              <AthleteCampaignCard
                campaign={{
                  id: c.id,
                  title: c.title,
                  description: c.description,
                  goalAmount: String(c.goalAmount ?? 0),
                  collectedAmount: String(c.collectedAmount ?? 0),
                  status: c.status,
                  athleteImage: c.athleteImage,
                  campaignImage: c.campaignImage,
                  athleteName: c.athleteName,
                  faixa: c.faixa,
                  escola: c.escola,
                  athleteId: c.athleteId, // ✅ IMPORTANTE
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
