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
import { RadioGroupItem } from "@/components/ui/radio-group";
import { FormLabel } from "@/components/ui/form";
import { toast } from "sonner";

import { setRole } from "@/app/actions/auth";

interface SelectRolePageProps {
  currentUserId: string; // ID do usuário logado
}

const SelectRolePage = ({ currentUserId }: SelectRolePageProps) => {
  const router = useRouter();
  const [role, setRoleState] = useState<"athlete" | "supporter">("supporter");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await setRole(currentUserId, role);

      toast.success("Role definida com sucesso!");

      router.push(
        role === "athlete" ? "/dashboard/athlete" : "/dashboard/donor",
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar a role. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
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
