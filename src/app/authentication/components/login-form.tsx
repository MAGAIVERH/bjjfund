// "use client";

// import { useState } from "react";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import Link from "next/link";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import { authClient } from "@/lib/auth-client";
// import type { ExtendedUser } from "@/lib/auth-types";

// // Validação
// const loginSchema = z.object({
//   email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
//   password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
// });

// // 🔹 Função auxiliar: verifica se atleta já tem campanha
// async function hasActiveCampaign(userId: string): Promise<boolean> {
//   try {
//     const res = await fetch(`/api/check-campaign?userId=${userId}`);
//     const data = await res.json();
//     return data.hasActive;
//   } catch {
//     return false;
//   }
// }

// const LoginForm = () => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);

//   const form = useForm<z.infer<typeof loginSchema>>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: "", password: "" },
//   });

//   const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
//     setIsLoading(true);

//     try {
//       const { error } = await authClient.signIn.email({
//         email: values.email,
//         password: values.password,
//       });

//       if (error) {
//         toast.error(error.message || "Erro ao entrar. Confira seus dados.");
//         setIsLoading(false);
//         return;
//       }

//       const session = await authClient.getSession();
//       const user = session?.data?.user as ExtendedUser | undefined;

//       if (!user) {
//         toast.error("Usuário não encontrado.");
//         setIsLoading(false);
//         return;
//       }

//       toast.success("Login realizado com sucesso!");

//       // 🔹 Lógica principal de redirecionamento
//       if (user.role === "admin") {
//         router.push("/dashboard");
//       } else if (user.role === "supporter") {
//         toast.error("Apenas atletas podem criar campanhas.");
//         router.push("/dash-donors");
//       } else if (user.role === "athlete") {
//         const hasCampaign = await hasActiveCampaign(user.id);
//         if (hasCampaign) {
//           router.push("/dash-athletes");
//         } else {
//           router.push("/create-campaigns");
//         }
//       } else {
//         router.push("/");
//       }
//     } catch (err) {
//       console.error("Erro no login:", err);
//       toast.error("Erro inesperado ao entrar.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setIsGoogleLoading(true);
//     try {
//       await authClient.signIn.social({
//         provider: "google",
//         callbackURL: "/google-callback",
//         scopes: ["email", "profile"],
//       });
//     } catch (error) {
//       console.error("Erro no login com Google:", error);
//       toast.error("Erro ao entrar com Google.");
//       setIsGoogleLoading(false);
//     }
//   };

//   return (
//     <Card className="mx-auto w-full max-w-md">
//       <CardHeader className="text-center">
//         <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
//         <CardDescription>
//           Entre na sua conta para acessar a plataforma
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-4"
//           >
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>E-mail</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Digite seu e-mail" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Senha</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="password"
//                       placeholder="Digite sua senha"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               className="flex w-full items-center justify-center gap-2"
//               disabled={isLoading || isGoogleLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
//                 </>
//               ) : (
//                 "Entrar"
//               )}
//             </Button>

//             <Button
//               variant="outline"
//               type="button"
//               className="mt-2 w-full bg-transparent"
//               onClick={handleGoogleLogin}
//               disabled={isLoading || isGoogleLoading}
//             >
//               <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
//                 <path
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   fill="#4285F4"
//                 />
//                 <path
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   fill="#34A853"
//                 />
//                 <path
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   fill="#FBBC05"
//                 />
//                 <path
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   fill="#EA4335"
//                 />
//               </svg>
//               Entrar com Google
//             </Button>
//           </form>
//         </Form>

//         <div className="mt-6 text-center">
//           <p className="text-muted-foreground text-sm">
//             Não tem uma conta?{" "}
//             <Link
//               href="/authentication"
//               className="text-primary hover:underline"
//             >
//               Criar conta
//             </Link>
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default LoginForm;

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
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import type { ExtendedUser } from "@/lib/auth-types";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

// Validação
const loginSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

// 🔹 Função auxiliar: verifica se atleta já tem campanha
async function hasActiveCampaign(userId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/check-campaign?userId=${userId}`);
    const data = await res.json();
    return data.hasActive;
  } catch {
    return false;
  }
}

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message || "Erro ao entrar. Confira seus dados.");
        setIsLoading(false);
        return;
      }

      const session = await authClient.getSession();
      const user = session?.data?.user as ExtendedUser | undefined;

      if (!user) {
        toast.error("Usuário não encontrado.");
        setIsLoading(false);
        return;
      }

      toast.success("Login realizado com sucesso!");

      // 🔹 NOVO: se for doador e veio de uma campanha, destaca o atleta
      if (user.role === "supporter") {
        const pendingAthleteId = localStorage.getItem("pendingAthleteId");
        if (pendingAthleteId) {
          localStorage.removeItem("pendingAthleteId");
          router.push(`/dash-donors?highlight=${pendingAthleteId}`);
          return;
        }
      }

      // 🔹 Fluxo padrão (mantido)
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
      console.error("Erro no login:", err);
      toast.error("Erro inesperado ao entrar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/google-callback",
        scopes: ["email", "profile"],
      });
    } catch (error) {
      console.error("Erro no login com Google:", error);
      toast.error("Erro ao entrar com Google.");
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

        <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
        <CardDescription>
          Entre na sua conta para acessar a plataforma
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
                  </FormControl>
                  <FormMessage />
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
                      placeholder="Digite sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="flex w-full items-center justify-center gap-2"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>

            <Button
              variant="outline"
              type="button"
              className="mt-2 w-full bg-transparent"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando com Google...
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
                  Entrar com Google
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Não tem uma conta?{" "}
            <Link
              href="/authentication"
              className="text-primary hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
