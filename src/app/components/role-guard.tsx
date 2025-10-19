"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { ExtendedSession } from "@/lib/auth-types";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession() as {
    data: ExtendedSession | null;
    isPending: boolean;
  };
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isPending) {
      console.log("[v0] RoleGuard: Aguardando sessão carregar...");
      return;
    }

    console.log("[v0] RoleGuard: Sessão carregada", {
      user: session?.user,
      pathname,
      role: session?.user?.role,
      emailVerified: session?.user?.emailVerified,
    });

    // Se não tem sessão, redireciona para login
    if (!session?.user) {
      console.log(
        "[v0] RoleGuard: Sem sessão, redirecionando para /authentication",
      );
      router.push("/authentication");
      return;
    }

    const user = session.user;

    // Se o usuário tem role "athlete", deve estar em /dashboard/athlete
    // Se o usuário tem role "supporter", deve estar em /dashboard/donor
    if (pathname.startsWith("/dashboard/athlete") && user.role !== "athlete") {
      console.log(
        "[v0] RoleGuard: Usuário não é atleta, redirecionando para /dashboard/donor",
      );
      router.push("/dashboard/donor");
      return;
    }

    if (pathname.startsWith("/dashboard/donor") && user.role !== "supporter") {
      console.log(
        "[v0] RoleGuard: Usuário não é apoiador, redirecionando para /dashboard/athlete",
      );
      router.push("/dashboard/athlete");
      return;
    }

    console.log("[v0] RoleGuard: Verificações OK, mostrando conteúdo");
    setIsChecking(false);
  }, [session, isPending, router, pathname]);

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
