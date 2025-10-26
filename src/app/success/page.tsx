"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
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
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
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
  );
}
