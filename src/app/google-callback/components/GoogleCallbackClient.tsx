"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import type { ExtendedUser } from "@/lib/auth-types";

export default function GoogleCallbackClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showNoAccountAlert, setShowNoAccountAlert] = useState(false);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const sessionRes = await authClient.getSession();
        const user = sessionRes?.data?.user as ExtendedUser | undefined;

        if (!user?.email) {
          toast.error("Erro ao obter informações do usuário.");
          router.push("/authentication");
          return;
        }

        const res = await fetch(`/api/check-user-exists?email=${user.email}`);
        const data = await res.json();

        if (!data.exists) {
          await authClient.signOut();
          setShowNoAccountAlert(true);
          return;
        }

        toast.success("Login realizado com sucesso!");

        if (user.role === "admin") {
          router.push("/dashboard");
        } else if (user.role === "supporter") {
          const pendingAthleteId = localStorage.getItem("pendingAthleteId");
          if (pendingAthleteId) {
            localStorage.removeItem("pendingAthleteId");
            router.push(`/dash-donors?highlight=${pendingAthleteId}`);
            return;
          }
          router.push("/dash-donors");
        } else if (user.role === "athlete") {
          router.push("/dash-athletes");
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Erro no callback do Google:", err);
        toast.error("Erro ao processar login com Google.");
        router.push("/authentication");
      } finally {
        setIsLoading(false);
      }
    };

    handleGoogleCallback();
  }, [router]);

  if (isLoading) return null;

  return (
    <AlertDialog open={showNoAccountAlert} onOpenChange={setShowNoAccountAlert}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Conta não encontrada 🔍</AlertDialogTitle>
          <AlertDialogDescription>
            Você ainda não possui uma conta na plataforma.
            <br />
            <br />
            Crie uma conta primeiro para poder fazer login com o Google.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => router.push("/authentication?tab=register")}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Ok, vou criar conta
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
