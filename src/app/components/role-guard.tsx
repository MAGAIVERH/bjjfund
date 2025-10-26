"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { ExtendedSession } from "@/lib/auth-types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // ✅ permite limitar o acesso por role
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession() as {
    data: ExtendedSession | null;
    isPending: boolean;
  };

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isPending) {
      console.log("[RoleGuard] Aguardando sessão carregar...");
      return;
    }

    const user = session?.user;

    // 🔒 Se não tem sessão → login
    if (!user) {
      console.log(
        "[RoleGuard] Sem sessão, redirecionando para /authentication",
      );
      router.push("/authentication");
      return;
    }

    const role = user.role ?? ""; // ✅ garante que nunca é undefined

    console.log("[RoleGuard] Sessão carregada", {
      user: user?.name,
      role,
      path: pathname,
    });

    // ✅ Verifica se o papel do usuário é permitido
    if (allowedRoles && !allowedRoles.includes(role)) {
      console.warn(
        `[RoleGuard] Acesso negado: '${role}' não está em ${allowedRoles}`,
      );

      // comportamento padrão → redireciona para o dashboard correto
      if (role === "athlete") router.push("/dashboard/athlete");
      else if (role === "supporter") router.push("/dashboard/donor");
      else router.push("/");

      return;
    }

    // 🔐 Mantém as regras antigas (dashboards)
    if (pathname.startsWith("/dashboard/athlete") && role !== "athlete") {
      console.log(
        "[RoleGuard] Usuário não é atleta, redirecionando para /dashboard/donor",
      );
      router.push("/dashboard/donor");
      return;
    }

    if (pathname.startsWith("/dashboard/donor") && role !== "supporter") {
      console.log(
        "[RoleGuard] Usuário não é apoiador, redirecionando para /dashboard/athlete",
      );
      router.push("/dashboard/athlete");
      return;
    }

    setIsChecking(false);
  }, [session, isPending, router, pathname, allowedRoles]);

  if (isPending || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
