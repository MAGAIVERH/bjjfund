// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { authClient } from "@/lib/auth-client";
// import type { ExtendedUser } from "@/lib/auth-types";

// /** 🔹 Função auxiliar: verifica se o atleta já tem campanha ativa */
// async function hasActiveCampaign(userId: string): Promise<boolean> {
//   try {
//     const res = await fetch(`/api/check-campaign?userId=${userId}`);
//     const data = await res.json();
//     return data.hasActive;
//   } catch {
//     return false;
//   }
// }

// export default function GoogleCallbackPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const handleGoogleCallback = async () => {
//       try {
//         const sessionRes = await authClient.getSession();
//         const user = sessionRes?.data?.user as ExtendedUser | undefined;

//         if (!user) {
//           toast.error("Erro ao obter informações do usuário.");
//           router.push("/authentication");
//           return;
//         }

//         toast.success("Login realizado com sucesso!");

//         if (user.role === "admin") {
//           router.push("/dashboard");
//         } else if (user.role === "supporter") {
//           toast.error("Apenas atletas podem criar campanhas.");
//           router.push("/dash-donors");
//         } else if (user.role === "athlete") {
//           const hasCampaign = await hasActiveCampaign(user.id);
//           if (hasCampaign) {
//             router.push("/dash-athletes");
//           } else {
//             router.push("/create-campaigns");
//           }
//         } else {
//           router.push("/");
//         }
//       } catch (err) {
//         console.error("Erro no callback do Google:", err);
//         toast.error("Erro ao processar login com Google.");
//         router.push("/authentication");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     handleGoogleCallback();
//   }, [router]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="text-center">
//           <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
//           <p className="mt-4 text-gray-600">Carregando...</p>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { ExtendedUser } from "@/lib/auth-types";

/** 🔹 Função auxiliar: verifica se o atleta já tem campanha ativa */
async function hasActiveCampaign(userId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/check-campaign?userId=${userId}`);
    const data = await res.json();
    return data.hasActive;
  } catch {
    return false;
  }
}

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const sessionRes = await authClient.getSession();
        const user = sessionRes?.data?.user as ExtendedUser | undefined;

        if (!user) {
          toast.error("Erro ao obter informações do usuário.");
          router.push("/authentication");
          return;
        }

        toast.success("Login realizado com sucesso!");

        // 🔹 NOVO: se doador veio de uma campanha, direciona para destaque
        if (user.role === "supporter") {
          const pendingAthleteId = localStorage.getItem("pendingAthleteId");
          if (pendingAthleteId) {
            localStorage.removeItem("pendingAthleteId");
            router.push(`/dash-donors?highlight=${pendingAthleteId}`);
            return;
          }
        }

        // 🔹 Fluxo padrão
        if (user.role === "admin") {
          router.push("/dashboard");
        } else if (user.role === "supporter") {
          router.push("/dash-donors");
        } else if (user.role === "athlete") {
          const hasCampaign = await hasActiveCampaign(user.id);
          if (hasCampaign) {
            router.push("/dash-athletes");
          } else {
            router.push("/create-campaigns");
          }
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Erro no callback do Google:", err);
        toast.error("Erro ao processar login com Google.");
        router.push("/authentication");
      } finally {
        setIsLoading(false);
      }
    };

    handleGoogleCallback();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return null;
}
