"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPageClient() {
  const router = useRouter();
  const params = useSearchParams();
  const athleteName = params.get("athleteName");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dash-donors");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-red-50 via-white to-gray-50 text-center">
      {/* 🔹 Bolhas animadas de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="bg-primary animate-float absolute top-20 left-20 h-32 w-32 rounded-full"></div>
        <div
          className="bg-accent animate-float absolute top-40 right-32 h-24 w-24 rounded-full"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="bg-primary animate-float absolute bottom-32 left-1/4 h-20 w-20 rounded-full"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* 🔹 Conteúdo principal */}
      <div className="relative z-10 px-6">
        <h1 className="mb-4 text-3xl font-bold text-green-600">
          🎉 Obrigado pela sua doação!
        </h1>
        <p className="text-lg text-gray-800">
          Sua contribuição ajudará o atleta{" "}
          <strong>{athleteName ?? "seu atleta"}</strong> a continuar seu sonho.
        </p>
        <p className="mt-2 text-gray-600">
          Você será redirecionado em instantes para sua dashboard.
        </p>
      </div>
    </section>
  );
}
