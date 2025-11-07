// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Heart } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { getAllCampaigns } from "@/app/actions/campaign-actions";

// interface CampaignCard {
//   id: string;
//   title: string;
//   description: string;
//   goalAmount: number;
//   collectedAmount: number;
//   athleteName: string;
//   athleteImage: string | null;
//   status: string;
//   athleteId: string; // ✅ precisamos disto para destacar o atleta depois do login
// }

// export function CampaignsSection() {
//   const router = useRouter();
//   const [campaigns, setCampaigns] = useState<CampaignCard[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const res = await getAllCampaigns();
//       if (res.success && res.data) setCampaigns(res.data as CampaignCard[]);
//       setLoading(false);
//     })();
//   }, []);

//   if (loading)
//     return (
//       <section className="py-16 text-center text-gray-600">
//         Carregando campanhas...
//       </section>
//     );

//   if (!campaigns.length) return null;

//   return (
//     <section className="bg-gray-50 py-16">
//       <div className="container mx-auto px-6">
//         {/* Cabeçalho */}
//         <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
//           Campanhas em Destaque 💪
//         </h2>
//         <p className="mb-12 text-center text-gray-600">
//           Apoie atletas brasileiros e faça parte dessa jornada!
//         </p>

//         {/* Grid de cards */}
//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//           {campaigns.map((c) => {
//             const pct =
//               c.goalAmount > 0
//                 ? Math.min((c.collectedAmount / c.goalAmount) * 100, 100)
//                 : 0;

//             const handleClick = () => {
//               // 🔹 Salvamos tanto o atleta quanto a campanha selecionada
//               localStorage.setItem("pendingAthleteId", c.athleteId);
//               localStorage.setItem("pendingCampaignId", c.id); // ✅ NOVO

//               // Redireciona para login
//               router.push("/authentication");
//             };

//             return (
//               <Card
//                 key={c.id}
//                 className="hover:border-primary/30 group border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
//               >
//                 <CardContent className="flex flex-col justify-between p-6">
//                   {/* Imagem */}
//                   <div className="mb-4 h-56 overflow-hidden rounded-xl bg-gray-100">
//                     {c.athleteImage ? (
//                       <img
//                         src={c.athleteImage}
//                         alt={c.athleteName}
//                         className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
//                       />
//                     ) : (
//                       <div className="flex h-full items-center justify-center text-gray-400">
//                         Sem imagem
//                       </div>
//                     )}
//                   </div>

//                   {/* Título e descrição */}
//                   <div className="space-y-2">
//                     <h3 className="text-center text-lg font-semibold text-gray-900 uppercase">
//                       {c.title}
//                     </h3>
//                     <p className="line-clamp-3 text-center text-sm text-gray-600">
//                       {c.description}
//                     </p>
//                   </div>

//                   {/* Progresso */}
//                   <div className="mt-4 space-y-2">
//                     <div className="flex items-center justify-between text-sm text-gray-700">
//                       <span>
//                         🎯 Meta:{" "}
//                         <strong>
//                           R$ {c.goalAmount.toLocaleString("pt-BR")}
//                         </strong>
//                       </span>
//                       <span>
//                         ❤️ Arrecadado:{" "}
//                         <strong>
//                           R$ {c.collectedAmount.toLocaleString("pt-BR")}
//                         </strong>
//                       </span>
//                     </div>

//                     <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
//                       <div
//                         className="bg-primary absolute top-0 left-0 h-full transition-all duration-500"
//                         style={{ width: `${pct}%` }}
//                       />
//                     </div>
//                   </div>

//                   {/* Botão de apoio */}
//                   <Button
//                     className="bg-primary hover:bg-primary/90 mt-6 w-full text-white"
//                     onClick={handleClick}
//                   >
//                     <Heart className="mr-2 h-4 w-4" /> Apoiar Campanha
//                   </Button>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
                  goalAmount: String(c.goalAmount),
                  collectedAmount: String(c.collectedAmount),
                  status: c.status,
                  athleteImage: c.athleteImage,
                  campaignImage: c.campaignImage,
                  athleteName: c.athleteName,
                  faixa: c.faixa,
                  escola: c.escola,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
