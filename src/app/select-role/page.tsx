"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import type { ExtendedSession } from "@/lib/auth-types";

const SelectRolePage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession() as {
    data: ExtendedSession | null;
    isPending: boolean;
  };
  const [role, setRoleState] = useState<"athlete" | "supporter">("supporter");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isPending) {
      console.log("[v0] Session is loading...");
      return;
    }

    console.log("[v0] Session loaded:", {
      hasUser: !!session?.user,
      userId: session?.user?.id,
      role: session?.user?.role,
      emailVerified: session?.user?.emailVerified,
      name: session?.user?.name,
    });

    if (!session?.user) {
      console.log("[v0] No session found, redirecting to authentication");
      toast.error("Faça login primeiro");
      router.push("/authentication");
      return;
    }

    if (session.user.role === "athlete") {
      console.log("[v0] User is athlete, redirecting to athlete dashboard");
      router.push("/dash-athletes");
      return;
    }

    console.log("[v0] User needs to select role, showing selection page");
  }, [session, isPending, router]);

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast.error("Usuário não encontrado");
      return;
    }

    setIsLoading(true);

    try {
      console.log("[v0] Submitting role selection:", {
        userId: session.user.id,
        role,
      });

      const res = await fetch("/api/select-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar");
      }

      console.log("[v0] Role saved successfully");
      toast.success("Conta configurada!");

      // Isso faz o servidor buscar a sessão atualizada do banco de dados
      const targetUrl = role === "athlete" ? "/dash-athletes" : "/dash-donors";
      console.log("[v0] Redirecting to:", targetUrl);

      // Usa window.location.href para forçar um reload completo da página
      window.location.href = targetUrl;
    } catch (err: any) {
      console.error("[v0] Error saving role:", err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">
            Bem-vindo ao BJJ Fund! 🥋
          </CardTitle>
          <CardDescription className="text-base">
            Olá <strong>{session.user.name}</strong>! Escolha o tipo de conta
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <RadioGroup
            value={role}
            onValueChange={(val: "athlete" | "supporter") => setRoleState(val)}
            className="space-y-4"
          >
            <div
              className={`flex cursor-pointer items-start space-x-3 rounded-lg border-2 p-4 transition-all ${
                role === "supporter"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => setRoleState("supporter")}
            >
              <RadioGroupItem
                value="supporter"
                id="supporter"
                className="mt-1"
              />
              <div className="flex-1">
                <label
                  htmlFor="supporter"
                  className="block cursor-pointer text-sm font-semibold"
                >
                  💙 Apoiador
                </label>
                <p className="mt-1 text-xs text-gray-600">
                  Quero apoiar atletas
                </p>
              </div>
            </div>

            <div
              className={`flex cursor-pointer items-start space-x-3 rounded-lg border-2 p-4 transition-all ${
                role === "athlete"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => setRoleState("athlete")}
            >
              <RadioGroupItem value="athlete" id="athlete" className="mt-1" />
              <div className="flex-1">
                <label
                  htmlFor="athlete"
                  className="block cursor-pointer text-sm font-semibold"
                >
                  🥋 Atleta
                </label>
                <p className="mt-1 text-xs text-gray-600">
                  Quero captar recursos
                </p>
              </div>
            </div>
          </RadioGroup>

          <Button
            className="h-11 w-full text-base font-semibold"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Continuar →"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectRolePage;
