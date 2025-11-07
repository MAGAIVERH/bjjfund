// import { CampaignForm } from "./components/campaign-form";

// export default function CreateCampaignPage() {
//   return (
//     <div className="container mx-auto max-w-2xl py-12">
//       <h1 className="mb-6 text-center text-3xl font-bold">
//         Criar ou Editar Campanha 💪
//       </h1>
//       <CampaignForm />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getCampaignByUserId } from "@/app/actions/campaign-actions";
import { CampaignForm } from "./components/campaign-form";

export default function CreateCampaignPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function checkCampaign() {
      if (!user?.id) return;
      const res = await getCampaignByUserId(user.id);
      if (res.success && res.data) {
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    }
    checkCampaign();
  }, [user?.id]);

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="mb-6 text-center text-3xl font-bold">
        {isEditing ? "Editar Campanha" : "Criar Campanha"} 💪
      </h1>
      <CampaignForm />
    </div>
  );
}
