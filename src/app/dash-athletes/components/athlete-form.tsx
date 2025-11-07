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

/** Zod: adicionamos fullImage e historia */
const athleteSchema = z.object({
  faixa: z.string().min(1, "Faixa é obrigatória"),
  escola: z.string().min(1, "Escola é obrigatória"),
  nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  bio: z
    .string()
    .max(100, "A frase deve ter no máximo 80 caracteres.")
    .min(50, "A frase deve ter no minimo 50 caracteres.")
    .optional(),
  photo: z.string().optional(), // avatar/rosto
  fullImage: z.string().optional(), // ✅ corpo inteiro
  historia: z.string().optional(), // ✅ história do atleta
  evento: z.string().optional(),
  ouro: z.string().optional(),
  prata: z.string().optional(),
  bronze: z.string().optional(),
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
      fullImage: "", // ✅
      historia: "", // ✅
      evento: "",
      ouro: "",
      prata: "",
      bronze: "",
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
          fullImage: res.athlete.fullImage || "", // ✅
          historia: res.athlete.historia || "", // ✅
          evento: res.athlete.evento || "",
          ouro: String(res.athlete.ouro ?? ""),
          prata: String(res.athlete.prata ?? ""),
          bronze: String(res.athlete.bronze ?? ""),
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
          fullImage: values.fullImage, // ✅
          historia: values.historia, // ✅
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
          fullImage: values.fullImage, // ✅
          historia: values.historia, // ✅
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
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Informações do Atleta
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatares / Previews */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center">
              <Avatar className="mb-3 h-24 w-24">
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
                  <FormItem className="w-full">
                    <FormLabel>URL da Foto (rosto)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cole a URL da foto de rosto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-3 h-24 w-24 overflow-hidden rounded-full border">
                {/* preview simples da fullImage (se for quadrada, cropa) */}
                {form.getValues("fullImage") ? (
                  <img
                    src={form.getValues("fullImage")}
                    alt="Full preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                    Sem foto
                  </div>
                )}
              </div>
              <FormField
                control={form.control}
                name="fullImage"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>URL da Foto Corpo Inteiro</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cole a URL da foto corpo inteiro"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Campos básicos em grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          </div>

          {/* Frase + História */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frase do Atleta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Frase do atleta"
                      className="min-h-28"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="historia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>História do Atleta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte um pouco da sua trajetória"
                      className="min-h-28"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Medalhas */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="ouro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ouro 🥇</FormLabel>
                  <FormControl>
                    <Input inputMode="numeric" placeholder="0" {...field} />
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
                    <Input inputMode="numeric" placeholder="0" {...field} />
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
                    <Input inputMode="numeric" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Ações */}
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
