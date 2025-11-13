"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import LoginForm from "./login-form";
import RegisterForm from "./register-form";

export default function AuthenticationPageClient() {
  const searchParams = useSearchParams();
  const [showNoAccountAlert, setShowNoAccountAlert] = useState(false);
  const [tabValue, setTabValue] = useState<"login" | "register">("login");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register") {
      setTabValue("register");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
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
                setTabValue("register");
              }}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Ok, vou criar conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs
        value={tabValue}
        onValueChange={(v) => setTabValue(v as any)}
        className="w-[400px]"
      >
        <TabsContent value="login">
          <LoginForm onNoAccount={() => setShowNoAccountAlert(true)} />
        </TabsContent>

        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
