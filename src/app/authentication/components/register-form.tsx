"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authClient } from "@/lib/auth-client";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Nome completo é obrigatório"),
  email: z
    .string()
    .trim()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  password: z
    .string()
    .trim()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
  role: z.string().min(1, "Tipo de conta é obrigatório"),
});

const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "supporter",
    },
  });

  const handleSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    setErrors({});

    const { data, error } = await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        // role: values.role,
        callbackURL: "/authentication",
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          toast.success("Conta criada com sucesso!");

          // Redireciona para dashboard dependendo do tipo de usuário
          if (values.role === "athlete") {
            router.push("/dash-athletes");
          } else if (values.role === "supporter") {
            router.push("/dash-donors");
          } else {
            router.push("/authentication"); // fallback
          }
        },
        onError: (ctx) => {
          toast.error(
            ctx.error.message || "Erro ao criar conta. Confira os dados.",
          );
        },
      },
    );

    setIsLoading(false);
  };
  const handleGoogleRegister = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/select-role",
      scopes: ["email", "profile"],
    });
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
        <CardDescription>
          Junte-se à nossa plataforma de crowdfunding para atletas
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  {errors.name && <FormMessage>{errors.name[0]}</FormMessage>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  {errors.email && <FormMessage>{errors.email[0]}</FormMessage>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      {...field}
                    />
                  </FormControl>
                  {errors.password && (
                    <FormMessage>{errors.password[0]}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Conta</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value} // valor atual do RHF
                      onValueChange={field.onChange} // atualiza o RHF
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="supporter" id="supporter" />
                        <FormLabel htmlFor="supporter" className="text-sm">
                          Apoiador - Quero apoiar atletas
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="athlete" id="athlete" />
                        <FormLabel htmlFor="athlete" className="text-sm">
                          Atleta - Quero captar recursos
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  {errors.role && <FormMessage>{errors.role[0]}</FormMessage>}
                </FormItem>
              )}
            />

            {errors.general && <FormMessage>{errors.general[0]}</FormMessage>}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || form.formState.isSubmitting}
            >
              {isLoading || form.formState.isSubmitting
                ? "Criando conta..."
                : "Criar Conta"}
            </Button>

            <Button
              variant="outline"
              className="mt-2 w-full"
              type="button"
              onClick={handleGoogleRegister}
            >
              {/* ícone Google */}
              <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Entrar com Google
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
