"use client";

import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { createCampaign } from "@/app/actions/campaign-actions";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const campaignSchema = z.object({
  title: z.string().min(3, "Título muito curto"),
  goalAmount: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Informe um valor numérico")
    .refine((v) => parseFloat(v) > 0, "Informe um valor maior que zero"),
  description: z.string().min(10, "Descrição muito curta"),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export function CampaignForm() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      goalAmount: "",
      description: "",
    },
  });

  const onSubmit = async (values: CampaignFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para criar uma campanha.");
      router.push("/authentication");
      return;
    }

    if (user.role !== "athlete") {
      toast.error("Apenas atletas podem criar campanhas.");
      router.push("/dash-donors");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createCampaign({
        userId: user.id,
        title: values.title,
        description: values.description,
        goalAmount: parseFloat(values.goalAmount),
      });

      // 🧩 NOVO: tratamento se já houver uma campanha
      if (!res.success) {
        if (res.error?.toLowerCase().includes("campanha")) {
          toast.error("Você já possui uma campanha ativa.");
          router.push("/dash-athletes");
          return;
        }

        toast.error(res.error || "Erro ao criar campanha.");
        return;
      }

      // ✅ Sucesso total
      toast.success("Campanha criada com sucesso!");
      router.push("/dash-athletes"); // Redireciona para a dashboard do atleta
    } catch (e) {
      console.error(e);
      toast.error("Erro inesperado ao criar campanha.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-2xl bg-white p-6 shadow"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da Campanha</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Rumo ao Mundial de Jiu-Jitsu"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="goalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta (R$)</FormLabel>
                <FormControl>
                  <Input inputMode="decimal" placeholder="5000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[120px]"
                  placeholder="Explique seu objetivo, custos (passagem, inscrição, hospedagem, etc.)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 w-full text-white"
          disabled={submitting}
        >
          {submitting ? "Criando..." : "Criar Campanha"}
        </Button>
      </form>
    </Form>
  );
}
