"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react"; // ← spinner

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
import { setRole } from "@/app/actions/auth-roles";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: async (ctx) => {
          toast.success("Conta criada com sucesso!");
          try {
            await setRole(
              ctx.data.user.id,
              values.role as "athlete" | "supporter",
            );
            router.push(
              values.role === "athlete" ? "/dash-athletes" : "/dash-donors",
            );
          } catch (err) {
            console.error("Erro ao salvar role:", err);
            toast.error("Erro ao configurar conta");
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
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/select-role",
      });
    } catch (error) {
      console.error("Erro durante Google OAuth:", error);
      toast.error("Erro ao criar conta com Google");
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        {/* ✅ moveu os botões aqui */}
        <div className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Criar conta</TabsTrigger>
          </TabsList>
        </div>

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
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name[0]}</p>
                  )}
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email[0]}</p>
                  )}
                </FormItem>
              )}
            />

            {/* Senha */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password[0]}</p>
                  )}
                </FormItem>
              )}
            />

            {/* Tipo de conta */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Conta</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="supporter" id="supporter" />
                        <label
                          htmlFor="supporter"
                          className="cursor-pointer text-sm"
                        >
                          Apoiador - Quero apoiar atletas
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="athlete" id="athlete" />
                        <label
                          htmlFor="athlete"
                          className="cursor-pointer text-sm"
                        >
                          Atleta - Quero captar recursos
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                  {errors.role && (
                    <p className="text-sm text-red-500">{errors.role[0]}</p>
                  )}
                </FormItem>
              )}
            />

            {/* Botão principal */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading || form.formState.isSubmitting || isGoogleLoading
              }
            >
              {isLoading || form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>

            {/* Separador */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Ou
                </span>
              </div>
            </div>

            {/* Botão Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleGoogleRegister}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta com Google...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                  Criar conta com Google
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Link para login */}
        <div className="mt-4 text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/authentication" className="font-medium underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
