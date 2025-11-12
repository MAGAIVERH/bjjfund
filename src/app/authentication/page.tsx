"use client";

import { useEffect, useState } from "react";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useSearchParams } from "next/navigation";

export default function AuthenticationPage() {
  const searchParams = useSearchParams(); // 🔥 Hook para ler parâmetros da URL
  const [showNoAccountAlert, setShowNoAccountAlert] = useState(false);
  const [tabValue, setTabValue] = useState("login");

  // 🔥 Verifica se tem ?tab=register na URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register") {
      setTabValue("register");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 🔹 Alert Dialog */}
      <AlertDialog
        open={showNoAccountAlert}
        onOpenChange={setShowNoAccountAlert}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Conta não encontrada 🔍</AlertDialogTitle>
            <AlertDialogDescription>
              Você ainda não possui uma conta na plataforma.
              <br />
              <br />
              Crie uma conta primeiro para poder fazer login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowNoAccountAlert(false);
                setTabValue("register"); // 👈 muda pra aba "Criar conta"
              }}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Ok, vou criar conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 🔹 Tabs */}
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-[400px]">
        <TabsContent value="login">
          {/* 👇 Passa a função pra abrir o alerta quando não existir conta */}
          <LoginForm onNoAccount={() => setShowNoAccountAlert(true)} />
        </TabsContent>

        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
