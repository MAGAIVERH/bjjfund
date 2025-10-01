"use client";

import { useState } from "react";
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

import { authClient } from "@/lib/auth-client"; // ou API que você usa
import { setRole } from "@/lib/auth/actions"; // função backend que salva role
import { FormLabel } from "@/components/ui/form";

const SelectRolePage = async () => {
  const router = useRouter();
  const [role, setRoleState] = useState<"athlete" | "supporter">("supporter");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const currentUserId = await authClient.getCurrentUserId(); // precisa implementar
      await setRole(currentUserId, role); // salva role no banco
      toast.success("Role definida com sucesso!");

      if (role === "athlete") {
        router.push("/dashboard/athlete");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Erro ao salvar a role. Tente novamente.");
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Card className="mx-auto mt-12 max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Escolha o tipo de conta</CardTitle>
        <CardDescription>
          Para continuar, selecione se você é um atleta ou apoiador
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="supporter"
              id="supporter"
              checked={role === "supporter"}
              onChange={() => setRoleState("supporter")}
            />
            <FormLabel htmlFor="supporter">
              Apoiador - Quero apoiar atletas
            </FormLabel>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="athlete"
              id="athlete"
              checked={role === "athlete"}
              onChange={() => setRoleState("athlete")}
            />
            <FormLabel htmlFor="athlete">
              Atleta - Quero captar recursos
            </FormLabel>
          </div>
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Continuar"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SelectRolePage;
