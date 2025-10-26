import { CampaignForm } from "./components/campaign-form";

export default function CreateCampaignPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Criar Nova Campanha 💪
      </h1>
      <CampaignForm />
    </div>
  );
}
