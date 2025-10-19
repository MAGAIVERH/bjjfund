"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useSession } from "@/lib/auth-client";
import {
  createAthlete,
  getAthleteByUserId,
  updateAthlete,
} from "@/app/actions/athlete-actions";

const athleteSchema = z.object({
  faixa: z.string().min(1, "Faixa é obrigatória"),
  escola: z.string().min(1, "Escola é obrigatória"),
  nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  bio: z.string().optional(),
  photo: z.string().optional(),
  evento: z.string().optional(),
  ouro: z.string().optional(), // novo campo
  prata: z.string().optional(), // novo campo
  bronze: z.string().optional(), // novo campo
});

export type AthleteFormValues = z.infer<typeof athleteSchema>;

interface AthleteFormProps {
  onSuccess?: (data: AthleteFormValues) => void;
  onCancel?: () => void;
}

export function AthleteForm({ onSuccess, onCancel }: AthleteFormProps) {
  const router = useRouter();
  const { data, isPending } = useSession();
  const user = data?.user;

  const [loading, setLoading] = useState(false);

  const form = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      faixa: "",
      escola: "",
      nascimento: "",
      cidade: "",
      bio: "",
      photo: "",
      evento: "",
      ouro: "", // default vazio
      prata: "", // default vazio
      bronze: "", // default vazio
    },
  });

  useEffect(() => {
    const loadAthleteData = async () => {
      if (!user?.id) return;

      const res = await getAthleteByUserId(user.id);
      if (res.success && res.athlete) {
        form.reset({
          faixa: res.athlete.faixa || "",
          escola: res.athlete.escola || "",
          nascimento: res.athlete.nascimento || "",
          cidade: res.athlete.cidade || "",
          bio: res.athlete.bio || "",
          photo: res.athlete.image || "",
          evento: res.athlete.evento || "",
          ouro: res.athlete.ouro || "", // preenchendo do banco
          prata: res.athlete.prata || "", // preenchendo do banco
          bronze: res.athlete.bronze || "", // preenchendo do banco
        });
      }
    };
    loadAthleteData();
  }, [user, form]);

  const onSubmit = async (values: AthleteFormValues) => {
    if (!user?.id) {
      toast.error("Usuário não encontrado.");
      return;
    }

    setLoading(true);
    try {
      const athleteExist = await getAthleteByUserId(user.id);
      let res;
      if (athleteExist.success && athleteExist.athlete) {
        res = await updateAthlete(user.id, {
          faixa: values.faixa,
          escola: values.escola,
          nascimento: values.nascimento,
          cidade: values.cidade,
          bio: values.bio,
          image: values.photo,
          evento: values.evento || "",
          ouro: values.ouro || "",
          prata: values.prata || "",
          bronze: values.bronze || "",
        });
      } else {
        res = await createAthlete({
          userId: user.id,
          faixa: values.faixa,
          escola: values.escola,
          nascimento: values.nascimento,
          cidade: values.cidade,
          bio: values.bio,
          image: values.photo,
          evento: values.evento || "",
          ouro: values.ouro || "",
          prata: values.prata || "",
          bronze: values.bronze || "",
        });
      }

      if (res.success) {
        toast.success("Informações salvas!");
        onSuccess?.(values);
      } else {
        toast.error(res.error || "Erro ao salvar informações.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md p-4 text-center">
        {isPending ? "Carregando usuário..." : "Usuário não encontrado."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-center text-xl font-bold text-gray-800">
        Informações do Atleta
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center">
            <Avatar className="mb-4 h-24 w-24">
              {form.getValues("photo") ? (
                <AvatarImage src={form.getValues("photo")} />
              ) : user.image ? (
                <AvatarImage src={user.image} />
              ) : (
                <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
              )}
            </Avatar>

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Foto (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Cole a URL da foto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="faixa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faixa</FormLabel>
                <FormControl>
                  <Input placeholder="Faixa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="escola"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Escola</FormLabel>
                <FormControl>
                  <Input placeholder="Escola" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="evento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evento</FormLabel>
                <FormControl>
                  <Input placeholder="Evento do atleta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frase do Atleta</FormLabel>
                <FormControl>
                  <Textarea placeholder="Frase do atleta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* NOVOS CAMPOS */}
          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="ouro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ouro 🥇</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prata 🥈</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bronze"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bronze 🥉</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 md:flex-row">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>

            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="flex-1 border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
