// "use client";

// import { z } from "zod";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "@/lib/auth-client";
// import { toast } from "sonner";
// import { createCampaign } from "@/app/actions/campaign-actions";

// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";

// // ✅ Agora com campo opcional para imagem da campanha
// const campaignSchema = z.object({
//   title: z.string().min(3, "Título muito curto"),
//   goalAmount: z
//     .string()
//     .regex(/^\d+(\.\d+)?$/, "Informe um valor numérico")
//     .refine((v) => parseFloat(v) > 0, "Informe um valor maior que zero"),
//   description: z.string().min(160, "Descrição muito curta"),
//   campaignImage: z.string().optional(), // ✅ Novo campo
// });

// type CampaignFormValues = z.infer<typeof campaignSchema>;

// export function CampaignForm() {
//   const { data: session } = useSession();
//   const user = session?.user;
//   const router = useRouter();
//   const [submitting, setSubmitting] = useState(false);

//   const form = useForm<CampaignFormValues>({
//     resolver: zodResolver(campaignSchema),
//     defaultValues: {
//       title: "",
//       goalAmount: "",
//       description: "",
//       campaignImage: "",
//     },
//   });

//   const onSubmit = async (values: CampaignFormValues) => {
//     if (!user) {
//       toast.error("Você precisa estar logado para criar uma campanha.");
//       router.push("/authentication");
//       return;
//     }

//     if (user.role !== "athlete") {
//       toast.error("Apenas atletas podem criar campanhas.");
//       router.push("/dash-donors");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const res = await createCampaign({
//         userId: user.id,
//         title: values.title,
//         description: values.description,
//         goalAmount: parseFloat(values.goalAmount),
//         campaignImage: values.campaignImage || undefined, // ✅ Enviando imagem
//       });

//       if (!res.success) {
//         if (res.error?.toLowerCase().includes("campanha")) {
//           toast.error("Você já possui uma campanha ativa.");
//           router.push("/dash-athletes");
//           return;
//         }
//         toast.error(res.error || "Erro ao criar campanha.");
//         return;
//       }

//       toast.success("Campanha criada com sucesso!");
//       router.push("/dash-athletes");
//     } catch (e) {
//       console.error(e);
//       toast.error("Erro inesperado ao criar campanha.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-6 rounded-2xl bg-white p-6 shadow"
//       >
//         {/* TÍTULO */}
//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Título da Campanha</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="Ex: Rumo ao Mundial de Jiu-Jitsu"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* META */}
//         <FormField
//           control={form.control}
//           name="goalAmount"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Meta (R$)</FormLabel>
//               <FormControl>
//                 <Input inputMode="decimal" placeholder="5000" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* IMAGEM DA CAMPANHA */}
//         <FormField
//           control={form.control}
//           name="campaignImage"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Imagem da Campanha (URL)</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="https://exemplo.com/imagem.jpg"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* DESCRIÇÃO */}
//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Descrição</FormLabel>
//               <FormControl>
//                 <Textarea
//                   className="min-h-[120px]"
//                   placeholder="Explique seu objetivo, custos (passagem, inscrição, hospedagem, etc.)"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* BOTÃO */}
//         <Button
//           type="submit"
//           className="bg-primary hover:bg-primary/90 w-full text-white"
//           disabled={submitting}
//         >
//           {submitting ? "Criando..." : "Criar Campanha"}
//         </Button>
//       </form>
//     </Form>
//   );
// }

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect,useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createCampaign,
  getCampaignByUserId,
  updateCampaign,
} from "@/app/actions/campaign-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";

const campaignSchema = z.object({
  title: z.string().min(3, "Título muito curto"),
  goalAmount: z.string().regex(/^\d+(\.\d+)?$/, "Informe um valor válido"),
  description: z.string().min(50, "Descrição muito curta"),
  campaignImage: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export function CampaignForm() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(
    null,
  );

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      goalAmount: "",
      description: "",
      campaignImage: "",
    },
  });

  // ✅ Buscar campanha existente e preencher o form automaticamente
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!user?.id) return;

      const res = await getCampaignByUserId(user.id);
      if (res.success && res.data) {
        setEditingCampaignId(res.data.id);
        form.reset({
          title: res.data.title,
          goalAmount: res.data.goalAmount,
          description: res.data.description,
          campaignImage: res.data.campaignImage || "",
        });
      }
      setLoading(false);
    };

    fetchCampaign();
  }, [user?.id, form]);

  const onSubmit = async (values: CampaignFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado.");
      router.push("/authentication");
      return;
    }

    try {
      if (editingCampaignId) {
        // ✅ Atualizar campanha existente
        const res = await updateCampaign({
          campaignId: editingCampaignId,
          userId: user.id,
          title: values.title,
          description: values.description,
          goalAmount: parseFloat(values.goalAmount),
          campaignImage: values.campaignImage || undefined,
        });

        if (res.success) {
          toast.success("Campanha atualizada com sucesso!");
          router.push("/dash-athletes");
        } else {
          toast.error(res.error || "Erro ao atualizar campanha.");
        }
      } else {
        // ✅ Criar nova campanha
        const res = await createCampaign({
          userId: user.id,
          title: values.title,
          description: values.description,
          goalAmount: parseFloat(values.goalAmount),
          campaignImage: values.campaignImage || undefined,
        });

        if (res.success) {
          toast.success("Campanha criada com sucesso!");
          router.push("/dash-athletes");
        } else {
          toast.error(res.error || "Erro ao criar campanha.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado");
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-2xl bg-white p-6 shadow"
      >
        {/* TÍTULO */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Rumo ao Mundial" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* META */}
        <FormField
          control={form.control}
          name="goalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta (R$)</FormLabel>
              <FormControl>
                <Input placeholder="5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* IMAGEM */}
        <FormField
          control={form.control}
          name="campaignImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem (URL)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://imagem.com/campanha.jpg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* DESCRIÇÃO */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* BOTÃO */}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-primary flex w-full items-center justify-center gap-2 text-white"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {editingCampaignId ? "Atualizando..." : "Criando..."}
            </>
          ) : editingCampaignId ? (
            "Atualizar Campanha"
          ) : (
            "Criar Campanha"
          )}
        </Button>
      </form>
    </Form>
  );
}
